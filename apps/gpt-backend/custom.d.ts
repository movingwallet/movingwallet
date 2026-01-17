// apps/gpt-backend/custom.d.ts

declare module "*.svg" {
  const content: string
  export default content
}

declare module "*.css" {
  const content: Record<string, string>
  export default content
}

/**
 * Vercel (build) a veces resuelve tipos de Express de forma distinta y TS acaba
 * creyendo que Request/Response/NextFunction no tienen las props habituales.
 * Esto es un “shim” seguro (son props reales en runtime) para desbloquear build.
 */

// Asegura call signature de next()
declare module "express" {
  export type NextFunction = (...args: any[]) => any
}

// Asegura props típicas de req/res
import "express-serve-static-core"

declare module "express-serve-static-core" {
  interface Request {
    body: any
    query: any
    params: any
    headers: any
    method: any
    originalUrl: any
    path: any
    app: any
  }

  interface Response {
    json: (...args: any[]) => any
    status: (code: number) => this
    send: (...args: any[]) => any
    setHeader: (...args: any[]) => any
  }
}
