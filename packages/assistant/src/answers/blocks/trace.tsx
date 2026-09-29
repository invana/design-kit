import { TraceList, TraceStep } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"

/** What the answer is doing, step by step, while it runs — and the record of it after. */
export function TraceBlock({ block }: BlockRendererProps<"trace">) {
  return (
    <TraceList variant="progress">
      {block.steps.map((step, i) => (
        <TraceStep key={step.id ?? i} name={step.label} duration={step.detail} status={step.state} />
      ))}
    </TraceList>
  )
}
