import express, { Request, Response } from "express";
import LogModel from "../models/Log";

const router = express.Router();

router.get("/logs.json", async (_req: Request, res: Response) => {
  try {
    const logs = await LogModel.find().sort({ creadoEn: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    console.error("❌ Error al obtener logs:", err);
    res.status(500).json({ error: "Error al obtener logs" });
  }
});

export default router;
