import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import type { Request, Response, NextFunction } from "express";

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

/* -------------------------------------------------- */
/* Utils */
/* -------------------------------------------------- */

function loadEnvMonorepoSafe() {
  const loadedEnvPaths: string[] = [];
  const cwd = process.cwd();

  const envPathFromVar = process.env.ENV_PATH
    ? path.resolve(cwd, process.env.ENV_PATH)
    : null;

  const repoRootEnv = path.resolve(cwd, "../../.env");

  if (envPathFromVar && fs.existsSync(envPathFromVar)) {
    dotenv.config({ path: envPathFromVar, override: true });
    loadedEnvPaths.push(envPathFromVar);
  }

  if (fs.existsSync(repoRootEnv)) {
    dotenv.config({ path: repoRootEnv });
    loadedEnvPaths.push(repoRootEnv);
  }

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

function isServerlessRuntime() {
  return Boolean(process.env.VERCEL);
}

/* -------------------------------------------------- */
/* App factory */
/* -------------------------------------------------- */

export function createApp() {
  const envLoadedFrom = loadEnvMonorepoSafe();
  const env = loadEnv();

  const API_TOKENS = (env.API_TOKENS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const PORT = env.PORT || 3000;

  const app = express();

  app.locals.envLoadedFrom = envLoadedFrom;
  app.locals.API_TOKENS_COUNT = API_TOKENS.length;
  app.locals.SERVERLESS = isServerlessRuntime();

  app.set("trust proxy", 1);

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    const traceId = crypto.randomUUID();
    (req as any).traceId = traceId;
    res.setHeader("x-trace-id", traceId);
    next();
  });

  app.use(loggerMiddleware);

  app.use(express.static(path.join(process.cwd(), "public")));

  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", traceId: (req as any).traceId });
  });

  if (!isTestRun() && env.MONGO_URI) {
    connectToDatabase().catch((err) => {
      console.error("❌ MongoDB error:", err);
    });
  }

  app.use((req: Request, res: Response, next: NextFunction) => {
    const p = req.path;
    const ou = req.originalUrl;

    if (
      p === "/health" ||
      p === "/ping" ||
      p === "/api/ping" ||
      ou.startsWith("/api/debug")
    ) {
      return next();
    }

    return authMiddleware(req, res, next);
  });

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
  app.use("/api", openaiDebugRoute);
  app.use("/api", diagnosticsRoute);
  app.use("/api", aiDebugRoute);
  app.use("/api", eventsRoute);
  app.use("/api", githubIssuesRoute);
  app.use("/api", githubPrRoute);

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const traceId = (req as any).traceId;
    console.error("❌ Global error:", err);
    res.status(500).json({ error: "Internal Server Error", traceId });
  });

  return { app, PORT };
}

/* -------------------------------------------------- */
/* Export para Vercel */
/* -------------------------------------------------- */

const { app, PORT } = createApp();

export default function handler(req: any, res: any) {
  return app(req, res);
}

if (!isServerlessRuntime() && !isTestRun()) {
  app.listen(PORT, () => {
    console.log(`✅ GPT-backend running on http://localhost:${PORT}`);
  });
}
