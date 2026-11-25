import { Badge, cn } from "@invana/ui"

import type { BlockProps, Tone } from "../types"

import { ActionRow } from "../parts/actions"

const NOTE_TONE: Record<Tone, string> = {
  good: "text-success",
  bad: "text-destructive",
  warn: "text-warning",
  neutral: "text-muted-foreground",
}

/**
 * Filters an answer found for a table elsewhere — a type, each filter as it
 * reads, where they stand — and what to do with them: Apply, Clear, each sent
 * as an `action` with its id. The answer never holds the rows; the table the
 * filters are applied to does.
 */
export function FiltersBlock({ spec, onAction }: BlockProps<"filters">) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="truncate font-mono text-sm text-muted-foreground" title={spec.target}>
        {spec.target}
      </span>
      {spec.filters.length ? (
        <ul aria-label="Filters" className="flex flex-wrap gap-1.5">
          {spec.filters.map((f) => (
            <li key={f}>
              <Badge variant="soft" tone="info" size="sm" className="font-mono font-normal">
                {f}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}
      {spec.note || spec.actions.length ? (
        <div className="flex items-center gap-2">
          <span className={cn("min-w-0 flex-1 text-sm", NOTE_TONE[spec.noteTone ?? "neutral"])}>
            {spec.note}
          </span>
          {spec.actions.length ? (
            <span className="shrink-0">
              <ActionRow actions={spec.actions} onAction={(id) => onAction?.("action", id)} />
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
