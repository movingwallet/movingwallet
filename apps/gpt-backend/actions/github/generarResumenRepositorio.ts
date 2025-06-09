import { obtenerCommitsRepositorio } from "./obtenerCommitsRepositorio";

export async function generarResumenRepositorio(repoFullName: string) {
  const commits = await obtenerCommitsRepositorio(repoFullName);

  const resumen = {
    totalCommits: commits.length,
    ultimos: commits.slice(0, 5).map((commit) => ({
      mensaje: commit.commit.message,
      autor: commit.commit.author?.name,
      fecha: commit.commit.author?.date,
    })),
  };

  return resumen;
}
