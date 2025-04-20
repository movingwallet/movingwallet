📅** Última actualización: abril 2025



📌 **Requisitos Previos y técnicos: de MovingWallet**



🎯 **Propósito**

Definir qué requisitos previos (técnicos y de entorno) son necesarios para ejecutar correctamente MovingWallet en local o contribuir al repositorio. Este documento también sirve como checklist para preparar entornos de desarrollo consistentes y seguros.

Son ideas de por donde va el proyecto. En un futuro puede haber cambios.



💻 **Requisitos técnicos (hardware/software) del comienzo de la app**

|**Requisito**|**Versión mínima**|**Uso principal**|
| :-: | :-: | :-: |
|Node.js|18\.x LTS|Monorepo Turborepo, frontend, backend|
|pnpm (o yarn)|8\.x|Manejo de workspaces|
|Git|2\.35+|Clonar, versionar y deploy|
|Python (opcional)|3\.10+|Requerido si se usa FastAPI o scripts GPT|
|Docker (opcional)|Latest|Para entornos IA privados (futuro)|
|Cuenta Google|-|Para acceso a Google Sheets / Docs|
|Cuenta GitHub|-|Para acciones desde el GPT|
|Pinecone API Key|-|Para búsqueda semántica en IA|
|OpenAI API Key|-|Para sugerencias y análisis IA|



🔐 **Variables de entorno requeridas**

Cada entorno usa sus propios .env, pero todos comparten al menos estas claves:

\# Frontend

NEXT\_PUBLIC\_ALCHEMY\_KEY=

NEXT\_PUBLIC\_WALLETCONNECT\_PROJECT\_ID=

NEXT\_PUBLIC\_ENV=local|staging|prod

\# Backend GPT

OPENAI\_API\_KEY=

PINECONE\_API\_KEY=

GOOGLE\_API\_KEY=

GITHUB\_TOKEN=



✅ **Checklist de prerrequisitos por módulo**

**apps/frontend**

- TailwindCSS funcionando
- RainbowKit renderiza conexión
- Hooks devuelven data con mocks o testnet
- Página IA responde desde /api/ia/suggest

**apps/gpt-backend**

- .env configurado con claves reales
- Puede leer y escribir archivos .md

**packages/\***

- Tipado de interfaces accesible
- Integraciones (coingecko, etherscan) funcionando
- Logger exportado para todas las apps



📋 **En desarrollo**

- Validación automática de .env con envalid o schema personalizado.
- Script check-env.ts para detectar claves faltantes antes de ejecutar.
- Health check para asegurar acceso a Pinecone, Google y OpenAI.

- 📋 **ESTOS REQUISITOS SON UNA ORIENTACIÓN**

- Se han desarrollado apps similares sabiéndooslo esta información 
- Ayudará a tener una base donde poder tener una forma de crear la app
