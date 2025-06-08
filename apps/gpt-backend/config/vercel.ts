import { config } from '@/config';
import axios from 'axios';

const vercelClient = axios.create({
  baseURL: 'https://api.vercel.com',
  headers: {
    Authorization: `Bearer ${config.vercel.apiKey}`,
  },
});

export async function getDeployStatus() {
  const project = config.vercel.projectId;
  const team = config.vercel.teamId;

  const response = await vercelClient.get(`/v6/deployments`, {
    params: { projectId: project, teamId: team, limit: 5 },
  });

  return response.data;
}
