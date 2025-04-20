📅 Última actualización: abril 2025




🙏 **Modelo de Donación Integrado – MovingWallet**



🎯 **Propósito**

Diseñar e integrar un mecanismo de donación transparente y opcional, que se active como parte del flujo de migración de activos dentro de MovingWallet. Este modelo está pensado para:

- Permitir que usuarios apoyen el proyecto voluntariamente.
- No afectar el flujo ni la experiencia principal.
- Ser seguro, no-custodial y medible.



🧱 **Estructura del flujo de "Mudanza"**

**Versión estándar (sin donación):**

1. Seleccionar tokens a mover.
1. Elegir red de destino.
1. Confirmar operación.

**Versión con donación (por defecto editable):**

1. Seleccionar tokens a mover.
1. Elegir red de destino.
1. Paso de donación:
   1. Monto sugerido (ej. 1, 5, 10 USDC).
   1. Opción “No, gracias”.
   1. Dirección de donación (copiar o enviar).
1. Confirmar operación.



✅ **Ventajas de este enfoque**

|**Ventaja**|**Explicación**|
| :-: | :-: |
|Natural y contextual|Se ofrece en un momento lógico, cuando ya se están moviendo activos.|
|No obligatorio|Puede omitirse sin afectar el proceso principal.|
|No molesto|Está integrado al flujo y no interrumpe.|



💸 **Formas de donación sencillas y gratuitas**

**1. Donación on-chain (recomendada)**

- Transferencia directa a una address EVM.
- Monto editable o botones rápidos (0.5, 1, 5 USDC/DAI).

**2. QR escaneable o copiar dirección**

- Mostrar dirección estática del proyecto con botón copiar o QR.

**3. GitHub Sponsors / Ko-fi / BuyMeACoffee**

- Para contribuciones sin cripto si el repo se hace público.

**4. Gitcoin Grants (futuro)**

- Si el proyecto se alinea con objetivos públicos del ecosistema Ethereum.



🔐 **Seguridad y transparencia**

- La dirección de donación es pública y visible desde la app.
- El usuario siempre debe confirmar la transacción.
- No se mezcla con otras acciones (es independiente).
- Enlace a Etherscan/Solana Explorer disponible.
- Ningún dato sensible se registra en el proceso.



📈 **Métricas y análisis**

- Cuántos usuarios ven el paso de donación.
- Porcentaje que dona.
- Monto promedio elegido.

Estas métricas deben ser anónimas, recolectadas por el sistema de logging interno (@movingwallet/logger).



🧠 **Sugerencias desde IA**

- La IA puede recomendar una donación con mensajes personalizados: “Gracias por usar MovingWallet. Si querés apoyar el desarrollo libre, podés donar.”
- Puede sugerir montos razonables en función del tipo de actividad detectada.



🛠 **Roadmap Técnico**

- Componente DonationStep en flujo de transferencia.
- Campo donationIntent en el Zustand store global.
- Validaciones específicas en services/move.ts.
- Variable global DONATION\_ADDRESS\_MAINNET y por chain.
- Pruebas de QA automatizadas con paso de donación.
- Inclusión en IA de soporte y documentación (seguridad\_privacidad.md).




