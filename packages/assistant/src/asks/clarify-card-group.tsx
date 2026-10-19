import * as React from "react"
import {
  Button,
  ClarifyCard,
  type ClarifyQuestion,
  type ClarifyState,
  cn,
  NavItems,
  type NavItemConfig,
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireChoiceTitle,
  QuestionnaireInput,
  QuestionnaireItem,
} from "@invana/ui"

/** One question of the group — a `ClarifyQuestion` with the name its answer is keyed by. */
export interface ClarifyGroupQuestion extends ClarifyQuestion {
  /** The answer's key in `onSubmit` — `measure`. */
  name: string
  /** The tab's label, a word or two — `Measure`. Falls back to `Q1`, `Q2`, … */
  title?: React.ReactNode
  /** Submit waits for it. @default true */
  required?: boolean
}

/** What was answered, keyed by question name: an option's value, or the words typed. */
export type ClarifyAnswers = Record<string, string>

export interface ClarifyCardGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit" | "onSelect"> {
  /** @default "pending" */
  state?: ClarifyState
  /** The title line's word. @default "questions" */
  kind?: React.ReactNode
  /** Which step asked — `understand`. */
  step?: React.ReactNode
  /** Two to four questions asked together, in order. */
  questions: ClarifyGroupQuestion[]
  /**
   * The answers. While pending, the ones already given — the group opens on
   * the first question still open. Settled, what was sent.
   */
  answers?: ClarifyAnswers
  /** Every answer, once the required ones are in. */
  onSubmit?: (answers: ClarifyAnswers) => void
  /** @default "Or type your own" */
  typePlaceholder?: string
  /** Settled, the summary folds and opens to the questions with their answers. @default true */
  collapsible?: boolean
  /** Settled only: open on first render. @default false */
  defaultOpen?: boolean
}

/** The tick a tab wears once its question has an answer. */
function Answered(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

/**
 * Several questions asked at once, one tab each.
 *
 * While pending, the tabs say which questions have an answer; picking an
 * option moves on to the next open one, and the words typed under the options
 * are an answer too. Submit sends them all together once the required ones
 * are in — one round, one wait, rather than a question per round.
 *
 * Settled, it is the inline `ClarifyCard` of the same questions: folded to
 * `Answered · 3 questions`, opening to each question with its answer chosen
 * and the options not taken dimmed.
 */
export const ClarifyCardGroup = React.forwardRef<HTMLDivElement, ClarifyCardGroupProps>(
  (
    {
      state = "pending",
      kind = "questions",
      step,
      questions,
      answers: given,
      onSubmit,
      typePlaceholder = "Or type your own",
      collapsible = true,
      defaultOpen = false,
      className,
      ...props
    },
    ref,
  ) => {
    const settled = state !== "pending"
    const [answers, setAnswers] = React.useState<ClarifyAnswers>(given ?? {})
    const isAnswered = (q: ClarifyGroupQuestion) => !!answers[q.name]?.trim()
    const [active, setActive] = React.useState(
      () => (questions.find((q) => !given?.[q.name]) ?? questions[0])?.name ?? "",
    )

    if (settled) {
      return (
        <ClarifyCard
          ref={ref}
          variant="inline"
          state={state}
          kind={kind}
          step={step}
          collapsible={collapsible}
          defaultOpen={defaultOpen}
          className={className}
          questions={questions.map((q) => {
            const a = given?.[q.name]
            const picked = q.options?.some((o) => o.value === a)
            return { ...q, value: picked ? a : undefined, answer: picked ? undefined : a }
          })}
          {...props}
        />
      )
    }

    const index = Math.max(
      0,
      questions.findIndex((q) => q.name === active),
    )
    const current = questions[index]
    const answeredCount = questions.filter(isAnswered).length
    const ready = questions.every((q) => q.required === false || isAnswered(q))
    const last = index === questions.length - 1

    const answer = (name: string, value: string, advance: boolean) => {
      const next = { ...answers, [name]: value }
      setAnswers(next)
      if (!advance) return
      // On to the next question still open, after this one first.
      const after = [...questions.slice(index + 1), ...questions.slice(0, index)]
      const open = after.find((q) => !next[q.name]?.trim())
      if (open) setActive(open.name)
    }

    const tabs: NavItemConfig[] = questions.map((q, i) => ({
      key: q.name,
      name: typeof q.title === "string" ? q.title : `Question ${i + 1}`,
      label: q.title ?? `Q${i + 1}`,
      icon: isAnswered(q) ? Answered : undefined,
      iconClassName: "size-3 text-primary",
    }))

    const typed = current
      ? !current.options?.some((o) => o.value === answers[current.name])
      : false

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn("flex min-w-0 flex-col gap-2", className)}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 font-medium first-letter:uppercase">{kind}</span>
          <span className="min-w-0 truncate text-muted-foreground first-letter:uppercase">
            {step != null ? (
              <>
                {step}
                {" · "}
              </>
            ) : null}
            {answeredCount} of {questions.length} answered
          </span>
        </div>

        <NavItems
          items={tabs}
          selectionMode="tabs"
          variant="underline"
          overflow
          activeKey={current?.name}
          onActiveChange={setActive}
          className="border-b border-border"
        />

        {current ? (
          <div className="flex flex-col gap-1.5">
            {current.question != null ? <p className="font-medium">{current.question}</p> : null}
            <Questionnaire onSubmit={(e) => e.preventDefault()}>
              <QuestionnaireItem name={current.name}>
                {current.options?.length ? (
                  <QuestionnaireChoices>
                    {current.options.map((o) => {
                      const checked = answers[current.name] === o.value
                      return (
                        <QuestionnaireChoice
                          key={o.value}
                          value={o.value}
                          detail={o.detail}
                          disabled={o.disabled}
                          checked={checked}
                          onChange={() => answer(current.name, o.value, true)}
                          className="border-transparent"
                        >
                          <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
                          {o.description != null ? (
                            <QuestionnaireChoiceDescription>{o.description}</QuestionnaireChoiceDescription>
                          ) : null}
                        </QuestionnaireChoice>
                      )
                    })}
                  </QuestionnaireChoices>
                ) : null}
                <QuestionnaireInput
                  aria-label={`${typeof current.title === "string" ? current.title : "Answer"} — your own words`}
                  placeholder={current.options?.length ? typePlaceholder : "Type your answer"}
                  value={typed ? (answers[current.name] ?? "") : ""}
                  onChange={(e) => answer(current.name, e.currentTarget.value, false)}
                />
              </QuestionnaireItem>
            </Questionnaire>
          </div>
        ) : null}

        <div className="flex items-center gap-1.5">
          <Button
            size="xs"
            variant="ghost"
            disabled={index === 0}
            onClick={() => setActive(questions[index - 1]?.name ?? active)}
          >
            Back
          </Button>
          <span className="flex-1" />
          {!last ? (
            <Button size="xs" variant="outline" onClick={() => setActive(questions[index + 1]?.name ?? active)}>
              Next
            </Button>
          ) : null}
          <Button size="xs" disabled={!ready} onClick={() => onSubmit?.(answers)}>
            Submit
          </Button>
        </div>
      </div>
    )
  },
)
ClarifyCardGroup.displayName = "ClarifyCardGroup"
