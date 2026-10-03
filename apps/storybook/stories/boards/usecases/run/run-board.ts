import type { GanttOptions } from '@invana/blocks';
import type { BoardSpec, ChipSpec, LogOptions, PanelSpec } from '@invana/boards';

/**
 * A run as the API records it — every task it ran, every call a task made across a layer,
 * and the log — and the board a consumer builds from it. Story-only: the trace is the
 * fixture (`fixtures/runs/agent-run.json`), and the Gantt, the access log and the inspector
 * are three readings of it, so they cannot disagree.
 */

export type Layer = 'model' | 'graph.model' | 'graph.data' | 'dataset' | 'skill' | 'connector' | 'web';
export type TaskKind = Layer | 'python';
type Status = 'succeeded' | 'running' | 'failed' | 'needs_input' | 'skipped' | 'queued' | 'refused';

export interface Call {
  id: string;
  layer: Layer;
  /** Where it went — a model, a graph, a dataset, a DSN with its secret masked. */
  target: string;
  op: string;
  startMs: number;
  durationMs: number;
  status: Status;
  /** The status word a failed or refused call came back with — `429`, `denied`. */
  code?: string;
  tokens?: { in: number; out: number };
  rows?: number;
  request: { language: Language; body: string };
  response: { language: Language; body: string };
}

type Language = 'plain' | 'json' | 'cypher' | 'yaml' | 'python';

export interface Task {
  key: string;
  /** How it runs — a python function, or a call made for it. */
  kind: TaskKind;
  /** The layer it belongs to. A python task belongs to one too — the layer it works for. */
  layer: Layer;
  /** The function it ran. */
  fn: string;
  status: Status;
  startMs: number;
  durationMs: number;
  summary?: string;
  result?: Record<string, string | number>;
  attempts?: { startMs: number; durationMs: number; status: Status; title?: string }[];
  /** What it needed, and what came of each: used, granted and left alone, or denied. */
  access: { label: string; state: 'used' | 'granted' | 'denied' }[];
  input: unknown;
  output: unknown;
  calls: Call[];
  tasks?: Task[];
}

export interface Trace {
  id: string;
  question: string;
  agent: string;
  status: Status;
  startedAt: string;
  durationMs: number;
  budget: { tokens: number };
  tasks: Task[];
  logs: LogOptions['lines'];
}

/** What is picked: a task, and maybe one of its calls; and which inspector tab is open. */
export interface Selection {
  task: string | null;
  call?: string | null;
  tab?: string;
}

/** The two readings of one run on one clock: by task, or by layer. */
export type TraceView = 'Execution' | 'Layer access';
export const TRACE_VIEWS: TraceView[] = ['Execution', 'Layer access'];

/** `Expand all` or `Collapse all` last pressed on the trace; unset, rows open as the trace has them. */
export type Fold = boolean | undefined;

// ── reading the trace ──────────────────────────────────────────────────────

export const tasksOf = (tasks: Task[]): Task[] => tasks.flatMap((t) => [t, ...tasksOf(t.tasks ?? [])]);
export const callsOf = (trace: Trace) => tasksOf(trace.tasks).flatMap((t) => t.calls.map((c) => ({ ...c, task: t.key })));

/** A Gantt or table key → the task it opens, and the call when it names one. */
export function pick(trace: Trace, key: string): Selection | null {
  const id = key.split('#')[0];
  const owner = tasksOf(trace.tasks).find((t) => t.key === id || t.calls.some((c) => c.id === id));
  if (!owner) return null;
  return owner.key === id ? { task: id, call: null } : { task: owner.key, call: id, tab: 'calls' };
}

/** Layers in the order they are read; the Gantt paints each call by its own. */
const PALETTE: Record<Layer, string> = {
  model: 'bg-data-1',
  'graph.model': 'bg-data-2',
  'graph.data': 'bg-data-3',
  dataset: 'bg-data-4',
  skill: 'bg-data-5',
  connector: 'bg-muted-foreground',
  web: 'bg-data-7',
};

const TONE = { succeeded: 'success', running: 'running', failed: 'error', refused: 'error', needs_input: 'warning', skipped: 'muted', queued: 'queued' } as const;
/** A status as a chip — the chip has no `queued`, so a queued task reads muted. */
const statusChip = (s: Status): ChipSpec => ({ label: word(s), tone: s === 'queued' ? 'muted' : TONE[s] });
const ACCESS_TONE = { used: 'success', granted: 'muted', denied: 'error' } as const;

const ms = (n: number) => (n < 1000 ? `${n}ms` : `${(n / 1000).toFixed(1)}s`);
const k = (n: number) => (n < 1000 ? String(n) : `${+(n / 1000).toFixed(1)}k`);
const word = (s: string) => s.replace('_', ' ');
const tokensOf = (calls: Call[]) => calls.reduce((sum, c) => sum + (c.tokens ? c.tokens.in + c.tokens.out : 0), 0);
const callFacts = (c: Call) =>
  [ms(c.durationMs), c.tokens && `${k(c.tokens.in)} in · ${k(c.tokens.out)} out`, c.rows != null && `${c.rows.toLocaleString('en')} rows`]
    .filter(Boolean)
    .join(' · ');

const LAYERS = Object.keys(PALETTE) as Layer[];

// ── the run ────────────────────────────────────────────────────────────────

type GanttRow = GanttOptions['tasks'][number];

/** A call is a row under its task: one bar, painted by the layer it crossed — or by its status when it failed. */
function callRow(c: Call): GanttRow {
  const bad = c.status === 'failed' || c.status === 'refused';
  return {
    key: c.id,
    label: `${c.layer} · ${c.op}`,
    duration: ms(c.durationMs),
    segments: [
      {
        key: c.id,
        startMs: c.startMs,
        durationMs: c.durationMs,
        status: c.status,
        group: bad ? undefined : c.layer,
        title: `${c.layer} · ${c.target}`,
        chip: c.code ? { label: c.code, tone: 'bad' } : undefined,
        summary: callFacts(c),
      },
    ],
  };
}

/** A task, with its calls first and then the tasks it ran. */
function taskRow(t: Task): GanttRow {
  const children = [...t.calls.map(callRow), ...(t.tasks ?? []).map(taskRow)];
  return {
    key: t.key,
    startMs: t.startMs,
    durationMs: t.durationMs,
    status: t.status,
    summary: [t.kind, t.summary].filter(Boolean).join(' · '),
    result: t.result,
    attempts: t.attempts,
    subtasks: children.length ? children : undefined,
    open: children.length > 0 && children.length <= 4,
  };
}

/**
 * The run by layer, on the same clock: a row per layer — its strip, every function's stretch in
 * the layer's colour — opening into the functions that belong to it (a python task too), each
 * opening into the calls it made.
 */
function layerRows(trace: Trace): GanttRow[] {
  const tasks = tasksOf(trace.tasks);
  return LAYERS.flatMap((layer): GanttRow[] => {
    const own = tasks.filter((t) => t.layer === layer);
    if (!own.length) return [];
    const calls = own.flatMap((t) => t.calls);
    return [
      {
        key: `layer:${layer}`,
        label: layer,
        duration: `${calls.length} call${calls.length === 1 ? '' : 's'}`,
        segments: own.map((t) => ({
          key: t.key,
          startMs: t.startMs,
          durationMs: t.durationMs,
          status: t.status,
          group: layer,
          title: `${t.key} · ${t.kind}`,
        })),
        open: true,
        subtasks: own.map((t) => ({
          key: t.key,
          startMs: t.startMs,
          durationMs: t.durationMs,
          status: t.status,
          summary: [t.kind, t.summary].filter(Boolean).join(' · '),
          result: t.result,
          attempts: t.attempts,
          subtasks: t.calls.length ? t.calls.map(callRow) : undefined,
          open: t.calls.length > 1,
        })),
      },
    ];
  });
}

/** Every row that opens, opened — or closed. */
const folded = (rows: GanttRow[], open: boolean): GanttRow[] =>
  rows.map((r) => (r.subtasks ? { ...r, open, subtasks: folded(r.subtasks, open) } : r));

function runTabs(trace: Trace, sel: Selection, view: TraceView, fold: Fold): NonNullable<BoardSpec['tabs']> {
  const rows = view === 'Execution' ? trace.tasks.map(taskRow) : layerRows(trace);
  const tasks = tasksOf(trace.tasks);
  const calls = callsOf(trace);
  const tokens = tokensOf(calls);
  const bad = calls.filter((c) => c.status === 'failed' || c.status === 'refused');
  const layers = new Set(calls.map((c) => c.layer));
  return [
    {
      id: 'trace',
      label: 'Trace',
      rows: [
        {
          panels: [
            {
              kind: 'grid',
              options: {
                minTileWidth: 130,
                tiles: [
                  { label: 'Tasks', value: String(tasks.length), delta: `${tasks.filter((t) => t.attempts?.length).length} retried` },
                  { label: 'Elapsed', value: ms(trace.durationMs) },
                  { label: 'Tokens', value: k(tokens), delta: `of ${k(trace.budget.tokens)} budget`, gauge: { value: tokens, max: trace.budget.tokens } },
                  { label: 'Calls', value: String(calls.length), delta: `${layers.size} layers reached` },
                  { label: 'Failed or refused', value: String(bad.length), delta: bad.map((c) => c.code).join(' · '), flag: bad.length > 0 },
                ],
              },
            },
          ],
        },
        {
          panels: [
            {
              id: 'trace',
              kind: 'gantt',
              title: 'Run trace',
              aside: view === 'Execution' ? 'tasks, each with its calls' : 'layers → functions → calls',
              actions: [
                fold
                  ? { id: 'trace-fold', icon: 'collapse', label: 'Collapse all', variant: 'ghost' }
                  : { id: 'trace-fold', icon: 'expand', label: 'Expand all', variant: 'ghost' },
                { id: 'trace-view', options: TRACE_VIEWS, value: view },
              ],
              options: {
                spanMs: trace.durationMs,
                ticks: 6,
                labelWidth: 220,
                durationWidth: 64,
                palette: PALETTE,
                selected: sel.call ?? sel.task ?? undefined,
                tasks: fold === undefined ? rows : folded(rows, fold),
              },
            },
          ],
        },
      ],
    },
    {
      id: 'access',
      label: `Access log · ${calls.length}`,
      rows: [
        {
          panels: [
            {
              id: 'access',
              kind: 'table',
              title: 'Every call across a layer',
              aside: 'pick a row to inspect it',
              flush: true,
              options: {
                rowKey: 'id',
                selected: sel.call ?? null,
                noun: 'calls',
                columns: [
                  { key: 'at', label: 'At', mono: true, align: 'right' },
                  { key: 'task', label: 'Task', mono: true },
                  { key: 'layer', label: 'Layer' },
                  { key: 'op', label: 'Op', mono: true },
                  { key: 'target', label: 'Target', mono: true },
                  { key: 'status', label: 'Status' },
                  { key: 'tokens', label: 'Tokens', align: 'right' },
                  { key: 'ms', label: 'Took', align: 'right' },
                ],
                rows: calls.map((c) => ({
                  id: c.id,
                  at: ms(c.startMs),
                  task: c.task,
                  layer: c.layer,
                  op: c.op,
                  target: c.target,
                  status: c.code ? { value: `${c.status} · ${c.code}`, tone: 'bad' } : c.status,
                  tokens: c.tokens ? k(c.tokens.in + c.tokens.out) : null,
                  ms: ms(c.durationMs),
                })),
              },
            },
          ],
        },
      ],
    },
    {
      id: 'log',
      label: 'Log',
      rows: [{ panels: [{ kind: 'log', title: 'Log', aside: `${trace.logs.length} lines`, flush: true, options: { lines: trace.logs } }] }],
    },
  ];
}

// ── the task, in the inspector ─────────────────────────────────────────────

function callPanel(c: Call): PanelSpec {
  return {
    id: c.id,
    kind: 'exchange',
    title: `${c.layer} · ${c.op} · ${c.target}`,
    aside: callFacts(c),
    asideChip: c.code ? { label: `${c.status} · ${c.code}`, tone: 'error' } : undefined,
    options: {
      blocks: [
        { label: c.layer === 'model' ? 'Prompt' : 'Request', language: c.request.language, value: c.request.body },
        { label: c.layer === 'model' ? 'Completion' : 'Response', language: c.response.language, value: c.response.body },
      ],
    },
  };
}

function inspector(trace: Trace, sel: Selection): BoardSpec | null {
  const all = tasksOf(trace.tasks);
  const task = all.find((t) => t.key === sel.task);
  if (!task) return null;
  const parent = all.find((t) => t.tasks?.some((c) => c.key === task.key));
  const lines = trace.logs.filter((l) => l.source === task.key);
  const tokens = tokensOf(task.calls);
  // The picked call reads first; the rest keep the order they were made in.
  const calls = [...task.calls].sort((a, b) => Number(b.id === sel.call) - Number(a.id === sel.call));
  const chips: ChipSpec[] = [{ label: task.kind, variant: 'outline' }, statusChip(task.status)];
  const { calls: _calls, tasks: children, ...span } = task;
  return {
    header: {
      tone: TONE[task.status],
      crumbs: [task.key],
      crumbMenu: {
        action: 'open-task',
        placeholder: 'Jump to a task',
        items: all.map((t) => ({ id: t.key, label: t.key, aside: ms(t.durationMs), tone: TONE[t.status] })),
        selected: task.key,
      },
      chips,
      actions: [{ id: 'close', icon: 'close', label: 'Close', variant: 'ghost' }],
    },
    tab: sel.tab ?? 'overview',
    tabAction: 'inspect-tab',
    rows: [],
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        rows: [
          {
            panels: [
              {
                kind: 'grid',
                options: {
                  tiles: [
                    { label: 'Took', value: ms(task.durationMs), delta: `at ${ms(task.startMs)}` },
                    { label: 'Calls', value: String(task.calls.length) },
                    { label: 'Tokens', value: tokens ? k(tokens) : '—' },
                    { label: 'Attempts', value: String((task.attempts?.length ?? 0) + 1), flag: !!task.attempts?.length },
                  ],
                },
              },
            ],
          },
          {
            panels: [
              {
                kind: 'record',
                options: {
                  rows: [
                    { label: 'Function', value: task.fn },
                    { label: 'Kind', value: task.kind },
                    { label: 'Layer', value: task.layer },
                    { label: 'Under', value: parent?.key ?? 'the run' },
                    ...(children?.length ? [{ label: 'Ran', value: children.map((c) => c.key).join(', ') }] : []),
                    ...(task.summary ? [{ label: 'Summary', value: task.summary, mono: false }] : []),
                  ],
                },
              },
            ],
          },
          {
            panels: [
              task.access.length
                ? {
                    kind: 'list',
                    title: 'Access',
                    aside: 'needed · and what came of it',
                    options: {
                      items: task.access.map((a) => ({
                        id: a.label,
                        title: a.label,
                        mono: true,
                        tone: ACCESS_TONE[a.state],
                        chip: a.state === 'denied' ? { label: a.state, tone: 'error' } : { label: a.state, variant: 'outline' },
                      })),
                    },
                  }
                : {
                    kind: 'list',
                    title: 'Access',
                    options: { items: [] },
                    absent: { reason: 'declared-none', label: 'none needed', note: 'Runs in the worker alone — it reaches no layer.' },
                  },
            ],
          },
          {
            panels: [
              {
                kind: 'exchange',
                title: 'Input · output',
                options: {
                  blocks: [
                    { label: 'Input', language: 'json', value: JSON.stringify(task.input, null, 2) },
                    { label: 'Output', language: 'json', value: JSON.stringify(task.output, null, 2) },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        id: 'calls',
        label: `Calls · ${task.calls.length}`,
        rows: calls.length
          ? calls.map((c) => ({ panels: [callPanel(c)] }))
          : [
              {
                panels: [
                  {
                    kind: 'exchange',
                    title: 'Calls',
                    options: { blocks: [] },
                    absent: { reason: 'declared-none', label: 'no calls', note: 'This task crossed no layer — what it did is in its log and output.' },
                  },
                ],
              },
            ],
      },
      {
        id: 'logs',
        label: `Logs · ${lines.length}`,
        rows: [
          {
            panels: [
              lines.length
                ? { kind: 'log', title: 'This task only', flush: true, options: { lines } }
                : { kind: 'log', title: 'This task only', options: { lines: [] }, absent: { reason: 'declared-none', label: 'no lines', note: 'This task wrote nothing to the log.' } },
            ],
          },
        ],
      },
      {
        id: 'span',
        label: 'Span',
        rows: [{ panels: [{ kind: 'json', title: 'The span, as recorded', flush: true, options: { value: { run: trace.id, ...span, calls: task.calls.map((c) => c.id) } } }] }],
      },
    ],
  };
}

/** The whole board: the run, and the picked task beside it. */
export function runBoard(trace: Trace, sel: Selection, tab = 'trace', view: TraceView = 'Execution', fold?: Fold): BoardSpec {
  const side = inspector(trace, sel);
  return {
    title: trace.question,
    header: {
      tone: TONE[trace.status],
      crumbs: [trace.question],
      chips: [{ label: trace.agent, variant: 'outline' }, { label: trace.id, variant: 'outline' }, statusChip(trace.status)],
      actions: [
        { id: 'rerun', label: 'Rerun', variant: 'outline' },
        { id: 'more', icon: 'more', label: 'More', variant: 'ghost' },
      ],
    },
    rows: [],
    tab,
    tabAction: 'tab',
    tabs: runTabs(trace, sel, view, fold),
    inspector: side ? { spec: side, width: 480 } : undefined,
  };
}
