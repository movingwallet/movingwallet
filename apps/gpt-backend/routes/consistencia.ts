import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/api/consistencia", async (req, res) => {
  const archivos = [
    "resumen_objetivos.md",
    "roadmap_funcional.md",
    "acciones_gpts.md"
  ];

  const basePath = path.resolve(__dirname, "../../../docs/md");

  try {
    const textos = archivos.map(nombre => {
      const ruta = path.join(basePath, nombre);
      return fs.existsSync(ruta) ? fs.readFileSync(ruta, "utf8") : "";
    });

    // Lógica simulada: verificar si todos contienen la palabra "IA"
    const contienenIA = textos.every(texto => texto.toLowerCase().includes("ia"));

    res.json({
      consistencia: contienenIA ? "✅ Documentación alineada con objetivos (IA presente en todos)" : "⚠️ Inconsistencias detectadas",
      archivos: archivos
    });
  } catch (error) {
    res.status(500).json({ error: "Error al verificar consistencia" });
  }
});

export default router;
