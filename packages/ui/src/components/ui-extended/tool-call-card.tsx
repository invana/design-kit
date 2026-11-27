import * as React from "react"

import { cn } from "../../lib/utils"
import { Badge, type BadgeProps } from "../ui/badge"
import { Eyebrow } from "./eyebrow"
import { PropertyList, PropertyRow } from "./property-list"

/** How a call ended. `proposed` is a call that laid out a change and wrote nothing. */
export type ToolCallStatus = "succeeded" | "running" | "failed" | "refused" | "proposed"

const STATUS: Record<ToolCallStatus, { label: string; tone: NonNullable<BadgeProps["tone"]> }> = {
  succeeded: { label: "OK", tone: "success" },
  running: { label: "Running", tone: "info" },
  failed: { label: "Failed", tone: "destructive" },
  refused: { label: "Refused", tone: "warning" },
  proposed: { label: "Proposed", tone: "warning" },
}

/** One fact about the call: its label, its value, and a link or button after it. */
export interface ToolCallFact {
  label: React.ReactNode
  value: React.ReactNode
  /** A link after the value — `Open connection`, `Show in trace`. */
  action?: React.ReactNode
}

/** A titled run of facts — `In the conversation`, `The call`. */
export interface ToolCallGroup {
  title: React.ReactNode
  facts: ToolCallFact[]
}

/** One thing the call carried: what went in, what came back, what the LLM saw. */
export interface ToolCallRecord {
  title: React.ReactNode
  /** The text as recorded. */
  body: React.ReactNode
  /** Set in the mono face on a muted ground, as code is; plain text otherwise. */
  code?: boolean
  /** A note under it, with `action` after: `412 of 5,980 characters kept` · `Show all`. */
  note?: React.ReactNode
  action?: React.ReactNode
  /** The control that copies it. */
  copy?: React.ReactNode
}

export interface ToolCallCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The tool's name, as the engine records it. */
  tool: string
  status: ToolCallStatus
  /** Replaces the status word — `Refused by the World`. */
  statusLabel?: React.ReactNode
  /** One line under the name: where, when, which request. */
  subtitle?: React.ReactNode
  /** What happened, in a sentence or two, over the rest. */
  what?: { title: React.ReactNode; text?: React.ReactNode; note?: React.ReactNode }
  groups?: ToolCallGroup[]
  records?: ToolCallRecord[]
  /** At the right of the header: previous and next call, close. */
  actions?: React.ReactNode
  /** Under the body: what the card does with this call, as buttons. */
  footer?: React.ReactNode
  /** A line after the records — `Secrets are masked before they are stored`. */
  notice?: React.ReactNode
}

/**
 * One tool call, read in full: what it was, what happened, where it sits, what
 * went in and what came back.
 *
 * The card behind a trace's bar and a call-log row alike. It draws what it is
 * given and decides nothing: the status word, the facts and every record's text
 * come from the engine, so the same call reads the same wherever it is opened.
 *
 * It fills the height it is placed in, with the body scrolling between a fixed
 * header and footer, so a sheet needs nothing more than a width.
 */
export const ToolCallCard = React.forwardRef<HTMLDivElement, ToolCallCardProps>(
  (
    { tool, status, statusLabel, subtitle, what, groups, records, actions, footer, notice, className, ...props },
    ref,
  ) => {
    const shown = STATUS[status]
    return (
      <div ref={ref} className={cn("flex h-full min-h-0 flex-col bg-card", className)} {...props}>
        <header className="flex shrink-0 flex-col gap-1.5 border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2">
            <code className="font-mono text-lg font-semibold">{tool}</code>
            <Badge variant="soft" tone={shown.tone} size="sm">
              {statusLabel ?? shown.label}
            </Badge>
            <span className="flex-1" />
            {actions}
          </div>
          {subtitle != null ? <span className="text-muted-foreground">{subtitle}</span> : null}
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto p-4">
          {what ? (
            <section className="flex flex-col gap-2">
              <Eyebrow>What happened</Eyebrow>
              <div className="flex flex-col gap-1.5 rounded-control border border-border bg-muted p-3">
                <strong>{what.title}</strong>
                {what.text != null ? <span>{what.text}</span> : null}
                {what.note != null ? <span className="text-muted-foreground">{what.note}</span> : null}
              </div>
            </section>
          ) : null}

          {groups?.map((group, index) => (
            <section key={index} className="flex flex-col gap-2">
              <Eyebrow>{group.title}</Eyebrow>
              <PropertyList labelWidth={132}>
                {group.facts.map((fact, i) => (
                  <PropertyRow key={i} label={fact.label} meta={fact.action}>
                    {fact.value}
                  </PropertyRow>
                ))}
              </PropertyList>
            </section>
          ))}

          {records?.map((record, index) => (
            <section key={index} className="flex flex-col gap-2">
              <Eyebrow aside={record.copy}>{record.title}</Eyebrow>
              {record.code ? (
                <pre className="m-0 overflow-auto whitespace-pre-wrap rounded-control border border-border bg-muted p-3 font-mono text-sm">
                  {record.body}
                </pre>
              ) : (
                <div className="whitespace-pre-wrap">{record.body}</div>
              )}
              {record.note != null ? (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {record.note}
                  {record.action}
                </span>
              ) : null}
            </section>
          ))}

          {notice != null ? <span className="text-sm text-muted-foreground">{notice}</span> : null}
        </div>

        {footer != null ? (
          <footer className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-3">{footer}</footer>
        ) : null}
      </div>
    )
  },
)
ToolCallCard.displayName = "ToolCallCard"
