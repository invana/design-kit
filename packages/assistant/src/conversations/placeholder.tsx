import { cn } from "@invana/ui"

export interface PlaceholderProps {
  /** Which registry the preset belongs to. */
  kind: "ask" | "block"
  preset: string
  /** The preset's options exactly as the spec sent them. */
  options: unknown
  className?: string
}

/**
 * A preset with no renderer yet: its id and the JSON it was sent.
 *
 * Shown rather than skipped, and never an error. A conversation is data that
 * outlives the code reading it, and a silently missing block is worse than a
 * visible one, because the analyst reads an answer they believe is complete.
 * While the kit is being built, the placeholders in a session story are also
 * the work left, in the place it will appear.
 */
export function Placeholder({ kind, preset, options, className }: PlaceholderProps) {
  const { preset: _preset, ...rest } = (options ?? {}) as Record<string, unknown>
  const json = JSON.stringify(rest, null, 2)
  return (
    <div
      data-placeholder={preset}
      className={cn("flex min-w-0 flex-col gap-1 border border-dashed border-border p-2", className)}
    >
      <span className="text-sm text-muted-foreground">
        No renderer yet for {kind} preset <span className="font-mono text-foreground">{preset}</span>
      </span>
      {json !== "{}" ? (
        <pre className="max-h-40 overflow-auto font-mono text-sm text-muted-foreground">{json}</pre>
      ) : null}
    </div>
  )
}
