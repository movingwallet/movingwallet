import { getUltimoCommit } from '../github/getCommits';
import { indexarMdLocales } from '../pinecone/indexar';
import fs from 'fs/promises';

export async function generarEstadoActual(repo: string = 'tuusuario/tu-repo') {
  const commit = await getUltimoCommit(repo);
  const pinecone = await indexarMdLocales();

  const status = {
    timestamp: new Date().toISOString(),
    commit,
    documentosIndexados: pinecone.indexados,
  };

  await fs.writeFile('data/status.json', JSON.stringify(status, null, 2));
  return status;
}
