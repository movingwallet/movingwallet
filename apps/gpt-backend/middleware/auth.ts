import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token faltante o inválido" });
  }

  // Aquí podrías validar el token en el futuro
  next();
};

export default authMiddleware;
