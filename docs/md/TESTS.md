# Tests & CI (MovingWallet)

Este repositorio usa CI en GitHub Actions para validar:

1) **Smoke backend** (arranca servidor real + peticiones HTTP con `curl`)
2) **Tests** (Vitest vía `pnpm test` con TurboRepo)
3) **Diagnóstico cuando falla** (logs + resumen humano)

La idea es detectar:
- que el backend levanta,
- que los endpoints esenciales existen,
- que el sistema no depende de servicios externos para probar “salud”,
- y que cuando falle, haya logs/artifacts + pistas accionables.

---

## Workflows

### CI (`.github/workflows/ci.yml`)
Orquesta y encadena workflows reutilizables.

### Smoke Backend (`.github/workflows/smoke-backend.yml`)
Objetivo: validar que el backend:
- instala dependencias
- pasa tests unitarios
- arranca
- responde a endpoints básicos
- sube logs (`backend-smoke.log`) como artifact siempre (aunque falle)

### Explain Failure (`.github/workflows/explain-failure.yml`)
Solo se ejecuta si falla el smoke.
Imprime un resumen “humano” + hints y muestra el final de `backend-smoke.log`.

---

## 1) Smoke backend (GitHub Actions)

### Qué hace
- Instala dependencias (pnpm).
- Ejecuta tests (Vitest vía `pnpm test`).
- Arranca `apps/gpt-backend` en background.
- Espera a que `/health` responda `200`.
- Ejecuta:
  - `GET /api/ping`
- Si falla: sube `backend-smoke.log` como artifact y ejecuta “Explain Failure”.

### Por qué existe
A veces los tests unitarios pasan pero el servidor:
- no arranca por un error de env,
- falla al cargar rutas,
- crashea por imports,
- o rompe por un cambio en runtime.

El smoke lo caza de inmediato porque ejecuta el backend “de verdad”.

---

## 2) Tests (Vitest)

Los tests están en `apps/gpt-backend/tests/`.

### `smoke.test.ts`
Test de “contrato mínimo” del backend.

Comprueba (orientativo, puede variar según implementación):

1) `GET /health`
- Debe responder `200`
- Debe devolver `{ status: "ok", ... }` (o equivalente)

2) `GET /api/ping`
- Debe responder `200`
- Debe devolver `{ status: "ok", ... }` (o equivalente)

---

## 3) Multi-AI (preparado para varios proveedores)

El sistema está preparado para cambiar de proveedor sin tocar la estructura del CI:

- Selector:
  - `AI_PROVIDER`: `openai` | `anthropic` | `google` | `mistral` | (otros en el futuro)

- Secrets por proveedor (GitHub Actions Secrets):
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`
  - `GOOGLE_API_KEY`
  - `MISTRAL_API_KEY`

CI pasa estas variables al backend durante el smoke. Si el proveedor seleccionado no tiene key configurada, el backend fallará y “Explain Failure” mostrará hints específicos.

> Nota: en CI no se suben `.env`. Todo va por Secrets.

---

## 4) Cómo ejecutar en local

Desde la raíz:

- Instalar:
  - `pnpm install`

- Tests:
  - `pnpm test`

- Backend:
  - `pnpm --filter gpt-backend dev`

---

## 5) Troubleshooting rápido

### A) El smoke falla esperando `/health`
Causas típicas:
- El server no arranca / crashea
- Puerto incorrecto
- Falta alguna variable de entorno requerida

Acción:
- Revisar el artifact `backend-smoke.log` en GitHub Actions.
- Buscar errores de arranque (imports, config, runtime).

### B) Fallos por credenciales / cuotas del proveedor IA (caso real)
Síntomas típicos:
- 401 / 403 (key inválida, proyecto incorrecto, permisos)
- 429 (rate limit) o mensajes tipo “insufficient_quota”
- logs del backend muestran errores del proveedor

Causas:
- `AI_PROVIDER` apunta a un proveedor sin key configurada
- key inválida o revocada
- cuenta sin saldo / límites de facturación / cuota agotada

Acción:
1) GitHub → Settings → Secrets and variables → Actions
2) Configurar:
   - `AI_PROVIDER` (ej: `openai`)
   - la key correspondiente (ej: `OPENAI_API_KEY`)
3) Verificar saldo/cuota en el proveedor
4) Re-ejecutar workflow

### C) “Push blocked: secrets detected”
Causa:
- se intentó commitear una key (ej: `sk-...`) o dumps con secretos

Acción:
- eliminar archivos del repo (ej: `.env`, dumps) y purgar historial si hizo falta
- rotar keys filtradas
- usar Secrets en GitHub Actions
