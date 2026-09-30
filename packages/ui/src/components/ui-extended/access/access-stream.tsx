import * as React from "react"

import { cn } from "../../../lib/utils"
import { Eyebrow } from "../eyebrow"
import { layerLabel, layerPaint, type LayerPalette } from "../layer-chip"
import {
  accessKey,
  formatCount,
  formatRate,
  type AccessEvent,
  type AccessStepState,
  type AccessTargetState,
} from "./store"

export interface AccessStreamProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  targets: AccessTargetState[]
  events: AccessEvent[]
  steps?: AccessStepState[]
  palette?: LayerPalette
  focus?: string | null
  /** Narrow both sections to one target. Steps stay — they are the context. */
  selected?: string | null
  onFocusChange?: (key: string | null) => void
  /**
   * The trend cell of a flowing row. The kit's sparkline lives in
   * `@invana/charts`, which `@invana/ui` cannot import, so the caller hands it
   * in — `(t) => <Sparkline values={t.history} />`.
   */
  renderRate?: (target: AccessTargetState) => React.ReactNode
  /** Flowing rows shown, hottest first. */
  maxFlowing?: number
}

type Row =
  | { kind: "event"; at: string; event: AccessEvent }
  | { kind: "step"; at: string; step: AccessStepState }

const time = (at: string) => {
  const d = new Date(at)
  return Number.isNaN(d.getTime())
    ? at
    : d.toLocaleTimeString(undefined, { hour12: false })
}

/**
 * What is flowing, and what happened that matters — never every touch.
 *
 * At thousands of touches a second a log of them scrolls faster than it can be
 * read, so the stream is two things. **Flowing** is each active target at its
 * current rate, updated in place, hottest first. **Events** is the rare and
 * consequential, one row each and never summed: data leaving, a refusal, a
 * target touched for the first time, an error — interleaved with the steps
 * that frame them. Newest first, so there is no tail to lose and nothing
 * scrolls under a reader's cursor.
 */
export const AccessStream = React.forwardRef<HTMLDivElement, AccessStreamProps>(
  (
    {
      targets,
      events,
      steps = [],
      palette,
      focus,
      selected,
      onFocusChange,
      renderRate,
      maxFlowing = 8,
      className,
      ...props
    },
    ref,
  ) => {
    const active = targets.filter((t) => t.rate > 0)
    const flowing = active
      .filter((t) => !selected || t.key === selected)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, maxFlowing)

    const rows: Row[] = [
      ...events
        .filter((e) => !selected || accessKey(e.layer, e.target) === selected)
        .map((event): Row => ({ kind: "event", at: event.at, event })),
      ...steps.map((step): Row => ({ kind: "step", at: step.at, step })),
    ].sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))

    const hover = (key: string | null) => () => onFocusChange?.(key)

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        <section className="flex flex-col gap-1">
          <Eyebrow aside={`${active.length} active`}>Flowing</Eyebrow>
          {flowing.length === 0 ? (
            <p className="py-1 text-muted-foreground">Nothing is being touched.</p>
          ) : (
            <ul className="flex flex-col">
              {flowing.map((t) => (
                <li
                  key={t.key}
                  onMouseEnter={hover(t.key)}
                  onMouseLeave={hover(null)}
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-control px-1 py-0.5",
                    focus === t.key && "bg-accent",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn("size-2 shrink-0 rounded-[2px]", layerPaint(palette, t.layer).swatch)}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {t.label}
                    <span className="text-sm text-muted-foreground">
                      {" · "}
                      {t.ops.join(" + ")}
                    </span>
                  </span>
                  {renderRate ? <span className="shrink-0">{renderRate(t)}</span> : null}
                  <span className="w-16 shrink-0 text-right font-mono text-sm tabular-nums">
                    {formatRate(t.rate)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-1">
          <Eyebrow aside={events.length}>Events</Eyebrow>
          {rows.length === 0 ? (
            <p className="py-1 text-muted-foreground">
              No egress, refusals or first touches yet.
            </p>
          ) : (
            <ul className="flex flex-col">
              {rows.map((row) =>
                row.kind === "step" ? (
                  <li
                    key={`step-${row.step.id}`}
                    className="flex min-w-0 items-baseline gap-2 border-t border-border px-1 pt-1.5 pb-0.5 first:border-t-0"
                  >
                    <span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
                      {time(row.at)}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {row.step.label}
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {row.step.state === "open" ? "running" : "done"} ·{" "}
                      {formatCount(row.step.total)}
                    </span>
                  </li>
                ) : (
                  <EventRow
                    key={row.event.id}
                    event={row.event}
                    focused={focus === accessKey(row.event.layer, row.event.target)}
                    onHover={onFocusChange}
                  />
                ),
              )}
            </ul>
          )}
        </section>
      </div>
    )
  },
)
AccessStream.displayName = "AccessStream"

function EventRow({
  event: e,
  focused,
  onHover,
}: {
  event: AccessEvent
  focused: boolean
  onHover?: (key: string | null) => void
}) {
  const key = accessKey(e.layer, e.target)
  return (
    <li
      onMouseEnter={() => onHover?.(key)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "flex min-w-0 items-baseline gap-2 rounded-control px-1 py-0.5",
        focused && "bg-accent",
      )}
    >
      <span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
        {time(e.at)}
      </span>
      {/* Only the kinds with a meaning here carry a tone; any other kind a
          server grows is listed in its own name, in the neutral. */}
      <span
        className={cn(
          "w-20 shrink-0 whitespace-nowrap text-sm text-muted-foreground",
          e.kind === "egress" && "text-warning",
          (e.kind === "refused" || e.kind === "error") && "text-destructive",
        )}
      >
        {e.kind.replace(/_/g, " ")}
      </span>
      <span className="min-w-0 flex-1 truncate">
        {e.label ?? e.target}
        {e.to ? <span className="text-muted-foreground"> → {e.to}</span> : null}
      </span>
      <span className="shrink-0 truncate text-sm text-muted-foreground">
        {e.detail ?? layerLabel(e.layer)}
      </span>
    </li>
  )
}
