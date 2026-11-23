import * as React from "react"

import { cn } from "../../lib/utils"
import { Spinner } from "../ui/spinner"
import { StatusDot } from "../ui/status-dot"

export interface CheckResultProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** Whether the source answered, or the check is still out. */
  status: "checking" | "ok" | "failed"
  /** The first line. Defaults: "Checking…", "Connected", "Could not connect". */
  title?: React.ReactNode
  /** Facts about an answer, already formatted — the version, the latency, when; joined with " · ". */
  details?: React.ReactNode[]
  /** Why it failed, and what to try. */
  error?: React.ReactNode
  /** An action beside it — Check again. */
  action?: React.ReactNode
}

const TITLE = { checking: "Checking…", ok: "Connected", failed: "Could not connect" } as const

/**
 * The outcome of asking a source whether it answers: a connection's Test or
 * Check, a health probe. A failure says why. It is announced politely, so a
 * screen reader hears the result once it arrives.
 */
export function CheckResult({ status, title, details, error, action, className, ...props }: CheckResultProps) {
  const parts = (details ?? []).filter((part) => part !== null && part !== undefined && part !== false && part !== "")
  return (
    <div
      data-slot="check-result"
      data-status={status}
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2",
        status === "failed" ? "border-destructive/40 bg-destructive/10" : "border-border bg-muted/50",
        className
      )}
      {...props}
    >
      <span className="flex h-[1lh] items-center">
        {status === "checking" ? (
          <Spinner className="size-3.5" />
        ) : (
          <StatusDot tone={status === "ok" ? "success" : "error"} size="md" />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium">
          {title ?? TITLE[status]}
          {parts.length > 0 && (
            <span className="font-normal text-muted-foreground">
              {parts.map((part, i) => (
                <React.Fragment key={i}>
                  <span aria-hidden> · </span>
                  {part}
                </React.Fragment>
              ))}
            </span>
          )}
        </span>
        {status === "failed" && error && <span className="text-muted-foreground">{error}</span>}
      </div>
      {action}
    </div>
  )
}
