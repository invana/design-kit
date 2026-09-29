import * as React from "react"
import { Button, cn } from "@invana/ui"

export interface SuggestionChipsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Two to four follow-ups, each a whole prompt — `Compare with Q3 last year`. */
  items: string[]
  /** A follow-up was picked; it goes out as the next prompt. */
  onSelect?: (text: string) => void
}

/**
 * What to ask next, under an answer. Each chip is a whole prompt that reuses
 * the current scope, so picking one sends it as it reads — nothing to fill in.
 */
export const SuggestionChips = React.forwardRef<HTMLDivElement, SuggestionChipsProps>(
  ({ items, onSelect, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap gap-1.5", className)} {...props}>
      {items.map((text) => (
        <Button
          key={text}
          type="button"
          size="xs"
          variant="outline"
          className="font-normal"
          onClick={() => onSelect?.(text)}
        >
          <span aria-hidden className="text-muted-foreground">
            ↳
          </span>
          {text}
        </Button>
      ))}
    </div>
  ),
)
SuggestionChips.displayName = "SuggestionChips"
