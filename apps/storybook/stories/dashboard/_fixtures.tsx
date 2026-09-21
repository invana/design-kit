import * as React from 'react';
import type { PanelRendererProps } from '@invana/dashboard';
import { TaskNode, type Bound, type StatusDotProps } from '@invana/ui';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Play,
  Upload,
} from 'lucide-react';

/**
 * Shared scaffolding for the six dashboard variants.
 *
 * The six artboards are one layout repeated, so the stories share everything the
 * designs share — the flow renderer, the icon set, the run's own trace — and
 * each file carries only what makes its surface different. If a fixture has to
 * be forked to render one of them, that is a difference the schema is not
 * expressing yet.
 */

export const ICONS = {
  more: MoreHorizontal,
  prev: ChevronLeft,
  next: ChevronRight,
  file: Upload,
  play: Play,
  check: Check,
};

// ── the flow, as a registered panel ────────────────────────────────────────
// TaskFlowCanvas is not built yet, so this lays TaskNodes out on the grid the
// artboards draw. The point it proves is the seam, not the layout: a real
// `@invana/canvas` panel registers exactly the same way.

export interface FlowNode {
  taskKey: string;
  bound: Bound;
  status?: StatusDotProps['tone'];
  meta?: string;
  tags?: Array<{ label: string; tone?: 'default' | 'warning' }>;
  gate?: boolean;
  dim?: boolean;
  selected?: boolean;
  /** Grid column, 1-based — the artboards' X1…X4. */
  col: number;
  /** Grid row, 1-based — the artboards' Y1…Y3. */
  row: number;
}

export interface FlowOptions {
  nodes: FlowNode[];
}

export function FlowPanel({ options }: PanelRendererProps<FlowOptions>) {
  return (
    <div
      className="grid h-full content-start gap-x-3 gap-y-4 bg-background p-3
        [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)]
        [background-size:28px_28px] [grid-template-columns:repeat(4,146px)]"
    >
      {options.nodes.map((node) => (
        <div key={node.taskKey} style={{ gridColumn: node.col, gridRow: node.row }}>
          <TaskNode {...node} />
        </div>
      ))}
    </div>
  );
}

export type WithFlow = { flow: FlowOptions };

// ── the run this whole page 4 describes ────────────────────────────────────

/** `orders.csv → Brokerage.Order`, as the Gantt reads it. */
export const RUN_TRACE = [
  { key: 'check_bundle', startMs: 0, durationMs: 40, status: 'succeeded' as const },
  {
    key: 'fetch_source',
    startMs: 40,
    durationMs: 900,
    status: 'succeeded' as const,
    attempts: [{ startMs: 40, durationMs: 310, status: 'failed' as const }],
  },
  { key: 'validate_records', startMs: 950, durationMs: 1200, status: 'succeeded' as const },
  { key: 'import_dataset', startMs: 2150, durationMs: 3400, status: 'succeeded' as const },
  { key: 'verify_counts', startMs: 5550, durationMs: 8, status: 'succeeded' as const },
  { key: 'triage', status: 'skipped' as const },
  { key: 'import_report', startMs: 5560, durationMs: 40, status: 'succeeded' as const },
  { key: 'announce', startMs: 5600, durationMs: 300, status: 'needs_input' as const },
];

/** The same eight tasks as a flow, positioned as the artboards place them. */
export const RUN_FLOW: FlowNode[] = [
  { col: 1, row: 1, taskKey: 'check_bundle', bound: 'ingest', status: 'success', meta: '1 dataset · 4ms' },
  {
    col: 2,
    row: 1,
    taskKey: 'fetch_source',
    bound: 'network',
    status: 'success',
    meta: 'orders.csv · 0.9s',
    tags: [{ label: 'attempt 2', tone: 'warning' }],
  },
  { col: 3, row: 1, taskKey: 'validate_records', bound: 'ingest', status: 'success', meta: '1,204 of 1,251 · 1.2s' },
  {
    col: 4,
    row: 1,
    taskKey: 'import_dataset',
    bound: 'ingest',
    status: 'success',
    meta: 'Brokerage.Order@v2',
    tags: [{ label: '3 lanes' }],
  },
  { col: 3, row: 2, taskKey: 'triage', bound: 'work_write', meta: 'never ran', dim: true },
  { col: 4, row: 2, taskKey: 'verify_counts', bound: 'none', status: 'success', meta: '1,204 = 1,204' },
  { col: 3, row: 3, taskKey: 'announce', bound: 'work_write', status: 'success', gate: true, meta: 'approved by ravi' },
  { col: 4, row: 3, taskKey: 'import_report', bound: 'ingest', status: 'success', meta: '47 rejections' },
];

export const RUN_LOG = [
  { time: '00.00', level: 'info' as const, source: 'check_bundle', message: 'manifest read · 1 dataset' },
  { time: '00.04', level: 'info' as const, source: 'fetch_source', message: 'GET s3://drops/orders.csv' },
  { time: '00.35', level: 'warn' as const, source: 'fetch_source', message: 'refused · 503 · retrying (2 of 3)' },
  { time: '00.95', level: 'info' as const, source: 'fetch_source', message: '200 · 1.4 MB in 0.6s' },
  { time: '02.10', level: 'warn' as const, source: 'validate_records', message: '47 of 1,251 reported' },
  { time: '02.15', level: 'info' as const, source: 'import_dataset', message: 'fan-out · 3 lanes of 402' },
  { time: '05.50', level: 'info' as const, source: 'import_dataset', message: 'lane 3 · 400 Order, 400 FOR' },
];

/** Every step dashboard ends with the same three right-hand panels but one. */
export const WHERE_IT_SITS = (task: string, lane: string) => ({
  rows: [
    { label: 'run', value: 'orders.csv → Brokerage.Order' },
    { label: 'plan task', value: task },
    { label: 'lane', value: lane },
    { label: 'parent', value: 'root run' },
  ],
});

// ── the shell the six stories render into ──────────────────────────────────

export function Surface({
  children,
  last,
}: {
  children: React.ReactNode;
  last: string;
}) {
  return (
    <div className="flex h-screen flex-col">
      {children}
      <div className="shrink-0 border-t border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
        last action: <span className="font-mono text-foreground">{last}</span>
      </div>
    </div>
  );
}
