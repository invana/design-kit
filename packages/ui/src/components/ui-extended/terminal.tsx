import * as React from "react"

import { cn } from "../../lib/utils"

export type TerminalLineKind = "prompt" | "output" | "comment"

/**
 * The severity a **log** line was emitted at, as the runtime recorded it.
 *
 * Distinct from `kind`, which says what part of a *transcript* a line is — a
 * command you typed, what it printed, a comment. A run's log has no prompts and
 * no comments; every line is output, and what varies is how loud it is.
 */
export type KnownTerminalLevel =
  | "info" | "warn" | "error" | "debug"

/**
 * The values the kit draws specially — **suggestions, not a limit.** Anything
 * else renders with the neutral token and its own name.
 */
export type TerminalLevel = KnownTerminalLevel | (string & {})

const LEVEL: Partial<Record<TerminalLevel, string>> = {
  info: "text-success",
  warn: "text-warning",
  error: "text-destructive",
  debug: "text-muted-foreground",
}

export interface TerminalLineProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  kind?: TerminalLineKind
  /**
   * How loud this line is. Tints **one** cell — the one named by
   * `levelColumn` — and nothing else.
   *
   * Only the level word is coloured, never the message: a wall of amber
   * sentences is unreadable, and what a reader scans is the column, not the
   * prose. Setting this also drops the `kind` marker — a log line is not a
   * transcript line and does not want a `→` in front of it.
   *
   * The level **word** stays in `columns`. Colour is never the carrier.
   */
  level?: TerminalLevel
  /**
   * Which cell of `columns` holds the level word. Defaults to `1`, because a
   * log line reads `time · LEVEL · source · message` and the timestamp comes
   * first in every log anyone has ever read.
   */
  levelColumn?: number
  /**
   * Columns, for the step-shaped output a run prints — name, detail, timing,
   * result. Given as cells so they align down the transcript instead of each
   * line padding itself with spaces.
   */
  columns?: React.ReactNode[]
  children?: React.ReactNode
}

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Shows a blinking block at the end. */
  cursor?: boolean
  /**
   * `grid-template-columns` for every columned line in this transcript.
   *
   * Set once here rather than per line, because the point of columns is that
   * they line up *down* the transcript — a width chosen per row aligns nothing.
   */
  columnTemplate?: string
}

const MARKER: Record<TerminalLineKind, string> = {
  prompt: "$",
  output: "→",
  comment: "#",
}

/**
 * A shell transcript, as a first-class surface.
 *
 * Some of this product's work happens outside Studio — imports run from the
 * CLI, a scheduler calls the Python API — and the hand-off has to be shown
 * honestly rather than redrawn as a wizard. So this renders what the terminal
 * actually printed.
 *
 * It is presentational: a record of a run that already happened, not a live
 * console. There is no input here, and it does not scroll itself.
 */
export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    { cursor, columnTemplate = "150px minmax(0,1fr) auto auto", className, children, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      style={{ "--terminal-cols": columnTemplate } as React.CSSProperties}
      className={cn(
        "overflow-x-auto border border-border bg-muted/40 p-2 font-mono text-sm",
        className,
      )}
      {...props}
    >
      {children}
      {cursor ? (
        <span
          aria-hidden
          className="mt-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-foreground align-middle motion-reduce:animate-none"
        />
      ) : null}
    </div>
  ),
)
Terminal.displayName = "Terminal"

export const TerminalLine = React.forwardRef<HTMLDivElement, TerminalLineProps>(
  (
    { kind = "output", level, levelColumn = 1, columns, className, children, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "items-baseline gap-2 whitespace-pre",
        columns
          ? level
            ? "grid [grid-template-columns:var(--terminal-cols)]"
            : "grid [grid-template-columns:auto_var(--terminal-cols)]"
          : "flex",
        kind === "comment" && "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {level ? null : (
        <span
          aria-hidden
          className={cn(
            "w-3 shrink-0",
            kind === "prompt" ? "text-primary" : "text-muted-foreground",
          )}
        >
          {MARKER[kind]}
        </span>
      )}
      {columns ? (
        columns.map((c, i) => (
          <span
            key={i}
            className={cn(
              "min-w-0 truncate",
              // A log tints its level cell and greys everything that is not the
              // message; a transcript greys only its trailing cell.
              level
                ? i === levelColumn
                  ? (LEVEL[level] ?? "text-muted-foreground")
                  : i === columns.length - 1
                    ? undefined
                    : "text-muted-foreground"
                : i === columns.length - 1 && "text-muted-foreground",
            )}
          >
            {c}
          </span>
        ))
      ) : (
        <span className="min-w-0">{children}</span>
      )}
    </div>
  ),
)
TerminalLine.displayName = "TerminalLine"
