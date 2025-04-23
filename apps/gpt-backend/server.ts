import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { connectToDatabase } from "./config/database";
import { validateApiToken } from "./middleware/auth";
import { registrarLogAutomatico } from "./middleware/logger";

// Rutas básicas
import pingRoute from "./routes/ping";
import githubRoute from "./routes/github";
import markdownRoute from "./routes/markdown";

// Acciones confirmadas
import crearEntradaRoute from "./routes/crearEntrada";
import pineconeRoute from "./routes/buscarPinecone";
import commitRoute from "./routes/commit";
import excelRoute from "./routes/googleExcel";
import sheetRoute from "./routes/googleSheet";
import verificarRoute from "./routes/verificar";
import reintentarRoute from "./routes/reintentar";
import resumenRoute from "./routes/resumen";
import consistenciaRoute from "./routes/consistencia";
import pitchRoute from "./routes/pitch";
import routerInteligenteRoute from "./routes/routerInteligente";
import googleDocRoute from "./routes/googleDoc";
import logsVistaRoute from "./routes/logsVista";
import logsJsonRoute from "./routes/logsJson";
import estadoRoute from "./routes/estado"; // ✅ NUEVO

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

// Registrar logs automáticamente (antes de la auth si se desea capturar todo)
app.use(registrarLogAutomatico);

// Servir archivos estáticos como el OpenAPI JSON
app.use(express.static(path.join(__dirname, "public")));

// Conexión a base de datos (si aplica)
connectToDatabase().catch(err => {
  console.error("❌ Error en la conexión a la base de datos:", err);
  process.exit(1);
});

// Autenticación (excluye ping y OpenAPI)
app.use((req, res, next) => {
  if (
    req.path === '/api/ping' ||
    req.path === '/gpt-actions-openapi-bbdd.json'
  ) return next();
  validateApiToken(req, res, next);
});

// Registrar rutas de API
app.use("/api", pingRoute);
app.use("/api", githubRoute);
app.use("/api", markdownRoute);
app.use("/api", crearEntradaRoute);
app.use("/api", pineconeRoute);
app.use("/api", commitRoute);
app.use("/api", excelRoute);
app.use("/api", sheetRoute);
app.use("/api", verificarRoute);
app.use("/api", reintentarRoute);
app.use("/api", resumenRoute);
app.use("/api", consistenciaRoute);
app.use("/api", pitchRoute);
app.use("/api", routerInteligenteRoute);
app.use("/api", googleDocRoute);
app.use("/api", logsVistaRoute);
app.use("/api", logsJsonRoute);
app.use("/api", estadoRoute); // ✅ NUEVO

// Manejador de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
  console.log(`🔑 Tokens API permitidos: ${API_TOKENS.length}`);
});

export default app;
