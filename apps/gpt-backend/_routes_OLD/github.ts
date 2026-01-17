import { Router, Request, Response } from "express";
import { obtenerDatosRepositorio } from "@/actions/github/obtenerDatosRepositorio";
import validateApiToken from "@/middleware/auth"; // Autenticación por token

const router = Router();

// Endpoint POST para obtener datos básicos de un repositorio de GitHub.
// Se requiere autenticación mediante header `x-api-token`.

router.post("/github/repositorio", validateApiToken, async (req: Request, res: Response) => {
  const { repoFullName } = req.body;

  if (!repoFullName) {
    return res.status(400).json({ error: "Falta el campo 'repoFullName'" });
  }

  try {
    const datos = await obtenerDatosRepositorio(repoFullName);
    res.json({ datos });
  } catch (error) {
    console.error("❌ Error al obtener datos del repositorio:", error);
    res.status(500).json({
      error: "Error interno al obtener datos de GitHub",
      detalles: (error as Error).message
    });
  }
});

export default router;
