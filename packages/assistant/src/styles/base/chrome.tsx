import * as React from "react"
import { cn } from "@invana/ui"

import type { AnswerTurn } from "../../protocol/types"
import type { ChatSessionBuiltInAction } from "../types"
import { useChatSessionContext } from "./context"
import { isAnswer, plainText, runOutcome } from "./model"

const HEADER_BUTTON =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground"

/**
 * The session's title bar: what the thread is about and, on a wide panel, the
 * World it reads; at the right History (one step back, to the list of
 * conversations), New and close — each drawn only when the host handles it
 * (`onHistory`, `onNewConversation`, `onClose`).
 */
export function SessionHeader({ onClose, className }: { onClose?: () => void; className?: string }) {
  const ctx = useChatSessionContext()
  const world = ctx.spec.access?.kind === "world" ? ctx.spec.access.label : undefined
  return (
    <header
      className={cn(
        "flex h-10 shrink-0 items-center gap-2 border-b border-border pr-3 pl-3 @md:pl-6",
        className,
      )}
    >
      <span aria-hidden className="inline-flex shrink-0 [&_svg]:size-3.5">
        {ctx.icons.session}
      </span>
      <span className="min-w-0 truncate font-semibold">{ctx.spec.title}</span>
      {world ? <span className="hidden shrink-0 text-sm text-muted-foreground @md:inline">World · {world}</span> : null}
      <span className="ml-auto flex shrink-0 items-center gap-0.5">
        {ctx.canHistory ? (
          <button
            type="button"
            onClick={() => ctx.emit({ type: "history" })}
            aria-label="History"
            title="History"
            className={HEADER_BUTTON}
          >
            {ctx.icons.history}
          </button>
        ) : null}
        {ctx.canNew ? (
          <button
            type="button"
            onClick={() => ctx.emit({ type: "new-conversation" })}
            aria-label="New conversation"
            title="New conversation"
            className={HEADER_BUTTON}
          >
            {ctx.icons.newChat}
          </button>
        ) : null}
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Close the session" title="Close" className={HEADER_BUTTON}>
            {ctx.icons.close}
          </button>
        ) : null}
      </span>
    </header>
  )
}

/** One action beside a settled answer. */
interface AnswerAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
  activeClassName?: string
  disabled?: boolean
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
  const built: Record<ChatSessionBuiltInAction, () => AnswerAction[]> = {
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
      return [{ icon: ctx.icons.steps, label: "Open every step", active: open, onClick: () => ctx.setSteps(turn.id, !open) }]
    },
    report: () => {
      if (!turn.report && !(ctx.opensRuns && turn.trace?.length)) return []
      const open = ctx.reportOpen(turn.id)
      return [
        {
          icon: ctx.icons.report,
          label: "Run report",
          active: open,
          onClick: () => {
            if (turn.report) ctx.toggleReport(turn.id, !open)
            if (ctx.opensRuns) ctx.emit({ type: "open-run", turn: turn.id })
          },
        },
      ]
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
  const actions = ctx.actions.flatMap((a): AnswerAction[] =>
    typeof a === "string"
      ? built[a]()
      : !a.states || a.states.includes(turn.state)
        ? [{ icon: a.icon, label: a.label, onClick: () => ctx.emit({ type: "action", turn: turn.id, action: a.id }) }]
        : [],
  )
  if (!actions.length) return null
  // Square toggles at the line's end; a pressed one is lit.
  return (
    <span className="ml-auto flex shrink-0 items-center gap-2">
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          aria-label={a.label}
          title={a.label}
          aria-pressed={a.active === undefined ? undefined : a.active}
          disabled={a.disabled}
          onClick={a.onClick}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-control border text-foreground disabled:opacity-50 [&_svg]:size-[15px]",
            a.active ? cn("border-primary bg-secondary", a.activeClassName) : "border-border hover:bg-accent",
          )}
        >
          {a.icon}
        </button>
      ))}
    </span>
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
