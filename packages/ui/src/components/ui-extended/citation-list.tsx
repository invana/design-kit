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
  /** A second line under the record — what kind of source it is and how fresh: `table · loaded 28 Sep`. */
  detail?: React.ReactNode
  /** The row the reader is on — the one a lit marker in the prose points to. */
  active?: boolean
}

export interface CitationListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode
  /**
   * A line under the sources. `warning` when it says the answer rests on no
   * records — which is said out loud, never left for the zeros to imply.
   */
  note?: React.ReactNode
  noteTone?: "muted" | "warning"
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
>(({ note, noteTone = "muted", className, children, ...props }, ref) => {
  const list = (
    <ul ref={note != null ? undefined : ref} className={cn("flex flex-col", note == null && className)} {...(note != null ? {} : props)}>
      {children}
    </ul>
  )
  if (note == null) return list
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {list}
      <p className={cn("text-xs", noteTone === "warning" ? "text-warning" : "text-muted-foreground")}>
        {note}
      </p>
    </div>
  )
})
CitationList.displayName = "CitationList"

export const CitationRow = React.forwardRef<HTMLLIElement, CitationRowProps>(
  ({ kind, marker, source, count, detail, active, className, children, ...props }, ref) => (
    <li
      ref={ref}
      data-active={active || undefined}
      className={cn(
        "flex gap-2 py-0.5",
        detail != null ? "items-baseline" : "items-center",
        active && "bg-info/15",
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
      {detail != null ? (
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate">{children}</span>
          <span className="truncate text-xs text-muted-foreground">{detail}</span>
        </span>
      ) : (
        <span className="min-w-0 flex-1 truncate">{children}</span>
      )}
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
