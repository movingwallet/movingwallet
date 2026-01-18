import { cleanEnv, str, num } from "envalid";

/**
 * ENV schema
 * - OPENAI_API_KEY: la dejamos opcional (default ""), para permitir:
 *   - arrancar backend sin OpenAI (solo fallan rutas GPT cuando se usen)
 *   - ejecutar tests/CI sin secrets reales
 *
 * - CONTROL_MODE: pilar de seguridad para el “control-plane”
 *   - read_only: no permite acciones que escriban/cambien estado externo (ej: crear PR)
 *   - pr_only: permite crear PRs, pero nada “directo” (futuro: merge automático, etc.)
 *   - full: reservado para futuras capacidades (auto-merge / write directo)
 */
export function loadEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str({ default: "development" }),

    PORT: num({ default: 3000 }),

    // ✅ Control-plane permissions (default seguro)
    CONTROL_MODE: str({
      default: "read_only",
      choices: ["read_only", "pr_only", "full"],
    }),

    // Auth tokens (para middleware/auth)
    API_TOKENS: str({ default: "" }),

    // Mongo (opcional en esta fase)
    MONGO_URI: str({ default: "" }),

    // OpenAI
    OPENAI_API_KEY: str({ default: "" }), // ✅ ya no bloquea arranque si falta
    OPENAI_MODEL: str({ default: "gpt-4o-mini" }),
    OPENAI_BASE_URL: str({ default: "" }),

    // Anthropic (Claude)
    ANTHROPIC_API_KEY: str({ default: "" }),

    // GitHub
    GITHUB_TOKEN: str({ default: "" }),
  });
}
