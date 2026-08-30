import * as React from "react";
import { cn } from "../../../lib/utils";

/**
 * Lifecycle of a background task / session. Mapped to the status tokens from
 * `@invana/styling`: `running` pulses the primary dot, `needs-input` is the
 * warning color, `queued` renders hollow.
 */
export type ChatSessionTaskStatus =
  | "running"
  | "needs-input"
  | "success"
  | "error"
  | "queued";

const indicatorClass: Record<ChatSessionTaskStatus, string> = {
  running: "bg-primary animate-pulse motion-reduce:animate-none",
  "needs-input": "bg-warning",
  success: "bg-success",
  error: "bg-destructive",
  queued: "bg-transparent border-[1.5px] border-muted-foreground",
};

export interface ChatSessionTaskRowProps {
  /** Colors the leading dot. */
  status?: ChatSessionTaskStatus;
  /** Replaces the status dot — e.g. a spinner node for a running task. */
  indicator?: React.ReactNode;
  /** Task/agent name, kept bold and never truncated. */
  name: React.ReactNode;
  /** One-line summary; truncates with ellipsis. */
  description?: React.ReactNode;
  /** Right-aligned meta — "2s · ↑ 18.4k tokens", "38d". */
  meta?: React.ReactNode;
  /** Makes the row an interactive button (hover surface, focus ring). */
  onClick?: () => void;
  className?: string;
}

/**
 * One background task / agent / session: status dot, bold name, truncating
 * description, right-aligned meta. Used both in the pinned strip under a
 * transcript and in the grouped task dashboard ({@link ChatSessionTaskGroup}).
 */
export function ChatSessionTaskRow({
  status = "queued",
  indicator,
  name,
  description,
  meta,
  onClick,
  className,
}: ChatSessionTaskRowProps) {
  const content = (
    <>
      <span className="flex w-3.5 shrink-0 justify-center" aria-hidden>
        {indicator ?? (
          <span
            className={cn("h-1.5 w-1.5 rounded-full", indicatorClass[status])}
          />
        )}
      </span>
      <span className="shrink-0 font-medium">{name}</span>
      {description && (
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          {description}
        </span>
      )}
      {meta && (
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {meta}
        </span>
      )}
    </>
  );

  const rowClass = cn(
    "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left",
    onClick && "hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring",
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClass}>
        {content}
      </button>
    );
  }
  return <div className={rowClass}>{content}</div>;
}

export interface ChatSessionTaskGroupProps {
  /** Section heading — "Needs input", "Completed", "Running". */
  heading?: React.ReactNode;
  /** The rows — typically `<ChatSessionTaskRow />` nodes. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * A titled section of task rows — the "Needs input" / "Completed" groups of a
 * session dashboard.
 */
export function ChatSessionTaskGroup({
  heading,
  children,
  className,
}: ChatSessionTaskGroupProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {heading && <div className="font-semibold">{heading}</div>}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
