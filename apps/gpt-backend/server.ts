import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { connectToDatabase } from "./config/database";
import { validateApiToken } from "./middleware/auth";
import { registrarLogAutomatico } from "./middleware/logger";

// Rutas básicas
import pingRoute from "./routes/ping";
import githubRoute from "./routes/github";
import googleDocRoute from "./routes/googleDoc";
import { routerInteligenteRoute } from "./routes/gpt/routerInteligente";

// Rutas organizadas por carpetas
import crearEntradaDocRoute from "./routes/documentacion/crearEntrada";
import githubCommitsRoute from "./routes/github/commits";
import pineconeBuscarRoute from "./routes/pinecone/buscar";
import gptPromptRoute from "./routes/gpt/prompt";
import gptGithubResumenRoute from "./routes/gpt/githubResumen";
import estadoSistemaRoute from "./routes/resumen/estadoSistema";

// Logs y estado
import logsVistaRoute from "./routes/logsVista";
import logsJsonRoute from "./routes/logsJson";
import estadoRoute from "./routes/estado";

// Cargar variables de entorno
dotenv.config();
const API_TOKENS = process.env.API_TOKENS?.split(',') || [];
const PORT = process.env.PORT || 3000;

// Inicializar Express
const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar logs automáticamente
app.use(registrarLogAutomatico);

// Servir archivos estáticos como OpenAPI
app.use(express.static(path.join(__dirname, "public")));

// Conexión a base de datos
connectToDatabase().catch(err => {
  console.error("❌ Error en la conexión a la base de datos:", err);
  process.exit(1);
});

// Autenticación (excepto rutas públicas)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (
    req.path === '/api/ping' ||
    req.path === '/gpt-actions-openapi-bbdd.json'
  ) return next();
  validateApiToken(req, res, next);
});

// Registrar rutas
app.use("/api", pingRoute);
app.use("/api", githubRoute);
app.use("/api", googleDocRoute);
app.use("/api", routerInteligenteRoute);

app.use("/api", crearEntradaDocRoute);
app.use("/api", githubCommitsRoute);
app.use("/api", pineconeBuscarRoute);
app.use("/api", gptPromptRoute);
app.use("/api", gptGithubResumenRoute);
app.use("/api", estadoSistemaRoute);

app.use("/api", logsVistaRoute);
app.use("/api", logsJsonRoute);
app.use("/api", estadoRoute);

// Manejador de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    code: 500,
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ GPT-backend corriendo en http://localhost:${PORT}`);
  console.log(`🔗 OpenAPI disponible en /gpt-actions-openapi-bbdd.json`);
  console.log(`🧠 GPT disponible en /api/gpt/prompt`);
  console.log(`🧠 GitHub resumen en /api/gpt/github-resumen`);
  console.log(`🔑 Tokens API permitidos: ${API_TOKENS.length}`);
});

export default app;
