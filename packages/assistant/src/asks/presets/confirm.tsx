import { Button } from "@invana/ui"

import { ClarifyActions, ClarifyFootnote } from ".."
import type { AskRendererProps } from "../../conversations/registry"
import { strong } from "../../prose"

/**
 * Yes or no, where the question says what yes will do — the definition it
 * fixes, the rows it scans, the time it takes, with the cost in bold. Yes is
 * the primary button; `default` is for the caller to act on, and the hint
 * says it aloud when it is no.
 *
 * Answered, both stay drawn: the answer given is the primary one, and the
 * other still works, sending a `change`.
 */
export function ConfirmAsk({ turn, options, onEvent }: AskRendererProps<"confirm">) {
  const pending = turn.state === "pending"
  const answered = turn.state === "answered"
  const chosen = answered ? turn.value === true : true

  const send = (value: boolean) => {
    if (pending) onEvent({ type: "reply", turn: turn.id, value })
    else if (answered && value !== chosen) onEvent({ type: "change", turn: turn.id, value })
  }

  const button = (value: boolean) => (
    <Button
      key={String(value)}
      size="xs"
      variant={value === chosen ? "default" : "outline"}
      disabled={!pending && !answered}
      aria-pressed={answered ? value === chosen : undefined}
      onClick={() => send(value)}
    >
      {value ? options.yes : options.no}
    </Button>
  )

  return (
    <>
      <p>{strong(options.question)}</p>
      <ClarifyActions>
        {button(true)}
        {button(false)}
      </ClarifyActions>
      {options.hint ? <ClarifyFootnote>{options.hint}</ClarifyFootnote> : null}
    </>
  )
}
