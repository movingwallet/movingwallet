import { Router } from "express";
import { loadEnv } from "@/config/schema.env";
import { getCircuitState } from "@/lib/openaiCircuitBreaker";

const router = Router();

router.get("/debug/openai", (_req, res) => {
  const env = loadEnv();

  res.json({
    openai: {
      keyPrefix: (env.OPENAI_API_KEY || "").slice(0, 10),
      keyLength: (env.OPENAI_API_KEY || "").length,
      model: env.OPENAI_MODEL,
      baseURL: env.OPENAI_BASE_URL || "",
      hasSpaces: /\s/.test(env.OPENAI_API_KEY || ""),
    },
    circuit: getCircuitState(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
