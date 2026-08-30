import * as React from "react";
import { cn } from "../../../lib/utils";
import { chatSessionGutterClass } from "./chat-session-activity-row";

export interface ChatSessionProgressLineProps {
  /** What's happening — "Waiting for 1 background agent to finish". */
  children?: React.ReactNode;
  /** Custom spinner node in the gutter; defaults to a CSS ring spinner. */
  spinner?: React.ReactNode;
  /** Right-aligned elapsed/progress readout — "29s", "12k tokens". */
  elapsed?: React.ReactNode;
  className?: string;
}

/** Default CSS-only ring spinner — no icon dependency. */
function RingSpinner() {
  return (
    <span
      className="h-3 w-3 rounded-full border-2 border-muted border-t-primary animate-spin motion-reduce:animate-none"
      role="status"
      aria-label="Working"
    />
  );
}

/**
 * A transient "work in flight" line in the transcript — spinner in the shared
 * gutter, label, and an optional right-aligned elapsed readout. Replace it with
 * a settled {@link ChatSessionActivityRow} when the run finishes.
 */
export function ChatSessionProgressLine({
  children,
  spinner,
  elapsed,
  className,
}: ChatSessionProgressLineProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-muted-foreground",
        className,
      )}
    >
      <span className={chatSessionGutterClass}>
        {spinner ?? <RingSpinner />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {elapsed && (
        <span className="shrink-0 tabular-nums">{elapsed}</span>
      )}
    </div>
  );
}
