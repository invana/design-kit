import * as React from "react"

import { cn } from "../../lib/utils"
import { LayerChip, type Layer } from "./layer-chip"

/**
 * What a run did at one participant, in one step.
 *
 * `refused` and `skipped` are two different facts and both are drawn: refused
 * means a bound stopped it, skipped means the plan never reached for it. A
 * drawing that showed only what happened would answer *what did this run do*
 * and not *what was it stopped from doing*, and the second is the question the
 * strip exists for.
 */
export type TouchDirection = "out" | "in" | "refused" | "skipped"

export interface Band {
  layer: Layer
  /** Overrides the layer's own name — `graph data · 4 models`. */
  label?: React.ReactNode
}

export interface StepTouch {
  layer: Layer
  direction: TouchDirection
  /** The participant engaged, for the title and the drill-in. */
  address?: string
  /** The rule that refused it, when one did. */
  ruleMatched?: string
}

export interface Step {
  id: string
  /** What the step is — short, it heads a column. */
  label: string
  /** The ledger's own `seq`, so the drawing and the stream agree. */
  seq?: number
  touches: StepTouch[]
}

export interface LayerStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
  bands: Band[]
  steps: Step[]
  onSelectStep?: (stepId: string) => void
  selectedStep?: string
  /**
   * Keep the band labels in place while the steps scroll. On by default: a run
   * with forty steps scrolls, and a band you cannot name is a row of marks.
   */
  frozenLabels?: boolean
}

const MARK: Record<TouchDirection, string> = {
  out: "bg-primary",
  in: "bg-data-1",
  refused: "bg-destructive",
  skipped: "bg-muted-foreground/30",
}

const MARK_LABEL: Record<TouchDirection, string> = {
  out: "sent",
  in: "read",
  refused: "refused",
  skipped: "skipped",
}

/**
 * A run as six bands and one column per step — what it engaged, in `seq` order.
 *
 * Layers are the bands and steps are the columns, so a reader answers *what did
 * this run touch, and when* by scanning across one band, and *what did this
 * step do* by scanning down one column. The two questions the run dashboard is
 * asked, in one drawing.
 *
 * **Refusals are struck in place, not removed.** A refused engagement keeps its
 * cell and takes a struck mark, because the empty cell it would otherwise leave
 * is indistinguishable from a step that never reached for that layer. *The
 * bound bit here* is the most important thing the drawing can say, and removing
 * the mark is the one edit that makes it unsayable.
 *
 * **The spine band is always drawn**, even when a lens governs nothing in it:
 * the runtime's own dispatches are what the other bands are timed against.
 *
 * DOM over a fixed grid, not canvas: it binds to no canvas store, it lives in
 * `mainSection` where no canvas exists, and frozen row labels plus text
 * selection are free here and expensive there.
 */
export const LayerStrip = React.forwardRef<HTMLDivElement, LayerStripProps>(
  (
    {
      bands,
      steps,
      onSelectStep,
      selectedStep,
      frozenLabels = true,
      className,
      ...props
    },
    ref,
  ) => {
    const byBand = (layer: Layer) =>
      steps.map((step) => ({
        step,
        touch: step.touches.find((t) => t.layer === layer),
      }))

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-0 overflow-x-auto rounded-control border border-border",
          className,
        )}
        {...props}
      >
        <div
          className="grid min-w-max"
          style={{
            gridTemplateColumns: `9rem repeat(${steps.length}, minmax(2.5rem, 1fr))`,
          }}
        >
          {/* Header — the step labels. */}
          <div
            className={cn(
              "border-b border-border bg-background px-2 py-1",
              frozenLabels && "sticky left-0 z-20",
            )}
          >
            <span className="text-meta text-muted-foreground">layer</span>
          </div>
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep?.(step.id)}
              title={step.seq != null ? `${step.label} · seq ${step.seq}` : step.label}
              className={cn(
                "border-b border-l border-border px-1 py-1 text-meta",
                "truncate text-muted-foreground",
                onSelectStep && "cursor-pointer hover:bg-accent",
                selectedStep === step.id && "bg-accent text-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              )}
            >
              {step.label}
            </button>
          ))}

          {/* One row per band. */}
          {bands.map((band) => (
            <React.Fragment key={band.layer}>
              <div
                className={cn(
                  "flex items-center border-b border-border bg-background px-2 py-1",
                  frozenLabels && "sticky left-0 z-10",
                )}
              >
                {band.label ?? <LayerChip layer={band.layer} />}
              </div>
              {byBand(band.layer).map(({ step, touch }) => (
                <div
                  key={`${band.layer}-${step.id}`}
                  title={
                    touch
                      ? `${step.label} · ${MARK_LABEL[touch.direction]}${
                          touch.address ? ` · ${touch.address}` : ""
                        }${touch.ruleMatched ? ` · ${touch.ruleMatched}` : ""}`
                      : undefined
                  }
                  className={cn(
                    "flex items-center justify-center border-b border-l border-border px-1 py-1",
                    selectedStep === step.id && "bg-accent",
                  )}
                >
                  {touch ? (
                    <span
                      aria-label={MARK_LABEL[touch.direction]}
                      className={cn(
                        "h-1.5 w-full max-w-6 rounded-full",
                        MARK[touch.direction],
                        // Struck in place: the mark stays so the cell is not
                        // mistaken for a step that never reached here.
                        touch.direction === "refused" &&
                          "relative after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-translate-y-1/2 after:bg-destructive-foreground/70",
                      )}
                    />
                  ) : (
                    <span aria-hidden className="text-muted-foreground/25">
                      ·
                    </span>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  },
)
LayerStrip.displayName = "LayerStrip"

export { MARK_LABEL as touchLabel }
