export const config = {
    github: {
      token: process.env.GITHUB_TOKEN,
      owner: process.env.GITHUB_OWNER || "defaultOwner",
      repo: process.env.GITHUB_REPO || "defaultRepo",
    },
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY,
      namespace: process.env.PINECONE_NAMESPACE || "default-namespace",
      environment: process.env.PINECONE_ENVIRONMENT || "us-west1-gcp",
      indexName: process.env.PINECONE_INDEX_NAME || "docs-index",
    },
    vercel: {
      apiKey: process.env.VERCEL_API_KEY,
      teamId: process.env.VERCEL_TEAM_ID,
      projectId: process.env.VERCEL_PROJECT_ID,
    },
    general: {
      projectName: process.env.PROJECT_NAME || "GPT Template",
      slug: process.env.PROJECT_SLUG || "template",
    },
  };
  