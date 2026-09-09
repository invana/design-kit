import * as React from "react"

import { cn } from "../../lib/utils"

export type LegendSwatchKind = "dot" | "line" | "dashed" | "arrow" | "ring"

export interface LegendItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /**
   * What the mark looks like on the canvas. A legend that draws a dot for
   * something rendered as a dashed line is worse than no legend.
   */
  kind?: LegendSwatchKind
  /**
   * The mark's colour — a CSS colour or, preferably, a data-palette token:
   * `var(--color-data-3)`. Defaults to the current text colour.
   */
  color?: string
  label: React.ReactNode
  /** Trailing count — `1,912`, `52,100`. */
  count?: React.ReactNode
}

export interface LegendProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `row` wraps inline under a canvas; `column` stacks in a panel. */
  orientation?: "row" | "column"
  children?: React.ReactNode
}

function Swatch({ kind = "dot", color }: { kind?: LegendSwatchKind; color?: string }) {
  const style = { color } as React.CSSProperties
  if (kind === "dot")
    return (
      <span
        aria-hidden
        style={style}
        className="size-2 shrink-0 rounded-full bg-current"
      />
    )
  if (kind === "ring")
    return (
      <span
        aria-hidden
        style={style}
        className="size-2 shrink-0 rounded-full border-[1.5px] border-current"
      />
    )
  if (kind === "line")
    return <span aria-hidden style={style} className="h-0.5 w-4 shrink-0 bg-current" />
  if (kind === "dashed")
    return (
      <span
        aria-hidden
        style={style}
        className="h-0 w-4 shrink-0 border-t-[1.5px] border-dashed border-current"
      />
    )
  // arrow — a line that says which way the relationship points.
  //
  // Drawn as one SVG rather than a div plus a border-triangle. The border trick
  // needs a zero-size box, which a flex parent stretches, and its colour fights
  // the global `* { border-color }` rule — two ways to render a grey square
  // instead of an arrowhead. `currentColor` keeps it themeable either way.
  return (
    <svg
      aria-hidden
      style={style}
      className="w-4 shrink-0 overflow-visible"
      viewBox="0 0 16 6"
      height="6"
      fill="none"
    >
      <path d="M0 3h11" stroke="currentColor" strokeWidth="2" />
      <path d="M10 0l6 3-6 3z" fill="currentColor" />
    </svg>
  )
}

/**
 * What the colours on a canvas mean.
 *
 * Every canvas in the system carries one: node types, edge kinds, run outcomes,
 * schedule firings, plan dependencies. It is the other half of the rule that
 * colour never carries meaning alone — the palette says which hue, the legend
 * says what the hue is.
 *
 * `kind` exists because these canvases draw more than dots. A dependency that
 * renders as a dashed arrow needs a dashed arrow in the legend, or the legend
 * is describing a different picture.
 */
export const Legend = React.forwardRef<HTMLDivElement, LegendProps>(
  ({ orientation = "row", className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="list"
      className={cn(
        "flex gap-x-3 gap-y-1 text-meta",
        orientation === "row" ? "flex-wrap items-center" : "flex-col",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
Legend.displayName = "Legend"

export const LegendItem = React.forwardRef<HTMLDivElement, LegendItemProps>(
  ({ kind, color, label, count, className, ...props }, ref) => (
    <div
      ref={ref}
      role="listitem"
      className={cn("flex min-w-0 items-center gap-1.5", className)}
      {...props}
    >
      <Swatch kind={kind} color={color} />
      <span className="truncate">{label}</span>
      {count != null ? (
        <span className="shrink-0 text-muted-foreground">{count}</span>
      ) : null}
    </div>
  ),
)
LegendItem.displayName = "LegendItem"
