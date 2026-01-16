import fs from "fs";
import path from "path";
import crypto from "crypto";

export type EventKind =
  | "ai_diagnostic"
  | "ci_failure"
  | "ci_success"
  | "repo_plan"
  | "repo_change"
  | "deploy_event"
  | "note";

export type EventRecord = {
  id: string;
  ts: string; // ISO
  kind: EventKind;
  source: string; // e.g. "ci", "gpt", "backend"
  severity?: "info" | "warn" | "error";
  tags?: string[];
  data: Record<string, any>;
};

export type ListEventsQuery = {
  kind?: string;
  source?: string;
  severity?: string;
  tag?: string;
  limit?: number;
};

const DEFAULT_LIMIT = 50;
const MAX_IN_MEMORY = 1000;

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  // short, unique enough for logs
  return crypto.randomUUID();
}

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function safeParseJson(line: string): any | null {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

export class EventStore {
  private memory: EventRecord[] = [];
  private filePath: string;

  constructor(opts?: { filePath?: string }) {
    const baseDir = path.join(process.cwd(), "data");
    ensureDir(baseDir);

    this.filePath =
      opts?.filePath || path.join(baseDir, "events.jsonl");

    // Best-effort preload (non-fatal)
    this.preloadFromFile();
  }

  private preloadFromFile() {
    try {
      if (!fs.existsSync(this.filePath)) return;
      const content = fs.readFileSync(this.filePath, "utf8");
      const lines = content.split("\n").filter(Boolean);
      const events = lines
        .map((l) => safeParseJson(l))
        .filter(Boolean) as EventRecord[];

      // keep last MAX_IN_MEMORY
      this.memory = events.slice(-MAX_IN_MEMORY);
    } catch {
      // ignore preload errors
    }
  }

  public create(input: Omit<EventRecord, "id" | "ts">): EventRecord {
    const event: EventRecord = {
      id: newId(),
      ts: nowIso(),
      kind: input.kind,
      source: input.source,
      severity: input.severity || "info",
      tags: input.tags || [],
      data: input.data || {},
    };

    // Write-ahead log (append-only)
    try {
      fs.appendFileSync(this.filePath, JSON.stringify(event) + "\n", "utf8");
    } catch {
      // if disk fails, still keep in memory
    }

    this.memory.push(event);
    if (this.memory.length > MAX_IN_MEMORY) {
      this.memory = this.memory.slice(-MAX_IN_MEMORY);
    }

    return event;
  }

  public list(q: ListEventsQuery = {}) {
    const limit = Math.max(
      1,
      Math.min(Number(q.limit || DEFAULT_LIMIT), 500)
    );

    let res = [...this.memory].reverse(); // newest first

    if (q.kind) res = res.filter((e) => e.kind === q.kind);
    if (q.source) res = res.filter((e) => e.source === q.source);
    if (q.severity) res = res.filter((e) => e.severity === q.severity);
   if (typeof q.tag === "string" && q.tag.length > 0) {
  const tag = q.tag;
  res = res.filter((e) => (e.tags || []).includes(tag));
}

    return res.slice(0, limit);
  }

  public get(id: string): EventRecord | null {
    return this.memory.find((e) => e.id === id) || null;
  }
}

// Singleton (simple, predictable)
let _store: EventStore | null = null;

export function getEventStore() {
  if (_store) return _store;
  _store = new EventStore();
  return _store;
}
