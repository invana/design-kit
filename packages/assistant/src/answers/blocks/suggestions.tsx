import type { BlockRendererProps } from "../../conversations/registry"
import { SuggestionChips } from "../../followups"

/** Follow-ups under the answer; picking one sends it as the next prompt. */
export function SuggestionsBlock({ turn, block, onEvent }: BlockRendererProps<"suggestions">) {
  return (
    <SuggestionChips
      items={block.items}
      onSelect={(text) => onEvent({ type: "suggestion", turn: turn.id, text })}
    />
  )
}
