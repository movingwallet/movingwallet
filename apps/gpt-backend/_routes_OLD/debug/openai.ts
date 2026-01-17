import { Router, Request, Response } from "express";
import { loadEnv } from "../../config/schema.env";
import { getCircuitState } from "../../lib/openaiCircuitBreaker";
import { snapshotMetrics } from "../../lib/metrics";

const router = Router();

router.get("/debug/openai", (req: Request, res: Response) => {
  const env = loadEnv();
  const traceId = (req as any).traceId;
  const envLoadedFrom = (req.app as any)?.locals?.envLoadedFrom ?? ["process.env"];

  const key = env.OPENAI_API_KEY || "";

  res.json({
    traceId,
    envLoadedFrom,
    openai: {
      keyPrefix: key.slice(0, 10),
      keyLength: key.length,
      hasSpaces: /\s/.test(key),
      model: (env as any).OPENAI_MODEL || "",
      baseURL: (env as any).OPENAI_BASE_URL || "",
    },
    circuit: getCircuitState(),
    metrics: snapshotMetrics(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
