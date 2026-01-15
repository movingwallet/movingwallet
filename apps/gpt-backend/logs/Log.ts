/**
 * 2026-01
 * Wrapper de compatibilidad para imports legacy:
 *   import Log from "@/logs/Log"
 *
 * El modelo real vive en `models/Log.ts`.
 * La carpeta `logs/` solo tenía ficheros .log (no código),
 * por eso Node no podía resolver el import.
 *
 * Este archivo permite arrancar el backend SIN refactors masivos.
 */
export { default } from "../models/Log";
export * from "../models/Log";
