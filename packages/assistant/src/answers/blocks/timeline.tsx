import { StatusDot, TimelineEntry, TimelineList, type StatusDotProps } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import type { Tone } from "../../protocol/types"

/** The grammar's tones, as the dot's. An event with none is a plain marker. */
const DOT_TONE: Record<Tone, StatusDotProps["tone"]> = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: "muted",
}

/** A few dated events, in order, each marked by what it did to the figure. */
export function TimelineBlock({ block }: BlockRendererProps<"timeline">) {
  return (
    <TimelineList variant="compact">
      {block.events.map((event, i) => (
        <TimelineEntry
          key={i}
          when={event.when}
          marker={<StatusDot tone={DOT_TONE[event.tone ?? "neutral"]} size="md" />}
        >
          {event.text}
        </TimelineEntry>
      ))}
    </TimelineList>
  )
}
