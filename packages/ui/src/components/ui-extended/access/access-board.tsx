import * as React from "react"

import { cn } from "../../../lib/utils"
import { Eyebrow } from "../eyebrow"
import { layerLabel, layerPaint, type Layer, type LayerPalette } from "../layer-chip"
import { formatCount, formatRate, type AccessTargetState } from "./store"

export interface AccessBoardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  targets: AccessTargetState[]
  palette?: LayerPalette
  /** The target being pointed at elsewhere — its tile is washed. */
  focus?: string | null
  /** The target the stream is filtered to — its tile is edged. */
  selected?: string | null
  onFocusChange?: (key: string | null) => void
  onSelectedChange?: (key: string | null) => void
}

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

/**
 * What is being touched right now — one lit tile per target, grouped by layer.
 *
 * **A tile glows by rate, not by touch.** At thousands of touches a second a
 * blink per touch is a strobe that carries nothing; brightness is the rate on a
 * log scale, and it cools over a second or two after the traffic stops, so what
 * was hot a moment ago is still legible. The one motion is a single ring when a
 * cold target wakes — steady traffic glows, it does not flicker.
 *
 * The marks that are not heat are the ones worth reading: a **ring on the
 * light** is a write, a **warning edge** is data leaving (egress), a **struck
 * label on a destructive edge** is a refusal and stays put (its light solid
 * destructive when nothing got through at all), and a **hollow light** is
 * declared and not yet touched. None of these is colour alone — each
 * tile names its state to assistive tech, and the rate prints beside it.
 *
 * DOM, not canvas: a board is a few hundred tiles at most once targets are
 * grouped by layer, a window lands a few times a second, and each lands as one
 * CSS variable per tile — which keeps tooltips, focus, tokens and themes for
 * free. A matrix of thousands of cells over time is a chart, and belongs in
 * `@invana/charts`.
 */
export const AccessBoard = React.forwardRef<HTMLDivElement, AccessBoardProps>(
  (
    { targets, palette, focus, selected, onFocusChange, onSelectedChange, className, ...props },
    ref,
  ) => {
    const groups = React.useMemo(() => {
      const byLayer = new Map<Layer, AccessTargetState[]>()
      for (const t of targets) {
        const list = byLayer.get(t.layer)
        if (list) list.push(t)
        else byLayer.set(t.layer, [t])
      }
      return [...byLayer.entries()]
    }, [targets])

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        {groups.map(([layer, items]) => {
          const rate = items.reduce((sum, t) => sum + t.rate, 0)
          return (
            <section key={String(layer)} className="flex flex-col gap-1">
              <Eyebrow aside={<span className="font-mono">{formatRate(rate)}</span>}>
                {layerLabel(layer)}
              </Eyebrow>
              <div
                role="group"
                aria-label={layerLabel(layer)}
                className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-1"
              >
                {items.map((t) => (
                  <AccessTile
                    key={t.key}
                    target={t}
                    swatch={layerPaint(palette, layer).swatch}
                    focused={focus === t.key}
                    selected={selected === t.key}
                    onFocusChange={onFocusChange}
                    onSelectedChange={onSelectedChange}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    )
  },
)
AccessBoard.displayName = "AccessBoard"

interface AccessTileProps {
  target: AccessTargetState
  swatch: string
  focused: boolean
  selected: boolean
  onFocusChange?: (key: string | null) => void
  onSelectedChange?: (key: string | null) => void
}

const AccessTile = React.memo(function AccessTile({
  target: t,
  swatch,
  focused,
  selected,
  onFocusChange,
  onSelectedChange,
}: AccessTileProps) {
  const ring = React.useRef<HTMLSpanElement>(null)

  // One ring when a cold target wakes. Web Animations rather than a class
  // toggle, so a target that wakes twice restarts cleanly without a render.
  React.useEffect(() => {
    if (t.wokeAt == null || reducedMotion()) return
    ring.current?.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(1.8)" },
      ],
      { duration: 700, easing: "ease-out" },
    )
  }, [t.wokeAt])

  const untouched = t.total === 0
  const writes = t.ops.includes("write")
  const egress = t.ops.includes("egress")
  const state = [
    untouched ? "not touched" : formatRate(t.rate),
    writes && "writing",
    egress && "sending out",
    t.refused && "refused",
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <button
      type="button"
      aria-label={`${t.label}: ${state}`}
      aria-pressed={selected}
      title={`${t.target} · ${formatCount(t.total)} total`}
      onMouseEnter={() => onFocusChange?.(t.key)}
      onMouseLeave={() => onFocusChange?.(null)}
      onFocus={() => onFocusChange?.(t.key)}
      onBlur={() => onFocusChange?.(null)}
      onClick={() => onSelectedChange?.(selected ? null : t.key)}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-control border border-border bg-card px-2 py-1 text-left",
        "transition-colors motion-reduce:transition-none",
        // Rings, not border colours: an inset ring is a box-shadow, so it
        // draws over the global `* { border-color }` in @invana/styling, which
        // is unlayered and outranks every `border-<colour>` utility.
        egress && "ring-1 ring-inset ring-warning",
        t.refused && "ring-1 ring-inset ring-destructive",
        focused && "bg-accent",
        selected && "ring-2 ring-inset ring-primary",
      )}
    >
      <span aria-hidden className="relative size-2.5 shrink-0">
        {t.refused && untouched ? (
          // Stopped before anything went through: the light is the refusal.
          <span className="absolute inset-0 rounded-[2px] bg-destructive" />
        ) : untouched ? (
          <span className="absolute inset-0 rounded-[2px] border border-muted-foreground" />
        ) : (
          <span
            className={cn(
              "absolute inset-0 rounded-[2px] transition-opacity duration-300 motion-reduce:transition-none",
              swatch,
              writes && "ring-1 ring-foreground ring-offset-1 ring-offset-card",
            )}
            // A floor, so a cold light is still a light and not a hole.
            style={{ opacity: 0.18 + 0.82 * t.heat }}
          />
        )}
        <span
          ref={ring}
          className="absolute -inset-0.5 rounded-[3px] opacity-0 ring-2 ring-primary"
        />
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          (untouched || t.refused) && "text-muted-foreground",
          t.refused && "line-through",
        )}
      >
        {t.label}
      </span>
      <span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
        {untouched ? "" : formatRate(t.rate)}
      </span>
    </button>
  )
})
