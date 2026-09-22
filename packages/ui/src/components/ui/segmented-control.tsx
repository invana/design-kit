import * as React from "react"

import { cn } from "../../lib/utils"

export interface SegmentedOption {
  /** What the caller gets back. */
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  options: SegmentedOption[]
  /** Controlled. Pass it with {@link onValueChange}. */
  value?: string
  /** Uncontrolled starting option. Defaults to the first. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** `xs` is 22px — a pagehead slot. `sm` is 26px, for a panel header. */
  size?: "xs" | "sm"
  /** Fill the width given, each option an equal share of it. */
  stretch?: boolean
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
      size = "xs",
      stretch,
      className,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(
      defaultValue ?? options[0]?.value,
    )
    const active = value ?? internal
    const refs = React.useRef<(HTMLButtonElement | null)[]>([])

    const select = (next: string) => {
      if (value == null) setInternal(next)
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
        className={cn(
          "inline-flex overflow-hidden rounded-control border border-border",
          stretch && "flex w-full",
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
              tabIndex={on ? 0 : -1}
              onClick={() => select(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "min-w-0 truncate px-2 text-center whitespace-nowrap",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                size === "xs" ? "h-[22px] text-sm" : "h-[26px]",
                stretch && "flex-1",
                on
                  ? "bg-primary/12 font-medium text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                option.disabled && "pointer-events-none opacity-50",
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    )
  },
)
SegmentedControl.displayName = "SegmentedControl"
