import { cleanEnv, str, num } from "envalid";

/**
 * ENV schema
 * - OPENAI_API_KEY: la dejamos opcional (default ""), para permitir:
 *   - arrancar backend sin OpenAI (solo fallan rutas GPT cuando se usen)
 *   - ejecutar tests/CI sin secrets reales
 */
export function loadEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str({ default: "development" }),

    PORT: num({ default: 3000 }),

    // Auth tokens (para middleware/auth)
    API_TOKENS: str({ default: "" }),

    // Mongo (opcional en esta fase)
    MONGO_URI: str({ default: "" }),

    // OpenAI
    OPENAI_API_KEY: str({ default: "" }), // ✅ ya no bloquea arranque si falta
    OPENAI_MODEL: str({ default: "gpt-4o-mini" }),
    OPENAI_BASE_URL: str({ default: "" }),

    // Otros (si existían)
    PINECONE_API_KEY: str({ default: "" }),
    PINECONE_ENVIRONMENT: str({ default: "" }),
    PINECONE_INDEX_NAME: str({ default: "" }),
    GITHUB_TOKEN: str({ default: "" }),
  });
}
