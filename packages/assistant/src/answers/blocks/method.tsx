import * as React from "react"
import { PropertyList, PropertyRow } from "@invana/ui"

import {
  ChatSessionDisclosure,
  ChatSessionDisclosureCode,
  ChatSessionDisclosureSteps,
} from "../../conversations/thread"
import type { BlockRendererProps } from "../../conversations/registry"
import { strong } from "../../prose"

/**
 * The query, formula or model behind the figure, folded. Closed, the line
 * carries the meta at the right, or the code itself when there is none; open,
 * the code moves into its own block, with what a model rests on under it, or
 * the steps of a method that took several.
 */
export function MethodBlock({ block }: BlockRendererProps<"method">) {
  const [open, setOpen] = React.useState(block.open ?? false)
  return (
    <ChatSessionDisclosure
      variant="inline"
      label={block.label ?? "method"}
      meta={block.meta ?? (open ? undefined : block.code?.replace(/\*\*/g, ""))}
      open={open}
      onOpenChange={setOpen}
    >
      <>
        {block.code ? <ChatSessionDisclosureCode>{strong(block.code)}</ChatSessionDisclosureCode> : null}
        {block.facts?.length ? (
          <PropertyList labelWidth="auto" variant="summary">
            {block.facts.map((fact) => (
              <PropertyRow key={fact.label} label={fact.label} mono>
                {fact.value}
              </PropertyRow>
            ))}
          </PropertyList>
        ) : null}
        {block.steps?.length ? <ChatSessionDisclosureSteps steps={block.steps} /> : null}
      </>
    </ChatSessionDisclosure>
  )
}
