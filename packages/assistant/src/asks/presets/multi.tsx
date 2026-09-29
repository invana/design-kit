import * as React from "react"
import {
  Button,
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@invana/ui"

import { ClarifyActions, ClarifyFootnote } from ".."
import type { AskRendererProps } from "../../conversations/registry"

/**
 * Several choices from a list the data model holds — filters, or the
 * assumptions an analysis will make, where the one left off says why in its
 * `note`. The defaults arrive ticked; `min` holds the submit back until enough
 * are, and at `max` the rest stop being offered. Submit, labelled from the
 * question and the count, sends the ticked values as a `reply`, in the ask's
 * order.
 *
 * Once answered the ticks stay drawn, read-only, beside the ones not taken.
 */
/**
 * The submit label, from the question and the count ticked. A prompt that is a
 * phrase — `Adjust for` — is already the verb: `Adjust for 4`. A question —
 * `Who should receive it?` — is not, so it says what is being sent: `Use 2 selected`.
 */
function submitLabel(question: string, count: number) {
  const q = question.trim()
  return q.endsWith("?") ? `Use ${count} selected` : `${q} ${count}`
}

export function MultiAsk({ turn, options, onEvent }: AskRendererProps<"multi">) {
  const answered = turn.state !== "pending"
  const [picked, setPicked] = React.useState<string[]>(options.default ?? [])
  const value = answered ? ((turn.value as string[] | undefined) ?? []) : picked
  const id = React.useId()
  const full = options.max != null && value.length >= options.max
  const short = options.min != null && value.length < options.min

  const toggle = (v: string) =>
    setPicked((now) => (now.includes(v) ? now.filter((x) => x !== v) : [...now, v]))

  return (
    <>
      <Questionnaire
        id={id}
        onSubmit={(e) => {
          e.preventDefault()
          if (short) return
          const ordered = options.options.map((o) => o.value).filter((v) => value.includes(v))
          onEvent({ type: "reply", turn: turn.id, value: ordered })
        }}
      >
        <QuestionnaireItem name={turn.id} multiple>
          <QuestionnaireTitle>{options.question}</QuestionnaireTitle>
          <QuestionnaireChoices>
            {options.options.map((o) => {
              const checked = value.includes(o.value)
              return (
                <QuestionnaireChoice
                  key={o.value}
                  value={o.value}
                  detail={o.note ?? o.detail}
                  disabled={o.disabled || (full && !checked)}
                  readOnly={answered}
                  checked={checked}
                  onChange={() => toggle(o.value)}
                >
                  <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
                </QuestionnaireChoice>
              )
            })}
          </QuestionnaireChoices>
        </QuestionnaireItem>
      </Questionnaire>
      {options.hint ? <ClarifyFootnote>{options.hint}</ClarifyFootnote> : null}
      {answered ? null : (
        <ClarifyActions>
          <Button type="submit" form={id} size="xs" disabled={short}>
            {submitLabel(options.question, value.length)}
          </Button>
        </ClarifyActions>
      )}
    </>
  )
}
