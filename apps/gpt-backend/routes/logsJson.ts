import express from "express"
import { LogModel } from "../models/Log"

const router = express.Router()

router.get("/logs/json", async (req, res) => {
  try {
    const logs = await LogModel.find().sort({ fecha: -1 }).limit(100)
    res.json({ success: true, logs })
  } catch (error) {
    console.error("❌ Error en /logs/json:", error)
    res.status(500).json({ success: false, error: "Error al obtener logs", detalle: error })
  }
})

export default router
