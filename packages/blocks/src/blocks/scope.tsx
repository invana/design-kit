import { ScopeLine } from "@invana/ui"
import type { BlockProps } from "../types"

/**
 * Period, filters, population and freshness, as the query applied them. Each
 * part is edited in place — typed, or picked from its choices — and sent as a
 * `scope` action with `{ part, value }`; a part the shell marks `fixed` — a
 * freshness, say — is a fact about the data and stays as it is. A part carried from an earlier question and changed since,
 * or resting on late data, is marked, and a hint about late data is a warning.
 */
export interface ScopeBlockProps extends BlockProps<"scope"> {
  /** Parts that are facts, not choices — a freshness the data states. Drawn, never edited. */
  fixed?: number[]
}

export function ScopeBlock({ spec, fixed, onAction }: ScopeBlockProps) {
  const stale = spec.parts.some((p) => typeof p === "object" && p.mark === "stale")
  return (
    <ScopeLine
      parts={spec.parts}
      fixedParts={fixed}
      defaultOpenPart={spec.openPart}
      note={spec.hint}
      noteTone={stale ? "warning" : "muted"}
      seamless
      onPartChange={(part, value) => onAction?.("scope", { part, value })}
    />
  )
}
