import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

router.post("/crear-entrada", async (req, res) => {
  const { archivo, texto } = req.body;

  if (!archivo || !texto) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  try {
    const ruta = path.resolve(__dirname, "../../data/docs/md", archivo);
    fs.appendFileSync(ruta, `\n${texto}`);
    res.json({ archivo, texto, status: "✅ Entrada añadida correctamente" });
  } catch (error) {
    console.error("❌ Error al crear entrada:", error);
    res.status(500).json({ error: "Error escribiendo el archivo" });
  }
});

export default router;
