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
import type { BlockProps } from "../types"

import { ClarifyActions } from "@invana/ui"
import { AskHint, AskLink, AskSummary, choiceParts, hintText, isHeading, joinPicks } from "../parts/ask"
import { strong } from "../prose"

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
export function MultiAsk({ spec, state = "pending", value: given, id: idProp, onAction }: BlockProps<"multi">) {
  const auto = React.useId()
  const id = idProp ?? auto
  const pending = state === "pending"
  const [editing, setEditing] = React.useState(false)
  const [picked, setPicked] = React.useState<string[]>(
    pending ? (spec.default ?? []) : ((given as string[] | undefined) ?? []),
  )

  if (!pending && !editing) {
    const value = (given as string[] | undefined) ?? spec.default ?? []
    const text = joinPicks(spec.options.filter((o) => value.includes(o.value)))
    return (
      <AskSummary
        rows={[{ label: spec.label ?? "Answer", value: text || "—" }]}
        change={state === "answered" ? "Change answer" : undefined}
        onChange={() => setEditing(true)}
      />
    )
  }

  const full = spec.max != null && picked.length >= spec.max
  const short = spec.min != null && picked.length < spec.min
  const toggle = (v: string) =>
    setPicked((now) => (now.includes(v) ? now.filter((x) => x !== v) : [...now, v]))
  const all = spec.options.filter((o) => !o.disabled).map((o) => o.value)

  return (
    <>
      <Questionnaire
        id={id}
        onSubmit={(e) => {
          e.preventDefault()
          if (short) return
          const value = spec.options.map((o) => o.value).filter((v) => picked.includes(v))
          onAction?.(editing ? "change" : "reply", value)
          setEditing(false)
        }}
      >
        <QuestionnaireItem name={id} multiple>
          <QuestionnaireTitle
            className={cn(
              isHeading(spec) && "font-semibold",
              spec.selectAll && "flex w-full items-baseline justify-between gap-2",
            )}
          >
            {strong(spec.question)}
            {spec.selectAll ? (
              <AskLink onClick={() => setPicked(spec.max != null ? all.slice(0, spec.max) : all)}>Select all</AskLink>
            ) : null}
          </QuestionnaireTitle>
          {spec.description ? <QuestionnaireDescription>{spec.description}</QuestionnaireDescription> : null}
          <QuestionnaireChoices>
            {spec.options.map((o) => {
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
      <AskHint>{spec.hint}</AskHint>
      <ClarifyActions>
        {spec.max != null ? (
          full && spec.max < spec.options.length ? (
            <AskHint tone="warning">Limit reached · clear one to swap</AskHint>
          ) : (
            <span className="text-xs text-muted-foreground">{hintText(`**${picked.length}** of ${spec.max}`)}</span>
          )
        ) : null}
        <Button type="submit" form={id} size="xs" className="ms-auto" disabled={short}>
          {submitLabel(spec.question, picked.length, spec.submit)}
        </Button>
      </ClarifyActions>
    </>
  )
}
