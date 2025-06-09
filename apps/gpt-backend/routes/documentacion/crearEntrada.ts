import { Router, Request, Response } from "express";
import LogModel from "@/logs/Log";

const router = Router();

router.post("/documentacion/crear-entrada", async (req: Request, res: Response) => {
  const { titulo, contenido, autor } = req.body;

  if (!titulo || !contenido || !autor) {
    return res.status(400).json({ error: "Faltan campos requeridos: titulo, contenido o autor" });
  }

  try {
    await LogModel.create({
      tipo: "documentacion",
      origen: "crearEntrada",
      descripcion: `Entrada creada por ${autor}: ${titulo}`,
      payload: { titulo, contenido, autor }
    });

    res.json({ mensaje: "Entrada creada y log registrada" });
  } catch (error) {
    console.error("❌ Error al crear entrada de documentación:", error);
    res.status(500).json({
      error: "Error interno al crear entrada",
      detalles: (error as Error).message,
    });
  }
});

export default router;
