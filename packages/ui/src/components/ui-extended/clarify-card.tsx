import * as React from "react"

import { cn } from "../../lib/utils"

export interface ClarifyOption {
  /** Stable id handed back to `onSelect`. */
  value: string
  /** The choice, in the user's terms — `Theme velocity, 5 sessions`. */
  label: React.ReactNode
  /**
   * Where the choice comes from in the model — `Theme.velocity_5d · 14 themes`.
   *
   * This is what makes the question answerable rather than a guess: the reader
   * can see that each option is a measure the graph actually holds.
   */
  detail?: React.ReactNode
  disabled?: boolean
}

export interface ClarifyCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Which step asked — `understand`. */
  step?: React.ReactNode
  /** How long it has been waiting — `parked 14 min`. */
  waiting?: React.ReactNode
  /** The question. One sentence. */
  question: React.ReactNode
  options: ClarifyOption[]
  value?: string
  onSelect?: (value: string) => void
  /** The confirm control. */
  actions?: React.ReactNode
  /** Why these options and not others. */
  footnote?: React.ReactNode
}

/**
 * The run stopped and asked, rather than guessing.
 *
 * A thinking that cannot tell which of two measures was meant parks and asks —
 * parked, not failed. Answering resumes *that* thinking rather than starting a
 * new one, which is why this renders inline in the thread and not as a modal:
 * the question belongs to the run above it.
 *
 * **Options are declared, never generated.** Each one names a measure the model
 * holds, which is why `detail` exists and why `footnote` is worth saying out
 * loud. A card that offered invented options would undo the grounding the rest
 * of the system is built on.
 */
export const ClarifyCard = React.forwardRef<HTMLDivElement, ClarifyCardProps>(
  (
    {
      step,
      waiting,
      question,
      options,
      value,
      onSelect,
      actions,
      footnote,
      className,
      ...props
    },
    ref,
  ) => {
    const name = React.useId()
    return (
      <div
        ref={ref}
        className={cn("flex flex-col overflow-hidden border border-border bg-card", className)}
        {...props}
      >
        <div className="flex h-6 shrink-0 items-center gap-2 border-b border-border bg-muted/40 px-2 text-meta">
          <span className="shrink-0 font-medium">question</span>
          {step != null ? (
            <span className="truncate text-muted-foreground">{step}</span>
          ) : null}
          <span className="flex-1" />
          {waiting != null ? (
            <span className="shrink-0 text-muted-foreground">{waiting}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 p-2">
          <p>{question}</p>

          <div role="radiogroup" className="flex flex-col gap-1">
            {options.map((o) => {
              const checked = value === o.value
              return (
                <label
                  key={o.value}
                  className={cn(
                    "flex min-h-[30px] cursor-pointer items-center gap-2 border px-2 py-1",
                    checked ? "border-primary/40 bg-primary/10" : "border-border",
                    o.disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <input
                    type="radio"
                    name={name}
                    value={o.value}
                    checked={checked}
                    disabled={o.disabled}
                    onChange={() => onSelect?.(o.value)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                      checked ? "border-primary" : "border-muted-foreground",
                    )}
                  >
                    {checked ? (
                      <span className="size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </span>
                  <span className="flex-1 truncate">{o.label}</span>
                  {o.detail != null ? (
                    <span className="shrink-0 font-mono text-meta text-muted-foreground">
                      {o.detail}
                    </span>
                  ) : null}
                </label>
              )
            })}
          </div>

          {actions || footnote != null ? (
            <div className="flex flex-wrap items-center gap-2">
              {actions}
              {footnote != null ? (
                <span className="flex-1 text-meta text-muted-foreground">{footnote}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    )
  },
)
ClarifyCard.displayName = "ClarifyCard"
