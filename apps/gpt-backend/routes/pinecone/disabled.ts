import { Router } from "express";

const router = Router();

/**
 * 2026-01:
 * Pinecone desactivado por decisión de arquitectura.
 * Usaremos Qdrant desde el día 1.
 */
router.all("/pinecone/*", (_req, res) => {
  return res.status(410).json({
    error: "Pinecone disabled",
    message: "Pinecone está desactivado. Se usará Qdrant.",
  });
});

export default router;
