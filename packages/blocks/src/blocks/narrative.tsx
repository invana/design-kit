import type * as React from "react"
import { CitationMarker, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@invana/ui"

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
  const figure = (n: number) => {
    const found = spec.figures?.[n - 1]
    if (!found || found.value === null) return <span className="text-muted-foreground">—</span>
    const chip = (
      <strong
        tabIndex={found.source ? 0 : undefined}
        className="rounded-sm underline decoration-dotted decoration-muted-foreground/60 underline-offset-2"
      >
        {found.value}
      </strong>
    )
    if (!found.source) return chip
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{chip}</TooltipTrigger>
          <TooltipContent>{found.source}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return (
    <p>
      {prose(spec.text, marker, figure)}
      {spec.cites?.map(marker)}
      {trailing}
    </p>
  )
}
