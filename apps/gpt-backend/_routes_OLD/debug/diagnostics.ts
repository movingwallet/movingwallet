import { Router, Request, Response } from "express";
import { loadEnv } from "../../config/schema.env";
import { getCircuitState } from "../../lib/openaiCircuitBreaker";
import { snapshotMetrics } from "../../lib/metrics";

const router = Router();

router.get("/debug/diagnostics", (req: Request, res: Response) => {
  const env = loadEnv();
  const traceId = (req as any).traceId;
  const envLoadedFrom = (req.app as any)?.locals?.envLoadedFrom ?? ["process.env"];

  const key = env.OPENAI_API_KEY || "";

  res.json({
    traceId,
    envLoadedFrom,
    env: {
      NODE_ENV: env.NODE_ENV,
      PORT: env.PORT,
      API_TOKENS_count: (env.API_TOKENS || "").split(",").filter(Boolean).length,
      MONGO_URI_defined: !!env.MONGO_URI,
      OPENAI_API_KEY_prefix: key.slice(0, 10),
      OPENAI_API_KEY_len: key.length,
      OPENAI_MODEL: (env as any).OPENAI_MODEL || "",
      OPENAI_BASE_URL: (env as any).OPENAI_BASE_URL || "",
    },
    circuit: getCircuitState(),
    metrics: snapshotMetrics(),
    runtime: {
      pid: process.pid,
      uptimeSec: Math.round(process.uptime()),
      node: process.version,
      memory: process.memoryUsage(),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
