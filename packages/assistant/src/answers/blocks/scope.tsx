import { ScopeLine } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"

/**
 * Period, filters, population and freshness, as the query applied them. Each
 * part is edited in place and sent as a `scope` event; the envelope's
 * freshness, drawn last, is a fact about the data and stays fixed.
 */
export function ScopeBlock({ block, turn, onEvent }: BlockRendererProps<"scope">) {
  const fromEnvelope = !(turn.blocks as unknown[]).includes(block)
  const fixed = fromEnvelope && turn.envelope?.freshness ? [block.parts.length - 1] : undefined
  return (
    <ScopeLine
      parts={block.parts}
      fixedParts={fixed}
      onPartChange={(part, value) => onEvent({ type: "scope", turn: turn.id, part, value })}
    />
  )
}
