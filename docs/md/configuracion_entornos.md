📅 Última actualización: abril 2025




⚙️ **configuracion\_entornos.md**



🎯 **Propósito**

Aclarar qué entornos existen en MovingWallet, qué variables de entorno se utilizan en cada uno, cómo se realiza el despliegue y qué mecanismos existen para recuperación y control de errores.

Esta guía es clave para:

- Onboarding de nuevos devs  
- QA sobre ambientes consistentes  
- Control de builds y configuración  
- Diagnóstico de fallos por entorno  



🌐 **Entornos disponibles**

|**Entorno**|**Uso**|**Dominio**|**Variables**|
| :-: | :-: | :-: | :-: |
|**local**|Desarrollo diario|localhost:3000|.env.local|
|**staging**|Pre-producción|staging.movingwallet.app|.env.staging|
|**producción**|App en vivo|app.movingwallet.app|.env.production|

Se recomienda siempre mantener .env.example actualizado con todas las claves necesarias, indicando cuáles deben ir en cada entorno.



🔐 **Variables de entorno**

Las siguientes claves se utilizan y se cargan según el entorno:

\# API Keys públicas

NEXT\_PUBLIC\_ALCHEMY\_KEY=

NEXT\_PUBLIC\_WALLETCONNECT\_PROJECT\_ID=

NEXT\_PUBLIC\_CHAINS=ethereum,polygon,arbitrum

\# Lógicas internas

OPENAI\_API\_KEY=       # Solo en backend

PINECONE\_API\_KEY=     # Solo en backend

GOOGLE\_SHEETS\_ID=

GITHUB\_TOKEN=

\# Flags y entornos

NODE\_ENV=development|staging|production

NEXT\_PUBLIC\_ENV=local|staging|prod

❗ Las claves que empiezan con NEXT\_PUBLIC\_ son accesibles desde el cliente. No incluir secretos aquí.



🧪 **Archivos por entorno**

|**Archivo**|**Función**|
| :-: | :-: |
|.env.local|Configuración para desarrollo local. No se sube a Git.|
|.env.staging|Variables de entorno staging (usadas por Vercel o Railway).|
|.env.production|Configuración real de producción. Muy protegida.|
|vercel.json|Define rewrites, headers, runtime y redirects para frontend en Vercel.|



🚀 **Scripts de despliegue y fallback**

**Despliegue Frontend (frontend/)**

- **Build:** pnpm turbo run build --filter=frontend  
- **Deploy:** automático via GitHub Actions a Vercel.  
- **Fallbacks configurados:** en vercel.json (redirecciones de rutas inválidas a 404.tsx).  

**Despliegue GPT Backend (gpt-backend/)**

- **Build:** pnpm build  
- **Deploy:** Railway / Render / Supabase Functions (según configuración).  

**Fallback:** Middleware de error por defecto (server.ts):   app.use((err, req, res, next) => {

`  `logger.error("Unhandled error", { err });

`  `res.status(500).json({ message: "Internal error" });

});




📊 **Control de errores en entornos reales**

- **Frontend**:  
  - Validaciones de red (chainId) al cargar.  
  - Logs de consola filtrados por entorno (if (process.env.NODE\_ENV === 'development')).  
  - En producción: soporte para Sentry (opcional vía @movingwallet/logger).  
- **Backend GPT**:  
  - Logs estructurados por entorno.  
  - Registro de errores de integración (GitHub, Pinecone, OpenAI).  
  - Control de cuotas (rateLimitExceeded → retry automático o fallback).  
  - Endpoint /health para verificar servicios externos.  



🔁 **Recomendaciones**

- Usar dotenv-flow o dotenv-cli para gestionar múltiples entornos.  
- Validar que todas las claves estén cargadas correctamente en CI (dotenv-linter, envalid).  
- Crear script check-env.ts para validar campos requeridos antes del build.  
- Mantener staging sincronizado con producción, salvo claves críticas (ej: OpenAI).  





