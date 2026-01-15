// 🔧 Lógica para obtener los commits recientes de un repositorio de GitHub usando Octokit autenticado.

import { Octokit } from "@octokit/rest";

// Inicializamos Octokit con el token de GitHub desde el entorno.
// Esto evita restricciones de uso anónimo (rate limiting, acceso a repos privados, etc.).
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function obtenerCommitsRepositorio(repoFullName: string) {
  const [owner, repo] = repoFullName.split("/");

  if (!owner || !repo) {
    throw new Error("Formato inválido. Se espera 'owner/repo'");
  }

  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: 10, // Número de commits a obtener
  });

  return data.map(commit => ({
    sha: commit.sha,
    mensaje: commit.commit.message,
    autor: commit.commit.author?.name,
    fecha: commit.commit.author?.date,
    url: commit.html_url,
  }));
}
