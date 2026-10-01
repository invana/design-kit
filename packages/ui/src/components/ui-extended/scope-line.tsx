import * as React from "react"

import { cn } from "../../lib/utils"

export interface ScopeLineChoice {
  value: string
  label: React.ReactNode
  /** At the right of the choice, in mono — `188`, `2 of 3`. */
  detail?: React.ReactNode
}

/** A part with more to say than its text. */
export interface ScopeLinePart {
  text: React.ReactNode
  /**
   * `changed` — this part differs from the question it was carried from;
   * `stale` — the data behind it is late.
   */
  mark?: "changed" | "stale"
  /** What the part can be changed to. Opening the part lists them under the line. */
  choices?: ScopeLineChoice[]
}

export interface ScopeLineProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** What the figure covers, in order — period, comparison, filters, population, freshness. */
  parts: (React.ReactNode | ScopeLinePart)[]
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
  /** The part whose choices are showing. Controlled; see `defaultOpenPart`. */
  openPart?: number | null
  /** The part whose choices show at first, uncontrolled. */
  defaultOpenPart?: number
  onOpenPartChange?: (index: number | null) => void
  /** A line under the scope — `Click any part to change it and re-run`. */
  note?: React.ReactNode
  /** `warning` when the note is about late data. */
  noteTone?: "muted" | "warning"
  /**
   * No box, and nothing wasted on its outside: only the rules between parts
   * are drawn, and the first part sits flush with the text around the strip.
   * For a scope inside a card or an answer, whose edge already frames it.
   */
  seamless?: boolean
}

const MARK = {
  changed: "bg-primary/15 text-primary",
  stale: "bg-warning/15 text-warning",
}

function isPart(part: unknown): part is ScopeLinePart {
  return typeof part === "object" && part !== null && !React.isValidElement(part) && "text" in part
}

const PART = "border-r border-border/60 px-2 py-0.5 last:border-r-0"

function EditablePart({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
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
          className,
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
  (
    {
      parts,
      onPartChange,
      fixedParts,
      openPart,
      defaultOpenPart,
      onOpenPartChange,
      note,
      noteTone = "muted",
      seamless,
      className,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<number | null>(
      defaultOpenPart ?? null,
    )
    const open = openPart !== undefined ? openPart : uncontrolledOpen
    const setOpen = (index: number | null) => {
      if (openPart === undefined) setUncontrolledOpen(index)
      onOpenPartChange?.(index)
    }
    const opened = open != null ? parts[open] : undefined
    const choices = isPart(opened) ? opened.choices : undefined
    const wrapped = !!choices?.length || note != null

    const line = (
      <div
        ref={wrapped ? undefined : ref}
        className={cn(
          "flex w-fit flex-wrap font-mono text-xs text-muted-foreground",
          // Seamless: it reaches out by a part's padding and clips that off, so
          // the first part is flush. Sideways only, so a part's focus ring
          // keeps its top and bottom.
          seamless
            ? "-mx-2 max-w-[calc(100%+1rem)] [clip-path:inset(0_0.5rem)]"
            : "max-w-full border border-border",
          !wrapped && className,
        )}
        {...(wrapped ? {} : props)}
      >
        {parts.map((part, i) => {
          if (isPart(part)) {
            const mark = part.mark ? MARK[part.mark] : undefined
            if (part.choices?.length) {
              return (
                <button
                  key={i}
                  type="button"
                  aria-expanded={open === i}
                  className={cn(
                    PART,
                    "text-left hover:bg-accent hover:text-foreground focus-visible:outline-none",
                    open === i && "shadow-[inset_0_0_0_1px_var(--color-primary)]",
                    mark,
                  )}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {part.text}
                </button>
              )
            }
            if (onPartChange && typeof part.text === "string" && !fixedParts?.includes(i)) {
              return (
                <EditablePart
                  key={i}
                  value={part.text}
                  className={mark}
                  onChange={(value) => onPartChange(i, value)}
                />
              )
            }
            return (
              <span key={i} className={cn(PART, mark)}>
                {part.text}
              </span>
            )
          }
          return onPartChange && typeof part === "string" && !fixedParts?.includes(i) ? (
            <EditablePart key={i} value={part} onChange={(value) => onPartChange(i, value)} />
          ) : (
            <span key={i} className={PART}>
              {part as React.ReactNode}
            </span>
          )
        })}
      </div>
    )

    if (!wrapped) return line
    return (
      <div ref={ref} className={cn("flex min-w-0 flex-col gap-1.5", className)} {...props}>
        {line}
        {choices?.length && open != null ? (
        <div
          role="listbox"
          className="flex flex-col rounded-sm border border-border bg-card p-0.5 shadow-md"
        >
          {choices.map((choice) => {
            const current = isPart(opened) && choice.label === opened.text
            return (
              <button
                key={choice.value}
                type="button"
                role="option"
                aria-selected={current}
                className={cn(
                  "flex items-baseline gap-2 rounded-sm px-1.5 py-1 text-left text-sm hover:bg-accent",
                  current && "bg-primary/15 text-primary hover:bg-primary/15",
                )}
                onClick={() => {
                  setOpen(null)
                  if (!current && open != null) onPartChange?.(open, choice.value)
                }}
              >
                {choice.label}
                {choice.detail != null ? (
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {choice.detail}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
        ) : null}
        {note != null ? (
          <span
            className={cn(
              "text-xs",
              noteTone === "warning" ? "text-warning" : "text-muted-foreground",
            )}
          >
            {note}
          </span>
        ) : null}
      </div>
    )
  },
)
ScopeLine.displayName = "ScopeLine"
