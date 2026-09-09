import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * How an answer's records are rendered. A kind is a *body inside* the emission
 * card, never a block of its own (DS9) — so this names the body, it does not
 * pick a different container.
 */
export type EmissionKind =
  | "metric"
  | "table"
  | "chart"
  | "subgraph"
  | "prose"
  | "empty"
  | "html"

export interface EmissionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  kind: EmissionKind
  /** The projection template that rendered it — `table-compact@3`. Shown in mono. */
  template?: React.ReactNode
  /**
   * What the answer is grounded in — `cite · 214 records`.
   *
   * Absent means *not applicable*, not *none*: an emission with nothing to cite
   * says so with `0 records`. A missing strip must never read as an uncited
   * claim.
   */
  citation?: React.ReactNode
  /** A short state word — `in use`, `switched`. */
  note?: React.ReactNode
  /** Trailing controls, usually the template switcher. */
  actions?: React.ReactNode
}

export interface EmissionCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    Omit<EmissionHeaderProps, keyof React.HTMLAttributes<HTMLDivElement>> {
  /** Set false to render the body alone, where a surface supplies its own header. */
  showHeader?: boolean
  children?: React.ReactNode
}

/**
 * The strip that says what an emission is and what it is grounded in.
 *
 * One component wherever an emission appears — the assistant thread, a task
 * result, a scheduled answer (DS7). It is exported on its own so a surface that
 * already owns its container can still show the same header rather than
 * inventing a second one that drifts.
 */
export const EmissionHeader = React.forwardRef<
  HTMLDivElement,
  EmissionHeaderProps
>(({ kind, template, citation, note, actions, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-6 shrink-0 items-center gap-2 border-b border-border bg-muted/40 px-2 text-meta",
      className,
    )}
    {...props}
  >
    <span className="shrink-0 font-medium">{kind}</span>
    {template != null ? (
      <span className="truncate font-mono text-muted-foreground">{template}</span>
    ) : null}
    {note != null ? (
      <span className="shrink-0 border border-border px-1 text-muted-foreground">
        {note}
      </span>
    ) : null}
    <span className="flex-1" />
    {citation != null ? (
      <span className="shrink-0 text-muted-foreground">{citation}</span>
    ) : null}
    {actions ? <span className="flex shrink-0 items-center">{actions}</span> : null}
  </div>
))
EmissionHeader.displayName = "EmissionHeader"

/**
 * One rendered piece of an answer.
 *
 * Every emission renders through this card, whatever its kind (DS9): a metric,
 * a table, a chart, a subgraph, cited prose, an empty result. That is what makes
 * an answer scannable — the reader learns one shape and then only reads the
 * body.
 *
 * The card takes a **kind, a template name and children** — never a domain
 * object (DS6). It does not know what an Observation is, and it does not fetch,
 * re-render or re-query anything; switching templates is the caller's job,
 * handed in through `actions`.
 */
export const EmissionCard = React.forwardRef<HTMLDivElement, EmissionCardProps>(
  (
    {
      kind,
      template,
      citation,
      note,
      actions,
      showHeader = true,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-kind={kind}
      className={cn("flex flex-col overflow-hidden border border-border bg-card", className)}
      {...props}
    >
      {showHeader ? (
        <EmissionHeader
          kind={kind}
          template={template}
          citation={citation}
          note={note}
          actions={actions}
        />
      ) : null}
      {children}
    </div>
  ),
)
EmissionCard.displayName = "EmissionCard"

/**
 * The `prose` body's citation marker — the superscript that ties a clause to
 * the records behind it.
 */
export const CitationMarker = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <sup
    ref={ref}
    className={cn("px-0.5 align-super text-[0.7em] text-primary", className)}
    {...props}
  >
    {children}
  </sup>
))
CitationMarker.displayName = "CitationMarker"
