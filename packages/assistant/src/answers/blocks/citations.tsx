import * as React from "react"
import { CitationList, CitationRow } from "@invana/ui"

import { ChatSessionDisclosure } from "../../conversations/thread"
import type { BlockRendererProps } from "../../conversations/registry"
import { useCiteFocus } from "./cite-focus"
import { figureText } from "./figure"

/**
 * The sources an answer rests on, numbered as its markers cite them, with
 * record counts at the right and what kind of source each is, and how fresh,
 * under it. The row a marker in the prose points at is lit. Folded, one line
 * says how many sources and records; a source with no records is said out loud.
 */
export function CitationsBlock({ block, turn }: BlockRendererProps<"citations">) {
  const [active] = useCiteFocus(turn.id, block.active)
  const [open, setOpen] = React.useState(!block.folded)
  const counts = block.sources.map((s) => s.count)
  const total = counts.every((c) => typeof c === "number")
    ? (counts as number[]).reduce((a, b) => a + b, 0)
    : undefined

  const list = (
    <CitationList note={block.note} noteTone={total === 0 ? "warning" : "muted"}>
      {block.sources.map((source, i) => (
        <CitationRow
          key={i}
          marker={i + 1}
          active={active === i + 1}
          detail={source.detail}
          count={source.count == null ? undefined : figureText(source.count)}
        >
          {source.label}
        </CitationRow>
      ))}
    </CitationList>
  )
  if (!block.folded) return list
  return (
    <ChatSessionDisclosure
      variant="inline"
      label={`${block.sources.length} sources`}
      meta={total != null ? `${total.toLocaleString("en-GB")} records` : undefined}
      open={open}
      onOpenChange={setOpen}
    >
      {list}
    </ChatSessionDisclosure>
  )
}
