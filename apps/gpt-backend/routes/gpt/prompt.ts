import { Router, Request, Response } from "express";
import { ejecutarPromptGPT } from "@/actions/gpt/ejecutarPromptGPT";

const router = Router();

function mapOpenAIError(error: any) {
  const status = typeof error?.status === "number" ? error.status : 500;
  const code = error?.code;
  const message: string = error?.message || "Unknown error";
  const requestId = error?.request_id;

  let userMessage = "Error interno al ejecutar el prompt";
  let hint: string | undefined;

  // Circuit breaker
  if (status === 503 && code === "openai_circuit_open") {
    userMessage = "OpenAI temporalmente bloqueado (circuit breaker)";
    hint =
      "Se detectaron varios fallos seguidos. Espera unos segundos y reintenta. Revisa /api/debug/openai para ver el estado.";
    return { status, code, message, requestId, userMessage, hint };
  }

  // 401 / invalid_api_key
  if (status === 401 || code === "invalid_api_key") {
    userMessage = "OpenAI: API key inválida o no autorizada";
    hint =
      "Revisa OPENAI_API_KEY (proyecto correcto), que no esté revocada y que en Vercel esté configurada.";
  }

  // 429: billing/quota o rate limit
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

  // 400: request inválida
  if (status === 400) {
    userMessage = "OpenAI: petición inválida (modelo/parámetros)";
    hint =
      "Verifica model (ej: gpt-4o-mini), tamaño del prompt y parámetros como temperature. Mira openai_request_id.";
  }

  // 403: permisos
  if (status === 403) {
    userMessage = "OpenAI: acceso denegado (permisos/proyecto)";
    hint =
      "Comprueba que la key pertenece al proyecto con permisos y billing correctos.";
  }

  // 5xx: upstream
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
  const rawPrompt = req.body?.prompt;
  const traceId = (req as any).traceId;

  if (typeof rawPrompt !== "string") {
    return res.status(400).json({ error: "Falta el prompt (string)", traceId });
  }

  const prompt = rawPrompt.trim();
  if (!prompt) {
    return res.status(400).json({ error: "Prompt vacío", traceId });
  }

  if (prompt.length > 50_000) {
    return res.status(413).json({ error: "Prompt demasiado largo", traceId });
  }

  const meta = req.body?.meta ?? {};

  try {
    const respuesta = await ejecutarPromptGPT(prompt, meta);
    return res.json({ respuesta, traceId });
  } catch (error: any) {
    const mapped = mapOpenAIError(error);

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
