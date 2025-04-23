import { Router, Request, Response } from "express";

const router = Router();

router.post("/leer-google-doc", async (_req: Request, res: Response) => {
  // Esta función simula una respuesta desde Google Docs
  res.json({
    success: true,
    message: "Documento leído exitosamente",
    data: {
      titulo: "Ejemplo de documento",
      contenido: "Este es un contenido simulado desde Google Docs."
    }
  });
});

export default router;
