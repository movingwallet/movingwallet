import { Router, Request, Response } from "express";
import { procesarContenidoGoogleDoc } from "../actions/google/procesarContenidoGoogleDoc";

const router = Router();

router.post("/procesar-google-doc", async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Falta la URL del Google Doc" });
  }

  try {
    const resultado = await procesarContenidoGoogleDoc(url);
    res.json({ resultado });
  } catch (error) {
    console.error("❌ Error al procesar Google Doc:", error);
    res.status(500).json({
      error: "Error interno al procesar el documento",
      detalles: (error as Error).message,
    });
  }
});

export default router;
