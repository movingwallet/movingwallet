# 📘 Endpoints disponibles – GPT Backend MovingWallet

### 🔍 GitHub
- `GET /github/:repo` → Último commit de un repo público

### 🧠 Pinecone
- `POST /pinecone/buscar` → Buscar texto contextual en documentos indexados
- `POST /pinecone/indexar` → Indexar archivos `.md` locales

### 📄 Documentación
- `POST /documentacion/crear-entrada` → Crear nueva entrada en markdown
- `POST /documentacion/comparar` → Comparar cambios entre archivos

### 📊 Estado del sistema
- `GET /resumen/estado` → Generar y obtener snapshot actual

### 🧠 GPT Inteligente
- `POST /gpt/inteligente` → Acceso universal (router AI-aware)
