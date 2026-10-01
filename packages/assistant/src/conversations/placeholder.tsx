import { cn } from "@invana/ui"

export interface PlaceholderProps {
  /** The block's kind. */
  kind: string
  /** The block's spec exactly as it was sent. */
  options: unknown
  className?: string
}

/**
 * A block with no renderer yet: its kind and the JSON it was sent.
 *
 * Shown rather than skipped, and never an error. A conversation is data that
 * outlives the code reading it, and a silently missing block is worse than a
 * visible one, because the analyst reads an answer they believe is complete.
 * While the kit is being built, the placeholders in a session story are also
 * the work left, in the place it will appear.
 */
export function Placeholder({ kind, options, className }: PlaceholderProps) {
  const { kind: _kind, ...rest } = (options ?? {}) as Record<string, unknown>
  const json = JSON.stringify(rest, null, 2)
  return (
    <div
      data-placeholder={kind}
      className={cn("flex min-w-0 flex-col gap-1 border border-dashed border-border p-2", className)}
    >
      <span className="text-sm text-muted-foreground">
        No renderer yet for the block <span className="font-mono text-foreground">{kind}</span>
      </span>
      {json !== "{}" ? (
        <pre className="max-h-40 overflow-auto font-mono text-sm text-muted-foreground">{json}</pre>
      ) : null}
    </div>
  )
}
