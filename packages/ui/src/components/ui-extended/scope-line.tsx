import * as React from "react"

import { cn } from "../../lib/utils"

export interface ScopeLineProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** What the figure covers, in order — period, comparison, filters, population, freshness. */
  parts: React.ReactNode[]
  /**
   * Makes the text parts editable in place: click one, type, `Enter` to send
   * the new value, `Escape` or leaving it to keep the old one. Called only
   * when the value changed.
   */
  onPartChange?: (index: number, value: string) => void
  /**
   * Parts that stay as stated even when the rest can be edited — the data's
   * freshness is a fact about the load, not a choice of the analyst's.
   */
  fixedParts?: number[]
}

const PART = "border-r border-border/60 px-2 py-0.5 last:border-r-0"

function EditablePart({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)

  if (!editing) {
    return (
      <button
        type="button"
        className={cn(
          PART,
          "cursor-text text-left hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
        )}
        onClick={() => {
          setDraft(value)
          setEditing(true)
        }}
      >
        {value}
      </button>
    )
  }

  const done = (commit: boolean) => {
    setEditing(false)
    const next = draft.trim()
    if (commit && next && next !== value) onChange(next)
  }

  return (
    <input
      autoFocus
      aria-label={`Change ${value}`}
      value={draft}
      size={Math.max(draft.length, 4)}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => done(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter") done(true)
        if (event.key === "Escape") done(false)
      }}
      className={cn(PART, "bg-background text-foreground outline-none ring-1 ring-inset ring-ring")}
    />
  )
}

/**
 * What an answer covers, stated in one strip: `Q3 2026 · vs Q2 · Stores,
 * Online · 214 stores · as of 06:00`.
 *
 * Every analytic answer carries one, above its figures, so a number is never
 * read without the period and population it was computed over. The parts are
 * exactly as applied — the filters the query ran with, not the ones asked for.
 *
 * With `onPartChange` the scope is also where it is changed: a part is edited
 * where it is read, rather than by asking the question again.
 */
export const ScopeLine = React.forwardRef<HTMLDivElement, ScopeLineProps>(
  ({ parts, onPartChange, fixedParts, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-fit max-w-full flex-wrap border border-border font-mono text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {parts.map((part, i) =>
        onPartChange && typeof part === "string" && !fixedParts?.includes(i) ? (
          <EditablePart key={i} value={part} onChange={(value) => onPartChange(i, value)} />
        ) : (
          <span key={i} className={PART}>
            {part}
          </span>
        ),
      )}
    </div>
  ),
)
ScopeLine.displayName = "ScopeLine"
