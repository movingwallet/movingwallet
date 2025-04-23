import express from 'express'
import { generarEstadoActual } from '../../actions/resumen/generarEstadoActual'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const estado = await generarEstadoActual()
    res.json(estado)
  } catch (error) {
    res.status(500).json({ error: 'Error al generar estado', detalle: error })
  }
})

export default router

