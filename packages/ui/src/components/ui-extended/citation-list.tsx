import * as React from "react"

import { cn } from "../../lib/utils"

export interface CitationRowProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, "children"> {
  /** What kind of record this is — `Article`, `Bar`, `Event`. */
  kind: React.ReactNode
  /** The record itself, in the words it was stored with. */
  children?: React.ReactNode
  /** Where it came from — the dataset, the publisher, the timestamp. */
  source?: React.ReactNode
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
  ({ kind, source, className, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("flex min-h-[26px] items-center gap-2 py-0.5", className)}
      {...props}
    >
      <span className="shrink-0 border border-border px-1 text-meta text-muted-foreground">
        {kind}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {source != null ? (
        <span className="shrink-0 text-meta text-muted-foreground">{source}</span>
      ) : null}
    </li>
  ),
)
CitationRow.displayName = "CitationRow"
