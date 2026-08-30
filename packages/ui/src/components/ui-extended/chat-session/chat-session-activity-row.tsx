import * as React from "react";
import { cn } from "../../../lib/utils";

/**
 * Shared gutter column for the console-style transcript. Every leading glyph —
 * status dot, prompt caret, spinner — occupies this fixed-width column so all
 * body text starts on one left edge ({@link ChatSessionPromptRow},
 * {@link ChatSessionProgressLine} and this row all use it).
 */
export const chatSessionGutterClass = "w-3.5 shrink-0 flex justify-center";

/**
 * Semantic state of an activity row, mapped to the status tokens from
 * `@invana/styling`. `pending` renders a hollow dot (queued / not started).
 */
export type ChatSessionActivityStatus =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "pending";

const markerClass: Record<ChatSessionActivityStatus, string> = {
  default: "bg-muted-foreground",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  pending: "bg-transparent border-[1.5px] border-muted-foreground",
};

export interface ChatSessionActivityRowProps {
  /** Colors the gutter marker; `warning`/`error` also tint the body text. */
  status?: ChatSessionActivityStatus;
  /** Replaces the status dot with a custom gutter node (e.g. a spinner). */
  marker?: React.ReactNode;
  /** Row body. Plain text wraps and preserves newlines; nodes render as-is. */
  children?: React.ReactNode;
  /** Action row, typically a `<ChatSessionMessageOptions />`. */
  actions?: React.ReactNode;
  /** Meta line under the body — e.g. "Cypher · 50 rows · 12ms". */
  meta?: React.ReactNode;
  /** Extra content below — sub-lines, a `<ChatSessionDisclosure />`, results. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * One event in a console-style transcript: a status-colored dot in the shared
 * gutter and a left-aligned body. Assistant text, tool calls, spawned agents,
 * and errors all render as activity rows — one visual grammar for everything
 * the system does. Nest `<ChatSessionActivitySubLine />` in `footer` for the
 * elbow-prefixed detail lines, and drop `<ChatSessionMessageOptions />` into
 * `actions` for the re-run / view-query / copy / vote toolbar.
 *
 * Presentational only — no data fetching or state.
 */
export function ChatSessionActivityRow({
  status = "default",
  marker,
  children,
  actions,
  meta,
  footer,
  className,
}: ChatSessionActivityRowProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <span className={cn(chatSessionGutterClass, "pt-[7px]")} aria-hidden>
        {marker ?? (
          <span
            className={cn("w-1.5 h-1.5 rounded-full", markerClass[status])}
          />
        )}
      </span>
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        <div
          className={cn(
            "whitespace-pre-wrap break-words",
            status === "error" && "text-destructive",
            status === "warning" && "text-warning",
          )}
        >
          {children}
        </div>
        {actions}
        {meta && <span className="text-muted-foreground">{meta}</span>}
        {footer}
      </div>
    </div>
  );
}

export interface ChatSessionActivitySubLineProps {
  /** Elbow glyph in front of the line. Defaults to "└". */
  elbow?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * An indented detail line under an activity row — "└ Backgrounded agent
 * (↓ to manage)", an interruption note, a one-line result. Render inside the
 * row's `footer` (or directly after the body in `children`).
 */
export function ChatSessionActivitySubLine({
  elbow,
  children,
  className,
}: ChatSessionActivitySubLineProps) {
  return (
    <div className={cn("flex gap-2 text-muted-foreground", className)}>
      <span className="shrink-0 select-none text-border" aria-hidden>
        {elbow ?? "└"}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}
