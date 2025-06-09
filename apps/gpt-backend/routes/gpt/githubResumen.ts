import { Router, Request, Response } from "express";
import { generarResumenRepositorio } from "@/actions/github/generarResumenRepositorio";

const router = Router();

router.post("/gpt/github-resumen", async (req: Request, res: Response) => {
  const { repoFullName } = req.body;

  if (!repoFullName) {
    return res.status(400).json({ error: "Falta el nombre del repositorio" });
  }

  try {
    const resumen = await generarResumenRepositorio(repoFullName);
    res.json({ resumen });
  } catch (error) {
    console.error("❌ Error al generar resumen:", error);
    res.status(500).json({
      error: "Error interno al generar resumen",
      detalles: (error as Error).message,
    });
  }
});

export default router;
