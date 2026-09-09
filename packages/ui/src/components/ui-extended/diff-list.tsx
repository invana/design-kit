import * as React from "react"

import { cn } from "../../lib/utils"

export type DiffOp = "add" | "remove" | "change"

export interface DiffRowProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, "children"> {
  op?: DiffOp
  /** What kind of thing changed — `node`, `edge`, `property`. */
  kind?: React.ReactNode
  children?: React.ReactNode
}

export interface DiffListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode
}

const OP_SIGN: Record<DiffOp, string> = { add: "+", remove: "−", change: "~" }

const OP_CLASS: Record<DiffOp, string> = {
  add: "text-success",
  remove: "text-destructive",
  change: "text-warning",
}

/**
 * What a change would do, before it is committed.
 *
 * Staged model edits, a schedule's firing diff against the previous run, a
 * proposal's additions. It is a *preview*, which is why the sign is spelled out
 * per row rather than implied by colour alone — a reader who cannot separate
 * red from green still has to be able to tell an addition from a removal before
 * approving it.
 */
export const DiffList = React.forwardRef<HTMLUListElement, DiffListProps>(
  ({ className, children, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-col", className)} {...props}>
      {children}
    </ul>
  ),
)
DiffList.displayName = "DiffList"

export const DiffRow = React.forwardRef<HTMLLIElement, DiffRowProps>(
  ({ op = "add", kind, className, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("flex items-baseline gap-2 py-0.5 text-meta", className)}
      {...props}
    >
      <span className={cn("w-3 shrink-0 text-center font-mono", OP_CLASS[op])}>
        {OP_SIGN[op]}
      </span>
      {kind != null ? (
        <span className="shrink-0 text-muted-foreground">{kind}</span>
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  ),
)
DiffRow.displayName = "DiffRow"
