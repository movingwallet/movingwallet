import express from 'express';
import { buscarDocumentos } from '../../actions/pinecone/buscarDocumentos';
import { generarEstadoActual } from '../../actions/resumen/generarEstadoActual';

const router = express.Router();

router.post('/', async (req, res) => {
  const pregunta = req.body?.pregunta || '';

  try {
    if (pregunta.toLowerCase().includes('último commit')) {
      const estado = await generarEstadoActual();
      return res.json({ tipo: 'estado', respuesta: estado });
    }

    const resultado = await buscarDocumentos(pregunta);
    res.json({ tipo: 'pinecone', resultado });
  } catch (err) {
    console.error('❌ GPT router error:', err);
    res.status(500).json({ error: 'GPT router error', detalle: err });
  }
});

export const routerInteligenteRoute = router;
