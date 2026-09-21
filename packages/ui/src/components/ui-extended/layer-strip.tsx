import { ChevronDown, ChevronRight } from "lucide-react"
import * as React from "react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card"
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
   * The bands whose participants are folded away, uncontrolled. Their tasks do
   * not disappear with them: they drop onto the band's own line, which is the
   * whole point of shutting one.
   */
  defaultCollapsed?: Layer[]
  /** The same, controlled. Pass it with `onCollapsedChange`. */
  collapsed?: Layer[]
  onCollapsedChange?: (layers: Layer[]) => void
  /**
   * Offer the disclosures at all. Off, the bands render as given and a caller
   * that wants an overview passes the bands it wants shut in `collapsed`.
   */
  collapsible?: boolean
  /**
   * A hover card on each task, saying what the bar cannot fit: the participant
   * it spends, when it runs and for how long, and the rule that refused it. On
   * by default; off falls back to the native `title`.
   */
  hoverDetail?: boolean
  /** What that card says, when the default is not what this surface owes. */
  itemDetail?: (item: LayerItem) => React.ReactNode
  /**
   * Keep the band labels in place while time scrolls. On by default: a run with
   * forty steps scrolls, and a band you cannot name is a row of marks.
   */
  frozenLabels?: boolean
  /** The label column, in `rem`. */
  labelWidth?: number
  /** The narrowest the track is drawn before it scrolls, in `rem`. */
  minTrackWidth?: number
  /**
   * The narrowest one tick may be squeezed to, in `rem`. Past that the strip
   * scrolls rather than shrinking: a bar too narrow to carry its task's name
   * has stopped being a drawing of that task.
   */
  minSlotWidth?: number
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
 * **A band folds its participants away without losing its tasks.** Shut, the
 * rows go and every task the layer spends drops onto the band's own line —
 * which is the overview: six lines, every task placed in time, *what was this
 * layer busy with* answered without reading twelve rows. Open, the same tasks
 * sit on the participant that spends them. `collapse all` in the header does it
 * to every band that has participants to fold, and nothing is hidden either
 * way: folding moves a task up a row, it never drops it.
 *
 * **A bar says what it is; hovering it says what it cannot fit.** The card
 * carries the participant the row truncates or folding took away, when the task
 * runs and for how long, and the rule that refused it — so a bar can stay a bar
 * rather than growing a second line for every fact somebody might want.
 *
 * **Refusals are struck in place, not removed.** A refused engagement keeps its
 * bar and takes a struck label, because the gap it would otherwise leave is
 * indistinguishable from a stretch of time that never reached for that layer.
 *
 * **A row nothing spent is drawn muted, never dropped.** A band no task
 * touched recedes to the muted ground with its chip and its note, and so does a
 * participant row under an open band — `role: extract` declared and never
 * reached reads as *this run did not get that far*, not as an ordinary empty
 * row. A dropped row would say nothing at all, and *this plan never reaches for
 * a cache* is a finding.
 *
 * **Refused is not unspent.** A row whose only task was refused keeps its full
 * weight: being stopped from reaching a participant and never reaching for one
 * are the two facts this drawing exists to separate.
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
      hoverDetail = true,
      itemDetail,
      defaultCollapsed,
      collapsed,
      onCollapsedChange,
      collapsible = true,
      frozenLabels = true,
      labelWidth = 14,
      minTrackWidth = 26,
      minSlotWidth = 6,
      className,
      ...props
    },
    ref,
  ) => {
    const [ownCollapsed, setOwnCollapsed] = React.useState<Layer[]>(
      defaultCollapsed ?? [],
    )
    const shut = collapsed ?? ownCollapsed
    const setShut = (next: Layer[]) => {
      if (collapsed == null) setOwnCollapsed(next)
      onCollapsedChange?.(next)
    }
    const withParts = bands.filter((b) => (b.parts?.length ?? 0) > 0)
    // *All* means every band that has anything to fold. A band with no parts is
    // already its own overview, and counting it would leave the header control
    // saying *expand all* over a strip that is fully open.
    const allShut =
      withParts.length > 0 &&
      withParts.every((b) => shut.includes(b.layer))

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

    const trackFloor = Math.max(minTrackWidth, axisTicks.length * minSlotWidth)

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
          style={{ minWidth: `${trackFloor}rem` }}
          className="relative min-w-0 flex-1"
        >
          {track}
        </div>
      </div>
    )

    const partOf = (item: LayerItem) =>
      item.part
        ? bands
            .find((b) => b.layer === item.layer)
            ?.parts?.find((p) => p.id === item.part)
        : undefined

    /** When a bar runs, in the axis's own words. */
    const spanLabel = (item: LayerItem) => {
      const end = item.end ?? item.start + (scale === "seq" ? 1 : 0)
      if (scale === "seq") {
        return end - item.start <= 1
          ? `step ${item.start}`
          : `steps ${item.start}\u2013${end - 1}`
      }
      return `${formatElapsed(item.start - d0)} \u2192 ${formatElapsed(
        end - d0,
      )} \u00b7 ${formatElapsed(end - item.start)}`
    }

    /**
     * What the bar could not fit. A row per fact, in the order a reader asks
     * them: *what ran* is the heading, then **which participant** — the answer
     * the band alone cannot give — then when, then why it did not run.
     */
    const detail = (item: LayerItem) => {
      if (itemDetail) return itemDetail(item)
      const state = item.state ?? "declared"
      const part = partOf(item)
      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "min-w-0 flex-1 truncate font-mono text-base",
                state === "refused" && "text-destructive line-through",
              )}
            >
              {item.label}
            </span>
            <span
              className={cn(
                "shrink-0 text-sm",
                state === "refused"
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {STATE_LABEL[state]}
            </span>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
            <dt className="text-muted-foreground">layer</dt>
            <dd className="min-w-0">
              <LayerChip layer={item.layer} />
            </dd>
            {part ? (
              <>
                <dt className="text-muted-foreground">participant</dt>
                <dd className="min-w-0 break-all font-mono">{part.label}</dd>
              </>
            ) : null}
            <dt className="text-muted-foreground">when</dt>
            <dd className="min-w-0 tabular-nums">{spanLabel(item)}</dd>
            {item.note ? (
              <>
                <dt className="text-muted-foreground">what it does</dt>
                <dd className="min-w-0 font-mono">{item.note}</dd>
              </>
            ) : null}
            {item.ruleMatched ? (
              <>
                <dt className="text-muted-foreground">refused by</dt>
                <dd className="min-w-0 break-all font-mono text-destructive">
                  {item.ruleMatched}
                </dd>
              </>
            ) : null}
          </dl>
        </div>
      )
    }

    /**
     * `compact` is the collapsed reading: every task of a band on the band's
     * own line. It drops the minimum width and the second line, because on one
     * line the bars are answering *when was this layer busy* — the labels are
     * what the band's participants say when it is open.
     */
    const bar = (item: LayerItem, compact = false) => {
      const state = item.state ?? "declared"
      const end = item.end ?? item.start + (scale === "seq" ? 1 : 0)
      const min = compact ? "0.75rem" : "4.5rem"
      const Tag = onSelectItem ? "button" : "div"
      const drawn = (
        <Tag
          key={item.id}
          {...(onSelectItem
            ? { type: "button" as const, onClick: () => onSelectItem(item.id) }
            : {})}
          // The native tooltip is the fallback, not a second copy: with the
          // hover card on, two tooltips would open over one bar.
          title={
            hoverDetail
              ? undefined
              : [item.label, STATE_LABEL[state], item.note, item.ruleMatched]
                  .filter(Boolean)
                  .join(" · ")
          }
          style={
            // A bar is at least readable-wide, and one near the end grows
            // inwards rather than off the track: anchor whichever edge is
            // nearer its own end of the axis, so the moment it names stays
            // true where the reader is looking.
            pct(item.start) > 50
              ? {
                  right: `${100 - pct(end)}%`,
                  width: `max(${min}, calc(${pct(end) - pct(item.start)}% - 3px))`,
                }
              : {
                  left: `${pct(item.start)}%`,
                  width: `max(${min}, calc(${pct(end) - pct(item.start)}% - 3px))`,
                }
          }
          className={cn(
            "-translate-y-1/2 absolute top-1/2 flex min-w-0 items-stretch overflow-hidden rounded-xs border py-0.5 text-left",
            compact ? "gap-1 pr-1" : "gap-1.5 pr-1.5",
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
                "truncate font-mono text-sm",
                state === "refused" && "text-destructive line-through",
              )}
            >
              {item.label}
            </span>
            {compact ? null : (
              <span className="truncate text-sm text-muted-foreground">
                {item.note ?? (state === "declared" ? null : STATE_LABEL[state])}
              </span>
            )}
          </span>
        </Tag>
      )

      if (!hoverDetail) return drawn
      return (
        <HoverCard key={item.id} openDelay={140} closeDelay={80}>
          <HoverCardTrigger asChild>{drawn}</HoverCardTrigger>
          <HoverCardContent
            align="start"
            side="top"
            className="w-auto max-w-80 p-3"
          >
            {detail(item)}
          </HoverCardContent>
        </HoverCard>
      )
    }

    const itemsOf = (layer: Layer, part?: string) =>
      items.filter(
        (i) => i.layer === layer && (part ? i.part === part : !i.part),
      )

    /** Everything the band owns, its participants' included — the shut reading. */
    const allOf = (layer: Layer) => items.filter((i) => i.layer === layer)

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
                {collapsible && withParts.length > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setShut(allShut ? [] : withParts.map((b) => b.layer))
                    }
                    className="-ml-1 flex items-center gap-0.5 rounded-xs px-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {allShut ? (
                      <ChevronRight aria-hidden className="size-3 shrink-0" />
                    ) : (
                      <ChevronDown aria-hidden className="size-3 shrink-0" />
                    )}
                    {allShut ? "expand all" : "collapse all"}
                  </button>
                ) : (
                  <span className="text-sm text-muted-foreground">layer</span>
                )}
                <span className="ml-auto text-sm text-muted-foreground/70">
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
                      "absolute inset-y-0 text-sm text-muted-foreground",
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
                  <span className="text-sm text-muted-foreground">
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
                      className="absolute inset-y-1 flex items-center justify-center truncate rounded-xs border border-border border-dashed px-1 text-sm text-muted-foreground"
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
            const dim = allOf(band.layer).length === 0
            const spine = band.layer === "agent"
            const foldable = collapsible && parts.length > 0
            const isShut = foldable && shut.includes(band.layer)
            const onLine = isShut ? allOf(band.layer) : own

            return (
              <React.Fragment key={band.layer}>
                {row(
                  band.layer,
                  label(
                    <>
                      {/* The layer's own name never shrinks: it is what the
                          row is, and the note is the count beside it. */}
                      {foldable ? (
                        <button
                          type="button"
                          aria-expanded={!isShut}
                          aria-label={`${isShut ? "Show" : "Hide"} the ${
                            parts.length
                          } participants under ${band.layer}`}
                          onClick={() =>
                            setShut(
                              isShut
                                ? shut.filter((l) => l !== band.layer)
                                : [...shut, band.layer],
                            )
                          }
                          className="-ml-1 flex shrink-0 items-center gap-1 rounded-xs px-1 hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {isShut ? (
                            <ChevronRight
                              aria-hidden
                              className="size-3 shrink-0 text-muted-foreground"
                            />
                          ) : (
                            <ChevronDown
                              aria-hidden
                              className="size-3 shrink-0 text-muted-foreground"
                            />
                          )}
                          {band.label ?? (
                            <LayerChip layer={band.layer} dim={dim} />
                          )}
                        </button>
                      ) : (
                        <span className="shrink-0 pl-4">
                          {band.label ?? (
                            <LayerChip layer={band.layer} dim={dim} />
                          )}
                        </span>
                      )}
                      {band.note ? (
                        <span
                          title={band.note}
                          className={cn(
                            "ml-auto min-w-0 truncate text-sm",
                            dim
                              ? "text-muted-foreground/70"
                              : "text-muted-foreground",
                          )}
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
                    {onLine.map((item) => bar(item, isShut))}
                  </>,
                  dim && !spine,
                )}
                {(isShut ? [] : parts).map((part) => {
                  const spent = itemsOf(band.layer, part.id)
                  // Unspent, not missing. A participant the run never reached
                  // recedes exactly as far as a band nothing touched, and no
                  // further: it is still named, and it is still in the list a
                  // world is checked against.
                  const unspent = spent.length === 0
                  return row(
                    `${band.layer}-${part.id}`,
                    label(
                      <span className="flex min-w-0 flex-col" title={part.label}>
                        <span
                          className={cn(
                            "truncate font-mono text-sm",
                            unspent && "text-muted-foreground/70",
                          )}
                        >
                          {part.label}
                        </span>
                        {part.note ? (
                          <span
                            className={cn(
                              "truncate text-sm",
                              unspent
                                ? "text-muted-foreground/70"
                                : "text-muted-foreground",
                            )}
                          >
                            {part.note}
                          </span>
                        ) : null}
                      </span>,
                      undefined,
                      true,
                    ),
                    spent.map((item) => bar(item)),
                    unspent,
                  )
                })}
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
