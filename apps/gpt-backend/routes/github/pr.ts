import { Router, Request, Response } from "express";
import { getEventStore } from "../../lib/eventStore";
import { createBranch, commitFile, createPullRequest } from "../../lib/githubClient";

const router = Router();

/**
 * POST /api/github/pr
 *
 * Crea una rama desde base, commitea 1..N archivos (contenido completo) y abre PR.
 *
 * Body:
 * {
 *   owner?: string,
 *   repo?: string,
 *   base?: string,              // default: "main"
 *   branch: string,             // required
 *   title: string,              // required
 *   body?: string,
 *   commits: [
 *     { path: string, content: string, message: string }
 *   ]
 * }
 */
router.post("/github/pr", async (req: Request, res: Response) => {
  const store = getEventStore();

  const finalOwner = (req.body?.owner || process.env.GITHUB_OWNER || "").trim();
  const finalRepo = (req.body?.repo || process.env.GITHUB_REPO || "").trim();
  const base = (req.body?.base || "main").trim();
  const branch = (req.body?.branch || "").trim();
  const title = (req.body?.title || "").trim();
  const body = typeof req.body?.body === "string" ? req.body.body : undefined;
  const commits = Array.isArray(req.body?.commits) ? req.body.commits : [];

  if (!finalOwner || !finalRepo) {
    return res.status(400).json({
      error: "Bad Request",
      details: "Missing owner/repo. Provide in body or set env GITHUB_OWNER/GITHUB_REPO.",
    });
  }

  if (!branch) {
    return res.status(400).json({ error: "Bad Request", details: "Missing branch." });
  }

  if (!title) {
    return res.status(400).json({ error: "Bad Request", details: "Missing title." });
  }

  if (!Array.isArray(commits) || commits.length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      details: "commits[] required. Provide at least 1 file change.",
    });
  }

  try {
    // 1) branch
    const br = await createBranch({
      owner: finalOwner,
      repo: finalRepo,
      baseBranch: base,
      newBranch: branch,
    });

    // 2) commit files (1..N)
    const results: any[] = [];
    for (const c of commits) {
      if (!c?.path || typeof c.path !== "string") {
        return res.status(400).json({ error: "Bad Request", details: "Each commit must include path." });
      }
      if (typeof c.content !== "string") {
        return res.status(400).json({ error: "Bad Request", details: "Each commit must include content (string)." });
      }
      const msg = (typeof c.message === "string" && c.message.trim())
        ? c.message.trim()
        : `chore: update ${c.path}`;

      const r = await commitFile({
        owner: finalOwner,
        repo: finalRepo,
        branch,
        path: c.path,
        contentUtf8: c.content,
        message: msg,
      });

      results.push(r);
    }

    // 3) PR
    const pr = await createPullRequest({
      owner: finalOwner,
      repo: finalRepo,
      title,
      body,
      head: branch,
      base,
    });

    // Audit event
    store.create({
      kind: "repo_change",
      source: "backend",
      severity: "info",
      tags: ["github", "pr"],
      data: {
        action: "create_pr",
        owner: finalOwner,
        repo: finalRepo,
        base,
        branch,
        prNumber: pr.number,
        prUrl: pr.html_url,
        files: results.map((x) => x.contentPath),
      },
    });

    return res.status(201).json({
      status: "ok",
      branch: br,
      commits: results,
      pr,
    });
  } catch (err: any) {
    const status = err?.status || 500;
    return res.status(status).json({
      error: "GitHub PR creation failed",
      details: err?.message || String(err),
      code: err?.code,
      githubStatus: err?.githubStatus,
    });
  }
});

export default router;
