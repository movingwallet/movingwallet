import { env } from '../../config/schema.env'
import { Pinecone } from '@pinecone-database/pinecone'
import fs from 'fs/promises'
import path from 'path'

const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
  environment: env.PINECONE_ENVIRONMENT,
})

const index = pinecone.Index(env.PINECONE_INDEX_NAME)

export async function indexarMdLocales(dirPath = 'data/actualizados') {
  const files = await fs.readdir(dirPath)
  const documents = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(dirPath, file), 'utf-8')
      return { id: file, values: content }
    })
  )

  for (const doc of documents) {
    await index.upsert([
      {
        id: doc.id,
        values: {
          content: doc.values,
        },
      },
    ])
  }

  return { indexados: documents.length }
}
