#!/usr/bin/env node
/**
 * classify-smoke-failure.mjs
 *
 * Lee artifacts del smoke:
 * - logs/debug-ai.json (si existe)
 * - logs/backend-smoke.log (si existe)
 *
 * Devuelve por stdout un JSON con:
 * - code: clasificación corta
 * - title: título humano
 * - summary: resumen
 * - nextSteps: pasos recomendados
 */

import fs from "node:fs";
import path from "node:path";

function safeRead(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function pick(...arr) {
  for (const v of arr) if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  return null;
}

function classify({ debug, logText }) {
  const log = (logText || "").toLowerCase();

  // From debug-ai.json (si existe)
  const provider = pick(debug?.provider, debug?.aiProvider, debug?.resolvedProvider, "unknown");
  const expectedEnv = pick(debug?.expectedEnvVar, debug?.expected_env_var);
  const hasKey = debug?.hasKey;

  // Señales en logs (string match)
  const has401 =
    log.includes("401") ||
    log.includes("incorrect api key") ||
    log.includes("invalid api key") ||
    log.includes("unauthorized");

  const hasQuota =
    log.includes("exceeded your current quota") ||
    log.includes("insufficient_quota") ||
    log.includes("billing") ||
    log.includes("no tienes saldo");

  const hasRateLimit =
    log.includes("rate limit") ||
    log.includes("429") ||
    log.includes("too many requests");

  const hasCircuit =
    log.includes("circuit breaker") ||
    log.includes("circuit") && log.includes("open");

  const hasNetwork =
    log.includes("enotfound") ||
    log.includes("econnrefused") ||
    log.includes("etimedout") ||
    log.includes("network") && log.includes("error") ||
    log.includes("fetch failed");

  const hasHealthTimeout =
    log.includes("/health") && (log.includes("did not become ready") || log.includes("not become ready"));

  const hasPortInUse =
    log.includes("eaddrinuse") ||
    log.includes("address already in use");

  const hasMissingEnv =
    log.includes("missing") && log.includes("env") ||
    log.includes("required env") ||
    (expectedEnv && (log.includes(expectedEnv.toLowerCase()) && log.includes("missing")));

  // 1) Clasificación por prioridad (lo más común primero)
  if (has401) {
    return {
      code: "AI_KEY_INVALID",
      title: "AI provider key inválida (401)",
      summary: `El proveedor de IA respondió 401 (API key incorrecta o revocada). provider=${provider}`,
      nextSteps: [
        "Revisa y actualiza el secret correspondiente en GitHub Actions (OPENAI_API_KEY / ANTHROPIC_API_KEY / etc.).",
        "Verifica que el workflow está leyendo el secret correcto (Settings → Secrets and variables → Actions).",
        "Si es OpenAI: confirma que la key es válida y pertenece al proyecto correcto.",
      ],
      provider,
      expectedEnv,
      hasKey,
    };
  }

  if (hasQuota) {
    return {
      code: "AI_QUOTA_OR_BILLING",
      title: "Sin saldo / cuota agotada en el proveedor de IA",
      summary: `El proveedor de IA indica cuota/saldo/billing insuficiente. provider=${provider}`,
      nextSteps: [
        "Añade saldo / habilita billing en el proveedor.",
        "Si estás en modo dev: usa un provider alternativo temporal o desactiva la llamada real en smoke.",
        "Re-ejecuta el workflow tras confirmar billing.",
      ],
      provider,
      expectedEnv,
      hasKey,
    };
  }

  if (hasRateLimit) {
    return {
      code: "AI_RATE_LIMIT",
      title: "Rate limit del proveedor de IA (429)",
      summary: `El proveedor devolvió rate limit. provider=${provider}`,
      nextSteps: [
        "Reintenta el workflow más tarde.",
        "Reduce llamadas en smoke (una sola) o añade backoff.",
        "Si es necesario, sube límites/plan del provider.",
      ],
      provider,
      expectedEnv,
      hasKey,
    };
  }

  if (hasMissingEnv) {
    return {
      code: "MISSING_ENV",
      title: "Falta una variable de entorno requerida",
      summary: `El backend no arrancó por una env requerida. expected=${expectedEnv || "unknown"} provider=${provider}`,
      nextSteps: [
        "Revisa config/schema.env.ts y qué envs son required en CI.",
        "Asegura que GitHub Secrets tiene la variable requerida o pon defaults seguros para CI.",
        "Vuelve a ejecutar el workflow.",
      ],
      provider,
      expectedEnv,
      hasKey,
    };
  }

  if (hasCircuit) {
    return {
      code: "AI_CIRCUIT_OPEN",
      title: "Circuit breaker abierto para el proveedor de IA",
      summary: `El circuito está abierto (fallos recientes). provider=${provider}`,
      nextSteps: [
        "Revisa logs anteriores: el circuito suele abrir por 401, timeout o rate limit.",
        "Baja la agresividad del smoke o resetea la lógica del circuit breaker en CI.",
        "Reintenta después de unos minutos.",
      ],
      provider,
      expectedEnv,
      hasKey,
    };
  }

  if (hasPortInUse) {
    return {
      code: "PORT_IN_USE",
      title: "Puerto ocupado (EADDRINUSE)",
      summary: "El backend intentó arrancar pero el puerto ya estaba en uso.",
      nextSteps: [
        "Asegura que el workflow mata el proceso anterior (ya lo hacemos con pid).",
        "Evita correr dos servers simultáneos en el mismo job.",
        "Si persiste, cambia el puerto del smoke en CI.",
      ],
      provider,
      expectedEnv,
      hasKey,
    };
  }

  if (hasNetwork) {
    return {
      code: "NETWORK_ERROR",
      title: "Error de red (DNS/timeout/conexión)",
      summary: `Fallo de red al contactar con un servicio externo o al arrancar. provider=${provider}`,
      nextSteps: [
        "Reintenta el workflow (GitHub runners a veces tienen fallos temporales).",
        "Si el error es del provider, revisa status page del proveedor.",
        "Aumenta timeout/reintentos en la llamada si es frecuente.",
      ],
      provider,
      expectedEnv,
      hasKey,
    };
  }

  if (hasHealthTimeout) {
    return {
      code: "BACKEND_NOT_READY",
      title: "El backend no llegó a estar listo (/health timeout)",
      summary: "El workflow no consiguió respuesta de /health en el tiempo límite.",
      nextSteps: [
        "Mira el artifact backend-smoke.log (últimas líneas) para ver el error real de arranque.",
        "Confirma que /health existe y que el servidor escucha en 127.0.0.1:3000.",
        "Sube el tiempo de espera si en CI tarda más en arrancar.",
      ],
      provider,
      expectedEnv,
      hasKey,
    };
  }

  // Default
  return {
    code: "UNKNOWN",
    title: "Fallo no clasificado",
    summary: "No se detectó patrón claro. Revisa artifacts (debug-ai.json y backend-smoke.log).",
    nextSteps: [
      "Abre el run en GitHub Actions y descarga artifacts.",
      "Busca el primer stacktrace o error real en backend-smoke.log.",
      "Si quieres, añadimos un patrón nuevo a este clasificador.",
    ],
    provider,
    expectedEnv,
    hasKey,
  };
}

const logsDir = process.argv[2] || "logs";
const debugPath = path.join(logsDir, "debug-ai.json");
const logPath = path.join(logsDir, "backend-smoke.log");

const debugText = safeRead(debugPath);
const logText = safeRead(logPath);

const debug = debugText ? safeJsonParse(debugText) : null;

const result = classify({ debug, logText });

process.stdout.write(JSON.stringify(result, null, 2) + "\n");
