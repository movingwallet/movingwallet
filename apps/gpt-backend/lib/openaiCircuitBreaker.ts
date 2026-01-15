let failureCount = 0;
let lastFailureAt = 0;

const FAILURE_THRESHOLD = 5; // cuántos fallos seguidos abren el circuito
const COOLDOWN_MS = 30_000; // cuánto tiempo esperamos antes de permitir llamadas otra vez

export function canCallOpenAI() {
  if (failureCount < FAILURE_THRESHOLD) return true;
  return Date.now() - lastFailureAt > COOLDOWN_MS;
}

export function recordSuccess() {
  failureCount = 0;
  lastFailureAt = 0;
}

export function recordFailure() {
  failureCount++;
  lastFailureAt = Date.now();
}

export function getCircuitState() {
  return {
    failureCount,
    lastFailureAt,
    isOpen: failureCount >= FAILURE_THRESHOLD,
    cooldownMs: COOLDOWN_MS,
    threshold: FAILURE_THRESHOLD,
  };
}
