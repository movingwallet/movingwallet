import { Router, Request, Response } from "express";
import { ejecutarPromptGPT } from "@/actions/gpt/ejecutarPromptGPT";

const router = Router();

router.post("/gpt/prompt", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Falta el prompt" });
  }

  try {
    const respuesta = await ejecutarPromptGPT(prompt);
    res.json({ respuesta });
  } catch (error) {
    console.error("❌ Error al ejecutar prompt:", error);
    res.status(500).json({
      error: "Error interno al ejecutar el prompt",
      detalles: (error as Error).message,
    });
  }
});

export default router;
