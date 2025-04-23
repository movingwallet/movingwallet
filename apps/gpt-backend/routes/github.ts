import { Router, Request, Response } from "express";

const router = Router();

router.post("/github", async (_req: Request, res: Response) => {
  // Esta acción se implementará con lógica más específica luego
  res.json({
    success: true,
    message: "Operación con GitHub recibida correctamente",
    data: {}
  });
});

export default router;
