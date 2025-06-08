import { Request, Response, NextFunction } from "express";

export function validateApiToken(req: Request, res: Response, next: NextFunction) {
  const tokensPermitidos = process.env.API_TOKENS?.split(',') || [];
  const tokenCliente = req.headers['authorization']?.replace('Bearer ', '');

  if (!tokenCliente || !tokensPermitidos.includes(tokenCliente)) {
    return res.status(401).json({ error: "Token API inválido o ausente" });
  }

  next();
}
