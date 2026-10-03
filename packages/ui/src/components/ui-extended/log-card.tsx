import * as React from "react"

import { SegmentedControl } from "../ui/segmented-control"
import { FloatingPanel, type FloatingPanelProps } from "./floating-panel"
import { SearchInput } from "./search-input"
import { Terminal, TerminalLine, type TerminalLevel } from "./terminal"

/** One line of a run's log, as the runtime emitted it. */
export interface LogLine {
  id?: string
  /** When, already worded — `10:42:01`. */
  at: string
  level: TerminalLevel
  /** What emitted it — `graph.query`, `egress`. */
  source?: string
  message: string
}

/** How loud a line must be to show: everything, warnings and up, errors only. */
export type LogFloor = "all" | "warn" | "error"

export interface LogCardProps
  extends Omit<FloatingPanelProps, "title" | "children" | "summary" | "aside"> {
  /** @default "Logs" */
  title?: React.ReactNode
  /** Every line so far, oldest first. New lines are appended as they arrive. */
  lines: LogLine[]
  /** Lines are still arriving. */
  live?: boolean
  /** Only lines from this source — a call opened in the activity panel. Controlled with `onSourceChange`. */
  source?: string | null
  onSourceChange?: (source: string | null) => void
}

const FLOOR: Record<LogFloor, (level: TerminalLevel) => boolean> = {
  all: () => true,
  warn: (level) => level === "warn" || level === "error",
  error: (level) => level === "error",
}

function PauseGlyph({ paused }: { paused: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {paused ? <path d="M5 3.5v9l7-4.5z" /> : <path d="M5.5 3.5v9M10.5 3.5v9" />}
    </svg>
  )
}

/**
 * The run's log, as it is written — in a panel that floats over the work.
 *
 * The raw record behind the activity panel: every line the runtime emitted,
 * its level the one coloured word ({@link TerminalLine}). It follows new lines
 * while live; **pausing freezes what is shown**, so a line can be read while
 * the run keeps writing, and resuming catches up. Filter by how loud a line
 * is, by words, or by the source a call wrote it from.
 */
export const LogCard = React.forwardRef<HTMLDivElement, LogCardProps>(
  ({ title = "Logs", lines, live, source = null, onSourceChange, className, ...props }, ref) => {
    const [floor, setFloor] = React.useState<LogFloor>("all")
    const [query, setQuery] = React.useState("")
    const [frozen, setFrozen] = React.useState<number | null>(null)
    const body = React.useRef<HTMLDivElement>(null)
    const paused = frozen != null

    const q = query.trim().toLowerCase()
    const shown = (paused ? lines.slice(0, frozen) : lines).filter(
      (l) =>
        FLOOR[floor](l.level) &&
        (source == null || l.source === source) &&
        (!q || `${l.source ?? ""} ${l.message}`.toLowerCase().includes(q)),
    )
    const behind = paused ? lines.length - frozen : 0

    // Follow the end while it is live and not paused.
    React.useLayoutEffect(() => {
      if (paused) return
      const el = body.current?.parentElement
      if (el) el.scrollTop = el.scrollHeight
    }, [shown.length, paused])

    const errors = lines.filter((l) => l.level === "error").length

    return (
      <FloatingPanel
        ref={ref}
        title={title}
        className={className}
        aside={
          <>
            <span className="min-w-0 truncate tabular-nums">
              {lines.length} lines · {paused ? `paused${behind ? `, ${behind} new` : ""}` : live ? "following" : "ended"}
            </span>
            <button
              type="button"
              aria-pressed={paused}
              aria-label={paused ? "Resume" : "Pause"}
              title={paused ? "Resume" : "Pause"}
              onClick={() => setFrozen(paused ? null : lines.length)}
              className="ml-auto inline-flex size-control-xs shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <PauseGlyph paused={paused} />
            </button>
          </>
        }
        summary={`${lines.length} lines${errors ? ` · ${errors} ${errors === 1 ? "error" : "errors"}` : ""}`}
        {...props}
      >
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card px-3 py-1.5">
          <SegmentedControl
            size="sm"
            aria-label="Level"
            value={floor}
            onValueChange={(v) => setFloor(v as LogFloor)}
            options={[
              { value: "all", label: "All" },
              { value: "warn", label: "Warn" },
              { value: "error", label: "Error" },
            ]}
          />
          <SearchInput
            inputSize="sm"
            className="min-w-0 flex-1"
            value={query}
            onChange={setQuery}
            placeholder="Filter lines"
            aria-label="Filter lines"
          />
          {source != null ? (
            <button
              type="button"
              onClick={() => onSourceChange?.(null)}
              className="shrink-0 rounded-control bg-muted px-1.5 font-mono text-sm hover:bg-accent"
              title="Show every source"
            >
              {source} ×
            </button>
          ) : null}
        </div>
        <Terminal
          ref={body}
          cursor={live && !paused}
          columnTemplate="auto 3rem auto minmax(0,1fr)"
          className="overflow-x-visible border-0 bg-transparent"
        >
          {shown.length ? (
            shown.map((l, i) => (
              <TerminalLine
                key={l.id ?? i}
                level={l.level}
                columns={[l.at, l.level, l.source ?? "", l.message]}
              />
            ))
          ) : (
            <TerminalLine kind="comment">no lines match</TerminalLine>
          )}
        </Terminal>
      </FloatingPanel>
    )
  },
)
LogCard.displayName = "LogCard"
