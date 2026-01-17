import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import serverless from "serverless-http";

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

// Debug
import openaiDebugRoute from "./routes/debug/openai";
import diagnosticsRoute from "./routes/debug/diagnostics";
import aiDebugRoute from "./routes/debug/ai";

// Events
import eventsRoute from "./routes/events";

// GitHub write
import githubIssuesRoute from "./routes/github/issues";
import githubPrRoute from "./routes/github/pr";

/**
 * ✅ ENV LOADING (monorepo-safe, root-only)
 * - ENV_PATH (override) if set
 * - repo root .env only
 */
function loadEnvMonorepoSafe() {
  const loadedEnvPaths: string[] = [];
  const cwd = process.cwd();

  const envPathFromVar = process.env.ENV_PATH
    ? path.resolve(cwd, process.env.ENV_PATH)
    : null;

  const repoRootEnv = path.resolve(cwd, "../../.env");

  // 1) ENV_PATH fuerza override
  if (envPathFromVar && fs.existsSync(envPathFromVar)) {
    dotenv.config({ path: envPathFromVar, override: true });
    loadedEnvPaths.push(envPathFromVar);
  }

  // 2) raíz (sin override)
  if (fs.existsSync(repoRootEnv)) {
    dotenv.config({ path: repoRootEnv });
    loadedEnvPaths.push(repoRootEnv);
  }

  // 3) fallback
  if (loadedEnvPaths.length === 0) {
    dotenv.config();
    loadedEnvPaths.push("process.env");
  }

  return loadedEnvPaths;
}

function isTestRun() {
  return (
    process.env.NODE_ENV === "test" ||
    process.env.VITEST === "true" ||
    process.env.VITEST === "1"
  );
}

/**
 * ✅ Detecta runtime serverless (Vercel/Lambda)
 * En serverless NO debemos hacer app.listen()
 */
function isServerlessRuntime() {
  return (
    process.env.VERCEL === "1" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME != null ||
    process.env.LAMBDA_TASK_ROOT != null ||
    process.env.NOW_REGION != null
  );
}

export function createApp() {
  const loadedEnvPaths = loadEnvMonorepoSafe();

  // Validar env DESPUÉS de dotenv
  const env = loadEnv();

  const API_TOKENS = (env.API_TOKENS || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const PORT = env.PORT || 3000;

  const app = express();

  // Para endpoints debug/estadoSistema
  app.locals.envLoadedFrom = loadedEnvPaths;

  app.set("trust proxy", 1);

  // Base middleware
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  /**
   * ✅ TraceId global
   * (tipos "any" para evitar conflictos de typings en Vercel)
   */
  app.use((req: any, res: any, next: any) => {
    const traceId = crypto.randomUUID();
    req.traceId = traceId;
    res.setHeader("x-trace-id", traceId);
    next();
  });

  // Logger
  app.use(loggerMiddleware as any);

  // Static
  app.use(express.static(path.join(process.cwd(), "public")));

  /**
   * ✅ Health (sin auth)
   */
  app.get("/health", (req: any, res: any) => {
    res.json({
      status: "ok",
      traceId: req.traceId,
    });
  });

  /**
   * ✅ Mongo (opcional)
   * Importante: en serverless NO hacemos process.exit(1)
   */
  if (!isTestRun()) {
    if (env.MONGO_URI) {
      connectToDatabase().catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error("❌ Error MongoDB:", message);

        if (!isServerlessRuntime()) {
          process.exit(1);
        }
      });
    } else {
      console.warn("⚠️ MONGO_URI no definido. Mongo desactivado.");
    }
  }

  /**
   * ✅ Auth bypass
   */
  app.use((req: any, res: any, next: any) => {
    const p = req.path;
    const ou = req.originalUrl;

    if (
      p === "/api/ping" ||
      p === "/ping" ||
      p === "/health" ||
      p === "/gpt-actions-openapi-bbdd.json" ||
      p === "/api/debug/openai" ||
      p === "/api/debug/diagnostics" ||
      p === "/api/debug/ai" ||
      ou.startsWith("/api/debug/openai") ||
      ou.startsWith("/api/debug/diagnostics") ||
      ou.startsWith("/api/debug/ai")
    ) {
      return next();
    }

    return (authMiddleware as any)(req, res, next);
  });

  // Routes
  app.use("/api", pingRoute as any);
  app.use("/api", githubRoute as any);
  app.use("/api", googleDocRoute as any);
  app.use("/api", routerInteligenteRoute as any);

  app.use("/api", crearEntradaDocRoute as any);
  app.use("/api", githubCommitsRoute as any);

  app.use("/api", gptPromptRoute as any);
  app.use("/api", gptGithubResumenRoute as any);
  app.use("/api", estadoSistemaRoute as any);

  app.use("/api", logsVistaRoute as any);
  app.use("/api", logsJsonRoute as any);
  app.use("/api", estadoRoute as any);

  // Debug
  app.use("/api", openaiDebugRoute as any);
  app.use("/api", diagnosticsRoute as any);
  app.use("/api", aiDebugRoute as any);

  // Events
  app.use("/api", eventsRoute as any);

  // GitHub write
  app.use("/api", githubIssuesRoute as any);
  app.use("/api", githubPrRoute as any);

  /**
   * ✅ Error handler global (con traceId)
   */
  app.use((err: unknown, req: any, res: any, _next: any) => {
    const traceId = req?.traceId;

    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;

    console.error("❌ Error global:", {
      traceId,
      message,
      stack,
    });

    res.status(500).json({
      error: "Internal Server Error",
      traceId,
      details: env.NODE_ENV === "development" ? message : undefined,
    });
  });

  app.locals.API_TOKENS_COUNT = API_TOKENS.length;
  app.locals.PORT = PORT;
  app.locals.SERVERLESS = isServerlessRuntime();

  return { app, PORT, API_TOKENS };
}

// ✅ Crear app una sola vez por instancia
const { app, PORT, API_TOKENS } = createApp();

/**
 * ✅ Handler serverless correcto (Vercel/Lambda)
 * Express se envuelve con serverless-http
 */
export const handler = serverless(app);
export default handler;

// ✅ Arrancar servidor SOLO si estamos en local (NO serverless, NO tests)
if (!isTestRun() && !isServerlessRuntime()) {
  app.listen(PORT, () => {
    console.log(`✅ GPT-backend corriendo en http://localhost:${PORT}`);
    console.log(`🔑 Tokens API permitidos: ${API_TOKENS.length}`);
  });
}
