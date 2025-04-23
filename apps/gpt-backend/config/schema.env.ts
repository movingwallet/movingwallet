import { cleanEnv, str } from 'envalid'

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'staging'] }),
  GITHUB_TOKEN: str(),
  PINECONE_API_KEY: str(),
  PINECONE_ENVIRONMENT: str(),
  PINECONE_INDEX_NAME: str(),
  OPENAI_API_KEY: str(),
  GOOGLE_API_KEY: str(),
  GOOGLE_SHEETS_ID: str(),
  VERCEL_API_KEY: str(),
})
