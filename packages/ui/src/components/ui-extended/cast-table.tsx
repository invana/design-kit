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
import { AddressChip } from "./address-chip"
import type { CastRole } from "./lens-row"

/**
 * The four roles, in the order a run spends them. Fixed, and **always all four**
 * — see the note on the component.
 */
export const CAST_ROLES: CastRole[] = ["extract", "decide", "judge", "embed"]

/** What each role is for, so the table teaches rather than just listing. */
const PURPOSE: Record<CastRole, string> = {
  extract: "prose in, structure out — the cheap one",
  decide: "writes the number a person acts on",
  judge: "scores an output — often local",
  embed: "text in, vector out",
}

/** Where a resolved address came from. Innermost wins. */
export type CastSource = "todo" | "plan" | "agent" | "shipped"

export interface CastResolution {
  role: CastRole
  /** `null` when nothing casts the role and no shipped default resolves it. */
  address: string | null
  allowed: boolean
  /** The rule that denied it, when one did — so a refusal names its bound. */
  ruleMatched?: string | null
  source?: CastSource
}

export interface CastTableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** What the lens itself casts: role → model address. Partial is normal. */
  cast?: Partial<Record<CastRole, string>>
  /**
   * The same four roles after resolution — innermost wins, then checked against
   * the effective rules. Absent leaves the table read as *what this lens says*
   * rather than *what a run would get*.
   */
  resolved?: CastResolution[]
  readOnly?: boolean
}

/**
 * `role → resolves to → why this one`, four fixed rows.
 *
 * A plan names a **role**, not a model: `decide` says *how much this matters*,
 * which stays true when the line-up moves, in a way `tier` and a hard-coded
 * model id do not. The cast is what turns the role into an address.
 *
 * **All four rows, always — including the ones nothing casts.** A table that
 * showed only what was set would make *nothing casts `judge`* invisible, and
 * that is precisely the state worth seeing before a run opens: it is the one
 * that falls to a shipped default, which may name a model this Graph is not
 * credentialed for.
 *
 * **The cast is not a bound.** It picks *within* the rules and never widens
 * them: innermost wins, and the resolved address is then checked against the
 * effective rules and refused by name if denied. That is why a denied row names
 * the rule rather than just going red — the recourse is to edit that rule, and
 * the reader has to know which.
 */
export const CastTable = React.forwardRef<HTMLDivElement, CastTableProps>(
  ({ cast = {}, resolved, readOnly, className, ...props }, ref) => {
    const byRole = new Map((resolved ?? []).map((r) => [r.role, r]))

    return (
      <div ref={ref} className={cn("min-w-0", className)} {...props}>
        <Table density="compact">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5.5rem]">role</TableHead>
              <TableHead>resolves to</TableHead>
              <TableHead>why this one</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CAST_ROLES.map((role) => {
              const hit = byRole.get(role)
              const address = hit ? hit.address : (cast[role] ?? null)
              const denied = hit ? !hit.allowed : false

              return (
                <TableRow key={role} data-role={role}>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {role}
                  </TableCell>
                  <TableCell className="min-w-0">
                    {address ? (
                      <AddressChip
                        address={address}
                        tone={denied ? "denied" : "allowed"}
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground/70">
                        nothing casts it
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {denied ? (
                      <span className="text-destructive">
                        denied by {hit?.ruleMatched ?? "this world"}
                      </span>
                    ) : hit?.source ? (
                      <span>
                        {hit.source !== "shipped"
                          ? `set on the ${hit.source}`
                          : address
                            ? "shipped default"
                            : // No address *and* nothing shipped resolves it —
                              // the one row that says the run may open on a
                              // model this Graph never chose.
                              "nothing casts it, and no shipped default resolves it"}
                      </span>
                    ) : (
                      PURPOSE[role]
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {readOnly ? null : (
          <p className="px-2 pt-1 text-sm text-muted-foreground/70">
            A cast picks within the rules — it never widens them.
          </p>
        )}
      </div>
    )
  },
)
CastTable.displayName = "CastTable"
