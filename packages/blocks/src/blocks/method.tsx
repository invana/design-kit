import * as React from "react"
import { PropertyList, PropertyRow } from "@invana/ui"
import type { BlockProps } from "../types"

import {
  ChatSessionDisclosure,
  ChatSessionDisclosureCode,
  ChatSessionDisclosureSteps,
} from "@invana/ui"
import { strong } from "../prose"

/**
 * The query, formula or model behind the figure, folded. Closed, the line
 * carries the meta at the right, or the code itself when there is none; open,
 * the code moves into its own block, with what a model rests on under it, or
 * the steps of a method that took several.
 */
export function MethodBlock({ spec }: BlockProps<"method">) {
  const [open, setOpen] = React.useState(spec.open ?? false)
  return (
    <ChatSessionDisclosure
      variant="inline"
      label={spec.label ?? "method"}
      meta={spec.meta ?? (open ? undefined : spec.code?.replace(/\*\*/g, ""))}
      open={open}
      onOpenChange={setOpen}
    >
      <>
        {spec.code ? <ChatSessionDisclosureCode>{strong(spec.code)}</ChatSessionDisclosureCode> : null}
        {spec.facts?.length ? (
          <PropertyList labelWidth="auto" variant="summary">
            {spec.facts.map((fact) => (
              <PropertyRow key={fact.label} label={fact.label} mono>
                {fact.value}
              </PropertyRow>
            ))}
          </PropertyList>
        ) : null}
        {spec.steps?.length ? <ChatSessionDisclosureSteps steps={spec.steps} /> : null}
      </>
    </ChatSessionDisclosure>
  )
}
