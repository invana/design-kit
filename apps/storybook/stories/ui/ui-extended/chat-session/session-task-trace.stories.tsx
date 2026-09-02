import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  ChatSession,
  ChatSessionActivityRow,
  type ChatSessionActivityStatus,
  ChatSessionActivitySubLine,
  ChatSessionComposer,
  ChatSessionDisclosure,
  ChatSessionMessageOptions,
  ChatSessionProgressLine,
  ChatSessionPromptRow,
  ChatSessionStatusBar,
  ChatSessionTaskGroup,
  ChatSessionTaskRow,
  type ChatSessionTaskStatus,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@invana/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@invana/forms";
import {
  ArrowUp,
  Code,
  Copy,
  Info,
  List,
  MessageSquare,
  Paperclip,
  RotateCw,
  Square,
  ThumbsDown,
  ThumbsUp,
  Timer,
} from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// Session task trace — every reply shows the tasks that produced it.
//
// The Sessions rail on the left is live: send a question, or press Play on a
// walkthrough state to watch it happen. Steps are the workflow behind a reply
// (Understand → Validate → Execute → Project), each one a task with its own
// status, timing and trace. Example data throughout: an airports graph, a
// local Qwen model.
//
// Icons stay story-side: the chat-session family is icon-agnostic.

// ── Data ─────────────────────────────────────────────────────────────

const CYPHER = `MATCH (a:Airline)-[:OPERATES]->(r:Route)-[:FROM]->(:Airport {iata: "FRA"})
MATCH (r)-[:TO]->(:Airport)-[:IN]->(c:Country)
WITH a, count(DISTINCT c) AS countries
WHERE countries > 20
RETURN a.name, countries ORDER BY countries DESC`;

type StepId = "understand" | "validate" | "execute" | "project";

const STEP_ORDER: StepId[] = ["understand", "validate", "execute", "project"];

const STEP_DEFS: Record<StepId, { key: string; label: string }> = {
  understand: { key: "translate_thought", label: "Understand" },
  validate: { key: "validate_query", label: "Validate" },
  execute: { key: "execute_graph_query", label: "Execute" },
  project: { key: "shape_for_canvas", label: "Project" },
};

type StepStatus =
  | "queued"
  | "running"
  | "success"
  | "error"
  | "needs-input"
  | "stopped"
  | "retrying";

/** `[label, value]`; a `null` value renders the label as a group heading. */
type TraceRow = [string, string | null];

interface Step {
  id: StepId;
  key: string;
  label: string;
  status: StepStatus;
  desc: string;
  dur: number | null;
  attempt: number;
  trace: TraceRow[] | null;
  open: boolean;
  /** The model's reasoning, streamed under the step while it runs. */
  thinking?: string | null;
  startedAt?: number;
}

type TurnStatus = "running" | "success" | "needs-input" | "error" | "stopped";

interface Turn {
  id: string;
  prompt: string;
  when: string;
  status: TurnStatus;
  text: string;
  meta: string;
  stepsOpen: boolean;
  queryOpen: boolean;
  feedback: "up" | "down" | null;
  steps: Step[];
  result?: string | null;
  options?: string[] | null;
}

const fmt = (ms: number) =>
  ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
const nowStr = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function makeSteps(over: Partial<Record<StepId, Partial<Step>>> = {}): Step[] {
  return STEP_ORDER.map((id) => ({
    id,
    key: STEP_DEFS[id].key,
    label: STEP_DEFS[id].label,
    status: "queued" as StepStatus,
    desc: "",
    dur: null,
    attempt: 1,
    trace: null,
    open: false,
    ...(over[id] ?? {}),
  }));
}

function traceUnderstand(): TraceRow[] {
  return [
    ["Input", null],
    ["prompt", "Which airlines connect Frankfurt to more than 20 countries?"],
    ["schema", "model v7 · 5 node types · 6 relationship types"],
    ["context", "3 prior turns (2 queries, 1 clarification)"],
    ["model", "local · qwen3-27b · timeout 120s"],
    ["Output", null],
    ["query", CYPHER],
    [
      "rationale",
      'Airlines operate routes; a route is FROM one airport and TO another; countries hang off airports. Counting distinct destination countries per airline answers "how many countries".',
    ],
    ["tokens", "1,240 in · 96 out"],
  ];
}
function traceValidate(): TraceRow[] {
  return [
    ["Input", null],
    ["query", "sha256:9f2c…a71b"],
    ["Output", null],
    ["verdict", "read-only · no CREATE / MERGE / DELETE / SET"],
    ["labels", "Airline, Route, Airport, Country — all in model v7"],
  ];
}
function traceExecute(rows: number): TraceRow[] {
  return [
    ["Input", null],
    ["query", "sha256:9f2c…a71b"],
    ["connection", "neo4j · airports-prod · read replica"],
    ["limits", "timeout 30s · page 500"],
    ["Output", null],
    ["rows", `${rows} · 3 batches`],
    ["emitted", "graph.delta ×3"],
  ];
}
function traceProject(n: number, e: number): TraceRow[] {
  return [
    ["Input", null],
    ["rows", "sha256:44e0…c210"],
    ["Output", null],
    ["canvas", `${n} nodes · ${e} relationships · layout: force`],
    ["summary", "text.delta ×1"],
  ];
}

// The seeded, settled turn — the panel opens mid-session.
const SEED_TURNS: Turn[] = [
  {
    id: "t0",
    prompt: "Which airlines connect Frankfurt to more than 20 countries?",
    when: "02:41",
    status: "success",
    text: "Found 14 airlines. Added 14 nodes and 212 relationships to the canvas.",
    meta: "local · qwen3-27b · 14 rows · LLM 0.9s · query 1.4s",
    stepsOpen: false,
    queryOpen: false,
    feedback: null,
    result: "14 nodes · 212 relationships",
    steps: makeSteps({
      understand: {
        status: "success",
        dur: 912,
        desc: "proposed Cypher · 5 lines · confidence 0.86",
        trace: traceUnderstand(),
      },
      validate: {
        status: "success",
        dur: 12,
        desc: "read-only ✓ · Airline, Route, Airport, Country",
        trace: traceValidate(),
      },
      execute: {
        status: "success",
        dur: 1412,
        desc: "14 rows · 3 batches",
        trace: traceExecute(14),
      },
      project: {
        status: "success",
        dur: 48,
        desc: "14 nodes · 212 relationships → canvas",
        trace: traceProject(14, 212),
      },
    }),
  },
];

// ── Status mapping ───────────────────────────────────────────────────

const stepRowStatus: Record<StepStatus, ChatSessionTaskStatus> = {
  queued: "queued",
  running: "running",
  success: "success",
  error: "error",
  "needs-input": "needs-input",
  stopped: "needs-input",
  retrying: "needs-input",
};

const turnRowStatus: Record<TurnStatus, ChatSessionActivityStatus> = {
  running: "pending",
  success: "success",
  "needs-input": "info",
  error: "error",
  stopped: "warning",
};

// ── Walkthrough copy ─────────────────────────────────────────────────

type Scenario = "ask" | "clarify" | "fail" | "stop" | "trace" | "tasks";

const STATES: { title: string; body: ReactNode; play: Scenario }[] = [
  {
    title: "Send",
    play: "ask",
    body: "The prompt lands as a caret row and the reply row appears at once with its plan: four queued steps, hollow dots. The first chip is visible within a few hundred milliseconds, before any model has answered, so the wait is never blank.",
  },
  {
    title: "Understand",
    play: "ask",
    body: (
      <>
        The first step pulses and its description says what it is doing in
        plain words: which model, how many prior turns it is reading.
        Underneath, the model&apos;s reasoning streams in as it thinks, so you
        see <em>how</em> it is reading the graph before any query exists. When
        the query is proposed the step settles with its duration and the
        reasoning folds into the trace.
      </>
    ),
  },
  {
    title: "Validate",
    play: "ask",
    body: "A query is never run unvalidated. The step is fast and usually invisible in time, but it is a row because it can fail, and a refused query is something you want on the record.",
  },
  {
    title: "Execute",
    play: "ask",
    body: "Rows arrive in batches; the description counts them up as they land and the canvas paints alongside. While anything runs, the running step is also pinned above the composer so you can scroll away and still see it.",
  },
  {
    title: "Project and settle",
    play: "ask",
    body: (
      <>
        The answer text replaces the placeholder, the meta line and toolbar
        appear, and the step list collapses to one line:{" "}
        <Kbd>✻ Thought for 2.4s · 4 of 4 steps</Kbd>. Click it to reopen. Older
        replies open the same way, so an answer from last week is as auditable
        as one from now.
      </>
    ),
  },
  {
    title: "Needs input",
    play: "clarify",
    body: (
      <>
        Understand can end with a question instead of a query. The step turns
        amber with <Kbd>needs input</Kbd>, the reply row is a question with
        options, and the pinned strip says the run is waiting on you. Picking
        an option resumes the same run; the step list continues rather than
        starting over.
      </>
    ),
  },
  {
    title: "Failure and retry",
    play: "fail",
    body: (
      <>
        A retry is a visible state, never a silent pause:{" "}
        <Kbd>retrying 2/3 · timeout</Kbd> with its own elapsed. If every attempt
        fails, the step goes red, the reply explains the cause, and offers what
        to do next.
      </>
    ),
  },
  {
    title: "Stop",
    play: "stop",
    body: (
      <>
        Press <Kbd>esc</Kbd>, or the stop button in the composer, while a run
        is in flight. The running step is marked stopped, the steps after it
        stay queued so you can see how far it got, and the reply reads{" "}
        <Kbd>Interrupted</Kbd> with a hint for what to do next.
      </>
    ),
  },
  {
    title: "Open a step",
    play: "trace",
    body: "Any step opens its trace: what went in, what came out, the attempt number, tokens. For Understand that is the prompt, the schema version, the prior turns and the proposed query with its rationale. This is the audit trail at task resolution.",
  },
  {
    title: "Tasks view",
    play: "tasks",
    body: "The status bar switches to Tasks: every step of every reply in this session, grouped by turn, newest first. Click a row to jump to its reply. Running and waiting turns float to the top.",
  },
];

function Kbd({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-control bg-accent px-1 text-foreground">
      {children}
    </code>
  );
}

function Dot({ status }: { status: ChatSessionTaskStatus | "info" }) {
  const cls: Record<ChatSessionTaskStatus | "info", string> = {
    queued: "bg-transparent border-[1.5px] border-muted-foreground",
    running: "bg-primary animate-pulse motion-reduce:animate-none",
    success: "bg-success",
    "needs-input": "bg-warning",
    error: "bg-destructive",
    info: "bg-info",
  };
  return (
    <i className={cn("inline-block h-1.5 w-1.5 rounded-full", cls[status])} />
  );
}

// ── Demo ─────────────────────────────────────────────────────────────

function SessionTaskTraceDemo() {
  const [turns, setTurns] = useState<Turn[]>(SEED_TURNS);
  const [view, setView] = useState<"chat" | "tasks">("chat");
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState("nl");
  const [model, setModel] = useState("qwen");
  const [timeoutS, setTimeoutS] = useState("120");
  const [isRunning, setIsRunning] = useState(false);
  const [runStart, setRunStart] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [scrollKey, setScrollKey] = useState(0);
  const timersRef = useRef<number[]>([]);
  const runningRef = useRef(false);

  // ── Timers ──
  const later = useCallback((ms: number, fn: () => void) => {
    const t = window.setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);
  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  // Tick while a run is in flight so step/reply elapsed readouts move.
  const anyLive = isRunning || turns.some((t) => t.status === "running");
  useEffect(() => {
    if (!anyLive) return;
    const i = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(i);
  }, [anyLive]);

  // ── State helpers ──
  const patchTurn = useCallback((id: string, fn: (t: Turn) => Turn) => {
    setTurns((prev) => prev.map((t) => (t.id === id ? fn(t) : t)));
  }, []);
  const patchStep = useCallback(
    (turnId: string, stepId: StepId, fn: (s: Step) => Step) => {
      patchTurn(turnId, (t) => ({
        ...t,
        steps: t.steps.map((s) => (s.id === stepId ? fn(s) : s)),
      }));
    },
    [patchTurn],
  );

  const start = (turnId: string, id: StepId, desc: string) =>
    patchStep(turnId, id, (s) => ({
      ...s,
      status: "running",
      desc,
      startedAt: Date.now(),
    }));
  const finish = (
    turnId: string,
    id: StepId,
    desc: string,
    dur: number,
    trace: TraceRow[],
  ) =>
    patchStep(turnId, id, (s) => ({
      ...s,
      status: "success",
      desc,
      dur,
      trace,
      thinking: null,
    }));
  // The model's reasoning, streamed word by word under the step while it
  // runs — the "thinking back to the user" line. Cleared when the step settles.
  const thinkAloud = (turnId: string, id: StepId, text: string, from: number) => {
    const words = text.split(" ");
    words.forEach((_, i) =>
      later(from + i * 38, () =>
        patchStep(turnId, id, (s) =>
          s.status === "running"
            ? {
                ...s,
                thinking:
                  words.slice(0, i + 1).join(" ") +
                  (i < words.length - 1 ? " …" : ""),
              }
            : s,
        ),
      ),
    );
  };

  const beginRun = () => {
    runningRef.current = true;
    setIsRunning(true);
    setRunStart(Date.now());
    setScrollKey((k) => k + 1);
  };
  const endRun = () => {
    runningRef.current = false;
    setIsRunning(false);
    clearTimers();
  };

  const settle = (turnId: string, rows: number, nodes: number, edges: number) => {
    patchTurn(turnId, (t) => {
      const understand = t.steps.find((s) => s.id === "understand")!;
      const execute = t.steps.find((s) => s.id === "execute")!;
      return {
        ...t,
        status: "success",
        text: `Found ${rows} airlines. Added ${nodes} nodes and ${edges} relationships to the canvas.`,
        meta: `local · qwen3-27b · ${rows} rows · LLM ${fmt(understand.dur ?? 0)} · query ${fmt(execute.dur ?? 0)}`,
        result: `${nodes} nodes · ${edges} relationships`,
        stepsOpen: true,
      };
    });
    endRun();
    // Collapse the step list a beat after settling — the answer is the point;
    // the steps stay one click away.
    later(2600, () => patchTurn(turnId, (t) => ({ ...t, stepsOpen: false })));
  };

  // ── Scenarios ──

  // Execute times out, retries, fails.
  const runFail = (turnId: string) => {
    later(2700, () =>
      patchStep(turnId, "execute", (s) => ({
        ...s,
        status: "retrying",
        attempt: 2,
        desc: "timeout after 30s",
        startedAt: Date.now(),
      })),
    );
    later(4200, () => {
      patchStep(turnId, "execute", (s) => ({
        ...s,
        status: "error",
        desc: "failed · timeout after 30s · 2 attempts",
        dur: 61000,
        trace: [
          ["Input", null],
          ["query", "sha256:9f2c…a71b"],
          ["limits", "timeout 30s · page 500"],
          ["Output", null],
          ["attempt 1", "timeout · 30.0s"],
          ["attempt 2", "timeout · 30.0s"],
          ["error", "transient · graph did not respond within timeout"],
        ],
      }));
      patchTurn(turnId, (t) => ({
        ...t,
        status: "error",
        text: "The graph did not answer in time.",
        meta: "local · qwen3-27b · LLM 0.9s · query timed out ×2",
        stepsOpen: true,
      }));
      endRun();
    });
  };

  // The happy path.
  const runAsk = (turnId: string, opts: { fail?: boolean } = {}) => {
    beginRun();
    later(350, () =>
      start(turnId, "understand", "local · qwen3-27b · reading 3 prior turns"),
    );
    thinkAloud(
      turnId,
      "understand",
      "Airlines operate routes; a route runs FROM one airport TO another; countries hang off airports — so count distinct destination countries per airline.",
      420,
    );
    later(1250, () => {
      finish(
        turnId,
        "understand",
        "proposed Cypher · 5 lines · confidence 0.86",
        900,
        traceUnderstand(),
      );
      start(turnId, "validate", "checking the query is read-only");
    });
    later(1300, () => {
      finish(
        turnId,
        "validate",
        "read-only ✓ · Airline, Route, Airport, Country",
        12,
        traceValidate(),
      );
      start(turnId, "execute", "waiting for the first batch");
    });
    const batches = [5, 5, 4];
    let rows = 0;
    [1650, 1950, 2300].forEach((ms, i) =>
      later(ms, () => {
        rows += batches[i];
        const count = rows;
        patchStep(turnId, "execute", (s) => ({
          ...s,
          desc: `${count} rows so far · batch ${i + 1}`,
        }));
      }),
    );
    if (opts.fail) return runFail(turnId);
    later(2700, () => {
      finish(turnId, "execute", "14 rows · 3 batches", 1400, traceExecute(14));
      start(turnId, "project", "shaping 14 rows for the canvas");
    });
    later(2780, () => {
      finish(
        turnId,
        "project",
        "14 nodes · 212 relationships → canvas",
        48,
        traceProject(14, 212),
      );
      settle(turnId, 14, 14, 212);
    });
  };

  // Understand asks back.
  const runClarify = (turnId: string, prompt: string) => {
    beginRun();
    later(350, () =>
      start(turnId, "understand", "local · qwen3-27b · reading 3 prior turns"),
    );
    thinkAloud(
      turnId,
      "understand",
      '"Frankfurt" matches two Airport nodes — FRA and HHN. The question needs one of them before a query makes sense.',
      420,
    );
    later(1500, () => {
      patchStep(turnId, "understand", (s) => ({
        ...s,
        thinking: null,
        status: "needs-input",
        desc: 'which "Frankfurt"?',
        dur: 1150,
        trace: [
          ["Input", null],
          ["prompt", prompt],
          ["schema", "model v7"],
          ["Output", null],
          ["question", "Frankfurt matches two airports in this graph."],
          ["options", "FRA · HHN"],
        ],
      }));
      patchTurn(turnId, (t) => ({
        ...t,
        status: "needs-input",
        text: "Frankfurt matches two airports here. Which one do you mean?",
        options: ["Frankfurt am Main (FRA)", "Frankfurt-Hahn (HHN)"],
      }));
      runningRef.current = false;
      setIsRunning(false);
    });
  };

  const resume = (turnId: string, answer: string) => {
    patchTurn(turnId, (t) => ({
      ...t,
      status: "running",
      options: null,
      text: "",
      steps: t.steps.map((s) =>
        s.id === "understand"
          ? {
              ...s,
              status: "running" as StepStatus,
              desc: `resumed with "${answer}"`,
              startedAt: Date.now(),
            }
          : s,
      ),
    }));
    beginRun();
    later(900, () => {
      finish(
        turnId,
        "understand",
        "proposed Cypher · 5 lines · confidence 0.91 · after 1 clarification",
        1150 + 900,
        traceUnderstand(),
      );
      start(turnId, "validate", "checking the query is read-only");
    });
    later(950, () => {
      finish(
        turnId,
        "validate",
        "read-only ✓ · Airline, Route, Airport, Country",
        11,
        traceValidate(),
      );
      start(turnId, "execute", "waiting for the first batch");
    });
    later(1900, () => {
      finish(turnId, "execute", "14 rows · 3 batches", 950, traceExecute(14));
      start(turnId, "project", "shaping 14 rows for the canvas");
    });
    later(1960, () => {
      finish(
        turnId,
        "project",
        "14 nodes · 212 relationships → canvas",
        44,
        traceProject(14, 212),
      );
      settle(turnId, 14, 14, 212);
    });
  };

  const stopRun = useCallback(() => {
    clearTimers();
    const at = Date.now();
    setTurns((prev) =>
      prev.map((t) =>
        t.status === "running"
          ? {
              ...t,
              status: "stopped",
              text: "Stopped by you.",
              stepsOpen: true,
              steps: t.steps.map((s) =>
                s.status === "running" || s.status === "retrying"
                  ? {
                      ...s,
                      status: "stopped",
                      thinking: null,
                      dur: at - (s.startedAt ?? at),
                    }
                  : s,
              ),
            }
          : t,
      ),
    );
    runningRef.current = false;
    setIsRunning(false);
  }, [clearTimers]);

  const ask = (prompt: string, scenario?: "clarify" | "fail") => {
    if (runningRef.current) return null;
    const id = `t${Date.now()}`;
    const turn: Turn = {
      id,
      prompt,
      when: nowStr(),
      status: "running",
      text: "",
      meta: "",
      stepsOpen: true,
      queryOpen: false,
      feedback: null,
      steps: makeSteps(),
      result: null,
      options: null,
    };
    setTurns((prev) => [...prev, turn]);
    setView("chat");
    if (scenario === "clarify") runClarify(id, prompt);
    else runAsk(id, { fail: scenario === "fail" });
    return id;
  };

  // Deferred past the ChatSession's auto-follow (its ResizeObserver re-pins to
  // the bottom when the step list opens), so the jump wins.
  const scrollToTurn = (id: string) =>
    later(80, () =>
      document
        .getElementById(`turn-${id}`)
        ?.scrollIntoView({ block: "start", behavior: "smooth" }),
    );

  const play = (p: Scenario) => {
    if (p === "ask")
      ask("Which airlines connect Frankfurt to more than 20 countries?");
    if (p === "clarify") ask("How many routes leave Frankfurt?", "clarify");
    if (p === "fail")
      ask("List every route between two European hubs with a layover", "fail");
    if (p === "stop") {
      const id = ask("Rank airports by betweenness across the whole graph");
      if (id) later(1700, stopRun);
    }
    if (p === "trace") {
      setView("chat");
      const first = turns[0];
      patchTurn(first.id, (t) => ({
        ...t,
        stepsOpen: true,
        steps: t.steps.map((s) => ({ ...s, open: s.id === "understand" })),
      }));
      scrollToTurn(first.id);
    }
    if (p === "tasks") setView("tasks");
  };

  // esc interrupts the run from anywhere on the page, like a console.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && runningRef.current) {
        e.preventDefault();
        stopRun();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stopRun]);

  const send = () => {
    const text = draft.trim();
    if (!text || isRunning) return;
    setDraft("");
    ask(text);
  };

  // ── Rendering ──

  const toggleSteps = (id: string) =>
    patchTurn(id, (t) => ({
      ...t,
      stepsOpen: !t.stepsOpen,
      steps: t.stepsOpen ? t.steps.map((s) => ({ ...s, open: false })) : t.steps,
    }));

  const jumpTo = (id: string) => {
    setView("chat");
    patchTurn(id, (t) => ({ ...t, stepsOpen: true }));
    scrollToTurn(id);
  };

  const stepDesc = (s: Step) => {
    if (s.status === "retrying") return `retrying ${s.attempt}/3 · ${s.desc}`;
    if (s.status === "needs-input") return `needs input · ${s.desc}`;
    if (s.status === "stopped") return "stopped";
    return s.desc;
  };
  const stepDur = (s: Step) =>
    s.status === "running" || s.status === "retrying"
      ? fmt(now - (s.startedAt ?? now))
      : s.dur != null
        ? fmt(s.dur)
        : undefined;

  const renderStep = (
    turn: Turn,
    s: Step,
    opts: { jump?: boolean; showDetail?: boolean } = { showDetail: true },
  ) => {
    const tone =
      s.status === "error"
        ? "text-destructive"
        : s.status === "needs-input" ||
            s.status === "retrying" ||
            s.status === "stopped"
          ? "text-warning"
          : undefined;
    return (
      <div key={s.id} className="flex flex-col">
        <ChatSessionTaskRow
          status={stepRowStatus[s.status]}
          name={s.label}
          description={
            <span className={tone}>{stepDesc(s)}</span>
          }
          meta={stepDur(s)}
          onClick={() => {
            if (opts.jump || view === "tasks") return jumpTo(turn.id);
            if (!s.trace) return;
            patchStep(turn.id, s.id, (x) => ({ ...x, open: !x.open }));
          }}
        />
        {opts.showDetail && s.thinking && (
          <ChatSessionActivitySubLine className="pl-[22px] italic">
            {s.thinking}
          </ChatSessionActivitySubLine>
        )}
        {opts.showDetail && s.open && s.trace && (
          <ChatSessionDisclosure
            className="my-0.5 ml-[22px]"
            label={<span className="font-mono">{s.key}</span>}
            meta={`attempt ${s.attempt}${s.dur != null ? ` · ${fmt(s.dur)}` : ""}`}
            open
            onOpenChange={() =>
              patchStep(turn.id, s.id, (x) => ({ ...x, open: false }))
            }
          >
            <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1">
              {s.trace.map(([k, v], i) =>
                v === null ? (
                  <div
                    key={`${k}-${i}`}
                    className={cn(
                      "col-span-2 uppercase tracking-wider text-muted-foreground",
                      i > 0 && "mt-1.5 border-t border-border pt-1.5",
                    )}
                  >
                    {k}
                  </div>
                ) : (
                  <div key={`${k}-${i}`} className="contents">
                    <dt className="pt-0.5 uppercase tracking-wider text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="m-0 min-w-0">
                      {k === "query" && v.includes("\n") ? (
                        <pre className="m-0 whitespace-pre-wrap break-words font-mono text-foreground/85">
                          {v}
                        </pre>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </ChatSessionDisclosure>
        )}
      </div>
    );
  };

  const options = (t: Turn) => [
    {
      icon: <RotateCw className="w-3 h-3" />,
      label: "Re-run query",
      disabled: isRunning,
      onClick: () => ask(t.prompt),
    },
    {
      icon: <Code className="w-3 h-3" />,
      label: "View query",
      active: t.queryOpen,
      onClick: () => patchTurn(t.id, (x) => ({ ...x, queryOpen: !x.queryOpen })),
    },
    {
      icon: <Copy className="w-3 h-3" />,
      label: "Copy",
      onClick: () => navigator.clipboard?.writeText(t.text),
    },
    { icon: <Info className="w-3 h-3" />, label: "View context" },
    {
      icon: <List className="w-3 h-3" />,
      label: "Steps",
      active: t.stepsOpen,
      onClick: () => toggleSteps(t.id),
    },
    ...(t.status === "success"
      ? [
          {
            icon: <ThumbsUp className="w-3 h-3" />,
            label: "Good answer",
            align: "end" as const,
            active: t.feedback === "up",
            activeClassName: "text-success hover:text-success",
            onClick: () =>
              patchTurn(t.id, (x) => ({
                ...x,
                feedback: x.feedback === "up" ? null : "up",
              })),
          },
          {
            icon: <ThumbsDown className="w-3 h-3" />,
            label: "Not what I wanted",
            align: "end" as const,
            active: t.feedback === "down",
            activeClassName: "text-destructive hover:text-destructive",
            onClick: () =>
              patchTurn(t.id, (x) => ({
                ...x,
                feedback: x.feedback === "down" ? null : "down",
              })),
          },
        ]
      : []),
  ];

  const renderTurn = (t: Turn) => {
    const done = t.steps.filter((s) => s.status === "success").length;
    const total = t.steps.reduce((a, s) => a + (s.dur ?? 0), 0);
    const verb =
      t.status === "error"
        ? "Failed after"
        : t.status === "stopped"
          ? "Stopped after"
          : "Thought for";
    const isLive = t.status === "running" || t.status === "needs-input";
    const showSteps = t.stepsOpen || isLive;
    const runningStep = t.steps.find(
      (s) => s.status === "running" || s.status === "retrying",
    );

    const stepsBlock = showSteps ? (
      <div className="flex flex-col gap-px pt-0.5">
        {t.steps.map((s) => renderStep(t, s))}
      </div>
    ) : (
      <button
        type="button"
        onClick={() => toggleSteps(t.id)}
        className="group flex items-center gap-2 text-left text-muted-foreground"
      >
        <span className="select-none text-border" aria-hidden>
          ✻
        </span>
        <span className="group-hover:text-foreground">
          {verb} {fmt(total)} · {done} of {t.steps.length} steps
        </span>
        <span>▸</span>
      </button>
    );

    return (
      <div key={t.id} className="contents">
        <ChatSessionPromptRow meta={<span className="tabular-nums">{t.when}</span>}>
          {t.prompt}
        </ChatSessionPromptRow>
        <div id={`turn-${t.id}`} className="scroll-mt-3">
          <ChatSessionActivityRow
            status={turnRowStatus[t.status]}
            actions={
              t.status === "success" || t.status === "error" ? (
                <ChatSessionMessageOptions actions={options(t)} />
              ) : undefined
            }
            meta={
              (t.status === "success" || t.status === "error") && t.meta
                ? t.meta
                : undefined
            }
            footer={
              <>
                {t.status === "needs-input" && t.options && (
                  <div className="flex flex-col items-start gap-1.5 py-1">
                    {t.options.map((o) => (
                      <Button
                        key={o}
                        variant="outline"
                        size="sm"
                        onClick={() => resume(t.id, o)}
                      >
                        {o}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dashed text-muted-foreground"
                      onClick={() =>
                        document
                          .querySelector<HTMLTextAreaElement>(
                            "#session-task-trace textarea",
                          )
                          ?.focus()
                      }
                    >
                      ✎ Something else — let me type
                    </Button>
                  </div>
                )}
                {stepsBlock}
                {t.queryOpen && (
                  <ChatSessionDisclosure
                    label="cypher"
                    defaultOpen
                    contentClassName="font-mono whitespace-pre text-muted-foreground"
                  >
                    {CYPHER}
                  </ChatSessionDisclosure>
                )}
                {t.status === "success" && t.result && (
                  <div className="mt-0.5 flex items-center justify-between rounded-control border border-border px-2 py-1.5">
                    <span className="text-muted-foreground">{t.result}</span>
                    <Button variant="secondary" size="sm">
                      Load to canvas
                    </Button>
                  </div>
                )}
                {t.status === "error" && (
                  <div className="mt-0.5 flex flex-col gap-1 border-l-2 border-destructive px-2.5 py-1">
                    <span>
                      The graph did not answer within 30s, twice. The query
                      joins four labels without an index on Airport.iata.
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <Button variant="outline" size="sm">
                        Try again
                      </Button>
                      <Button variant="outline" size="sm">
                        Add an index in Modeller
                      </Button>
                      <Button variant="outline" size="sm">
                        Narrow to one airline
                      </Button>
                    </div>
                  </div>
                )}
                {t.status === "stopped" && (
                  <ChatSessionActivitySubLine>
                    Interrupted · ask again, or narrow the question
                  </ChatSessionActivitySubLine>
                )}
              </>
            }
          >
            {t.status === "running" ? (
              <ChatSessionProgressLine
                className="-ml-[22px]"
                elapsed={fmt(now - runStart)}
              >
                {runningStep ? `${runningStep.label}…` : "Planning…"}
              </ChatSessionProgressLine>
            ) : (
              t.text
            )}
          </ChatSessionActivityRow>
        </div>
      </div>
    );
  };

  // Tasks view: every turn, newest first; running and waiting float to the top.
  const taskOrder = [...turns].reverse().sort((a, b) => {
    const w = (t: Turn) =>
      t.status === "running" ? 0 : t.status === "needs-input" ? 1 : 2;
    return w(a) - w(b);
  });

  const live = turns.filter(
    (t) => t.status === "running" || t.status === "needs-input",
  );
  const runningCount = turns.filter((t) => t.status === "running").length;
  const waitingCount = turns.filter((t) => t.status === "needs-input").length;
  const stepCount = turns.reduce((a, t) => a + t.steps.length, 0);

  const viewButton = (target: "chat" | "tasks", label: string) => (
    <button
      type="button"
      onClick={() => setView(target)}
      className={
        view === target
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }
    >
      {label}
    </button>
  );

  // ── Footer: pinned strip · composer · status bar ──
  const footer = (
    <div className="border-t border-border">
      {view === "chat" && live.length > 0 && (
        <div className="border-b border-border px-3 py-1.5">
          {live.map((t) => {
            const s =
              t.steps.find(
                (x) =>
                  x.status === "running" ||
                  x.status === "retrying" ||
                  x.status === "needs-input",
              ) ?? t.steps[0];
            const tokens =
              t.steps.find((x) => x.id === "understand")?.status !== "queued"
                ? " · ↑ 1.2k tokens"
                : "";
            return renderStep(
              t,
              { ...s, open: false, thinking: null, desc: `${s.desc}${tokens}` },
              { jump: true, showDetail: false },
            );
          })}
        </div>
      )}

      <ChatSessionComposer
        value={draft}
        onChange={setDraft}
        onSend={send}
        onStop={stopRun}
        isRunning={isRunning}
        placeholder={
          mode === "ql"
            ? "MATCH (n) WHERE … RETURN n"
            : "Ask anything about your graph…"
        }
        textareaClassName={cn("h-[72px] min-h-14", mode === "ql" && "font-mono")}
        sendIcon={<ArrowUp className="w-4 h-4" />}
        stopIcon={<Square className="w-3 h-3 fill-current" />}
        toolbarStart={
          <>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="h-7 w-auto shrink-0 border-0 bg-transparent gap-1 px-2 hover:bg-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nl">Natural Language</SelectItem>
                <SelectItem value="ql">Query Language</SelectItem>
              </SelectContent>
            </Select>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="h-7 w-full min-w-0 border-0 bg-transparent gap-1 px-2 hover:bg-accent text-muted-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qwen">local · qwen3-27b</SelectItem>
                <SelectItem value="gpt">openai · gpt-4o-mini</SelectItem>
                <SelectItem value="claude">anthropic · claude-sonnet-5</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        toolbarEnd={
          <>
            <Select value={timeoutS} onValueChange={setTimeoutS}>
              <SelectTrigger
                className="h-7 w-auto shrink-0 border-0 bg-transparent gap-1 px-2 hover:bg-accent text-muted-foreground"
                title="LLM + query timeout"
              >
                <Timer className="w-3.5 h-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30s</SelectItem>
                <SelectItem value="60">1m</SelectItem>
                <SelectItem value="120">2m</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="button"
              className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-control text-muted-foreground hover:bg-accent"
              title="Attach files"
              aria-label="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </>
        }
      />

      <ChatSessionStatusBar
        className="pt-0"
        start={
          <>
            {viewButton("chat", "Chat")}
            {viewButton("tasks", `Tasks (${stepCount})`)}
            {runningCount > 0 ? (
              <span className="text-primary">{runningCount} running</span>
            ) : waitingCount > 0 ? (
              <span className="text-warning">{waitingCount} needs input</span>
            ) : null}
          </>
        }
        end={
          runningCount > 0 ? (
            <>
              <span>esc stop</span>
              <span>↓ tasks</span>
            </>
          ) : (
            <>
              <span>↵ send</span>
              <span>⇧↵ newline</span>
              <span>↑↓ history</span>
            </>
          )
        }
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-8 pb-16">
      <header className="mb-7 max-w-[68ch]">
        <p className="mb-1.5 uppercase tracking-wider text-muted-foreground">
          RFC-055 · Explorer sessions
        </p>
        <h1 className="mb-2.5 text-2xl font-semibold leading-tight tracking-tight text-balance">
          Every reply shows the tasks that produced it
        </h1>
        <p className="text-muted-foreground">
          An interactive mock of the Sessions rail. The panel on the left is
          live: send a question, or press{" "}
          <strong className="font-semibold text-foreground">Play</strong> on a
          state to watch it happen. Steps are the workflow behind a reply (
          <strong className="font-semibold text-foreground">
            Understand → Validate → Execute → Project
          </strong>
          ), each one a task with its own status, timing and trace. Example
          data throughout: an airports graph, a local Qwen model.
        </p>
      </header>

      <div className="grid items-start gap-9 grid-cols-1 md:grid-cols-[440px_minmax(0,1fr)]">
        {/* ── The Sessions rail ── */}
        <div className="md:sticky md:top-5">
          <div
            id="session-task-trace"
            className="flex h-[720px] flex-col overflow-hidden border border-border bg-background shadow-md"
          >
            <div className="flex h-[34px] shrink-0 items-center gap-1.5 border-b border-border px-2.5">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-muted-foreground">
                <b className="font-medium text-foreground">Sessions</b>
                <span className="mx-1 opacity-60">›</span>
              </span>
              <span className="min-w-0 truncate">Airlines out of Frankfurt</span>
              <span
                className="ml-auto flex gap-0.5 text-muted-foreground"
                aria-hidden
              >
                <span className="grid h-[22px] w-[22px] place-items-center">↻</span>
                <span className="grid h-[22px] w-[22px] place-items-center">⟨</span>
              </span>
            </div>

            <ChatSession
              className="flex-1 min-h-0"
              footer={footer}
              autoScrollKey={`${view}-${scrollKey}`}
              bodyClassName={view === "tasks" ? "gap-[18px]" : undefined}
            >
              {view === "chat"
                ? turns.map(renderTurn)
                : taskOrder.map((t) => {
                    const total = t.steps.reduce((a, s) => a + (s.dur ?? 0), 0);
                    const state =
                      t.status === "running"
                        ? "running"
                        : t.status === "needs-input"
                          ? "waiting on you"
                          : fmt(total);
                    return (
                      <ChatSessionTaskGroup
                        key={t.id}
                        heading={
                          <div className="flex justify-between gap-2">
                            <span className="min-w-0 truncate" title={t.prompt}>
                              {t.prompt}
                            </span>
                            <span className="shrink-0 font-normal tabular-nums text-muted-foreground">
                              {t.when} · {state}
                            </span>
                          </div>
                        }
                      >
                        {t.steps.map((s) =>
                          renderStep(t, s, { jump: true, showDetail: false }),
                        )}
                      </ChatSessionTaskGroup>
                    );
                  })}
            </ChatSession>
          </div>
          <div className="mt-2 flex justify-between gap-2 px-0.5 text-muted-foreground">
            <span>Sessions rail · 440 px · design-kit ChatSession rows</span>
            <span className="tabular-nums">mock · {nowStr()}</span>
          </div>
        </div>

        {/* ── Walkthrough ── */}
        <div className="flex flex-col gap-5">
          <h2 className="mt-2 -mb-1.5 font-semibold tracking-tight">
            What the user sees
          </h2>
          <p className="max-w-[62ch] text-muted-foreground">
            One visual grammar for everything: your prompt is a caret row,
            every reply is a status-dotted row, and the tasks that produced it
            sit under it as rows of their own. Nothing is hidden behind a
            spinner.
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Dot status="queued" /> queued
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dot status="running" /> running
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dot status="success" /> done
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dot status="needs-input" /> needs input · stopped · retrying
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dot status="error" /> failed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dot status="info" /> question back
            </span>
          </div>

          <div>
            {STATES.map((s, i) => (
              <div
                key={s.title}
                className={cn(
                  "grid grid-cols-[34px_1fr_auto] items-start gap-3 py-3.5",
                  i > 0 && "border-t border-border",
                )}
              >
                <div className="pt-0.5 font-mono text-muted-foreground">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">{s.title}</h3>
                  <p className="max-w-[60ch] text-muted-foreground">{s.body}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isRunning && s.play !== "stop"}
                  onClick={() => play(s.play)}
                >
                  Play
                </Button>
              </div>
            ))}
          </div>

          <h2 className="mt-2 -mb-1.5 font-semibold tracking-tight">
            What feeds it
          </h2>
          <p className="max-w-[62ch] text-muted-foreground">
            The rows are the same either way. The difference is whether they
            move while the reply is being produced.
          </p>
          <div className="overflow-x-auto border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Path</TableHead>
                  <TableHead>Live while running</TableHead>
                  <TableHead>Settled list, trace, Tasks view</TableHead>
                  <TableHead>Engine work</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="whitespace-nowrap font-semibold">
                    A · Bridge now
                  </TableCell>
                  <TableCell>
                    No. Progress line while running; steps appear when the
                    reply settles.
                  </TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>
                    One column on the session message, written by the existing
                    send path.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap font-semibold">
                    B · Build on S9b
                  </TableCell>
                  <TableCell>
                    Yes. Steps stream as they transition; reload replays.
                  </TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>
                    Thoughts, thinkings, thinking steps, thought stream, inline
                    runtime, SSE.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof ChatSession> = {
  title: "UI/UI Extended/ChatSession",
  component: ChatSession,
  parameters: { layout: "fullscreen" },
  render: () => <SessionTaskTraceDemo />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SessionTaskTrace: Story = {};
