import { CannotAnswerCard } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"

/** What the data does not hold, and what would change the answer. */
export function CannotBlock({ block }: BlockRendererProps<"cannot">) {
  return <CannotAnswerCard remedy={block.remedy}>{block.reason}</CannotAnswerCard>
}
