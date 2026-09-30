import { cn, Eyebrow, PropertyList, PropertyRow } from "@invana/ui"

import {
  ChatSessionActivitySubLine,
  ChatSessionDisclosure,
  ChatSessionTaskRow,
  type ChatSessionTaskStatus,
} from "../../conversations/thread"
import type { AnswerTurn, TraceIoRow, TraceStep } from "../../protocol/types"
import { useChatSessionContext } from "./context"
import { formatDuration } from "./format"
import { answerTime, runOutcome, stepCount, stepTime } from "./model"

const ROW_STATUS: Record<TraceStep["state"], ChatSessionTaskStatus> = {
  pending: "queued",
  running: "running",
  done: "success",
  failed: "error",
  waiting: "needs-input",
  retrying: "needs-input",
  stopped: "needs-input",
}

const TONE: Partial<Record<TraceStep["state"], string>> = {
  failed: "text-destructive",
  waiting: "text-warning",
  retrying: "text-warning",
  stopped: "text-warning",
}

/** A step's line, saying its state where the dot alone would not. */
export function stepDescription(step: TraceStep): string | undefined {
  const detail = step.state === "failed" ? (step.error ?? step.detail) : step.detail
  switch (step.state) {
    case "retrying":
      return [`retrying ${step.attempt ?? 2}${step.attempts ? `/${step.attempts}` : ""}`, detail]
        .filter(Boolean)
        .join(" · ")
    case "waiting":
      return ["needs input", detail].filter(Boolean).join(" · ")
    case "stopped":
      return "stopped"
    default:
      return detail
  }
}

function IoRows({ label, rows }: { label: string; rows: TraceIoRow[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <Eyebrow>{label}</Eyebrow>
      <PropertyList labelWidth="auto" variant="summary">
        {rows.map((row, i) => (
          <PropertyRow key={`${row.label}-${i}`} label={row.label} mono={row.code}>
            {row.code ? <pre className="m-0 whitespace-pre-wrap break-words">{row.value}</pre> : row.value}
          </PropertyRow>
        ))}
      </PropertyList>
    </div>
  )
}

/** What went into a step and what came out: its audit record. */
export function StepRecord({ step }: { step: TraceStep }) {
  const input = step.io?.input ?? []
  const output = step.io?.output ?? []
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {input.length ? <IoRows label="Input" rows={input} /> : null}
      {output.length ? <IoRows label="Output" rows={output} /> : null}
      {step.error ? <IoRows label="Error" rows={[{ label: "cause", value: step.error }]} /> : null}
    </div>
  )
}

const hasRecord = (step: TraceStep) => !!(step.io?.input?.length || step.io?.output?.length || step.error)

export interface StepRowProps {
  turn: AnswerTurn
  step: TraceStep
  /** Draw the streamed reasoning and the open record under the row. @default true */
  detail?: boolean
  /** In place of opening the record — the Tasks view jumps to the reply instead. */
  onSelect?: () => void
  /** Written after the description — `↑ 1.2k tokens`. */
  suffix?: string
}

/**
 * One step of a run: its state as a dot, its name, what it is doing, and its
 * time — counting up while it runs. Clicking it opens its record; while it
 * runs, its reasoning streams under it.
 */
export function StepRow({ turn, step, detail = true, onSelect, suffix }: StepRowProps) {
  const ctx = useChatSessionContext()
  const id = step.id ?? step.label
  const time = stepTime(step, ctx.now)
  const description = [stepDescription(step), suffix].filter(Boolean).join(" · ")
  const open = detail && ctx.recordOpen(turn.id, id)
  const select =
    onSelect ??
    (hasRecord(step)
      ? () => ctx.toggleRecord(turn.id, id)
      : ctx.opensRuns
        ? () => ctx.emit({ type: "open-run", turn: turn.id, step: step.id })
        : undefined)
  return (
    <div className="flex min-w-0 flex-col">
      <ChatSessionTaskRow
        status={ROW_STATUS[step.state]}
        name={step.label}
        description={description ? <span className={TONE[step.state]}>{description}</span> : undefined}
        meta={time !== undefined ? formatDuration(time) : undefined}
        onClick={select}
      />
      {detail && step.thinking && (step.state === "running" || step.state === "retrying") ? (
        <ChatSessionActivitySubLine className="pl-[22px] italic">{step.thinking}</ChatSessionActivitySubLine>
      ) : null}
      {open && hasRecord(step) ? (
        <ChatSessionDisclosure
          className="my-0.5 ml-[22px]"
          label={<span className="font-mono">{step.key ?? step.label}</span>}
          meta={[
            step.attempt ? `attempt ${step.attempt}` : undefined,
            step.duration !== undefined ? formatDuration(step.duration) : undefined,
          ]
            .filter(Boolean)
            .join(" · ")}
          open
          onOpenChange={() => ctx.toggleRecord(turn.id, id, false)}
        >
          <StepRecord step={step} />
        </ChatSessionDisclosure>
      ) : null}
    </div>
  )
}

/** Every step of an answer, in the order they run. */
export function StepList({ turn, className }: { turn: AnswerTurn; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-px", className)}>
      {(turn.trace ?? []).map((step, i) => (
        <StepRow key={step.id ?? i} turn={turn} step={step} />
      ))}
    </div>
  )
}

const VERB = { done: "Thought for", failed: "Failed after", stopped: "Stopped after" } as const

/**
 * A settled run in one line — `✻ Thought for 2.4s · 4 of 4 steps ▸`. The line
 * opens the steps; the time opens the whole run when the host does that
 * (`onOpenRun`), and the steps otherwise.
 */
export function RunSummaryLine({ turn }: { turn: AnswerTurn }) {
  const ctx = useChatSessionContext()
  const outcome = runOutcome(turn)
  const verb = VERB[outcome === "failed" || outcome === "stopped" ? outcome : "done"]
  const time = answerTime(turn, ctx.now)
  const { done, total } = stepCount(turn)
  const open = ctx.stepsOpen(turn.id, false)
  return (
    <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
      <span className="select-none text-border" aria-hidden>
        ✻
      </span>
      <span className="min-w-0 truncate">
        {verb}{" "}
        {time !== undefined ? (
          <button
            type="button"
            className="tabular-nums underline-offset-2 hover:text-foreground hover:underline"
            onClick={() =>
              ctx.opensRuns ? ctx.emit({ type: "open-run", turn: turn.id }) : ctx.toggleSteps(turn.id, !open)
            }
          >
            {formatDuration(time)}
          </button>
        ) : (
          "—"
        )}
        {total ? ` · ${done} of ${total} steps` : null}
      </span>
      {total ? (
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Fold the steps" : "Show the steps"}
          className="hover:text-foreground"
          onClick={() => ctx.toggleSteps(turn.id, !open)}
        >
          <span className={cn("inline-block transition-transform", open && "rotate-90")}>▸</span>
        </button>
      ) : null}
    </div>
  )
}
