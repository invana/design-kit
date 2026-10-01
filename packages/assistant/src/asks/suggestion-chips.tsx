import * as React from "react"
import { Button, Eyebrow, cn } from "@invana/ui"

export interface SuggestionChipsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Two to four follow-ups, each a whole prompt — `Compare with Q3 last year`. */
  items?: string[]
  /** Follow-ups under a heading each — `Go deeper`, `Act` — in place of `items`. */
  groups?: { label: React.ReactNode; items: string[] }[]
  /**
   * `wrap` (the default) runs the chips along a line; `stack` puts one per
   * line, full width. A narrow thread stacks them either way.
   */
  layout?: "wrap" | "stack"
  /** A line above the chips that says what they are — `I can answer instead`. */
  lead?: React.ReactNode
  /** Follow-ups already sent from here. They stay where they were, dimmed and disabled. */
  sent?: string[]
  /** A follow-up was picked; it goes out as the next prompt. */
  onSelect?: (text: string) => void
}

function Chips({
  items,
  layout,
  sent,
  onSelect,
}: Pick<SuggestionChipsProps, "layout" | "sent" | "onSelect"> & { items: string[] }) {
  const stack = layout === "stack"
  return (
    <div
      className={cn(
        "flex gap-1.5",
        stack ? "flex-col" : "flex-wrap @max-[22rem]:flex-col",
      )}
    >
      {items.map((text) => {
        const done = sent?.includes(text)
        return (
          <Button
            key={text}
            type="button"
            size="xs"
            variant="outline"
            disabled={done}
            className={cn(
              // A follow-up is a whole prompt and can outrun the line: it wraps
              // within the thread rather than running past it.
              "h-auto min-h-6 max-w-full items-start whitespace-normal py-0.5 text-left font-normal",
              stack
                ? "w-full justify-start"
                : "rounded-full @max-[22rem]:w-full @max-[22rem]:justify-start @max-[22rem]:rounded-control",
            )}
            onClick={() => onSelect?.(text)}
          >
            <span aria-hidden className="text-muted-foreground">
              ↳
            </span>
            {text}
          </Button>
        )
      })}
    </div>
  )
}

/**
 * What to ask next, under an answer. Each chip is a whole prompt that reuses
 * the current scope, so picking one sends it as it reads — nothing to fill in.
 */
export const SuggestionChips = React.forwardRef<HTMLDivElement, SuggestionChipsProps>(
  ({ items, groups, layout, sent, lead, onSelect, className, ...props }, ref) => (
    <div ref={ref} className={cn("@container flex flex-col gap-1.5", className)} {...props}>
      {lead != null ? <p className="text-xs text-muted-foreground">{lead}</p> : null}
      {groups?.length
        ? groups.map((group, i) => (
            <React.Fragment key={i}>
              <Eyebrow>{group.label}</Eyebrow>
              <Chips items={group.items} layout={layout} sent={sent} onSelect={onSelect} />
            </React.Fragment>
          ))
        : items?.length
          ? <Chips items={items} layout={layout} sent={sent} onSelect={onSelect} />
          : null}
    </div>
  ),
)
SuggestionChips.displayName = "SuggestionChips"
