import * as React from "react"
import { StatusDot, TimelineEntry, TimelineList, TimelineSection, type StatusDotProps } from "@invana/ui"

import type { BlockProps, TimelineEvent, Tone } from "../types"

/** The grammar's tones, as the dot's. An event with none is a plain marker. */
const DOT_TONE: Record<Tone, StatusDotProps["tone"]> = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: "muted",
}

/** A run of events, each with its section label where a new one starts, and its own events under it. */
function Events({ events }: { events: TimelineEvent[] }) {
  return (
    <>
      {events.map((event, i) => (
        <React.Fragment key={i}>
          {event.section && event.section !== events[i - 1]?.section ? (
            <TimelineSection>{event.section}</TimelineSection>
          ) : null}
          <TimelineEntry
            when={event.when}
            marker={<StatusDot tone={DOT_TONE[event.tone ?? "neutral"]} size="md" />}
            highlight={event.highlight ? "error" : undefined}
            nested={event.children?.length ? <Events events={event.children} /> : undefined}
            defaultOpen={event.open}
          >
            {event.text}
            {event.detail ? <span className="text-xs text-muted-foreground">{event.detail}</span> : null}
          </TimelineEntry>
        </React.Fragment>
      ))}
    </>
  )
}

/**
 * A few dated events, in order, each marked by what it did to the figure — with
 * a detail line under an event, and labelled runs of events around the one an
 * answer is about, which is called out. An event that breaks into smaller ones
 * opens into them, so a three-day hold can be read step by step.
 */
export function TimelineBlock({ spec }: BlockProps<"timeline">) {
  return (
    <TimelineList variant="compact">
      <Events events={spec.events} />
    </TimelineList>
  )
}
