import { Octokit } from 'octokit';
import { config } from '@/config';

const octokit = new Octokit({ auth: config.github.token });

export async function getUltimoCommit() {
  const { owner, repo } = config.github;

  const commits = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: 1,
  });

  const commit = commits.data[0];
  return {
    sha: commit.sha,
    mensaje: commit.commit.message,
    fecha: commit.commit.author?.date,
  };
}
