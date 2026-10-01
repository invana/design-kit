import { CannotAnswerCard } from "@invana/ui"
import type { BlockProps } from "../types"

import { SuggestionChips } from "../parts/suggestion-chips"

/**
 * What the data does not hold, and what would change the answer — then the
 * nearby questions it can answer, each sent as a new prompt. Answered in
 * part, the card says which part is missing, above the answer for the rest.
 */
export function CannotBlock({ spec, onAction }: BlockProps<"cannot">) {
  return (
    <>
      <CannotAnswerCard
        remedy={spec.remedy}
        label={spec.partial ? "answered in part" : undefined}
        tone={spec.partial ? "info" : "default"}
      >
        {spec.reason}
      </CannotAnswerCard>
      {spec.nearest?.length ? (
        <SuggestionChips
          lead="I can answer instead"
          items={spec.nearest}
          onSelect={(text) => onAction?.("prompt", text)}
        />
      ) : null}
    </>
  )
}
