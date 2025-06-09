import { Request, Response, NextFunction } from "express";

export function validateApiToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-api-key"];
  const validTokens = process.env.API_TOKENS?.split(",").map((t) => t.trim()) || [];

  if (!token || !validTokens.includes(token.toString())) {
    return res.status(401).json({ error: "Token inválido o faltante" });
  }

  next();
}
