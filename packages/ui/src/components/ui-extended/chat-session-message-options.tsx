import * as React from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "../../lib/utils";

/**
 * A single action in a message's option row. The library is icon-agnostic — pass
 * your own icon node (e.g. `<RotateCw className="w-3 h-3" />`), so no icon
 * dependency is baked into `@invana/ui`.
 */
export interface ChatSessionMessageAction {
  /** Icon node rendered inside the button. */
  icon: React.ReactNode;
  /** Accessible label, also used as the hover tooltip. */
  label: string;
  onClick?: () => void;
  /** Highlight the button — e.g. an active 👍/👎 vote. */
  active?: boolean;
  /** Extra classes when `active` (or always), for custom accents like green/red votes. */
  activeClassName?: string;
  /** Which group the action sits in: "start" (left) or "end" (right). Defaults to "start". */
  align?: "start" | "end";
  disabled?: boolean;
  className?: string;
}

export interface ChatSessionMessageOptionsProps {
  /** Actions rendered as icon buttons, grouped by their `align`. */
  actions: ChatSessionMessageAction[];
  className?: string;
}

/**
 * The action toolbar shown under an assistant message — re-run, view query,
 * copy, context, and 👍/👎 in the reference design. Start-aligned actions sit on
 * the left; end-aligned actions (typically feedback votes) float to the right.
 *
 * Purely presentational and icon-agnostic: you supply the icons and handlers, so
 * it slots into any backend.
 */
export function ChatSessionMessageOptions({
  actions,
  className,
}: ChatSessionMessageOptionsProps) {
  const start = actions.filter((a) => (a.align ?? "start") === "start");
  const end = actions.filter((a) => a.align === "end");

  const renderAction = (action: ChatSessionMessageAction, i: number) => (
    <Tooltip key={`${action.label}-${i}`}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-7 text-muted-foreground",
            action.active && (action.activeClassName ?? "text-foreground"),
            action.className,
          )}
          onClick={action.onClick}
          disabled={action.disabled}
          aria-label={action.label}
        >
          {action.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{action.label}</TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "flex items-center justify-between gap-1 text-muted-foreground",
          className,
        )}
      >
        <div className="flex items-center gap-1">{start.map(renderAction)}</div>
        {end.length > 0 && (
          <div className="flex items-center gap-1">{end.map(renderAction)}</div>
        )}
      </div>
    </TooltipProvider>
  );
}
