import { Router, Request, Response } from "express";
import { loadEnv } from "../../config/schema.env";
import {
  envVarForProvider,
  getAiProviderConfig,
  validateProviderKey,
} from "../../actions/gpt/aiProvider";
import { canCallOpenAI } from "../../lib/openaiCircuitBreaker";

const router = Router();

/**
 * GET /api/debug/ai
 * - No devuelve secretos (solo prefix/tail)
 * - Útil para CI y troubleshooting
 */
router.get("/debug/ai", (_req: Request, res: Response) => {
  const env = loadEnv();

  const cfg = getAiProviderConfig();
  const expectedEnvVar = envVarForProvider(cfg.provider);
  const keyCheck = validateProviderKey(cfg.provider, cfg.apiKey);

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
      reason: keyCheck.reason || null,
    },
    openai: {
      baseURL: env.OPENAI_BASE_URL || null,
      model: effectiveModel,
      circuitBreaker: {
        canCall: canCallOpenAI(),
        state: canCallOpenAI() ? "closed" : "open",
      },
    },
    note:
      cfg.provider !== "openai"
        ? `AI_PROVIDER="${cfg.provider}" está configurado, pero ejecutarPromptGPT() aún solo implementa OpenAI.`
        : null,
  });
});

export default router;
