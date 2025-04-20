import express from "express";
const router = express.Router();

// Simulación para demo inicial
router.post("/api/verificar", async (req, res) => {
  const { accion, resultadoEsperado } = req.body;

  if (!accion || !resultadoEsperado) {
    return res.status(400).json({ error: "Faltan campos: accion o resultadoEsperado" });
  }

  // Lógica dummy por ahora: simula verificación exitosa
  return res.json({
    status: "✅ Verificación exitosa",
    accion,
    resultadoEsperado
  });
});

export default router;
