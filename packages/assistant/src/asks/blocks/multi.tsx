import * as React from "react"
import {
  Button,
  cn,
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@invana/ui"

import { ClarifyActions } from ".."
import type { AskRendererProps } from "../../conversations/registry"
import { AskHint, AskLink, AskSummary, choiceParts, hintText, isHeading, joinPicks } from "../parts"
import { strong } from "@invana/blocks"

/**
 * The submit's words, from the ask's `submit` or else from the question. A
 * prompt that is a phrase — `Adjust for` — is already the verb: `Adjust for 4`.
 * A question — `Who should receive it?` — is not, so it says what is being
 * sent: `Use 2 selected`.
 */
function submitLabel(question: string, count: number, submit?: string) {
  if (submit) return submit.replace("{count}", String(count))
  const q = question.trim()
  return q.endsWith("?") ? `Use ${count} selected` : `${q} ${count}`
}

/**
 * Several choices from a list the data model holds — filters, or the
 * assumptions an analysis will make, where the one left off says why in its
 * `note`. The defaults arrive ticked; `min` holds the submit back until enough
 * are, and `max` counts toward its limit beside the submit — at the limit the
 * rest stop being offered. Options take the same description, lead and
 * figure a single choice does. Submit sends the ticked values as a `reply`, in
 * the ask's order.
 *
 * Answered, it settles into one label/value pair; Change answer reopens it.
 */
export function MultiAsk({ turn, options, onEvent }: AskRendererProps<"multi">) {
  const pending = turn.state === "pending"
  const [editing, setEditing] = React.useState(false)
  const [picked, setPicked] = React.useState<string[]>(
    pending ? (options.default ?? []) : ((turn.value as string[] | undefined) ?? []),
  )
  const id = React.useId()

  if (!pending && !editing) {
    const value = (turn.value as string[] | undefined) ?? options.default ?? []
    const text = joinPicks(options.options.filter((o) => value.includes(o.value)))
    return (
      <AskSummary
        rows={[{ label: options.label ?? "Answer", value: text || "—" }]}
        change={turn.state === "answered" ? "Change answer" : undefined}
        onChange={() => setEditing(true)}
      />
    )
  }

  const full = options.max != null && picked.length >= options.max
  const short = options.min != null && picked.length < options.min
  const toggle = (v: string) =>
    setPicked((now) => (now.includes(v) ? now.filter((x) => x !== v) : [...now, v]))
  const all = options.options.filter((o) => !o.disabled).map((o) => o.value)

  return (
    <>
      <Questionnaire
        id={id}
        onSubmit={(e) => {
          e.preventDefault()
          if (short) return
          const value = options.options.map((o) => o.value).filter((v) => picked.includes(v))
          onEvent(editing ? { type: "change", turn: turn.id, value } : { type: "reply", turn: turn.id, value })
          setEditing(false)
        }}
      >
        <QuestionnaireItem name={turn.id} multiple>
          <QuestionnaireTitle
            className={cn(
              isHeading(options) && "font-semibold",
              options.selectAll && "flex w-full items-baseline justify-between gap-2",
            )}
          >
            {strong(options.question)}
            {options.selectAll ? (
              <AskLink onClick={() => setPicked(options.max != null ? all.slice(0, options.max) : all)}>Select all</AskLink>
            ) : null}
          </QuestionnaireTitle>
          {options.description ? <QuestionnaireDescription>{options.description}</QuestionnaireDescription> : null}
          <QuestionnaireChoices>
            {options.options.map((o) => {
              const checked = picked.includes(o.value)
              const { props, body } = choiceParts(o)
              return (
                <QuestionnaireChoice
                  key={o.value}
                  value={o.value}
                  {...props}
                  disabled={o.disabled || (full && !checked)}
                  checked={checked}
                  onChange={() => toggle(o.value)}
                >
                  {body}
                </QuestionnaireChoice>
              )
            })}
          </QuestionnaireChoices>
        </QuestionnaireItem>
      </Questionnaire>
      <AskHint>{options.hint}</AskHint>
      <ClarifyActions>
        {options.max != null ? (
          full && options.max < options.options.length ? (
            <AskHint tone="warning">Limit reached · clear one to swap</AskHint>
          ) : (
            <span className="text-xs text-muted-foreground">{hintText(`**${picked.length}** of ${options.max}`)}</span>
          )
        ) : null}
        <Button type="submit" form={id} size="xs" className="ms-auto" disabled={short}>
          {submitLabel(options.question, picked.length, options.submit)}
        </Button>
      </ClarifyActions>
    </>
  )
}
