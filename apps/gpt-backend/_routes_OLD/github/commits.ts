import { Router, Request, Response } from "express";
import simpleGit from "simple-git";

const router = Router();

router.get("/github/commits", async (req: Request, res: Response) => {
  try {
    const git = simpleGit();
    const log = await git.log({ maxCount: 10 });
    res.json({ commits: log.all });
  } catch (error) {
    console.error("❌ Error al obtener commits:", error);
    res.status(500).json({
      error: "Error al obtener commits del repositorio",
      detalles: (error as Error).message
    });
  }
});

export default router;
