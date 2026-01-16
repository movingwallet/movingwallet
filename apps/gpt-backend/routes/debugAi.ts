import type { Request, Response } from "express";
import { loadEnv } from "@/config/schema.env";
import {
  envVarForProvider,
  getAiProviderConfig,
  validateProviderKey,
} from "@/actions/gpt/aiProvider";
import { canCallOpenAI } from "@/lib/openaiCircuitBreaker";

/**
 * GET /api/debug/ai
 * Diagnostic endpoint:
 * - provider
 * - expected env var
 * - hasKey + safe key prefix/tail
 * - model/baseURL (OpenAI-specific envs kept for now)
 * - circuit breaker status (OpenAI)
 *
 * IMPORTANT:
 * - Never returns full secrets.
 * - Designed for CI + troubleshooting.
 */
export function debugAiHandler(_req: Request, res: Response) {
  const env = loadEnv();

  const cfg = getAiProviderConfig();
  const expectedEnvVar = envVarForProvider(cfg.provider);

  const keyCheck = validateProviderKey(cfg.provider, cfg.apiKey);

  // Circuit breaker is currently OpenAI-specific in this repo.
  const circuit = {
    provider: "openai",
    canCall: canCallOpenAI(),
    state: canCallOpenAI() ? "closed" : "open",
  };

  // "Effective model" for current implementation (OpenAI only today).
  const effectiveModel = env.OPENAI_MODEL || "gpt-4o-mini";

  return res.status(200).json({
    status: "ok",
    provider: cfg.provider,
    expectedEnvVar,
    hasKey: cfg.hasKey,
    keyPrefix: cfg.keyPrefix,
    keyTail: cfg.keyTail,
    keyCheck: {
      ok: keyCheck.ok,
      // reason can be helpful; it's not sensitive
      reason: keyCheck.reason || null,
    },
    openai: {
      // We keep OpenAI section because current implementation uses OpenAI only.
      baseURL: env.OPENAI_BASE_URL || null,
      model: effectiveModel,
    },
    circuitBreaker: circuit,
    note:
      cfg.provider !== "openai"
        ? `AI_PROVIDER="${cfg.provider}" está configurado, pero ejecutarPromptGPT() aún solo implementa OpenAI.`
        : null,
  });
}
