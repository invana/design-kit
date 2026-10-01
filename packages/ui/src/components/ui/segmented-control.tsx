import * as React from "react"

import { cn } from "../../lib/utils"

export interface SegmentedOption {
  /** What the caller gets back. */
  value: string
  label: React.ReactNode
  /** A second line under the label, smaller and muted — `±1.4 pp`. */
  sub?: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  options: SegmentedOption[]
  /** Controlled. Pass it with {@link onValueChange}; `null` is no pick. */
  value?: string | null
  /**
   * Uncontrolled starting option. Defaults to the first, because a reading is
   * never off. `null` starts with none picked — a question not yet answered,
   * where picking the first for the reader would answer it for them.
   */
  defaultValue?: string | null
  onValueChange?: (value: string) => void
  /** Fill the width given, each option an equal share of it. */
  stretch?: boolean
  /**
   * `tint` marks the active option with the primary tint — a reading of the
   * page. `solid` fills it with primary and rules the options apart — an
   * answer to a question, where the pick is the thing being read.
   */
  variant?: "tint" | "solid"
  /**
   * A settled answer: the pick is shown, not offered. Unlike disabling every
   * option it keeps full strength, so the answer still reads.
   */
  readOnly?: boolean
}

/**
 * One page, read another way.
 *
 * A run has four readings and a step has three — *In order · Layers · Flow ·
 * Lens*, *Overview · Touched · Log* — and each of them is the **same record**
 * drawn differently. That is what this control says and a tab strip does not:
 * tabs own a panel and imply separate content underneath, so four tabs over one
 * trace read as four pages that happen to share a header. A segmented control
 * sits in the pagehead's action slot, beside the chips that describe the record,
 * and says *this is a switch on what you are already looking at*.
 *
 * It is also not `ToggleGroup`. That is a set of independent toggles which may
 * all be off; a reading is never off, so the control is a radio group and is
 * announced as one. Arrow keys move between options, which is what a reader who
 * never leaves the keyboard expects of a radio group.
 *
 * **The frame is the control.** One border around the whole thing, the active
 * option filled with the primary tint and the rest plain — never a border per
 * option, which draws three controls where there is one.
 */
export const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      stretch,
      variant = "tint",
      readOnly,
      className,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState<string | null>(
      defaultValue === undefined ? (options[0]?.value ?? null) : defaultValue,
    )
    const active = value === undefined ? internal : value
    // With nothing picked, the first option that can be is the one Tab reaches.
    const entry = options.some((o) => o.value === active)
      ? active
      : options.find((o) => !o.disabled)?.value
    const refs = React.useRef<(HTMLButtonElement | null)[]>([])

    const select = (next: string) => {
      if (readOnly) return
      if (value === undefined) setInternal(next)
      onValueChange?.(next)
    }

    // Arrow keys move the selection, not just the focus: a radio group's
    // selection follows its focus, and a reader stepping through readings with
    // the keyboard wants the page to change as they go.
    const onKeyDown = (event: React.KeyboardEvent, index: number) => {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown"
      const back = event.key === "ArrowLeft" || event.key === "ArrowUp"
      if (!forward && !back) return
      event.preventDefault()
      const step = forward ? 1 : -1
      for (let i = 1; i <= options.length; i += 1) {
        const next = options[(index + step * i + options.length * i) % options.length]
        if (next && !next.disabled) {
          select(next.value)
          refs.current[options.indexOf(next)]?.focus()
          return
        }
      }
    }

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-readonly={readOnly || undefined}
        className={cn(
          "inline-flex overflow-hidden rounded-control border border-border",
          // Its own width, even as the child of a column that stretches.
          stretch ? "flex w-full" : "self-start",
          className,
        )}
        {...props}
      >
        {options.map((option, index) => {
          const on = option.value === active
          return (
            <button
              key={option.value}
              ref={(node) => {
                refs.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={option.disabled}
              tabIndex={option.value === entry ? 0 : -1}
              onClick={() => select(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "min-w-0 truncate text-center whitespace-nowrap",
                // Stretched, each option has its share already; padding would only truncate it.
                variant === "solid" ? (stretch ? "px-1" : "px-3") : "px-2",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                // 26px at the root size: the height of the `sm` search and the
                // filter chips it shares a toolbar with.
                "h-[26px] text-base",
                // Two lines take the height they need.
                option.sub != null && "h-auto py-1",
                stretch && "flex-1",
                variant === "solid"
                  ? cn(
                      "border-e border-border last:border-e-0",
                      on
                        ? "bg-primary text-primary-foreground"
                        : cn("text-foreground", !readOnly && "hover:bg-accent"),
                    )
                  : on
                    ? "bg-primary/12 font-medium text-primary"
                    : cn("text-muted-foreground", !readOnly && "hover:bg-accent hover:text-foreground"),
                readOnly && "cursor-default",
                option.disabled && "pointer-events-none opacity-50",
              )}
            >
              {option.sub != null ? (
                <span className="flex flex-col items-center leading-tight">
                  <span className="truncate">{option.label}</span>
                  <span className={cn("truncate font-mono text-xs", on && variant === "solid" ? "opacity-85" : "text-muted-foreground")}>
                    {option.sub}
                  </span>
                </span>
              ) : (
                option.label
              )}
            </button>
          )
        })}
      </div>
    )
  },
)
SegmentedControl.displayName = "SegmentedControl"
