import * as React from "react"
import {
  AbsenceNote,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  PanelBox,
  RecordHeader,
  StatusDot,
  TabbedPanel,
  cn,
} from "@invana/ui"
import { Check, ChevronDown } from "lucide-react"

import { SpecActions, SpecChip, SpecChips } from "./chips"
import { resolveRegistry } from "./registry"
import type {
  ActionContext,
  DashboardProps,
  ExtraPanels,
  HeaderSpec,
  PanelRegistry,
  PanelSpec,
  RowSpec,
} from "./types"

/** Inside the renderer every spec is the widest one — the types guard authors, not the walk. */
type AnyPanel = PanelSpec<Record<string, unknown>>
type AnyRow = RowSpec<Record<string, unknown>>

/**
 * A band nobody recorded is **absent, not zero** (SR34).
 *
 * `unrecorded` is the one reason that removes the panel outright: an empty
 * Artifacts box says the step produced no files, while no box at all says
 * nobody wrote the record. The other two are facts worth drawing — `purged`
 * means it existed and aged out (O6), `declared-none` that the step's contract
 * has no such output — so those keep their band and say so inside it.
 */
function isDropped(panel: AnyPanel) {
  return panel.absent?.reason === "unrecorded"
}

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

  // Absence outranks the renderer: a band nobody recorded says which kind of
  // nothing it is, and never draws an empty one of itself.
  const body = panel.absent ? (
    <AbsenceNote reason={panel.absent.reason} label={panel.absent.label}>
      {panel.absent.note}
    </AbsenceNote>
  ) : panel.render ?? (
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
      aside={
        panel.actions?.length ? (
          <span className="flex items-center gap-2">
            {panel.asideChip ? <SpecChip chip={panel.asideChip} /> : panel.aside}
            <SpecActions
              actions={panel.actions}
              onAction={onAction}
              icons={icons}
              ctx={{ panelId: panel.id }}
            />
          </span>
        ) : panel.asideChip ? (
          <SpecChip chip={panel.asideChip} />
        ) : (
          panel.aside
        )
      }
      flush={panel.flush || panel.absent != null}
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
      {row.panels.filter((panel) => !isDropped(panel as AnyPanel)).map((panel, i) => (
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
  const tabs = spec.tabs?.length ? spec.tabs : null
  // Uncontrolled unless the spec names an action — a frozen report still
  // switches tabs, it just has nobody to tell.
  const [ownTab, setOwnTab] = React.useState(spec.tab ?? tabs?.[0]?.id)
  const activeTab = spec.tabAction ? (spec.tab ?? tabs?.[0]?.id) : ownTab

  const body = (rows: AnyRow[]) => (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3" style={{ gap }}>
      {rows
        .filter((row) => row.panels.some((panel) => !isDropped(panel as AnyPanel)))
        .map((row, i) => (
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
  )

  return (
    <div className={cn("flex min-h-0 flex-col bg-background", className)} {...props}>
      {spec.header ? <SpecHeader header={spec.header} onAction={emit} icons={icons} /> : null}

      {tabs ? (
        <TabbedPanel
          className="min-h-0 flex-1 border-0 bg-transparent shadow-none"
          bodyClassName="flex min-h-0 flex-col"
          activeTab={activeTab}
          onTabChange={(value) =>
            spec.tabAction ? emit(spec.tabAction, { option: value }) : setOwnTab(value)
          }
          headerContent={
            spec.tabActions?.length ? (
              <SpecActions actions={spec.tabActions} onAction={emit} icons={icons} />
            ) : undefined
          }
          tabs={tabs.map((tab) => ({
            value: tab.id,
            label: tab.label,
            content: body(tab.rows as AnyRow[]),
          }))}
        />
      ) : (
        body(spec.rows as AnyRow[])
      )}
    </div>
  )
}

/**
 * The header, from its spec: a crumb with an action is a link back, and the
 * last crumb can open a picker of its siblings.
 */
function SpecHeader({
  header,
  onAction,
  icons,
}: {
  header: HeaderSpec
  onAction: (id: string, ctx?: ActionContext) => void
  icons: Record<string, React.ComponentType<{ className?: string }>>
}) {
  const last = header.crumbs.length - 1
  const crumbs = header.crumbs.map((crumb, i): React.ReactNode => {
    const action = header.crumbActions?.[i]
    if (i === last && header.crumbMenu) {
      const menu = header.crumbMenu
      return (
        <DropdownMenu key={i}>
          <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:text-primary focus-visible:outline-none">
            {crumb}
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-96 min-w-64 overflow-y-auto">
            {menu.placeholder ? (
              <div className="px-2 py-1 text-sm text-muted-foreground">{menu.placeholder}</div>
            ) : null}
            {menu.items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => onAction(menu.action, { itemId: item.id })}
                className={cn(item.id === menu.selected && "bg-accent")}
              >
                {item.tone ? <StatusDot tone={item.tone} /> : null}
                <span className="min-w-0 flex-1 truncate font-mono">{item.label}</span>
                {item.aside ? (
                  <span className="font-mono text-sm text-muted-foreground tabular-nums">
                    {item.aside}
                  </span>
                ) : null}
                {item.id === menu.selected ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <span className="size-3.5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return action ? (
      <button
        key={i}
        type="button"
        className="hover:text-primary hover:underline focus-visible:outline-none"
        onClick={() => onAction(action)}
      >
        {crumb}
      </button>
    ) : (
      crumb
    )
  })

  return (
    <RecordHeader
      tone={header.tone}
      crumbs={crumbs}
      chips={<SpecChips chips={header.chips} />}
      actions={<SpecActions actions={header.actions} onAction={onAction} icons={icons} />}
    />
  )
}
