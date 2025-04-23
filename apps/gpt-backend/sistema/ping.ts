import express from 'express'

const router = express.Router()

// GET o POST para probar conectividad
router.post('/ping', (req, res) => {
  res.json({ respuesta: 'pong' })
})

export default router
