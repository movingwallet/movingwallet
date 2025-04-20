📅 Última actualización: abril 2025



🧠 **guia\_tecnica\_movingwallet.md**

📘 Guía Técnica General – *MovingWallet*  *Propósito: Servir como documento de referencia para onboarding de nuevos desarrolladores, entendimiento del sistema y visión futura.*



🧭 **Visión Modular de la App**

**MovingWallet** está diseñada como una app **modular, extensible y orientada a múltiples cadenas y cuentas**, usando principios de arquitectura desacoplada.  Cada bloque funcional puede ser adaptado, mejorado o reemplazado sin afectar el core.

🧩 **Explicación por Feature**

🔐 **Conexión de Wallets**

- Implementado con RainbowKit + WalletConnect v2  
- Soporta conexión múltiple (MetaMask, Rabby, Coinbase Wallet, rainbow.me, etc.)  
- Vista actual: listado lateral con avatars e información rápida  

💰 **Visualización de Tokens**

- Agrupa balances por red (ETH, MATIC, etc.)  
- Se detectan tokens spam, se pueden ocultar individualmente  
- Caching por dirección/red y retry en errores de red  

🖼️ **NFTs**

- Se detectan NFTs desde Alchemy (ERC-721 y ERC-1155)  
- Grid o tabla, con posibilidad de enviar uno o varios NFTs  
- Verifica red, tipo de contrato y ownership antes de transferir  

📜 **Historial de Transacciones**

- Muestra transacciones de entrada/salida para el usuario  
- Incluye enlace a Etherscan  
- Filtrado básico por dirección y tipo (IN/OUT)  

📈 **Precios y valoración**

- Se conecta a CoinGecko y más APIs para mostrar valor estimado en USD  
- Fallback futuro planeado: CoinMarketCap, Chainlink Feeds. Si falla CoinGecko automaticamente pasamos a otra API  



🧪 **Procesos Internos del MVP**

🔄 **Flujo desde la conexión hasta render:**

1\. Usuario conecta una o varias wallets

2\. Se actualiza el estado global

3\. Se activa la app para recolectar tokens/nfts

4\. Cada red se consulta por separado (via Alchemy)

5\. Los datos se normalizan → estado global

6\. El componente muestra la tabla por red en diferentes formato (como Debak o el portfolio de Metamask)

🔃 **Estructura de actualización por hook:**

Mos falta ir desarrollando los necesarios como:

- Hooks tienen control de loading, error…  
- Incluyen caché interna por dirección/red




🌱 **Escalabilidad y Futuro**

🔧 **Extensibilidad Modular**

|**Área**|**Cómo se escalará**|
| :-: | :-: |
|Redes nuevas|Añadir en alchemyConfig.js y nuevas formas|
|Fuentes de precio|Archivo/función que admite múltiples APIs|
|Funciones IA|Se conectarán a través de endpoints REST o WebSockets|
|Nuevos tipos de activo|Adapters por tipo (staking, farming, etc.)|

🧠 **IA y Automatización**

- Se implementará una capa de IA con recomendaciones y predicciones  
- Estándar de entrada: prompt + context + state = recomendación  
- Configurable por el usuario (modo asistido)  





