import * as React from "react"

import { cn } from "../../lib/utils"

export type KnownDiffOp =
  | "add" | "remove" | "change"

/**
 * The values the kit draws specially — **suggestions, not a limit.** Anything
 * else renders with the neutral token and its own name.
 */
export type DiffOp = KnownDiffOp | (string & {})

export interface DiffRowProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, "children"> {
  op?: DiffOp
  /**
   * What kind of thing changed — `node`, `edge`, `property`. Before the text
   * in a plain row; after it, in mono, in a row with a `chip`, `description` or acts.
   */
  kind?: React.ReactNode
  /**
   * How the op is marked. `sign` (default) is the bare sign in the op's tone.
   * `chip` is the sign in a tinted square, for a change made but not yet
   * saved: amber for what is new or altered, muted for what goes — and the
   * edit sign is ✎.
   */
  marker?: "sign" | "chip"
  /** A second, muted line under the row — `New airport · Doha`, `Deleted with MUC`. */
  description?: React.ReactNode
  /** Draws the row as the one picked — the change shown on the board. */
  selected?: boolean
  /** Makes the row's body a button: clicking the sign, text or description runs it. */
  onActivate?: () => void
  /** The body button's tooltip, when `onActivate` is set. */
  activateTitle?: string
  /** Trailing acts — a revert, a menu — kept outside the body button. */
  actions?: React.ReactNode
  children?: React.ReactNode
}

export interface DiffListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode
}

const OP_SIGN: Record<DiffOp, string> = { add: "+", remove: "−", change: "~" }

const OP_CLASS: Partial<Record<DiffOp, string>> = {
  add: "text-success",
  remove: "text-destructive",
  change: "text-warning",
}

const CHIP_SIGN: Record<DiffOp, string> = { add: "+", remove: "−", change: "✎" }
const CHIP_CLASS: Partial<Record<DiffOp, string>> = {
  add: "bg-warning/15 text-warning",
  change: "bg-warning/15 text-warning",
  remove: "bg-muted-foreground/15 text-muted-foreground",
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
  (
    {
      op = "add",
      kind,
      marker = "sign",
      description,
      selected,
      onActivate,
      activateTitle,
      actions,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    if (marker === "sign" && description == null && onActivate == null && actions == null && !selected) {
      return (
        <li
          ref={ref}
          className={cn("flex items-baseline gap-2 py-0.5 text-sm", className)}
          {...props}
        >
          <span className={cn("w-3 shrink-0 text-center font-mono", (OP_CLASS[op] ?? "text-muted-foreground"))}>
            {OP_SIGN[op]}
          </span>
          {kind != null ? (
            <span className="shrink-0 text-muted-foreground">{kind}</span>
          ) : null}
          <span className="min-w-0 flex-1">{children}</span>
        </li>
      )
    }
    const sign =
      marker === "chip" ? (
        <span
          aria-hidden="true"
          className={cn(
            "mt-px inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] text-xs font-bold",
            CHIP_CLASS[op] ?? "bg-muted-foreground/15 text-muted-foreground",
          )}
        >
          {CHIP_SIGN[op] ?? "•"}
        </span>
      ) : (
        <span aria-hidden="true" className={cn("w-3 shrink-0 text-center font-mono", OP_CLASS[op] ?? "text-muted-foreground")}>
          {OP_SIGN[op]}
        </span>
      )
    const body = (
      <>
        {sign}
        <span className="sr-only">{op === "add" ? "Added" : op === "remove" ? "Removed" : op === "change" ? "Changed" : op}</span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="flex min-w-0 items-center gap-1.5 font-semibold">{children}</span>
            {kind != null ? <span className="shrink-0 font-mono text-xs text-muted-foreground">{kind}</span> : null}
          </span>
          {description != null ? <span className="text-xs text-muted-foreground">{description}</span> : null}
        </span>
      </>
    )
    return (
      <li
        ref={ref}
        aria-current={selected ? "true" : undefined}
        className={cn("flex items-start gap-1 rounded-md", selected && "bg-accent", className)}
        {...props}
      >
        {onActivate ? (
          <button
            type="button"
            onClick={onActivate}
            title={activateTitle}
            className={cn(
              "flex min-w-0 flex-1 items-start gap-2 rounded-md px-1 py-1.5 text-left",
              !selected && "hover:bg-accent/60",
            )}
          >
            {body}
          </button>
        ) : (
          <span className="flex min-w-0 flex-1 items-start gap-2 px-1 py-1.5">{body}</span>
        )}
        {actions != null ? <span className="mt-1 flex shrink-0 items-center">{actions}</span> : null}
      </li>
    )
  },
)
DiffRow.displayName = "DiffRow"
