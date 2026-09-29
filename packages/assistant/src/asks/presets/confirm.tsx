import { Button } from "@invana/ui"

import { ConfirmCard, type ConfirmCost } from "../confirm-card"
import type { AskRendererProps } from "../../conversations/registry"
import type { ConfirmOptions } from "../../protocol/types"
import { strong } from "../../prose"
import { figureText } from "../../answers/blocks/figure"

/** The grammar's cost, as the card's figures, in the order they are weighed. */
function costOf(cost: ConfirmOptions["cost"]): ConfirmCost[] | undefined {
  if (!cost) return undefined
  const out: ConfirmCost[] = []
  if (cost.rows != null) out.push({ label: "rows scanned", value: figureText(cost.rows) })
  if (cost.time != null) out.push({ label: "to run", value: cost.time })
  if (cost.writes != null) {
    const written = figureText(cost.writes)
    // Writing nothing is the reassuring case; writing anything is the one to read.
    out.push({ label: "records written", value: written, tone: written === "0" ? undefined : "warning" })
  }
  return out
}

/**
 * Yes or no, where the question says what yes will do and the cost — rows
 * scanned, time, records written — is stated as figures before the buttons.
 * The default is the primary button while it waits; `hint` says where the
 * default came from.
 *
 * Answered, both stay drawn: the answer given is the primary one, and the
 * other still works, sending a `change`.
 */
export function ConfirmAsk({ turn, options, onEvent }: AskRendererProps<"confirm">) {
  const pending = turn.state === "pending"
  const answered = turn.state === "answered"
  const chosen = answered ? turn.value === true : (options.default ?? true)

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
    <ConfirmCard question={strong(options.question)} cost={costOf(options.cost)} hint={options.hint}>
      {/* The primary leads, as it does in every ask. */}
      {chosen ? [button(true), button(false)] : [button(false), button(true)]}
    </ConfirmCard>
  )
}
