import OpenAI from "openai";
import { loadEnv } from "@/config/schema.env";
import {
  canCallOpenAI,
  recordFailure,
  recordSuccess,
} from "@/lib/openaiCircuitBreaker";

import {
  getAiProviderConfig,
  validateProviderKey,
} from "@/actions/gpt/aiProvider";

let _openaiClient: OpenAI | null = null;

function sanitizeKey(raw: string) {
  return raw.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").trim();
}

function getOpenAIClient() {
  if (_openaiClient) return _openaiClient;

  const env = loadEnv();

  const cfg = getAiProviderConfig();
  if (cfg.provider !== "openai") {
    throw Object.assign(
      new Error(
        `AI_PROVIDER="${cfg.provider}" aún no está implementado en ejecutarPromptGPT().`
      ),
      { status: 501, code: "ai_provider_not_implemented" }
    );
  }

  const key = sanitizeKey(cfg.apiKey || "");
  const keyCheck = validateProviderKey("openai", key);

  if (!keyCheck.ok) {
    throw Object.assign(new Error(keyCheck.reason || "OPENAI_API_KEY inválida"), {
      status: 401,
      code: "invalid_api_key",
    });
  }

  _openaiClient = new OpenAI({
    apiKey: key,
    baseURL: env.OPENAI_BASE_URL || undefined,
  });

  return _openaiClient;
}

type PromptMeta = {
  model?: string;
  temperature?: number;
};

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function ejecutarPromptGPT(prompt: string, meta: PromptMeta = {}) {
  const env = loadEnv();
  const cfg = getAiProviderConfig();

  // Por ahora solo OpenAI está implementado aquí.
  // Esto deja preparado el sistema para añadir providers rápido y con cambios controlados.
  if (cfg.provider !== "openai") {
    throw Object.assign(
      new Error(
        `AI_PROVIDER="${cfg.provider}" configurado pero aún no implementado en ejecutarPromptGPT().`
      ),
      {
        status: 501,
        code: "ai_provider_not_implemented",
        provider: cfg.provider,
      }
    );
  }

  const client = getOpenAIClient();

  if (!canCallOpenAI()) {
    throw Object.assign(new Error("OpenAI circuit breaker OPEN"), {
      status: 503,
      code: "openai_circuit_open",
    });
  }

  const model = meta.model || env.OPENAI_MODEL || "gpt-4o-mini";
  const temperature =
    typeof meta.temperature === "number" ? meta.temperature : 0.2;

  let lastError: any;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature,
        messages: [
          { role: "system", content: "Eres un asistente útil y conciso." },
          { role: "user", content: prompt },
        ],
      });

      recordSuccess();
      return (completion.choices?.[0]?.message?.content || "").trim();
    } catch (error: any) {
      lastError = error;
      recordFailure();

      const status = error?.status;

      if (status === 429 || (status >= 500 && status <= 599)) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(
          `🔁 Retry OpenAI (${attempt}/${MAX_RETRIES}) status=${status} delay=${delay}ms`
        );
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}
