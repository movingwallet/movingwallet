import express from "express";
const router = express.Router();

// Esta versión es solo una simulación, ideal para pruebas
router.post("/api/reintentar", async (req, res) => {
  const { nombreAccion, input } = req.body;

  if (!nombreAccion || !input) {
    return res.status(400).json({ error: "Faltan campos: nombreAccion o input" });
  }

  // Simulación de reintento
  return res.json({
    status: "🔁 Acción reenviada (simulado)",
    nombreAccion,
    input
  });
});

export default router;
