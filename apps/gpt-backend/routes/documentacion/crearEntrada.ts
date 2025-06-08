import express, { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

router.post("/documentacion/crear", async (req: Request, res: Response) => {
  const { nombreArchivo, contenido } = req.body;

  if (!nombreArchivo || !contenido) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const rutaFinal = path.join("data/actualizados", nombreArchivo);
    await fs.writeFile(rutaFinal, contenido, "utf-8");

    res.json({ mensaje: "✅ Archivo creado", archivo: rutaFinal });
  } catch (err) {
    console.error("❌ Error al crear entrada de documentación:", err);
    res.status(500).json({ error: "Error al guardar el archivo" });
  }
});

export default router;
