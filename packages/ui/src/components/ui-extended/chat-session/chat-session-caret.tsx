import * as React from "react";
import { cn } from "../../../lib/utils";

/**
 * The cursor at the end of text that is still being written. A block, not a
 * bar: it reads as the place the next word lands.
 *
 * @deprecated Import from `@invana/assistant`. This export leaves `@invana/ui` in the next release.
 */
export function ChatSessionCaret({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block h-[1em] w-1.5 animate-pulse bg-muted-foreground align-[-0.15em] motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
