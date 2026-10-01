import { Button, CaveatNote } from "@invana/ui"

import { ConfirmCard, type ConfirmCost } from "../confirm-card"
import type { AskRendererProps } from "../../conversations/registry"
import type { ConfirmOptions } from "../../protocol/types"
import { strong } from "@invana/blocks"
import { AskHint, AskSummary, hintText } from "../parts"

/** The grammar's cost, as the card's figures. A value with `**…**` bolds only that part. */
function costOf(cost: ConfirmOptions["cost"]): ConfirmCost[] | undefined {
  return cost?.map((c) => ({
    label: c.label,
    value: c.value.includes("**") ? hintText(c.value) : c.value,
    tone: c.tone === "warn" || c.tone === "bad" ? "warning" : undefined,
  }))
}

/**
 * Yes or no, where the question says what yes will do and the cost — rows
 * scanned, time, records written — is stated before the buttons, as a line or
 * a strip of figures. A caveat to weigh sits under the cost. The default is the
 * primary button; with `align: "end"` it takes the card's right edge and the
 * other its left, and a `dismiss` no draws quiet. `hint` says where the
 * default came from.
 *
 * Answered, it settles into the decision, in `settled` words when given, with
 * the hint the API patches in to say what it led to.
 */
export function ConfirmAsk({ turn, options, onEvent }: AskRendererProps<"confirm">) {
  const pending = turn.state === "pending"

  if (!pending) {
    const yes = turn.value === undefined ? (options.default ?? true) : turn.value === true
    const words = yes ? (options.settled?.yes ?? options.yes) : (options.settled?.no ?? options.no)
    return (
      <AskSummary rows={[{ label: options.label ?? "Decision", value: words }]}>
        <AskHint>{options.hint}</AskHint>
      </AskSummary>
    )
  }

  const chosen = options.default ?? true
  const end = options.align === "end"
  const button = (value: boolean) => (
    <Button
      key={String(value)}
      size="xs"
      variant={value === chosen ? "default" : value === false && options.dismiss ? "ghost" : "outline"}
      className={end && value === chosen ? "ms-auto" : undefined}
      onClick={() => onEvent({ type: "reply", turn: turn.id, value })}
    >
      {value ? options.yes : options.no}
    </Button>
  )
  // Together, the default leads; apart, it takes the right edge.
  const order = end ? [!chosen, chosen] : [chosen, !chosen]

  return (
    <ConfirmCard
      question={strong(options.question)}
      description={options.description}
      heading={options.heading}
      cost={costOf(options.cost)}
      costAs={options.costAs}
      seamless
      caveat={options.caveat ? <CaveatNote label={options.caveat.label}>{options.caveat.text}</CaveatNote> : undefined}
      hint={options.hint ? hintText(options.hint) : undefined}
    >
      {order.map(button)}
    </ConfirmCard>
  )
}
