import type {
  AnalystTurn,
  AnswerTurn,
  AskTurn,
  ConversationSpec,
  TraceStep,
  Turn,
} from "../../protocol/types"
import { isLive } from "../../protocol/stream"
import { elapsedSince } from "./format"

/**
 * The view model both variants draw from. Nothing here knows a kind: it
 * reads only the protocol's own fields — roles, kinds, states, the trace —
 * so an ask or a block of your own flows through exactly like a built-in.
 */

export type AssistantTurn = AskTurn | AnswerTurn

/** A prompt and everything the assistant said back to it, in order. */
export interface Exchange {
  /** Stable across patches: the prompt's id, or the first reply's. */
  id: string
  prompt?: AnalystTurn
  replies: AssistantTurn[]
}

/** The thread as exchanges. Replies before any prompt form an exchange of their own. */
export function exchangesOf(spec: ConversationSpec): Exchange[] {
  const out: Exchange[] = []
  for (const turn of spec.turns) {
    if (turn.role === "analyst") {
      out.push({ id: turn.id, prompt: turn, replies: [] })
      continue
    }
    const last = out[out.length - 1]
    if (last) last.replies.push(turn)
    else out.push({ id: turn.id, replies: [turn] })
  }
  return out
}

export const isAnswer = (turn: Turn): turn is AnswerTurn => turn.role === "assistant" && turn.kind === "answer"
export const isAsk = (turn: Turn): turn is AskTurn => turn.role === "assistant" && turn.kind === "ask"

const ACTIVE = new Set<TraceStep["state"]>(["running", "retrying", "waiting"])

/** The step the run is on — running, retrying, or waiting on the analyst. */
export function currentStep(answer: AnswerTurn): TraceStep | undefined {
  return answer.trace?.find((s) => ACTIVE.has(s.state))
}

/** A step's time: counting up while it runs, its duration once settled. */
export function stepTime(step: TraceStep, now: number): number | undefined {
  if (step.state === "running" || step.state === "retrying") return elapsedSince(step.startedAt, now)
  return step.duration
}

/**
 * An answer's time: counting up while it runs; once settled its `duration`,
 * else the span from `startedAt` to `at`, else the sum of its steps.
 */
export function answerTime(answer: AnswerTurn, now: number): number | undefined {
  if (isLive(answer)) return elapsedSince(answer.startedAt, now)
  if (answer.duration !== undefined) return answer.duration
  if (answer.startedAt && answer.at) {
    const span = Date.parse(answer.at) - Date.parse(answer.startedAt)
    if (!Number.isNaN(span)) return span
  }
  const steps = answer.trace ?? []
  return steps.some((s) => s.duration !== undefined)
    ? steps.reduce((sum, s) => sum + (s.duration ?? 0), 0)
    : undefined
}

export type RunOutcome = "live" | "waiting" | "done" | "failed" | "stopped"

/** Where an answer's run stands, from its state and its steps. */
export function runOutcome(answer: AnswerTurn): RunOutcome {
  if (answer.state === "error") return "failed"
  if (answer.state === "stopped") return "stopped"
  if (isLive(answer)) return answer.trace?.some((s) => s.state === "waiting") ? "waiting" : "live"
  return "done"
}

/** `4 of 4 steps` — how far the run got. */
export function stepCount(answer: AnswerTurn): { done: number; total: number } {
  const steps = answer.trace ?? []
  return { done: steps.filter((s) => s.state === "done").length, total: steps.length }
}

/**
 * Whether an ask holds the thread until it is answered. The session passes
 * the registry's answer — an ask drawn in the question card does; bare
 * follow-up chips do not — so no block is named here.
 */
export type BlocksThread = (ask: AskTurn) => boolean

/** Whether an exchange is still being answered, or waits on the analyst. */
export function exchangeState(
  exchange: Exchange,
  blocks: BlocksThread = () => true,
): "running" | "waiting" | "settled" {
  let waiting = false
  for (const reply of exchange.replies) {
    if (isAsk(reply) && reply.state === "pending" && blocks(reply)) waiting = true
    if (isAnswer(reply)) {
      const outcome = runOutcome(reply)
      if (outcome === "live") return "running"
      if (outcome === "waiting") waiting = true
    }
  }
  return waiting ? "waiting" : "settled"
}

/** The counts a status bar shows: what runs, what waits, how many steps in all. */
export function threadCounts(spec: ConversationSpec, blocks?: BlocksThread) {
  let running = 0
  let waiting = 0
  let steps = 0
  for (const exchange of exchangesOf(spec)) {
    const state = exchangeState(exchange, blocks)
    if (state === "running") running++
    if (state === "waiting") waiting++
    for (const reply of exchange.replies) if (isAnswer(reply)) steps += reply.trace?.length ?? 0
  }
  return { running, waiting, steps }
}

/**
 * The words of a turn, for Copy: every string field named `text` on its
 * blocks, in order. Read by field, not by block, so a block of your own that
 * says something in `text` is copied too.
 */
export function plainText(answer: AnswerTurn): string {
  return answer.blocks
    .map((b) => (b as { text?: unknown }).text)
    .filter((t): t is string => typeof t === "string" && t.length > 0)
    .join("\n\n")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[(\d+)\]/g, "")
}

/** The DOM id a turn is drawn under, so a variant can scroll to it. */
export const turnDomId = (spec: ConversationSpec, turnId: string) => `chat-${spec.id}-${turnId}`
