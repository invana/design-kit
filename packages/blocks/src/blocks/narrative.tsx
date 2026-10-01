import type * as React from "react"
import { CitationMarker } from "@invana/ui"

import { prose } from "../prose"
import type { BlockProps } from "../types"

export interface NarrativeBlockProps extends BlockProps<"narrative"> {
  /** The source the reader is on, when the shell tracks it. Defaults to the spec's `active`. */
  active?: number
  /** Pointing at a marker, or away from it. A shell that tracks the source lights its row too. */
  onActiveChange?: (n: number | undefined) => void
  /** Drawn after the text — the conversation's caret while the answer is still being written. */
  trailing?: React.ReactNode
}

/**
 * The answer in two or three sentences, leading with the number. Markers sit
 * where the text places them (`[n]`), or after it (`cites`); pointing at one
 * lights its source in the citations when the shell tracks it. `trailing` ends
 * the text — the caret, while a conversation is still writing it.
 */
export function NarrativeBlock({ spec, active = spec.active, onActiveChange, trailing }: NarrativeBlockProps) {
  const marker = (n: number) => (
    <CitationMarker
      key={`cite-${n}`}
      data-active={active === n || undefined}
      onMouseEnter={() => onActiveChange?.(n)}
      onMouseLeave={() => onActiveChange?.(undefined)}
    >
      {n}
    </CitationMarker>
  )
  return (
    <p>
      {prose(spec.text, marker)}
      {spec.cites?.map(marker)}
      {trailing}
    </p>
  )
}
