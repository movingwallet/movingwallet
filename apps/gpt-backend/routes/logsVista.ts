import express from "express"
import { LogModel } from "../models/Log"

const router = express.Router()

router.get("/logs/vista", async (req, res) => {
  try {
    const logs = await LogModel.find().sort({ fecha: -1 }).limit(100)

    const html = `
      <html>
        <head>
          <title>Logs GPT Backend</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
            tr:nth-child(even) { background: #fafafa; }
            code { background: #eee; padding: 2px 4px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>🧠 Logs GPT Backend (últimos 100)</h1>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Origen</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              ${logs
                .map(
                  (log) => `
                <tr>
                  <td>${new Date(log.fecha).toLocaleString()}</td>
                  <td><code>${log.tipo}</code></td>
                  <td>${log.origen || "-"}</td>
                  <td>${log.descripcion || "-"}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    res.send(html)
  } catch (error) {
    console.error("Error en /logs/vista:", error)
    res.status(500).send("Error al cargar logs")
  }
})

export default router
