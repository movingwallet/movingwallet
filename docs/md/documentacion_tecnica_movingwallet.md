📅 Última actualización: abril 2025



⚙️ **documentacion\_tecnica\_movingwallet.md**

📘 Documentación Técnica de MovingWallet



🛠️ **Stack Tecnológico**

|**Categoría**|**Tecnología**|**Motivo de elección**|
| :-: | :-: | :-: |
|Frontend|**React.js + TailwindCSS**|Modular, responsivo y altamente escalable|
|UI/UX & Estilos|TailwindCSS|Diseño rápido, moderno y sistema de diseño unificado|
|Conexión Web3|**RainbowKit + Wagmi + Viem**|Conexión fiable con múltiples billeteras, soporte WC v2|
|Gestión de datos|React Query / Zustand|Consumo eficiente de APIs y reactividad global|
|Backend API (futuro)|FastAPI|API REST moderna, rápida y asincrónica|
|SDK de Blockchain|Alchemy SDK / ethers / @solana/web3.js / bitcoinjs-lib|Soporte multichain EVM + Solana + Bitcoin|
|IA Integrada|OpenAI API / AutoGPT (futuro)|Generación de insights, resúmenes, comandos inteligentes|
|Base de Datos (futuro)|Supabase|DB Postgres + auth + funciones en tiempo real|
|CI/CD|Vercel + GitHub Actions|Automatización de despliegues y tests|



🧱 **Diagrama de Arquitectura (Mermaid)**

- graph TD
- `  `A[🌐 Frontend (React)] --> B[🔗 Wagmi + RainbowKit]
- `  `A --> C[📊 Estado (Zustand/React Query)]
- `  `A --> D[📡 API IA externa]
- `  `A --> E[🧠 Módulo de IA Interna]

- `  `B --> F[🔐 WalletConnect v2]
- `  `F --> G[🦊 MetaMask]
- `  `F --> H[🦝 Rabby / Trust / Ledger]

- `  `A --> I[📈 SDK Blockchain]
- `  `I --> J[🔗 Alchemy EVM]
- `  `I --> K[🔵 Solana Web3.js]
- `  `I --> L[🟠 BitcoinJS]

- `  `E --> M[(IA API Gateway)]
- `  `D --> M
- `  `M --> N[🧠 OpenAI / DeepInfra / HuggingFace]

- `  `A --> O[📦 Backend (FastAPI - futuro)]
- `  `O --> P[(📄 Supabase / DB futura)]




🌍 **Gestión Multi-Chain**

|**Red Soportada**|**Tipo**|**SDK / Proveedor**|**Estado**|
| :-: | :-: | :-: | :-: |
|Ethereum|EVM|Alchemy SDK / Viem|✅ Estable|
|Polygon|EVM|Alchemy SDK|✅ Estable|
|Arbitrum|EVM|Alchemy SDK|✅ Estable|
|Optimism|EVM|Alchemy SDK|✅ Estable|
|Base|EVM|Alchemy SDK|✅ Estable|
|Solana|No EVM|@solana/web3.js|🔜 En diseño|
|Bitcoin|UTXO|bitcoinjs-lib|🔜 En exploración|
|Sepolia/Mumbai|Testnet|Alchemy|✅ Testeado|

**Mecanismo de detección**: Se conecta a la wallet y detecta redes automáticamente para probar las compatibles mediante llamadas balance/getTokens por red.



🔗 **Flujo de Conexión con WalletConnect v2**

1. Usuario hace clic en “Conectar cuenta”  
1. Se abre el modal de RainbowKit → conecta vía WC v2  
1. Se obtiene address[] y chainId  
1. Cada dirección se almacena localmente y se visualiza en Sidebar  
1. Se lanza getTokenBalances() y getNftsForOwner() para cada chainId  
1. La información se agrupa y se renderiza por cuenta/red  
1. Si se desconecta la wallet → se actualiza automáticamente la interfaz  



🧠 **Interacción con el Módulo de IA**

**Flujos actuales:**

- El usuario puede consultar un “resumen” del portafolio → se genera un prompt con los tokens y NFTs  
- Se envía a una API (ej: OpenAI / OpenRouter) con instrucciones preformateadas  
- El modelo responde con análisis, sugerencias o resumen personalizado  
- La respuesta se muestra en pantalla en un panel IA contextual  

**Tipos de interacción previstos:**

|**Tipo de interacción**|**Ejemplo de uso**|
| :-: | :-: |
|🧠 Análisis de portafolio|“¿Dónde tengo más exposición?”|
|📊 Comparación de activos|“¿Qué token ha bajado más este mes?”|
|🔁 Rebalanceo sugerido|“¿Debo mover algo a stablecoins?”|
|📦 Transferencias guiadas|“Ayúdame a mover todo a otra wallet”|
|🧩 Plugins IA externos|“Conéctate a DeBank, Lens o Telegram para más”|

**Próxima fase**:

- Añadir memoria a las consultas para seguimiento histórico  
- Validación previa de acciones con usuario ("¿confirmas enviar todo a wallet B?")  
- Integración de IA nativa (modelo privado en contenedor opcional)  




