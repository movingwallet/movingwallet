// Vitest setup: reduce ruido en tests/CI

// 1) Silenciar logs del middleware si alguien olvida LOG_LEVEL
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "silent";
process.env.NODE_ENV = process.env.NODE_ENV || "test";

// 2) Reducir warnings deprecations en tests (no los elimina del todo, pero evita spam)
const originalEmitWarning = process.emitWarning;
process.emitWarning = ((warning: any, ...args: any[]) => {
  const msg = typeof warning === "string" ? warning : warning?.message || "";

  // Silenciamos el warning específico de punycode (ruido típico en Node 20+)
  if (msg.includes("punycode")) return;

  return (originalEmitWarning as any)(warning, ...args);
}) as any;
