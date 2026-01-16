import { Request, Response, NextFunction } from "express";

function isTestEnv() {
  return (
    process.env.NODE_ENV === "test" ||
    process.env.VITEST === "1" ||
    process.env.VITEST === "true"
  );
}

function isSilent() {
  return (process.env.LOG_LEVEL || "").toLowerCase() === "silent";
}

export default function loggerMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (isTestEnv() || isSilent()) return next();

  try {
    console.log("📥 METHOD:", req.method);
    console.log("📡 URL:", req.originalUrl);
    console.log("🧾 BODY:", req.body ?? {});
    console.log("🔍 QUERY:", req.query ?? {});
    console.log("🧠 HEADERS:", req.headers ?? {});
  } catch {
    // nunca romper el request por el logger
  }

  next();
}
