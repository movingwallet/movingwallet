import { Router, Request, Response } from "express";
import { createGitHubIssue } from "../../lib/githubClient";
import { getEventStore } from "../../lib/eventStore";

const router = Router();

/**
 * POST /api/github/issues
 * Auth: Bearer <API_TOKEN> (tu middleware actual)
 *
 * Body:
 * {
 *   owner?: string,
 *   repo?: string,
 *   title: string,
 *   body?: string,
 *   labels?: string[],
 *   assignees?: string[]
 * }
 *
 * Defaults:
 * - owner/repo from env: GITHUB_OWNER, GITHUB_REPO
 */
router.post("/github/issues", async (req: Request, res: Response) => {
  const { owner, repo, title, body, labels, assignees } = req.body || {};

  const finalOwner = (owner || process.env.GITHUB_OWNER || "").trim();
  const finalRepo = (repo || process.env.GITHUB_REPO || "").trim();

  if (!finalOwner || !finalRepo) {
    return res.status(400).json({
      error: "Bad Request",
      details: "Missing owner/repo. Provide in body or set env GITHUB_OWNER/GITHUB_REPO.",
    });
  }

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Bad Request",
      details: "Missing title (string).",
    });
  }

  try {
    const issue = await createGitHubIssue({
      owner: finalOwner,
      repo: finalRepo,
      title: title.trim(),
      body: typeof body === "string" ? body : undefined,
      labels: Array.isArray(labels) ? labels : undefined,
      assignees: Array.isArray(assignees) ? assignees : undefined,
    });

    // Audit event (para futura BBDD/vector)
    const store = getEventStore();
    store.create({
      kind: "repo_change",
      source: "backend",
      severity: "info",
      tags: ["github", "issue"],
      data: {
        action: "create_issue",
        owner: finalOwner,
        repo: finalRepo,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        title: issue.title,
      },
    });

    return res.status(201).json({ status: "ok", issue });
  } catch (err: any) {
    const status = err?.status || 500;
    return res.status(status).json({
      error: "GitHub issue creation failed",
      details: err?.message || String(err),
      code: err?.code,
      githubStatus: err?.githubStatus,
    });
  }
});

export default router;
