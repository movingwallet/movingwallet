import { OpenAI } from "openai";

const openai = new OpenAI();

export async function ejecutarPromptGPT(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}
