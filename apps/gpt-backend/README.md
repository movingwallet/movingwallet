¡Perfecto! Aquí tienes un **README detallado, profesional y claro** para el repositorio `gpt-backend`, ideal tanto para el equipo de MovingWallet como para colaboradores externos o incluso para otros proyectos que repliquen este backend.

---

## 📄 `apps/gpt-backend/README.md`

```md
# 🤖 GPT Backend – MovingWallet

Este es el backend especializado para **acciones programables** y conexión semántica con ChatGPT. Está diseñado como un **microservicio desacoplado**, reusable y extensible, ideal para monitorear, resumir, verificar y conectar el estado de MovingWallet (u otros proyectos) con IA.

---

## 🚀 ¿Qué hace este backend?

✅ Expone una API REST OpenAPI-compatible para conexión con GPT Actions  
✅ Guarda logs automáticamente de todas las interacciones  
✅ Genera resúmenes, analiza consistencia y facilita integración IA  
✅ Permite observar el estado actual del proyecto desde archivos markdown o datos de producción  
✅ Se puede reusar en múltiples proyectos como "IA bridge"

---

## 🗂️ Estructura

```
apps/gpt-backend/
├── actions/               # Lógica modular por dominio (resumen, github, etc.)
├── config/                # Configuración de MongoDB, GitHub, Pinecone
├── cron/                  # Tareas programadas (reindexado, snapshot, etc.)
├── data/                  # Archivos como `estado_actual.md` o `deploys.json`
├── docs/                  # Documentación interna
├── middleware/            # Auth + Logger HTTP
├── models/                # Esquemas de MongoDB (`Log`, etc.)
├── public/                # OpenAPI JSON accesible por GPT
├── routes/                # Endpoints REST agrupados
├── sistema/               # Ping y monitoreo
├── utils/                 # Funciones auxiliares (format, normalizar, etc.)
└── server.ts              # EntryPoint principal del backend
```

---

## 🔑 Variables de entorno

Configuralas en tu `.env`:

```env
API_TOKENS=gpt1token,gpt2token
MONGODB_URI=mongodb+srv://<usuario>:<clave>@cluster.mongodb.net/db
GITHUB_TOKEN=ghp_...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX_NAME=...
```

---

## 📦 Scripts

```bash
pnpm install      # Instala dependencias
pnpm dev          # Ejecuta con hot reload (ts-node-dev)
pnpm start        # Ejecuta en producción
pnpm build        # Transpila a JavaScript
```

---

## 🌐 Endpoints destacados

| Ruta | Descripción |
|------|-------------|
| `POST /api/ping` | Verifica si el backend está activo (`pong`) |
| `POST /api/resumen` | Devuelve el estado actual resumido del sistema |
| `POST /api/crear-entrada` | Crea una entrada de diario desde GPT |
| `POST /api/buscar-pinecone` | Busca semánticamente entre documentos |
| `POST /api/verificar-consistencia` | Evalúa si los documentos son coherentes |
| `GET /api/logs/vista` | Visualiza los últimos logs como tabla HTML |
| `GET /api/logs/json` | Devuelve los últimos logs en formato JSON |
| `GET /api/estado` | Muestra el estado actual (`estado_actual.md`) como HTML |

---

## 🧠 Uso con ChatGPT (Actions)

Este backend se integra con GPT Actions mediante su OpenAPI JSON:

```
https://app.movingwallet.io/gpt-actions-openapi-bbdd.json
```

---

¡Gracias por avisar! Aquí tienes la **continuación y finalización del README.md** con todo lo importante que faltaba, incluyendo licencias, pruebas, colaboraciones y visión futura del backend.

---

## 🛠️ To-Do (siguientes pasos sugeridos)

- [x] Visualización HTML de logs (`/api/logs/vista`)
- [x] Exposición de logs en JSON (`/api/logs/json`)
- [x] Render de estado actual desde markdown (`/api/estado`)
- [ ] 📄 Agregar endpoint `/api/estado/json` (opcional)
- [ ] 🧪 Agregar test unitarios y de integración (`vitest`, `supertest`)
- [ ] 📊 Desarrollar dashboard visual básico
- [ ] 🔁 Automatizar snapshots periódicos a Pinecone y deploys

---

## 🧪 Pruebas locales

Asegurate de tener `.env` completo y Mongo corriendo. Luego:

```bash
pnpm install
pnpm dev
```

Probar:

```bash
curl http://localhost:3000/api/ping
curl http://localhost:3000/api/logs/json
curl http://localhost:3000/api/estado
```

---

## 🤝 Contribuciones

Este backend está diseñado para ser reusable en múltiples proyectos. Si querés aportar mejoras:

1. Fork del repo
2. Crear una rama: `git checkout -b mejora-logger`
3. Hacer commit: `git commit -m "feat: logger más detallado"`
4. Hacer PR 🚀

---

## 🔐 Seguridad

Este backend no guarda tokens en disco. El acceso se valida por `x-api-token` en header. Podés agregar múltiples tokens separados por coma en `.env`.

---

## 🧬 ¿Cómo se conecta con el futuro frontend?

Desde la UI tipo DeBank o un dashboard, se podrá:

- Consultar estado con `/api/estado` y `/api/resumen`
- Ver errores del sistema con `/api/logs/json`
- Recibir recomendaciones de IA vía GPT conectado

---

## 📄 Licencia

MIT © [MovingWallet Team](https://movingwallet.io)

---

### ¿Querés que empaquete todo esto y lo deje listo para subir como `README.md` a tu repo directamente o querés que te lo genere en archivo descargable?