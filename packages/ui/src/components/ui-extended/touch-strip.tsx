import * as React from "react";

import { cn } from "../../lib/utils";
import {
  layerLabel,
  layerPaint,
  type Layer,
  type LayerPalette,
} from "./layer-chip";

export interface TouchItem {
  layer: Layer;
  /** What it amounts to — `3 calls`, `1,284 rows`, `miss`, `asked + approved`. */
  note?: React.ReactNode;
  /** What to call it, when {@link layerLabel} is not what this surface says. */
  label?: React.ReactNode;
  /** A guardrail said no. Struck in place, never dropped. */
  refused?: boolean;
  /** Allowed, and nothing reached for it. Present, and visibly not in play. */
  dim?: boolean;
}

export interface TouchStripProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  items: TouchItem[];
  palette?: LayerPalette;
  /**
   * `row` (default) is one cell per layer on one line, above a trace. `column`
   * is one line per layer, the note right-aligned — how a 420px panel reads the
   * same summary, where six cells on a line would truncate every note.
   */
  orientation?: "row" | "column";
}

/**
 * What a run touched at all — one cell per layer, on one line.
 *
 * This is a **summary**, and the whole reason it is a strip and not an axis.
 * *What did this touch* is answered once for the whole run, so it costs one
 * line above the list; drawn as a band per layer down a trace it would be a
 * matrix one sixth full, because a step spends exactly one layer.
 *
 * **Refused is struck in place and never touched is dimmed, and neither is
 * hidden.** The gap between what a world allowed and what the run reached for
 * is the finding: three layers allowed and never touched is an invitation to
 * narrow, and a refusal is an invitation to widen or to accept that the graph
 * cannot answer. A strip that showed only what was spent could say neither.
 */
export const TouchStrip = React.forwardRef<HTMLDivElement, TouchStripProps>(
  ({ items, palette, orientation = "row", className, ...props }, ref) =>
    orientation === "column" ? (
      <div
        ref={ref}
        role="list"
        className={cn("flex flex-col", className)}
        {...props}
      >
        {items.map((item) => {
          const paint = layerPaint(palette, item.layer);
          return (
            <div
              key={String(item.layer)}
              role="listitem"
              className="flex min-w-0 items-center gap-2 py-1"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2 shrink-0 rounded-[2px]",
                  item.dim ? "bg-muted-foreground/30" : paint.swatch,
                )}
              />
              {/* The label is what is struck: *third party* is the thing the
                  guardrail said no to, and the note only says so. */}
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  item.dim && "text-muted-foreground",
                  item.refused && "line-through",
                )}
              >
                {item.label ?? layerLabel(item.layer)}
              </span>
              {item.note != null ? (
                <span className="shrink-0 truncate font-mono text-sm text-muted-foreground">
                  {item.note}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    ) : (
      <div
        ref={ref}
        role="list"
        className={cn("flex flex-wrap gap-2", className)}
        {...props}
      >
        {items.map((item) => {
          const paint = layerPaint(palette, item.layer);
          return (
            <div
              key={String(item.layer)}
              role="listitem"
              className={cn(
                "flex min-w-0 flex-1 flex-col gap-px rounded-control border border-border bg-card px-2 py-1",
                item.dim && "opacity-55",
              )}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    item.dim ? "bg-muted-foreground" : paint.swatch,
                  )}
                />
                <span
                  className={cn(
                    "min-w-0 truncate",
                    item.dim && "text-muted-foreground",
                  )}
                >
                  {item.label ?? layerLabel(item.layer)}
                </span>
              </span>
              {item.note != null ? (
                <span
                  className={cn(
                    "truncate font-mono text-xs text-muted-foreground",
                    item.refused && "line-through",
                  )}
                >
                  {item.note}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    ),
);
TouchStrip.displayName = "TouchStrip";
