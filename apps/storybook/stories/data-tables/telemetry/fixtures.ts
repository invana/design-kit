import run from "../../../fixtures/data-tables/telemetry-run.json";
import type {
  TaskGanttSegment,
  TaskGanttStatus,
  TaskGanttTask,
} from "@invana/ui";

/**
 * One agent run's low-level telemetry — the stream an engine writes while it
 * works, and the one thing every story in `Data Tables/Telemetry` reads.
 *
 * The run: a planner splits a market brief into five fetches and an analysis;
 * the analysis splits again into margins and risk; a writer and a verifier
 * finish it. Three worker slots, so fetches queue for one. `fetch_filings` is
 * rate-limited and retried on another slot; `analyse.risk` fails on a schema
 * mismatch and is not retried, so the brief ships without it.
 *
 * Everything below `EVENTS` is derived from it — the Gantt rows, the slot
 * lanes, the counts — the way a real surface would derive them from the log,
 * so a story can cut the log at any `nowMs` and replay the run.
 */

export const RUN_ID = run.id;
export const RUN_ORIGIN = Date.parse(run.origin);
export const RUN_SPAN_MS = run.spanMs;
export const SLOTS = run.slots;

export type TelemetryKind =
  | "run_started"
  | "task_spawned"
  | "split"
  | "slot_acquired"
  | "task_started"
  | "tool_call"
  | "llm_call"
  | "retry_scheduled"
  | "task_failed"
  | "task_succeeded"
  | "slot_released"
  | "run_finished";

export type TelemetryLevel = "info" | "warn" | "error";

export interface TelemetryEvent {
  seq: number;
  /** Milliseconds since the run started — what every view positions by. */
  offsetMs: number;
  ts: string;
  agent: string;
  taskKey?: string;
  parentKey?: string;
  slot?: string;
  attempt?: number;
  kind: TelemetryKind;
  level: TelemetryLevel;
  durationMs?: number;
  detail: string;
}

// ── The run, as a plan ──────────────────────────────────────────────────────

interface CallSpec {
  /** From the attempt's start. */
  atMs: number;
  durationMs: number;
  kind: "tool_call" | "llm_call";
  detail: string;
  level?: TelemetryLevel;
}

interface AttemptSpec {
  slot?: string;
  startMs: number;
  durationMs: number;
  status: "succeeded" | "failed";
  error?: { code: string; message: string; retry?: string };
  calls: CallSpec[];
}

interface TaskSpec {
  key: string;
  agent: string;
  parent?: string;
  spawnMs: number;
  attempts: AttemptSpec[];
  /** Subtasks this task hands out when it finishes. */
  splits?: string[];
  summary: string;
}

/** The plan, from `fixtures/data-tables/telemetry-run.json`. */
const TASK_SPECS = run.tasks as TaskSpec[];

/** Task keys in plan order — the Gantt's row order. */
export const TASK_KEYS = TASK_SPECS.map((t) => t.key);

const SPEC = new Map(TASK_SPECS.map((t) => [t.key, t]));

// ── The run, as the engine logged it ────────────────────────────────────────

function buildEvents(): TelemetryEvent[] {
  type Draft = Omit<TelemetryEvent, "seq" | "ts">;
  const out: Draft[] = [
    {
      offsetMs: 0,
      agent: "orchestrator",
      kind: "run_started",
      level: "info",
      detail: `${RUN_ID} · 3 worker slots`,
    },
  ];

  for (const t of TASK_SPECS) {
    const base = { agent: t.agent, taskKey: t.key, parentKey: t.parent };
    out.push({
      ...base,
      offsetMs: t.spawnMs,
      kind: "task_spawned",
      level: "info",
      detail: t.parent ? `from ${t.parent}` : "root task",
    });

    t.attempts.forEach((a, i) => {
      const attempt = i + 1;
      const end = a.startMs + a.durationMs;
      const at = { ...base, attempt, slot: a.slot };
      if (a.slot)
        out.push({
          ...at,
          offsetMs: a.startMs,
          kind: "slot_acquired",
          level: "info",
          detail: `${a.slot} · waited ${a.startMs - t.spawnMs}ms`,
        });
      out.push({
        ...at,
        offsetMs: a.startMs,
        kind: "task_started",
        level: "info",
        detail: attempt > 1 ? `attempt ${attempt}` : t.summary,
      });
      for (const c of a.calls) {
        out.push({
          ...at,
          offsetMs: a.startMs + c.atMs,
          kind: c.kind,
          level: c.level ?? "info",
          durationMs: c.durationMs,
          detail: c.detail,
        });
      }
      if (a.status === "failed") {
        out.push({
          ...at,
          offsetMs: end,
          kind: "task_failed",
          level: "error",
          durationMs: a.durationMs,
          detail: `${a.error?.code} · ${a.error?.message}`,
        });
        if (a.error?.retry)
          out.push({
            ...at,
            offsetMs: end,
            kind: "retry_scheduled",
            level: "warn",
            detail: a.error.retry,
          });
      } else {
        out.push({
          ...at,
          offsetMs: end,
          kind: "task_succeeded",
          level: "info",
          durationMs: a.durationMs,
          detail: t.summary,
        });
        if (t.splits)
          out.push({
            ...at,
            offsetMs: end,
            kind: "split",
            level: "info",
            detail: `→ ${t.splits.length} subtasks: ${t.splits.join(", ")}`,
          });
      }
      if (a.slot)
        out.push({
          ...at,
          offsetMs: end,
          kind: "slot_released",
          level: "info",
          detail: a.slot,
        });
    });
  }

  out.push({
    offsetMs: RUN_SPAN_MS,
    agent: "orchestrator",
    kind: "run_finished",
    level: "warn",
    durationMs: RUN_SPAN_MS,
    detail: "succeeded with 1 failed task · analyse.risk",
  });

  return out
    .map((e, i) => ({ e, i }))
    .sort((a, b) => a.e.offsetMs - b.e.offsetMs || a.i - b.i)
    .map(({ e }, seq) => ({
      ...e,
      seq: seq + 1,
      ts: new Date(RUN_ORIGIN + e.offsetMs).toISOString(),
    }));
}

export const EVENTS: TelemetryEvent[] = buildEvents();

/** The log as it stood at `nowMs` — what a live surface would have received. */
export const eventsUntil = (nowMs: number) =>
  EVENTS.filter((e) => e.offsetMs <= nowMs);

export const AGENTS = [...new Set(EVENTS.map((e) => e.agent))];
export const KINDS = [...new Set(EVENTS.map((e) => e.kind))];
export const LEVELS: TelemetryLevel[] = ["info", "warn", "error"];

// ── Derived views ───────────────────────────────────────────────────────────

const tokenCount = (detail: string) => {
  const m = detail.match(/([\d,]+) → ([\d,]+) tok/);
  return m
    ? Number(m[1].replace(/,/g, "")) + Number(m[2].replace(/,/g, ""))
    : 0;
};

/**
 * One Gantt row per task, read off the log up to `nowMs`: a finished attempt
 * is a bar, the attempt in flight runs to *now*, a task spawned but not started
 * is an outline. Each task carries the tasks it split into as `subtasks`, so
 * the result is the plan's tree — `plan`, its fetches and `analyse`, and
 * `analyse`'s two — and `TaskGantt` nests it.
 */
export function ganttTasks(nowMs = Infinity): TaskGanttTask[] {
  const rows = ganttRows(nowMs);
  const seen = new Set(rows.map((r) => r.key));
  const nest = (row: TaskGanttTask): TaskGanttTask => {
    const kids = rows.filter((r) => SPEC.get(r.key)?.parent === row.key);
    return kids.length ? { ...row, subtasks: kids.map(nest) } : row;
  };
  return rows.filter((r) => !seen.has(SPEC.get(r.key)?.parent ?? "")).map(nest);
}

/** Every task in a tree, parents before their subtasks — for counts and lookups. */
export const everyTask = (tasks: TaskGanttTask[]): TaskGanttTask[] =>
  tasks.flatMap((t) => [t, ...everyTask(t.subtasks ?? [])]);

/** Every task with subtasks, open — what a story passes to show the whole tree. */
export const allOpen = (tasks: TaskGanttTask[]): Record<string, boolean> =>
  Object.fromEntries(everyTask(tasks).filter((t) => t.subtasks?.length).map((t) => [t.key, true]));

/** The Gantt's rows in plan order, flat — `ganttTasks` nests them. */
function ganttRows(nowMs: number): TaskGanttTask[] {
  const seen = eventsUntil(nowMs);
  return TASK_KEYS.flatMap((key) => {
    const own = seen.filter((e) => e.taskKey === key);
    if (!own.length) return [];

    const segments: TaskGanttSegment[] = [];
    for (const start of own.filter((e) => e.kind === "task_started")) {
      const end = own.find(
        (e) =>
          e.attempt === start.attempt &&
          (e.kind === "task_succeeded" || e.kind === "task_failed"),
      );
      segments.push({
        startMs: start.offsetMs,
        durationMs:
          (end?.offsetMs ?? Math.min(nowMs, RUN_SPAN_MS)) - start.offsetMs,
        status: end
          ? end.kind === "task_failed"
            ? "failed"
            : "succeeded"
          : "running",
        title: `${key} · attempt ${start.attempt} · ${start.slot ?? "no slot"}`,
      });
    }

    const last = segments[segments.length - 1];
    const failed = own.filter((e) => e.kind === "task_failed").pop();
    const status: TaskGanttStatus = last?.status ?? "queued";
    const calls = own.filter(
      (e) => e.kind === "tool_call" || e.kind === "llm_call",
    );

    return [
      {
        key,
        ...(last ?? {}),
        status,
        attempts: segments.slice(0, -1),
        summary: SPEC.get(key)?.summary,
        error:
          status === "failed" && failed
            ? {
                code: failed.detail.split(" · ")[0],
                message: failed.detail.split(" · ").slice(1).join(" · "),
              }
            : undefined,
        result: {
          agent: own[0].agent,
          slot:
            [...new Set(own.map((e) => e.slot).filter(Boolean))].join(" → ") ||
            "—",
          calls: calls.length,
          tokens: calls.reduce((n, e) => n + tokenCount(e.detail), 0) || "—",
        },
        log: own[own.length - 1].detail,
      },
    ];
  });
}

export interface SlotRun {
  taskKey: string;
  attempt: number;
  startMs: number;
  durationMs: number;
  status: TaskGanttStatus;
}

/** What each worker slot held, in order, up to `nowMs`. */
export function slotRuns(nowMs = Infinity): Record<string, SlotRun[]> {
  const seen = eventsUntil(nowMs);
  const lanes: Record<string, SlotRun[]> = Object.fromEntries(
    SLOTS.map((s) => [s, []]),
  );
  for (const got of seen.filter((e) => e.kind === "slot_acquired")) {
    const done = seen.find(
      (e) =>
        e.taskKey === got.taskKey &&
        e.attempt === got.attempt &&
        (e.kind === "task_succeeded" || e.kind === "task_failed"),
    );
    lanes[got.slot!].push({
      taskKey: got.taskKey!,
      attempt: got.attempt!,
      startMs: got.offsetMs,
      durationMs:
        (done?.offsetMs ?? Math.min(nowMs, RUN_SPAN_MS)) - got.offsetMs,
      status: done
        ? done.kind === "task_failed"
          ? "failed"
          : "succeeded"
        : "running",
    });
  }
  return lanes;
}

/**
 * One Gantt row per slot. `TaskGantt` draws a row's `attempts` before its main
 * segment, each in its own status colour, so every run but the last goes in
 * `attempts` — the lane is a sequence of tasks, not retries of one.
 */
export function slotLaneTasks(nowMs = Infinity): TaskGanttTask[] {
  const lanes = slotRuns(nowMs);
  const elapsed = Math.min(nowMs, RUN_SPAN_MS);
  return SLOTS.map((slot) => {
    const runs: TaskGanttSegment[] = lanes[slot].map((r) => ({
      startMs: r.startMs,
      durationMs: r.durationMs,
      status: r.status,
      title: `${r.taskKey}${r.attempt > 1 ? ` #${r.attempt}` : ""} · ${formatMs(r.durationMs)}`,
    }));
    const busy = runs.reduce((n, r) => n + (r.durationMs ?? 0), 0);
    return {
      key: slot,
      ...(runs[runs.length - 1] ?? { status: "queued" as const }),
      attempts: runs.slice(0, -1),
      duration:
        elapsed > 0 ? `${Math.round((busy / elapsed) * 100)}% busy` : "—",
    };
  });
}

// ── Formatting ──────────────────────────────────────────────────────────────

/** `+1.260s` — the offset a telemetry reader scans down. */
export const formatOffset = (ms: number) => `+${(ms / 1000).toFixed(3)}s`;

export const formatMs = (ms?: number) =>
  ms == null ? "—" : ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;

export const LEVEL_TONE = {
  info: "muted",
  warn: "warning",
  error: "error",
} as const;
