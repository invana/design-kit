import * as React from "react"
import { CaveatNote } from "@invana/ui"

import { ChatSessionDisclosure } from "../../conversations/thread"
import type { BlockRendererProps } from "../../conversations/registry"
import type { CaveatNoteOptions, CaveatTone } from "../../protocol/types"

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
export function CaveatBlock({ block, turn, onEvent }: BlockRendererProps<"caveat">) {
  const [open, setOpen] = React.useState(!block.folded)
  const onAction = (action: string) => onEvent({ type: "action", turn: turn.id, action })
  if (!block.items) return <Note note={block} onAction={onAction} />
  const notes = block.items.map((note, i) => <Note key={i} note={note} onAction={onAction} />)
  if (!block.folded) return <>{notes}</>
  return (
    <ChatSessionDisclosure
      variant="inline"
      label={`${block.items.length} caveats`}
      meta={open ? undefined : block.items.map((n) => n.label).join(" · ")}
      open={open}
      onOpenChange={setOpen}
    >
      <>{notes}</>
    </ChatSessionDisclosure>
  )
}
