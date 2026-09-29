import { SegmentedControl } from "@invana/ui"

import { ClarifyFootnote } from ".."
import type { AskRendererProps } from "../../conversations/registry"

/**
 * Two to five short options in one row — a granularity, a confidence level,
 * an output format. Picking one is the reply. With no `default` nothing is
 * picked, so the reader answers rather than accepts. Once answered the row
 * stays, read-only, with the pick filled.
 */
export function QuickAsk({ turn, options, onEvent }: AskRendererProps<"quick">) {
  const answered = turn.state !== "pending"
  return (
    <>
      <p>{options.question}</p>
      <SegmentedControl
        aria-label={options.question}
        variant="solid"
        size="sm"
        readOnly={answered}
        options={options.options}
        defaultValue={(answered ? (turn.value as string | undefined) : options.default) ?? null}
        onValueChange={(value) => onEvent({ type: "reply", turn: turn.id, value })}
      />
      {options.hint ? <ClarifyFootnote>{options.hint}</ClarifyFootnote> : null}
    </>
  )
}
