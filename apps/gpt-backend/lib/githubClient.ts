import crypto from "crypto";

type GitHubIssueCreateInput = {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
};

type GitHubIssueCreateResult = {
  id: number;
  number: number;
  url: string;
  html_url: string;
  title: string;
  state: string;
};

function sanitizeToken(raw?: string) {
  return (raw || "").trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").trim();
}

function requireEnv(name: string, value?: string) {
  if (!value) {
    throw Object.assign(new Error(`Missing env: ${name}`), {
      status: 500,
      code: "missing_env",
      env: name,
    });
  }
  return value;
}

export function getGitHubAuthToken() {
  // Prefer fine-grained PAT or GitHub App installation token.
  // In CI you could also use GITHUB_TOKEN, but for server-side use set your own.
  const token = sanitizeToken(process.env.GITHUB_TOKEN);
  return requireEnv("GITHUB_TOKEN", token);
}

export async function createGitHubIssue(
  input: GitHubIssueCreateInput
): Promise<GitHubIssueCreateResult> {
  const token = getGitHubAuthToken();

  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(
    input.owner
  )}/${encodeURIComponent(input.repo)}/issues`;

  const payload: any = {
    title: input.title,
  };

  if (input.body) payload.body = input.body;
  if (Array.isArray(input.labels) && input.labels.length) payload.labels = input.labels;
  if (Array.isArray(input.assignees) && input.assignees.length) payload.assignees = input.assignees;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`, // GitHub REST supports Bearer for PATs :contentReference[oaicite:1]{index=1}
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      "User-Agent": `movingwallet-gpt-backend/${crypto.randomUUID()}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // keep null
  }

  if (!res.ok) {
    const msg =
      json?.message ||
      `GitHub API error (${res.status}) creating issue`;
    throw Object.assign(new Error(msg), {
      status: 502,
      code: "github_api_error",
      githubStatus: res.status,
      details: json || text,
    });
  }

  return {
    id: json.id,
    number: json.number,
    url: json.url,
    html_url: json.html_url,
    title: json.title,
    state: json.state,
  };
}
