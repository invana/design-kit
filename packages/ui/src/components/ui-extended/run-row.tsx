import * as React from "react"

import { cn } from "../../lib/utils"
import { StatusIcon, type StatusIconState } from "../ui/status-icon"
import { KindChip, type RunKind } from "./kind-chip"
import { runStatusIcons, type RunStatus } from "./run-status-text"

export interface RunRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSelect"> {
  status: RunStatus
  /** Overrides the glyph the status resolves to — `partial` on a run that succeeded. */
  state?: StatusIconState
  kind?: RunKind
  /**
   * What it was about, in the words it was opened with — the question as typed,
   * the query text, the dataset loaded. **Line one**, because it is what a
   * reader scans the journal for.
   */
  title: React.ReactNode
  /** The title is a query, not a sentence — drawn mono. */
  titleMono?: boolean
  /**
   * The run's address — the last eight characters of its uuid, mono.
   *
   * **First on line two.** A row a reader cannot quote into a log line, a
   * support thread or `GET …/runs/{id}` has made them drill in to find out what
   * they are looking at.
   */
  address?: React.ReactNode
  /** After the address — `nl-query@5 · 2m 51s · 21.4k · 9/9 · 4 mins ago`. */
  meta?: React.ReactNode
  /** Hard right — a badge, a count, an outcome. */
  aside?: React.ReactNode
  /** A child run sits under the step that spawned it, indented — never a sibling. */
  depth?: number
  selected?: boolean
  onSelect?: () => void
}

/**
 * One run in the journal.
 *
 * Every execution in a Graph is one of these — a question answered, a dataset
 * loaded, a stitch committed, an enrichment gated on a person — because they
 * are one record walked by one interpreter. **There is no row type per kind**
 * and no panel per kind: the kind is a chip and a filter value, which is what
 * keeps one journal from becoming four lists that drift apart.
 *
 * Line one is what it was about; line two is the id, then what it spent. The
 * status is a glyph in the leading slot and **not a word** — the shape carries
 * it, so the badge's column goes back to the prompt.
 *
 * With `onSelect` the whole row is one button, so the accessible name is the
 * whole row — the id, the kind and the summary in one string, which is exactly
 * what a reader driving this from the keyboard needs to hear.
 */
export const RunRow = React.forwardRef<HTMLDivElement, RunRowProps>(
  (
    {
      status,
      state,
      kind,
      address,
      title,
      titleMono,
      meta,
      aside,
      depth = 0,
      selected,
      onSelect,
      className,
      ...props
    },
    ref,
  ) => {
    const Row = onSelect ? "button" : "div"
    return (
      <div
        ref={ref}
        className={cn(
          "border-b border-border/55",
          selected && "bg-accent shadow-[inset_2px_0_0_var(--color-primary)]",
          className,
        )}
        {...props}
      >
        <Row
          type={onSelect ? "button" : undefined}
          onClick={onSelect}
          aria-current={onSelect && selected ? "true" : undefined}
          style={{ paddingLeft: 12 + depth * 18 }}
          className={cn(
            "flex w-full items-start gap-2 py-1.5 pr-3 text-left",
            onSelect &&
              "cursor-pointer hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
          )}
        >
          <StatusIcon
            state={state ?? runStatusIcons[status] ?? "queued"}
            className="mt-0.5"
            label={state === "alert" ? "partial" : status}
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex min-w-0 items-center gap-1.5">
              {kind ? <KindChip kind={kind} /> : null}
              <span className={cn("min-w-0 truncate", titleMono && "font-mono")}>
                {title}
              </span>
            </span>
            {address != null || meta != null ? (
              <span className="truncate text-sm text-muted-foreground">
                {address != null ? (
                  <span className="mr-1.5 font-mono">{address}</span>
                ) : null}
                {meta}
              </span>
            ) : null}
          </span>
          {aside != null ? (
            <span className="shrink-0 pt-0.5 text-sm text-muted-foreground">
              {aside}
            </span>
          ) : null}
        </Row>
      </div>
    )
  },
)
RunRow.displayName = "RunRow"
