import * as React from "react"

import { cn } from "../../lib/utils"

export type TerminalLineKind = "prompt" | "output" | "comment"

export interface TerminalLineProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  kind?: TerminalLineKind
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
        "overflow-x-auto border border-border bg-muted/40 p-2 font-mono text-meta",
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
  ({ kind = "output", columns, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "items-baseline gap-2 whitespace-pre",
        columns
          ? "grid [grid-template-columns:auto_var(--terminal-cols)]"
          : "flex",
        kind === "comment" && "text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "w-3 shrink-0",
          kind === "prompt" ? "text-primary" : "text-muted-foreground",
        )}
      >
        {MARKER[kind]}
      </span>
      {columns ? (
        columns.map((c, i) => (
          <span
            key={i}
            className={cn(
              "min-w-0 truncate",
              i === columns.length - 1 && "text-muted-foreground",
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
