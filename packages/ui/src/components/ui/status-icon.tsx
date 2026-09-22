import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CirclePause,
  CircleSlash,
  CircleX,
  Clock,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * The state of one thing, as a glyph in a circle.
 *
 * `StatusDot`'s sibling for the rows where the state is **not written beside
 * it**. A dot carries the state by colour alone, so it needs a word next to it;
 * a glyph carries it by shape as well, so the word can go. A reader who cannot
 * tell green from red still tells a check from a cross.
 *
 * `running` is the one state that moves, and it stops moving under
 * `prefers-reduced-motion`.
 */
const GLYPH: Record<StatusIconState, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  running: LoaderCircle,
  queued: Clock,
  waiting: CirclePause,
  question: CircleHelp,
  alert: CircleAlert,
  cancelled: CircleSlash,
};

const statusIconVariants = cva("inline-block shrink-0", {
  variants: {
    state: {
      /** Finished, and the result stands. */
      success: "text-success",
      /** Failed. */
      error: "text-destructive",
      /** Work in flight. The only state that animates. */
      running: "text-info animate-spin motion-reduce:animate-none",
      /** Not started. */
      queued: "text-muted-foreground",
      /** Parked on a person — an approval, an answer. */
      waiting: "text-warning",
      /** Finished, but it could not answer. */
      question: "text-warning",
      /** Finished, but only in part. */
      alert: "text-warning",
      /** Stopped before it finished. */
      cancelled: "text-muted-foreground",
    },
    size: {
      /** 14px — a dense row. */
      sm: "size-3.5",
      /** 16px — a list row. */
      md: "size-4",
    },
  },
  defaultVariants: {
    state: "queued",
    size: "md",
  },
});

export type StatusIconState =
  | "success"
  | "error"
  | "running"
  | "queued"
  | "waiting"
  | "question"
  | "alert"
  | "cancelled";

export interface StatusIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "children">,
    VariantProps<typeof statusIconVariants> {
  state: StatusIconState;
  /**
   * What this state is called — the accessible name and the tooltip.
   *
   * Pass it whenever the glyph stands alone, which is the reason to use one.
   */
  label?: string;
}

const StatusIcon = React.forwardRef<SVGSVGElement, StatusIconProps>(
  ({ state, size, label, className, ...props }, ref) => {
    const Glyph = GLYPH[state];
    return (
      <Glyph
        ref={ref}
        className={cn(statusIconVariants({ state, size }), className)}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        {...props}
      >
        {label ? <title>{label}</title> : null}
      </Glyph>
    );
  },
);
StatusIcon.displayName = "StatusIcon";

export { StatusIcon, statusIconVariants };
