import { Router, Request, Response } from "express";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

router.post("/pinecone/buscar", async (req: Request, res: Response) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: "Texto de búsqueda no proporcionado" });
  }

  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX!);

    const resultado = await index.query({
      topK: 5,
      vector: new Array(1536).fill(0), // Placeholder, debería usarse una función de embedding real
      includeMetadata: true,
    });

    res.json({ resultado });
  } catch (error) {
    console.error("❌ Error al buscar en Pinecone:", error);
    res.status(500).json({
      error: "Error interno al buscar",
      detalles: (error as Error).message,
    });
  }
});

export default router;
