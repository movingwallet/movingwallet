📅 Última actualización: abril 2025



🔐 **seguridad\_privacidad.md**

**Versión inicial – Abril 2025**



🎯 **Propósito**

Documentar las políticas de **seguridad**, **modelo de no-custodia** y **privacidad de datos** aplicadas en MovingWallet. Esta guía sirve como referencia para desarrolladores, QA, auditores y eventualmente usuarios finales o integradores.



🛡️ **Modelo de Seguridad y No-Custodia**

🔑 **Claves privadas y control de fondos**

- **MovingWallet es 100% no-custodial**:  La aplicación **nunca accede ni almacena claves privadas** del usuario.  
- Todas las interacciones blockchain son firmadas por el usuario a través de su propia wallet (ej: MetaMask, Rabby, Ledger).  
- El protocolo **WalletConnect v2** permite conexiones seguras desde dispositivos móviles o hardware wallets sin exponer llaves.  

🧠 **Autenticación**

- **No se requiere login ni correo** para usar la app.  
- La identidad del usuario se basa únicamente en las direcciones públicas conectadas vía WalletConnect o extensiones compatibles.  
- Futuras versiones podrían incluir autenticación opcional para IA personalizada (OAuth / Lens).  



🧩 **Integraciones con APIs y SDKs externos**

|**Fuente**|**¿Qué accede?**|**¿Dónde se usa?**|
| :-: | :-: | :-: |
|**Empezar con CoinGecko API y una más**|Precios de tokens|Visualización de balances|
|**Alchemy**|RPCs de Ethereum y L2|Llamadas getTokenBalances, getNfts|
|**OpenAI API**|Análisis contextual|Recomendaciones IA (vía API proxy)|

Las llamadas a APIs externas no incluyen datos personales —solo dirección pública o datos visibles on-chain.



✅ **Validaciones al interactuar con contratos**

- Todas las transacciones deben ser confirmadas por el usuario en su wallet.  
- Se validan:  
  - **Red activa** vs red del contrato.  
  - **Gas estimado** antes de enviar (eth\_estimateGas).  
  - **Dirección válida** en transferencias.  
  - **Saldo suficiente** para cubrir la acción.  
- En caso de errores, se captura:  
  - El mensaje de error de la wallet o el RPC.  
  - La acción que lo generó (para debugging).  
  - No se persisten logs con dirección o tokens del usuario.  



🧯 **Manejo de errores críticos**

|**Tipo de error**|**Comportamiento**|
| :-: | :-: |
|❌ Error de conexión con wallet|Mensaje inmediato + opción de reconectar|
|⚠️ Error en OpenAI API|Mensaje IA no disponible temporalmente|
|⛽ Error por límite de gas|Se sugiere verificar red y saldo; se evita envío|
|🛑 Error al transferir token spam|Se bloquea automáticamente con alerta|



🔒 **Privacidad y anonimato**

- **No se usa analytics de terceros (GA, Segment, etc.)**  
- **No se guarda historial del usuario en servidores**.  
- Datos como tokens, balances o IA se generan en tiempo real y se descartan tras cerrar sesión.  
- La única persistencia es local (almacenamiento en navegador):  
  - Dirección conectada  
  - Redes visibles  
  - Últimos prompts IA (opcional, desactivable)  



🔭 **Medidas futuras (planificadas)**

|**Medida**|**Descripción**|
| :-: | :-: |
|**Límites por sesión IA**|Para evitar abusos o mal uso del sistema IA. Control por dirección o fingerprint.|
|**Verificación AI-aware**|Confirmaciones tipo "¿Estás seguro de enviar 1000 USDC?" vía IA explicativa.|
|**Logging anónimo**|Logs estructurados en JSON (nivel error/info), sin datos sensibles, con ID de sesión hash.|
|**Modo privado**|Para ocultar automáticamente tokens marcados como spam, sin dejar rastro local.|
|**Alertas on-chain**|Escáner de actividad sospechosa o riesgo de interacción con contratos peligrosos.|



🧪 **Checklist de Seguridad QA**

- El frontend no expone claves en consola.  
- Las llamadas a OpenAI no incluyen dirección explícita.  
- Todos los contratos son verificados en testnets.  
- Los tokens spam son detectados y bloqueados correctamente.  
- Los errores de red están gestionados con fallback visible.  





