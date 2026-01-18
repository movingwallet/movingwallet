import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    reporters: ['default', 'html'],
    outputFile: {
      html: './test-results/index.html',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '_actions_OLD/',
        '_routes_OLD/',
        '_middleware_OLD/',
        'tests/',
        '*.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir),
    },
  },
});
