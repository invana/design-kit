import * as React from "react"
import { PanelBox, RecordHeader, cn } from "@invana/ui"

import { SpecActions, SpecChip, SpecChips } from "./chips"
import { resolveRegistry } from "./registry"
import type {
  ActionContext,
  DashboardProps,
  ExtraPanels,
  PanelRegistry,
  PanelSpec,
  RowSpec,
} from "./types"

/** Inside the renderer every spec is the widest one — the types guard authors, not the walk. */
type AnyPanel = PanelSpec<Record<string, unknown>>
type AnyRow = RowSpec<Record<string, unknown>>

/**
 * A panel that names a kind nothing can draw.
 *
 * Shown rather than skipped. A dashboard is data that outlives the code reading
 * it, so a spec written against a newer schema will arrive here eventually —
 * and a silently missing band is a worse bug than a visible one, because the
 * reader draws conclusions from a dashboard they believe is complete.
 */
function UnknownPanel({ kind }: { kind: string }) {
  return (
    <div className="border border-dashed border-border p-3 text-sm text-muted-foreground">
      No renderer for panel kind <span className="font-mono">{kind}</span>. Register one, or
      remove it from the spec.
    </div>
  )
}

function Panel({
  panel,
  registry,
  onAction,
  icons,
  gap,
}: {
  panel: AnyPanel
  registry: PanelRegistry
  onAction: (id: string, ctx?: ActionContext) => void
  icons: Record<string, React.ComponentType<{ className?: string }>>
  gap: number
}) {
  const Renderer = registry[panel.kind]

  const body = panel.render ?? (
    Renderer ? (
      <Renderer
        panel={panel}
        options={(panel.options ?? {}) as never}
        onAction={onAction}
        icons={icons}
        gap={gap}
      />
    ) : (
      <UnknownPanel kind={panel.kind} />
    )
  )

  const style: React.CSSProperties = panel.width
    ? { width: panel.width, flexShrink: 0 }
    : { flexGrow: panel.grow ?? 1, flexBasis: 0, minWidth: 0 }

  // `title` is what puts a panel in a box — so a strip of tiles sits directly
  // on the dashboard instead of inside a card labelled "Metrics".
  if (!panel.title) {
    return (
      <div style={style} className="min-w-0">
        {body}
      </div>
    )
  }

  return (
    <PanelBox
      title={panel.title}
      aside={panel.asideChip ? <SpecChip chip={panel.asideChip} /> : panel.aside}
      flush={panel.flush}
      style={style}
    >
      {body}
    </PanelBox>
  )
}

function Row({
  row,
  gap,
  registry,
  onAction,
  icons,
}: {
  row: AnyRow
  gap: number
  registry: PanelRegistry
  onAction: (id: string, ctx?: ActionContext) => void
  icons: Record<string, React.ComponentType<{ className?: string }>>
}) {
  return (
    <div
      className="flex min-w-0 items-stretch"
      style={{ gap: row.gap ?? gap, height: row.height }}
    >
      {row.panels.map((panel, i) => (
        <Panel
          key={panel.id ?? i}
          panel={panel}
          registry={registry}
          onAction={onAction}
          icons={icons}
          gap={gap}
        />
      ))}
    </div>
  )
}

/**
 * A dashboard, assembled from JSON.
 *
 * The spec says what bands there are, what kind each one is and what data it
 * carries; this decides nothing except layout. That split is the point — the
 * same component renders a run, a step, a plan and a draft, and adding a
 * seventh surface is a new document rather than a new screen.
 *
 * **Behaviour is not in the spec.** Actions carry an `id` and arrive back
 * through `onAction`; a gantt row's selection, a list row's click and a
 * parameter edit all come through the same seam. So a spec can be fetched,
 * stored beside a plan as `dashboard.yml`, diffed between two runs, and handed
 * to a renderer that has never heard of the record it describes.
 *
 * **It owns one scroller.** The body scrolls; no band does. A `PanelBox` is
 * content-height by construction, which is what keeps twenty of them in a
 * column from becoming twenty scroll regions.
 */
export function Dashboard<X extends ExtraPanels = Record<never, never>>({
  spec,
  onAction,
  registry: extraRegistry,
  icons = {},
  className,
  ...props
}: DashboardProps<X>) {
  const registry = React.useMemo(() => resolveRegistry(extraRegistry), [extraRegistry])
  const gap = spec.gap ?? 12
  const emit = React.useCallback(
    (id: string, ctx?: ActionContext) => onAction?.(id, ctx),
    [onAction],
  )

  return (
    <div className={cn("flex min-h-0 flex-col bg-background", className)} {...props}>
      {spec.header ? (
        <RecordHeader
          tone={spec.header.tone}
          crumbs={spec.header.crumbs}
          chips={<SpecChips chips={spec.header.chips} />}
          actions={
            <SpecActions actions={spec.header.actions} onAction={emit} icons={icons} />
          }
        />
      ) : null}

      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3"
        style={{ gap }}
      >
        {(spec.rows as AnyRow[]).map((row, i) => (
          <Row
            key={row.id ?? i}
            row={row}
            gap={gap}
            registry={registry}
            onAction={emit}
            icons={icons}
          />
        ))}
      </div>
    </div>
  )
}
