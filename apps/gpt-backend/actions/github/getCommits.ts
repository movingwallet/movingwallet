import simpleGit from "simple-git";

export async function getUltimoCommit(branch: string) {
  const git = simpleGit({ baseDir: process.cwd() });

  const log = await git.log({ n: 1, from: branch });
  const commit = log.latest;

  return {
    hash: commit?.hash,
    message: commit?.message,
    date: commit?.date,
    author: commit?.author_name,
  };
}
