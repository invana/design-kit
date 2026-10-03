import * as React from "react"

import { cn } from "../../lib/utils"
import { Eyebrow } from "./eyebrow"

export interface FloatingPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** What the panel is — `Activity`, `Logs`. */
  title: React.ReactNode
  /** Beside the title — a `live` dot, a count, a view switch. */
  aside?: React.ReactNode
  /** Folded to its bar: the body is hidden and `summary` takes the title's room. */
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** What a folded panel still says — `● 3 · 4 layers`. */
  summary?: React.ReactNode
  /** Shows a close control at the end of the bar. */
  onClose?: () => void
  /** Under the body, above the edge — a total, a link out. */
  footer?: React.ReactNode
  children?: React.ReactNode
  bodyClassName?: string
}

const glyph = "size-3.5"

function FoldGlyph({ collapsed }: { collapsed?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={glyph} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {collapsed ? <rect x="3" y="3" width="10" height="10" rx="1" /> : <path d="M3 8h10" />}
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={glyph} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  )
}

const barButton =
  "inline-flex size-control-xs shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

/**
 * A panel that floats over the work — the run's activity, its log — rather
 * than taking a split of it.
 *
 * It stays open over the work, so it is drawn as a card that is lifted — the
 * card ground, a border and a shadow — and not as a popover, which is the
 * ground of what opens and closes in a moment. Its bar is chrome, as every
 * panel's header is.
 *
 * It sits **on** a canvas, so it can be folded to its bar and closed: a panel
 * that could only be moved out of the way by resizing the work would be a
 * split, and a split is `AppLayoutV2`'s. Folded, it keeps one line of what it
 * would say, so folding it never hides that something is happening.
 *
 * Content-height up to its parent, then its body scrolls: two of these stacked
 * in a column share the height between them.
 */
export const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(
  (
    {
      title,
      aside,
      collapsed = false,
      onCollapsedChange,
      summary,
      onClose,
      footer,
      className,
      bodyClassName,
      children,
      ...props
    },
    ref,
  ) => (
    <section
      ref={ref}
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-hidden rounded-surface border border-border bg-card text-card-foreground shadow-lg",
        className,
      )}
      {...props}
    >
      <header className="flex h-control-md shrink-0 items-center gap-2 border-b border-border bg-chrome pl-3 pr-1.5 data-[collapsed]:border-b-0" data-collapsed={collapsed || undefined}>
        <Eyebrow className="shrink-0">{title}</Eyebrow>
        <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground">
          {collapsed && summary != null ? <span className="min-w-0 truncate">{summary}</span> : aside}
        </div>
        {onCollapsedChange ? (
          <button
            type="button"
            className={barButton}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand" : "Collapse"}
            title={collapsed ? "Expand" : "Collapse"}
            onClick={() => onCollapsedChange(!collapsed)}
          >
            <FoldGlyph collapsed={collapsed} />
          </button>
        ) : null}
        {onClose ? (
          <button type="button" className={barButton} aria-label="Close" title="Close" onClick={onClose}>
            <CloseGlyph />
          </button>
        ) : null}
      </header>
      {collapsed ? null : (
        <>
          <div className={cn("min-h-0 flex-1 overflow-y-auto", bodyClassName)}>{children}</div>
          {footer != null ? (
            <div className="flex shrink-0 items-center gap-2 border-t border-border px-3 py-1.5 text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </>
      )}
    </section>
  ),
)
FloatingPanel.displayName = "FloatingPanel"
