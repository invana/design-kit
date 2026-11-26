import * as React from "react"
import { cn } from "@invana/ui"

import type { ConversationEvent } from "../protocol/events"
import type { ConversationSummary } from "../protocol/types"
import { relativeTime } from "./relative-time"

export interface ConversationListProps {
  /** The host's conversations, newest first — JSON, as the API sends them. */
  items: ConversationSummary[]
  /** The one the thread shows, marked in the list. */
  activeId?: string | null
  /** The heading. @default "Conversations" */
  title?: React.ReactNode
  /** Under the list — `Only you see your conversations.` */
  note?: React.ReactNode
  /** Shown when there are none. */
  emptyState?: React.ReactNode
  /** Heard for `new-conversation`, `open-conversation` and, with `onClose`, nothing more. */
  onEvent?: (event: ConversationEvent) => void
  /** Shows a close control in the heading. */
  onClose?: () => void
  /** Glyphs of your own, as `ChatSession` takes them. */
  icons?: { newChat?: React.ReactNode; close?: React.ReactNode }
  /** The clock for `2 min ago`, in ms. @default the time of render */
  now?: number
  className?: string
}

const BUTTON =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground"

/**
 * The list of conversations: what `ChatSession`'s History goes back one step
 * to. Picking a row opens that conversation, New starts an empty one — both
 * return to the thread, so the pair is one step back and one step in, never a
 * menu over it. Everything it does is an event; it holds no state.
 */
export function ConversationList({
  items,
  activeId,
  title = "Conversations",
  note,
  emptyState,
  onEvent,
  onClose,
  icons,
  now,
  className,
}: ConversationListProps) {
  // The time of the first render, unless given: read once, not on every render.
  const [mounted] = React.useState(() => Date.now())
  const clock = now ?? mounted
  return (
    <div className={cn("@container flex h-full min-h-0 flex-col bg-chrome", className)}>
      <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border pr-3 pl-3 @md:pl-6">
        <span className="min-w-0 truncate font-semibold">{title}</span>
        <span className="ml-auto flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEvent?.({ type: "new-conversation" })}
            aria-label="New conversation"
            title="New conversation"
            className={BUTTON}
          >
            {icons?.newChat ?? "+"}
          </button>
          {onClose ? (
            <button type="button" onClick={onClose} aria-label="Close the session" title="Close" className={BUTTON}>
              {icons?.close ?? "×"}
            </button>
          ) : null}
        </span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length ? (
          <ul className="m-0 flex list-none flex-col p-0">
            {items.map((item) => {
              const when = item.at ? relativeTime(item.at, clock) : undefined
              const line = [when, item.meta].filter(Boolean).join(" · ")
              return (
                <li key={item.id} className="border-b border-border">
                  <button
                    type="button"
                    aria-current={item.id === activeId ? "true" : undefined}
                    onClick={() => onEvent?.({ type: "open-conversation", id: item.id })}
                    className={cn(
                      "flex w-full min-w-0 flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-accent/40 @md:px-6",
                      item.id === activeId && "bg-secondary",
                    )}
                  >
                    <span className="w-full truncate font-semibold">{item.title || "Untitled"}</span>
                    {line ? <span className="w-full truncate text-sm text-muted-foreground">{line}</span> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          (emptyState ?? <p className="m-0 px-3 py-6 text-center text-muted-foreground">No conversations yet</p>)
        )}
      </div>
      {note ? <div className="shrink-0 border-t border-border px-3 py-2 text-sm text-muted-foreground @md:px-6">{note}</div> : null}
    </div>
  )
}
