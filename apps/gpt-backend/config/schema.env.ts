import { cleanEnv, str, num } from "envalid";

export function loadEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production", "staging", "test"],
      default: "development",
    }),

    // Server
    PORT: num({ default: 3000 }),
    API_TOKENS: str({ default: "" }),

    // OpenAI (core)
    OPENAI_API_KEY: str(),

    // ✅ Opcionales (pero recomendables)
    OPENAI_MODEL: str({ default: "gpt-4o-mini" }),
    OPENAI_BASE_URL: str({ default: "" }),

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

    // Qdrant
    QDRANT_URL: str({ default: "" }),
    QDRANT_API_KEY: str({ default: "" }),
    QDRANT_COLLECTION: str({ default: "repo_chunks" }),
  });
}
