import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import crypto from "crypto";

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

  const PORT = process.env.PORT || 3000;

  const app = express();

  app.locals.envLoadedFrom = envLoadedFrom;
  app.locals.SERVERLESS = isServerlessRuntime();

  app.set("trust proxy", 1);

  // Middlewares básicos
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  // TraceId middleware
  app.use((req: any, res: any, next: any) => {
    const traceId = crypto.randomUUID();
    req.traceId = traceId;
    res.setHeader("x-trace-id", traceId);
    next();
  });

  // Health endpoint (sin dependencias)
  app.get("/health", (req: any, res: any) => {
    res.json({ 
      status: "ok", 
      traceId: req.traceId,
      serverless: isServerlessRuntime(),
      timestamp: new Date().toISOString()
    });
  });

  // Ping endpoint
  app.post("/api/ping", (req: any, res: any) => {
    res.json({ 
      message: "pong", 
      traceId: req.traceId,
      timestamp: new Date().toISOString()
    });
  });

  // Debug AI endpoint
  app.post("/api/debug/ai", (req: any, res: any) => {
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
    const hasGitHub = Boolean(process.env.GITHUB_TOKEN);

    res.json({
      traceId: req.traceId,
      env: {
        OPENAI_API_KEY: hasOpenAI ? "✅ Present" : "❌ Missing",
        ANTHROPIC_API_KEY: hasAnthropic ? "✅ Present" : "❌ Missing",
        GITHUB_TOKEN: hasGitHub ? "✅ Present" : "❌ Missing",
      },
      serverless: isServerlessRuntime(),
      timestamp: new Date().toISOString()
    });
  });

  // 404 handler
  app.use((req: any, res: any) => {
    res.status(404).json({ 
      error: "Not Found", 
      path: req.path,
      traceId: req.traceId 
    });
  });

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    const traceId = req.traceId;
    console.error("❌ Global error:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      traceId,
      message: err.message
    });
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

// Solo listen en local
if (!isServerlessRuntime() && !isTestRun()) {
  app.listen(PORT, () => {
    console.log(`✅ GPT-backend running on http://localhost:${PORT}`);
  });
}