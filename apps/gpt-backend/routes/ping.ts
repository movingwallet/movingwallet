import { Router, Request, Response } from "express";
const router = Router();

router.post("/ping", (_req: Request, res: Response) => {
  res.json({ respuesta: "pong" });
});

export default router;
