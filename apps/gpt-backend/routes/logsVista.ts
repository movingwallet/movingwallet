import express, { Request, Response } from "express";
import LogModel from "../models/Log";

const router = express.Router();

router.get("/logs", async (_req: Request, res: Response) => {
  try {
    const logs = await LogModel.find().sort({ creadoEn: -1 }).limit(50);

    const html = `
      <html>
        <head>
          <title>Logs</title>
          <style>
            body { font-family: sans-serif; background: #f7f7f7; padding: 2rem; }
            .log { background: white; padding: 1rem; margin-bottom: 1rem; border-left: 5px solid #0070f3; }
            .tipo { font-weight: bold; color: #0070f3; }
            .origen { font-size: 0.9rem; color: gray; }
            pre { background: #eee; padding: 0.5rem; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>Últimos Logs</h1>
          ${logs
            .map(
              (log) => `
              <div class="log">
                <div class="tipo">${log.tipo}</div>
                <div class="origen">${log.origen}</div>
                <div class="descripcion">${log.descripcion}</div>
                <pre>${JSON.stringify(log.payload, null, 2)}</pre>
              </div>`
            )
            .join("")}
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ Error al renderizar logs:", err);
    res.status(500).send("Error al renderizar logs");
  }
});

export default router;
