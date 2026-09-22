import * as React from "react"

import { cn } from "../../lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

export interface AttemptRow {
  /** `queued` · `attempt 1` · `attempt 2` · `settled`. */
  label: React.ReactNode
  /** When it started, on the run's own clock — `+44.5s`. */
  started?: React.ReactNode
  /** How long it took — `30.0s`, or `4.2s…` while it is still running. */
  took?: React.ReactNode
  /** What happened, in one line. */
  what?: React.ReactNode
  tone?: "muted" | "info" | "success" | "warning" | "destructive"
  /** It ran and it did not stick. **Struck, never dropped.** */
  struck?: boolean
}

export interface AttemptClockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  rows: AttemptRow[]
  /**
   * What the two numbers are — `elapsed 32.4s · working 2.3s · the gap is the
   * attempt that timed out`.
   *
   * **Stated, never left as arithmetic.** A reader who has to subtract two
   * durations to find a 30-second timeout has been handed a sum instead of an
   * answer.
   */
  summary?: React.ReactNode
}

const TONE: Record<string, string> = {
  muted: "text-muted-foreground",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
}

/**
 * A step's clock, attempt by attempt.
 *
 * One duration cannot say what happened to a step that timed out once and then
 * returned: `2.1s` is what it *did*, `32.4s` is what a reader waited, and the
 * gap between them **is** the first attempt. So the clock is a row per attempt
 * — queued, each try, settled — and the try that failed keeps its place, struck.
 *
 * Nothing new is recorded for this: it is the `timing` and `attempt` fields the
 * interpreter already writes, read as a list instead of as a total.
 */
export const AttemptClock = React.forwardRef<HTMLDivElement, AttemptClockProps>(
  ({ rows, summary, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[7rem]">
              <span className="sr-only">what</span>
            </TableHead>
            <TableHead className="w-[6rem]">started</TableHead>
            <TableHead className="w-[5.5rem]">took</TableHead>
            <TableHead>what happened</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            // The tone marks **the attempt and its duration** — the two cells
            // that carry the verdict. The sentence stays type: a table where
            // every line is coloured has no emphasis left, and *succeeded* is
            // the expected case, not a finding. A struck attempt is the
            // exception, and it takes the tone all the way across.
            const tone = row.tone ? TONE[row.tone] : undefined
            return (
              <TableRow key={index}>
                <TableCell className={cn(tone, row.struck && "line-through")}>
                  {row.label}
                </TableCell>
                <TableCell className="font-mono tabular-nums text-muted-foreground">
                  {row.started}
                </TableCell>
                <TableCell className={cn("font-mono tabular-nums", tone)}>
                  {row.took}
                </TableCell>
                <TableCell
                  className={cn(row.struck && ["line-through", tone])}
                >
                  {row.what}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {summary != null ? (
        <div className="border-border border-t px-2.5 py-1.5 text-sm text-muted-foreground">
          {summary}
        </div>
      ) : null}
    </div>
  ),
)
AttemptClock.displayName = "AttemptClock"
