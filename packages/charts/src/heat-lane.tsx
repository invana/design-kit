import * as React from "react"
import { cn } from "@invana/ui"

/** A cell that is more than how busy it was: a guardrail said no, or data left the boundary. */
export interface HeatLaneMark {
  /** The cell's index. */
  at: number
  /** `refused` — a rule stopped it; `egress` — data crossed to a third party or a model. */
  kind: "refused" | "egress"
}

export interface HeatLaneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * How busy each slice of time was, `0`–`1`, oldest first. `0` is touched and
   * idle — a faint cell; `null` is not touched at all — a hollow one.
   */
  values: (number | null)[]
  marks?: HeatLaneMark[]
  /** The cell held open — drawn ringed. */
  pinned?: number | null
  /** Makes every lit cell a button: it receives the cell's index, or `null` to let it go. */
  onPin?: (at: number | null) => void
  /** What each cell's title says — `4.25–4.50 s`. Defaults to its index. */
  cellLabel?: (at: number) => string
  /**
   * The lit cells' fill, as a class — `bg-info`, `bg-data-3`. The lane's
   * busyness is the cell's opacity, so one hue carries the whole lane.
   * @default "bg-info"
   */
  fill?: string
  /** No signal: the lane is dimmed, not cooled — it does not know, rather than knows it is quiet. */
  stale?: boolean
}

const MARK: Record<HeatLaneMark["kind"], string> = {
  refused: "bg-destructive",
  egress: "bg-warning",
}

/**
 * One lane of busyness over time: a cell per slice, brighter where it was
 * busier.
 *
 * The lanes of a layer-activity drawing, one per layer, sharing an axis — so
 * *which layers were busy, and when* is read down the column rather than
 * from numbers. **Not touched and touched-but-idle are different cells**:
 * hollow is *nothing reached for it*, faint is *it was there and quiet*. A
 * refusal or a crossing is marked in its cell in a status colour, never a
 * brighter one, so it is not mistaken for load.
 *
 * The cells stretch to the lane's width: the axis is the same for every lane,
 * whatever the width it is drawn at.
 */
export const HeatLane = React.forwardRef<HTMLDivElement, HeatLaneProps>(
  ({ values, marks, pinned, onPin, cellLabel, fill = "bg-info", stale, className, style, ...props }, ref) => {
    const markAt = React.useMemo(() => new Map((marks ?? []).map((m) => [m.at, m.kind])), [marks])
    return (
      <div
        ref={ref}
        className={cn("grid h-3 gap-px", stale && "opacity-40 grayscale", className)}
        style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`, ...style }}
        {...props}
      >
        {values.map((v, i) => {
          const mark = markAt.get(i)
          const label = `${cellLabel ? cellLabel(i) : i}${mark ? ` · ${mark}` : v == null ? " · not touched" : ""}`
          const cls = cn(
            "block h-full min-w-0 rounded-[1px]",
            mark ? MARK[mark] : v == null ? "border border-border" : v === 0 ? "bg-muted" : fill,
            pinned === i && "ring-1 ring-foreground ring-offset-1 ring-offset-background",
          )
          const opacity = mark || v == null || v === 0 ? undefined : Math.max(0.18, Math.min(1, v))
          return onPin && v != null ? (
            <button
              key={i}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={pinned === i}
              className={cn(cls, "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring")}
              style={{ opacity }}
              onClick={() => onPin(pinned === i ? null : i)}
            />
          ) : (
            <span key={i} title={label} className={cls} style={{ opacity }} />
          )
        })}
      </div>
    )
  },
)
HeatLane.displayName = "HeatLane"
