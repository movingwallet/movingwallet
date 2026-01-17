import OpenAI from 'openai';
import { index } from '../../config/pinecone';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function embedQuery(texto: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: texto,
  });

  return response.data[0]?.embedding || [];
}

export async function buscarDocumentos(query: string, topK = 5) {
  const vector = await embedQuery(query);

  const resultados = await index.query({
    vector,
    topK,
    includeMetadata: true,
  });

  return resultados.matches || [];
}
