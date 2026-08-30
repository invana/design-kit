import * as React from "react";
import { cn } from "../../../lib/utils";
import { chatSessionGutterClass } from "./chat-session-activity-row";

export interface ChatSessionPromptRowProps {
  /** The echoed user input. Plain text wraps and preserves newlines. */
  children?: React.ReactNode;
  /** Gutter glyph. Defaults to "❯". */
  caret?: React.ReactNode;
  /** Right-aligned meta — a timestamp, an attachment count. */
  meta?: React.ReactNode;
  className?: string;
}

/**
 * The user's turn in a console-style transcript: a full-bleed highlighted band
 * with the caret in the shared gutter, so the echoed text sits on exactly the
 * same left edge as the {@link ChatSessionActivityRow} bodies below it.
 *
 * Full bleed assumes the default `ChatSession` body padding (`p-3`) — the
 * negative margins here cancel it. If you override `bodyClassName` with a
 * different horizontal padding, pass matching `-mx-*`/`px-*` via `className`.
 */
export function ChatSessionPromptRow({
  children,
  caret,
  meta,
  className,
}: ChatSessionPromptRowProps) {
  return (
    <div
      className={cn("-mx-3 flex gap-2 bg-muted/70 px-3 py-2", className)}
    >
      <span
        className={cn(
          chatSessionGutterClass,
          "select-none font-semibold text-primary",
        )}
        aria-hidden
      >
        {caret ?? "❯"}
      </span>
      <div className="min-w-0 flex-1 whitespace-pre-wrap break-words">
        {children}
      </div>
      {meta && (
        <span className="shrink-0 self-start text-muted-foreground">
          {meta}
        </span>
      )}
    </div>
  );
}
