import express from "express";

const router = express.Router();

/**
 * Endpoint POST /api/gpt/github-resumen
 * Requiere body: { repo: string, branch: string }
 */
router.post("/gpt/github-resumen", async (req, res) => {
  try {
    const { repo, branch } = req.body;

    if (!repo || !branch) {
      return res.status(400).json({ error: "Faltan parámetros: repo o branch" });
    }

    // Aquí se haría una petición real a GitHub y luego resumen GPT
    const resumen = `🔍 Resumen simulado de la rama '${branch}' en el repositorio '${repo}'`;

    return res.json({ resumen });
  } catch (error) {
    console.error("❌ Error en /gpt/github-resumen:", error);
    return res.status(500).json({ error: "Error al generar resumen de GitHub" });
  }
});

export default router;
