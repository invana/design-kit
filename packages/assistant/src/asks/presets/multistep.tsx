import * as React from "react"
import {
  Button,
  PropertyList,
  PropertyRow,
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@invana/ui"

import { ClarifyActions } from ".."
import type { AskRendererProps } from "../../conversations/registry"
import { Placeholder } from "../../conversations/placeholder"
import type { MultistepOptions } from "../../protocol/types"

type Step = MultistepOptions["steps"][number]
type Answers = Record<string, unknown>

/** A step's own answer, as the form holds it before it is sent. */
function StepItem({ step, value }: { step: Step; value: unknown }) {
  switch (step.preset) {
    case "single":
    case "multi": {
      const multiple = step.preset === "multi"
      const chosen = (v: string) =>
        multiple ? Array.isArray(value) && value.includes(v) : value === v
      return (
        <QuestionnaireItem name={step.id} multiple={multiple}>
          <QuestionnaireTitle>{step.question}</QuestionnaireTitle>
          <QuestionnaireChoices>
            {step.options.map((o) => (
              <QuestionnaireChoice
                key={o.value}
                value={o.value}
                detail={o.detail}
                disabled={o.disabled}
                defaultChecked={chosen(o.value)}
              >
                <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
        </QuestionnaireItem>
      )
    }
    case "number":
    case "short":
    case "long":
      return (
        <QuestionnaireItem name={step.id}>
          <QuestionnaireTitle>{step.question}</QuestionnaireTitle>
          <QuestionnaireInput
            type={step.preset === "number" ? "number" : "text"}
            unit={step.preset === "number" ? step.unit : undefined}
            min={step.preset === "number" ? step.min : undefined}
            max={step.preset === "number" ? step.max : undefined}
            step={step.preset === "number" ? step.step : undefined}
            defaultValue={value == null ? undefined : String(value)}
            aria-label={step.question}
          />
        </QuestionnaireItem>
      )
    default:
      return (
        <QuestionnaireItem name={step.id}>
          <Placeholder kind="ask" preset={step.preset} options={step} />
        </QuestionnaireItem>
      )
  }
}

/** What each step's answer reads as in the settled summary. */
function answerText(step: Step, value: unknown): string {
  if (value == null || value === "") return "—"
  switch (step.preset) {
    case "single":
    case "quick":
      return step.options.find((o) => o.value === value)?.label ?? String(value)
    case "multi": {
      const values = Array.isArray(value) ? value : [value]
      return values.map((v) => step.options.find((o) => o.value === v)?.label ?? String(v)).join(", ")
    }
    case "number":
      return `${value}${step.unit ?? ""}`
    default:
      return typeof value === "object" ? JSON.stringify(value) : String(value)
  }
}

/** A step's id as the summary's label — `until` → `Until`. */
const labelOf = (id: string) => id.charAt(0).toUpperCase() + id.slice(1)

/** The form's answers, typed by each step's preset. */
function collect(steps: Step[], form: HTMLFormElement): Answers {
  const data = new FormData(form)
  const out: Answers = {}
  for (const step of steps) {
    const all = data.getAll(step.id).map(String).filter(Boolean)
    if (step.preset === "multi") out[step.id] = all
    else if (!all.length) continue
    else if (step.preset === "number") out[step.id] = Number(all[0])
    else out[step.id] = all[0]
  }
  return out
}

/**
 * Several related asks sent as one request, one step at a time with its
 * progress, Skip and Next. The value is keyed by step id.
 *
 * Answered, it settles into the answers as label/value pairs; "Change answers"
 * reopens the steps with them filled in, and sending again is a `change`, which
 * re-runs from this turn.
 */
export function MultistepAsk({ turn, options, onEvent }: AskRendererProps<"multistep">) {
  const answered = turn.state === "answered"
  const [editing, setEditing] = React.useState(false)
  const current = (turn.value ?? {}) as Answers

  if (answered && !editing) {
    return (
      <>
        <PropertyList labelWidth="auto">
          {options.steps.map((step) => (
            <PropertyRow key={step.id} label={labelOf(step.id)} mono>
              {answerText(step, current[step.id])}
            </PropertyRow>
          ))}
        </PropertyList>
        <ClarifyActions>
          <Button size="xs" variant="ghost" onClick={() => setEditing(true)}>
            Change answers
          </Button>
        </ClarifyActions>
      </>
    )
  }

  const initial = (step: Step): unknown =>
    answered ? current[step.id] : "default" in step ? step.default : undefined

  return (
    <Questionnaire
      onSubmit={(e) => {
        e.preventDefault()
        const value = collect(options.steps, e.currentTarget)
        onEvent(answered ? { type: "change", turn: turn.id, value } : { type: "reply", turn: turn.id, value })
        setEditing(false)
      }}
    >
      <QuestionnaireProgress />
      {options.steps.map((step) => (
        <StepItem key={step.id} step={step} value={initial(step)} />
      ))}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
