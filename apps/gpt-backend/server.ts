import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Rutas básicas
import pingRoute from "./routes/ping";
import githubRoute from "./routes/github";
import markdownRoute from "./routes/markdown";

// Próximas rutas (añadir cuando estén listas)
import crearEntradaRoute from "./routes/crearEntrada";       // crear_nueva_entrada_diario
import pineconeRoute from "./routes/buscarPinecone";         // buscar_en_documentos
import commitRoute from "./routes/commit";                   // generar_commit_mensaje
import excelRoute from "./routes/googleExcel";               // agregar_tarea_excel

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas base ya activas
app.use("/api", pingRoute);
app.use("/api", githubRoute);
app.use("/api", markdownRoute);

// app.use("/api", crearEntradaRoute);
// app.use("/api", pineconeRoute);
// app.use("/api", commitRoute);
// app.use("/api", excelRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ GPT-backend corriendo en http://localhost:${PORT}`);
});
