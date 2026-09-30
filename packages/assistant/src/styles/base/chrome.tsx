import * as React from "react"
import { cn } from "@invana/ui"

import { ChatSessionMessageOptions, type ChatSessionMessageAction } from "../../conversations/thread"
import type { AnswerTurn } from "../../protocol/types"
import type { ChatSessionBuiltInAction } from "../types"
import { useChatSessionContext } from "./context"
import { isAnswer, plainText, runOutcome } from "./model"

/** The session's title bar: what the thread is about, how long it is, and close. */
export function SessionHeader({ onClose, className }: { onClose?: () => void; className?: string }) {
  const ctx = useChatSessionContext()
  const prompts = ctx.spec.turns.filter((t) => t.role === "analyst").length
  return (
    <div className={cn("flex h-[34px] shrink-0 items-center gap-2 border-b border-border px-3", className)}>
      <span className="min-w-0 truncate font-medium">{ctx.spec.title}</span>
      {prompts ? (
        <span className="shrink-0 text-muted-foreground tabular-nums">
          · {prompts} {prompts === 1 ? "question" : "questions"}
        </span>
      ) : null}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the session"
          title="Close"
          className="ml-auto inline-flex size-[22px] shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {ctx.icons.close}
        </button>
      ) : null}
    </div>
  )
}

const SETTLED_RATEABLE = new Set(["complete", "partial"])

/**
 * The actions beside a settled answer's time, at the right of its line: the
 * ones the session's `actions` prop names, in its order. Every one is an
 * event — `retry`, `copy`, `toggle-steps`, `rate`, or `action` for your own —
 * so a host hears each through its callback; none knows what the answer's
 * blocks are.
 */
export function AnswerActions({ turn }: { turn: AnswerTurn }) {
  const ctx = useChatSessionContext()
  const running = ctx.spec.turns.some((t) => isAnswer(t) && runOutcome(t) === "live")
  const rating = ctx.rating(turn.id) ?? turn.rating
  const text = plainText(turn)
  const rate = (value: number) => {
    const next = rating === value ? 0 : value
    ctx.rate(turn.id, next)
    ctx.emit({ type: "rate", turn: turn.id, value: next })
  }
  const built: Record<ChatSessionBuiltInAction, () => ChatSessionMessageAction[]> = {
    retry: () => [
      {
        icon: ctx.icons.retry,
        label: "Run again",
        disabled: running,
        onClick: () => ctx.emit({ type: "retry", turn: turn.id }),
      },
    ],
    copy: () =>
      text
        ? [
            {
              icon: ctx.icons.copy,
              label: "Copy",
              onClick: () => {
                void navigator.clipboard?.writeText(text)
                ctx.emit({ type: "copy", turn: turn.id, text })
              },
            },
          ]
        : [],
    steps: () => {
      if (!turn.trace?.length) return []
      const open = ctx.stepsOpen(turn.id, false)
      return [{ icon: ctx.icons.steps, label: "Steps", active: open, onClick: () => ctx.setSteps(turn.id, !open) }]
    },
    rate: () =>
      SETTLED_RATEABLE.has(turn.state)
        ? [
            {
              icon: ctx.icons.rateUp,
              label: "Good answer",
              active: rating === 1,
              activeClassName: "text-success hover:text-success",
              onClick: () => rate(1),
            },
            {
              icon: ctx.icons.rateDown,
              label: "Not what I wanted",
              active: rating === -1,
              activeClassName: "text-destructive hover:text-destructive",
              onClick: () => rate(-1),
            },
          ]
        : [],
  }
  const actions = ctx.actions.flatMap((a): ChatSessionMessageAction[] =>
    typeof a === "string"
      ? built[a]()
      : !a.states || a.states.includes(turn.state)
        ? [{ icon: a.icon, label: a.label, onClick: () => ctx.emit({ type: "action", turn: turn.id, action: a.id }) }]
        : [],
  )
  if (!actions.length) return null
  // All at the end: the row's start is the answer's time. Small and quiet — they
  // sit on a line of metadata, not beside the answer's words; whatever size the
  // host's icons are, they draw at 11px, and come up to full strength on hover.
  return (
    <ChatSessionMessageOptions
      actions={actions.map((a) => ({
        ...a,
        align: "end",
        className: cn(
          "size-5 hover:bg-transparent [&_svg]:!size-[11px]",
          !a.active && "text-muted-foreground/60 hover:text-foreground",
        ),
      }))}
    />
  )
}

/** A settled answer's line: what it says at the left, its actions at the right. */
export function AnswerLine({ turn, children }: { turn: AnswerTurn; children?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {children ? <div className="min-w-0 shrink truncate">{children}</div> : null}
      <div className="min-w-0 flex-1">
        <AnswerActions turn={turn} />
      </div>
    </div>
  )
}

/** The keys that work now: send and newline, or stop while a run is in flight. */
export function KeyHints({ running }: { running: boolean }) {
  return running ? (
    <>
      <span>esc stop</span>
    </>
  ) : (
    <>
      <span>↵ send</span>
      <span>⇧↵ newline</span>
    </>
  )
}

/** Esc stops the run from anywhere on the page, as in a console. */
export function useStopKey(running: boolean, stop: () => void) {
  React.useEffect(() => {
    if (!running) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return
      e.preventDefault()
      stop()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [running, stop])
}
