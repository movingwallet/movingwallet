import { cleanEnv, str, num } from "envalid";

/**
 * 2026-01:
 * ESM + dotenv:
 * -------------
 * En ESM, los imports se evalúan ANTES de ejecutar el código de server.ts.
 * Si aquí ejecutamos cleanEnv() en top-level, todavía NO se ha cargado el .env,
 * y por tanto variables como OPENAI_API_KEY aparecen undefined.
 *
 * Solución: exportar una función loadEnv() que se llama DESPUÉS de dotenv.config().
 */
export function loadEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production", "staging", "test"],
      default: "development",
    }),

    // Server
    PORT: num({ default: 3000 }),
    API_TOKENS: str({ default: "" }), // CSV: "token1,token2,token3"

    // OpenAI (core)
    OPENAI_API_KEY: str(),

    // Mongo (opcional en fase previa)
    MONGO_URI: str({ default: "" }),

    // GitHub (opcional)
    GITHUB_TOKEN: str({ default: "" }),

    // Pinecone (legacy, opcional)
    PINECONE_API_KEY: str({ default: "" }),
    PINECONE_ENVIRONMENT: str({ default: "" }),
    PINECONE_INDEX_NAME: str({ default: "" }),

    // Google / Vercel (opcionales)
    GOOGLE_API_KEY: str({ default: "" }),
    GOOGLE_SHEETS_ID: str({ default: "" }),
    VERCEL_API_KEY: str({ default: "" }),

    // Qdrant (día 1, pero puede no estar activo aún)
    QDRANT_URL: str({ default: "" }),
    QDRANT_API_KEY: str({ default: "" }),
    QDRANT_COLLECTION: str({ default: "repo_chunks" }),
  });
}
