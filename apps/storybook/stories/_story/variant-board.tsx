import * as React from 'react';
import { Button, Eyebrow } from '@invana/ui';

import { ALL, inline } from './source';

/** One cell of a board: the caption the Design Kit Spec gives it, and how wide it draws. */
export interface Variant {
  caption: string;
  /** Draw at 280px — the narrowest a chat column gets. */
  narrow?: boolean;
  /** Take the board's whole row — a table, a panel, an app shell. */
  wide?: boolean;
  /** A width in px other than the board's 320. */
  width?: number;
}

/** One thing a cell sent: the callback's name and what it carried. */
export interface Logged {
  name: string;
  payload: unknown;
}

/** Records what a cell sent, under it. Call it from the callback the story wires. */
export type Log = (name: string, payload: unknown) => void;

export interface VariantBoardProps<V extends Variant> {
  variants: V[];
  /** A caption, or `All`. */
  variant?: string;
  /** Draws one cell. State lives in what it returns; reset remounts it. */
  children: (variant: V, log: Log) => React.ReactNode;
}

/**
 * Story chrome, not a kit component: a component's variants laid out as its board on the
 * Design Kit Spec — four 320px columns, a caption over each cell — with what each cell sent
 * written under it and a reset to draw it fresh.
 */
export function VariantBoard<V extends Variant>({ variants, variant = ALL, children }: VariantBoardProps<V>) {
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
    <div
      role="group"
      aria-label={variant.caption}
      className="flex min-w-0 flex-col gap-2"
      style={
        variant.wide
          ? { gridColumn: '1 / -1' }
          : { width: variant.narrow ? 280 : (variant.width ?? 320), gridColumn: variant.width ? 'span 2' : undefined }
      }
    >
      <div className="flex items-center justify-between">
        <Eyebrow>{variant.caption}</Eyebrow>
        {sent.length ? (
          <Button size="xs" variant="ghost" onClick={reset}>
            Reset
          </Button>
        ) : null}
      </div>
      <React.Fragment key={runs}>{children(variant, log)}</React.Fragment>
      <EventLog sent={sent} />
    </div>
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
