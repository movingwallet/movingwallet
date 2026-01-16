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

type CreateBranchInput = {
  owner: string;
  repo: string;
  baseBranch: string; // e.g. "main"
  newBranch: string;  // e.g. "gpt/fix-ci-123"
};

type CommitFileInput = {
  owner: string;
  repo: string;
  branch: string;
  path: string;        // repo path
  contentUtf8: string; // full file content (utf8)
  message: string;     // commit message
};

type CommitFileResult = {
  contentPath: string;
  commitSha: string;
  htmlUrl?: string;
};

type CreatePrInput = {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  head: string; // branch name
  base: string; // "main"
};

type CreatePrResult = {
  number: number;
  html_url: string;
  state: string;
  title: string;
};

function sanitizeToken(raw?: string) {
  return (raw || "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .trim();
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

function ghHeaders(token: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`, // PAT fine-grained supports Bearer 
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": `movingwallet-gpt-backend/${crypto.randomUUID()}`,
  };
}

async function ghJson(res: Response) {
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { text, json };
}

async function ghRequest(token: string, url: string, init: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...ghHeaders(token),
    },
  });

  const { text, json } = await ghJson(res);

  if (!res.ok) {
    const msg = json?.message || `GitHub API error (${res.status})`;
    throw Object.assign(new Error(msg), {
      status: 502,
      code: "github_api_error",
      githubStatus: res.status,
      details: json || text,
    });
  }

  return json;
}

export function getGitHubAuthToken() {
  const token = sanitizeToken(process.env.GITHUB_TOKEN);
  return requireEnv("GITHUB_TOKEN", token);
}

/** ---------- Issues ---------- */
export async function createGitHubIssue(
  input: GitHubIssueCreateInput
): Promise<GitHubIssueCreateResult> {
  const token = getGitHubAuthToken();
  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(
    input.owner
  )}/${encodeURIComponent(input.repo)}/issues`;

  const payload: any = { title: input.title };
  if (input.body) payload.body = input.body;
  if (Array.isArray(input.labels) && input.labels.length) payload.labels = input.labels;
  if (Array.isArray(input.assignees) && input.assignees.length) payload.assignees = input.assignees;

  const json = await ghRequest(token, apiUrl, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    id: json.id,
    number: json.number,
    url: json.url,
    html_url: json.html_url,
    title: json.title,
    state: json.state,
  };
}

/** ---------- Branch ---------- */
async function getBranchHeadSha(owner: string, repo: string, branch: string) {
  const token = getGitHubAuthToken();
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    repo
  )}/git/ref/heads/${encodeURIComponent(branch)}`;

  const json = await ghRequest(token, url, { method: "GET" });
  return json?.object?.sha as string;
}

export async function createBranch(input: CreateBranchInput) {
  const token = getGitHubAuthToken();
  const baseSha = await getBranchHeadSha(input.owner, input.repo, input.baseBranch);

  const url = `https://api.github.com/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(
    input.repo
  )}/git/refs`;

  const payload = {
    ref: `refs/heads/${input.newBranch}`,
    sha: baseSha,
  };

  const json = await ghRequest(token, url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    ref: json.ref,
    sha: json.object?.sha,
  };
}

/** ---------- Commit file (via Contents API) ---------- */
async function getFileSha(owner: string, repo: string, path: string, ref: string) {
  const token = getGitHubAuthToken();
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    repo
  )}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`;

  const json = await ghRequest(token, url, { method: "GET" });
  return json?.sha as string;
}

function toBase64Utf8(s: string) {
  return Buffer.from(s, "utf8").toString("base64");
}

export async function commitFile(input: CommitFileInput): Promise<CommitFileResult> {
  const token = getGitHubAuthToken();

  // If file exists, we must include sha
  let existingSha: string | null = null;
  try {
    existingSha = await getFileSha(input.owner, input.repo, input.path, input.branch);
  } catch {
    existingSha = null; // new file
  }

  const url = `https://api.github.com/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(
    input.repo
  )}/contents/${encodeURIComponent(input.path)}`;

  const payload: any = {
    message: input.message,
    content: toBase64Utf8(input.contentUtf8),
    branch: input.branch,
  };

  if (existingSha) payload.sha = existingSha;

  const json = await ghRequest(token, url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return {
    contentPath: json?.content?.path || input.path,
    commitSha: json?.commit?.sha,
    htmlUrl: json?.content?.html_url,
  };
}

/** ---------- Pull Request ---------- */
export async function createPullRequest(input: CreatePrInput): Promise<CreatePrResult> {
  const token = getGitHubAuthToken();
  const url = `https://api.github.com/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(
    input.repo
  )}/pulls`;

  const payload: any = {
    title: input.title,
    head: input.head,
    base: input.base,
  };
  if (input.body) payload.body = input.body;

  const json = await ghRequest(token, url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    number: json.number,
    html_url: json.html_url,
    state: json.state,
    title: json.title,
  };
}
