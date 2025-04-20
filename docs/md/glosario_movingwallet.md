📅 Última actualización: abril 2025




📘 **Glosario MovingWallet**

🧱 **Arquitectura y Proyecto**

|**Término**|**Definición**|
| :-: | :-: |
|**Monorepo**|Estructura de repositorio único que agrupa varias apps (frontend, gpt-backend, hardhat) y paquetes compartidos (ui, config, lib, etc.).|
|**Turborepo**|Herramienta para gestionar builds, dependencias y caching en monorepos modernos. Usado para acelerar desarrollo y testing.|
|**apps/**|Carpeta que contiene las aplicaciones activas del ecosistema MovingWallet.|
|**packages/**|Paquetes reutilizables compartidos entre apps: lógica común, componentes, integraciones externas.|



⚙️ **Backend de IA y Acciones GPT**

|**Término**|**Definición**|
| :-: | :-: |
|**gpt-backend/**|Backend dedicado a ejecutar acciones automatizadas, diseñadas para interactuar con el GPT técnico (este asistente).|
|**Acciones**|Operaciones programadas que el GPT puede disparar: leer archivos .md, agregar tareas al roadmap, consultar Pinecone, generar commits, etc.|
|**Pinecone**|Base de datos vectorial utilizada para indexar archivos .md y permitir búsquedas semánticas contextuales.|
|**gpt\_acceso\_inteligente**|Acción compuesta que analiza un input y decide a qué backend dirigirse (Google Docs, Pinecone, GitHub, etc.).|
|**AutoGPT (futuro)**|Sistema autónomo que ejecuta acciones encadenadas basado en objetivos definidos por el usuario. En exploración.|



💬 **IA en la app (Frontend)**

|**Término**|**Definición**|
| :-: | :-: |
|**recommendations.ts**|Módulo frontend que llama a la API de OpenAI con prompts generados desde el portafolio del usuario.|
|**prompt dinámico**|Instrucción generada en tiempo real basada en balances, redes y estado del usuario.|
|**/api/ia/**|Rutas locales que llaman a OpenAI (o su gateway) para mantener la seguridad del API key.|
|**rebalanceo sugerido**|Recomendación del módulo IA para mover tokens entre wallets o hacia stablecoins.|
|**IA contextual**|Lógica que genera respuestas adaptadas al portafolio y actividad del usuario.|



🌐 **Blockchain y Multichain**

|**Término**|**Definición**|
| :-: | :-: |
|**WalletConnect v2**|Protocolo de conexión entre dApps y wallets móviles o hardware, utilizado con RainbowKit y Wagmi.|
|**ChainId**|Identificador único de una red blockchain (ej: Ethereum Mainnet: 1, Arbitrum: 42161).|
|**Red Soportada**|Blockchain integrada en MovingWallet: Ethereum, Polygon, Optimism, Base, Arbitrum, Solana (🔜), Bitcoin (🔜).|
|**Balance por red**|Visualización de tokens y NFTs separados por chainId.|
|**Tokens Spam**|Tokens irrelevantes o fraudulentos detectados automáticamente y ocultados del portafolio.|
|**getTokenBalances()**|Llamada que recupera balances por dirección + chainId.|



📊 **Integraciones Externas**

|**Término**|**Definición**|
| :-: | :-: |
|**CoinGecko**|API para obtener precios de tokens, market caps y otros datos financieros.|
|**Etherscan**|Explorador de bloques usado para verificar transacciones, contratos y balances.|
|**Solana RPC**|Punto de acceso a información on-chain de Solana.|
|**bitcoinjs-lib**|Librería para interactuar con transacciones y claves Bitcoin.|
|**DeBank/Lens (futuro)**|Protocolos DeFi y sociales que podrían integrarse para enriquecer el análisis de IA.|



🧪 **Testing y Seguridad**

|**Término**|**Definición**|
| :-: | :-: |
|**Vitest**|Framework moderno de testing para TypeScript/JS (alternativa a Jest). Usado en frontend.|
|**Playwright / Cypress**|Herramientas para testing de extremo a extremo (E2E).|
|**Logger**|Módulo estructurado para registrar eventos, errores y métricas del sistema.|
|**Health Check**|Endpoint que valida el estado de dependencias externas (OpenAI, Pinecone, RPCs).|





