import * as React from "react";

import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface ClampedTextProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** How many lines survive before the fold. Three is the panel default. */
  lines?: number;
  moreLabel?: string;
  lessLabel?: string;
  children?: React.ReactNode;
}

/**
 * Prose that shows its first few lines and offers the rest.
 *
 * A project's purpose, an agent's instructions, a dataset's note: text whose
 * *first sentence* is what a panel is for, and whose full length would push the
 * list under it off the screen. It clamps to `lines`, and reveals the rest in
 * place — never in a tooltip or a dialog, because the reader is already looking
 * at the right place.
 *
 * **The toggle only exists when there is something behind it.** The clamp is
 * measured, not guessed from a character count: a three-line paragraph in a
 * wide panel is one line in a wider one, and a `Show more` that reveals nothing
 * teaches the reader to stop pressing it. Re-measured on resize for the same
 * reason.
 */
export const ClampedText = React.forwardRef<HTMLDivElement, ClampedTextProps>(
  (
    {
      lines = 3,
      moreLabel = "Show more",
      lessLabel = "Show less",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = React.useState(false);
    const [clipped, setClipped] = React.useState(false);
    const bodyRef = React.useRef<HTMLParagraphElement>(null);

    // Only measured while clamped: expanded, `scrollHeight === clientHeight` by
    // definition, and measuring there would retract the button that got you here.
    React.useLayoutEffect(() => {
      const el = bodyRef.current;
      if (!el || expanded) return;
      const measure = () => setClipped(el.scrollHeight - el.clientHeight > 1);
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, [expanded, children, lines]);

    return (
      <div ref={ref} className={cn("min-w-0", className)} {...props}>
        <p
          ref={bodyRef}
          className={cn(
            "whitespace-pre-line",
            !expanded &&
              "overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:var(--clamped-lines)] [display:-webkit-box]",
          )}
          style={{ "--clamped-lines": lines } as React.CSSProperties}
        >
          {children}
        </p>
        {clipped ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? lessLabel : moreLabel}
          </Button>
        ) : null}
      </div>
    );
  },
);
ClampedText.displayName = "ClampedText";
