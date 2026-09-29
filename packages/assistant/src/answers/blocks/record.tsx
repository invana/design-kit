import { PropertyList, PropertyRow } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"

/** One entity, or the assumptions behind an answer, as label/value pairs. */
export function RecordBlock({ block }: BlockRendererProps<"record">) {
  return (
    <PropertyList labelWidth="auto">
      {block.rows.map((row) => (
        <PropertyRow key={row.label} label={row.label} mono>
          {row.value}
        </PropertyRow>
      ))}
    </PropertyList>
  )
}
