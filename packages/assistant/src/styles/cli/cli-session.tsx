import * as React from "react"
import { cn } from "@invana/ui"

import {
  ChatSessionActivityRow,
  type ChatSessionActivityStatus,
  ChatSessionActivitySubLine,
  ChatSessionFrame,
  ChatSessionProgressLine,
  ChatSessionPromptRow,
  ChatSessionStatusBar,
  ChatSessionTaskGroup,
} from "../../conversations/thread"
import type { AnswerTurn, AskTurn } from "../../protocol/types"
import { AskView } from "../base/ask"
import { BlockStack, BlockView, OutcomeView, splitBlocks } from "../base/blocks"
import { AnswerLine, KeyHints, SessionHeader } from "../base/chrome"
import { ComposerBar } from "../base/composer"
import { useChatSessionContext } from "../base/context"
import { clockTime, formatDuration } from "../base/format"
import {
  answerTime,
  currentStep,
  exchangesOf,
  exchangeState,
  type Exchange,
  isAnswer,
  runOutcome,
  type RunOutcome,
  threadCounts,
  turnDomId,
} from "../base/model"
import { RunSummaryLine, StepList, StepRow } from "../base/steps"

const ANSWER_DOT: Record<RunOutcome, ChatSessionActivityStatus> = {
  live: "pending",
  waiting: "info",
  done: "success",
  failed: "error",
  stopped: "warning",
}

const ASK_DOT: Record<string, ChatSessionActivityStatus> = {
  pending: "info",
  answered: "success",
  skipped: "default",
  superseded: "default",
  expired: "default",
}

/** Open the reply in the chat, steps showing, and scroll to it. */
function useJump() {
  const ctx = useChatSessionContext()
  return (turnId: string) => {
    ctx.setView("chat")
    ctx.toggleSteps(turnId, true)
    ctx.scrollToTurn(turnId)
  }
}

/**
 * An answer as the console draws it: a status dot, then its blocks — every
 * one through the registry, bare, the row being the frame — its steps under
 * it while it runs and folded to one line after, what it produced, and what
 * can be done with it.
 */
function CliAnswer({ turn }: { turn: AnswerTurn }) {
  const ctx = useChatSessionContext()
  const outcome = runOutcome(turn)
  const live = outcome === "live" || outcome === "waiting"
  const { inCard, own, hasEvidence } = splitBlocks(turn, ctx.registry)
  const blocks = [...inCard, ...own]
  const step = currentStep(turn)
  const time = answerTime(turn, ctx.now)
  const showSteps = !!turn.trace?.length && (live || ctx.stepsOpen(turn.id, false))

  const body =
    live && !hasEvidence ? (
      <ChatSessionProgressLine
        className="-ml-[22px]"
        elapsed={time !== undefined ? formatDuration(time) : undefined}
        // Waiting on the analyst is not work in flight: no spinner, the ask's tone.
        spinner={outcome === "waiting" ? <span className="size-1.5 rounded-full bg-info" aria-hidden /> : undefined}
      >
        {outcome === "waiting" ? "Waiting on your answer" : step ? `${step.label}…` : "Planning…"}
      </ChatSessionProgressLine>
    ) : blocks.length ? (
      <BlockStack className="whitespace-normal">
        {blocks.map((b, i) => (
          <BlockView key={`${b.kind}-${i}`} block={b} turn={turn} registry={ctx.registry} onEvent={ctx.emit} />
        ))}
      </BlockStack>
    ) : outcome === "failed" ? (
      "The run failed."
    ) : outcome === "stopped" ? (
      "Stopped by you."
    ) : null

  return (
    <ChatSessionActivityRow
      status={ANSWER_DOT[outcome]}
      meta={!live && turn.meta ? turn.meta : undefined}
      footer={
        <>
          {live && turn.trace?.length ? <StepList turn={turn} className="pt-0.5" /> : null}
          {!live ? (
            // The run in one line, and what can be done with the answer at its right.
            <AnswerLine turn={turn}>{turn.trace?.length ? <RunSummaryLine turn={turn} /> : null}</AnswerLine>
          ) : null}
          {!live && showSteps ? <StepList turn={turn} className="pt-0.5" /> : null}
          {turn.outcome && !live ? (
            <OutcomeView
              className="mt-0.5"
              outcome={turn.outcome}
              turn={turn}
              onEvent={ctx.emit}
              tone={outcome === "failed" ? "bad" : undefined}
            />
          ) : null}
          {outcome === "stopped" ? (
            <ChatSessionActivitySubLine>Interrupted · ask again, or narrow the question</ChatSessionActivitySubLine>
          ) : null}
        </>
      }
    >
      {body}
    </ChatSessionActivityRow>
  )
}

function CliAsk({ turn }: { turn: AskTurn }) {
  const ctx = useChatSessionContext()
  return (
    <ChatSessionActivityRow status={ASK_DOT[turn.state] ?? "default"}>
      <div className="whitespace-normal">
        <AskView turn={turn} registry={ctx.registry} onEvent={ctx.emit} now={ctx.now} />
      </div>
    </ChatSessionActivityRow>
  )
}

function CliExchange({ exchange }: { exchange: Exchange }) {
  const ctx = useChatSessionContext()
  const prompt = exchange.prompt
  return (
    <div className="contents">
      {prompt ? (
        <div id={turnDomId(ctx.spec, prompt.id)} className="scroll-mt-3">
          <ChatSessionPromptRow meta={prompt.at ? <span className="tabular-nums">{clockTime(prompt.at)}</span> : undefined}>
            {prompt.text}
          </ChatSessionPromptRow>
        </div>
      ) : null}
      {exchange.replies.map((reply) => (
        <div key={reply.id} id={turnDomId(ctx.spec, reply.id)} className="min-w-0 scroll-mt-3">
          {isAnswer(reply) ? <CliAnswer turn={reply} /> : <CliAsk turn={reply} />}
        </div>
      ))}
    </div>
  )
}

const WEIGHT = { running: 0, waiting: 1, settled: 2 } as const

/**
 * Every step of every reply, grouped by prompt, newest first — what runs and
 * what waits on you float to the top. A row jumps to its reply.
 */
function CliTasks() {
  const ctx = useChatSessionContext()
  const jump = useJump()
  const blocks = (ask: AskTurn) => ctx.registry.askTraits(ask.ask.kind).frame === "card"
  const groups = exchangesOf(ctx.spec)
    .filter((e) => e.replies.some((r) => isAnswer(r) && r.trace?.length))
    .reverse()
    .sort((a, b) => WEIGHT[exchangeState(a, blocks)] - WEIGHT[exchangeState(b, blocks)])
  return (
    <>
      {groups.map((exchange) => {
        const state = exchangeState(exchange, blocks)
        const answers = exchange.replies.filter(isAnswer)
        const total = answers.reduce((sum, a) => sum + (answerTime(a, ctx.now) ?? 0), 0)
        const when = clockTime(exchange.prompt?.at)
        const said = state === "running" ? "running" : state === "waiting" ? "waiting on you" : formatDuration(total)
        return (
          <ChatSessionTaskGroup
            key={exchange.id}
            heading={
              <div className="flex justify-between gap-2">
                <span className="min-w-0 truncate" title={exchange.prompt?.text}>
                  {exchange.prompt?.text ?? ctx.spec.title}
                </span>
                <span className="shrink-0 font-normal text-muted-foreground tabular-nums">
                  {[when, said].filter(Boolean).join(" · ")}
                </span>
              </div>
            }
          >
            {answers.flatMap((a) =>
              (a.trace ?? []).map((s, i) => (
                <StepRow key={`${a.id}-${s.id ?? i}`} turn={a} step={s} detail={false} onSelect={() => jump(a.id)} />
              )),
            )}
          </ChatSessionTaskGroup>
        )
      })}
    </>
  )
}

/** While anything runs, the step it is on stays pinned above the composer. */
function PinnedSteps() {
  const ctx = useChatSessionContext()
  const jump = useJump()
  const live = ctx.spec.turns.filter(
    (t): t is AnswerTurn => isAnswer(t) && (runOutcome(t) === "live" || runOutcome(t) === "waiting"),
  )
  if (!live.length) return null
  return (
    <div className="border-b border-border px-3 py-1.5">
      {live.map((a) => {
        const step = currentStep(a) ?? a.trace?.[0]
        return step ? (
          <StepRow key={a.id} turn={a} step={step} detail={false} onSelect={() => jump(a.id)} />
        ) : null
      })}
    </div>
  )
}

export interface CliSessionProps {
  running: boolean
  onStop: () => void
  /** `true` draws the session's own header; a node is drawn in its place. */
  header: React.ReactNode
  onClose?: () => void
  emptyState?: React.ReactNode
  className?: string
}

/**
 * The console: your prompt as a caret row, every reply a status-dotted row
 * with the steps that produced it under it, the running step pinned above the
 * composer, and a status bar that switches to every step of the session.
 */
export function CliSession({ running, onStop, header, onClose, emptyState, className }: CliSessionProps) {
  const ctx = useChatSessionContext()
  const counts = threadCounts(ctx.spec, (ask) => ctx.registry.askTraits(ask.ask.kind).frame === "card")
  const tasks = ctx.view === "tasks"
  const viewButton = (target: "chat" | "tasks", label: string) => (
    <button
      type="button"
      aria-pressed={ctx.view === target}
      onClick={() => ctx.setView(target)}
      className={ctx.view === target ? "font-medium text-foreground" : "hover:text-foreground"}
    >
      {label}
    </button>
  )
  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-background", className)}>
      {header === true ? <SessionHeader onClose={onClose} /> : header || null}
      <ChatSessionFrame
        className="min-h-0 flex-1"
        autoScrollKey={`${ctx.view}-${ctx.spec.turns.length}`}
        emptyState={emptyState}
        bodyClassName={tasks ? "gap-[18px]" : undefined}
        footer={
          <div className="border-t border-border">
            {!tasks ? <PinnedSteps /> : null}
            <ComposerBar isRunning={running} onStop={onStop} />
            <ChatSessionStatusBar
              className="pt-0"
              start={
                <>
                  {viewButton("chat", "Chat")}
                  {viewButton("tasks", `Tasks (${counts.steps})`)}
                  {counts.running ? (
                    <span className="text-primary">{counts.running} running</span>
                  ) : counts.waiting ? (
                    <span className="text-warning">{counts.waiting} needs input</span>
                  ) : null}
                </>
              }
              end={ctx.spec.composer?.hints === false ? undefined : <KeyHints running={running} />}
            />
          </div>
        }
      >
        {tasks ? <CliTasks /> : exchangesOf(ctx.spec).map((e) => <CliExchange key={e.id} exchange={e} />)}
      </ChatSessionFrame>
    </div>
  )
}
