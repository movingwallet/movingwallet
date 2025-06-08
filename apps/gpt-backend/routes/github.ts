import express, { Request, Response } from "express";
import { getUltimoCommit } from "../../../apps/gpt-backend/actions/github/getCommits";

const router = express.Router();

router.get("/github/ultimo-commit", async (_req: Request, res: Response) => {
  try {
    // Ajustamos con un argumento por defecto (ej. rama "main")
    const resultado = await getUltimoCommit("main");
    res.json(resultado);
  } catch (err) {
    console.error("❌ Error al obtener el último commit:", err);
    res.status(500).json({ error: "Error al obtener último commit" });
  }
});

export default router;
