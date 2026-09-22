import * as React from "react"

import { cn } from "../../lib/utils"
import { StatusDot, type StatusDotProps } from "../ui/status-dot"

/**
 * How a run or a step ended, as the engine writes it — **suggestions, not a
 * limit.** An unknown status still renders: it says its own name, in the
 * neutral.
 */
export type KnownRunStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "cannot_answer"
  | "awaiting_approval"
  | "skipped"
  | "held"
  | "purged"

export type RunStatus = KnownRunStatus | (string & {})

/**
 * Which tone each status is read in.
 *
 * The kit owns this map where it does **not** own a layer's or a bound's
 * colour, and the difference is real: a layer is a product's vocabulary, while
 * *finished · finished but look at it · failed · not started* is the same small
 * set of states every surface in the system already draws with `StatusDot`. Two
 * maps for one idea is how a journal row and its own pagehead come to disagree.
 *
 * **`succeeded` and `cannot_answer` are deliberately different tones.** The
 * machinery succeeded; the reading is that the graph cannot answer inside this
 * world. A run that says both in one green word would be hiding the only fact
 * the reader needs ([SR53]).
 */
const TONE: Record<string, StatusDotProps["tone"]> = {
  queued: "queued",
  running: "running",
  succeeded: "success",
  failed: "error",
  cancelled: "muted",
  cannot_answer: "warning",
  awaiting_approval: "warning",
  skipped: "muted",
  held: "muted",
  purged: "muted",
}

/**
 * The same tone, as **type**.
 *
 * `running` is the one entry that is not its dot's token, and the reason is
 * that a dot says *in flight* with motion where a word cannot. In most themes
 * `primary` and `success` are near neighbours — they are in this one — so a
 * status column that wrote both in the same green would be telling a reader
 * nothing at a glance. In type, *in flight* takes the info token; beside a dot,
 * the dot still pulses.
 */
const TEXT: Record<NonNullable<StatusDotProps["tone"]>, string> = {
  running: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info",
  queued: "text-muted-foreground",
  muted: "text-muted-foreground",
}

export interface RunStatusTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  status: RunStatus
  /** Overrides the tone {@link RunStatus} resolves to. */
  tone?: StatusDotProps["tone"]
  /** Draw the dot before the word. Off in a table cell, on in a row. */
  dot?: boolean
  /** What to call it, when the engine's own word is not what this surface says. */
  label?: React.ReactNode
}

/**
 * A run's outcome, in its tone and in the engine's own word.
 *
 * `succeeded` · `running` · `cannot_answer` · `awaiting_approval` — written as
 * the record writes them, underscores and all, because these are the values a
 * reader filters on and quotes into a support thread. Prettifying them here
 * would mean the word on screen is not the word in the API.
 *
 * The word is always present, so colour is never the only carrier of the state.
 */
export const RunStatusText = React.forwardRef<
  HTMLSpanElement,
  RunStatusTextProps
>(({ status, tone, dot, label, className, ...props }, ref) => {
  const resolved = tone ?? TONE[status] ?? "muted"
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5",
        TEXT[resolved],
        className,
      )}
      {...props}
    >
      {dot ? <StatusDot tone={resolved} /> : null}
      <span className="truncate">{label ?? status}</span>
    </span>
  )
})
RunStatusText.displayName = "RunStatusText"

export { TONE as runStatusTones }
