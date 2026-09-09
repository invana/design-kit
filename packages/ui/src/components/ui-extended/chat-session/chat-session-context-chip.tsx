import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ChatSessionContextChipProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** A small icon for what is bound — a node, a dataset, a task. */
  icon?: React.ReactNode;
  /** What the question will be about — `Asking about obs_20260908_bpcl_01`. */
  children?: React.ReactNode;
  /** Unbinds it. Omit to make the binding fixed. */
  onDismiss?: () => void;
  dismissLabel?: string;
}

/**
 * What the next question is about, shown above the composer.
 *
 * Selecting something on a canvas binds it here, so the thing you are looking
 * at is the thing you are asking about — that is the whole point of the chip.
 * It fills `ChatSessionComposer`'s `attachments` slot rather than living inside
 * the composer, because what is bound is the surface's business, not the
 * composer's.
 *
 * It states the binding in words. A highlight on the canvas alone would leave
 * the reader guessing what scope their question has.
 */
export function ChatSessionContextChip({
  icon,
  onDismiss,
  dismissLabel = "Remove context",
  className,
  children,
  ...props
}: ChatSessionContextChipProps) {
  return (
    <div
      className={cn(
        "flex min-h-[26px] items-center gap-1.5 border border-border bg-muted/40 px-1.5 text-meta",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-3">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="shrink-0 px-1 text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
