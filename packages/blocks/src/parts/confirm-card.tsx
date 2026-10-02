import * as React from "react"
import { cn } from "@invana/ui"

import { ClarifyActions, ClarifyFootnote } from "@invana/ui"

export interface ConfirmCost {
  /** What it measures — `rows scanned`, `time`, `records written`. */
  label: React.ReactNode
  /**
   * The figure, already written — `2.3B`, `about 40 s`, `0`. A string is
   * drawn whole as the figure; pass nodes to mark only part of it.
   */
  value: React.ReactNode
  /** `warning` for the cost that changes something — records it will write. */
  tone?: "warning"
}

export interface ConfirmCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What yes does, in one sentence — or a short heading over a `description`. */
  question: React.ReactNode
  /** A muted line under the question; makes the question a heading. */
  description?: React.ReactNode
  /** Set the question as a heading without a description. */
  heading?: boolean
  /** What yes costs, figure by figure, between the question and the buttons. */
  cost?: ConfirmCost[]
  /**
   * `line` writes the cost as a sentence, each figure before its label;
   * `strip` sets the figures in cells, each label above. @default "line"
   */
  costAs?: "line" | "strip"
  /**
   * The strip without its box: only the rules between its cells, and the
   * outer cells flush with the question — for a card whose frame is already
   * the edge.
   */
  seamless?: boolean
  /** Something to weigh before answering, under the cost — a `CaveatNote`. */
  caveat?: React.ReactNode
  /** The line under the buttons — where the default came from. */
  hint?: React.ReactNode
  /** The yes and no buttons. */
  children?: React.ReactNode
}

const figure = (value: React.ReactNode, tone?: "warning") =>
  typeof value === "string" || typeof value === "number" ? (
    <b className={cn("font-mono font-normal text-foreground", tone === "warning" && "text-warning")}>{value}</b>
  ) : (
    value
  )

/**
 * Yes or no, where yes states what it costs: the rows it scans, the time it
 * takes, the records it writes. The cost is stated before the button, not
 * after — as a line of figures under the question, or as a strip of cells
 * when the figures are the point.
 *
 * The body of a confirm ask, inside its `ClarifyCard`.
 */
export const ConfirmCard = React.forwardRef<HTMLDivElement, ConfirmCardProps>(
  (
    { question, description, heading, cost, costAs = "line", seamless, caveat, hint, className, children, ...props },
    ref,
  ) => (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
      <p className={heading || description ? "font-semibold" : undefined}>{question}</p>
      {description ? <p className="-mt-1.5 text-sm text-muted-foreground">{description}</p> : null}
      {cost?.length && costAs === "strip" ? (
        <dl
          className={cn(
            "grid",
            // Seamless: it reaches out by a cell's padding and clips that off,
            // so the outer cells are flush.
            seamless
              ? "-mx-2 -my-1 [clip-path:inset(0.25rem_0.5rem)]"
              : "overflow-hidden rounded-md border border-border",
          )}
          style={{ gridTemplateColumns: `repeat(${cost.length}, minmax(0, 1fr))` }}
        >
          {cost.map((c, i) => (
            <div key={i} className="flex min-w-0 flex-col border-e border-border/60 px-2 py-1 last:border-e-0">
              <dt className="truncate text-xs text-muted-foreground">{c.label}</dt>
              <dd className={cn("font-mono font-medium tabular-nums", c.tone === "warning" && "text-warning")}>
                {c.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : cost?.length ? (
        <p className="text-xs text-muted-foreground">
          {cost.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 ? " · " : null}
              {figure(c.value, c.tone)} {c.label}
            </React.Fragment>
          ))}
        </p>
      ) : null}
      {caveat}
      <ClarifyActions>{children}</ClarifyActions>
      {hint ? <ClarifyFootnote>{hint}</ClarifyFootnote> : null}
    </div>
  ),
)
ConfirmCard.displayName = "ConfirmCard"
