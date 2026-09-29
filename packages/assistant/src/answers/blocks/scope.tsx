import { ScopeLine } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"

/** Period, filters, population and freshness, as the query applied them. */
export function ScopeBlock({ block }: BlockRendererProps<"scope">) {
  return <ScopeLine parts={block.parts} />
}
