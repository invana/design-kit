import * as React from "react"
import {
  Button,
  PropertyList,
  PropertyRow,
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireProgressBar,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@invana/ui"

import { Placeholder } from "../placeholder"
import type { BlockProps, MultistepOptions } from "../types"
import { strong } from "../prose"
import { AskHint, AskLink, AskSummary, choiceParts, joinPicks } from "../parts/ask"

type Step = MultistepOptions["steps"][number]
type Answers = Record<string, unknown>
type Status = "unanswered" | "answered" | "skipped"

/** A step's question: always a heading, its description under it. */
function StepTitle({ step }: { step: Step }) {
  if (!("question" in step)) return null
  return (
    <>
      <QuestionnaireTitle className="font-semibold">{strong(step.question ?? "")}</QuestionnaireTitle>
      {"description" in step && step.description ? (
        <QuestionnaireDescription>{step.description}</QuestionnaireDescription>
      ) : null}
    </>
  )
}

/** A step's own answer, as the form holds it before it is sent. */
function StepItem({
  step,
  value,
  onStatusChange,
}: {
  step: Step
  value: unknown
  onStatusChange: (status: Status) => void
}) {
  const item = { name: step.id, required: step.required, onStatusChange }
  switch (step.kind) {
    case "single":
    case "multi": {
      const multiple = step.kind === "multi"
      const chosen = (v: string) =>
        multiple ? Array.isArray(value) && value.includes(v) : value === v
      return (
        <QuestionnaireItem {...item} multiple={multiple}>
          <StepTitle step={step} />
          <QuestionnaireChoices>
            {step.options.map((o) => {
              const { props, body } = choiceParts(o)
              return (
                <QuestionnaireChoice
                  key={o.value}
                  value={o.value}
                  {...props}
                  disabled={o.disabled}
                  defaultChecked={chosen(o.value)}
                >
                  {body}
                </QuestionnaireChoice>
              )
            })}
          </QuestionnaireChoices>
        </QuestionnaireItem>
      )
    }
    case "number":
    case "short":
    case "long":
      return (
        <QuestionnaireItem {...item}>
          <StepTitle step={step} />
          <QuestionnaireInput
            type={step.kind === "number" ? "number" : "text"}
            unit={step.kind === "number" ? step.unit : undefined}
            min={step.kind === "number" ? step.min : undefined}
            max={step.kind === "number" ? step.max : undefined}
            step={step.kind === "number" ? step.step : undefined}
            defaultValue={value == null ? undefined : String(value)}
            aria-label={step.question}
          />
          {"hint" in step ? <AskHint>{step.hint}</AskHint> : null}
        </QuestionnaireItem>
      )
    default:
      return (
        <QuestionnaireItem {...item}>
          <Placeholder kind={step.kind} options={step} />
        </QuestionnaireItem>
      )
  }
}

/** A number as the summary reads it — `2,200 kg/ha`, `55%`. */
function numberText(value: unknown, unit?: string) {
  const n = typeof value === "number" ? value : Number(value)
  const text = Number.isFinite(n) ? n.toLocaleString("en-GB") : String(value)
  if (!unit) return text
  return /^[A-Za-z]/.test(unit) ? `${text} ${unit}` : `${text}${unit}`
}

/** What each step's answer reads as in the review and the settled summary. */
function answerText(step: Step, value: unknown): string {
  if (value == null || value === "" || (Array.isArray(value) && !value.length)) return "—"
  switch (step.kind) {
    case "single":
    case "quick": {
      const o = step.options.find((x) => x.value === value)
      return o ? (("summary" in o && o.summary) || o.label) : String(value)
    }
    case "multi": {
      const values = Array.isArray(value) ? value : [value]
      return joinPicks(values.map((v) => step.options.find((x) => x.value === v) ?? { value: String(v), label: String(v) }))
    }
    case "number":
      return numberText(value, step.unit)
    default:
      return typeof value === "object" ? JSON.stringify(value) : String(value)
  }
}

/** A step's name in a summary: its `label`, else its id — `until` → `Until`. */
const labelOf = (step: Step) =>
  ("label" in step && step.label) || step.id.charAt(0).toUpperCase() + step.id.slice(1)

/** The form's answers, typed by each step's block. */
function collect(steps: Step[], form: HTMLFormElement): Answers {
  const data = new FormData(form)
  const out: Answers = {}
  for (const step of steps) {
    const all = data.getAll(step.id).map(String).filter(Boolean)
    if (step.kind === "multi") out[step.id] = all
    else if (!all.length) continue
    else if (step.kind === "number") out[step.id] = Number(all[0])
    else out[step.id] = all[0]
  }
  return out
}

/**
 * Several related asks sent as one request, one step at a time with its
 * progress. Skip is offered on a step that is not `required` and not the
 * last; a required step holds Next back, saying why, until it is answered.
 * With `review`, the last step leads to the answers laid out once more, each
 * with Edit, before they are sent. The value is keyed by step id.
 *
 * Answered, it settles into the answers as label/value pairs; Change answers
 * reopens the steps with them filled in, and sending again is a `change`,
 * which re-runs from this turn.
 */
export function MultistepAsk({ spec, state = "pending", value: given, onAction }: BlockProps<"multistep">) {
  const pending = state === "pending"
  const [editing, setEditing] = React.useState(false)
  const steps = spec.steps
  const [item, setItem] = React.useState(steps[0]?.id ?? "")
  // A step that arrives with a default is answered before anything is touched.
  const [status, setStatus] = React.useState<Record<string, Status>>(() =>
    Object.fromEntries(
      steps.filter((s) => "default" in s && s.default != null).map((s) => [s.id, "answered" as Status]),
    ),
  )
  const [review, setReview] = React.useState<Answers | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const current = (given ?? {}) as Answers

  if (!pending && !editing) {
    return (
      <AskSummary
        rows={steps.map((step) => ({ label: labelOf(step), value: answerText(step, current[step.id]) }))}
        change={state === "answered" ? "Change answers" : undefined}
        onChange={() => setEditing(true)}
      />
    )
  }

  const send = (value: Answers) => {
    onAction?.(editing ? "change" : "reply", value)
    setEditing(false)
    setReview(null)
  }
  const initial = (step: Step): unknown =>
    editing ? current[step.id] : "default" in step ? step.default : undefined

  const index = Math.max(0, steps.findIndex((s) => s.id === item))
  const step = steps[index]
  const last = index === steps.length - 1
  const blocked = Boolean(step?.required && status[step.id] !== "answered")

  return (
    <>
      <Questionnaire
        ref={formRef}
        item={item}
        onItemChange={setItem}
        hidden={review != null}
        onSubmit={(e) => {
          e.preventDefault()
          send(collect(steps, e.currentTarget))
        }}
      >
        <QuestionnaireProgress />
        {steps.map((s) => (
          <StepItem
            key={s.id}
            step={s}
            value={initial(s)}
            onStatusChange={(st) => setStatus((now) => ({ ...now, [s.id]: st }))}
          />
        ))}
        {blocked ? <AskHint tone="error">Pick one to continue · this step is required</AskHint> : null}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          {!last && !step?.required ? <QuestionnaireSkip /> : null}
          <QuestionnaireNext disabled={blocked} />
          {last && spec.review ? (
            <Button
              type="button"
              size="xs"
              className="col-start-3 row-start-1 justify-self-end"
              disabled={blocked}
              onClick={() => formRef.current && setReview(collect(steps, formRef.current))}
            >
              Review
            </Button>
          ) : (
            <QuestionnaireSubmit disabled={blocked} />
          )}
        </QuestionnaireActions>
      </Questionnaire>
      {review ? (
        <>
          <QuestionnaireProgressBar label="Review" value={1} />
          <PropertyList labelWidth="auto" variant="summary">
            {steps.map((s) => (
              <PropertyRow key={s.id} label={labelOf(s)} mono>
                <span className="flex items-baseline gap-2">
                  <span className="min-w-0 flex-1">{answerText(s, review[s.id])}</span>
                  <AskLink
                    onClick={() => {
                      setItem(s.id)
                      setReview(null)
                    }}
                  >
                    Edit
                  </AskLink>
                </span>
              </PropertyRow>
            ))}
          </PropertyList>
          <QuestionnaireActions>
            <Button type="button" size="xs" variant="outline" className="justify-self-start" onClick={() => setReview(null)}>
              Previous
            </Button>
            <Button type="button" size="xs" className="col-start-3 justify-self-end" onClick={() => send(review)}>
              {`Submit ${steps.length} answers`}
            </Button>
          </QuestionnaireActions>
        </>
      ) : null}
    </>
  )
}
