import { CaveatNote } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"

/** What was excluded, imputed or assumed, and how far to trust the figure. */
export function CaveatBlock({ block }: BlockRendererProps<"caveat">) {
  return <CaveatNote label={block.label}>{block.text}</CaveatNote>
}
