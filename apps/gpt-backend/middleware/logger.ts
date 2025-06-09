import { Request, Response, NextFunction } from "express";

export function registrarLogAutomatico(req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  const log = {
    timestamp,
    method: req.method,
    path: req.originalUrl,
    body: req.body,
    query: req.query,
    headers: {
      origin: req.headers.origin,
      referer: req.headers.referer,
    },
  };

  console.log("📘 Log automático:", JSON.stringify(log, null, 2));
  next();
}
