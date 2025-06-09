import { Router, Request, Response } from "express";

const router = Router();

router.get("/estado", (req: Request, res: Response) => {
  res.json({ estado: "activo", timestamp: new Date().toISOString() });
});

export default router;
