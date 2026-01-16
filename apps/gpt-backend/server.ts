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

// Debug
import openaiDebugRoute from "./routes/debug/openai";
import diagnosticsRoute from "./routes/debug/diagnostics";
import aiDebugRoute from "./routes/debug/ai";

/**
 * ✅ ENV LOADING (monorepo-safe)
 */
function loadEnvMonorepoSafe() {
  const loadedEnvPaths: string[] = [];
  const cwd = process.cwd();

  const envPathFromVar = process.env.ENV_PATH
    ? path.resolve(cwd, process.env.ENV_PATH)
    : null;

  const repoRootEnv = path.resolve(cwd, "../../.env");
  const localEnv = path.resolve(cwd, ".env");

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

  // 3) local (sin override)
  if (fs.existsSync(localEnv)) {
    dotenv.config({ path: localEnv });
    loadedEnvPaths.push(localEnv);
  }

  // 4) fallback
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
   * ✅ Health (sin auth)
   */
  app.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      traceId: (req as any).traceId,
    });
  });

  /**
   * ✅ Mongo (opcional)
   * - En tests: no intentamos conectar ni avisamos (ruido cero)
   * - En dev/prod: mismo comportamiento que antes
   */
  if (!isTestRun()) {
    if (env.MONGO_URI) {
      connectToDatabase().catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error("❌ Error MongoDB:", message);
        process.exit(1);
      });
    } else {
      console.warn("⚠️ MONGO_URI no definido. Mongo desactivado.");
    }
  }

  /**
   * ✅ Auth bypass
   */
  app.use((req: Request, res: Response, next: NextFunction) => {
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
  app.use("/api", diagnosticsRoute);
  app.use("/api", aiDebugRoute);

  /**
   * ✅ Error handler global (con traceId)
   */
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const traceId = (req as any).traceId;

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

  return { app, PORT, API_TOKENS };
}

// Export default app
const { app, PORT, API_TOKENS } = createApp();
export default app;

// ✅ Arrancar servidor SOLO si no estamos en tests
if (!isTestRun()) {
  app.listen(PORT, () => {
    console.log(`✅ GPT-backend corriendo en http://localhost:${PORT}`);
    console.log(`🔑 Tokens API permitidos: ${API_TOKENS.length}`);
  });
}
