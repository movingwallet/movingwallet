import express from "express";

const router = express.Router();

router.post("/api/router-inteligente", async (req, res) => {
  const { consulta } = req.body;

  if (!consulta) {
    return res.status(400).json({ error: "Falta la consulta" });
  }

  const input = consulta.toLowerCase();

  const tipo = input.includes("leer archivo") || input.includes(".md")
    ? "leer_archivo_markdown_local"
    : input.includes("commit") || input.includes("mensaje")
    ? "generar_commit_mensaje"
    : input.includes("resumen")
    ? "resumir_estado_actual"
    : input.includes("documentación") && input.includes("coherencia")
    ? "verificar_consistencia_documentacion"
    : "acción_desconocida";

  res.json({
    tipoDetectado: tipo,
    sugerencia: `Esta consulta debería ser enviada a la acción: ${tipo}`
  });
});

export default router;
