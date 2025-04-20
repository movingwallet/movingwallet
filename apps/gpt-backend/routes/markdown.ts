import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/leer-md", (req, res) => {
  const { archivo } = req.body;

  if (!archivo || typeof archivo !== "string") {
    return res.status(400).json({ error: "Falta el campo 'archivo'" });
  }

  const basePath = path.resolve(__dirname, "../../../docs/md");
  const filePath = path.join(basePath, archivo);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }

  const contenido = fs.readFileSync(filePath, "utf-8");
  res.json({ contenido });
});

export default router;
