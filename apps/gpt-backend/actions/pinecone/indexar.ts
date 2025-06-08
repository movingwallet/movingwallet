import { config } from '@/config';
import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs/promises';
import path from 'path';

const pinecone = new Pinecone({
  apiKey: config.pinecone.apiKey,
  environment: config.pinecone.environment,
});

const index = pinecone.Index(config.pinecone.indexName);

export async function indexarMdLocales(dirPath = 'data/actualizados') {
  const files = await fs.readdir(dirPath);
  const documents = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
      return { id: file, values: content };
    })
  );

  for (const doc of documents) {
    await index.upsert([
      {
        id: doc.id,
        values: {
          content: doc.values,
        },
      },
    ]);
  }

  return { indexados: documents.length };
}
