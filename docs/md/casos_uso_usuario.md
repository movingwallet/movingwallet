📅 Última actualización: abril 2025




📘 **Casos de Uso de Usuario – MovingWallet**

🎯 **Propósito**: Describir cómo un usuario real interactúa con la app, ideal para QA, testers e IA de soporte.

📋 **Formato**: Cada caso incluye:

- Objetivo del usuario
- Acciones esperadas
- Flujo visual (cuando aplica)
- Datos requeridos
- Observaciones QA



🧾 **Caso 1: Ver portafolio consolidado**

- **Objetivo del usuario**: Revisar sus activos en múltiples cadenas desde una sola interfaz.
- **Acciones esperadas**:
  - Conectar wallet.
  - Detectar redes activas.
  - Mostrar tokens y NFTs agrupados por red.
  - Ordenar por valor, cantidad, o red.
- **Flujo QA**:
  - Simular conexión en testnets (Sepolia, Mumbai).
  - Usar mock de balances conocidos.
- **IA Soporte**:
  - Responder: “¿Cuánto tengo en Polygon?”, “¿Qué tokens están duplicados?”



🧾 **Caso 2: Conectar wallet**

- **Objetivo del usuario**: Acceder a su información sin crear cuenta.
- **Acciones esperadas**:
  - Clic en “Conectar wallet”.
  - Modal de RainbowKit → conexión vía WalletConnect v2.
  - Obtener address[] y chainId.
  - Visualización de dirección resumida + botón copiar.
- **Observaciones QA**:
  - Testear con múltiples wallets (MetaMask, Rabby, Trust).
  - Verificar auto-desconexión e interfaz actualizada.



🧾 **Caso 3: Consultar valor de tokens y NFTs**

- **Objetivo del usuario**: Saber cuánto valen sus activos.
- **Acciones esperadas**:
  - Ver balance por token y su valor en USD.
  - Tooltip con fecha de compra (si disponible).
  - NFTs con preview, colección, red.
- **Observaciones QA**:
  - Mock de precios vía packages/integrations/coingecko/.
  - Cargar wallets sin valor para UX vacío.



🧾 **Caso 4: Transferir NFTs o tokens**

- **Objetivo del usuario**: Mover activos a otra wallet.
- **Acciones esperadas**:
  - Seleccionar token/NFT con checkbox.
  - Ingresar dirección destino.
  - Ver confirmación previa (“¿confirmás enviar?”).
  - Enviar transacción vía wallet.
- **Validaciones QA**:
  - Dirección inválida.
  - Red no soportada.
  - NFT no transferible.



🧾 **Caso 5: Consultar análisis con IA**

- **Objetivo del usuario**: Entender su exposición o recibir recomendaciones.
- **Acciones esperadas**:
  - Ir a pestaña “IA”.
  - Elegir prompt sugerido o escribir uno (“¿Qué consolidar hoy?”).
  - Ver respuesta en panel lateral contextual.
- **Entrenamiento IA soporte**:
  - Preguntas frecuentes: “¿Qué tokens mover?”, “¿Qué cadena tiene más actividad?”, “¿Tengo riesgo alto?”
  - Detectar patrones: balances pequeños, tokens duplicados, redes caras.



🧾 **Caso 6: Historial de actividad**

- **Objetivo del usuario**: Ver qué hizo en la dApp (interacción local).
- **Acciones esperadas**:
  - Ver pestaña “Historial”.
  - Listado con timestamp, red, token, acción.
  - Opcional: exportar JSON o CSV.
- **QA y datos**:
  - Simular historial local de pruebas.
  - Validar timestamps y acciones correctas.



🧾 **Caso 7: Detectar tokens spam**

- **Objetivo del usuario**: Evitar ver basura o phishing tokens.
- **Acciones esperadas**:
  - Tokens marcados como “spam” aparecen al final con tag.
  - Posibilidad de ocultar.
  - Filtro para ver solo tokens verificados.
- **Validación QA**:
  - Inyectar tokens con metadata anómala.
  - Comprobar comportamiento UI (opacidad, alertas, etc.).



🧠 **Ideal para:**

- 🔍 QA automatizado con Cypress + mocks en testnets.
- 🤖 Entrenamiento de IA de soporte para UX guiada.
- 📊 Documentar interacciones reales para métricas o análisis de UX.




