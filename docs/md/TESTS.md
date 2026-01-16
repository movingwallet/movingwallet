# Tests & CI (MovingWallet)

Este repositorio usa un flujo CI en GitHub Actions que ejecuta:

1) **Smoke backend** (arranca servidor real + peticiones HTTP con curl)
2) **Tests** (Vitest vía `pnpm test` con TurboRepo)

La idea es detectar:
- que el backend levanta,
- que los endpoints esenciales existen,
- que no dependemos de servicios externos para validar “salud” del sistema,
- y que cuando falle, haya logs/artifacts para diagnosticar rápido.

---

## 1) Smoke backend (GitHub Actions)

### Qué hace
- Instala dependencias (pnpm).
- Arranca `apps/gpt-backend` en background.
- Espera a que `/health` responda 200.
- Ejecuta:
  - `GET /api/ping`
  - `GET /api/debug/openai` (modo diagnóstico: **no requiere key real**)
- Si falla: sube `backend-smoke.log` como artifact.

### Por qué existe
A veces los tests unitarios pasan pero el servidor:
- no arranca por un error de env,
- falla al cargar rutas,
- crashea por imports,
- o rompe por un cambio en el runtime.

El smoke lo caza de inmediato porque ejecuta el backend “de verdad”.

---

## 2) Tests (Vitest)

Los tests están en `apps/gpt-backend/tests/`.

### `smoke.test.ts`
Es un test de “contrato mínimo” del backend.

Comprueba:

1) `GET /health`
- Debe responder `200`
- Debe devolver `{ status: "ok", traceId: "..." }` (o equivalente)
- Sirve para verificar que el server está vivo.

2) `GET /api/ping`
- Debe responder `200`
- Debe devolver `{ status: "ok", timestamp: "..." }` (o equivalente)
- Sirve para comprobar routing base y middlewares.

3) `GET /api/debug/openai` (diagnóstico)
- Debe responder `200`
- Debe devolver una estructura JSON estable con campos de diagnóstico (ej: `hasKey`, `keyPrefix`, etc.)
- **No depende de que OpenAI funcione**.

#### Importante: OpenAI y “key válida pero sin saldo”
En ocasiones el error no es “key incorrecta”, sino:
- cuenta sin saldo / sin créditos,
- “insufficient_quota”,
- límites de facturación,
- bloqueos del proyecto.

Ese tipo de fallo aparece cuando se llama a la API real (por ejemplo al hacer un completions / responses).

Para evitar que el CI sea frágil:
- Los tests NO llaman a OpenAI.
- Validan que el endpoint diagnóstico existe y da forma de respuesta consistente.

**Recomendación operativa:**
- Para verificar OpenAI en local, hacerlo a propósito con un endpoint “manual” o un flag,
  pero nunca como requisito del CI.

---

## 3) Cómo ejecutar en local

Desde la raíz:

- Instalar:
  - `pnpm install`

- Tests:
  - `pnpm test`

- Backend:
  - `pnpm --filter gpt-backend dev`

---

## 4) Troubleshooting rápido

### A) “Missing OPENAI_API_KEY”
No debería tumbar el servidor si el backend
