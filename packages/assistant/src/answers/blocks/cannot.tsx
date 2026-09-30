import { CannotAnswerCard } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import { SuggestionChips } from "../../asks/suggestion-chips"

/**
 * What the data does not hold, and what would change the answer — then the
 * nearby questions it can answer, each sent as a new prompt. Answered in
 * part, the card says which part is missing, above the answer for the rest.
 */
export function CannotBlock({ block, onEvent }: BlockRendererProps<"cannot">) {
  return (
    <>
      <CannotAnswerCard
        remedy={block.remedy}
        label={block.partial ? "answered in part" : undefined}
        tone={block.partial ? "info" : "default"}
      >
        {block.reason}
      </CannotAnswerCard>
      {block.nearest?.length ? (
        <SuggestionChips
          lead="I can answer instead"
          items={block.nearest}
          onSelect={(text) => onEvent({ type: "prompt", text })}
        />
      ) : null}
    </>
  )
}
