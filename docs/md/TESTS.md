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




# Tests & Smoke checks

Este repo usa CI en GitHub Actions. La intención es:
- detectar fallos rápido
- explicar cada fallo
- evitar bloqueos tontos (ej: YAML, secretos, etc.)

## Workflows

### CI (`.github/workflows/ci.yml`)
Orquesta la ejecución llamando a workflows reutilizables.

### Smoke Backend (`.github/workflows/smoke-backend.yml`)
Objetivo: validar que el backend:
- instala dependencias
- pasa tests unitarios
- arranca
- responde a endpoints básicos

---

## Checks (qué prueba cada uno)

### 1) Unit tests
**Qué prueba:** lógica del backend (vitest).
**Si falla:** romperá CI antes de levantar servidor.
**Acción:** mirar el output de vitest y corregir el test o la lógica.

### 2) Wait for `/health`
**Qué prueba:** que el servidor arranca y acepta tráfico.
**Si falla:**
- el server no arrancó
- puerto incorrecto
- fallo de runtime (crash)
**Acción:** revisar `backend-smoke.log` en los logs del job.

### 3) Smoke: GET `/api/ping`
**Qué prueba:** routing básico del API.
**Si falla:**
- rutas cambiadas
- middleware/headers rompen respuesta
- server no está listo realmente
**Acción:** revisar logs y probar local con curl.

---

## Caso real: OpenAI sin saldo / API key inválida

**Síntoma típico:**
- endpoints que llaman a OpenAI fallan con 401/429
- en logs aparece error de API key o “insufficient_quota”

**Causa:**
- `OPENAI_API_KEY` inválida o sin crédito
- el secret no está configurado en GitHub

**Acción:**
1) En GitHub → Settings → Secrets and variables → Actions
2) Añadir/actualizar `OPENAI_API_KEY`
3) Rotar la key si se filtró
4) Re-ejecutar workflow

Nota: En CI no se suben `.env`. Todo va por Secrets.
