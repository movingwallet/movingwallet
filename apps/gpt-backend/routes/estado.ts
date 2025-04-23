import express from "express"
import fs from "fs/promises"
import path from "path"
import { marked } from "marked"

const router = express.Router()

router.get("/estado", async (_req, res) => {
  try {
    const mdPath = path.join(__dirname, "../data/estado_actual.md")
    const content = await fs.readFile(mdPath, "utf-8")
    const html = marked(content)

    res.send(`
      <html>
        <head>
          <title>Estado actual - GPT Backend</title>
          <style>
            body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; line-height: 1.6; }
            h1, h2, h3 { color: #444; }
            pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; }
            code { background: #eee; padding: 2px 4px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>📊 Estado actual de MovingWallet</h1>
          <div>${html}</div>
        </body>
      </html>
    `)
  } catch (error) {
    console.error("❌ Error en /estado:", error)
    res.status(500).send("Error al cargar el estado actual")
  }
})

export default router
