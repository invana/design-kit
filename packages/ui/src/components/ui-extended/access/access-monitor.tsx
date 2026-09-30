import * as React from "react"

import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { StatusDot } from "../../ui/status-dot"
import type { LayerPalette } from "../layer-chip"
import { PanelBox } from "../panel-box"
import { AccessBoard } from "./access-board"
import { AccessStream, type AccessStreamProps } from "./access-stream"
import { formatRate, type AccessSnapshot, type AccessStore } from "./store"

export interface AccessMonitorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  store: AccessStore
  palette?: LayerPalette
  renderRate?: AccessStreamProps["renderRate"]
  /** Controlled pause. Omit and the monitor keeps its own. */
  paused?: boolean
  onPausedChange?: (paused: boolean) => void
  /** Silence longer than this reads as **stale**, not idle. Default: 4 windows. */
  staleAfterMs?: number
}

/**
 * The board and the stream as one instrument, fed by an {@link AccessStore}.
 *
 * The two are linked because they are two views of one thing: pointing at a
 * tile marks its rows, pointing at a row marks its tile, and clicking a tile
 * narrows the stream to it. **Pause freezes the frame** — the store keeps
 * folding windows underneath, so resuming lands on the present, not on a
 * backlog.
 *
 * **Silence is not calm.** A missing window could be a dropped connection or a
 * quiet agent, and a board that simply cooled would say the second either way.
 * So silence past `staleAfterMs` is labelled stale, and skipped `seq`s are
 * counted — the header says what it does not know.
 *
 * Side by side from 720px of its own width, stacked below — a container query,
 * so it follows the panel it sits in rather than the window.
 */
export const AccessMonitor = React.forwardRef<HTMLDivElement, AccessMonitorProps>(
  (
    {
      store,
      palette,
      renderRate,
      paused: pausedProp,
      onPausedChange,
      staleAfterMs,
      className,
      ...props
    },
    ref,
  ) => {
    const live = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

    const [ownPaused, setOwnPaused] = React.useState(false)
    const paused = pausedProp ?? ownPaused
    const setPaused = (next: boolean) => {
      if (pausedProp === undefined) setOwnPaused(next)
      onPausedChange?.(next)
    }

    const frozen = React.useRef<AccessSnapshot>(live)
    if (!paused) frozen.current = live
    const snap = paused ? frozen.current : live

    const [focus, setFocus] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<string | null>(null)

    // Ticks only to notice silence — windows themselves arrive through the store.
    const [now, setNow] = React.useState(() => Date.now())
    React.useEffect(() => {
      const id = window.setInterval(() => setNow(Date.now()), 1_000)
      return () => window.clearInterval(id)
    }, [])
    const staleAfter = staleAfterMs ?? Math.max(1_000, live.windowMs * 4)
    const stale = live.receivedAt > 0 && now - live.receivedAt > staleAfter

    const state = paused ? "paused" : stale ? "stale" : live.receivedAt ? "live" : "waiting"
    const selectedLabel = selected
      ? snap.targets.find((t) => t.key === selected)?.label ?? selected
      : null

    return (
      <div
        ref={ref}
        className={cn("@container flex min-h-0 flex-col", className)}
        {...props}
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 @min-[720px]:grid-cols-2">
          <PanelBox
            title="Access"
            aside={
              <span className="flex items-center gap-1.5">
                <StatusDot
                  tone={state === "live" ? "running" : state === "stale" ? "warning" : "muted"}
                />
                <span>
                  {state}
                  {snap.gaps > 0 ? ` · ${snap.gaps} missed` : ""} ·{" "}
                  <span className="font-mono">{formatRate(snap.rate)}</span>
                </span>
              </span>
            }
            bodyClassName="min-h-0 overflow-y-auto"
          >
            <AccessBoard
              targets={snap.targets}
              palette={palette}
              focus={focus}
              selected={selected}
              onFocusChange={setFocus}
              onSelectedChange={setSelected}
            />
          </PanelBox>
          <PanelBox
            title="Stream"
            aside={
              <span className="flex items-center gap-1">
                {selectedLabel ? (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setSelected(null)}
                    aria-label={`Show all targets, not only ${selectedLabel}`}
                  >
                    {selectedLabel} ×
                  </Button>
                ) : null}
                <Button size="xs" variant="ghost" onClick={() => setPaused(!paused)}>
                  {paused ? "Resume" : "Pause"}
                </Button>
              </span>
            }
            bodyClassName="min-h-0 overflow-y-auto"
          >
            <AccessStream
              targets={snap.targets}
              events={snap.events}
              steps={snap.steps}
              palette={palette}
              focus={focus}
              selected={selected}
              onFocusChange={setFocus}
              renderRate={renderRate}
            />
          </PanelBox>
        </div>
      </div>
    )
  },
)
AccessMonitor.displayName = "AccessMonitor"
