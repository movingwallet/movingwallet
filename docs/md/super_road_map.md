📅 Última actualización: abril 2025

**ROADMAP PARA AYUDAR EN EL CAMINO. NO SON OBLIGATORIOS TODOS LOS PASOS, DESARROLLOS, TECNOLOGÍAS. ESTO AYUDAR A LLEVAR UN CAMINO PARA LLEGAR AL OBJETIVO:**

**🧱 **Organización general del repositorio**

- Estructurar carpetas iniciales: src/, components/, features/, pages/ o app/
- Crear README base con instrucciones mínimas
- Agregar CONTRIBUTING.md (opcional, si va a colaborar más gente)
- Agregar LICENSE (MIT o similar, si es open source)
- Crear .env.example con todas las variables necesarias
- Subir .editorconfig y configurar reglas de estilo (Prettier, ESLint)
- Configurar alias en Vite o Next.js para imports limpios (@/components, etc.)
- Etiquetar primeros issues en GitHub para dividir el trabajo (tipo “good first issue”, “infra”, etc.)



⚙️ **GitHub Actions (CI)**

- Workflow de lint + build automático al hacer push o pull request
- Workflow de deploy preview en branches (staging)
- Protección de branch main con PR obligatorio



☁️ **Vercel setup**

- Conectar el repo a Vercel
- Verificar que detecta el framework correctamente (Vite/Next/React)
- Definir variables de entorno en Vercel
- Habilitar previews por PR
- Configurar dominio custom o subdominio temporal (movingwallet.vercel.app)



🧪 **QA y documentación**

- Crear un changelog inicial (CHANGELOG.md con formato semver)
- Agregar sección de preguntas frecuentes o decisiones técnicas (tipo docs/decisiones.md)
- Establecer convención de commits (Convencional Commits o similar)
- Automatizar versión / changelog (con semantic-release, por ejemplo)



🎯 **Roadmap y visión del producto**

- Crear ROADMAP.md o gestionarlo en Notion/Trello
- Dividir tareas por fases (MVP, post-MVP)
- Definir prioridades de UI/UX (empezar tipo DeBank como guía)
- Acordar arquitectura mínima para el MVP (por ejemplo, sin backend, solo frontend + mock de IA)




🧱 **Organización general del repositorio**

- Estructurar carpetas iniciales: src/, components/, features/, pages/ o app/
- Crear README base con instrucciones mínimas
- Agregar CONTRIBUTING.md (opcional, si va a colaborar más gente)
- Agregar LICENSE (MIT o similar, si es open source)
- Crear .env.example con todas las variables necesarias
- Subir .editorconfig y configurar reglas de estilo (Prettier, ESLint)
- Configurar alias en Vite o Next.js para imports limpios (@/components, etc.)
- Etiquetar primeros issues en GitHub para dividir el trabajo (tipo “good first issue”, “infra”, etc.)



⚙️ **GitHub Actions (CI)**

- Workflow de lint + build automático al hacer push o pull request
- Workflow de deploy preview en branches (staging)
- Protección de branch main con PR obligatorio



☁️ **Vercel setup**

- Conectar el repo a Vercel
- Verificar que detecta el framework correctamente (Vite/Next/React)
- Definir variables de entorno en Vercel
- Habilitar previews por PR
- Configurar dominio custom o subdominio temporal (movingwallet.vercel.app)



🧪 **QA y documentación**

- Crear un changelog inicial (CHANGELOG.md con formato semver)
- Agregar sección de preguntas frecuentes o decisiones técnicas (tipo docs/decisiones.md)
- Establecer convención de commits (Convencional Commits o similar)
- Automatizar versión / changelog (con semantic-release, por ejemplo)



🎯 **Roadmap y visión del producto**

- Crear ROADMAP.md o gestionarlo en Notion/Trello
- Dividir tareas por fases (MVP, post-MVP)
- Definir prioridades de UI/UX (empezar tipo DeBank como guía)
- Acordar arquitectura mínima para el MVP (por ejemplo, sin backend, solo frontend + mock de IA)



¿Querés que te prepare esta lista como un board para Trello, Notion o archivo markdown editable?

**Tú dijiste:**

Cual sería el siguiente listado?

**ChatGPT Plus**

Buenísimo, ya que tenemos la **fase de organización base** casi completa, el siguiente listado natural sería el de tareas de la **Fase de Implementación del MVP** de MovingWallet, siguiendo la idea de:

- UI tipo **DeBank / MetaMask Portfolio**
- React + Vite + TailwindCSS + shadcn/ui
- Sin backend, IA tipo dummy, conexión WalletConnect



🧪 **Implementación MVP - Parte 1: Estructura UI + Lógica base**

🏗 **Estructura y navegación**

- Configurar rutas con React Router o estructura de páginas (depende del setup)
- Implementar layout principal:
  - Header minimal con logo
  - Sidebar fijo con:
    - Botón "Conectar Wallet"
    - Módulo de wallet conectada (shortened address + copiar + desconectar)
    - Acceso directo a módulo de IA

🧬 **Secciones principales (tabs tipo DeBank)**

- Tokens
- NFTs
- Historial
- IA (dummy)
- Redes (multichain)

📊 **Tabla de portafolio**

- Renderizar activos por:
  - Cuenta
  - Cadena
  - Red
  - Estado (spam o no)
- Columnas:
  - Checkbox de selección
  - Token
  - Red
  - Balance
  - Valor USD
  - Precio de compra
  - Valor a mover
  - Botón de mover



🌐 **Conexión Wallet**

- Agregar soporte WalletConnect v2
- Conexión anónima sin almacenamiento persistente
- Mostrar info básica de la wallet conectada
- Implementar desconexión



🧠 **IA Dummy**

- Crear un mock con respuestas tipo:
  - "Podés consolidar 3 tokens similares en la red Optimism"
  - "Riesgo detectado en red Polygon"
- Mostrar recomendaciones en módulo IA



💅 **UI & Styling**

- Base de componentes shadcn/ui
- Theming con Tailwind (modo oscuro?)
- Componente Card, Table, Button, Tag, Dialog



🧱 **Modularización de código**

- Crear carpetas features/, components/, lib/
- Separar lógica por features (ej. wallet/, portfolio/, ai/)

🧭 **Siguientes pasos (acción directa)**

**1.** 📂 **Inicializar estructura del proyecto**

- Crear repo en GitHub (si no está)
- Clonar y configurar estructura base: src/, components/, features/, etc.
- Agregar Vite + React + TypeScript + TailwindCSS + shadcn/ui
- Subir README.md, PROJECT\_STATUS.md, .gitignore, .env.example

**2.** 🔌 **Integrar conexión con Wallet**

- Instalar WalletConnect v2
- Implementar hook useWallet() para conectar y mostrar dirección
- Diseñar el módulo de wallet en el sidebar (acortar dirección, copiar, desconectar)

**3.** 🧱 **Diseñar el layout principal**

- Layout base con Tailwind y shadcn
- Header con logo (placeholder)
- Sidebar con navegación y conexión wallet
- Main panel con tabs tipo DeBank (Tokens, NFTs, Historial, IA, Redes)

**4.** 💻 **Mock de portafolio**

- Crear estructura de mock data para portafolio
- Renderizar tabla con tokens y valores
- Usar componentes reutilizables (Table, Badge, Button, etc.)

**5.** 🧠 **Crear dummy IA module**

- Componente básico con sugerencias generadas aleatoriamente o hardcoded
- Mostrar análisis tipo: consolidar, riesgo, mover

**6.** ☁️ **Conectar con Vercel**

- Conectar repo a Vercel
- Agregar variables de entorno necesarias
- Verificar despliegue automático en push
- Probar preview deploys por branch/pull request



🎯 **Opcional pero recomendado**

- Subir roadmap a Notion o Trello
- Etiquetar issues iniciales en GitHub
- Definir milestones (MVP, Beta, Público)


🔁 **Próxima tanda de tareas (Fase MVP+)**

**1.** 🔍 **Integración real de activos**

- Usar viem, ethers.js o wagmi (según decisión) para obtener:
  - Balances de tokens en EVMs
  - NFTs (ERC-721 / ERC-1155) por dirección
  - Historial de transacciones (puede ser con APIs como Covalent, Alchemy, o directamente desde chain)
- Soporte multi-chain básico (Ethereum, Optimism, Arbitrum, Polygon)
- Filtrado de tokens spam o inactivos

**2.** 📄 **Tablas con lógica de acción**

- Agregar selección múltiple de tokens con checkboxes
- Calcular valor total seleccionado
- Agregar campo "valor a mover" editable
- Agregar botón de acción para “mover consolidación” (mockeado o no)

**3.** 🔗 **Simulación de consolidación / migración**

- Simular qué pasaría si el usuario consolida tokens en una sola red
- Crear lógica dummy para mover assets a una red sugerida (solo UI por ahora)

**4.** 🧠 **Evolución del módulo de IA (modo avanzado)**

- Módulo que detecta patrones de riesgo (ej. tokens poco líquidos)
- Sugerencias personalizadas según portafolio
- Opciones: "Aceptar sugerencia", "Ignorar", "Marcar como irrelevante"

**5.** 🧪 **Tests & QA**

- Testeo visual de componentes (usando Storybook o Vitest)
- Agregar test mínimo por feature (por ejemplo: conexión wallet, render de portafolio)
- Revisión de accesibilidad básica (colores, foco, navegación con teclado)

**6.** 🔐 **Seguridad / Privacidad**

- Verificar que no se guarde ninguna clave privada ni sesión persistente
- Controlar errores si el usuario rechaza permisos/metamask/etc.
- Agregar advertencia visual si se intenta operar sin wallet conectada


🚀 **Etapas finales y visión extendida de MovingWallet**

🏗️ **1. Backend opcional / API de soporte**

- Montar un backend mínimo con FastAPI para servir:
  - Historial propio (caching, indexing)
  - Recomendaciones personalizadas
  - Integración de IA real
- Base de datos opcional (PostgreSQL o SQLite) para tokens favoritos, listas personalizadas, etc.



🤖 **2. IA real (no dummy)**

- Llamadas a un modelo LLM (OpenAI, Mistral, etc.)
- Embedding del portafolio del usuario
- Análisis vectorial con Pinecone o Weaviate para comparar contra miles de otros portafolios
- Ranking de riesgo / sugerencias en tiempo real



📡 **3. Indexación e interoperabilidad**

- Integración con APIs externas: DeBank, Zapper, Covalent, Moralis, Alchemy
- Soporte para tokens en Solana (via Helius, Solana RPCs)
- Soporte para Bitcoin balances (via Electrum o APIs tipo Blockstream)



🎨 **4. UX avanzada**

- Modos visuales: gráfico de torta, comparativa por red
- Tagging de tokens: stablecoins, shitcoins, bluechips
- Histórico de migraciones hechas y acciones de IA
- Multilenguaje



💳 **5. Operaciones reales (fase final)**

- Integrar swaps usando agregadores (1inch, CowSwap, Uniswap)
- Función "Mover" que realmente ejecute transferencias o puentes entre redes
- Simulación de fees y estimaciones de gas
- Protección contra frontrunning y validaciones de seguridad



🧰 **6. Mantenimiento y comunidad**

- Sistema de feedback desde la app
- Feature flags para probar funciones nuevas
- Sistema de permisos para usuarios pro
- Versión móvil responsive y/o app wrapper (Capacitor o Expo)



📈 **7. Escalabilidad y despliegue**

- Monitoreo con Prometheus + Grafana (si hay backend)
- Logs con Sentry o LogRocket
- Deploys con staging, QA, producción
- Tests E2E con Playwright o Cypress

🧩 **Arquitectura técnica y DX (Developer Experience)**

- **Configurar Storybook** desde el inicio para documentar componentes visuales reutilizables.
- **Uso de pnpm** o **Bun** para manejo de dependencias más eficiente (opcional).
- **Testing básico con Vitest** desde el día uno para evitar deuda técnica.
- **Configurar Git Hooks** con husky + lint-staged para evitar commits con errores.
- **Configurar Path Intellisense / Auto-imports** con jsconfig o tsconfig paths.



🔐 **Seguridad desde el diseño**

- **CSP (Content Security Policy)** en el HTML base si se apunta a producción futura.
- **Validaciones de red activa**: bloquear redes no soportadas desde el frontend.
- **Timeout de sesión visual** (aunque no se guarde nada, reforzar experiencia segura).
- **Renderizado condicional por red** (por ejemplo: ocultar NFTs si no hay soporte en esa chain).



🧭 **Navegación UX / UI**

- **Breadcumbs o tags de red activa** para dejar claro contexto multichain.
- **Modo compacto / expandido del sidebar** (para mobile más adelante).
- **Animaciones de carga** o placeholders esqueleto para tokens / tablas.
- **Fallback de imágenes** para tokens o NFTs sin metadata (loading, imagen rota, etc.).



📦 **Distribución / despliegue extendido**

- **Wrapper para app móvil** (Capacitor, Expo, PWA).
- **Soporte offline mínimo** con Service Worker (p. ej. mostrar último snapshot del portafolio).
- **Verificación de build size y performance** (Lighthouse, Vite bundle visualizer).



📣 **Comunidad y contribuciones**

- **Archivo CODE\_OF\_CONDUCT.md** básico.
- **Plantillas de Pull Request y Issues**.
- **Etiqueta “needs design” o “ai suggestion”** para tareas que pueden beneficiarse de input externo.
- **Widget de feedback simple en la app** (aunque solo guarde localmente o abra un GitHub issue prellenado).



📘 **Estructura de Documentación MovingWallet (v0.1)**

Este documento sirve como índice general para organizar y complementar la documentación actual y futura del proyecto MovingWallet. A continuación, se detalla qué archivo .md se usa para cada objetivo, y se agregan sugerencias para nuevos documentos clave.



🧱 **Archivos existentes y su función:**

- **resumen\_objetivos.md** Describe la visión general, las metas estratégicas del proyecto y los objetivos técnicos principales.
- **documentacion\_tecnica\_movingwallet.md** Contiene detalles de arquitectura técnica, flujos de trabajo y tecnologías utilizadas.
- **guia\_chat\_movingwallet.md** Instrucciones sobre cómo usar el asistente de IA interno del proyecto.
- **pruebas\_errores\_soluciones.md** Registro de pruebas realizadas, bugs detectados y soluciones implementadas.
- **documentacion\_errores\_y\_soluciones.md** Detalla errores frecuentes, cómo reproducirlos y cómo solucionarlos.
- **guia\_de\_desarrollo\_movingwallet.md** Explica el flujo de desarrollo, estructura del proyecto y comandos útiles.
- **guia\_tecnica\_movingwallet.md** Recomendaciones de buenas prácticas, organización de features y modularidad del código.
- **roadmap\_funcional.md** Enumera los hitos técnicos del proyecto, fases del MVP y próximas tareas.
- **glosario\_movingwallet.md** Define términos clave del entorno cripto y de la app.
- **casos\_uso\_usuario.md** Describe escenarios de uso típicos del usuario y flujos esperados.
- **seguridad\_privacidad.md** Describe políticas de seguridad, validaciones básicas y privacidad de datos.
- **configuracion\_entornos.md** Explica cómo preparar los entornos de desarrollo, staging y producción, además del uso de archivos .env.



🆕 **Archivos sugeridos para crear:**

- **README.md** Guía rápida para levantar el proyecto, tecnologías utilizadas, estructura y enlaces útiles.
- **PROJECT\_STATUS.md** Estado actual del proyecto: qué se completó, qué está en progreso, qué falta. Enlaces a deploys o pull requests importantes.
- **CHANGELOG.md** Registro ordenado de cambios del proyecto, con formato de versiones semánticas.
- **CONTRIBUTING.md** Instrucciones para contribuir al proyecto, cómo levantarlo, reglas de estilo, convención de commits, etc.
- **.env.example** Archivo con todas las variables de entorno necesarias para correr el proyecto de forma local, con explicaciones.
- **docs/decisiones.md** Registro de decisiones técnicas clave y las razones detrás de ellas.
- **docs/preguntas\_frecuentes.md** Respuestas rápidas sobre decisiones técnicas y funcionales del proyecto.
- **.github/ISSUE\_TEMPLATE.md** Plantilla para issues en GitHub para mantener orden y claridad.
- **.github/PULL\_REQUEST\_TEMPLATE.md** Plantilla para pull requests, detallando qué se hizo, cómo probarlo y qué revisar.
- **CODE\_OF\_CONDUCT.md** (opcional) Código de conducta para colaboradores, en caso de hacerlo público u open source.



📂 **Sugerencia de estructura de carpetas del repositorio:**

- /docs Contendrá archivos como decisiones técnicas, preguntas frecuentes y guía general del repo.
- Archivos raíz:
  - README.md
  - PROJECT\_STATUS.md
  - CHANGELOG.md
  - CONTRIBUTING.md
  - .env.example


🧭 **Modelo de Donación Integrado al Flujo de “Mudanza” (Migración de Activos)**

🧱 **Estructura del flujo (2 variantes):**

**Versión estándar (sin donación):**

1. Seleccionar tokens a mover.
1. Elegir red de destino.
1. Confirmar operación.

**Versión con donación (por defecto, editable):**

1. Seleccionar tokens a mover.
1. Elegir red de destino.
1. **Elegir si quiere donar** (opcional, pero visible).
1. Confirmar operación.

🔁 El paso 3 puede incluir:

- Monto sugerido (ej. 1, 5, 10 USDC).
- Opción “No, gracias” (desactiva la donación).
- Wallet o botón de transferencia directa.
- Mensaje de agradecimiento personalizado si dona.



✅ **Ventajas de este enfoque**

- Natural y contextual: el usuario ya está gestionando activos.
- No obligatorio.
- No molesta: puede omitirse y seguir el flujo sin fricción.



💸 **Formas de donación sencillas y gratuitas a integrar**

**1. On-chain (recomendado)**

- Donación directa a una dirección (EVM) visible en la app.
- Monto editable o botones rápidos: 0.5, 1, 5 USDC/DAI/etc.

**2. QR escaneable / botón “copiar dirección”**

- Mostrarlo en el paso 3 del flujo o en una sección fija del dashboard.

**3. GitHub Sponsors o Ko-fi / BuyMeACoffee**

- Si el repo se abre, pueden usarse como formas de apoyo sin código cripto.

**4. Gitcoin Grants (si aplica en el futuro)**

- Ideal si el proyecto se alinea con valores de ecosistema Ethereum.




**ROADMAP TÉCNICO – Acciones para el GPT MovingWallet**

**Stack base: Node.js (TypeScript) + Express/Next.js API routes**



🔹 **FASE 0 – Setup del entorno (día 1)**

|**Tarea**|**Descripción**|
| :-: | :-: |
|🛠️ gpt-backend/acciones/|Estructura inicial modular para acciones|
|📦 instalar SDKs|Google APIs, GitHub Octokit, Pinecone client, dotenv|
|🔑 .env config|Variables: tokens, client IDs, claves API|
|🚀 deploy|A Vercel / Render / Railway para exponer endpoints a GPT|



🔹 **FASE 1 – Acciones core (días 2-3)**

|**Acción**|**Descripción**|
| :-: | :-: |
|✅ leer\_archivo\_github|Lee archivos .md, .json, .ts desde repos|
|✅ agregar\_tarea\_excel|Añade tareas al roadmap Google Sheets|
|✅ leer\_google\_sheet|Permite recuperar tareas, estados, prioridades|
|✅ indexar\_md\_pinecone|Convierte .md a embeddings + los sube a Pinecone|
|✅ buscar\_error\_tecnico|Busca en Pinecone errores por red, módulo, palabra clave|



🔹 **FASE 2 – Acciones supervisoras (días 4-5)**

|**Acción**|**Descripción**|
| :-: | :-: |
|🔍 verificar\_resultado\_accion|Consulta la fuente (Google, GitHub, Pinecone) para confirmar que una acción anterior funcionó|
|🔁 reintentar\_accion|Reejecuta automáticamente si la verificación falla|
|📥 crear\_nueva\_entrada\_diario|Documenta un nuevo error, solución o idea en el .md correcto (luego se indexa)|



🔹 **FASE 3 – Acción compuesta inteligente (días 5-6)**

|**Acción**|**Descripción**|
| :-: | :-: |
|🧠 gpt\_acceso\_inteligente|El GPT analiza el input del usuario y redirige al backend adecuado: GitHub, Google, Pinecone, etc.|



🔹 **FASE 4 – Automatización IA + versión ampliada (días 7-10)**

|**Acción / Sistema**|**Descripción**|
| :-: | :-: |
|🧠 generar\_commit\_mensaje|A partir de una modificación, crea un commit message semántico|
|📚 resumir\_estado\_actual|GPT resume el avance técnico, errores y tareas por hacer|
|🛡️ verificar\_consistencia\_documentacion|Chequea coherencia entre archivos (objetivos vs roadmap, etc.)|
|📊 generar\_presentacion\_pitch|GPT crea un mini pitch deck con visión, arquitectura y ventajas competitivas|



🔹 **FASE 5 – Escalado de fuentes y casos de uso (días 11-15)**

|**Integración**|**Descripción**|
| :-: | :-: |
|🧠 Notion API|Leer y escribir páginas técnicas, usarlo como interfaz para roadmap|
|🟣 Discord Bot|Comando /gpt mover error → actualiza el archivo .md + lo indexa|
|🧾 API Etherscan, Solana, etc.|Obtener data real para alimentar análisis IA contextualizados|
|🧩 LLM+RAG|GPT que responde a partir de toda la documentación actualizada en tiempo real via Pinecone|



🧰 **ESTRUCTURA DE PROYECTO EN NODE.JS (SUGERIDA)**

pgsql

CopiarEditar

/gpt-backend/

├── actions/

│   ├── github/

│   ├── google/

│   ├── pinecone/

│   ├── documentacion/

│   ├── supervisores/

│   └── generales/

├── routes/                  ← API endpoints para consumir desde el GPT

├── utils/                   ← auth, parser, embeddings, logger

├── data/                    ← archivos indexados localmente o simulaciones

├── .env

├── tsconfig.json

└── server.ts (o app.ts)






