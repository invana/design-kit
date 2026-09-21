import * as React from "react"

import { cn } from "../../lib/utils"

export interface LensChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "onClick"> {
  /**
   * The lens in force. **`undefined` is a real, common state** and reads
   * `Everything` — see below.
   */
  lens?: { name: string; kind?: "world" | "guardrail" }
  /** Open the picker. Absent leaves the chip as a statement. */
  onPick?: () => void
}

/**
 * Which world a run is being read under — the header's right-hand chip, and the
 * one on an agent's row.
 *
 * **No lens reads `Everything`, never blank and never `None`.** A Graph that
 * sets no lens sees the whole global model, every configured provider and every
 * third party its agents are credentialed for: the widest state is the default,
 * and it is a *state*, not a missing value. `None` would suggest nothing is in
 * view, which is the exact opposite of what is true. `Everything` is also still
 * inside the guardrails, which is why a guardrail is not a lens you pick.
 *
 * It is the smallest surface in Govern and the one most often on screen, so it
 * carries the name and nothing else. What that world narrows belongs in the
 * drawer the chip opens — a chip that listed its rules would be a rule list
 * that happened to be in a header.
 */
export const LensChip = React.forwardRef<HTMLSpanElement, LensChipProps>(
  ({ lens, onPick, className, ...props }, ref) => {
    const label = lens?.name ?? "Everything"
    const unset = lens == null

    const body = (
      <>
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            unset ? "bg-muted-foreground" : "bg-primary",
          )}
        />
        <span className="min-w-0 truncate">{label}</span>
      </>
    )

    const shell = cn(
      "inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-control",
      "border border-border px-1.5 py-0.5 text-sm",
      unset ? "text-muted-foreground" : "text-foreground",
      className,
    )

    if (onPick) {
      return (
        <span ref={ref} className="inline-flex min-w-0" {...props}>
          <button
            type="button"
            onClick={onPick}
            title={
              unset ? "Everything — the whole model, inside the guardrails" : label
            }
            className={cn(
              shell,
              "cursor-pointer hover:bg-accent",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            )}
          >
            {body}
          </button>
        </span>
      )
    }

    return (
      <span ref={ref} className={shell} title={label} {...props}>
        {body}
      </span>
    )
  },
)
LensChip.displayName = "LensChip"
