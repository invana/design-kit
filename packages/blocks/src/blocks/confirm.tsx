import { Button, CaveatNote } from "@invana/ui"

import { ConfirmCard, type ConfirmCost } from "../parts/confirm-card"
import type { BlockProps, ConfirmOptions } from "../types"
import { strong } from "../prose"
import { AskHint, AskSummary, hintText } from "../parts/ask"

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
export function ConfirmAsk({ spec, state = "pending", value: given, onAction }: BlockProps<"confirm">) {
  const pending = state === "pending"

  if (!pending) {
    const yes = given === undefined ? (spec.default ?? true) : given === true
    const words = yes ? (spec.settled?.yes ?? spec.yes) : (spec.settled?.no ?? spec.no)
    return (
      <AskSummary rows={[{ label: spec.label ?? "Decision", value: words }]}>
        <AskHint>{spec.hint}</AskHint>
      </AskSummary>
    )
  }

  const chosen = spec.default ?? true
  const end = spec.align === "end"
  const button = (value: boolean) => (
    <Button
      key={String(value)}
      size="xs"
      variant={value === chosen ? "default" : value === false && spec.dismiss ? "ghost" : "outline"}
      className={end && value === chosen ? "ms-auto" : undefined}
      onClick={() => onAction?.("reply", value)}
    >
      {value ? spec.yes : spec.no}
    </Button>
  )
  // Together, the default leads; apart, it takes the right edge.
  const order = end ? [!chosen, chosen] : [chosen, !chosen]

  return (
    <ConfirmCard
      question={strong(spec.question)}
      description={spec.description}
      heading={spec.heading}
      cost={costOf(spec.cost)}
      costAs={spec.costAs}
      seamless
      caveat={spec.caveat ? <CaveatNote label={spec.caveat.label}>{spec.caveat.text}</CaveatNote> : undefined}
      hint={spec.hint ? hintText(spec.hint) : undefined}
    >
      {order.map(button)}
    </ConfirmCard>
  )
}
