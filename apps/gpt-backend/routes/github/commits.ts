import express from 'express'
import { getUltimoCommit } from '../../actions/github/getCommits'

const router = express.Router()

router.get('/:repo', async (req, res) => {
  try {
    const repo = req.params.repo
    const data = await getUltimoCommit(repo)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener commit', detalle: err })
  }
})

export default router
