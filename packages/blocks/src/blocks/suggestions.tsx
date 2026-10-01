import { SuggestionChips } from "../parts/suggestion-chips"
import type { BlockProps } from "../types"

/**
 * Follow-ups after an answer, each a whole prompt that reuses the current
 * scope; picking one is the reply, and the API sends it on as the next prompt.
 * They run along a line, stack one per line, or sit under headings.
 *
 * Answered, the one picked stays, dimmed, and the rest can still be sent: each
 * is its own next question. Superseded or expired, none can.
 */
export function SuggestionsAsk({ spec, state = "pending", value: given, onAction }: BlockProps<"suggestions">) {
  const open = state === "pending" || state === "answered"
  const picked = typeof given === "string" ? [given] : []
  const all = spec.groups?.length ? spec.groups.flatMap((g) => g.items) : (spec.items ?? [])
  return (
    <SuggestionChips
      items={spec.items}
      groups={spec.groups}
      layout={spec.layout}
      sent={open ? picked : all}
      onSelect={(text) => onAction?.("reply", text)}
    />
  )
}
