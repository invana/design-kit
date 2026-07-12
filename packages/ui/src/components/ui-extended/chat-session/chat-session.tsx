import * as React from "react";
import { ScrollArea } from "../../ui/scroll-area";
import { cn } from "../../../lib/utils";

export interface ChatSessionProps {
  /** The message list — typically `<ChatSessionMessage />` nodes. */
  children?: React.ReactNode;
  /** Fixed content below the scroll area (typically a `<ChatSessionComposer />`). */
  footer?: React.ReactNode;
  /** Rendered inside the scroll area when there are no messages. */
  emptyState?: React.ReactNode;
  /** Bump to force a jump to the latest message — e.g. when a new turn is
   *  appended. In-place growth (a reply resolving from "Thinking…" to its full
   *  body) is followed automatically and needs no key change. */
  autoScrollKey?: React.Key | null;
  /** How close to the bottom (px) still counts as "following". Scroll further up
   *  than this and new content stops yanking the view down. Defaults to 80. */
  followThreshold?: number;
  className?: string;
  /** Classes for the inner message column (padding, gap overrides). */
  bodyClassName?: string;
}

/**
 * The chat thread view: a scrollable stack of messages that sticks to the
 * latest, plus a fixed `footer` (the composer). Fills its parent's height, so
 * drop it into any sized container — panel chrome (header, breadcrumb, close)
 * is a separate concern the host provides.
 *
 * Auto-follow keeps the newest reply in view even as it grows in place (a
 * ResizeObserver watches the message column), but only while the user is already
 * near the bottom — scroll up to read history and the view stays put. Layout and
 * scroll behaviour only; it owns no session state.
 */
export function ChatSession({
  children,
  footer,
  emptyState,
  autoScrollKey,
  followThreshold = 80,
  className,
  bodyClassName,
}: ChatSessionProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  // Whether the view is stuck to the bottom (following new content). Starts true
  // so the thread opens at the latest message.
  const pinnedRef = React.useRef(true);

  // The Radix ScrollArea renders its own scrollable viewport inside the root.
  const getViewport = React.useCallback(
    () =>
      rootRef.current?.querySelector<HTMLElement>(
        "[data-radix-scroll-area-viewport]",
      ) ?? null,
    [],
  );

  const scrollToBottom = React.useCallback(() => {
    const viewport = getViewport();
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [getViewport]);

  // Track distance from the bottom so auto-follow only kicks in when the user is
  // already reading the latest — scrolling up to review history isn't yanked back.
  React.useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;
    const handleScroll = () => {
      const distance =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      pinnedRef.current = distance <= followThreshold;
    };
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [getViewport, followThreshold]);

  // Follow content growth: when the message column resizes — a reply lands or
  // grows from "Thinking…" to its full body (meta + actions) — stick to the
  // bottom if we're still following.
  React.useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) scrollToBottom();
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToBottom]);

  // Explicit trigger — a new turn was appended: re-pin and jump to it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: jump on autoScrollKey change
  React.useEffect(() => {
    pinnedRef.current = true;
    scrollToBottom();
  }, [autoScrollKey, scrollToBottom]);

  const isEmpty = React.Children.count(children) === 0;

  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      <ScrollArea ref={rootRef} className="flex-1 min-h-0">
        {isEmpty && emptyState ? (
          emptyState
        ) : (
          <div
            ref={contentRef}
            className={cn("flex flex-col gap-4 p-3", bodyClassName)}
          >
            {children}
          </div>
        )}
      </ScrollArea>
      {footer}
    </div>
  );
}
