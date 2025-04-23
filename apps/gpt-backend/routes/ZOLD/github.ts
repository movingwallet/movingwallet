import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * POST /api/github-file
 * Body: { url: string }
 */
router.post("/github-file", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith("https://raw.githubusercontent.com/")) {
    return res.status(400).json({ error: "URL inválida o no permitida." });
  }

  try {
    const response = await axios.get(url);
    return res.json({ contenido: response.data });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo recuperar el archivo desde GitHub." });
  }
});

export default router;
