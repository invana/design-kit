import * as React from "react"
import { BoxSelect, Highlighter, MessageSquareText, StickyNote, TriangleAlert, Unlink } from "lucide-react"

import { cn } from "../../lib/utils"
import { ANNOTATION_COLOR, SessionTag, type AnnotationAuthor, type AnnotationColor } from "./annotation-card"
import { AuthorMark } from "./author-mark"

/** The anchor's shape: a record, one of its values, a set or path, a group. */
export type AnnotationKind = "note" | "value" | "highlight" | "group"

const KIND_ICON: Record<AnnotationKind, React.ComponentType<{ className?: string }>> = {
  note: StickyNote,
  value: MessageSquareText,
  highlight: Highlighter,
  group: BoxSelect,
}

export interface AnnotationRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  kind: AnnotationKind
  color?: AnnotationColor
  /** What it says — or a group's name. Two lines at most. */
  text: React.ReactNode
  /** What it is on, in the record's own words — `DXB · on_time`, `7 records`. */
  where: React.ReactNode
  author: AnnotationAuthor
  /** After the author — `2 Oct`, `Answer 1`. */
  meta?: React.ReactNode
  sessionTag?: React.ReactNode
  /** A walkthrough step it is shown in — `Step 2`. */
  step?: React.ReactNode
  /** The value changed since it was written. */
  changed?: boolean
  /** Its record is gone from the graph. */
  gone?: boolean
  /** Not drawn on this board — hidden, or its record not loaded. */
  dimmed?: boolean
  selected?: boolean
  onSelect?: () => void
  /** At the row's end — an eye, *Load*. */
  trailing?: React.ReactNode
}

/**
 * One annotation in a list — the Annotations panel's row.
 *
 * The kind is the tile on the left, in the annotation's colour; the text leads,
 * two lines at most; under it, mono, what it is on, then who wrote it, then
 * the marks a reader scans for: changed since written, record gone, seen only
 * in one session, the walkthrough step it is shown in. The whole row selects;
 * `trailing` holds the row's own control, outside that button.
 */
export const AnnotationRow = React.forwardRef<HTMLDivElement, AnnotationRowProps>(
  (
    {
      kind,
      color = "amber",
      text,
      where,
      author,
      meta,
      sessionTag,
      step,
      changed,
      gone,
      dimmed,
      selected,
      onSelect,
      trailing,
      className,
      ...props
    },
    ref,
  ) => {
    const Icon = KIND_ICON[kind]
    const c = ANNOTATION_COLOR[color]
    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-1 rounded-md", selected && "bg-accent", dimmed && "opacity-60", className)}
        {...props}
      >
        <button
          type="button"
          aria-pressed={selected}
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-start gap-2 rounded-md p-1.5 text-left"
        >
          <span className={cn("inline-flex size-control-xs shrink-0 items-center justify-center rounded-sm", c.tint, c.text)}>
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="line-clamp-2">{text}</span>
            <span className="text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
              {changed && <TriangleAlert className="text-warning size-3" aria-label="Changed since written" />}
              {gone && <Unlink className="size-3" aria-label="Its record was deleted" />}
              <span className="font-mono">{where}</span>
              <span aria-hidden="true">·</span>
              <AuthorMark
                kind={author.kind}
                name={author.name}
                {...(author.initials ? { initials: author.initials } : {})}
                {...(author.tone ? { tone: author.tone } : {})}
              />
              <span>{meta ? `${author.name} · ` : author.name}{meta}</span>
              {sessionTag && <SessionTag>{sessionTag}</SessionTag>}
              {step && (
                <span className="bg-primary/12 text-primary rounded-full px-1.5 whitespace-nowrap">{step}</span>
              )}
            </span>
          </span>
        </button>
        {trailing && <span className="flex shrink-0 items-center pt-1.5 pr-1">{trailing}</span>}
      </div>
    )
  },
)
AnnotationRow.displayName = "AnnotationRow"
