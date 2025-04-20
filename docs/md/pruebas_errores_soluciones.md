📅 Última actualización: abril 2025



🧪 **pruebas\_errores\_soluciones.md**

📋 Registro Técnico de Pruebas, Errores y Soluciones – *MovingWallet*



📐 **Formato del Registro**

Cada entrada sigue el formato:

|**Módulo**|**Fecha**|**Entorno**|**Error detectado**|**Solución aplicada**|**Prioridad**|**Notas / Enlace**|
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |



✅ **Tabla de pruebas recientes**

🧾 **Leyenda de Prioridad**

|**Prioridad**|**Descripción**|
| :-: | :-: |
|🔥 Alta|Bloquea el uso de la app o da errores críticos|
|🟡 Media|Fallos visuales, de UX o datos incorrectos|
|🟢 Baja|Estéticos o pequeños bugs sin impacto funcional|



🔗 **Integración con Issues (GitHub)**

- Las entradas con [#...] pueden enlazarse a issues en GitHub o tickets de Notion
- Las entradas deben reflejar el **resultado real del fix** (build pasó, error desapareció, test cubierto, etc.)



🧪 **Siguientes Pasos para QA**

|**Acción**|**Responsable**|**Estado**|
| :-: | :-: | :-: |
|Test automático conexión WC v2|QA / Dev|🔜 Pendiente|
|Verificación NFT multi-chain|QA|🔜 Pendiente|
|Test de duplicado de layouts|Dev|🔜 Pendiente|
|Test CSS unificado (Tailwind-only)|QA UI|🔜 Pendiente|
|Pruebas de carga Alchemy por red|QA API|🔜 Pendiente|




Vamos a dividir por tipo de datos para que tengas una estrategia clara sobre **dónde almacenar y consultar logs, tokens y eventos clave** de GitHub, Vercel, la web, IA y GPT-backend.



📦 **1. Tokens y credenciales (**⚠️ **sensibles)**

**Ubicación:** movingwallet/.env movingwallet/.env.development movingwallet/.env.production

**Datos típicos:**

- GITHUB\_TOKEN=...
- VERCEL\_API\_KEY=...
- OPENAI\_API\_KEY=...
- WALLETCONNECT\_PROJECT\_ID=...

**Buena práctica:** usar[ dotenv-flow](https://www.npmjs.com/package/dotenv-flow) para múltiples entornos y evitar subidas accidentales (reflejado en .gitignore).



📜 **2. Logs del frontend/web (usuarios, errores UI)**

**Ubicación recomendada:**

- packages/logger/ → módulo unificado
- Exporta logs desde:
  - apps/frontend/ (errores UI)
  - apps/gpt-backend/ (acciones IA)
  - apps/hardhat/ (transacciones)

**Backends sugeridos:**

- Desarrollo local: console.log, fs.appendFile
- Producción:
  - Sentry (frontend/backend)
  - Datadog, Logtail, o CloudWatch

**Ejemplo de uso:**

ts

CopiarEditar

import { logger } from "@movingwallet/logger"

logger.error("Fallo al cargar NFTs", { address, chainId })

logger.info("Conexión exitosa con GitHub", { repo })




🌐 **3. Logs del GPT-backend (acciones, errores, validaciones)**

**Ubicación local:** apps/gpt-backend/logs/ (por si querés un fallback local)

**Monitoreo:**

- Prometheus + Grafana (si hacés tracking semántico de acciones)
- Sentry para capturar errores al ejecutar acciones como leer\_google\_sheet o indexar\_md\_pinecone



🚀 **4. Deploy y métricas de Vercel**

- Vercel ya guarda **logs de compilación y errores** accesibles desde la web:
  - vercel.com/<tu-proyecto>/deployments

**Si querés trackearlo desde código:**

- Podés usar la Vercel REST API para:
  - Consultar despliegues
  - Obtener logs
  - Verificar rollback o canary deploy



📊 **Recomendación general de estructura**

plaintext

CopiarEditar

packages/

├── logger/                      # logger.ts unificado para todas las apps

│   ├── logToFile.ts             # en dev local

│   ├── logToSentry.ts           # producción

│   └── logToConsole.ts

apps/

├── frontend/

│   └── src/

│       └── hooks/useLogger.ts   # log de UI/UX

├── gpt-backend/

│   └── services/logger.ts       # wrapper para logs de acciones GPT

├── hardhat/

│   └── utils/logger.ts          # log de scripts y contratos





