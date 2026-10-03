import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { PanelBox } from '@invana/ui';

import { ReplayFrame, useReplay } from '../_story/replay';
import { jsx, snippets, sourceFor, type Snippet } from '../_story/source';
import type { Variant } from '../_story/variant-grid';

/**
 * Story-only scaffolding the chart stories share — not a story, and not a kit component.
 *
 * A chart's variants are JSON in `fixtures/charts/<chart>.json`. What JSON cannot hold is
 * here: the formatters (named in the JSON, `"format": "seconds"`), the replay that feeds a
 * live cell new props, and the Code tab writer.
 */

/**
 * How a live cell changes, frame by frame. `reveal` hands the chart a growing slice of the
 * named arrays — points or rows arriving; `frames` merges each object over `props` in turn —
 * values updating in place.
 */
export interface Live {
  every?: number;
  reveal?: { props: string[]; seed: number };
  frames?: Record<string, unknown>[];
}

/** One cell of a chart grid, as the JSON holds it. */
export interface ChartVariant<P = Record<string, unknown>> extends Variant {
  props: P;
  /** Drawn inside a `PanelBox` with this title and aside, as the page that owns it does. */
  panel?: { title: string; aside?: string };
  /** Column heads, for a mark drawn inside a table row. */
  columns?: string[];
  live?: Live;
}

/** The formatters the JSON names, and the line that defines each in the Code tab. */
export const FORMATS = {
  seconds: {
    fn: (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}s`,
    code: 'const seconds = (v) => `${Number.isInteger(v) ? v : v.toFixed(1)}s`;',
  },
  leadDays: {
    fn: (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)} d`,
    code: 'const leadDays = (v) => `${Number.isInteger(v) ? v : v.toFixed(1)} d`;',
  },
  units: {
    fn: (v: number) => v.toLocaleString('en-GB'),
    code: "const units = (v) => v.toLocaleString('en-GB');",
  },
};

export type FormatName = keyof typeof FORMATS;

/** `props` with its `format` name swapped for the function — what the chart is handed. */
export function formatted<P extends { format?: FormatName | string }>(props: P) {
  const name = props.format as FormatName | undefined;
  return { ...props, format: name ? FORMATS[name].fn : undefined };
}

/** How many frames a live cell replays. */
export function liveLength(v: ChartVariant): number {
  if (!v.live) return 0;
  if (v.live.frames) return v.live.frames.length;
  const [first] = v.live.reveal!.props;
  return (v.props[first] as unknown[]).length - v.live.reveal!.seed;
}

function propsAt<P extends Record<string, unknown>>(v: ChartVariant<P>, at: number): P {
  const live = v.live!;
  if (live.frames) return at === 0 ? v.props : { ...v.props, ...live.frames[at - 1] };
  const end = live.reveal!.seed + at;
  const sliced = Object.fromEntries(live.reveal!.props.map((k) => [k, (v.props[k] as unknown[]).slice(0, end)]));
  return { ...v.props, ...sliced };
}

/**
 * A state holder: hands `children` the variant's props — as they are, or, for a live cell,
 * as they stand at the replay's current frame, under the play / pause bar.
 */
export function LiveProps<P extends Record<string, unknown>>({
  variant,
  noun = 'frame',
  children,
}: {
  variant: ChartVariant<P>;
  noun?: string;
  children: (props: P) => React.ReactNode;
}) {
  if (!variant.live) return <>{children(variant.props)}</>;
  return <Replayed variant={variant} noun={noun} render={children} />;
}

function Replayed<P extends Record<string, unknown>>({
  variant,
  noun,
  render,
}: {
  variant: ChartVariant<P>;
  noun: string;
  render: (props: P) => React.ReactNode;
}) {
  const replay = useReplay(liveLength(variant as ChartVariant), { every: variant.live!.every ?? 800 });
  return (
    <ReplayFrame replay={replay} noun={noun} width={variant.width ?? 320}>
      {render(propsAt(variant, replay.at))}
    </ReplayFrame>
  );
}

/** The variant's panel around the chart, when it has one. */
export function Framed({
  panel,
  aside,
  flush,
  children,
}: {
  panel?: ChartVariant['panel'];
  /** Overrides the panel's own aside — a legend. */
  aside?: React.ReactNode;
  flush?: boolean;
  children: React.ReactNode;
}) {
  if (!panel) return <>{children}</>;
  return (
    <PanelBox title={panel.title} aside={aside ?? panel.aside} flush={flush}>
      {children}
    </PanelBox>
  );
}

// ── the Code tab ───────────────────────────────────────────────────────────

const LIVE_NOTE = {
  reveal: (keys: string[]) =>
    `// Live: as each one arrives, pass the longer ${keys.join(' / ')} — the chart redraws from props.`,
  frames: (keys: string[]) => `// Live: pass the new ${keys.join(' / ')} as each update lands — the chart redraws from props.`,
};

/** The variant's data as consts, and the call — every array or object prop by name. */
export function chartSnippet(tag: string, v: ChartVariant, extra: Record<string, string> = {}): Omit<Snippet, 'imports'> {
  const data: Record<string, unknown> = {};
  const attrs: Record<string, string | { literal: string }> = {};
  const setup: string[] = [];
  for (const [key, value] of Object.entries(v.props)) {
    if (value === undefined) continue;
    if (key === 'format' && typeof value === 'string') {
      attrs.format = value;
      setup.push(FORMATS[value as FormatName].code);
    } else if (typeof value === 'string') attrs[key] = { literal: value };
    else if (value !== null && typeof value === 'object') {
      data[key] = value;
      attrs[key] = key;
    } else attrs[key] = String(value);
  }
  if (v.live?.reveal) setup.unshift(LIVE_NOTE.reveal(v.live.reveal.props));
  if (v.live?.frames) setup.unshift(LIVE_NOTE.frames(Object.keys(v.live.frames[0] ?? {})));
  const call = jsx(tag, { ...attrs, ...extra });
  return { comment: v.caption, data, setup: setup.join('\n') || undefined, call: framedCall(v.panel, call) };
}

/** `call` inside the variant's `PanelBox`, as the page writes it. */
export function framedCall(panel: ChartVariant['panel'], call: string, aside?: string) {
  if (!panel) return call;
  const asideAttr = aside ? ` aside={${aside}}` : panel.aside ? ` aside="${panel.aside}"` : '';
  return `<PanelBox title="${panel.title}"${asideAttr}>\n${call.replace(/^/gm, '  ')}\n</PanelBox>`;
}

/** `parameters.docs.source` for a chart grid: its imports, then each picked variant. */
export function chartSource<V extends ChartVariant>(
  variants: V[],
  imports: string[],
  write: (v: V) => Omit<Snippet, 'imports'>,
) {
  return {
    language: 'tsx',
    transform: sourceFor(variants, (picked) =>
      snippets(picked.some((v) => v.panel) ? [...imports, "import { PanelBox } from '@invana/ui';"] : imports, picked.map(write)),
    ),
  };
}

// ── the play function ──────────────────────────────────────────────────────

/** Every caption drew a cell; each live cell plays to its last frame. */
export async function checkGrid(canvasElement: HTMLElement, variants: ChartVariant[], noun = 'frame') {
  const canvas = within(canvasElement);
  for (const v of variants) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
  for (const v of variants.filter((x) => x.live)) {
    const cell = within(canvas.getByRole('group', { name: v.caption }));
    await userEvent.click(cell.getByRole('button', { name: 'Skip to end' }));
    const n = liveLength(v);
    await expect(cell.getByRole('status')).toHaveTextContent(`${n} / ${n} ${noun}s`);
  }
}
