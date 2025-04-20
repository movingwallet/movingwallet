📅 Última actualización: abril 2025




🧑‍💻 **guia\_de\_desarrollo\_movingwallet.md**

📚 Guía de Desarrollo y Contribución Técnica – *MovingWallet*



📌 **Propósito**

Este documento proporciona la **guía práctica y técnica para contribuir al código de MovingWallet**, tanto para desarrolladores internos como colaboradores externos.



🧱 **Estructura del Proyecto**







🛠️ **Requisitos Previos**

- Node.js >=18  
- pnpm >=8  
- Navegador con extensiones web3 (MetaMask, Rabby, etc.)  



🚀 **Cómo iniciar el entorno local**

**Clonar el repositorio:**   git clone https://github.com/siestadivina/movingwallet.io.git

cd movingwallet.io

**Instalar dependencias:**   pnpm install

2. **Crear archivo .env.local con base en env.example**  

**Levantar el servidor local:**   pnpm dev

4. Accede a: http://localhost:3000  



🧾 **Scripts disponibles**

|**Comando**|**Descripción**|
| :-: | :-: |
|pnpm dev|Ejecuta el servidor de desarrollo Next.js|
|pnpm build|Compila la app para producción|
|pnpm lint|Ejecuta ESLint (pendiente de configuración total)|
|pnpm format|Formatea el código (si se incluye Prettier)|



📐 **Convenciones de Código**

- **Lenguaje**: JavaScript + JSX (migración progresiva a TypeScript)  
- **Estilos**: TailwindCSS para UI + CSS Modules para casos específicos  
- **Nombrado**: PascalCase para componentes, camelCase para funciones y hooks  
- **Internacionalización**: useTranslate() + uiTexts.js (estructura escalable)  
- **Importaciones**: Absolutas desde @/ (@/components/...)  



📤 **Estándares para PRs (Pull Requests)**

1. Crea rama con convención feat/, fix/, chore/, etc.  
1. Commits descriptivos (ej: feat: agrega vista consolidada de tokens)  
1. PR con descripción clara y enlaces a issues relacionados  
1. Adjuntar capturas o resultados si es UI/UX  
1. Todos los tests (si hay) deben pasar  

Ejemplo:

git checkout -b feat/sidebar-multicuenta

git commit -m "feat: sidebar con soporte multicuenta y avatar"

git push origin feat/sidebar-multicuenta




🧠 **Tips para colaboradores**

- Usa siempre las funciones existentes (getAlchemyInstance, useAllAccountsData, etc.)  
- Los componentes nuevos deben ser **modulares y reutilizables**  
- Si necesitas añadir una cadena, hazlo en:  
  - alchemyConfig.js (si es compatible con Alchemy)  
  - loadChainInfo.js y chainUtils.js (para info externa)  
- Los textos deben ir en uiTexts.js para facilitar i18n  



📦 **Proceso de Despliegue**

- Cada push a main despliega automáticamente en Vercel  
- Los errores de build se muestran en la consola de Vercel  
- Puedes ejecutar pnpm build localmente para simular  





