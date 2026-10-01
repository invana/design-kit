import * as React from "react"
import { CaveatNote } from "@invana/ui"

import { ChatSessionDisclosure } from "@invana/ui"
import type { BlockProps, CaveatNoteOptions, CaveatTone } from "../types"

const TONE: Record<CaveatTone, "warning" | "info" | "destructive"> = {
  warning: "warning",
  info: "info",
  bad: "destructive",
}

function Note({
  note,
  onAction,
}: {
  note: CaveatNoteOptions
  onAction: (id: string) => void
}) {
  return (
    <CaveatNote
      label={note.label}
      tone={TONE[note.tone ?? "warning"]}
      action={note.action?.label}
      onAction={note.action ? () => onAction(note.action!.id) : undefined}
    >
      {note.text}
    </CaveatNote>
  )
}

/**
 * What was excluded, imputed or assumed, and how far to trust the figure. A
 * caveat with the rows behind it links to them; several can fold behind one
 * line that names their kinds.
 */
export function CaveatBlock({ spec, onAction }: BlockProps<"caveat">) {
  const [open, setOpen] = React.useState(!spec.folded)
  const act = (action: string) => onAction?.(action)
  if (!spec.items) return <Note note={spec} onAction={act} />
  const notes = spec.items.map((note, i) => <Note key={i} note={note} onAction={act} />)
  if (!spec.folded) return <>{notes}</>
  return (
    <ChatSessionDisclosure
      variant="inline"
      label={`${spec.items.length} caveats`}
      meta={open ? undefined : spec.items.map((n) => n.label).join(" · ")}
      open={open}
      onOpenChange={setOpen}
    >
      <>{notes}</>
    </ChatSessionDisclosure>
  )
}
