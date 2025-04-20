import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/api/pitch", async (req, res) => {
  const docPath = path.resolve(__dirname, "../../../docs/md/documentacion_tecnica_movingwallet.md");

  try {
    const texto = fs.existsSync(docPath)
      ? fs.readFileSync(docPath, "utf8")
      : "⚠️ Archivo no encontrado.";

    const resumen = `
📢 MovingWallet Pitch Técnico:
------------------------------
✅ Plataforma multicadena con integración de IA.
🧠 Análisis inteligente y automatización de gestión de activos.
🔗 Conexión no-custodial vía WalletConnect.
🛠️ Stack: React, TailwindCSS, FastAPI, OpenAI, Pinecone, Zustand, Alchemy SDK.
🔄 Migración de portafolios multi-cuenta en 1 clic.

Resumen del documento técnico:
------------------------------
${texto.slice(0, 500)}...
    `;

    res.json({ pitch: resumen });
  } catch (error) {
    res.status(500).json({ error: "No se pudo generar el pitch técnico" });
  }
});

export default router;
