import express from "express";
const router = express.Router();

router.post("/crear-entrada", (req, res) => {
  const { texto } = req.body;
  res.json({ mensaje: `Entrada creada: ${texto}` });
});

export default router;
