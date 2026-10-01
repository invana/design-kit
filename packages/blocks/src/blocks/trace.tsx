import * as React from "react"
import { TraceList, TraceStep } from "@invana/ui"
import type { BlockProps } from "../types"

import { ChatSessionDisclosure } from "@invana/ui"
import { ActionRow } from "../parts/actions"

/**
 * What the answer is doing, step by step, while it runs — and the record of it
 * after, folded to one line. A failed step says why under it, with what can be
 * done about it; a step held on the analyst waits hollow, in the info tone.
 */
export function TraceBlock({ spec, onAction }: BlockProps<"trace">) {
  const [open, setOpen] = React.useState(!spec.folded)
  const list = (
    <TraceList variant="progress">
      {spec.steps.map((step, i) => (
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
  const actions = spec.actions?.length ? (
    <ActionRow actions={spec.actions} onAction={(action) => onAction?.(action)} />
  ) : null
  if (!spec.folded) {
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
      label={`${spec.steps.length} steps`}
      meta={spec.summary}
      open={open}
      onOpenChange={setOpen}
    >
      {list}
    </ChatSessionDisclosure>
  )
}
