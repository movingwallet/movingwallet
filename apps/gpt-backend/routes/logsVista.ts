import { Router, Request, Response } from "express";
import LogModel from "../models/Log";

const router = Router();

router.get("/logs", async (_req: Request, res: Response) => {
  try {
    const logs = await LogModel.find().sort({ fecha: -1 }).limit(100);

    const html = `
<html>
<head>
  <title>Últimos Logs</title>
  <style>
    body { font-family: sans-serif; margin: 1rem; }
    .log { margin-bottom: 1rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; }
    .tipo { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Últimos Logs</h1>
  ${logs
    .map((log: any) => `
      <div class="log">
        <div class="tipo">${log.tipo}</div>
        <div class="origen">${log.origen}</div>
        <div class="descripcion">${log.descripcion}</div>
        <pre>${JSON.stringify(log.payload, null, 2)}</pre>
      </div>
    `)
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
