import * as React from 'react';
import { Button, Eyebrow, Stack } from '@invana/ui';

import { ALL, inline } from './source';

/** One cell of a grid: the caption the Design Kit Spec gives it, and how wide it draws. */
export interface Variant {
  caption: string;
  /** Draw at 280px — the narrowest a chat column gets. */
  narrow?: boolean;
  /** Take the grid's whole row — a table, a panel, an app shell. */
  wide?: boolean;
  /** A width in px other than the grid's 320; the cell spans as many columns as it needs. */
  width?: number;
  /** A fixed height in px, for a component that fills its parent — a panel stack, a rail. */
  height?: number;
}

/** The grid's column and gap, so a wider cell spans whole columns. */
const COLUMN = 320;
const GAP = 40;

/** One thing a cell sent: the callback's name and what it carried. */
export interface Logged {
  name: string;
  payload: unknown;
}

/** Records what a cell sent, under it. Call it from the callback the story wires. */
export type Log = (name: string, payload: unknown) => void;

export interface VariantGridProps<V extends Variant> {
  variants: V[];
  /** A caption, or `All`. */
  variant?: string;
  /** Draws one cell. State lives in what it returns; reset remounts it. */
  children: (variant: V, log: Log) => React.ReactNode;
}

/**
 * Story chrome, not a kit component: a component's variants laid out as its page on the
 * Design Kit Spec — four 320px columns, a caption over each cell — with what each cell sent
 * written under it and a reset to draw it fresh.
 */
export function VariantGrid<V extends Variant>({ variants, variant = ALL, children }: VariantGridProps<V>) {
  const shown = variants.filter((v) => variant === ALL || v.caption === variant);
  return (
    <div className="grid grid-cols-[repeat(auto-fill,320px)] items-start gap-x-10 gap-y-12">
      {shown.map((v) => (
        <Cell key={v.caption} variant={v}>
          {children}
        </Cell>
      ))}
    </div>
  );
}

function Cell<V extends Variant>({
  variant,
  children,
}: {
  variant: V;
  children: (variant: V, log: Log) => React.ReactNode;
}) {
  const [runs, setRuns] = React.useState(0);
  const [sent, setSent] = React.useState<Logged[]>([]);
  const log = React.useCallback<Log>((name, payload) => setSent((s) => [...s, { name, payload }].slice(-3)), []);
  const reset = () => {
    setSent([]);
    setRuns((r) => r + 1);
  };

  return (
    <Stack
      role="group"
      aria-label={variant.caption}
      gap="sm"
      style={
        variant.wide
          ? { gridColumn: '1 / -1' }
          : {
              width: variant.narrow ? 280 : (variant.width ?? COLUMN),
              gridColumn:
                variant.width && variant.width > COLUMN
                  ? `span ${Math.ceil((variant.width + GAP) / (COLUMN + GAP))}`
                  : undefined,
            }
      }
    >
      <Stack direction="row" justify="between">
        <Eyebrow>{variant.caption}</Eyebrow>
        {sent.length ? (
          <Button size="xs" variant="ghost" onClick={reset}>
            Reset
          </Button>
        ) : null}
      </Stack>
      {variant.height ? (
        <Stack key={runs} gap="none" className="min-h-0" style={{ height: variant.height }}>
          {children(variant, log)}
        </Stack>
      ) : (
        <React.Fragment key={runs}>{children(variant, log)}</React.Fragment>
      )}
      <EventLog sent={sent} />
    </Stack>
  );
}

/** What the cell sent, newest last — the payload a consumer's callback would receive. */
export function EventLog({ sent }: { sent: Logged[] }) {
  if (!sent.length) return null;
  return (
    <ol aria-label="Events" className="flex flex-col gap-1 rounded-md bg-muted px-2 py-1.5 font-mono text-sm">
      {sent.map((e, i) => (
        <li key={i} className="flex gap-2">
          <span className="shrink-0 text-muted-foreground">{e.name}</span>
          <span className="min-w-0 [overflow-wrap:anywhere]">{inline(e.payload)}</span>
        </li>
      ))}
    </ol>
  );
}
