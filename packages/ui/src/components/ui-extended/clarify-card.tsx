import * as React from "react"

import { cn } from "../../lib/utils"
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireItem,
} from "../ui/questionnaire"

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

/**
 * Where the ask is in its life. `pending` waits on the reader; the rest are
 * settled and read-only. Open: a surface may name its own.
 */
export type ClarifyState =
  | "pending"
  | "answered"
  | "skipped"
  | "superseded"
  | "expired"
  | (string & {})

export interface ClarifyCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** @default "pending" */
  state?: ClarifyState
  /** The header's word while the ask waits — `confirm` for a yes-or-no. @default "question" */
  kind?: React.ReactNode
  /** Which step asked — `understand`. */
  step?: React.ReactNode
  /** How long it has been waiting — `parked 14 min`. */
  waiting?: React.ReactNode
  /** When it settled — `just now`, `2 min ago`. At the header's right, after `waiting`. */
  time?: React.ReactNode
  /** The question. One sentence. */
  question?: React.ReactNode
  /** The choices, as one Questionnaire item. Ignored when `children` is given. */
  options?: ClarifyOption[]
  value?: string
  onSelect?: (value: string) => void
  /**
   * Any other control, in place of `options` — a `Questionnaire` of several
   * steps, a form, a summary of the answers.
   */
  children?: React.ReactNode
  /** Why these options and not others, or where a default came from. */
  footnote?: React.ReactNode
  /** The confirm control. */
  actions?: React.ReactNode
  /** Which edge the actions sit on. @default "start" */
  actionsAlign?: "start" | "end"
}

export interface ClarifyFootnoteProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

/** The line under an ask: why these options, or where a default came from. *
 * @deprecated Import from `@invana/assistant`. This export leaves `@invana/ui` in the next release.
 */
export const ClarifyFootnote = React.forwardRef<HTMLParagraphElement, ClarifyFootnoteProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  ),
)
ClarifyFootnote.displayName = "ClarifyFootnote"

export interface ClarifyActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which edge the actions sit on. @default "start" */
  align?: "start" | "end"
  children?: React.ReactNode
}

/** The row of controls that answers, skips or changes an ask. *
 * @deprecated Import from `@invana/assistant`. This export leaves `@invana/ui` in the next release.
 */
export const ClarifyActions = React.forwardRef<HTMLDivElement, ClarifyActionsProps>(
  ({ align = "start", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5",
        align === "end" && "justify-end",
        className,
      )}
      {...props}
    />
  ),
)
ClarifyActions.displayName = "ClarifyActions"

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
 *
 * **One card through the ask's whole life.** `pending` offers the choice; once
 * `answered`, `skipped`, `superseded` or `expired` the header says so and the
 * body is read-only. The body is `options` for a choice, or any control passed
 * as `children` — a `Questionnaire` of several steps (with its progress and
 * Skip / Next), a form, or the answers of a finished multi-step ask.
 *
 * @deprecated Import from `@invana/assistant`. This export leaves `@invana/ui` in the next release.
 */
export const ClarifyCard = React.forwardRef<HTMLDivElement, ClarifyCardProps>(
  (
    {
      state = "pending",
      kind = "question",
      step,
      waiting,
      time,
      question,
      options,
      value,
      onSelect,
      children,
      footnote,
      actions,
      actionsAlign = "start",
      className,
      ...props
    },
    ref,
  ) => {
    const settled = state !== "pending"
    const name = React.useId()
    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "flex min-w-0 flex-col overflow-hidden border border-border bg-card",
          (state === "superseded" || state === "expired") && "opacity-75",
          className,
        )}
        {...props}
      >
        <div className="flex h-control-sm shrink-0 items-center gap-2 border-b border-border bg-chrome px-2 text-sm">
          <span className="shrink-0 font-medium">{settled ? state : kind}</span>
          {step != null ? (
            <span className="truncate text-muted-foreground">{step}</span>
          ) : null}
          <span className="flex-1" />
          {waiting != null ? (
            <span className="shrink-0 text-muted-foreground">{waiting}</span>
          ) : null}
          {time != null ? (
            <span className="shrink-0 text-muted-foreground">{time}</span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-2">
          {question != null ? <p>{question}</p> : null}

          {children ??
            (options ? (
              <Questionnaire onSubmit={(e) => e.preventDefault()}>
                <QuestionnaireItem name={name}>
                  <QuestionnaireChoices>
                    {options.map((o) => (
                      <QuestionnaireChoice
                        key={o.value}
                        value={o.value}
                        detail={o.detail}
                        disabled={o.disabled}
                        readOnly={settled}
                        checked={value === undefined ? undefined : value === o.value}
                        onChange={() => onSelect?.(o.value)}
                      >
                        <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
                      </QuestionnaireChoice>
                    ))}
                  </QuestionnaireChoices>
                </QuestionnaireItem>
              </Questionnaire>
            ) : null)}

          {footnote != null ? <ClarifyFootnote>{footnote}</ClarifyFootnote> : null}

          {actions ? <ClarifyActions align={actionsAlign}>{actions}</ClarifyActions> : null}
        </div>
      </div>
    )
  },
)
ClarifyCard.displayName = "ClarifyCard"
