import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

/** One published model, and what this session may do with it. */
export interface DataReachModel {
  id: string
  /** `Accounts`, `Funding rounds`. */
  name: string
  /**
   * Records this session can see, after its slice — not the model's size.
   * `null` or left out while the count is on its way.
   */
  records?: number | null
  /**
   * What it may do — `["read"]`, `["read", "write"]` — or `"denied"`. An open
   * vocabulary: a product that adds `export` passes it and it is written out.
   */
  access: string[] | "denied"
  /** What the session's view of it is narrowed to — `time 2019 → now · axis announced_at`. */
  slice?: React.ReactNode
}

/** What a session can reach, summed: the models it may read and the records in them. */
export function summarizeReach(models: DataReachModel[]) {
  const readable = models.filter((m) => m.access !== "denied")
  const counting = readable.some((m) => m.records == null)
  const records = readable.reduce((sum, m) => sum + (m.records ?? 0), 0)
  return { readable: readable.length, total: models.length, records, counting }
}

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 })

/** `1.2M`, `84K` — how a record count is written where room is short. */
export const formatRecords = (n: number) => compact.format(n)

export interface DataReachProps extends React.HTMLAttributes<HTMLDivElement> {
  models: DataReachModel[]
  /**
   * Ask for the denied models. Shown only when some are denied; it receives
   * their ids. What a request does is the host's.
   */
  onRequestAccess?: (models: string[]) => void
}

/**
 * The data a session can reach: every published model, the records it can see
 * in each, what it may do with them, and what its view is narrowed to.
 *
 * **Denied models are listed, muted, never left out.** What a session cannot
 * see is what a bigger question would need, and a list of only what is open
 * would make the agent look more capable than it is. A count still on its way
 * says so (`counting…`) rather than drawing a zero.
 *
 * Counts are what *this session* sees after its slice — a model's full size
 * would overstate what the agent can answer from.
 */
export const DataReach = React.forwardRef<HTMLDivElement, DataReachProps>(
  ({ models, onRequestAccess, className, ...props }, ref) => {
    const sum = summarizeReach(models)
    const denied = models.filter((m) => m.access === "denied")
    return (
      <div ref={ref} className={cn("flex min-w-0 flex-col gap-2", className)} {...props}>
        <Table seamless density="compact">
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Records</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Slice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((m) => {
              const access = m.access === "denied" ? null : m.access
              const off = access == null
              return (
                <TableRow key={m.id} className={cn(off && "text-muted-foreground")}>
                  <TableCell className={cn(off && "line-through")}>{m.name}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {off ? "—" : m.records == null ? <span className="text-muted-foreground">counting…</span> : m.records.toLocaleString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{access ? access.join(" · ") : "denied"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{off ? "—" : (m.slice ?? "—")}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="tabular-nums">
            {sum.readable} of {sum.total} models · {sum.records.toLocaleString()} records
            {sum.counting ? " so far" : ""}
          </span>
          {denied.length && onRequestAccess ? (
            <Button
              variant="link"
              size="sm"
              className="ml-auto h-auto p-0"
              onClick={() => onRequestAccess(denied.map((m) => m.id))}
            >
              Request access to {denied.length} {denied.length === 1 ? "model" : "models"} →
            </Button>
          ) : null}
        </div>
      </div>
    )
  },
)
DataReach.displayName = "DataReach"
