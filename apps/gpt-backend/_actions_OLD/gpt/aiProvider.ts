// apps/gpt-backend/actions/gpt/aiProvider.ts

export type AiProvider = "openai" | "anthropic" | "google" | "mistral";

export type AiProviderConfig = {
  provider: AiProvider;
  apiKey: string | null;
  hasKey: boolean;
  keyPrefix: string; // safe prefix for diagnostics
  keyTail: string;   // safe tail for diagnostics
};

function norm(s: string | undefined): string {
  return (s ?? "").trim();
}

function safePrefix(key: string, n = 8): string {
  return key.slice(0, Math.min(n, key.length));
}

function safeTail(key: string, n = 4): string {
  if (key.length <= n) return key;
  return key.slice(-n);
}

export function resolveAiProvider(): AiProvider {
  const raw = norm(process.env.AI_PROVIDER).toLowerCase();

  // Default provider (keeps current behavior stable)
  const provider = (raw || "openai") as AiProvider;

  if (provider !== "openai" && provider !== "anthropic" && provider !== "google" && provider !== "mistral") {
    // If someone sets AI_PROVIDER to something unknown, fail loudly.
    throw new Error(
      `AI_PROVIDER inválido: "${raw}". Valores soportados: openai | anthropic | google | mistral`
    );
  }

  return provider;
}

export function envVarForProvider(provider: AiProvider): string {
  switch (provider) {
    case "openai":
      return "OPENAI_API_KEY";
    case "anthropic":
      return "ANTHROPIC_API_KEY";
    case "google":
      return "GOOGLE_API_KEY";
    case "mistral":
      return "MISTRAL_API_KEY";
  }
}

export function getProviderApiKey(provider: AiProvider): string | null {
  const envVar = envVarForProvider(provider);
  const key = norm(process.env[envVar]);
  return key ? key : null;
}

/**
 * Provider-aware validation:
 * - openai: typically "sk-..."
 * - anthropic: typically "sk-ant-..."
 * - google: varies
 * - mistral: varies
 *
 * We keep it permissive for non-openai providers to avoid false negatives.
 */
export function validateProviderKey(provider: AiProvider, apiKey: string | null): { ok: boolean; reason?: string } {
  if (!apiKey) return { ok: false, reason: `Falta la API key. Configura ${envVarForProvider(provider)}.` };

  if (provider === "openai") {
    if (!apiKey.startsWith("sk-")) return { ok: false, reason: "OPENAI_API_KEY no parece válida (no empieza por 'sk-')." };
  }

  if (provider === "anthropic") {
    // Keep permissive but give a hint
    if (!apiKey.startsWith("sk-ant-")) {
      return { ok: true, reason: "ANTHROPIC_API_KEY no empieza por 'sk-ant-' (se acepta, pero revisa si falla)." };
    }
  }

  return { ok: true };
}

export function getAiProviderConfig(): AiProviderConfig {
  const provider = resolveAiProvider();
  const apiKey = getProviderApiKey(provider);

  return {
    provider,
    apiKey,
    hasKey: Boolean(apiKey),
    keyPrefix: apiKey ? safePrefix(apiKey) : "",
    keyTail: apiKey ? safeTail(apiKey) : "",
  };
}
