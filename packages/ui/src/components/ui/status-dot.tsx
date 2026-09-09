import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * The state of one thing, as a dot.
 *
 * It appears beside almost everything that has a state — a step in a run, an
 * agent in a roster, a dataset, a schedule firing, a node type in a legend.
 * Extracted from `ChatSessionTaskRow`, which had grown its own copy: the same
 * six states were being re-declared per surface, and two of them had already
 * drifted apart.
 *
 * `rounded-full` is correct here and not a violation of the radius rule — a
 * status dot is one of the shapes where round *is* the object, alongside
 * avatars and spinners (see `@invana/styling` › border radius).
 *
 * **A dot is never the only carrier of state.** Every use names the state
 * beside it, or exposes it through `label`. Colour alone fails colour-blind
 * readers, and a `running` pulse fails anyone with motion reduced — which the
 * `motion-reduce` variant below honours by design.
 */
const statusDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    tone: {
      /** Work in flight. The only tone that animates. */
      running: "bg-primary animate-pulse motion-reduce:animate-none",
      /** Finished, and the result stands. */
      success: "bg-success",
      /** Finished, but something wants a person to look. */
      warning: "bg-warning",
      /** Failed. */
      error: "bg-destructive",
      /** Informational — a note, a count, a neutral marker. */
      info: "bg-info",
      /** Not started. Hollow, because there is nothing in it yet. */
      queued: "bg-transparent border-[1.5px] border-muted-foreground",
      /** Present but inactive — retired, paused, skipped, hidden. */
      muted: "bg-muted-foreground",
    },
    size: {
      /** 5px — inside a dense step row. */
      xs: "size-[5px]",
      /** 6px — the default in a thread or a list row. */
      sm: "size-1.5",
      /** 8px — a roster row, a legend swatch. */
      md: "size-2",
      /** 10px — a legend key that stands on its own. */
      lg: "size-2.5",
    },
  },
  defaultVariants: {
    tone: "muted",
    size: "sm",
  },
});

export interface StatusDotProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof statusDotVariants> {
  /**
   * What this state is called, for a screen reader.
   *
   * Pass it when the dot is the only thing carrying the state. Omit it when
   * the state is already written beside the dot, so it is not announced twice.
   */
  label?: string;
}

const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, tone, size, label, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(statusDotVariants({ tone, size }), className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
    />
  ),
);
StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants };
