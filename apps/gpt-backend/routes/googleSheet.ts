import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/api/google-sheet", async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SHEET_ID;
    const rango = "Hoja1!A1:D20"; // Ajustable

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: rango
    });

    res.json({ datos: response.data.values });
  } catch (error) {
    res.status(500).json({ error: "Error al leer el Google Sheet", detalle: error.message });
  }
});

export default router;
