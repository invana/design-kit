'use client'

import * as React from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable"

export interface PanelStackSection {
  /** Unique identifier for the section within the stack. */
  id: string
  /**
   * Header content in the always-visible title bar. A plain string gets the
   * default VS-Code header styling (compact, uppercase, muted). Pass any
   * React node (an element with your own icon, badges, colours, casing…) to
   * take full control — the node is rendered as-is, without the forced
   * typography.
   */
  title: React.ReactNode
  /** Body content, revealed when the section is expanded and scrolled within. */
  content: React.ReactNode
  /** Optional leading icon component, shown before the title. */
  icon?: React.ElementType
  /**
   * Header actions (buttons, badges) rendered on the right of the title bar.
   * Only shown while the section is expanded, mirroring VS Code's view header.
   */
  actions?: React.ReactNode
  /** Start the section collapsed (header only). Defaults to `false`. */
  defaultCollapsed?: boolean
  /**
   * Initial expanded size, as a share of the stack. A number/`"%"` string is a
   * percentage; append `px`/`rem`/`vh` for absolute units. When omitted, the
   * remaining height is split evenly across the expanded sections.
   */
  defaultSize?: number | string
  /**
   * Minimum expanded size (below which a drag collapses the section). Defaults
   * to `headerHeight + 64` px so an expanded section always shows some content.
   */
  minSize?: number | string
}

export interface PanelStackProps {
  /** Ordered list of sections that make up the stack. */
  sections: PanelStackSection[]
  /**
   * Height of each section's title bar, in pixels. Doubles as the collapsed
   * size so a collapsed section shows only its header. Defaults to `35`.
   */
  headerHeight?: number
  /** Show a grip in the drag dividers between expanded sections. */
  withHandle?: boolean
  /** Extra classes merged onto the outer group (it fills its parent by default). */
  className?: string
  /** Extra classes merged onto every section header. */
  headerClassName?: string
  /** Extra classes merged onto every section body. */
  bodyClassName?: string
}

/**
 * A vertical stack of collapsible, resizable panels — the VS Code "view
 * container" layout. Every section header stays visible; expanding a section
 * fills the remaining column height, and when several are open they share that
 * height with draggable dividers between them ("show both partially"). Each
 * section collapses to just its header, independently of the others.
 *
 * Unlike an `Accordion` (whose panels size to their content), a `PanelStack`
 * fills the full height of its container, so wrap it in a sized parent
 * (`h-screen`, a flex/grid track, a fixed-height sidebar…).
 *
 * ```tsx
 * <div className="h-screen w-72">
 *   <PanelStack
 *     sections={[
 *       { id: "changes", title: "Changes", content: <ChangesList /> },
 *       { id: "graph", title: "Graph", content: <CommitGraph /> },
 *     ]}
 *   />
 * </div>
 * ```
 */
export function PanelStack({
  sections,
  headerHeight = 35,
  withHandle = false,
  className,
  headerClassName,
  bodyClassName,
}: PanelStackProps) {
  const refs = React.useRef<Record<string, PanelImperativeHandle | null>>({})
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((s) => [s.id, !!s.defaultCollapsed]))
  )

  // Collapse the sections marked `defaultCollapsed` once, before first paint.
  // The panels mount expanded (so the library records a restore size), then we
  // collapse them synchronously — no visible flash.
  const didInit = React.useRef(false)
  React.useLayoutEffect(() => {
    if (didInit.current) return
    didInit.current = true
    for (const section of sections) {
      if (section.defaultCollapsed) refs.current[section.id]?.collapse()
    }
    // Run once on mount; section identity is stable for the stack's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = (id: string) => {
    const ref = refs.current[id]
    if (!ref) return
    if (ref.isCollapsed()) ref.expand()
    else ref.collapse()
  }

  return (
    <ResizablePanelGroup
      orientation="vertical"
      className={cn("h-full w-full", className)}
    >
      {sections.map((section, index) => {
        const Icon = section.icon
        const isCollapsed = collapsed[section.id]
        return (
          <React.Fragment key={section.id}>
            {index > 0 && <ResizableHandle withHandle={withHandle} />}
            <ResizablePanel
              collapsible
              collapsedSize={`${headerHeight}px`}
              minSize={section.minSize ?? `${headerHeight + 64}px`}
              defaultSize={section.defaultSize}
              panelRef={(ref: PanelImperativeHandle | null) => {
                refs.current[section.id] = ref
              }}
              onResize={(size) => {
                const next = size.inPixels <= headerHeight + 1
                setCollapsed((prev) =>
                  prev[section.id] === next
                    ? prev
                    : { ...prev, [section.id]: next }
                )
              }}
              className="flex flex-col overflow-hidden"
            >
              <div
                style={{ height: headerHeight }}
                className={cn(
                  "flex shrink-0 items-center pr-2 text-muted-foreground",
                  headerClassName
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={!isCollapsed}
                  className={cn(
                    "flex h-full min-w-0 flex-1 items-center gap-1 pl-2 text-left",
                    "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  )}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  )}
                  {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                  {typeof section.title === "string" ? (
                    <span className="truncate text-xs font-semibold uppercase tracking-wide">
                      {section.title}
                    </span>
                  ) : (
                    // Custom node: rendered as-is so the consumer owns the
                    // styling (icon, casing, colour, badges…).
                    <span className="flex min-w-0 flex-1 items-center">
                      {section.title}
                    </span>
                  )}
                </button>
                {section.actions && !isCollapsed && (
                  <div className="flex items-center gap-1 pl-2">
                    {section.actions}
                  </div>
                )}
              </div>
              <div
                className={cn("min-h-0 flex-1 overflow-auto", bodyClassName)}
                // Hide the body from assistive tech / tab order when collapsed;
                // it stays mounted so scroll position and state are preserved.
                hidden={isCollapsed}
              >
                {section.content}
              </div>
            </ResizablePanel>
          </React.Fragment>
        )
      })}
    </ResizablePanelGroup>
  )
}
