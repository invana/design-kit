import * as React from "react"

import { CitationMarker } from ".."
import type { BlockRendererProps } from "../../conversations/registry"

/**
 * `**…**` spans as strong, the rest as text. The only markup the grammar
 * allows in prose: the figure the sentence leads with.
 */
function strong(text: string): React.ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    )
}

/** The answer in two or three sentences, leading with the number, then its sources. */
export function NarrativeBlock({ block }: BlockRendererProps<"narrative">) {
  return (
    <p>
      {strong(block.text)}
      {block.cites?.map((n) => <CitationMarker key={n}>{n}</CitationMarker>)}
    </p>
  )
}
