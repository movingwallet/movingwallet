import express from "express";
const router = express.Router();

router.post("/api/commit", async (req, res) => {
  try {
    const { resumen } = req.body;

    if (!resumen || resumen.length < 5) {
      return res.status(400).json({ error: "Falta el resumen o es muy corto" });
    }

    const tipo = resumen.toLowerCase().includes("error") ? "fix" :
                 resumen.toLowerCase().includes("docs") ? "docs" :
                 resumen.toLowerCase().includes("test") ? "test" :
                 resumen.toLowerCase().includes("refactor") ? "refactor" :
                 resumen.toLowerCase().includes("estructura") ? "chore" : "feat";

    const mensaje = `${tipo}: ${resumen.charAt(0).toUpperCase() + resumen.slice(1)}`;

    return res.json({ commit: mensaje });
  } catch (error) {
    return res.status(500).json({ error: "Error generando commit message" });
  }
});

export default router;
