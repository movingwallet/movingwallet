import express from "express";
const router = express.Router();

/**
 * Ruta simple para validar que el backend está vivo.
 * Recibe un mensaje y lo devuelve como eco.
 */
router.post("/ping", (req, res) => {
  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ error: "Falta el campo 'mensaje'" });
  }

  res.json({
    respuesta: `🧠 Backend activo. Echo: ${mensaje}`
  });
});

export default router;
