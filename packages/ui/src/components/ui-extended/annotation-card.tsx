import * as React from "react"
import { History, TriangleAlert } from "lucide-react"

import { cn } from "../../lib/utils"
import { AuthorMark, type AuthorKind, type AuthorTone } from "./author-mark"

/** An annotation's colour, by name. Each is a theme token, never a hex. */
export type AnnotationColor = "amber" | "blue" | "green" | "red" | "grey"

/** The edge and the tint of each colour. */
export const ANNOTATION_COLOR: Record<AnnotationColor, { edge: string; tint: string; text: string }> = {
  amber: { edge: "border-l-warning", tint: "bg-warning/12", text: "text-warning" },
  blue: { edge: "border-l-primary", tint: "bg-primary/10", text: "text-primary" },
  green: { edge: "border-l-success", tint: "bg-success/12", text: "text-success" },
  red: { edge: "border-l-destructive", tint: "bg-destructive/10", text: "text-destructive" },
  grey: { edge: "border-l-muted-foreground", tint: "bg-muted", text: "text-muted-foreground" },
}

export interface AnnotationAuthor {
  name: string
  kind?: AuthorKind
  initials?: string
  tone?: AuthorTone
}

export interface AnnotationCardValue {
  /** The property — `on_time`. */
  prop: string
  /** What the record holds now — `64%`. */
  now: string
  /** What it held when the annotation was written. Differing from `now`, the card says so. */
  then?: string
}

export interface AnnotationCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** What it says. */
  text?: React.ReactNode
  color?: AnnotationColor
  /** On one value of the record: its property and value, above the text. */
  value?: AnnotationCardValue
  /** The graph cannot answer this: *Not in the data*, above the text. */
  gap?: boolean
  author: AnnotationAuthor
  /** Beside the author — `2 Oct`, `Answer 5`. */
  meta?: React.ReactNode
  /**
   * Seen only in one session — the card is dashed and carries this tag
   * (`Session`, a session's title). Omitted, it is the graph's.
   */
  sessionTag?: React.ReactNode
  /** Drawn in place of the text while it is written — a textarea. */
  editor?: React.ReactNode
  /** Under the foot — *Add to the graph · Dismiss*. */
  actions?: React.ReactNode
  selected?: boolean
}

/**
 * One annotation, as it sits beside the record it is about.
 *
 * Its colour is a left edge and a soft tint, so a card reads as a note *on*
 * something rather than a panel of its own. The foot says who wrote it and
 * when; a value annotation leads with the value it is about, and says *Was 71%
 * when noted* once the record no longer holds what it was written against —
 * the annotation never rewrites itself. A card seen only in one session is
 * dashed and tagged, which is how it is told apart from the graph's.
 *
 * The card knows nothing of where it is drawn — a board overlay places it
 * beside its record, a list draws it inline.
 */
export const AnnotationCard = React.forwardRef<HTMLDivElement, AnnotationCardProps>(
  (
    { text, color = "amber", value, gap, author, meta, sessionTag, editor, actions, selected, className, ...props },
    ref,
  ) => {
    const c = ANNOTATION_COLOR[color]
    const changed = value?.then !== undefined && value.then !== value.now
    return (
      <div
        ref={ref}
        data-selected={selected ? "" : undefined}
        className={cn(
          "bg-card text-foreground relative w-49 rounded-sm border border-l-[3px] px-2.5 pt-2 pb-1.5 leading-snug shadow-md",
          sessionTag ? "border-border border-dashed" : "border-transparent",
          c.edge,
          selected && "outline-primary outline outline-[1.5px] outline-offset-4 outline-dashed",
          className,
        )}
        {...props}
      >
        <div className={cn("pointer-events-none absolute inset-0 rounded-sm", c.tint)} aria-hidden="true" />
        <div className="relative">
          {gap && (
            <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-semibold">
              <TriangleAlert className="size-3" aria-hidden="true" />
              Not in the data
            </div>
          )}
          {value && (
            <div className="border-foreground/10 mb-1.5 flex items-baseline gap-1.5 border-b pb-1.5">
              <span className="text-muted-foreground font-mono text-xs">{value.prop}</span>
              <span className="font-mono text-xs font-semibold">{value.now}</span>
            </div>
          )}
          {editor ?? <p className="m-0 whitespace-pre-wrap">{text}</p>}
          {changed && (
            <div className="text-warning mt-1 flex items-center gap-1 text-xs">
              <History className="size-3" aria-hidden="true" />
              Was {value!.then} when noted
            </div>
          )}
          <div className="text-muted-foreground mt-1.5 flex min-w-0 items-center gap-1.5 text-xs">
            <AuthorMark
              kind={author.kind}
              name={author.name}
              {...(author.initials ? { initials: author.initials } : {})}
              {...(author.tone ? { tone: author.tone } : {})}
            />
            <span className="min-w-0 flex-1 truncate">
              {author.kind === "assistant" ? meta ?? author.name : meta ? `${author.name} · ` : author.name}
              {author.kind !== "assistant" && meta}
            </span>
            {sessionTag && <SessionTag>{sessionTag}</SessionTag>}
          </div>
          {actions && <div className="mt-1.5 flex flex-wrap items-center gap-1">{actions}</div>}
        </div>
      </div>
    )
  },
)
AnnotationCard.displayName = "AnnotationCard"

/** Seen only in one session: a dashed tag with its name, truncated to one line. */
export function SessionTag({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex max-w-24 shrink-0 items-center gap-1 rounded-sm border border-dashed px-1 text-xs whitespace-nowrap",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
    </span>
  )
}
