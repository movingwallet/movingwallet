import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/api/resumen", async (req, res) => {
  const archivos = [
    "documentacion_tecnica_movingwallet.md",
    "roadmap_funcional.md",
    "resumen_objetivos.md",
    "acciones_gpts.md"
  ];

  const basePath = path.resolve(__dirname, "../../../docs/md");

  try {
    const contenidos = archivos.map(nombre => {
      const ruta = path.join(basePath, nombre);
      if (fs.existsSync(ruta)) {
        return fs.readFileSync(ruta, "utf8");
      } else {
        return `⚠️ Archivo no encontrado: ${nombre}`;
      }
    });

    const resumen = `📘 Resumen técnico (simulado):\n\nIncluye ${archivos.length} archivos.\n\n` +
      contenidos.map((c, i) => `→ Archivo ${i + 1}:\n${c.slice(0, 300)}...\n\n`).join("");

    res.json({ resumen });
  } catch (error) {
    res.status(500).json({ error: "No se pudo generar el resumen" });
  }
});

export default router;
