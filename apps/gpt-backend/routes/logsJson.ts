import { Router, Request, Response } from "express";
import LogModel from "@/logs/Log";

const router = Router();

router.get("/logs.json", async (_req: Request, res: Response) => {
  try {
    const logs = await LogModel.find().sort({ fecha: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    console.error("❌ Error al obtener logs JSON:", error);
    res.status(500).json({
      error: "Error al obtener logs JSON",
      detalles: (error as Error).message,
    });
  }
});

export default router;
