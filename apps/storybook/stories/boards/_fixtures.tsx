import * as React from 'react';
import type { ActionContext, ActionSpec, PanelRendererProps } from '@invana/boards';
import {
  TaskNode,
  type Bound,
  type BoundPalette,
  type StatusDotProps,
} from '@invana/ui';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Play,
  Upload,
} from 'lucide-react';

import { EventLog, type Logged } from '../_story/variant-grid';

/**
 * Shared scaffolding for the board stories — the code-only bits JSON cannot hold.
 *
 * The specs themselves are JSON in `fixtures/boards/` (screens) and
 * `fixtures/board/` (components). What lives here is what every screen
 * shares: the icon set, the stand-in `flow` renderer, the helpers a consumer
 * uses to patch its spec when it answers an action, and the `Surface` that
 * writes what `onAction` received.
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

/**
 * How these boards paint the bounds. `BoundChip` ships no hues, so every
 * surface that draws one supplies its own map — `none` is left out and falls
 * through to the neutral.
 */
export const BOUND_PALETTE: BoundPalette = {
  network: 'bg-warning',
  graph_read: 'bg-success',
  graph_write: 'bg-data-2',
  schema_write: 'bg-data-4',
  ingest: 'bg-info',
  llm: 'bg-data-7',
  plan_write: 'bg-data-5',
  work_write: 'bg-destructive',
};

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
          <TaskNode {...node} boundPalette={BOUND_PALETTE} />
        </div>
      ))}
    </div>
  );
}

export type WithFlow = { flow: FlowOptions };

// ── answering an action, as a consumer patches its own spec ────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPanel = { id?: string; options?: any; actions?: ActionSpec[]; [field: string]: unknown };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpec = { rows: { panels: any[] }[]; tabs?: { rows: { panels: any[] }[] }[] };

/** `spec` with every panel passed through `fn` — on the page and on every tab. */
export function mapPanels<S extends AnySpec>(spec: S, fn: (panel: AnyPanel) => AnyPanel): S {
  const rows = (rs: AnySpec['rows']) => rs.map((row) => ({ ...row, panels: row.panels.map(fn) }));
  return { ...spec, rows: rows(spec.rows), tabs: spec.tabs?.map((tab) => ({ ...tab, rows: rows(tab.rows) })) };
}

/** `spec` with one panel's options merged — a picked row selected, an edited value kept. */
export function patchPanel<S extends AnySpec>(spec: S, panelId: string | undefined, patch: Record<string, unknown>): S {
  return mapPanels(spec, (p) => (p.id === panelId ? { ...p, options: { ...p.options, ...patch } } : p));
}

/** Every panel of `spec`, on the page and on every tab. */
export function panelsOf(spec: AnySpec): AnyPanel[] {
  return [...spec.rows, ...(spec.tabs?.flatMap((t) => t.rows) ?? [])].flatMap((r) => r.panels);
}

// ── the shell the stories render into ──────────────────────────────────

/**
 * Story chrome: the board filling the canvas, and under it what `onAction` received — the
 * last few actions with their payloads.
 */
export function Surface({ children, sent }: { children: React.ReactNode; sent: Logged[] }) {
  return (
    <div className="flex h-screen flex-col">
      {children}
      <div className="shrink-0 border-t border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
        {sent.length ? <EventLog sent={sent} /> : 'No action yet.'}
      </div>
    </div>
  );
}

/**
 * What a screen sent, for its `Surface`: `record(id, ctx)` passes the action to the story's
 * `onAction` arg (the Actions panel) and keeps the last three.
 */
export function useSent(onAction: (id: string, ctx?: ActionContext) => void) {
  const [sent, setSent] = React.useState<Logged[]>([]);
  const record = (id: string, ctx?: ActionContext) => {
    onAction(id, ctx);
    setSent((s) => [...s, { name: `onAction("${id}")`, payload: ctx ?? {} }].slice(-3));
  };
  return [sent, record] as const;
}

// ── a record that arrives, for the form stories ────────────────────────────

/**
 * `record` after `ms`, `null` until then — a fetch, without a server. The form
 * stories start empty and fill when it lands, which is the order a real editor
 * sees: the page draws, then the data arrives.
 */
export function useLoaded<T>(record: T, ms = 600): T | null {
  const [loaded, setLoaded] = React.useState<T | null>(null);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoaded(record), ms);
    return () => clearTimeout(timer);
  }, [record, ms]);
  return loaded;
}
