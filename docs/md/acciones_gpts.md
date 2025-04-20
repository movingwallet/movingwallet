📅 Última actualización: abril 2025




📌 **Acciones programables en el GPT de MovingWallet**



🧠 **Objetivo General**

Construir un sistema de acciones progresivo que permita a un GPT personalizado actuar como:

- Asistente de desarrollo  
- Documentador técnico  
- Supervisor de consistencia  
- Conector entre sistemas (GitHub, Google Sheets, Pinecone)  



🔹 **FASE 0 – Setup del entorno (Día 1)**

|**Tarea**|**Descripción**|
| :-: | :-: |
|🛠️ gpt-backend/acciones/|Estructura inicial modular para acciones|
|📦 Instalar SDKs|Google APIs, GitHub Octokit, Pinecone client, dotenv|
|🔑 .env config|Variables: tokens, client IDs, claves API|
|🚀 Deploy|A Vercel / Render / Railway para exponer endpoints al GPT|



🔹 **FASE 1 – Acciones Core (Días 2–3)**

|**Acción**|**Descripción**|
| :-: | :-: |
|✅ leer\_archivo\_github|Lee archivos .md, .json, .ts directamente desde repositorios GitHub|
|✅ agregar\_tarea\_excel|Añade tareas al roadmap alojado en Google Sheets|
|✅ leer\_google\_sheet|Recupera tareas, estados, prioridades desde Sheets|
|✅ indexar\_md\_pinecone|Convierte .md a embeddings y los sube a Pinecone|
|✅ buscar\_error\_tecnico|Busca errores por red, módulo o palabra clave en Pinecone|



🔹 **FASE 2 – Acciones Supervisoras (Días 4–5)**

|**Acción**|**Descripción**|
| :-: | :-: |
|🔍 verificar\_resultado\_accion|Consulta Google, GitHub o Pinecone para confirmar ejecución correcta|
|🔁 reintentar\_accion|Reintenta automáticamente si la verificación falla|
|📥 crear\_nueva\_entrada\_diario|Documenta errores, soluciones o ideas en el .md correspondiente|



🔹 **FASE 3 – Acción Compuesta Inteligente (Días 5–6)**

|**Acción**|**Descripción**|
| :-: | :-: |
|🧠 gpt\_acceso\_inteligente|Analiza el input del usuario y redirige al backend adecuado|



🔹 **FASE 4 – Automatización IA + Versión Ampliada (Días 7–10)**

|**Acción**|**Descripción**|
| :-: | :-: |
|🧠 generar\_commit\_mensaje|Crea mensajes de commit semánticos a partir de cambios|
|📚 resumir\_estado\_actual|Resume el avance técnico, errores y tareas|
|🛡️ verificar\_consistencia\_documentacion|Chequea coherencia entre archivos .md técnicos|
|📊 generar\_presentacion\_pitch|Crea un pitch deck técnico con visión y arquitectura|



🔹 **FASE 5 – Escalado de fuentes y casos de uso (Días 11–15)**

|**Integración**|**Descripción**|
| :-: | :-: |
|🧾 APIs Blockchain|CoinGecko, Etherscan, Solana, etc. para alimentar IA en tiempo real|
|🧩 LLM + RAG|GPT responde con documentación actualizada vía Pinecone|



📁 **Estructura recomendada del proyecto gpt-backend**

/gpt-backend/

├── actions/                  # 🤖 Acciones organizadas por dominio

│   ├── github/               # 📂 leer\_archivo\_github, commit, etc.

│   ├── google/               # 📄 leer\_google\_doc, sheets

│   ├── pinecone/             # 🧠 embeddings, búsqueda semántica

│   ├── documentacion/        # 📓 diario técnico, entradas .md

│   ├── supervisores/         # 🧪 verificar\_resultado, retry

│   └── generales/            # 🔧 acceso inteligente, resumen

├── routes/                   # Endpoints consumidos por el GPT

├── utils/                    # auth, parser, logger, embeddings

├── data/                     # Archivos `.md` locales o simulados

├── .env                      # Claves de API

├── tsconfig.json

└── server.ts (o app.ts)




🔧 **Acciones recomendadas adicionales**

|**Acción**|**Propósito**|
| :-: | :-: |
|📄 leer\_google\_doc|Leer specs y feedback desde Google Docs (requiere OAuth)|
|🔄 sincronizar\_docs\_repositorio|Comparar archivos locales y remotos para detectar diferencias|
|🧠 consultar\_embedding\_pinecone|Buscar en documentos con semántica vía Pinecone|
|✅ generar\_commit\_mensaje|Crear mensajes de commit y sugerir nombres de branch o PR|



🧠 **Uso combinado del GPT**

|**Función**|**GPT Personalizado (asistente técnico)**|**GPT en MovingWallet App**|
| :-: | :-: | :-: |
|Diseño y arquitectura|✅|–|
|Generación de roadmap|✅|–|
|Documentación técnica|✅|–|
|Llamadas a OpenAI para usuarios|–|✅|
|IA contextualizada por portafolio|–|✅|
|Análisis de activos|–|✅|



🧩 **Comportamiento esperado del GPT**

Este GPT:

- Lee y actualiza archivos .md versionados.  
- Ejecuta acciones programadas según estructura modular.  
- Detecta inconsistencias y propone soluciones.  
- No guarda datos del usuario ni ejecuta transacciones blockchain.  
- Está diseñado como asistente técnico y documental para MovingWallet.  




