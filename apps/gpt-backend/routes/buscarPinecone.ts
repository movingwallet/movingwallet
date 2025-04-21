import { Router } from "express";
import { buscarDocumentosConEmbeddings } from "../actions/pinecone/buscarDocumentos";

const router = Router();

router.post("/pinecone", async (req, res) => {
  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: "Falta la pregunta" });
  }

  try {
    const respuesta = await buscarDocumentosConEmbeddings(pregunta);
    res.json({ respuesta });
  } catch (error) {
    console.error("❌ Error en /pinecone:", error);
    res.status(500).json({ error: "Error interno en la búsqueda Pinecone" });
  }
});

export default router;
