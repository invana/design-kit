import type { AskRendererProps } from "../../conversations/registry"
import { SuggestionChips } from "../suggestion-chips"

/**
 * Follow-ups after an answer, each a whole prompt that reuses the current
 * scope; picking one is the reply, and the API sends it on as the next prompt.
 * They run along a line, stack one per line, or sit under headings.
 *
 * Answered, the one picked stays, dimmed, and the rest can still be sent: each
 * is its own next question. Superseded or expired, none can.
 */
export function SuggestionsAsk({ turn, options, onEvent }: AskRendererProps<"suggestions">) {
  const open = turn.state === "pending" || turn.state === "answered"
  const picked = typeof turn.value === "string" ? [turn.value] : []
  const all = options.groups?.length ? options.groups.flatMap((g) => g.items) : (options.items ?? [])
  return (
    <SuggestionChips
      items={options.items}
      groups={options.groups}
      layout={options.layout}
      sent={open ? picked : all}
      onSelect={(text) => onEvent({ type: "reply", turn: turn.id, value: text })}
    />
  )
}
