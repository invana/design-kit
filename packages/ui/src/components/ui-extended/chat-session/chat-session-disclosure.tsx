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
 */
export function ChatSessionDisclosure({
  label,
  meta,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
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
