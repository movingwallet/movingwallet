import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/api/google-excel", async (req, res) => {
  const { tarea, prioridad, fecha } = req.body;

  if (!tarea || !prioridad || !fecha) {
    return res.status(400).json({ error: "Faltan datos: tarea, prioridad o fecha" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SHEET_ID;
    const rango = "Hoja1!A1:C1";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: rango,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[tarea, prioridad, fecha]]
      }
    });

    res.json({ status: "✅ Fila añadida al roadmap", tarea });
  } catch (error) {
    res.status(500).json({ error: "Error al escribir en Google Sheet", detalle: error.message });
  }
});

export default router;
