import fs from 'fs/promises'
import { getUltimoCommit } from '../actions/github/getCommits'
import { indexarMdLocales } from '../actions/pinecone/indexar'
import { logger } from '../utils/logger'

export async function generarSnapshot() {
  const repo = 'tuusuario/tu-repo'
  const commit = await getUltimoCommit(repo)
  const pinecone = await indexarMdLocales()

  const snapshot = {
    timestamp: new Date().toISOString(),
    ultimo_commit: commit,
    md_indexados: pinecone.indexados,
  }

  await fs.writeFile(
    'data/estado_actual.md',
    `# Estado del sistema\n\nÚltimo commit: ${commit.mensaje} (${commit.sha})\n\nDocumentos indexados: ${pinecone.indexados}`
  )

  await fs.writeFile('data/status.json', JSON.stringify(snapshot, null, 2))
  logger.info('📦 Snapshot generado con éxito')
}

if (require.main === module) {
  generarSnapshot()
}
