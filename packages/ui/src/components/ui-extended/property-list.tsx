import * as React from "react"

import { cn } from "../../lib/utils"

export interface PropertyListProps extends React.HTMLAttributes<HTMLDListElement> {
  /**
   * Width of the label column. One value for the whole list, so every value
   * starts on the same x — the reason to use this rather than a row of flexes.
   */
  labelWidth?: number | string
  children?: React.ReactNode
}

export interface PropertyRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: React.ReactNode
  children?: React.ReactNode
  /** Renders the value in the mono face — an id, a key, a query fragment. */
  mono?: boolean
}

/**
 * What one selected thing *is*, as label/value pairs.
 *
 * The inspector's body: a node's properties, an agent's bindings, a proposal's
 * draft, a run's parameters. A `<dl>` because that is what this is — pairs, not
 * a two-column table and not a form.
 *
 * The label column is fixed by the list rather than by each row, so values line
 * up down the panel. A ragged value column is the thing that makes an inspector
 * read as noise.
 */
export const PropertyList = React.forwardRef<HTMLDListElement, PropertyListProps>(
  ({ labelWidth = 78, className, style, children, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn("flex flex-col", className)}
      style={
        {
          "--property-label-width":
            typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </dl>
  ),
)
PropertyList.displayName = "PropertyList"

export const PropertyRow = React.forwardRef<HTMLDivElement, PropertyRowProps>(
  ({ label, mono, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-baseline gap-2 py-1", className)}
      {...props}
    >
      <dt className="shrink-0 truncate text-meta text-muted-foreground [width:var(--property-label-width,78px)]">
        {label}
      </dt>
      <dd className={cn("min-w-0 flex-1", mono && "font-mono text-meta")}>
        {children}
      </dd>
    </div>
  ),
)
PropertyRow.displayName = "PropertyRow"
