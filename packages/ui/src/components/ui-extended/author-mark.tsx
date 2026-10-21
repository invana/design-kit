import * as React from "react"
import { Sparkle } from "lucide-react"

import { cn } from "../../lib/utils"

/** Who wrote it: a person, by initials, or the assistant, by its star. */
export type AuthorKind = "person" | "assistant"

/** A person's tint — one of the theme's tones, so it reads in both themes. */
export type AuthorTone = "primary" | "success" | "warning" | "info" | "muted"

const TONE: Record<AuthorTone, string> = {
  primary: "bg-primary/25",
  success: "bg-success/30",
  warning: "bg-warning/35",
  info: "bg-info/25",
  muted: "bg-muted",
}

export interface AuthorMarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  kind?: AuthorKind
  /** Shown to assistive tech and as the tooltip — `Priya Nair`, `Assistant`. */
  name: string
  /** Two letters at most. Default: the name's first letters. */
  initials?: string
  tone?: AuthorTone
  size?: "sm" | "md"
}

/** `Priya Nair` → `PN`; one word → its first letter. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.length === 0 ? "?" : parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("")
}

/**
 * Who wrote a thing, at the size of a line of text.
 *
 * A person is their initials on a soft tint; the assistant is its star, in the
 * primary colour, never initials — so a reader tells the two apart at a glance
 * in a list of annotations, a card's foot or a row's meta line. The name is the
 * accessible label; the mark is the picture of it.
 */
export const AuthorMark = React.forwardRef<HTMLSpanElement, AuthorMarkProps>(
  ({ kind = "person", name, initials, tone = "primary", size = "sm", className, ...props }, ref) => {
    const box = size === "sm" ? "size-4 text-[7.5px]" : "size-5 text-[9px]"
    if (kind === "assistant") {
      return (
        <span
          ref={ref}
          role="img"
          aria-label={name}
          title={name}
          className={cn("inline-flex shrink-0 items-center justify-center text-primary", box, className)}
          {...props}
        >
          <Sparkle className={size === "sm" ? "size-3" : "size-3.5"} aria-hidden="true" />
        </span>
      )
    }
    return (
      <span
        ref={ref}
        role="img"
        aria-label={name}
        title={name}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-foreground",
          box,
          TONE[tone],
          className,
        )}
        {...props}
      >
        {(initials ?? initialsOf(name)).slice(0, 2)}
      </span>
    )
  },
)
AuthorMark.displayName = "AuthorMark"
