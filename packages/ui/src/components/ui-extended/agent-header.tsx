import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Progress } from "../ui/progress"
import { StatusDot, type StatusDotProps } from "../ui/status-dot"
import { AgentChip } from "./agent-chip"
import { DataReach, formatRecords, summarizeReach, type DataReachModel } from "./data-reach"
import { EgressList, type EgressClass } from "./egress-list"
import { Eyebrow } from "./eyebrow"
import { PropertyList, PropertyRow } from "./property-list"

export interface AgentHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** What the session is — its name, or a switcher that lists the others. */
  title: React.ReactNode
  /** Who is answering — `Analyst`, `v2`, `sonnet-5.5`. */
  agent?: { name: string; version?: string; model?: string }
  /** Where the session is — `running…`, `needs input (1)`, `idle`. `short` is said under 420px. */
  status?: { tone: NonNullable<StatusDotProps["tone"]>; label: string; short?: string }
  /** At the end of the first line — a menu of the session's actions, a close. */
  actions?: React.ReactNode
  /** The data the session can reach: the whole world it opened on, or an access group's share. */
  access?: { kind: "world" | "group"; label: string; models?: DataReachModel[] }
  /** The lens the session reads through — `Funding watch`. */
  lens?: string
  /** Tokens spent of the session's budget. Tokens, never money. */
  budget?: { used: number; limit: number }
  /** The rules it runs under: the strictest as the badge, every one in its popover. */
  governance?: {
    summary: string
    rules?: { label: string; value: string }[]
    egress?: { to: string; classes?: EgressClass[] }[]
  }
  /** The marks before the access, the lens and the governance badge. The kit ships no icons. */
  icons?: { world?: React.ReactNode; group?: React.ReactNode; lens?: React.ReactNode; governance?: React.ReactNode }
  /** Ask for the denied models — their ids. Shown in the data reach when some are denied. */
  onRequestAccess?: (models: string[]) => void
  /** The host's settings, at a section — `data`, `governance`. Shown as a link in each popover. */
  onOpenSettings?: (section: "data" | "governance") => void
}

/** A fact on the second line that opens its detail. */
function Fact({ label, children, ...props }: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="inline-flex min-w-0 items-center gap-1 rounded-control px-1 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-3.5 [&_svg]:shrink-0"
      {...props}
    >
      {children}
    </button>
  )
}

function SettingsLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button variant="link" size="sm" className="h-auto self-start p-0" onClick={onClick}>
      {children}
    </Button>
  )
}

/**
 * The header of an agent's session: who is answering and where it stands,
 * then what it can reach and the rules it runs under.
 *
 * Line one is the session, the agent and its status, and the host's actions.
 * Line two — drawn when any of it is given — is the data reach (opens every
 * model, the records this session sees in each, and what it may do), the
 * lens, the token budget and the governance badge (opens the rules and what
 * may leave, per destination). Under 420px of its own width the second line
 * keeps its marks and counts and drops the words.
 *
 * Plain props, no conversation: pass it as a `ChatSession`'s `header`, or
 * over a run view or a dashboard that shows the same session.
 */
export const AgentHeader = React.forwardRef<HTMLDivElement, AgentHeaderProps>(
  (
    {
      title,
      agent,
      status,
      actions,
      access,
      lens,
      budget,
      governance,
      icons = {},
      onRequestAccess,
      onOpenSettings,
      className,
      ...props
    },
    ref,
  ) => {
    const models = access?.models ?? []
    const sum = summarizeReach(models)
    const where = access?.kind === "world" ? "entire world" : "access group"
    const second = access || lens || budget || governance
    return (
      <div ref={ref} className={cn("@container/header shrink-0 border-b border-border px-3", className)} {...props}>
        <div className="flex h-control-md items-center gap-2">
          <span className="min-w-0 truncate font-medium">{title}</span>
          {agent ? (
            <>
              <AgentChip name={agent.name} className="@max-[420px]/header:hidden" />
              {agent.version || agent.model ? (
                <span className="shrink-0 text-sm text-muted-foreground @max-[520px]/header:hidden">
                  {[agent.version, agent.model].filter(Boolean).join(" · ")}
                </span>
              ) : null}
            </>
          ) : null}
          <span className="ml-auto flex shrink-0 items-center gap-2">
            {status ? (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <StatusDot tone={status.tone} />
                <span className={cn(status.short && "@max-[420px]/header:hidden")}>{status.label}</span>
                {status.short ? <span className="@min-[421px]/header:hidden">{status.short}</span> : null}
              </span>
            ) : null}
            {actions}
          </span>
        </div>
        {second ? (
          <div className="-mx-1 flex min-w-0 items-center gap-2 pb-1.5 text-sm text-muted-foreground">
            {agent ? <AgentChip name={agent.name} className="@min-[421px]/header:hidden" /> : null}
            {access ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Fact label={`Data reach: ${access.label}, ${where}`}>
                    {access.kind === "world" ? icons.world : icons.group}
                    <span className="min-w-0 truncate">{access.label}</span>
                    <span className="shrink-0 @max-[420px]/header:hidden">· {where}</span>
                    {models.length ? (
                      <span className="shrink-0 tabular-nums">
                        · {sum.readable}/{sum.total}
                        <span className="@max-[420px]/header:hidden"> models</span> · {formatRecords(sum.records)}
                        {sum.counting ? "…" : ""}
                      </span>
                    ) : null}
                  </Fact>
                </PopoverTrigger>
                <PopoverContent align="start" className="flex w-[min(30rem,calc(100vw-2rem))] flex-col gap-2">
                  <Eyebrow aside="set for this session">Data reach</Eyebrow>
                  <span>
                    {access.label} · {where}
                  </span>
                  {models.length ? <DataReach models={models} onRequestAccess={onRequestAccess} /> : null}
                  {onOpenSettings ? (
                    <SettingsLink onClick={() => onOpenSettings("data")}>Open data settings →</SettingsLink>
                  ) : null}
                </PopoverContent>
              </Popover>
            ) : null}
            {lens ? (
              <span className="flex min-w-0 items-center gap-1 @max-[520px]/header:hidden [&_svg]:size-3.5">
                {icons.lens}
                <span className="truncate">{lens}</span>
              </span>
            ) : null}
            <span className="ml-auto flex shrink-0 items-center gap-2">
              {budget ? (
                <span
                  className="flex items-center gap-1.5 tabular-nums"
                  title={`${budget.used.toLocaleString()} of ${budget.limit.toLocaleString()} tokens`}
                >
                  <Progress
                    size="sm"
                    className="w-10"
                    value={Math.min(100, (budget.used / budget.limit) * 100)}
                    aria-label="Token budget"
                  />
                  <span className="@max-[420px]/header:hidden">
                    {formatRecords(budget.used)}/{formatRecords(budget.limit)}
                  </span>
                </span>
              ) : null}
              {governance ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Fact label={`Governance: ${governance.summary}`}>
                      {icons.governance}
                      <span className="truncate @max-[420px]/header:hidden">{governance.summary}</span>
                    </Fact>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
                    <Eyebrow aside={governance.summary}>Governance</Eyebrow>
                    {governance.rules?.length ? (
                      <PropertyList>
                        {governance.rules.map((r) => (
                          <PropertyRow key={r.label} label={r.label}>
                            {r.value}
                          </PropertyRow>
                        ))}
                      </PropertyList>
                    ) : null}
                    {governance.egress?.map((e) => <EgressList key={e.to} to={e.to} classes={e.classes} />)}
                    {onOpenSettings ? (
                      <SettingsLink onClick={() => onOpenSettings("governance")}>Edit in Settings →</SettingsLink>
                    ) : null}
                  </PopoverContent>
                </Popover>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>
    )
  },
)
AgentHeader.displayName = "AgentHeader"
