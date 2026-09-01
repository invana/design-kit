import * as React from "react";
import { cn } from "../../../lib/utils";

export type ChatSessionMessageRole = "user" | "assistant";

/**
 * Lifecycle of an assistant message. `running` shows the bouncing dots,
 * `stopped` renders a muted italic note (user-aborted), `error` tints the body
 * with the destructive colour. `idle` is a settled reply.
 */
export type ChatSessionMessageStatus = "idle" | "running" | "error" | "stopped";

export interface ChatSessionMessageProps {
  /** "user" renders a right-aligned bubble; "assistant" a left-aligned block. */
  role: ChatSessionMessageRole;
  /** Message body. Plain text wraps and preserves newlines; nodes render as-is. */
  children?: React.ReactNode;
  /** Assistant lifecycle — ignored for user messages. Defaults to "idle". */
  status?: ChatSessionMessageStatus;
  /** Leading icon slot — e.g. a canvas-operation glyph on a user bubble, or an
   *  avatar on an assistant reply. Icon-agnostic: pass your own node. */
  icon?: React.ReactNode;
  /** Meta line under the body — e.g. "Cypher · 50 rows · 12ms". */
  meta?: React.ReactNode;
  /** Action row, typically a `<ChatSessionMessageOptions />`. Assistant only by
   *  convention; rendered between the body and the meta line. */
  actions?: React.ReactNode;
  /** Extra content below the meta line — a query disclosure, a result block, etc. */
  footer?: React.ReactNode;
  className?: string;
}

/** Three bouncing dots — the "reply is streaming/running" affordance. */
function RunningDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="Running">
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
    </span>
  );
}

/**
 * A single turn in a {@link ChatSession}. User turns are right-aligned bubbles;
 * assistant turns are left-aligned blocks that can carry a meta line, an action
 * row ({@link ChatSessionMessageOptions}), and arbitrary footer content
 * (query disclosure, result preview, …).
 *
 * Presentational only — no data fetching or state — so it composes over any
 * backend.
 */
export function ChatSessionMessage({
  role,
  children,
  status = "idle",
  icon,
  meta,
  actions,
  footer,
  className,
}: ChatSessionMessageProps) {
  if (role === "user") {
    return (
      <div className={cn("flex justify-end", className)}>
        <div
          className={cn(
            "max-w-[85%] bg-secondary px-3 py-2 text-secondary-foreground whitespace-pre-wrap break-words",
            icon && "flex items-center gap-1.5",
          )}
        >
          {icon && <span className="shrink-0 opacity-70">{icon}</span>}
          {icon ? (
            <span className="min-w-0 break-words">{children}</span>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }

  // Assistant — still-running reply: body plus the bouncing dots.
  if (status === "running") {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        <RunningDots />
      </div>
    );
  }

  // User-aborted run.
  if (status === "stopped") {
    return (
      <p className={cn("text-muted-foreground italic", className)}>{children}</p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-start gap-2">
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <div
          className={cn(
            "min-w-0 flex-1 whitespace-pre-wrap break-words",
            status === "error" ? "text-destructive" : "text-foreground",
          )}
        >
          {children}
        </div>
      </div>
      {actions}
      {meta && <span className="text-muted-foreground">{meta}</span>}
      {footer}
    </div>
  );
}
