import { Octokit } from "@octokit/rest";

export async function obtenerDatosRepositorio(repoFullName: string) {
  const [owner, repo] = repoFullName.split("/");

  const octokit = new Octokit(); // Anónimo, sin token

  const { data: repoData } = await octokit.repos.get({ owner, repo });

  return {
    nombre: repoData.name,
    descripcion: repoData.description,
    estrellas: repoData.stargazers_count,
    forks: repoData.forks_count,
    actualizado: repoData.updated_at,
  };
}
