import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { connectToDatabase } from "./config/database";
import { loadEnv } from "./config/schema.env";

// Middlewares reales del repo
import authMiddleware from "./middleware/auth";
import loggerMiddleware from "./middleware/logger";

// Rutas básicas
import pingRoute from "./routes/ping";
import githubRoute from "./routes/github";
import googleDocRoute from "./routes/googleDoc";
import { routerInteligenteRoute } from "./routes/gpt/routerInteligente";

// Rutas organizadas por carpetas
import crearEntradaDocRoute from "./routes/documentacion/crearEntrada";
import githubCommitsRoute from "./routes/github/commits";
import gptPromptRoute from "./routes/gpt/prompt";
import gptGithubResumenRoute from "./routes/gpt/githubResumen";
import estadoSistemaRoute from "./routes/resumen/estadoSistema";

// Logs y estado
import logsVistaRoute from "./routes/logsVista";
import logsJsonRoute from "./routes/logsJson";
import estadoRoute from "./routes/estado";

/**
 * 2026-01:
 * En monorepo con pnpm + tsx, el CWD es apps/gpt-backend.
 * Forzamos cargar el .env desde la raíz del repo.
 */
dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

// ✅ Validar env DESPUÉS de dotenv
const env = loadEnv();

const API_TOKENS = (env.API_TOKENS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const PORT = env.PORT || 3000;

// Inicializar Express
const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(loggerMiddleware);

// Servir estáticos (si aplica)
app.use(express.static(path.join(process.cwd(), "public")));

/**
 * MongoDB:
 * - Si existe MONGO_URI → conectamos
 * - Si no → no bloqueamos arranque (fase previa)
 */
if (env.MONGO_URI) {
  connectToDatabase().catch((err) => {
    console.error("❌ Error en la conexión a MongoDB:", err);
    process.exit(1);
  });
} else {
  console.warn("⚠️ MONGO_URI no definido. Se omite conexión a MongoDB (fase previa).");
}

/**
 * Auth:
 * Permitimos /api/ping y OpenAPI sin auth
 */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path === "/api/ping" || req.path === "/gpt-actions-openapi-bbdd.json") {
    return next();
  }
  return authMiddleware(req, res, next);
});

// ---------- RUTAS ----------
app.use("/api", pingRoute);
app.use("/api", githubRoute);
app.use("/api", googleDocRoute);
app.use("/api", routerInteligenteRoute);

app.use("/api", crearEntradaDocRoute);
app.use("/api", githubCommitsRoute);

/**
 * Pinecone DESACTIVADO (Qdrant day 1)
 */

app.use("/api", gptPromptRoute);
app.use("/api", gptGithubResumenRoute);
app.use("/api", estadoSistemaRoute);

app.use("/api", logsVistaRoute);
app.use("/api", logsJsonRoute);
app.use("/api", estadoRoute);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    details: env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Arranque
app.listen(PORT, () => {
  console.log(`✅ gpt-backend corriendo en http://localhost:${PORT}`);
  console.log(`🧠 GPT prompt en /api/gpt/prompt`);
  console.log(`🔑 API_TOKENS configurados: ${API_TOKENS.length}`);
});

export default app;
