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

export const RUN_ID = "run_7f3c · market-brief";
export const RUN_ORIGIN = Date.parse("2026-09-30T14:02:00.000Z");
export const RUN_SPAN_MS = 9200;
export const SLOTS = ["w1", "w2", "w3"] as const;

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

const pages = (
  n: number,
  from: number,
  each: number,
  what: string,
): CallSpec[] =>
  Array.from({ length: n }, (_, i) => ({
    atMs: from + i * each,
    durationMs: each - 40,
    kind: "tool_call" as const,
    detail: `http GET ${what}?page=${i + 1} · 200 · ${18 + ((i * 7) % 23)} KB`,
  }));

const TASK_SPECS: TaskSpec[] = [
  {
    key: "plan",
    agent: "planner",
    spawnMs: 10,
    summary: "split the brief into 5 fetches, an analysis and a write-up",
    splits: [
      "fetch_prices",
      "fetch_filings",
      "fetch_news",
      "fetch_ratings",
      "fetch_fx",
      "analyse",
      "write",
      "verify",
    ],
    attempts: [
      {
        slot: "w1",
        startMs: 40,
        durationMs: 1200,
        status: "succeeded",
        calls: [
          {
            atMs: 20,
            durationMs: 180,
            kind: "tool_call",
            detail: 'catalog.search "semis q3" · 14 datasets',
          },
          {
            atMs: 220,
            durationMs: 940,
            kind: "llm_call",
            detail: "claude-sonnet-5-5 · 2,140 → 412 tok",
          },
        ],
      },
    ],
  },
  {
    key: "fetch_prices",
    agent: "researcher",
    parent: "plan",
    spawnMs: 1240,
    summary: "12 tickers · 90 days of closes",
    attempts: [
      {
        slot: "w1",
        startMs: 1260,
        durationMs: 1800,
        status: "succeeded",
        calls: pages(4, 40, 420, "/prices"),
      },
    ],
  },
  {
    key: "fetch_filings",
    agent: "researcher",
    parent: "plan",
    spawnMs: 1240,
    summary: "38 filings · 10-Q and 8-K",
    attempts: [
      {
        slot: "w2",
        startMs: 1260,
        durationMs: 800,
        status: "failed",
        error: {
          code: "http_429",
          message: "rate limited by filings API",
          retry: "backoff 500ms · next free slot",
        },
        calls: [
          ...pages(2, 40, 300, "/filings"),
          {
            atMs: 660,
            durationMs: 120,
            kind: "tool_call",
            level: "warn",
            detail: "http GET /filings?page=3 · 429 · retry-after 0.5s",
          },
        ],
      },
      {
        slot: "w3",
        startMs: 2860,
        durationMs: 2200,
        status: "succeeded",
        calls: pages(5, 40, 420, "/filings"),
      },
    ],
  },
  {
    key: "fetch_news",
    agent: "researcher",
    parent: "plan",
    spawnMs: 1240,
    summary: "61 articles · deduplicated to 44",
    attempts: [
      {
        slot: "w3",
        startMs: 1260,
        durationMs: 1600,
        status: "succeeded",
        calls: [
          ...pages(3, 40, 380, "/news"),
          {
            atMs: 1200,
            durationMs: 360,
            kind: "llm_call",
            detail: "claude-haiku-4-5 · dedupe · 9,800 → 220 tok",
          },
        ],
      },
    ],
  },
  {
    key: "fetch_ratings",
    agent: "researcher",
    parent: "plan",
    spawnMs: 1240,
    summary: "analyst ratings · 12 of 12 tickers",
    attempts: [
      {
        slot: "w2",
        startMs: 2080,
        durationMs: 1200,
        status: "succeeded",
        calls: pages(2, 60, 540, "/ratings"),
      },
    ],
  },
  {
    key: "fetch_fx",
    agent: "researcher",
    parent: "plan",
    spawnMs: 1240,
    summary: "USD, EUR, JPY, TWD daily rates",
    attempts: [
      {
        slot: "w1",
        startMs: 3080,
        durationMs: 600,
        status: "succeeded",
        calls: pages(1, 40, 520, "/fx"),
      },
    ],
  },
  {
    key: "analyse",
    agent: "analyst",
    parent: "plan",
    spawnMs: 1240,
    summary: "waited on 5 fetches, then split in two",
    splits: ["analyse.margins", "analyse.risk"],
    attempts: [
      {
        slot: "w1",
        startMs: 5080,
        durationMs: 220,
        status: "succeeded",
        calls: [
          {
            atMs: 20,
            durationMs: 180,
            kind: "llm_call",
            detail: "claude-sonnet-5-5 · 1,020 → 96 tok",
          },
        ],
      },
    ],
  },
  {
    key: "analyse.margins",
    agent: "analyst",
    parent: "analyse",
    spawnMs: 5300,
    summary: "gross margin by segment · 12 companies",
    attempts: [
      {
        slot: "w1",
        startMs: 5320,
        durationMs: 1600,
        status: "succeeded",
        calls: [
          {
            atMs: 40,
            durationMs: 420,
            kind: "tool_call",
            detail: "sql · join prices × filings · 1,204 rows",
          },
          {
            atMs: 500,
            durationMs: 1040,
            kind: "llm_call",
            detail: "claude-sonnet-5-5 · 11,300 → 1,280 tok",
          },
        ],
      },
    ],
  },
  {
    key: "analyse.risk",
    agent: "analyst",
    parent: "analyse",
    spawnMs: 5300,
    summary: "not retried — the input shape was wrong, not the network",
    attempts: [
      {
        slot: "w2",
        startMs: 5320,
        durationMs: 800,
        status: "failed",
        error: {
          code: "schema_mismatch",
          message: 'ratings.consensus expected number, got "n/a" on 3 rows',
        },
        calls: [
          {
            atMs: 40,
            durationMs: 300,
            kind: "tool_call",
            detail: "sql · ratings × news sentiment · 44 rows",
          },
          {
            atMs: 380,
            durationMs: 380,
            kind: "tool_call",
            level: "error",
            detail: "validate · ratings.consensus · 3 rows rejected",
          },
        ],
      },
    ],
  },
  {
    key: "write",
    agent: "writer",
    parent: "plan",
    spawnMs: 1240,
    summary: "brief written without the risk section",
    attempts: [
      {
        slot: "w3",
        startMs: 6940,
        durationMs: 1800,
        status: "succeeded",
        calls: [
          {
            atMs: 20,
            durationMs: 1100,
            kind: "llm_call",
            detail: "claude-sonnet-5-5 · draft · 14,900 → 2,030 tok",
          },
          {
            atMs: 1140,
            durationMs: 620,
            kind: "llm_call",
            detail: "claude-haiku-4-5 · tighten · 2,100 → 1,640 tok",
          },
        ],
      },
    ],
  },
  {
    key: "verify",
    agent: "orchestrator",
    parent: "plan",
    spawnMs: 1240,
    summary: "17 of 17 figures traced to a source",
    attempts: [
      {
        startMs: 8760,
        durationMs: 400,
        status: "succeeded",
        calls: [
          {
            atMs: 20,
            durationMs: 360,
            kind: "tool_call",
            detail: "citations.check · 17 figures · 17 grounded",
          },
        ],
      },
    ],
  },
];

/** Task keys in plan order — the Gantt's row order. */
export const TASK_KEYS = TASK_SPECS.map((t) => t.key);

const SPEC = new Map(TASK_SPECS.map((t) => [t.key, t]));

/** How deep a task sits under the plan — 0 for the plan itself. */
export function taskDepth(key: string | undefined): number {
  let depth = 0;
  let parent = key ? SPEC.get(key)?.parent : undefined;
  while (parent) {
    depth += 1;
    parent = SPEC.get(parent)?.parent;
  }
  return depth;
}

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
 * is an outline. Subtasks are marked with `└` — `TaskGantt` has no nesting.
 */
export function ganttTasks(nowMs = Infinity): TaskGanttTask[] {
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
    const depth = taskDepth(key);
    const calls = own.filter(
      (e) => e.kind === "tool_call" || e.kind === "llm_call",
    );

    return [
      {
        key,
        label: depth ? `${"\u00a0\u00a0".repeat(depth - 1)}└ ${key}` : key,
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
