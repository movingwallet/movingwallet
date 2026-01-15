import { Request, Response, NextFunction } from "express";

// Middleware de autenticación básica por token de API.
// Este token se debe definir en el archivo `.env` como API_TOKEN.
// Se usa para proteger rutas que no deben ser públicas.

const validateApiToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-api-token"];

  if (!token || token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: "Token de autenticación inválido o faltante" });
  }

  next();
};

export default validateApiToken;
