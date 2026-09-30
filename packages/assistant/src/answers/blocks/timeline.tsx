import * as React from "react"
import { StatusDot, TimelineEntry, TimelineList, TimelineSection, type StatusDotProps } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import type { Tone } from "../../protocol/types"

/** The grammar's tones, as the dot's. An event with none is a plain marker. */
const DOT_TONE: Record<Tone, StatusDotProps["tone"]> = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: "muted",
}

/**
 * A few dated events, in order, each marked by what it did to the figure — with
 * a detail line under an event, and labelled runs of events around the one an
 * answer is about, which is called out.
 */
export function TimelineBlock({ block }: BlockRendererProps<"timeline">) {
  return (
    <TimelineList variant="compact">
      {block.events.map((event, i) => (
        <React.Fragment key={i}>
          {event.section && event.section !== block.events[i - 1]?.section ? (
            <TimelineSection>{event.section}</TimelineSection>
          ) : null}
          <TimelineEntry
            when={event.when}
            marker={<StatusDot tone={DOT_TONE[event.tone ?? "neutral"]} size="md" />}
            highlight={event.highlight ? "error" : undefined}
          >
            <span>{event.text}</span>
            {event.detail ? <span className="text-xs text-muted-foreground">{event.detail}</span> : null}
          </TimelineEntry>
        </React.Fragment>
      ))}
    </TimelineList>
  )
}
