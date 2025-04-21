import { Router } from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/commit", async (req, res) => {
  const { resumen } = req.body;
  if (!resumen) return res.status(400).json({ error: "Resumen requerido" });

  try {
    const prompt = `Crea un mensaje de commit corto y semántico para: ${resumen}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const mensaje = completion.choices[0].message?.content;
    res.json({ commit: mensaje?.trim() });
  } catch (error) {
    console.error("Error generando commit:", error);
    res.status(500).json({ error: "Fallo al generar commit" });
  }
});

export default router;
