import type { Request, Response, NextFunction } from "express";

/**
 * 2026-01:
 * Auth middleware robusto y compatible.
 *
 * Problema detectado:
 * - El backend tiene API_TOKENS en .env (CSV), pero el middleware no estaba leyendo
 *   el token desde los headers que estamos usando (Bearer / x-api-token).
 * - En ESM, si el middleware parsea env en top-level, puede quedarse vacío porque
 *   dotenv se ejecuta después. Por eso aquí lo leemos SIEMPRE "lazy" por request.
 *
 * Fuentes de token aceptadas:
 * 1) Authorization: Bearer <token>
 * 2) x-api-token: <token>
 * 3) x-api-key: <token>
 * 4) ?token=<token>
 *
 * Variables soportadas:
 * - API_TOKENS (CSV)   -> recomendado: "token1,token2"
 * - API_TOKEN (single) -> legacy fallback si existe
 */
function extractToken(req: Request): string | null {
  // 1) Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === "string") {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match?.[1]) return match[1].trim();
  }

  // 2) x-api-token
  const xApiToken = req.headers["x-api-token"];
  if (typeof xApiToken === "string" && xApiToken.trim()) return xApiToken.trim();

  // 3) x-api-key
  const xApiKey = req.headers["x-api-key"];
  if (typeof xApiKey === "string" && xApiKey.trim()) return xApiKey.trim();

  // 4) query param ?token=
  const q = req.query?.token;
  if (typeof q === "string" && q.trim()) return q.trim();

  return null;
}

function getAllowedTokens(): string[] {
  const csv = process.env.API_TOKENS || "";
  const legacy = process.env.API_TOKEN || "";

  const tokens = csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (legacy && legacy.trim()) tokens.push(legacy.trim());

  // Dedup
  return Array.from(new Set(tokens));
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  const allowed = getAllowedTokens();

  if (!token || allowed.length === 0 || !allowed.includes(token)) {
    return res.status(401).json({
      error: "Token de autenticación inválido o faltante",
      hint:
        "Usa Authorization: Bearer <token> o x-api-token. Revisa API_TOKENS en .env.",
    });
  }

  return next();
}
