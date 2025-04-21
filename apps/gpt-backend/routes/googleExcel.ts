import { Router } from "express";
const router = Router();

router.post("/google-excel", async (req, res) => {
  const { tarea, prioridad, fecha } = req.body;
  if (!tarea || !prioridad || !fecha) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  console.log("📥 Tarea recibida:", { tarea, prioridad, fecha });

  // Aquí iría integración real con Google Sheets (fase futura)
  res.json({ status: "Tarea agregada (mock)", tarea });
});

export default router;
