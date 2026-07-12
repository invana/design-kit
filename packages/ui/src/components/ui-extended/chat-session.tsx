import * as React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";

export interface ChatSessionProps {
  /** The message list — typically `<ChatSessionMessage />` nodes. */
  children?: React.ReactNode;
  /** Fixed content below the scroll area (typically a `<ChatSessionComposer />`). */
  footer?: React.ReactNode;
  /** Rendered inside the scroll area when there are no messages. */
  emptyState?: React.ReactNode;
  /** Change this whenever the thread grows/updates (e.g. the message count) to
   *  auto-scroll to the latest message. */
  autoScrollKey?: React.Key | null;
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
 * Layout only — it owns no session state. Feed it messages as children and bump
 * {@link ChatSessionProps.autoScrollKey} to keep the newest reply in view.
 */
export function ChatSession({
  children,
  footer,
  emptyState,
  autoScrollKey,
  className,
  bodyClassName,
}: ChatSessionProps) {
  const endRef = React.useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-scroll on any autoScrollKey change
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [autoScrollKey]);

  const isEmpty = React.Children.count(children) === 0;

  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      <ScrollArea className="flex-1 min-h-0">
        {isEmpty && emptyState ? (
          emptyState
        ) : (
          <div className={cn("flex flex-col gap-4 p-3", bodyClassName)}>
            {children}
            {/* Scroll anchor — keeps the thread pinned to the latest message. */}
            <div ref={endRef} />
          </div>
        )}
      </ScrollArea>
      {footer}
    </div>
  );
}
