import { cn, StatusDot } from "@invana/ui"

import { ChatSessionFrame } from "../../conversations/thread"
import type { AnswerTurn } from "../../protocol/types"
import { AskView } from "../base/ask"
import { BlockView, OutcomeView, splitBlocks } from "../base/blocks"
import { AnswerActions, SessionHeader } from "../base/chrome"
import { ComposerBar } from "../base/composer"
import { useChatSessionContext } from "../base/context"
import { clockTime, formatDuration } from "../base/format"
import { answerTime, currentStep, exchangesOf, type Exchange, isAnswer, runOutcome, turnDomId } from "../base/model"
import { RunReportView } from "../base/report"
import { StepsCard } from "../base/steps"

/** The words before an answer's time, by how its run ended. */
const TOOK = { done: "Answered in", failed: "Failed after", stopped: "Stopped after", live: "", waiting: "" } as const

const k = (value: number) => `${(value / 1000).toFixed(1)}k`

/**
 * Under an answer: where the run stands in two lines — what it is doing or
 * what it came to, then its time, steps and tokens — and at the right the
 * answer's actions, Open every step and the run report among them.
 */
function RunFooter({ turn }: { turn: AnswerTurn }) {
  const ctx = useChatSessionContext()
  const outcome = runOutcome(turn)
  const live = outcome === "live" || outcome === "waiting"
  const time = answerTime(turn, ctx.now)
  const steps = turn.trace?.length ?? 0
  const step = currentStep(turn)
  const n = step ? (turn.trace ?? []).indexOf(step) + 1 : 0
  const tokens = turn.report ? `↑ ${k(turn.report.tokens.in)} ↓ ${k(turn.report.tokens.out)} tokens` : undefined
  const first =
    outcome === "waiting"
      ? `Waiting for you · step ${n}`
      : live
        ? ["Working", step ? `step ${n} · ${step.label}` : undefined].filter(Boolean).join(" · ")
        : outcome === "stopped"
          ? "Stopped by you · nothing more was read"
          : outcome === "failed"
            ? "The run failed."
            : turn.meta
  const at = live ? undefined : clockTime(turn.at)
  const open = ctx.stepsOpen(turn.id, false)
  const took =
    time === undefined ? undefined : live ? formatDuration(time) : `${TOOK[outcome]} ${formatDuration(time, { spaced: true })}`
  const rest = [!live && steps ? `${steps} ${steps === 1 ? "step" : "steps"}` : undefined, tokens].filter(Boolean)
  const second = at || took || rest.length
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
      <span className="flex min-w-0 flex-[1_1_200px] flex-col gap-0.5 text-sm leading-[18px] text-muted-foreground">
        {first ? (
          <span className="inline-flex items-baseline gap-1.5">
            {live || outcome === "stopped" || outcome === "failed" ? (
              <StatusDot
                tone={outcome === "waiting" ? "warning" : live ? "running" : "error"}
                size="md"
                className="self-center"
              />
            ) : null}
            <span>{first}</span>
          </span>
        ) : null}
        {second ? (
          <span className="flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
            {at ? <span>{at}</span> : null}
            {took ? (
              <>
                {at ? <span aria-hidden>·</span> : null}
                {live ? (
                  <span>{took}</span>
                ) : (
                  // The time the whole answer took opens the run, or every step when the host opens none.
                  <button
                    type="button"
                    aria-haspopup={ctx.opensRuns ? "dialog" : undefined}
                    aria-expanded={ctx.opensRuns ? undefined : open}
                    className="underline decoration-dotted underline-offset-2 hover:text-foreground"
                    onClick={() =>
                      ctx.opensRuns ? ctx.emit({ type: "open-run", turn: turn.id }) : ctx.setSteps(turn.id, !open)
                    }
                  >
                    {took}
                  </button>
                )}
              </>
            ) : null}
            {rest.map((part, i) => (
              <span key={part}>
                {i || at || took ? <span aria-hidden>· </span> : null}
                {part}
              </span>
            ))}
          </span>
        ) : null}
      </span>
      <AnswerActions turn={turn} />
    </div>
  )
}

/**
 * An answer as the session draws it: its steps as short rows in one card, the
 * answer itself as plain text and blocks, what the run produced, the run's
 * line with its actions, and the run report when it is opened.
 */
export function WebAnswer({ turn, chrome = true }: { turn: AnswerTurn; chrome?: boolean }) {
  const ctx = useChatSessionContext()
  const outcome = runOutcome(turn)
  const live = outcome === "live" || outcome === "waiting"
  const { inCard, own } = splitBlocks(turn, ctx.registry)
  const blocks = [...inCard, ...own]
  return (
    <div className="flex min-w-0 flex-col gap-4">
      {turn.trace?.length ? <StepsCard turn={turn} /> : null}
      {blocks.length ? (
        <div className="flex min-w-0 flex-col gap-2.5 leading-5">
          {blocks.map((b, i) => (
            <BlockView key={`${b.kind}-${i}`} block={b} turn={turn} registry={ctx.registry} onEvent={ctx.emit} />
          ))}
        </div>
      ) : null}
      {turn.outcome && !live ? (
        <OutcomeView outcome={turn.outcome} turn={turn} onEvent={ctx.emit} tone={outcome === "failed" ? "bad" : undefined} />
      ) : null}
      {chrome ? <RunFooter turn={turn} /> : null}
      {turn.report && ctx.reportOpen(turn.id) ? (
        <RunReportView
          report={turn.report}
          model={ctx.spec.agent?.model}
          onExport={() => ctx.emit({ type: "action", turn: turn.id, action: "export-report" })}
          onOpenStep={(step) => {
            if (step) ctx.toggleRecord(turn.id, step, true)
            else ctx.toggleSteps(turn.id, true)
            ctx.scrollToTurn(turn.id)
          }}
        />
      ) : null}
    </div>
  )
}

function WebExchange({ exchange }: { exchange: Exchange }) {
  const ctx = useChatSessionContext()
  const prompt = exchange.prompt
  return (
    <>
      {prompt ? (
        <div
          id={turnDomId(ctx.spec, prompt.id)}
          className="max-w-full scroll-mt-3 self-end rounded-control border border-border bg-card px-3.5 py-2.5 whitespace-pre-wrap"
        >
          {prompt.text}
        </div>
      ) : null}
      {exchange.replies.map((reply) => (
        <div key={reply.id} id={turnDomId(ctx.spec, reply.id)} className="min-w-0 scroll-mt-3">
          {isAnswer(reply) ? (
            <WebAnswer turn={reply} />
          ) : (
            <AskView turn={reply} registry={ctx.registry} onEvent={ctx.emit} now={ctx.now} />
          )}
        </div>
      ))}
    </>
  )
}

export interface WebSessionProps {
  running: boolean
  onStop: () => void
  /** `true` draws the session's own header; a node is drawn in its place. */
  header: React.ReactNode
  onClose?: () => void
  emptyState?: React.ReactNode
  className?: string
}

/**
 * The session: its header, the question on the right, each answer's steps,
 * the answer and its run line under it, and the composer at the foot. It
 * reads its own width: a narrow panel tightens its padding and stacks the
 * report.
 */
export function WebSession({ running, onStop, header, onClose, emptyState, className }: WebSessionProps) {
  const ctx = useChatSessionContext()
  return (
    <div className={cn("@container flex h-full min-h-0 flex-col bg-chrome", className)}>
      {header === true ? <SessionHeader onClose={onClose} /> : header || null}
      <ChatSessionFrame
        className="min-h-0 flex-1"
        autoScrollKey={ctx.spec.turns.length}
        emptyState={emptyState}
        bodyClassName="gap-4 p-3 @md:p-6"
        footer={<ComposerBar isRunning={running} onStop={onStop} />}
      >
        {exchangesOf(ctx.spec).map((exchange) => (
          <WebExchange key={exchange.id} exchange={exchange} />
        ))}
      </ChatSessionFrame>
    </div>
  )
}
