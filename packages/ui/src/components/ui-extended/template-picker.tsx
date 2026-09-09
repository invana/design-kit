import * as React from "react"

import { cn } from "../../lib/utils"
import type { EmissionKind } from "./emission-card"

export interface TemplateOption {
  /** The projection template — `table-compact@3`. */
  id: string
  kind: EmissionKind
  /**
   * Why it cannot be used on these records — `needs a time column`,
   * `needs 1 record, has 4`.
   *
   * Present means unavailable. Saying *why* is the point: a greyed row with no
   * reason reads as a bug.
   */
  unavailable?: React.ReactNode
  /** A note on an available row — `in use`, `sandboxed`. */
  note?: React.ReactNode
}

export interface TemplatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** How many records are being re-rendered — `Render these 4 records as`. */
  heading?: React.ReactNode
  options: TemplateOption[]
  value?: string
  onSelect?: (id: string) => void
  /** The reassurance under the list. */
  footnote?: React.ReactNode
}

/**
 * Render the same records a different way.
 *
 * It hangs off an emission's header, because a template belongs to **that
 * emission** — not to the thread, and not to a setting somewhere else.
 *
 * Switching re-renders from records already in hand: **the query does not run
 * again**. That is why unavailable options are listed rather than hidden — the
 * reason a template does not fit ("needs a time column") is information about
 * the data, and hiding it would leave the reader wondering what else exists.
 */
export const TemplatePicker = React.forwardRef<
  HTMLDivElement,
  TemplatePickerProps
>(({ heading, options, value, onSelect, footnote, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex w-full flex-col border border-border bg-card", className)}
    {...props}
  >
    {heading != null ? (
      <div className="flex h-6 shrink-0 items-center border-b border-border px-2 text-meta text-muted-foreground">
        {heading}
      </div>
    ) : null}
    <div role="listbox" className="flex flex-col">
      {options.map((o) => {
        const disabled = o.unavailable != null
        const selected = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={selected}
            disabled={disabled}
            onClick={() => onSelect?.(o.id)}
            className={cn(
              "flex h-7 items-center gap-2 px-2 text-left",
              selected && "bg-accent",
              disabled ? "cursor-not-allowed opacity-50" : "hover:bg-accent/60",
            )}
          >
            <span className="w-3 shrink-0 text-primary">{selected ? "•" : ""}</span>
            <span className="truncate font-mono text-meta">{o.id}</span>
            <span className="shrink-0 text-meta text-muted-foreground">{o.kind}</span>
            <span className="flex-1" />
            <span className="shrink-0 truncate text-meta text-muted-foreground">
              {o.unavailable ?? o.note}
            </span>
          </button>
        )
      })}
    </div>
    {footnote != null ? (
      <div className="border-t border-border px-2 py-1 text-meta text-muted-foreground">
        {footnote}
      </div>
    ) : null}
  </div>
))
TemplatePicker.displayName = "TemplatePicker"
