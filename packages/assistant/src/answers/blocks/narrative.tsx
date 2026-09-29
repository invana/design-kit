import { CitationMarker } from ".."
import type { BlockRendererProps } from "../../conversations/registry"
import { strong } from "../../prose"

/** The answer in two or three sentences, leading with the number, then its sources. */
export function NarrativeBlock({ block }: BlockRendererProps<"narrative">) {
  return (
    <p>
      {strong(block.text)}
      {block.cites?.map((n) => <CitationMarker key={n}>{n}</CitationMarker>)}
    </p>
  )
}
