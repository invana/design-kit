import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * The kinds of run Invana opens today — **suggestions, not a limit.**
 *
 * A product that grows a `simulate` kind passes `"simulate"` and the chip draws
 * it. The journal is one list with one filter over it ([SR7]), so the kind is a
 * *column value*, never a panel of its own — and a component that refused an
 * unknown value would make the kit a release blocker for every new one.
 */
export type KnownRunKind =
  | "ask"
  | "import"
  | "bulk"
  | "stitch"
  | "enrich"
  | "schedule"

/** What a run is, as an identifier — any string at all. See {@link KnownRunKind}. */
export type RunKind = KnownRunKind | (string & {})

export interface KindChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  kind: RunKind
  /** Not in play — a kind the current filter excludes. */
  dim?: boolean
}

/**
 * What kind of run this row is: `ask` · `import` · `bulk` · `stitch` · `enrich`.
 *
 * **Neutral on purpose.** A kind is not a status and not a layer: it says which
 * shape of work opened the run, and every kind is equally ordinary. Painting
 * them would put five more hues on a row that already carries a status dot and
 * a layer, and would invite a reader to think `import` is worse than `ask`.
 *
 * Mono, because the value is the engine's own (`kind in (import, bulk)` is a
 * filter a person types), and small, because it sits inside a row that is
 * already carrying an address and a summary.
 */
export const KindChip = React.forwardRef<HTMLSpanElement, KindChipProps>(
  ({ kind, dim, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex h-[17px] shrink-0 items-center rounded-control px-1.5",
        "bg-muted font-mono text-xs tracking-wide text-muted-foreground",
        dim && "opacity-60",
        className,
      )}
      {...props}
    >
      {kind}
    </span>
  ),
)
KindChip.displayName = "KindChip"
