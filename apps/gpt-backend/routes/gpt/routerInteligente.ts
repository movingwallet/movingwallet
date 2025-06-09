import { Router, Request, Response } from "express";

const router = Router();

router.post("/gpt/router-inteligente", async (req: Request, res: Response) => {
  const { tipo, datos } = req.body;

  if (!tipo) {
    return res.status(400).json({ error: "Falta el tipo de acción a ejecutar" });
  }

  try {
    // Este router delegará lógicamente a distintas acciones según el tipo
    switch (tipo) {
      case "resumen-github":
        return res.json({ mensaje: "Ejecutar resumen de GitHub (dummy)" });
      case "migrar-docs":
        return res.json({ mensaje: "Migración de documentación (dummy)" });
      default:
        return res.status(400).json({ error: `Tipo desconocido: ${tipo}` });
    }
  } catch (error) {
    console.error("❌ Error en el router inteligente GPT:", error);
    res.status(500).json({
      error: "Error interno en router GPT",
      detalles: (error as Error).message,
    });
  }
});

export { router as routerInteligenteRoute };
