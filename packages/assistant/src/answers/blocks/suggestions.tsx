import type { BlockRendererProps } from "../../conversations/registry"
import { SuggestionChips } from "../../followups"

/**
 * Follow-ups under the answer; picking one sends it as the next prompt. They
 * run along a line, stack one per line, or sit under headings; one already
 * sent stays, dimmed.
 */
export function SuggestionsBlock({ turn, block, onEvent }: BlockRendererProps<"suggestions">) {
  return (
    <SuggestionChips
      items={block.items}
      groups={block.groups}
      layout={block.layout}
      sent={block.sent}
      onSelect={(text) => onEvent({ type: "suggestion", turn: turn.id, text })}
    />
  )
}
