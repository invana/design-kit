import * as React from "react"

import { cn } from "../../lib/utils"

export interface CitationRowProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, "children"> {
  /** What kind of record this is — `Article`, `Bar`, `Event`. */
  kind?: React.ReactNode
  /**
   * The number an answer cites it by — `1` renders as `[1]`. Numbered rows are
   * how an answer's markers are resolved, so the number leads the row.
   */
  marker?: React.ReactNode
  /** The record itself, in the words it was stored with. */
  children?: React.ReactNode
  /** Where it came from — the dataset, the publisher, the timestamp. */
  source?: React.ReactNode
  /** How many records it contributed — `3,406`, `5 days`. Mono, at the right. */
  count?: React.ReactNode
}

export interface CitationListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode
}

/**
 * The records an answer rests on.
 *
 * Every claim in this system is traceable to records, and this is where that
 * trace is read. A row names the **kind** first because that is what tells the
 * reader whether the claim is grounded in the right sort of evidence — a
 * recommendation citing three Articles and no Bar is a different thing from one
 * citing both.
 *
 * `source` is not optional in spirit: a citation you cannot locate is not a
 * citation. An absent one should mean the record has no source, not that the
 * caller could not be bothered.
 */
export const CitationList = React.forwardRef<
  HTMLUListElement,
  CitationListProps
>(({ className, children, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-col", className)} {...props}>
    {children}
  </ul>
))
CitationList.displayName = "CitationList"

export const CitationRow = React.forwardRef<HTMLLIElement, CitationRowProps>(
  ({ kind, marker, source, count, className, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "flex items-center gap-2 py-0.5",
        // A numbered row is an answer's source line, set in the answer's
        // secondary size; a kind row is a record in a list of its own.
        marker != null ? "text-sm" : "min-h-[26px]",
        className,
      )}
      {...props}
    >
      {marker != null ? (
        <span className="w-6 shrink-0 font-mono text-xs text-info">[{marker}]</span>
      ) : null}
      {kind != null ? (
        <span className="shrink-0 border border-border px-1 text-sm text-muted-foreground">
          {kind}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {source != null ? (
        <span className="shrink-0 text-sm text-muted-foreground">{source}</span>
      ) : null}
      {count != null ? (
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
      ) : null}
    </li>
  ),
)
CitationRow.displayName = "CitationRow"
