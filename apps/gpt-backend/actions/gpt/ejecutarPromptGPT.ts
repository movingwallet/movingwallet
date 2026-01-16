import OpenAI from "openai";
import { loadEnv } from "@/config/schema.env";
import {
  canCallOpenAI,
  recordFailure,
  recordSuccess,
} from "@/lib/openaiCircuitBreaker";

let _client: OpenAI | null = null;

function sanitizeKey(raw: string) {
  return raw.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").trim();
}

function getClient() {
  if (_client) return _client;

  const env = loadEnv();
  const key = sanitizeKey(env.OPENAI_API_KEY || "");

  if (!key || !key.startsWith("sk-")) {
    throw Object.assign(new Error("OPENAI_API_KEY inválida o no definida"), {
      status: 401,
      code: "invalid_api_key",
    });
  }

  _client = new OpenAI({
    apiKey: key,
    baseURL: env.OPENAI_BASE_URL || undefined,
  });

  return _client;
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
  const client = getClient();

  if (!canCallOpenAI()) {
    throw Object.assign(new Error("OpenAI circuit breaker OPEN"), {
      status: 503,
      code: "openai_circuit_open",
    });
  }

  const model = meta.model || env.OPENAI_MODEL || "gpt-4o-mini";
  const temperature = typeof meta.temperature === "number" ? meta.temperature : 0.2;

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
