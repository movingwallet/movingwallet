import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/api/google-doc", async (req, res) => {
  const { docId } = req.body;

  if (!docId) {
    return res.status(400).json({ error: "Falta el ID del documento" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/documents.readonly"]
    });

    const docs = google.docs({ version: "v1", auth });

    const result = await docs.documents.get({ documentId: docId });

    const contenido = result.data.body?.content
      ?.map(el => el.paragraph?.elements?.map(e => e.textRun?.content).join("") ?? "")
      .join("\n");

    res.json({
      status: "✅ Documento leído correctamente",
      docId,
      contenido: contenido?.slice(0, 1000) + "..."
    });
  } catch (error) {
    res.status(500).json({ error: "Error al acceder al documento", detalle: error.message });
  }
});

export default router;
