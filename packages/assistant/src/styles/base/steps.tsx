import * as React from "react"
import { Button, cn, StatusDot, type StatusDotProps } from "@invana/ui"

import type { AnswerTurn, TraceIoRow, TraceStep } from "../../protocol/types"
import { useChatSessionContext } from "./context"
import { elapsedSince, formatDuration } from "./format"
import { stepTime } from "./model"

const DOT: Record<TraceStep["state"], NonNullable<StatusDotProps["tone"]>> = {
  pending: "queued",
  running: "running",
  done: "success",
  failed: "error",
  waiting: "warning",
  retrying: "warning",
  stopped: "error",
}

/** The small-caps label every part of the session uses over a section. */
export const LABEL = "text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground"

/** A step's line, saying its state where the dot alone would not. */
export function stepDescription(step: TraceStep): string | undefined {
  const detail = step.state === "failed" ? (step.error ?? step.detail) : step.detail
  switch (step.state) {
    case "retrying":
      return [`retrying ${step.attempt ?? 2}${step.attempts ? `/${step.attempts}` : ""}`, detail]
        .filter(Boolean)
        .join(" · ")
    case "waiting":
      return ["needs you", detail].filter(Boolean).join(" · ")
    case "stopped":
      return "stopped"
    default:
      return detail
  }
}

/** One part of a step's record: its label at the left, its value at the right. */
function RecordSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-2.5 gap-y-1 border-b border-border px-2.5 py-[7px] last:border-b-0 @md:grid-cols-[112px_minmax(0,1fr)]">
      <span className={cn(LABEL, "pt-0.5")}>{title}</span>
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
    </div>
  )
}

/** A record row's value: code in a box, words as a line; `Show all` when the row carries the whole of it. */
function IoValue({ row }: { row: TraceIoRow }) {
  const [all, setAll] = React.useState(false)
  const text = all && row.full ? row.full : row.value
  return (
    <>
      {row.code || all ? (
        <pre className="m-0 whitespace-pre-wrap break-words border border-border bg-background px-2 py-1.5 font-mono text-xs">
          {text}
        </pre>
      ) : (
        <span className="leading-[18px]">{text}</span>
      )}
      {row.full && row.full !== row.value ? (
        <button
          type="button"
          aria-expanded={all}
          className="self-start text-sm text-info hover:text-foreground"
          onClick={() => setAll((on) => !on)}
        >
          {all ? "▾ Show less" : "▸ Show all"}
        </button>
      ) : null}
    </>
  )
}

/** Rows that follow one another under the same label share its section: a value, then the words about it. */
function sections(rows: TraceIoRow[]): [string, TraceIoRow[]][] {
  const out: [string, TraceIoRow[]][] = []
  for (const row of rows) {
    const last = out[out.length - 1]
    if (last && last[0] === row.label) last[1].push(row)
    else out.push([row.label, [row]])
  }
  return out
}

/** What went into a step and what came out — its audit record, a section per part. */
export function StepRecord({ step }: { step: TraceStep }) {
  const live = step.state === "running" || step.state === "retrying"
  const rows = [...(step.io?.input ?? []), ...(step.io?.output ?? [])]
  return (
    <div className="mx-3 mb-2.5 flex flex-col border border-border bg-chrome">
      {step.thinking && !live ? (
        <RecordSection title="thought">
          <span className="leading-[18px]">{step.thinking.trim()}</span>
        </RecordSection>
      ) : null}
      {sections(rows).map(([label, group], i) => (
        <RecordSection key={`${label}-${i}`} title={label}>
          {group.map((row, j) => (
            <IoValue key={j} row={row} />
          ))}
        </RecordSection>
      ))}
      {step.error ? (
        <RecordSection title="what happened">
          <span className="leading-[18px]">{step.error}</span>
        </RecordSection>
      ) : null}
    </div>
  )
}

const hasRecord = (step: TraceStep) =>
  !!(step.io?.input?.length || step.io?.output?.length || step.error || step.thinking)

/**
 * One step of a run, as a short row: its state as a dot, its tool in mono,
 * what it did and came to, and its time — counting up while it runs. While it
 * runs, its reasoning streams in the row's place. A click opens its record.
 */
export function StepRow({ turn, step, first }: { turn: AnswerTurn; step: TraceStep; first: boolean }) {
  const ctx = useChatSessionContext()
  const id = step.id ?? step.label
  const time = stepTime(step, ctx.now)
  const live = step.state === "running" || step.state === "retrying"
  const thinking = live && !!step.thinking && !step.detail
  const text = thinking
    ? `…${step.thinking!.slice(-90)}`
    : [stepDescription(step), step.result].filter(Boolean).join(" · ")
  const open = (ctx.recordOpen(turn.id, id) ?? ctx.stepsOpen(turn.id, false)) && hasRecord(step)
  return (
    <div className={cn("flex min-w-0 flex-col", !first && "border-t border-border")}>
      <button
        type="button"
        aria-expanded={hasRecord(step) ? open : undefined}
        disabled={!hasRecord(step)}
        onClick={() => ctx.toggleRecord(turn.id, id, !open)}
        className="grid grid-cols-[14px_max-content_minmax(0,1fr)_auto] items-baseline gap-x-2.5 px-3 py-2 text-left enabled:cursor-pointer enabled:hover:bg-accent/40"
      >
        <StatusDot tone={DOT[step.state]} size="md" className="self-center" />
        <span className={cn(thinking ? "font-sans" : "font-mono font-semibold")}>{thinking ? "thinking" : step.label}</span>
        <span
          className={cn(
            "min-w-0 truncate text-sm",
            step.state === "failed" ? "text-destructive" : "text-muted-foreground",
            thinking && "italic",
          )}
        >
          {text}
        </span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {time !== undefined && !live ? formatDuration(time) : ""}
        </span>
      </button>
      {open ? <StepRecord step={step} /> : null}
    </div>
  )
}

/** Rows past this many are folded: the latest stay, the earlier wait behind one line. */
export const STEP_FOLD = 40

/** `12s`, `1m 2s`, `1h 3m`, `1d 1h` — a wait, in whole seconds. */
export function waitedFor(ms: number): string {
  const t = Math.floor(ms / 1000)
  const pair = (a: number, x: string, b: number, y: string) => (b ? `${a}${x} ${b}${y}` : `${a}${x}`)
  if (t < 60) return `${t}s`
  if (t < 3600) return pair(Math.floor(t / 60), "m", t % 60, "s")
  if (t < 86400) return pair(Math.floor(t / 3600), "h", Math.floor((t % 3600) / 60), "m")
  return pair(Math.floor(t / 86400), "d", Math.floor((t % 86400) / 3600), "h")
}

/** A step held on the analyst: what it asks, Approve once, Stop the run, and how long it has waited. */
function WaitingBox({ turn, step }: { turn: AnswerTurn; step: TraceStep }) {
  const ctx = useChatSessionContext()
  const wait = step.wait!
  const waited = elapsedSince(wait.since, ctx.now)
  return (
    <div role="alert" className="flex flex-col gap-2 border-t border-warning px-3 py-2.5">
      <span className="font-semibold">{wait.title}</span>
      {wait.text ? <span className="leading-[18px] text-muted-foreground">{wait.text}</span> : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={() => ctx.emit({ type: "action", turn: turn.id, action: "approve", value: step.id ?? step.label })}
        >
          Approve once
        </Button>
        <Button size="sm" variant="outline" onClick={() => ctx.emit({ type: "stop" })}>
          Stop the run
        </Button>
        {waited !== undefined ? (
          <span
            role="timer"
            aria-label="Time spent waiting for you"
            className="ml-auto text-sm text-muted-foreground tabular-nums"
          >
            Waiting {waitedFor(waited)}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Every step of an answer, as short rows in one card under a `Steps` heading,
 * in the order they ran; a long run folds its earlier rows. A step held on the
 * analyst's approval asks for it at the card's foot.
 */
export function StepsCard({ turn }: { turn: AnswerTurn }) {
  const [all, setAll] = React.useState(false)
  const steps = turn.trace ?? []
  const folded = !all && steps.length > STEP_FOLD ? steps.length - STEP_FOLD : 0
  const waiting = steps.find((s) => s.state === "waiting" && s.wait)
  return (
    <section aria-label="Steps" className="flex min-w-0 flex-col border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-sm text-muted-foreground">
        <span className={LABEL}>Steps</span>
        <span>
          {steps.length} {steps.length === 1 ? "step" : "steps"}
          {folded ? ` · ${folded} earlier folded` : ""}
        </span>
        {folded ? (
          <button type="button" className="ml-auto text-info hover:text-foreground" onClick={() => setAll(true)}>
            Show all
          </button>
        ) : null}
      </div>
      {steps.slice(folded).map((step, i) => (
        <StepRow key={step.id ?? folded + i} turn={turn} step={step} first={i === 0} />
      ))}
      {waiting ? <WaitingBox turn={turn} step={waiting} /> : null}
    </section>
  )
}
