import * as React from "react"
import { cn } from "@invana/ui"

export interface TurnLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Who is speaking — the analyst's name, or `Assistant`. */
  children: React.ReactNode
  /** `end` over the analyst's prompt, which sits at the right; `start` over an ask. */
  align?: "start" | "end"
}

/**
 * Who is speaking, over the turn they spoke — `RESEARCHER`, `ASSISTANT`.
 *
 * Drawn over the analyst's prompts and the assistant's asks, the two kinds of
 * turn that address someone. An answer is a card with its own header and needs
 * no label. Mono, small and spaced, so it reads as a tag on the turn rather than
 * a heading of the thread.
 */
export const TurnLabel = React.forwardRef<HTMLDivElement, TurnLabelProps>(
  ({ align = "start", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "font-mono text-xs tracking-wider text-muted-foreground uppercase",
        align === "end" && "text-right",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
TurnLabel.displayName = "TurnLabel"
