import * as React from "react"
import { X } from "lucide-react"

import { Button, cn, type DiffOp } from "@invana/ui"

export interface StagedBarItem {
  id: string
  op: DiffOp
  /** What changed, in the mono face — `airport.timezone`. */
  name: React.ReactNode
  /** What the change is — `property`, `integer → float`. */
  note?: React.ReactNode
}

export interface StagedBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: StagedBarItem[]
  /** Discard one change. Left out, the items carry no `×`. */
  onDiscard?: (id: string) => void
  /** Discard every change. Left out, there is no `Discard all`. */
  onDiscardAll?: () => void
  /** The keyboard route to what finishes the set — `⌘↵ publish`. */
  hint?: React.ReactNode
  discardAllLabel?: string
}

const OP_SIGN: Record<string, string> = { add: "+", remove: "−", change: "~" }
const OP_CLASS: Record<string, string> = {
  add: "text-success",
  remove: "text-destructive",
  change: "text-warning",
}

/**
 * What is staged and not yet published, as one bar across the surface it
 * changes.
 *
 * The count, then each change as a chip with its sign spelled out — a reader
 * who cannot separate red from green still tells an addition from a removal —
 * and its own `×`; `Discard all` and the shortcut that publishes on the right.
 * It sits under the record's header while a draft is open, and not at all
 * otherwise: a bar reading *0 staged* is noise.
 */
export const StagedBar = React.forwardRef<HTMLDivElement, StagedBarProps>(
  (
    { items, onDiscard, onDiscardAll, hint, discardAllLabel = "Discard all", className, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      role="region"
      aria-label="Staged changes"
      className={cn(
        "flex min-h-[var(--control-h)] shrink-0 flex-wrap items-center gap-2 border-b border-border bg-primary/5 px-3 py-1",
        className,
      )}
      {...props}
    >
      <span className="shrink-0 text-sm font-semibold">{items.length} staged</span>
      {items.map((item) => (
        <span
          key={item.id}
          className="inline-flex max-w-full items-center gap-1.5 border border-border bg-card px-1.5 py-0.5 text-xs"
        >
          <span className={cn("font-mono", OP_CLASS[item.op] ?? "text-muted-foreground")}>
            {OP_SIGN[item.op] ?? item.op}
          </span>
          <span className="truncate font-mono">{item.name}</span>
          {item.note != null ? <span className="truncate text-muted-foreground">{item.note}</span> : null}
          {onDiscard ? (
            <button
              type="button"
              aria-label="Discard this change"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none"
              onClick={() => onDiscard(item.id)}
            >
              <X className="size-3" />
            </button>
          ) : null}
        </span>
      ))}
      <span className="flex-1" />
      {onDiscardAll ? (
        <Button type="button" variant="ghost" size="sm" onClick={onDiscardAll}>
          {discardAllLabel}
        </Button>
      ) : null}
      {hint != null ? <span className="shrink-0 text-sm text-muted-foreground">{hint}</span> : null}
    </div>
  ),
)
StagedBar.displayName = "StagedBar"
