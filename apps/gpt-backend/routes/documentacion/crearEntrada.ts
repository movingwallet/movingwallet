import { Router, Request, Response } from "express";

const router = Router();

router.post("/documentacion/crear", async (req: Request, res: Response) => {
  try {
    const { titulo, contenido } = req.body;

    if (!titulo || !contenido) {
      return res.status(400).json({
        error: "Faltan campos requeridos: 'titulo' y 'contenido'",
      });
    }

    res.json({ message: `📄 Entrada '${titulo}' creada (dummy)` });
  } catch (error) {
    console.error("❌ Error al crear entrada:", error);
    res.status(500).json({
      error: "Error al crear entrada",
      detalles: (error as Error).message,
    });
  }
});

export default router;
