import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ChatSessionStatusBarProps {
  /** Left-aligned items — mode indicator, view switch. Grows and truncates. */
  start?: React.ReactNode;
  /** Right-aligned items — agent count, shortcut hints. */
  end?: React.ReactNode;
  className?: string;
}

/**
 * The slim bar under a chat session's composer — mode indicator, view
 * switches, agent counts, keyboard hints. Two slots, muted by default; put
 * interactive elements (buttons, toggles) straight into the slots.
 */
export function ChatSessionStatusBar({
  start,
  end,
  className,
}: ChatSessionStatusBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-1.5 text-muted-foreground",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">{start}</div>
      {end && (
        <div className="flex shrink-0 items-center gap-3">{end}</div>
      )}
    </div>
  );
}
