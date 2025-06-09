import { Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/resumen/estado-sistema", (_req: Request, res: Response) => {
  try {
    const estado = {
      entorno: process.env.NODE_ENV || "desconocido",
      mongoUri: process.env.MONGO_URI ? "✅ definido" : "❌ no definido",
      pineconeKey: process.env.PINECONE_API_KEY ? "✅ definido" : "❌ no definido",
      openaiKey: process.env.OPENAI_API_KEY ? "✅ definido" : "❌ no definido",
      tokensApi: (process.env.API_TOKENS || "").split(",").length,
    };

    res.json({ estado });
  } catch (error) {
    console.error("❌ Error al obtener estado del sistema:", error);
    res.status(500).json({
      error: "Error interno al obtener estado del sistema",
      detalles: (error as Error).message,
    });
  }
});

export default router;
