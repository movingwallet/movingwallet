import { Octokit } from 'octokit'
import { env } from '../../config/schema.env'

const octokit = new Octokit({ auth: env.GITHUB_TOKEN })

export async function getUltimoCommit(repo: string) {
  const [owner, name] = repo.split('/')
  const commits = await octokit.rest.repos.listCommits({
    owner,
    repo: name,
    per_page: 1,
  })

  const commit = commits.data[0]
  return {
    sha: commit.sha,
    mensaje: commit.commit.message,
    fecha: commit.commit.author?.date,
  }
}
