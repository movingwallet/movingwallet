import { loadEnv } from "@/config/schema.env";

export type ControlMode = "read_only" | "pr_only" | "full";

export type ControlAction =
  | "github_pr"        // crear PRs / branches
  | "events_write"     // escribir eventos (si lo tratamos como write)
  | "dangerous_write"; // reservado para futuras acciones (merge, deletes, etc.)

export function getControlMode(): ControlMode {
  const env = loadEnv();
  return (env.CONTROL_MODE || "read_only") as ControlMode;
}

export function can(action: ControlAction): boolean {
  const mode = getControlMode();

  // ✅ Siempre permitido: en esta fase, events es útil para auditoría.
  if (action === "events_write") return true;

  if (mode === "read_only") {
    // Nada que cambie GitHub o infraestructura
    if (action === "github_pr") return false;
    if (action === "dangerous_write") return false;
    return false;
  }

  if (mode === "pr_only") {
    // Permitimos PRs, pero no acciones peligrosas
    if (action === "github_pr") return true;
    if (action === "dangerous_write") return false;
    return false;
  }

  // mode === "full"
  return true;
}

export function assertCan(action: ControlAction) {
  if (can(action)) return;

  const mode = getControlMode();
  const err = Object.assign(
    new Error(`Action "${action}" blocked by CONTROL_MODE="${mode}"`),
    {
      status: 403,
      code: "control_mode_blocked",
      action,
      controlMode: mode,
    }
  );

  throw err;
}
