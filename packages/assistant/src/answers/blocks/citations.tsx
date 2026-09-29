import { CitationList, CitationRow } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import { figureText } from "./figure"

/** The sources an answer rests on, numbered as its markers cite them, with record counts. */
export function CitationsBlock({ block }: BlockRendererProps<"citations">) {
  return (
    <CitationList>
      {block.sources.map((source, i) => (
        <CitationRow
          key={i}
          marker={i + 1}
          count={source.count == null ? undefined : figureText(source.count)}
        >
          {source.label}
        </CitationRow>
      ))}
    </CitationList>
  )
}
