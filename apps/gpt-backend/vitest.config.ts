import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

/**
 * Fix para paths tipo "@/..."
 * Vitest (Vite) NO lee automáticamente el "paths" del tsconfig.
 * Aquí replicamos el alias "@" -> "./" (root de apps/gpt-backend)
 */
const rootDir = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDir
    }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 20000
  }
});
