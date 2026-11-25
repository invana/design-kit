import {
  Badge,
  Button,
  cn,
  MetricGrid,
  MetricTile,
  ProposalCard,
  PropertyList,
  PropertyRow,
} from "@invana/ui"
import type { BlockProps, ProposalStep, ProposalStepState } from "../types"

import { ActionRow } from "../parts/actions"

const STATE_TONE: Record<ProposalStepState, "info" | "success" | "muted" | "warning"> = {
  open: "info",
  accepted: "success",
  rejected: "muted",
  stale: "warning",
}

/** One step: its kind and what it changes, Reject and Accept while open, else its state; the note and issues under it. */
function StepRow({
  step,
  onAction,
}: {
  step: ProposalStep
  onAction?: BlockProps<"proposal">["onAction"]
}) {
  const open = step.state === "open"
  return (
    <li
      className={cn(
        "flex flex-col gap-1 border-b border-border py-2 last:border-b-0",
        step.state === "rejected" && "opacity-60",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 rounded-sm bg-muted px-1.5 font-mono text-xs font-semibold text-muted-foreground">
          {step.kind}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono" title={step.what}>
          {step.what}
        </span>
        {open ? (
          <>
            <Button
              size="icon-xs"
              variant="ghost"
              disabled={step.busy}
              aria-label={`Reject ${step.what}`}
              title="Reject"
              onClick={() => onAction?.("reject", step.id)}
            >
              ×
            </Button>
            <Button
              size="xs"
              variant="outline"
              disabled={step.busy}
              aria-label={`Accept ${step.what}`}
              onClick={() => onAction?.("accept", step.id)}
            >
              Accept
            </Button>
          </>
        ) : (
          <Badge variant="soft" size="xs" tone={STATE_TONE[step.state]}>
            {step.state}
          </Badge>
        )}
      </span>
      {step.note ? (
        <span className={cn("text-sm", step.state === "stale" ? "text-warning" : "text-muted-foreground")}>
          {step.note}
        </span>
      ) : null}
      {step.issues?.map((issue) => (
        <span key={issue} className="text-sm text-warning">
          {issue}
        </span>
      ))}
    </li>
  )
}

/**
 * Something the answer proposes to write: what it proposes, the draft or what
 * writing it does as figures, what writing it would do in words, and the
 * actions, each sent as its id. Nothing is written until the shell acts on one;
 * once written, a stamp says so. The shell gives it its card and its header.
 *
 * A proposal of several changes lists them as `steps`, each decided on its
 * own: `accept` and `reject` with the step's id, and `accept-all` while more
 * than one is open. What a step becomes is the shell's to say, by its `state`.
 */
export function ProposalBlock({ spec, onAction }: BlockProps<"proposal">) {
  const steps = spec.steps ?? []
  const open = steps.filter((s) => s.state === "open")
  const acceptAll =
    open.length > 1 ? (
      <Button size="xs" disabled={steps.some((s) => s.busy)} onClick={() => onAction?.("accept-all")}>
        Accept all {open.length}
      </Button>
    ) : null
  const actions =
    spec.actions.length || acceptAll ? (
      <>
        {spec.actions.length ? (
          <ActionRow actions={spec.actions} onAction={(id) => onAction?.("action", id)} />
        ) : null}
        {acceptAll ? <span className="ml-auto">{acceptAll}</span> : null}
      </>
    ) : undefined
  return (
    <ProposalCard flush title={spec.heading} done={spec.done?.label} consequence={spec.consequence} actions={actions}>
      {steps.length ? (
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {steps.length} {steps.length === 1 ? "step" : "steps"}
            {open.length < steps.length ? ` · ${open.length} open` : ""}
          </span>
          <ul aria-label="Steps" className="flex flex-col">
            {steps.map((step) => (
              <StepRow key={step.id} step={step} onAction={onAction} />
            ))}
          </ul>
        </div>
      ) : null}
      {spec.rows?.length ? (
        <PropertyList labelWidth="auto" variant="summary">
          {spec.rows.map((row) => (
            <PropertyRow key={row.label} label={row.label} mono>
              {row.value}
            </PropertyRow>
          ))}
        </PropertyList>
      ) : null}
      {spec.figures?.length ? (
        <MetricGrid joined seamless minTileWidth={72}>
          {spec.figures.map((f) => (
            <MetricTile key={f.label} variant="figure" label={f.label} value={f.value} />
          ))}
        </MetricGrid>
      ) : null}
    </ProposalCard>
  )
}
