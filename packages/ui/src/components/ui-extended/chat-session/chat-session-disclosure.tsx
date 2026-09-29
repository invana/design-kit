import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ChatSessionDisclosureProps {
  /** Header label — "cypher", "result", "context". */
  label: React.ReactNode;
  /** Right-aligned header meta — "50 rows · 12ms". */
  meta?: React.ReactNode;
  /** Disclosed content. Wrapped in an `overflow-x-auto` container. */
  children?: React.ReactNode;
  /** Controlled open state. Omit for uncontrolled (see `defaultOpen`). */
  open?: boolean;
  /** Uncontrolled initial state. Defaults to closed. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * `card` (default) is a bordered block under an activity row. `inline` is a
   * bare line inside an answer — `▸ method` with its meta at the right in mono —
   * that opens onto a preformatted code block.
   */
  variant?: "card" | "inline";
  /** Custom chevron node; the default "▸" rotates when open. */
  chevron?: React.ReactNode;
  className?: string;
  /** Classes for the content area — e.g. `font-mono` for a query block. */
  contentClassName?: string;
}

/**
 * A collapsible detail block under an activity row — the expanded state of
 * "View query": generated Cypher, a result preview, gathered context. Renders
 * as a bordered card with a click-to-toggle header (label + meta) and an
 * `overflow-x-auto` body, matching the transcript's nested-detail grammar.
 *
 * Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
 *
 * @deprecated Import from `@invana/assistant`. This export leaves `@invana/ui` in the next release.
 */
export function ChatSessionDisclosure({
  label,
  meta,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  variant = "card",
  chevron,
  className,
  contentClassName,
}: ChatSessionDisclosureProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  const toggle = () => {
    const next = !isOpen;
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex min-w-0 flex-col gap-1", className)}>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          className="flex w-full min-w-0 items-center gap-2 text-left text-sm hover:text-foreground"
        >
          <span className="flex shrink-0 items-center gap-1">
            <span
              className={cn(
                "shrink-0 select-none text-muted-foreground transition-transform",
                !chevron && isOpen && "rotate-90",
              )}
              aria-hidden
            >
              {chevron ?? "▸"}
            </span>
            {label}
          </span>
          {meta && (
            <span className="ml-auto min-w-0 truncate font-mono text-xs text-muted-foreground">
              {meta}
            </span>
          )}
        </button>
        {isOpen && (
          <pre
            className={cn(
              "m-0 overflow-x-auto rounded-sm border border-border/60 bg-background px-2 py-1.5 font-mono text-xs whitespace-pre text-muted-foreground",
              contentClassName,
            )}
          >
            {children}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-accent/40",
        className,
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <span
          className={cn(
            "shrink-0 select-none transition-transform",
            !chevron && isOpen && "rotate-90",
          )}
          aria-hidden
        >
          {chevron ?? "▸"}
        </span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {meta && (
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {meta}
          </span>
        )}
      </button>
      {isOpen && (
        <div
          className={cn(
            "overflow-x-auto border-t border-border px-2.5 py-2",
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
