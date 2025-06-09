import { Request, Response, NextFunction } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("📥 METHOD:", req.method);
  console.log("📡 URL:", req.originalUrl);
  console.log("🧾 BODY:", req.body);
  console.log("🔍 QUERY:", req.query);
  console.log("🧠 HEADERS:", req.headers);

  next();
};

export default loggerMiddleware;
