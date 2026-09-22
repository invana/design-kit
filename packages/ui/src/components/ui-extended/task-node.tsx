import * as React from "react"

import { cn } from "../../lib/utils"
import { StatusDot, type StatusDotProps } from "../ui/status-dot"
import { BoundChip, type Bound, type BoundPalette } from "./bound-chip"

export interface TaskNodeTag {
  /** `3 lanes`, `attempt 2`, `map_over: datasets`. */
  label: React.ReactNode
  /** `warning` for a retry or a hold; plain otherwise. */
  tone?: "default" | "warning"
}

export interface TaskNodeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The task's `step_key`. Mono, because it is an identifier. */
  taskKey: React.ReactNode
  /** What it may spend. */
  bound: Bound
  /** The bound's swatch class, given directly — `bg-data-7`. */
  boundSwatch?: string
  /** The bounds' palette, when a caller would rather state the map once. */
  boundPalette?: BoundPalette
  /**
   * How it went, when this node is painting a **run**. Omit when the node is
   * painting a plan or a draft, which have no status of their own.
   */
  status?: StatusDotProps["tone"]
  /** Chips on the bound line — lanes, attempts, a `map_over`. */
  tags?: TaskNodeTag[]
  /**
   * The one line under the chips: what it did (`1,204 of 1,251 · 1.2s`), what
   * it will do (`when: counts differ`), or how it usually behaves
   * (`p50 3.4s · 14/14`). One rendering, three readings.
   */
  meta?: React.ReactNode
  /**
   * The drawing is a **record**, not a draft: a picked node gets the ring and
   * **no handles**.
   *
   * Handles are an offer to move something. A run paints status onto the plan
   * it ran and nothing on it is editable, so a handle there is a control that
   * does nothing — the one thing worse on a trace than a missing affordance.
   */
  readOnly?: boolean
  /** Picked — draws the ring and four corner handles. */
  selected?: boolean
  /** Needs an approval before it writes. Rings it in `warning`. */
  gate?: boolean
  /** Did not run on this pass — present in the plan, absent from the trace. */
  dim?: boolean
  /** A placeholder slot on a draft canvas: dashed, no fill, no content of its own. */
  ghost?: boolean
}

/**
 * One task in a flow, as a card.
 *
 * The same card serves three renderings, which is the point: a **run** paints
 * status onto it, a **plan** paints medians, a **draft** paints handles. One
 * component, so the three views cannot drift into three different pictures of
 * the same graph.
 *
 * It is presentational and knows nothing about a canvas — no position, no
 * camera, no store. Whatever lays a flow out places these; that is why the card
 * lives here rather than in `@invana/canvas-ui`, and why `selected` is a prop
 * rather than something read from a selection.
 */
export const TaskNode = React.forwardRef<HTMLDivElement, TaskNodeProps>(
  (
    {
      taskKey,
      bound,
      boundSwatch,
      boundPalette,
      status,
      tags,
      meta,
      selected,
      readOnly,
      gate,
      dim,
      ghost,
      className,
      ...props
    },
    ref,
  ) => {
    if (ghost) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex w-[146px] flex-col gap-1 border border-dashed border-border p-2",
            "text-sm text-muted-foreground",
            className,
          )}
          {...props}
        >
          <span className="truncate font-mono">{taskKey}</span>
          {meta != null ? <span className="truncate">{meta}</span> : null}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        data-selected={selected || undefined}
        className={cn(
          "relative flex w-[146px] flex-col gap-1 border bg-card p-2 shadow-xs",
          // The ring says one thing at a time, in this order: you picked it,
          // it is held for approval, it failed. A node cannot be two of those.
          selected
            ? "border-primary ring-2 ring-primary/25"
            : gate
              ? "border-warning"
              : status === "error"
                ? "border-destructive"
                : "border-border",
          dim && "opacity-45",
          className,
        )}
        {...props}
      >
        {selected && !readOnly
          ? ["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(
              (pos) => (
                <span
                  key={pos}
                  aria-hidden
                  className={cn("absolute size-[7px] border-[1.5px] border-primary bg-card", pos)}
                />
              ),
            )
          : null}

        <div className="flex items-center gap-1.5">
          {status ? <StatusDot tone={status} size="sm" /> : null}
          <span className="min-w-0 truncate font-mono">{taskKey}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <BoundChip bound={bound} swatch={boundSwatch} palette={boundPalette} />
          {tags?.map((tag, i) => (
            <span
              key={i}
              className={cn(
                "shrink-0 border px-1 text-sm",
                tag.tone === "warning"
                  ? "border-warning/40 text-warning"
                  : "border-border text-muted-foreground",
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {meta != null ? (
          <div
            className={cn(
              "truncate text-sm",
              gate ? "text-warning" : "text-muted-foreground",
            )}
          >
            {meta}
          </div>
        ) : null}
      </div>
    )
  },
)
TaskNode.displayName = "TaskNode"
