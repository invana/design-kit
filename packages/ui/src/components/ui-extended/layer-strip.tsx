import * as React from "react"

import { cn } from "../../lib/utils"
import { LayerChip, type Layer, layerSwatch } from "./layer-chip"

/**
 * What an item is doing where it sits — the two tenses in one vocabulary.
 *
 * `declared` is the plan tense: this is what the playbook **will** engage.
 * `out` · `in` · `refused` · `skipped` are the run tense: what it did engage,
 * what a bound stopped, and what it never reached for. Refused and skipped stay
 * two different facts, and both are drawn — a drawing that showed only what
 * happened would answer *what did this run do* and not *what was it stopped
 * from doing*, and the second is the question the strip exists for.
 */
export type LayerItemState = "declared" | "out" | "in" | "refused" | "skipped"

/** The run half of {@link LayerItemState}, as the ledger's `direction` column. */
export type TouchDirection = Exclude<LayerItemState, "declared">

/**
 * One participant under a band — the row a task actually lands on.
 *
 * A band says *llm*; a part says **which** llm, or which role a caller may
 * re-cast: `role: decide`, `model/Orders@v2`, `third_party/app/email`. Reading
 * a plan is reading its parts, because that is the list a world is checked
 * against.
 */
export interface LayerPart {
  id: string
  /** The participant address, or the role — `model/Orders@v2`, `role: decide`. */
  label: string
  /** What the caller still owes, or what the crossing is — `egress: the note`. */
  note?: string
}

export interface LayerBand {
  layer: Layer
  /** Overrides the layer's own name. */
  label?: React.ReactNode
  /** Right of the name — `declared · 1`, `nothing declared`, `2 roles`. */
  note?: string
  /** The participants under it, each its own row. */
  parts?: LayerPart[]
}

/**
 * One task, where it sits and how long it takes.
 *
 * `start` and `end` are in the axis's own unit — a step ordinal under `seq`, a
 * millisecond under `elapsed`. A task with no `end` is an instant and is drawn
 * at the minimum width.
 */
export interface LayerItem {
  id: string
  /** The task. This is the only place a task name is written. */
  label: string
  layer: Layer
  /** The {@link LayerPart} it lands on. Omitted, it sits on the band itself. */
  part?: string
  start: number
  end?: number
  state?: LayerItemState
  /** Under the name — `decide`, `${supplier_id}`, `form: human`. */
  note?: string
  /** The rule that refused it, when one did. */
  ruleMatched?: string
}

/** A bounded repetition over a stretch of the axis — `loop · max 3`. */
export interface LayerBracket {
  id: string
  start: number
  end: number
  label: string
}

/** What the axis counts. */
export type LayerScale = "seq" | "elapsed"

export interface LayerStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
  bands: LayerBand[]
  items: LayerItem[]
  /**
   * `seq` is a plan's time — what happens before what, one unit per step.
   * `elapsed` is a run's, in milliseconds from the run opening.
   */
  scale?: LayerScale
  /** The axis extent. Defaults to the items' own. */
  domain?: [number, number]
  /** Tick positions in axis units. Defaults to integers (`seq`) or five (`elapsed`). */
  ticks?: number[]
  formatTick?: (value: number) => string
  brackets?: LayerBracket[]
  onSelectItem?: (itemId: string) => void
  selectedItem?: string
  /**
   * Keep the band labels in place while time scrolls. On by default: a run with
   * forty steps scrolls, and a band you cannot name is a row of marks.
   */
  frozenLabels?: boolean
  /** The label column, in `rem`. */
  labelWidth?: number
  /** The narrowest the track is drawn before it scrolls, in `rem`. */
  minTrackWidth?: number
}

const STATE_LABEL: Record<LayerItemState, string> = {
  declared: "declared",
  out: "sent",
  in: "read",
  refused: "refused",
  skipped: "skipped",
}

const STATE_BAR: Record<LayerItemState, string> = {
  declared: "border-dashed border-border bg-background",
  out: "border-border bg-accent",
  in: "border-border bg-accent",
  refused: "border-destructive bg-background",
  skipped: "border-dashed border-border bg-background opacity-60",
}

const formatElapsed = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(ms < 10_000 ? 1 : 0)}s`
  const m = Math.floor(ms / 60_000)
  return `${m}m ${Math.round((ms % 60_000) / 1000)}s`
}

/**
 * A plan or a run as layer bands over a time axis — a gantt, not a matrix.
 *
 * **Time is the x axis, in whichever tense the drawing is in.** A plan's time
 * is its order (`seq` — what happens before what); a run's is the wall clock
 * (`elapsed`). Task names are not an axis: a task is a bar, written once where
 * it sits, so a reader answers *what does this engage, and for how long* by
 * scanning across, and *what spends this participant* by scanning down.
 *
 * **A band opens into its participants.** `llm` is a band; `role: decide` and
 * `role: extract` are the rows under it, and the task sits on the row it
 * actually spends. The band alone cannot say which model a step will reach, and
 * that is the list a world is checked against.
 *
 * **Refusals are struck in place, not removed.** A refused engagement keeps its
 * bar and takes a struck label, because the gap it would otherwise leave is
 * indistinguishable from a stretch of time that never reached for that layer.
 *
 * **The spine band is always drawn**, with its wire running the whole axis: the
 * runtime's own dispatches are what the other bands are timed against, and it
 * is never governed.
 *
 * DOM over a fixed track, not canvas: it binds to no canvas store, it lives in
 * `mainSection` where no canvas exists, and frozen row labels plus text
 * selection are free here and expensive there.
 */
export const LayerStrip = React.forwardRef<HTMLDivElement, LayerStripProps>(
  (
    {
      bands,
      items,
      scale = "seq",
      domain,
      ticks,
      formatTick,
      brackets,
      onSelectItem,
      selectedItem,
      frozenLabels = true,
      labelWidth = 14,
      minTrackWidth = 26,
      className,
      ...props
    },
    ref,
  ) => {
    const ends = items.map((i) => i.end ?? i.start + (scale === "seq" ? 1 : 0))
    const starts = items.map((i) => i.start)
    const d0 = domain?.[0] ?? (starts.length ? Math.min(...starts) : 0)
    const d1 = domain?.[1] ?? (ends.length ? Math.max(...ends) : d0 + 1)
    const span = d1 - d0 || 1
    const pct = (value: number) => ((value - d0) / span) * 100

    const axisTicks =
      ticks ??
      (scale === "seq"
        ? Array.from({ length: Math.ceil(span) }, (_, n) => d0 + n)
        : Array.from({ length: 5 }, (_, n) => d0 + (span / 4) * n))

    const tickLabel =
      formatTick ??
      ((value: number) =>
        scale === "seq" ? `${Math.round(value)}` : formatElapsed(value - d0))

    const label = (
      content: React.ReactNode,
      extra?: string,
      indent?: boolean,
    ) => (
      <div
        style={{ width: `${labelWidth}rem` }}
        className={cn(
          "flex shrink-0 items-center gap-1.5 border-border border-r bg-card px-2 py-1",
          indent && "pl-5",
          frozenLabels && "sticky left-0 z-10",
          extra,
        )}
      >
        {content}
      </div>
    )

    const row = (
      key: string,
      head: React.ReactNode,
      track: React.ReactNode,
      dim?: boolean,
    ) => (
      <div
        key={key}
        className={cn(
          "flex min-h-11 border-border border-b last:border-b-0",
          dim && "bg-muted/25",
        )}
      >
        {head}
        <div
          style={{ minWidth: `${minTrackWidth}rem` }}
          className="relative min-w-0 flex-1"
        >
          {track}
        </div>
      </div>
    )

    const bar = (item: LayerItem) => {
      const state = item.state ?? "declared"
      const end = item.end ?? item.start + (scale === "seq" ? 1 : 0)
      const Tag = onSelectItem ? "button" : "div"
      return (
        <Tag
          key={item.id}
          {...(onSelectItem
            ? { type: "button" as const, onClick: () => onSelectItem(item.id) }
            : {})}
          title={[
            item.label,
            STATE_LABEL[state],
            item.note,
            item.ruleMatched,
          ]
            .filter(Boolean)
            .join(" · ")}
          style={
            // A bar is at least readable-wide, and one near the end grows
            // inwards rather than off the track: anchor whichever edge is
            // nearer its own end of the axis, so the moment it names stays
            // true where the reader is looking.
            pct(item.start) > 50
              ? {
                  right: `${100 - pct(end)}%`,
                  width: `max(4.5rem, calc(${pct(end) - pct(item.start)}% - 3px))`,
                }
              : {
                  left: `${pct(item.start)}%`,
                  width: `max(4.5rem, calc(${pct(end) - pct(item.start)}% - 3px))`,
                }
          }
          className={cn(
            "-translate-y-1/2 absolute top-1/2 flex min-w-0 items-stretch gap-1.5 overflow-hidden rounded-xs border py-0.5 pr-1.5 text-left",
            STATE_BAR[state],
            onSelectItem && "cursor-pointer hover:bg-accent",
            selectedItem === item.id && "ring-1 ring-ring",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          )}
        >
          <span
            aria-hidden
            className={cn("w-0.5 shrink-0 rounded-xs", layerSwatch[item.layer])}
          />
          <span className="flex min-w-0 flex-col justify-center">
            <span
              className={cn(
                "truncate font-mono text-meta",
                state === "refused" && "text-destructive line-through",
              )}
            >
              {item.label}
            </span>
            <span className="truncate text-meta text-muted-foreground">
              {item.note ?? (state === "declared" ? null : STATE_LABEL[state])}
            </span>
          </span>
        </Tag>
      )
    }

    const itemsOf = (layer: Layer, part?: string) =>
      items.filter(
        (i) => i.layer === layer && (part ? i.part === part : !i.part),
      )

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-0 overflow-x-auto rounded-control border border-border bg-card",
          className,
        )}
        {...props}
      >
        <div className="min-w-max">
          {/* The axis — time, in the tense the drawing is in. */}
          {row(
            "axis",
            label(
              <>
                <span className="text-meta text-muted-foreground">layer</span>
                <span className="ml-auto text-meta text-muted-foreground/70">
                  {scale === "seq" ? "step" : "elapsed"}
                </span>
              </>,
              "min-h-0 py-1",
            ),
            <div className="absolute inset-0">
              {axisTicks.map((value) => {
                const atEnd = pct(value) > 99
                return (
                  <span
                    key={value}
                    style={atEnd ? { right: 0 } : { left: `${pct(value)}%` }}
                    className={cn(
                      "absolute inset-y-0 text-meta text-muted-foreground",
                      atEnd
                        ? "border-border/60 border-r pr-1"
                        : "border-border/60 border-l pl-1",
                    )}
                  >
                    {tickLabel(value)}
                  </span>
                )
              })}
            </div>,
          )}

          {/* Bounded repetition, over the stretch of time it owns. */}
          {brackets?.length
            ? row(
                "brackets",
                label(
                  <span className="text-meta text-muted-foreground">
                    its bound
                  </span>,
                  "min-h-0 py-1",
                ),
                <div className="absolute inset-0 py-1">
                  {brackets.map((bracket) => (
                    <span
                      key={bracket.id}
                      style={{
                        left: `${pct(bracket.start)}%`,
                        width: `${pct(bracket.end) - pct(bracket.start)}%`,
                      }}
                      className="absolute inset-y-1 flex items-center justify-center truncate rounded-xs border border-border border-dashed px-1 text-meta text-muted-foreground"
                    >
                      {bracket.label}
                    </span>
                  ))}
                </div>,
              )
            : null}

          {bands.map((band) => {
            const own = itemsOf(band.layer)
            const parts = band.parts ?? []
            const dim =
              own.length === 0 &&
              parts.every((part) => itemsOf(band.layer, part.id).length === 0)
            const spine = band.layer === "agent"

            return (
              <React.Fragment key={band.layer}>
                {row(
                  band.layer,
                  label(
                    <>
                      {/* The layer's own name never shrinks: it is what the
                          row is, and the note is the count beside it. */}
                      <span className="shrink-0">
                        {band.label ?? (
                          <LayerChip layer={band.layer} dim={dim} />
                        )}
                      </span>
                      {band.note ? (
                        <span
                          title={band.note}
                          className="ml-auto min-w-0 truncate text-meta text-muted-foreground"
                        >
                          {band.note}
                        </span>
                      ) : null}
                    </>,
                  ),
                  <>
                    {spine ? (
                      <span
                        aria-hidden
                        className="-translate-y-1/2 absolute inset-x-0 top-1/2 border-border border-t"
                      />
                    ) : null}
                    {own.map(bar)}
                  </>,
                  dim && !spine,
                )}
                {parts.map((part) =>
                  row(
                    `${band.layer}-${part.id}`,
                    label(
                      <span className="flex min-w-0 flex-col" title={part.label}>
                        <span className="truncate font-mono text-meta">
                          {part.label}
                        </span>
                        {part.note ? (
                          <span className="truncate text-meta text-muted-foreground">
                            {part.note}
                          </span>
                        ) : null}
                      </span>,
                      undefined,
                      true,
                    ),
                    itemsOf(band.layer, part.id).map(bar),
                  ),
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  },
)
LayerStrip.displayName = "LayerStrip"

export { STATE_LABEL as layerItemLabel }
