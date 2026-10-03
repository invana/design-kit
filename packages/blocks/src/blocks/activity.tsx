import * as React from "react"
import { HeatLane } from "@invana/charts"
import { Button, cn, PropertyList, PropertyRow } from "@invana/ui"

import { ActionRow } from "../parts/actions"
import { strong } from "../prose"
import type { ActivityLane, BlockProps } from "../types"

const RATE_TONE = { hot: "text-info", bad: "text-destructive" } as const

/** A lane is lit when anything in it was busy. */
const lit = (lane: ActivityLane) => lane.cells.some((v) => v != null && v > 0)

interface Pin {
  lane: string
  at: number
}

function LaneRow({
  lane,
  depth,
  open,
  onToggle,
  stale,
  cell,
  pin,
  onPin,
}: {
  lane: ActivityLane
  depth: number
  open: boolean
  onToggle?: () => void
  stale: boolean
  cell?: string
  pin: Pin | null
  onPin: (pin: Pin | null) => void
}) {
  const name = (
    <>
      <span className="truncate @max-[300px]/activity:hidden">{lane.label}</span>
      <span className="truncate @min-[301px]/activity:hidden">{lane.short ?? lane.label}</span>
    </>
  )
  return (
    <>
      {onToggle ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="flex min-w-0 items-center gap-1 text-left hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span aria-hidden className="w-2.5 shrink-0 text-muted-foreground">
            {open ? "▾" : "▸"}
          </span>
          {name}
        </button>
      ) : (
        <span
          className={cn(
            "flex min-w-0 items-center",
            (lane.off || depth > 0) && "text-muted-foreground",
            depth > 0 && "pl-3.5 text-sm",
          )}
        >
          {name}
        </span>
      )}
      <HeatLane
        aria-label={lane.label}
        values={lane.off ? lane.cells.map(() => null) : lane.cells}
        marks={lane.marks}
        stale={stale}
        cellLabel={cell ? (i) => `${lane.label} · cell ${i + 1} · ${cell}` : undefined}
        pinned={pin?.lane === lane.id ? pin.at : null}
        onPin={stale ? undefined : (at) => onPin(at == null ? null : { lane: lane.id, at })}
      />
      <span
        className={cn(
          "truncate text-right font-mono text-sm text-muted-foreground tabular-nums",
          !stale && lane.rateTone && RATE_TONE[lane.rateTone],
        )}
      >
        {stale ? "—" : lane.rate}
      </span>
    </>
  )
}

/**
 * Which layers a run kept busy, and when: one lane per layer — graph, models,
 * skills, the LLM, third parties, the cache — over a shared axis, brighter
 * where it was busier, its rate at the right, the run's steps banded above.
 *
 * Live, it follows the last seconds; settled, it is the whole run. A layer
 * opens into its parts; a lit cell pins, and the operation behind it is
 * recorded under the lanes. A refusal and a crossing of the boundary are
 * marked in their cell. When the signal stops the lanes are dimmed, not
 * cooled: silence is not calm. Under 300px of its own width it switches to
 * short labels.
 */
export function ActivityBlock({ spec, onAction }: BlockProps<"activity">) {
  const stale = spec.state === "stale"
  const [opened, setOpened] = React.useState<Set<string>>(
    () => new Set(spec.lanes.filter((l) => l.open).map((l) => l.id)),
  )
  const [pin, setPin] = React.useState<Pin | null>(
    spec.pinned ? { lane: spec.pinned.lane, at: spec.pinned.at } : null,
  )
  const toggle = (id: string) =>
    setOpened((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const pinCell = (next: Pin | null) => {
    setPin(next)
    if (next) onAction?.("pin", next)
  }
  const record = spec.pinned && pin && spec.pinned.lane === pin.lane && spec.pinned.at === pin.at ? spec.pinned : null
  const total = spec.lanes.length
  const lighted = spec.lanes.filter(lit).length

  return (
    <div className="@container/activity flex min-w-0 flex-col gap-2">
      <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(2.5rem,auto)] items-center gap-x-2 gap-y-1.5 @max-[300px]/activity:grid-cols-[4rem_minmax(0,1fr)_minmax(1.5rem,auto)]">
        {spec.bands?.length ? (
          <>
            <span />
            <div className="flex min-w-0 gap-px text-xs">
              {spec.bands.map((b, i) => (
                <span
                  key={i}
                  style={{ flex: b.span }}
                  className={cn(
                    "min-w-0 truncate rounded-[2px] px-1",
                    b.current ? "bg-info/15 text-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {b.label}
                </span>
              ))}
            </div>
            <span className="text-right text-xs text-muted-foreground">{spec.state === "live" ? "now" : ""}</span>
          </>
        ) : null}
        {spec.lanes.map((lane) => {
          const open = opened.has(lane.id)
          const kids = lane.children?.length ? lane.children : null
          return (
            <React.Fragment key={lane.id}>
              <LaneRow
                lane={lane}
                depth={0}
                open={open}
                onToggle={kids ? () => toggle(lane.id) : undefined}
                stale={stale}
                cell={spec.cell}
                pin={pin}
                onPin={pinCell}
              />
              {open && kids
                ? kids.map((child) => (
                    <LaneRow
                      key={child.id}
                      lane={child}
                      depth={1}
                      open={false}
                      stale={stale}
                      cell={spec.cell}
                      pin={pin}
                      onPin={pinCell}
                    />
                  ))
                : null}
            </React.Fragment>
          )
        })}
        {spec.axis?.length ? (
          <>
            <span />
            <div className="flex min-w-0 justify-between text-xs text-muted-foreground tabular-nums">
              {spec.axis.map((a, i) => (
                <span key={i}>{a}</span>
              ))}
            </div>
            <span />
          </>
        ) : null}
      </div>

      {record ? (
        <div className="flex flex-col gap-1.5 rounded-control border border-border bg-muted/40 p-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="min-w-0 flex-1 truncate font-medium">{record.title}</span>
            {record.time ? <span className="shrink-0 font-mono text-sm text-muted-foreground">{record.time}</span> : null}
          </div>
          {record.query ? <code className="truncate font-mono text-sm">{record.query}</code> : null}
          {record.rows?.length ? (
            <PropertyList>
              {record.rows.map((r) => (
                <PropertyRow key={r.label} label={r.label}>
                  {r.value}
                </PropertyRow>
              ))}
            </PropertyList>
          ) : null}
          {record.note || record.action ? (
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <span className="min-w-0 flex-1 truncate">{record.note}</span>
              {record.action ? (
                <Button
                  variant="link"
                  size="xs"
                  className="h-auto p-0"
                  onClick={() => onAction?.("action", record.action!.id)}
                >
                  {record.action.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {spec.legend ? (
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><i aria-hidden className="size-2 rounded-[1px] bg-info" />touched</span>
          <span className="flex items-center gap-1.5"><i aria-hidden className="size-2 rounded-[1px] bg-destructive" />refused</span>
          <span className="flex items-center gap-1.5"><i aria-hidden className="size-2 rounded-[1px] bg-warning" />left the boundary</span>
        </div>
      ) : null}

      {spec.hint ? (
        <p className={cn("text-sm text-muted-foreground", stale && "text-warning")}>{strong(spec.hint)}</p>
      ) : null}

      {spec.actions?.length ? (
        <div className="flex min-w-0 items-center gap-2 border-t border-border pt-1.5 text-sm text-muted-foreground">
          <span className="shrink-0 tabular-nums">
            {total} layers · {lighted} lit
          </span>
          <ActionRow actions={spec.actions} onAction={(id) => onAction?.("action", id)} />
        </div>
      ) : null}
    </div>
  )
}
