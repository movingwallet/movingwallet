import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import { connectToDatabase } from "./config/database";
import { loadEnv } from "./config/schema.env";

// Middlewares
import authMiddleware from "./middleware/auth";
import loggerMiddleware from "./middleware/logger";

// Rutas
import pingRoute from "./routes/ping";
import githubRoute from "./routes/github";
import googleDocRoute from "./routes/googleDoc";
import { routerInteligenteRoute } from "./routes/gpt/routerInteligente";

import crearEntradaDocRoute from "./routes/documentacion/crearEntrada";
import githubCommitsRoute from "./routes/github/commits";
import gptPromptRoute from "./routes/gpt/prompt";
import gptGithubResumenRoute from "./routes/gpt/githubResumen";
import estadoSistemaRoute from "./routes/resumen/estadoSistema";

import logsVistaRoute from "./routes/logsVista";
import logsJsonRoute from "./routes/logsJson";
import estadoRoute from "./routes/estado";

import openaiDebugRoute from "./routes/debug/openai";

/**
 * ✅ ENV LOADING (robusto y sin import.meta / __dirname)
 * - Carga .env normal
 * - Luego intenta varios paths típicos de monorepo
 * - El primero que exista gana
 */
dotenv.config();

const candidateEnvPaths = [
  // 1) si alguien quiere forzarlo por variable
  process.env.ENV_PATH ? path.resolve(process.cwd(), process.env.ENV_PATH) : null,

  // 2) .env en el cwd actual
  path.resolve(process.cwd(), ".env"),

  // 3) monorepo: si arrancas desde apps/gpt-backend
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "../../../.env"),

  // 4) monorepo: si arrancas desde raíz
  path.resolve(process.cwd(), "apps/gpt-backend/.env"),
].filter(Boolean) as string[];

for (const p of candidateEnvPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

// Validar env DESPUÉS de dotenv
const env = loadEnv();

const API_TOKENS = (env.API_TOKENS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const PORT = env.PORT || 3000;

const app = express();

// Proxy (Vercel)
app.set("trust proxy", 1);

// Base middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * TraceId global
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const traceId = crypto.randomUUID();
  (req as any).traceId = traceId;
  res.setHeader("x-trace-id", traceId);
  next();
});

// Logger
app.use(loggerMiddleware);

// Static
app.use(express.static(path.join(process.cwd(), "public")));

/**
 * Health (sin auth)
 */
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    traceId: (req as any).traceId,
  });
});

// Mongo (opcional)
if (env.MONGO_URI) {
  connectToDatabase().catch((err) => {
    console.error("❌ Error MongoDB:", err);
    process.exit(1);
  });
} else {
  console.warn("⚠️ MONGO_URI no definido. Mongo desactivado.");
}

/**
 * Auth bypass
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const p = req.path; // ej: "/api/debug/openai"
  const ou = req.originalUrl; // por si viene con query

  if (
    p === "/api/ping" ||
    p === "/ping" ||
    p === "/health" ||
    p === "/gpt-actions-openapi-bbdd.json" ||
    p === "/api/debug/openai" ||
    ou.startsWith("/api/debug/openai")
  ) {
    return next();
  }

  return authMiddleware(req, res, next);
});

// Routes
app.use("/api", pingRoute);
app.use("/api", githubRoute);
app.use("/api", googleDocRoute);
app.use("/api", routerInteligenteRoute);

app.use("/api", crearEntradaDocRoute);
app.use("/api", githubCommitsRoute);

app.use("/api", gptPromptRoute);
app.use("/api", gptGithubResumenRoute);
app.use("/api", estadoSistemaRoute);

app.use("/api", logsVistaRoute);
app.use("/api", logsJsonRoute);
app.use("/api", estadoRoute);

// Debug
app.use("/api", openaiDebugRoute);

/**
 * Error handler global
 */
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const traceId = (req as any).traceId;

  console.error("❌ Error global:", {
    traceId,
    message: err?.message,
    stack: err?.stack,
  });

  res.status(500).json({
    error: "Internal Server Error",
    traceId,
    details: env.NODE_ENV === "development" ? err?.message : undefined,
  });
});

// Listen
app.listen(PORT, () => {
  console.log(`✅ gpt-backend corriendo en http://localhost:${PORT}`);
  console.log(`🧠 GPT prompt en /api/gpt/prompt`);
  console.log(`🔑 API_TOKENS configurados: ${API_TOKENS.length}`);
  console.log(`🔧 NODE_ENV: ${env.NODE_ENV}`);
});

export default app;
