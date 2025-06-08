import { Router } from "express";
import { buscarDocumentos } from "../../actions/pinecone/buscarDocumentos";

const router = Router();

router.post("/buscar-pinecone", async (req, res) => {
  const { query, topK = 5 } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Falta el campo 'query'" });
  }

  try {
    const resultados = await buscarDocumentos(query, topK);
    res.json({ resultados });
  } catch (error) {
    console.error("❌ Error en /buscar-pinecone:", error);
    res.status(500).json({
      error: "Error interno en la búsqueda Pinecone",
      detalles: (error as Error).message,
    });
  }
});

export default router;
