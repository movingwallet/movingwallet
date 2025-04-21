import { Router } from "express";
const router = Router();

router.post("/verificar", async (req, res) => {
  const { accion, resultadoEsperado } = req.body;
  if (!accion || !resultadoEsperado) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  console.log("✅ Verificando resultado esperado para:", accion);

  // Aquí se haría validación real con GitHub, Pinecone, etc.
  const status = "ok (mock)";

  res.json({ status, accion });
});

export default router;
