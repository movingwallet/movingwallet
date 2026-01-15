// 🔧 Lógica para obtener datos de un repositorio remoto usando Octokit autenticado

import { Octokit } from "@octokit/rest";

// Octokit se inicializa con el token de GitHub desde el entorno.
// Esto permite consultar repos públicos y privados, y evitar rate limiting.
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function obtenerDatosRepositorio(repoFullName: string) {
  const [owner, repo] = repoFullName.split("/");

  if (!owner || !repo) {
    throw new Error("Formato inválido. Se espera 'owner/repo'");
  }

  const { data } = await octokit.repos.get({
    owner,
    repo,
  });

  // Solo se devuelven campos relevantes para la vista o análisis
  return {
    nombre: data.name,
    descripcion: data.description,
    estrellas: data.stargazers_count,
    forks: data.forks_count,
    issuesAbiertos: data.open_issues_count,
    lenguajePrincipal: data.language,
    actualizadoEn: data.updated_at,
  };
}
