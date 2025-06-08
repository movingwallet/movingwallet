import express, { Request, Response } from "express";

const router = express.Router();

router.get("/google-doc", (_req: Request, res: Response) => {
  res.json({ mensaje: "📄 Endpoint para Google Docs en construcción" });
});

export default router;
