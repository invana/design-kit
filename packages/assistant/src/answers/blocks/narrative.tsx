import { CitationMarker } from ".."
import type { BlockRendererProps } from "../../conversations/registry"
import { ChatSessionCaret } from "../../conversations/thread"
import { prose } from "../../prose"
import { useCiteFocus } from "./cite-focus"

/**
 * The answer in two or three sentences, leading with the number. Markers sit
 * where the text places them (`[n]`), or after it (`cites`); pointing at one
 * lights its source in the citations. While the answer is still being written
 * a caret ends the text.
 */
export function NarrativeBlock({ block, turn }: BlockRendererProps<"narrative">) {
  const [active, setActive] = useCiteFocus(turn.id, block.active)
  const marker = (n: number) => (
    <CitationMarker
      key={`cite-${n}`}
      data-active={active === n || undefined}
      onMouseEnter={() => setActive(n)}
      onMouseLeave={() => setActive(undefined)}
    >
      {n}
    </CitationMarker>
  )
  const writing = turn.state === "running" && turn.blocks[turn.blocks.length - 1] === block
  return (
    <p>
      {prose(block.text, marker)}
      {block.cites?.map(marker)}
      {writing ? <ChatSessionCaret /> : null}
    </p>
  )
}
