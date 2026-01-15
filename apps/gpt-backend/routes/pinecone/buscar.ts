import { Router, Request, Response } from "express";

/**
 * 2026-01:
 * Pinecone desactivado por decisión de arquitectura.
 * Motivo: usaremos Qdrant desde el día 1 para evitar migraciones.
 *
 * Este endpoint se mantiene como "stub" para:
 * - no romper rutas antiguas
 * - evitar imports al SDK de Pinecone (que NO instalamos)
 * - documentar la decisión en el propio código
 */
const router = Router();

router.post("/pinecone/buscar", (_req: Request, res: Response) => {
  return res.status(410).json({
    error: "Pinecone disabled",
    message: "Pinecone está desactivado. Se usará Qdrant desde el día 1.",
    next: "Implementar /api/qdrant/search y /api/qdrant/index",
  });
});

export default router;
