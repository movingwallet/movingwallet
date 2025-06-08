import express, { Request, Response } from "express";

const router = express.Router();

router.get("/ping", (_req: Request, res: Response) => {
  res.json({ status: "pong", timestamp: new Date().toISOString() });
});

export default router;
