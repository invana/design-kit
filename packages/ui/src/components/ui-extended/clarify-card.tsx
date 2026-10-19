import * as React from "react"

import { cn } from "../../lib/utils"
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireItem,
} from "../ui/questionnaire"

export interface ClarifyOption {
  /** Stable id handed back to `onSelect`. */
  value: string
  /** The choice, in the user's terms — `Theme velocity, 5 sessions`. */
  label: React.ReactNode
  /** What picking it means, under the label — `Flights in and out, counted once each.` */
  description?: React.ReactNode
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

/** One ask of several in one card — the same fields a single ask takes. */
export interface ClarifyQuestion {
  /** The question. One sentence. */
  question?: React.ReactNode
  options?: ClarifyOption[]
  /** The picked option's value. */
  value?: string
  /** What was typed instead of picking — drawn as the chosen row when it matches no option. */
  answer?: React.ReactNode
}

export interface ClarifyCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** @default "pending" */
  state?: ClarifyState
  /**
   * `card` is a boxed panel with a header bar — a playbook, a form. `inline`
   * reads as part of a conversation: no box, a title line, the options as
   * light rows, the ones not taken dimmed once settled.
   * @default "card"
   */
  variant?: "card" | "inline"
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
  /** What was typed instead of picking — drawn as the chosen row when it matches no option. */
  answer?: React.ReactNode
  /**
   * Several asks in one card, in the order they were asked. Takes the place of
   * `question` · `options` · `value` · `answer`.
   */
  questions?: ClarifyQuestion[]
  /** A pick. `index` is the ask's position in `questions` — `0` for a single ask. */
  onSelect?: (value: string, index: number) => void
  /**
   * Answering in words: a last row under the options while the ask waits.
   * Leave it out where there is nowhere to type.
   */
  onTypeInstead?: () => void
  /** @default "Something else — let me type", or "Type your answer" with no options */
  typeInsteadLabel?: React.ReactNode
  /**
   * Settled, the card folds to its title line — `Answered · Most routes` —
   * and opens to the question and the options it was asked with.
   */
  collapsible?: boolean
  /** Open on first render. @default true while pending, false once settled */
  defaultOpen?: boolean
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
      variant = "card",
      kind = "question",
      step,
      waiting,
      time,
      question,
      options,
      value,
      answer,
      questions,
      onSelect,
      onTypeInstead,
      typeInsteadLabel,
      collapsible = false,
      defaultOpen,
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
    const inline = variant === "inline"
    const name = React.useId()
    const asks: ClarifyQuestion[] =
      questions ?? (question != null || options ? [{ question, options, value, answer }] : [])

    // Open while it waits; folded once it settles — including when it settles
    // in place, which is the moment the reader stops needing the options.
    const [open, setOpen] = React.useState(defaultOpen ?? !settled)
    const wasSettled = React.useRef(settled)
    React.useEffect(() => {
      if (settled && !wasSettled.current) setOpen(defaultOpen ?? false)
      wasSettled.current = settled
    }, [settled, defaultOpen])
    const shown = !collapsible || open

    const summary = settled ? summaryOf(asks) : null
    const title = settled && !inline ? state : kind
    const sub = inline
      ? [settled ? state : null, summary ?? step].filter((x) => x != null)
      : step != null
        ? [step]
        : []
    const chevron = collapsible ? (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-3 shrink-0 transition-transform", open && "rotate-180")}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    ) : null

    const headerContent = (
      <>
        <span className={cn("shrink-0 font-medium", inline && "first-letter:uppercase")}>
          {title}
        </span>
        {sub.length > 0 ? (
          <span className="min-w-0 truncate text-muted-foreground first-letter:uppercase">
            {sub.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 ? " · " : null}
                {part}
              </React.Fragment>
            ))}
          </span>
        ) : null}
        {inline ? chevron : <span className="flex-1" />}
        {waiting != null ? <span className="shrink-0 text-muted-foreground">{waiting}</span> : null}
        {time != null ? <span className="shrink-0 text-muted-foreground">{time}</span> : null}
        {!inline ? chevron : null}
      </>
    )
    const headerClass = inline
      ? "flex min-w-0 items-center gap-1.5 text-start"
      : "flex h-control-sm shrink-0 items-center gap-2 border-b border-border bg-chrome px-2 text-sm text-start"

    return (
      <div
        ref={ref}
        data-state={state}
        data-variant={variant}
        className={cn(
          "flex min-w-0 flex-col",
          inline ? "gap-2" : "overflow-hidden border border-border bg-card",
          (state === "superseded" || state === "expired") && "opacity-75",
          className,
        )}
        {...props}
      >
        {collapsible ? (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              headerClass,
              "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              inline && "self-start rounded-control",
            )}
          >
            {headerContent}
          </button>
        ) : (
          <div className={headerClass}>{headerContent}</div>
        )}

        {shown ? (
          <div className={cn("flex flex-1 flex-col", inline ? "gap-3" : "gap-2 p-2")}>
            {children ??
              asks.map((ask, index) => (
                <Ask
                  key={index}
                  ask={ask}
                  name={`${name}-${index}`}
                  inline={inline}
                  settled={settled}
                  onSelect={onSelect ? (v) => onSelect(v, index) : undefined}
                  onTypeInstead={onTypeInstead}
                  typeInsteadLabel={typeInsteadLabel}
                />
              ))}

            {footnote != null ? <ClarifyFootnote>{footnote}</ClarifyFootnote> : null}

            {actions ? <ClarifyActions align={actionsAlign}>{actions}</ClarifyActions> : null}
          </div>
        ) : null}
      </div>
    )
  },
)
ClarifyCard.displayName = "ClarifyCard"

/** `Most routes` for one answered ask; `3 questions` for several. */
function summaryOf(asks: ClarifyQuestion[]): React.ReactNode {
  if (asks.length > 1) return `${asks.length} questions`
  const ask = asks[0]
  if (!ask) return null
  return ask.options?.find((o) => o.value === ask.value)?.label ?? ask.answer ?? null
}

/** The value a typed answer and the type-instead row answer to — never an option's. */
const TYPED = "\u0000typed"

function Ask({
  ask,
  name,
  inline,
  settled,
  onSelect,
  onTypeInstead,
  typeInsteadLabel,
}: {
  ask: ClarifyQuestion
  name: string
  inline: boolean
  settled: boolean
  onSelect?: (value: string) => void
  onTypeInstead?: () => void
  typeInsteadLabel?: React.ReactNode
}) {
  const options = ask.options ?? []
  const picked = options.some((o) => o.value === ask.value)
  const typed = settled && !picked && ask.answer != null
  const row = (checked: boolean) =>
    cn(inline && "border-transparent", settled && !checked && "opacity-60")
  return (
    <div className="flex flex-col gap-1.5">
      {ask.question != null ? <p className={cn(inline && "font-medium")}>{ask.question}</p> : null}
      {options.length > 0 || typed || (!settled && onTypeInstead) ? (
        <Questionnaire onSubmit={(e) => e.preventDefault()}>
          <QuestionnaireItem name={name}>
            <QuestionnaireChoices>
              {options.map((o) => {
                const checked = ask.value === o.value
                return (
                  <QuestionnaireChoice
                    key={o.value}
                    value={o.value}
                    detail={o.detail}
                    disabled={o.disabled}
                    readOnly={settled}
                    checked={ask.value === undefined ? undefined : checked}
                    onChange={() => onSelect?.(o.value)}
                    className={row(checked)}
                  >
                    <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
                    {o.description != null ? (
                      <QuestionnaireChoiceDescription>{o.description}</QuestionnaireChoiceDescription>
                    ) : null}
                  </QuestionnaireChoice>
                )
              })}
              {typed ? (
                <QuestionnaireChoice value={TYPED} readOnly checked className={row(true)}>
                  <QuestionnaireChoiceTitle>{ask.answer}</QuestionnaireChoiceTitle>
                </QuestionnaireChoice>
              ) : null}
              {!settled && onTypeInstead ? (
                <QuestionnaireChoice
                  value={TYPED}
                  checked={false}
                  onChange={onTypeInstead}
                  className={row(false)}
                >
                  <QuestionnaireChoiceTitle>
                    {typeInsteadLabel ??
                      (options.length > 0 ? "Something else — let me type" : "Type your answer")}
                  </QuestionnaireChoiceTitle>
                </QuestionnaireChoice>
              ) : null}
            </QuestionnaireChoices>
          </QuestionnaireItem>
        </Questionnaire>
      ) : null}
    </div>
  )
}
