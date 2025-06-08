import express from "express";
import { openai } from "../../config/openai";

const router = express.Router();

router.post("/gpt/prompt", async (req, res) => {
  try {
    const { prompt, model = "gpt-4", temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Falta el campo 'prompt'" });
    }

    const completion = await openai.chat.completions.create({
      model,
      temperature,
      messages: [{ role: "user", content: prompt }]
    });

    const reply = completion.choices[0]?.message?.content || "";
    res.json({ reply, usage: completion.usage });
  } catch (error: any) {
    console.error("❌ Error en /gpt/prompt:", error);
    res.status(500).json({ error: error.message || "Fallo interno" });
  }
});

export default router;
