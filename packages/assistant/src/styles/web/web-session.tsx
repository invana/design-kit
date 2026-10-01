import * as React from "react"
import { cn } from "@invana/ui"

import { EmissionBody, EmissionCard } from "../../answers"
import { TurnLabel } from "../../conversations/turn-label"
import { ChatSessionFrame, ChatSessionMessage, ChatSessionStatusBar } from "../../conversations/thread"
import type { AnswerTurn } from "../../protocol/types"
import { AskView } from "../base/ask"
import { BlockView, citationOf, OutcomeView, splitBlocks } from "../base/blocks"
import { AnswerLine, KeyHints, SessionHeader } from "../base/chrome"
import { ComposerBar } from "../base/composer"
import { useChatSessionContext } from "../base/context"
import { clockTime, dayLabel, formatDuration, sameDay } from "../base/format"
import { answerTime, exchangesOf, type Exchange, isAnswer, runOutcome, turnDomId } from "../base/model"
import { StepList } from "../base/steps"

const RUN_WORDS = { done: "Answered in", failed: "Failed after", stopped: "Stopped after" } as const

/** Under a settled answer: when, and how long it took — the time opens the run. */
function RunLine({ turn }: { turn: AnswerTurn }) {
  const ctx = useChatSessionContext()
  const outcome = runOutcome(turn)
  const time = answerTime(turn, ctx.now)
  const at = clockTime(turn.at)
  const words = RUN_WORDS[outcome === "failed" || outcome === "stopped" ? outcome : "done"]
  const open = ctx.stepsOpen(turn.id, false)
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
      {at ? <span className="tabular-nums">{at}</span> : null}
      {at && time !== undefined ? <span aria-hidden>·</span> : null}
      {time !== undefined ? (
        <button
          type="button"
          aria-haspopup={ctx.opensRuns ? "dialog" : undefined}
          aria-expanded={ctx.opensRuns ? undefined : open}
          className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          onClick={() =>
            ctx.opensRuns ? ctx.emit({ type: "open-run", turn: turn.id }) : ctx.setSteps(turn.id, !open)
          }
        >
          {words} {formatDuration(time, { spaced: true })}
        </button>
      ) : null}
    </div>
  )
}

/**
 * An answer as the chat draws it: the live steps while it runs; the evidence
 * in one card, with its envelope; blocks that are cards of their own under it;
 * what the run produced; then when it was answered and in how long.
 */
export function WebAnswer({ turn, chrome = true }: { turn: AnswerTurn; chrome?: boolean }) {
  const ctx = useChatSessionContext()
  const outcome = runOutcome(turn)
  const live = outcome === "live" || outcome === "waiting"
  const { inCard, own, hasEvidence } = splitBlocks(turn, ctx.registry)
  const block = (b: (typeof inCard)[number], i: number) => (
    <BlockView key={`${b.kind}-${i}`} block={b} turn={turn} registry={ctx.registry} onEvent={ctx.emit} />
  )
  const steps = !!turn.trace?.length && (live || ctx.stepsOpen(turn.id, outcome === "failed"))

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {live && !turn.trace?.length && !hasEvidence ? (
        <ChatSessionMessage role="assistant" status="running">
          Working
        </ChatSessionMessage>
      ) : null}
      {steps ? (
        <EmissionCard kind={live ? (outcome === "waiting" ? "waiting" : "running") : "steps"}>
          <EmissionBody>
            <StepList turn={turn} />
          </EmissionBody>
        </EmissionCard>
      ) : null}
      {hasEvidence ? (
        <EmissionCard
          kind={turn.label ?? turn.pattern ?? "answer"}
          title={turn.title}
          citation={
            citationOf(turn) ??
            turn.aside ??
            (live && !inCard.some((b) => b.status === "loading") ? "writing…" : undefined)
          }
          note={turn.state === "partial" ? turn.state : undefined}
        >
          <EmissionBody>{inCard.map(block)}</EmissionBody>
        </EmissionCard>
      ) : null}
      {own.map(block)}
      {!hasEvidence && !own.length && (outcome === "failed" || outcome === "stopped") ? (
        <ChatSessionMessage role="assistant" status={outcome === "failed" ? "error" : "stopped"}>
          {outcome === "failed" ? "The run failed." : "Stopped by you."}
        </ChatSessionMessage>
      ) : null}
      {turn.outcome && !live ? (
        <OutcomeView outcome={turn.outcome} turn={turn} onEvent={ctx.emit} tone={outcome === "failed" ? "bad" : undefined} />
      ) : null}
      {chrome && !live ? (
        <AnswerLine turn={turn}>
          <RunLine turn={turn} />
        </AnswerLine>
      ) : null}
    </div>
  )
}

function WebExchange({ exchange, dayBreak }: { exchange: Exchange; dayBreak?: string }) {
  const ctx = useChatSessionContext()
  const you = ctx.spec.analyst ?? "You"
  const assistant = ctx.spec.assistant ?? "Assistant"
  const prompt = exchange.prompt
  const sentAt = clockTime(prompt?.at)
  return (
    <>
      {dayBreak ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="separator">
          <span className="h-px flex-1 bg-border" />
          <span>{dayBreak}</span>
          <span className="h-px flex-1 bg-border" />
        </div>
      ) : null}
      {prompt ? (
        <div id={turnDomId(ctx.spec, prompt.id)} className="flex scroll-mt-3 flex-col gap-1">
          <TurnLabel align="end">{you}</TurnLabel>
          <ChatSessionMessage role="user">{prompt.text}</ChatSessionMessage>
          {sentAt ? <span className="self-end text-sm text-muted-foreground tabular-nums">{sentAt}</span> : null}
        </div>
      ) : null}
      {exchange.replies.length ? (
        <div className="flex min-w-0 flex-col gap-2">
          <TurnLabel>{assistant}</TurnLabel>
          {exchange.replies.map((reply) => (
            <div key={reply.id} id={turnDomId(ctx.spec, reply.id)} className="min-w-0 scroll-mt-3">
              {isAnswer(reply) ? (
                <WebAnswer turn={reply} />
              ) : (
                <AskView turn={reply} registry={ctx.registry} onEvent={ctx.emit} now={ctx.now} />
              )}
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}

/**
 * The day line over each exchange that starts a new day — the first one too,
 * so the thread opens with when it is from. Exchanges with no time take none.
 */
function dayBreaks(exchanges: Exchange[], now: number): (string | undefined)[] {
  let last: string | undefined
  return exchanges.map((exchange) => {
    const at = exchange.prompt?.at
    if (!at) return undefined
    const label = last === undefined || !sameDay(last, at) ? dayLabel(at, now) : undefined
    last = at
    return label
  })
}

export interface WebSessionProps {
  running: boolean
  onStop: () => void
  header: boolean
  onClose?: () => void
  emptyState?: React.ReactNode
  className?: string
}

/**
 * The chat: who is speaking over each turn, the prompt as a bubble with its
 * time, the assistant's asks and answer cards under it, a day line where the
 * day changes, and the composer.
 */
export function WebSession({ running, onStop, header, onClose, emptyState, className }: WebSessionProps) {
  const ctx = useChatSessionContext()
  const exchanges = exchangesOf(ctx.spec)
  const breaks = dayBreaks(exchanges, ctx.now)
  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-background", className)}>
      {header ? <SessionHeader onClose={onClose} /> : null}
      <ChatSessionFrame
        className="min-h-0 flex-1"
        autoScrollKey={ctx.spec.turns.length}
        emptyState={emptyState}
        bodyClassName="mx-auto w-full max-w-[52rem] gap-5"
        footer={
          <div className="mx-auto w-full max-w-[52rem]">
            <ComposerBar isRunning={running} onStop={onStop} />
            <ChatSessionStatusBar
              className="pt-0"
              start={ctx.spec.assistant ? <span className="truncate">{ctx.spec.assistant}</span> : undefined}
              end={ctx.spec.composer?.hints === false ? undefined : <KeyHints running={running} />}
            />
          </div>
        }
      >
        {exchanges.map((exchange, i) => (
          <WebExchange key={exchange.id} exchange={exchange} dayBreak={breaks[i]} />
        ))}
      </ChatSessionFrame>
    </div>
  )
}
