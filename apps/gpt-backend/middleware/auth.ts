import { Request, Response, NextFunction } from "express";

export const validateApiToken = (req: Request, res: Response, next: NextFunction) => {
  const apiToken = req.headers['x-api-token'];
  const validTokens = process.env.API_TOKENS?.split(',') || [];
  
  if (!apiToken || !validTokens.includes(apiToken as string)) {
    return res.status(403).json({
      error: "Unauthorized",
      code: 403,
      details: "Invalid or missing API token"
    });
  }
  
  next();
};