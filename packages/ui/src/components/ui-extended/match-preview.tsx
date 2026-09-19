import * as React from "react"

import { cn } from "../../lib/utils"
import { Skeleton } from "../ui/skeleton"
import { AddressChip } from "./address-chip"

export interface MatchCandidate {
  address: string
  matched: boolean
}

export interface MatchPreviewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The pattern as typed, wildcards and all — `graph_data/model/Deals@*`. */
  pattern: string
  /**
   * The catalogue, each entry saying whether this pattern reaches it. Both
   * halves are needed: see the note on near-misses.
   */
  matches?: MatchCandidate[]
  loading?: boolean
  /** Cap the list; the rest are counted. Default 8. */
  limit?: number
}

/**
 * What an address pattern matches **right now**, resolved against the live
 * catalogue as the pattern is typed.
 *
 * **Narrowing is picking, not writing.** Every control in the rule builder
 * offers what the catalogue holds, so nothing can name something that is not
 * there — and this is the surface that makes that true for the one control
 * which *is* free text. A pattern is written against what it visibly bites, not
 * from memory.
 *
 * **The near-misses are shown, greyed, not filtered out.** A preview listing
 * only hits cannot distinguish *this pattern is precise* from *this pattern is
 * wrong* — both render as a short list. Showing what it passed over is how a
 * reader sees that `Deals@1.0.0` missed because they wrote the version out
 * instead of `Deals@*`, which is the mistake that makes a bound quietly stop
 * applying on the next publish.
 *
 * **Nothing matched is a first-class state**, and distinct from a layer with
 * nothing in it. One means the pattern is wrong; the other means the Graph has
 * nothing of that kind configured yet.
 */
export const MatchPreview = React.forwardRef<HTMLDivElement, MatchPreviewProps>(
  ({ pattern, matches = [], loading, limit = 8, className, ...props }, ref) => {
    const hits = matches.filter((m) => m.matched)
    const misses = matches.filter((m) => !m.matched)
    const shown = [...hits, ...misses].slice(0, limit)
    const hidden = matches.length - shown.length

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-w-0 flex-col gap-1 rounded-control border border-border p-2",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="text-meta text-muted-foreground">
            what this matches
          </span>
          <span className="ml-auto shrink-0 text-meta tabular-nums text-muted-foreground">
            {loading ? "…" : `${hits.length} of ${matches.length}`}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col gap-1 py-0.5">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ) : matches.length === 0 ? (
          <p className="text-meta text-muted-foreground/70">
            nothing in this Graph to match — the layer has no participants yet
          </p>
        ) : hits.length === 0 ? (
          <p className="text-meta text-destructive">
            <span className="font-mono">{pattern}</span> matches nothing here
          </p>
        ) : null}

        {!loading && shown.length ? (
          <div className="flex min-w-0 flex-col gap-0.5">
            {shown.map((m) => (
              <AddressChip
                key={m.address}
                address={m.address}
                tone={m.matched ? "allowed" : "untouched"}
              />
            ))}
            {hidden > 0 ? (
              <span className="pt-0.5 text-meta text-muted-foreground/70">
                and {hidden} more
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
)
MatchPreview.displayName = "MatchPreview"
