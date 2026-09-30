import * as React from "react"
import { TraceList, TraceStep } from "@invana/ui"

import { ChatSessionDisclosure } from "../../conversations/thread"
import type { BlockRendererProps } from "../../conversations/registry"
import { ActionRow } from "./actions"

/**
 * What the answer is doing, step by step, while it runs — and the record of it
 * after, folded to one line. A failed step says why under it, with what can be
 * done about it; a step held on the analyst waits hollow, in the info tone.
 */
export function TraceBlock({ block, turn, onEvent }: BlockRendererProps<"trace">) {
  const [open, setOpen] = React.useState(!block.folded)
  const list = (
    <TraceList variant="progress">
      {block.steps.map((step, i) => (
        <TraceStep
          key={step.id ?? i}
          name={step.label}
          duration={step.detail}
          status={step.state}
          error={step.error}
        />
      ))}
    </TraceList>
  )
  const actions = block.actions?.length ? (
    <ActionRow actions={block.actions} onAction={(action) => onEvent({ type: "action", turn: turn.id, action })} />
  ) : null
  if (!block.folded) {
    return (
      <>
        {list}
        {actions}
      </>
    )
  }
  return (
    <ChatSessionDisclosure
      variant="inline"
      label={`${block.steps.length} steps`}
      meta={block.summary}
      open={open}
      onOpenChange={setOpen}
    >
      {list}
    </ChatSessionDisclosure>
  )
}
