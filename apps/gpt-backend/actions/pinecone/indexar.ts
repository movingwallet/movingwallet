import fs from 'fs/promises';
import path from 'path';
import { index } from '../../config/pinecone';
import { embedQuery } from './buscarDocumentos';

export async function indexarMdLocales(dirPath = 'data/actualizados') {
  const files = await fs.readdir(dirPath);
  const documents = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
      return { id: file, values: content };
    })
  );

  for (const doc of documents) {
    const embedding = await embedQuery(doc.values);
    await index.upsert([
      {
        id: doc.id,
        values: embedding,
      },
    ]);
  }

  return { indexados: documents.length };
}
