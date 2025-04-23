import express from 'express'
import { buscarEnPinecone } from '../../actions/pinecone/buscar'
import { generarEstadoActual } from '../../actions/resumen/generarEstadoActual'

const router = express.Router()

router.post('/', async (req, res) => {
  const pregunta = req.body?.pregunta || ''

  try {
    if (pregunta.toLowerCase().includes('último commit')) {
      const estado = await generarEstadoActual()
      return res.json({ tipo: 'estado', respuesta: estado })
    }

    const resultado = await buscarEnPinecone(pregunta)
    res.json({ tipo: 'pinecone', resultado })
  } catch (err) {
    res.status(500).json({ error: 'GPT router error', detalle: err })
  }
})

export default router
