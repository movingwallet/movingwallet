import OpenAI from "openai";

/**
 * 2026-01:
 * NO instanciamos OpenAI en top-level.
 * En ESM, los imports se evalúan antes del arranque del server y antes de dotenv.
 * Esto provocaba que OpenAI petase aunque la key exista en .env.
 */
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("OPENAI_API_KEY missing. Revisa la carga del .env.");
  }

  return new OpenAI({ apiKey });
}

export async function ejecutarPromptGPT(prompt: string): Promise<string> {
  const openai = getOpenAIClient();

  // Mantengo el comportamiento actual; migraremos a Responses API en la siguiente tanda.
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return completion.choices?.[0]?.message?.content?.trim() || "";
}
