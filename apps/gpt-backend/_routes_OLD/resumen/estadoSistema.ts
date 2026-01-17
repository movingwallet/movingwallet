import { Router, Request, Response } from "express";
import { loadEnv } from "../../config/schema.env";
import { getCircuitState } from "../../lib/openaiCircuitBreaker";
import { snapshotMetrics } from "../../lib/metrics";

const router = Router();

router.get("/resumen/estado-sistema", (req: Request, res: Response) => {
  try {
    const env = loadEnv();
    const traceId = (req as any).traceId;
    const envLoadedFrom = (req.app as any)?.locals?.envLoadedFrom ?? ["process.env"];

    const estado = {
      entorno: env.NODE_ENV || "desconocido",
      envLoadedFrom,
      mongoUri: env.MONGO_URI ? "✅ definido" : "❌ no definido",
      openaiKey: env.OPENAI_API_KEY ? "✅ definido" : "❌ no definido",
      openaiModel: (env as any).OPENAI_MODEL || "",
      openaiBaseURL: (env as any).OPENAI_BASE_URL || "",
      tokensApi: (env.API_TOKENS || "").split(",").filter(Boolean).length,
      circuit: getCircuitState(),
      metrics: snapshotMetrics(),
      traceId,
    };

    res.json({ estado });
  } catch (error) {
    console.error("❌ Error al obtener estado del sistema:", error);
    res.status(500).json({
      error: "Error interno al obtener estado del sistema",
      detalles: (error as Error).message,
      traceId: (req as any).traceId,
    });
  }
});

export default router;
