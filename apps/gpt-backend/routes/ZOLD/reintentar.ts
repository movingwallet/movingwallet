import { Router } from "express";
const router = Router();

router.post("/reintentar", async (req, res) => {
  const { nombreAccion, input } = req.body;
  if (!nombreAccion || !input) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  console.log(`🔁 Reintentando acción ${nombreAccion} con input:`, input);

  // Mock temporal: solo devuelve el input recibido
  res.json({ status: "reintentado (mock)", nombreAccion, input });
});

export default router;
