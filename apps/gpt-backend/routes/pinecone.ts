import express from "express";
const router = express.Router();

// Simulación simple
const documentos = [
  { id: "doc1", contenido: "MovingWallet es una app multichain para portafolios" },
  { id: "doc2", contenido: "Incluye integración con IA para sugerencias de migración" },
  { id: "doc3", contenido: "Se usa React, Tailwind y WalletConnect v2" }
];

router.post("/api/pinecone", async (req, res) => {
  try {
    const { pregunta } = req.body;

    if (!pregunta || pregunta.length < 3) {
      return res.status(400).json({ error: "Consulta inválida" });
    }

    const resultado = documentos.find(doc =>
      doc.contenido.toLowerCase().includes(pregunta.toLowerCase())
    );

    if (!resultado) {
      return res.json({ respuesta: "No se encontró contenido relacionado." });
    }

    return res.json({ respuesta: `🔎 Resultado: ${resultado.contenido}` });
  } catch (error) {
    return res.status(500).json({ error: "Error consultando embeddings" });
  }
});

export default router;
