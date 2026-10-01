import * as React from "react"
import {
  Button,
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@invana/ui"

import { ClarifyActions } from ".."
import type { AskRendererProps } from "../../conversations/registry"
import { AskHint, AskSummary, choiceParts, isHeading, pickText } from "../parts"
import { strong } from "@invana/blocks"

/** The value an “Other…” pick holds until its words are typed. */
const OTHER = "\u0000other"

/**
 * One choice from a list the data model holds. Picking an option is the reply,
 * so the default is one keypress away — unless the ask names a `submit`, when
 * the pick waits for that button (and Skip, when `skippable`). An option can
 * carry a description under its label, a lead tag or icon before it, and a
 * figure on the right. With `other`, an “Other…” choice opens a field for the
 * analyst's own words, sent with Use this.
 *
 * Answered, it settles into one label/value pair; Change answer reopens it,
 * and picking again is a `change`.
 */
export function SingleAsk({ turn, options, onEvent }: AskRendererProps<"single">) {
  const pending = turn.state === "pending"
  const [editing, setEditing] = React.useState(false)
  const [picked, setPicked] = React.useState<string | undefined>(options.default)
  const settledValue = (turn.value as string | undefined) ?? options.default

  if (!pending && !editing) {
    const option = options.options.find((o) => o.value === settledValue)
    return (
      <AskSummary
        rows={[{ label: options.label ?? "Answer", value: pickText(option, settledValue) }]}
        change={turn.state === "answered" ? "Change answer" : undefined}
        onChange={() => setEditing(true)}
      />
    )
  }

  const send = (value: string) => {
    onEvent(editing ? { type: "change", turn: turn.id, value } : { type: "reply", turn: turn.id, value })
    setEditing(false)
  }
  const pick = (value: string) => {
    setPicked(value)
    if (value !== OTHER && !options.submit) send(value)
  }

  const other = picked === OTHER
  const buttons = options.submit || options.skippable || other

  return (
    <>
      <Questionnaire
        onSubmit={(e) => {
          e.preventDefault()
          if (other) {
            // The item holds the Other pick and the typed words under one name.
            const text = new FormData(e.currentTarget).getAll(turn.id).map(String).find((v) => v !== OTHER)
            if (text?.trim()) send(text.trim())
          } else if (picked) send(picked)
        }}
        id={`${turn.id}-form`}
      >
        <QuestionnaireItem name={turn.id}>
          <QuestionnaireTitle className={isHeading(options) ? "font-semibold" : undefined}>
            {strong(options.question)}
          </QuestionnaireTitle>
          {options.description ? <QuestionnaireDescription>{options.description}</QuestionnaireDescription> : null}
          <QuestionnaireChoices>
            {options.options.map((o) => {
              const { props, body } = choiceParts(o)
              return (
                <QuestionnaireChoice
                  key={o.value}
                  value={o.value}
                  {...props}
                  disabled={o.disabled}
                  checked={picked === o.value}
                  onChange={() => pick(o.value)}
                >
                  {body}
                </QuestionnaireChoice>
              )
            })}
            {options.other ? (
              <QuestionnaireChoice value={OTHER} checked={other} onChange={() => pick(OTHER)}>
                <QuestionnaireChoiceTitle>Other…</QuestionnaireChoiceTitle>
              </QuestionnaireChoice>
            ) : null}
          </QuestionnaireChoices>
          {other ? <QuestionnaireInput aria-label="Your answer" autoFocus /> : null}
        </QuestionnaireItem>
      </Questionnaire>
      <AskHint>{options.hint}</AskHint>
      {buttons ? (
        <ClarifyActions align="end">
          {options.skippable && !other ? (
            <Button size="xs" variant="ghost" onClick={() => onEvent({ type: "skip", turn: turn.id })}>
              Skip
            </Button>
          ) : null}
          <Button type="submit" form={`${turn.id}-form`} size="xs" disabled={!picked}>
            {other ? "Use this" : (options.submit ?? "Use this")}
          </Button>
        </ClarifyActions>
      ) : null}
    </>
  )
}
