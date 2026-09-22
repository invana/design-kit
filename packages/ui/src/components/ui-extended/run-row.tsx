import * as React from "react"

import { cn } from "../../lib/utils"
import { StatusDot, type StatusDotProps } from "../ui/status-dot"
import { KindChip, type RunKind } from "./kind-chip"
import { runStatusTones, type RunStatus } from "./run-status-text"

export interface RunRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSelect"> {
  status: RunStatus
  /** Overrides the tone the status resolves to. */
  tone?: StatusDotProps["tone"]
  kind?: RunKind
  /**
   * The run's address — the last eight characters of its uuid, mono.
   *
   * **First on the row, before anything measured.** A row a reader cannot
   * quote into a log line, a support thread or `GET …/runs/{id}` has made them
   * drill in to find out what they are looking at.
   */
  address?: React.ReactNode
  /** What it was about — the question asked, the dataset loaded, the stitch run. */
  title: React.ReactNode
  /** Under it — `2m 51s · 21.4k · 9/9 · 4 mins ago`. */
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
 * The order on the row is addressed, then described, then measured: the id, the
 * kind, what it was about, and the numbers underneath. A reader scanning for
 * *the run I was just looking at* finds it by id; a reader scanning for *what
 * has this system been doing* reads the line under it.
 *
 * With `onSelect` the whole row is one button, so the accessible name is the
 * whole row — the id, the kind and the summary in one string, which is exactly
 * what a reader driving this from the keyboard needs to hear.
 */
export const RunRow = React.forwardRef<HTMLDivElement, RunRowProps>(
  (
    {
      status,
      tone,
      kind,
      address,
      title,
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
          <StatusDot
            tone={tone ?? runStatusTones[status] ?? "muted"}
            size="md"
            className="mt-1.5"
            label={typeof status === "string" ? status : undefined}
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex min-w-0 items-center gap-1.5">
              {kind ? <KindChip kind={kind} /> : null}
              {address != null ? (
                <span className="shrink-0 font-mono">{address}</span>
              ) : null}
              <span className="min-w-0 truncate">{title}</span>
            </span>
            {meta != null ? (
              <span className="truncate text-sm text-muted-foreground">{meta}</span>
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
