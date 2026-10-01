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
import type { BlockProps } from "../types"

import { ClarifyActions } from "@invana/ui"
import { AskHint, AskSummary, choiceParts, isHeading, pickText } from "../parts/ask"
import { strong } from "../prose"

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
export function SingleAsk({ spec, state = "pending", value: given, id: idProp, onAction }: BlockProps<"single">) {
  const auto = React.useId()
  const id = idProp ?? auto
  const pending = state === "pending"
  const [editing, setEditing] = React.useState(false)
  const [picked, setPicked] = React.useState<string | undefined>(spec.default)
  const settledValue = (given as string | undefined) ?? spec.default

  if (!pending && !editing) {
    const option = spec.options.find((o) => o.value === settledValue)
    return (
      <AskSummary
        rows={[{ label: spec.label ?? "Answer", value: pickText(option, settledValue) }]}
        change={state === "answered" ? "Change answer" : undefined}
        onChange={() => setEditing(true)}
      />
    )
  }

  const send = (value: string) => {
    onAction?.(editing ? "change" : "reply", value)
    setEditing(false)
  }
  const pick = (value: string) => {
    setPicked(value)
    if (value !== OTHER && !spec.submit) send(value)
  }

  const other = picked === OTHER
  const buttons = spec.submit || spec.skippable || other

  return (
    <>
      <Questionnaire
        onSubmit={(e) => {
          e.preventDefault()
          if (other) {
            // The item holds the Other pick and the typed words under one name.
            const text = new FormData(e.currentTarget).getAll(id).map(String).find((v) => v !== OTHER)
            if (text?.trim()) send(text.trim())
          } else if (picked) send(picked)
        }}
        id={`${id}-form`}
      >
        <QuestionnaireItem name={id}>
          <QuestionnaireTitle className={isHeading(spec) ? "font-semibold" : undefined}>
            {strong(spec.question)}
          </QuestionnaireTitle>
          {spec.description ? <QuestionnaireDescription>{spec.description}</QuestionnaireDescription> : null}
          <QuestionnaireChoices>
            {spec.options.map((o) => {
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
            {spec.other ? (
              <QuestionnaireChoice value={OTHER} checked={other} onChange={() => pick(OTHER)}>
                <QuestionnaireChoiceTitle>Other…</QuestionnaireChoiceTitle>
              </QuestionnaireChoice>
            ) : null}
          </QuestionnaireChoices>
          {other ? <QuestionnaireInput aria-label="Your answer" autoFocus /> : null}
        </QuestionnaireItem>
      </Questionnaire>
      <AskHint>{spec.hint}</AskHint>
      {buttons ? (
        <ClarifyActions align="end">
          {spec.skippable && !other ? (
            <Button size="xs" variant="ghost" onClick={() => onAction?.("skip")}>
              Skip
            </Button>
          ) : null}
          <Button type="submit" form={`${id}-form`} size="xs" disabled={!picked}>
            {other ? "Use this" : (spec.submit ?? "Use this")}
          </Button>
        </ClarifyActions>
      ) : null}
    </>
  )
}
