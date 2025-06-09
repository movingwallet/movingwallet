import { Router, Request, Response } from "express";

const router = Router();

router.get("/estado", (_req: Request, res: Response) => {
  res.json({ status: "✅ OK - GPT-backend en funcionamiento" });
});

export default router;
