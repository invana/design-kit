import * as React from "react"
import { cn } from "@invana/ui"

import { ChatSessionMessageOptions, type ChatSessionMessageAction } from "../../conversations/thread"
import { isRunning } from "../../protocol/stream"
import type { AnswerTurn } from "../../protocol/types"
import { useChatSessionContext } from "./context"
import { plainText } from "./model"

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

/**
 * What can be done with a settled answer: run it again, copy its words, open
 * its steps, rate it. Every one is an event — `retry`, `rate` — or view state;
 * none knows what the answer's blocks are.
 */
export function AnswerActions({ turn }: { turn: AnswerTurn }) {
  const ctx = useChatSessionContext()
  const running = isRunning(ctx.spec)
  const rating = ctx.rating(turn.id) ?? turn.rating
  const text = plainText(turn)
  const rate = (value: number) => {
    const next = rating === value ? 0 : value
    ctx.rate(turn.id, next)
    ctx.emit({ type: "rate", turn: turn.id, value: next })
  }
  const actions: ChatSessionMessageAction[] = [
    {
      icon: ctx.icons.retry,
      label: "Run again",
      disabled: running,
      onClick: () => ctx.emit({ type: "retry", turn: turn.id }),
    },
    ...(text
      ? [{ icon: ctx.icons.copy, label: "Copy", onClick: () => void navigator.clipboard?.writeText(text) }]
      : []),
    ...(turn.trace?.length
      ? [
          {
            icon: ctx.icons.steps,
            label: "Steps",
            active: ctx.stepsOpen(turn.id, false),
            onClick: () => ctx.toggleSteps(turn.id),
          },
        ]
      : []),
    ...(turn.state === "complete" || turn.state === "partial"
      ? [
          {
            icon: ctx.icons.rateUp,
            label: "Good answer",
            align: "end" as const,
            active: rating === 1,
            activeClassName: "text-success hover:text-success",
            onClick: () => rate(1),
          },
          {
            icon: ctx.icons.rateDown,
            label: "Not what I wanted",
            align: "end" as const,
            active: rating === -1,
            activeClassName: "text-destructive hover:text-destructive",
            onClick: () => rate(-1),
          },
        ]
      : []),
  ]
  return <ChatSessionMessageOptions actions={actions} />
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
