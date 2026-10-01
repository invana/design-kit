import * as React from "react"
import { CitationList, CitationRow } from "@invana/ui"
import type { BlockProps } from "../types"

import { ChatSessionDisclosure } from "@invana/ui"
import { figureText } from "../format"

/**
 * The sources an answer rests on, numbered as its markers cite them, with
 * record counts at the right and what kind of source each is, and how fresh,
 * under it. The row a marker in the prose points at is lit, when the shell tracks it. Folded, one line
 * says how many sources and records; a source with no records is said out loud.
 */
export interface CitationsBlockProps extends BlockProps<"citations"> {
  /** The source the reader is on, when the shell tracks it. Defaults to the spec's `active`. */
  active?: number
}

export function CitationsBlock({ spec, active = spec.active }: CitationsBlockProps) {
  const [open, setOpen] = React.useState(!spec.folded)
  const counts = spec.sources.map((s) => s.count)
  const total = counts.every((c) => typeof c === "number")
    ? (counts as number[]).reduce((a, b) => a + b, 0)
    : undefined

  const list = (
    <CitationList note={spec.note} noteTone={total === 0 ? "warning" : "muted"}>
      {spec.sources.map((source, i) => (
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
  if (!spec.folded) return list
  return (
    <ChatSessionDisclosure
      variant="inline"
      label={`${spec.sources.length} sources`}
      meta={total != null ? `${total.toLocaleString("en-GB")} records` : undefined}
      open={open}
      onOpenChange={setOpen}
    >
      {list}
    </ChatSessionDisclosure>
  )
}
