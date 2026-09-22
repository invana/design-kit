import * as React from "react"

import { cn } from "../../lib/utils"

export interface ExchangeOption {
  label: React.ReactNode
  /** The one that was taken. */
  chosen?: boolean
}

export interface ExchangeRecordProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Who asked — `the agent asks`. */
  asker?: React.ReactNode
  question: React.ReactNode
  /** Why it had to ask — `parse_intent found two readings and was told not to guess`. */
  why?: React.ReactNode
  /** What it offered. Every option, with the taken one marked. */
  options?: ExchangeOption[]
  /** Who answered — `ravi answers`. */
  answerer?: React.ReactNode
  answer?: React.ReactNode
  /** What the answer cost and what happened next — `after 41.2s · the run resumed on round 2`. */
  answerNote?: React.ReactNode
}

function Bubble({
  who,
  rail,
  children,
  note,
}: {
  who?: React.ReactNode
  rail: string
  children: React.ReactNode
  note?: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1 border-l-2 px-2.5 py-2", rail)}>
      {who != null ? (
        <span className="font-mono text-xs font-semibold">{who}</span>
      ) : null}
      <span className="leading-relaxed">{children}</span>
      {note != null ? (
        <span className="text-sm text-muted-foreground">{note}</span>
      ) : null}
    </div>
  )
}

/**
 * A question a run asked a person, after it was answered.
 *
 * `ClarifyCard` is the **live** ask — it has controls, and the run is waiting on
 * them. This is the same exchange once it is a record: the question, every
 * option it offered with the one taken marked, who answered and how long the
 * run stood still. Nothing here is pickable, because the choice was made and a
 * trace is never rewritten.
 *
 * **The options that were not taken stay.** *It chose by promise date* is a
 * different fact from *it was offered two readings and chose by promise date* —
 * the second is the one that explains the round that follows.
 *
 * The rails mark the **act**, not the participant: asking is an interruption,
 * answering is what let the run continue. Which colour means `human` is a
 * palette decision and belongs to the layer components.
 */
export const ExchangeRecord = React.forwardRef<
  HTMLDivElement,
  ExchangeRecordProps
>(
  (
    {
      asker,
      question,
      why,
      options,
      answerer,
      answer,
      answerNote,
      className,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      <Bubble who={asker} rail="border-l-warning bg-warning/5" note={why}>
        {question}
      </Bubble>
      {options?.length ? (
        <ul className="flex flex-col">
          {options.map((option, index) => (
            <li
              key={index}
              className="flex items-center gap-2 border-border/55 border-t px-2.5 py-1"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2.5 shrink-0 rounded-full border-[1.5px]",
                  option.chosen
                    ? "border-primary bg-primary"
                    : "border-border bg-transparent",
                )}
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate font-mono text-sm",
                  option.chosen ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {option.label}
              </span>
              {option.chosen ? (
                <span className="shrink-0 text-xs text-primary">chosen</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {answer != null ? (
        <Bubble
          who={answerer}
          rail="border-l-primary bg-primary/5 border-t border-t-border/55"
          note={answerNote}
        >
          {answer}
        </Bubble>
      ) : null}
    </div>
  ),
)
ExchangeRecord.displayName = "ExchangeRecord"
