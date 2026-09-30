import { ScopeLine } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"

/**
 * Period, filters, population and freshness, as the query applied them. Each
 * part is edited in place — typed, or picked from its choices — and sent as a
 * `scope` event; the envelope's freshness, drawn last, is a fact about the data
 * and stays fixed. A part carried from an earlier question and changed since,
 * or resting on late data, is marked, and a hint about late data is a warning.
 */
export function ScopeBlock({ block, turn, onEvent }: BlockRendererProps<"scope">) {
  const fromEnvelope = !(turn.blocks as unknown[]).includes(block)
  const fixed = fromEnvelope && turn.envelope?.freshness ? [block.parts.length - 1] : undefined
  const stale = block.parts.some((p) => typeof p === "object" && p.mark === "stale")
  return (
    <ScopeLine
      parts={block.parts}
      fixedParts={fixed}
      defaultOpenPart={block.openPart}
      note={block.hint}
      noteTone={stale ? "warning" : "muted"}
      onPartChange={(part, value) => onEvent({ type: "scope", turn: turn.id, part, value })}
    />
  )
}
