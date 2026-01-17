import { Router, Request, Response } from "express";
import { ejecutarPromptGPT } from "../../actions/gpt/ejecutarPromptGPT";
import { incMetric } from "../../lib/metrics";

const router = Router();

function mapOpenAIError(error: any) {
  const status = typeof error?.status === "number" ? error.status : 500;
  const code = error?.code;
  const message: string = error?.message || "Unknown error";
  const requestId = error?.request_id;

  let userMessage = "Error interno al ejecutar el prompt";
  let hint: string | undefined;

  if (status === 503 && code === "openai_circuit_open") {
    userMessage = "OpenAI temporalmente bloqueado (circuit breaker)";
    hint =
      "Se detectaron varios fallos seguidos. Espera unos segundos y reintenta. Revisa /api/debug/diagnostics o /api/debug/openai.";
    return { status, code, message, requestId, userMessage, hint };
  }

  if (status === 401 || code === "invalid_api_key") {
    userMessage = "OpenAI: API key inválida o no autorizada";
    hint =
      "Revisa OPENAI_API_KEY (proyecto correcto), que no esté revocada y que en Vercel esté configurada.";
  }

  if (status === 429) {
    const lower = message.toLowerCase();
    if (lower.includes("exceeded your current quota") || lower.includes("billing")) {
      userMessage = "OpenAI: saldo/cuota agotada (billing)";
      hint =
        "Revisa Billing/Usage del proyecto en OpenAI. Si acabas de recargar, reintenta en 10-30s.";
    } else {
      userMessage = "OpenAI: rate limit (demasiadas peticiones)";
      hint =
        "Baja la frecuencia o implementa colas. El backend ya hace retry/backoff, pero si persiste, sube límites del proyecto.";
    }
  }

  if (status === 400) {
    userMessage = "OpenAI: petición inválida (modelo/parámetros)";
    hint =
      "Verifica model (ej: gpt-4o-mini), tamaño del prompt y parámetros como temperature. Mira openai_request_id.";
  }

  if (status === 403) {
    userMessage = "OpenAI: acceso denegado (permisos/proyecto)";
    hint = "Comprueba que la key pertenece al proyecto con permisos y billing correctos.";
  }

  if (status >= 500 && status <= 599) {
    userMessage = "OpenAI: error temporal del servicio";
    hint = "Reintenta (ya hay retry/backoff). Si persiste, revisa el estado del servicio.";
  }

  return { status, code, message, requestId, userMessage, hint };
}

/**
 * POST /api/gpt/prompt
 * body: { prompt: string, meta?: { model?: string, temperature?: number } }
 */
router.post("/gpt/prompt", async (req: Request, res: Response) => {
  incMetric("gpt_prompt_requests_total");

  const rawPrompt = req.body?.prompt;
  const traceId = (req as any).traceId;

  if (typeof rawPrompt !== "string") {
    incMetric("gpt_prompt_400_total");
    return res.status(400).json({ error: "Falta el prompt (string)", traceId });
  }

  const prompt = rawPrompt.trim();
  if (!prompt) {
    incMetric("gpt_prompt_400_total");
    return res.status(400).json({ error: "Prompt vacío", traceId });
  }

  if (prompt.length > 50_000) {
    incMetric("gpt_prompt_413_total");
    return res.status(413).json({ error: "Prompt demasiado largo", traceId });
  }

  const meta = req.body?.meta ?? {};

  try {
    const respuesta = await ejecutarPromptGPT(prompt, meta);
    incMetric("gpt_prompt_200_total");
    return res.json({ respuesta, traceId });
  } catch (error: any) {
    const mapped = mapOpenAIError(error);

    if (mapped.status === 401) incMetric("openai_401_total");
    else if (
      mapped.status === 429 &&
      (mapped.message || "").toLowerCase().includes("quota")
    )
      incMetric("openai_429_billing_total");
    else if (mapped.status === 429) incMetric("openai_429_ratelimit_total");
    else if (mapped.status >= 500 && mapped.status <= 599)
      incMetric("openai_5xx_total");

    if (mapped.code === "openai_circuit_open") incMetric("openai_circuit_open_total");

    console.error("❌ GPT prompt error:", {
      traceId,
      status: mapped.status,
      code: mapped.code,
      openai_request_id: mapped.requestId,
      message: mapped.message,
    });

    return res.status(mapped.status).json({
      error: mapped.userMessage,
      detalles: mapped.message,
      hint: mapped.hint,
      openai_request_id: mapped.requestId,
      traceId,
    });
  }
});

export default router;
