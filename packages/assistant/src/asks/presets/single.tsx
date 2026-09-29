import * as React from "react"
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@invana/ui"

import { ClarifyFootnote } from ".."
import type { AskRendererProps } from "../../conversations/registry"

/**
 * One choice from a list the data model holds. Picking an option is the reply,
 * so the default is one keypress away. With `other`, a typed answer sits under
 * the options and Enter sends it. Once answered the choice stays drawn,
 * read-only, beside the options that were not taken.
 */
export function SingleAsk({ turn, options, onEvent }: AskRendererProps<"single">) {
  const answered = turn.state !== "pending"
  const [picked, setPicked] = React.useState(options.default)
  const value = answered ? (turn.value as string | undefined) : picked
  const typed = value !== undefined && !options.options.some((o) => o.value === value)

  const reply = (v: string) => {
    setPicked(v)
    onEvent({ type: "reply", turn: turn.id, value: v })
  }

  return (
    <>
      <Questionnaire
        onSubmit={(e) => {
          e.preventDefault()
          const text = new FormData(e.currentTarget).get(turn.id)
          if (typeof text === "string" && text.trim()) reply(text.trim())
        }}
      >
        <QuestionnaireItem name={turn.id}>
          <QuestionnaireTitle>{options.question}</QuestionnaireTitle>
          <QuestionnaireChoices>
            {options.options.map((o) => (
              <QuestionnaireChoice
                key={o.value}
                value={o.value}
                detail={o.detail}
                disabled={o.disabled}
                readOnly={answered}
                checked={value === o.value}
                onChange={() => reply(o.value)}
              >
                <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
              </QuestionnaireChoice>
            ))}
            {options.other ? (
              <QuestionnaireInput
                aria-label="Another answer"
                placeholder="Other…"
                disabled={answered}
                defaultValue={typed ? value : undefined}
              />
            ) : null}
          </QuestionnaireChoices>
        </QuestionnaireItem>
      </Questionnaire>
      {options.hint ? <ClarifyFootnote>{options.hint}</ClarifyFootnote> : null}
    </>
  )
}
