import { Router, Request, Response } from "express";
import { getEventStore } from "../lib/eventStore";

const router = Router();

/**
 * POST /api/events
 * Body:
 * {
 *   kind: string,
 *   source: string,
 *   severity?: "info"|"warn"|"error",
 *   tags?: string[],
 *   data: object
 * }
 */
router.post("/events", (req: Request, res: Response) => {
  const store = getEventStore();

  const { kind, source, severity, tags, data } = req.body || {};

  if (!kind || !source || typeof data !== "object" || data === null) {
    return res.status(400).json({
      error: "Bad Request",
      details: "Required: kind, source, data(object)",
    });
  }

  const event = store.create({
    kind,
    source,
    severity,
    tags,
    data,
  });

  return res.status(201).json({ status: "ok", event });
});

/**
 * GET /api/events?kind=&source=&severity=&tag=&limit=
 */
router.get("/events", (req: Request, res: Response) => {
  const store = getEventStore();

  const events = store.list({
    kind: req.query.kind as string | undefined,
    source: req.query.source as string | undefined,
    severity: req.query.severity as string | undefined,
    tag: req.query.tag as string | undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });

  return res.status(200).json({ status: "ok", events });
});

/**
 * GET /api/events/:id
 */
router.get("/events/:id", (req: Request, res: Response) => {
  const store = getEventStore();
  const event = store.get(req.params.id);

  if (!event) {
    return res.status(404).json({ error: "Not Found" });
  }

  return res.status(200).json({ status: "ok", event });
});

export default router;
