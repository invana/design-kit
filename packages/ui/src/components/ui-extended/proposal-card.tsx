import * as React from "react"

import { cn } from "../../lib/utils"

export interface ProposalCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** What is being proposed — `Draft pattern`. Left out when the frame around the card already says it. */
  title?: React.ReactNode
  /** Where it came from — `from the agent's result`. */
  source?: React.ReactNode
  /** The draft itself. A `PropertyList`, usually. */
  children?: React.ReactNode
  /**
   * The draft without its muted box — for a card whose frame is already its
   * own, such as a proposal under an answer, where a box inside it is a box
   * inside a box.
   */
  flush?: boolean
  /** What the proposal rests on — the instances, as a table or list. */
  evidence?: React.ReactNode
  /** A heading for the evidence — `The six instances`. */
  evidenceTitle?: React.ReactNode
  /** Scope of the evidence — `30 days`. */
  evidenceMeta?: React.ReactNode
  /** What authoring would actually write. */
  consequence?: React.ReactNode
  /** Author / reject / reassign. */
  actions?: React.ReactNode
  /** Written: what was made — `Alert created` — stamped above the draft. */
  done?: React.ReactNode
}

/**
 * An agent proposes; a person publishes.
 *
 * Nothing here exists in the graph yet — the draft is a shape the agent found,
 * and authoring is what writes it. The card is built so that separation is
 * legible: the draft and the evidence it rests on are shown together, so the
 * decision is made against the instances rather than against a summary of them.
 *
 * `consequence` says what authoring will write. A person approving something
 * should not have to infer the side effects.
 */
export const ProposalCard = React.forwardRef<HTMLDivElement, ProposalCardProps>(
  (
    {
      title,
      source,
      flush,
      evidence,
      evidenceTitle,
      evidenceMeta,
      consequence,
      actions,
      done,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn("flex flex-col gap-3", flush && "gap-2", className)} {...props}>
      {done != null ? (
        <p className="flex items-center gap-1.5 text-sm text-primary">
          <span aria-hidden>✓</span>
          {done}
        </p>
      ) : null}
      <section className="flex flex-col gap-1">
        {title != null || source != null ? (
          <div className="flex items-baseline gap-2">
            {title != null ? <h4 className="font-semibold">{title}</h4> : null}
            {source != null ? (
              <span className="text-sm text-muted-foreground">{source}</span>
            ) : null}
          </div>
        ) : null}
        {flush ? children : <div className="border border-border bg-muted/30 p-2">{children}</div>}
      </section>

      {evidence ? (
        <section className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h4 className="font-medium">{evidenceTitle}</h4>
            {evidenceMeta != null ? (
              <span className="text-sm text-muted-foreground">{evidenceMeta}</span>
            ) : null}
          </div>
          <div className="overflow-hidden border border-border">{evidence}</div>
        </section>
      ) : null}

      {consequence != null ? (
        <p className="text-xs text-muted-foreground">{consequence}</p>
      ) : null}
      {actions ? <div className="flex flex-wrap items-center gap-1.5">{actions}</div> : null}
    </div>
  ),
)
ProposalCard.displayName = "ProposalCard"
