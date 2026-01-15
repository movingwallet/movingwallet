import { Router, Request, Response } from "express";
import { obtenerCommitsRepositorio } from "@/actions/github/obtenerCommitsRepositorio";
import validateApiToken from "@/middleware/auth";

const router = Router();

router.post("/github/commits", validateApiToken, async (req: Request, res: Response) => {
  const { repoFullName, limit } = req.body;

  if (!repoFullName) {
    return res.status(400).json({ error: "Falta el campo 'repoFullName'" });
  }

  try {
    const commits = await obtenerCommitsRepositorio(repoFullName, limit || 10);
    res.json({ commits });
  } catch (error) {
    console.error("❌ Error al obtener commits:", error);
    res.status(500).json({ error: "Error interno al obtener commits" });
  }
});

export default router;


