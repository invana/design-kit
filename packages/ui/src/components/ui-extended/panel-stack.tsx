'use client'

import * as React from "react"
import type {
  GroupImperativeHandle,
  PanelImperativeHandle,
} from "react-resizable-panels"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { TooltipProvider } from "../ui/tooltip"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable"
import { NavHorizontalItems, type NavHorizontalItem } from "./nav-horizontal"

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
   * Actions on the right of the title bar, as `NavHorizontal` items — the same
   * list `PanelContent` and `TabbedPanel` take, so a header is described once
   * and reads the same everywhere. A header has one action area, so this is
   * the item list itself rather than left/centre/right slots; the title owns
   * the left. Give an item `menuItems` and it becomes the `…` overflow
   * dropdown.
   *
   * ```tsx
   * headerActions: [
   *   { name: "Refresh", icon: RefreshCw, onClick: refetch },
   *   { name: "More options", icon: MoreHorizontal, menuItems: [
   *     { id: "sort", label: "Sort oldest first", onSelect: sort },
   *   ] },
   * ]
   * ```
   */
  headerActions?: NavHorizontalItem[]
  /**
   * Keep `headerActions` hidden until the header is hovered or focused (or a
   * menu inside them is open) — VS Code's quiet view header. Defaults to
   * `true`. Chrome that must always read, like a count, belongs in `title`.
   */
  actionsOnHover?: boolean
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
  const groupRef = React.useRef<GroupImperativeHandle | null>(null)
  const refs = React.useRef<Record<string, PanelImperativeHandle | null>>({})
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(sections.map((s) => [s.id, !!s.defaultCollapsed])),
  )

  // Collapse the sections marked `defaultCollapsed` once, before first paint.
  // The panels mount expanded, then we shrink them synchronously — no visible
  // flash. Two steps, and both are needed:
  //
  //  1. `collapse()` per section, so the library records the size to restore
  //     when the header is clicked open. A panel shrunk only by `setLayout`
  //     has no such memory and `expand()` is a no-op.
  //  2. one atomic `setLayout` for the final geometry. Collapsing panels one
  //     by one hands each freed slice to a neighbour, which pulls an already
  //     collapsed sibling back open — with three collapsed sections the calls
  //     chase each other and one always ends up expanded.
  const didInit = React.useRef(false)
  React.useLayoutEffect(() => {
    if (didInit.current) return
    didInit.current = true

    const targets = sections.filter((s) => s.defaultCollapsed)
    const expanded = sections.filter((s) => !s.defaultCollapsed)
    if (targets.length === 0 || expanded.length === 0) return

    const group = groupRef.current
    // Any panel converts the group's percentage basis into pixels.
    const probe = refs.current[sections[0].id]?.getSize()
    if (!group || !probe || probe.asPercentage <= 0) {
      for (const s of targets) refs.current[s.id]?.collapse()
      return
    }

    const groupPx = (probe.inPixels / probe.asPercentage) * 100
    const collapsedPct = (headerHeight / groupPx) * 100
    // Read the mount layout before any collapse disturbs it.
    const layout = group.getLayout()
    const next = { ...layout }

    let freed = 0
    for (const s of targets) {
      const current = layout[s.id] ?? 0
      if (current <= collapsedPct) continue
      freed += current - collapsedPct
      next[s.id] = collapsedPct
    }
    if (freed === 0) return

    // Hand the freed height back in proportion, so any `defaultSize` ratio
    // between the expanded sections survives.
    const total = expanded.reduce((sum, s) => sum + (layout[s.id] ?? 0), 0)
    for (const s of expanded) {
      const share =
        total > 0 ? (layout[s.id] ?? 0) / total : 1 / expanded.length
      next[s.id] = (layout[s.id] ?? 0) + freed * share
    }

    for (const s of targets) refs.current[s.id]?.collapse()
    group.setLayout(next)
    // Run once on mount; section identity is stable for the stack's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = (id: string) => {
    const ref = refs.current[id]
    if (!ref) return
    if (!ref.isCollapsed()) {
      ref.collapse()
      return
    }

    ref.expand()
    if (!ref.isCollapsed()) return

    // `expand()` pulls its height from the neighbouring panel and quietly does
    // nothing when that neighbour is itself collapsed — which is exactly the
    // VS Code shape, a run of collapsed headers stacked at the bottom. Take
    // the room from the tallest expanded section instead.
    const group = groupRef.current
    if (!group) return
    const layout = group.getLayout()
    const donor = Object.entries(layout)
      .filter(([panelId]) => panelId !== id && !collapsed[panelId])
      .sort((a, b) => b[1] - a[1])[0]
    if (!donor) return
    const [donorId, donorPct] = donor
    const share = donorPct / 2
    group.setLayout({
      ...layout,
      [id]: (layout[id] ?? 0) + share,
      [donorId]: donorPct - share,
    })
  }

  return (
    // Header actions are nav items, and those carry tooltips — provide the
    // context here so a `PanelStack` works outside an app shell too. Nesting
    // inside an app's own provider is harmless.
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        groupRef={groupRef}
        orientation="vertical"
        className={cn("h-full w-full", className)}
      >
        {sections.map((section, index) => {
          const Icon = section.icon
          const isCollapsed = collapsed[section.id]
          // A boundary next to a collapsed section has nothing to drag: the
          // header is pinned to `collapsedSize`. Those sit flush and are drawn
          // as a hairline rule, so a run of collapsed sections reads as a stack
          // of closed drawers; a live gutter stays between expanded neighbours.
          const flush =
            index > 0 && (isCollapsed || collapsed[sections[index - 1].id])
          return (
            <React.Fragment key={section.id}>
              {index > 0 && (
                <ResizableHandle
                  withHandle={withHandle && !flush}
                  className={cn(
                    flush &&
                      "pointer-events-none bg-border aria-[orientation=horizontal]:h-px aria-[orientation=vertical]:w-px",
                  )}
                />
              )}
              <ResizablePanel
                id={section.id}
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
                      : { ...prev, [section.id]: next },
                  )
                }}
                className="flex flex-col overflow-hidden"
              >
                <div
                  style={{ height: headerHeight }}
                  className={cn(
                    "group/panel-header flex shrink-0 items-center pr-2 text-muted-foreground",
                    headerClassName,
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(section.id)}
                    aria-expanded={!isCollapsed}
                    className={cn(
                      "flex h-full min-w-0 flex-1 items-center gap-1 pl-2 text-left",
                      "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    )}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-5 w-5 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0" />
                    )}
                    {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                    {typeof section.title === "string" ? (
                      <span className="truncate text-meta font-semibold uppercase tracking-wide">
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
                  {section.headerActions && section.headerActions.length > 0 && (
                    <div
                      className={cn(
                        "flex items-center gap-1 pl-2",
                        // Quiet at rest: the actions appear on hover over the
                        // header, and never hide while one of them holds focus
                        // or has its menu open — so the keyboard path stays
                        // visible.
                        (section.actionsOnHover ?? true) &&
                          "opacity-0 transition-opacity group-hover/panel-header:opacity-100 focus-within:opacity-100 has-[[data-state=open]]:opacity-100",
                      )}
                    >
                      <NavHorizontalItems items={section.headerActions} />
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
    </TooltipProvider>
  )
}
