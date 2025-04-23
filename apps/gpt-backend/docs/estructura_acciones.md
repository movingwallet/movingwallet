## 🧠 Guía de Estructura de Acciones GPT – MovingWallet

Este documento describe cómo deben estructurarse las acciones del backend `gpt-backend` para MovingWallet. Todas las acciones deben ser:

- Modulares (una por archivo)
- Claras en su propósito (por dominio: GitHub, Vercel, Pinecone, Documentos, etc.)
- Reutilizables y testeables

---

### 📁 Carpeta raíz: `apps/gpt-backend/actions/`

```bash
actions/
├── github/
│   ├── getCommits.ts
│   └── getCIStatus.ts
├── vercel/
│   └── getDeploys.ts
├── pinecone/
│   ├── indexar.ts
│   └── buscar.ts
├── documentacion/
│   ├── compararMdLocales.ts
│   └── crearEntradaDiario.ts
├── resumen/
│   └── generarEstadoActual.ts
