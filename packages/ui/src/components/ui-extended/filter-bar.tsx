import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The filter controls. `FilterChip`s, a `SearchInput`, a toggle. */
  children?: React.ReactNode
  /**
   * What the filters left behind — `8 datasets`, `6 tasks`, `7 waiting`.
   *
   * Sits after a spacer, hard right. It is the answer to the question the
   * filters ask, so it belongs on the same line as them and nowhere else.
   */
  summary?: React.ReactNode
}

export interface FilterChipProps
  // `value` is narrowed here to a node — the chip shows what the filter is set
  // to, which is not the button element's form value.
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** The dimension — `status`, `kind`, `agent`, `age`. */
  label: React.ReactNode
  /** What it is narrowed to. Absent means "not filtered". */
  value?: React.ReactNode
  /** Marks the chip as narrowing the list, so an active filter is visible while scrolling. */
  active?: boolean
  /**
   * Clear this one filter, without opening its menu.
   *
   * Only for a chip that **is** set: an unset chip has nothing to clear, and an
   * × on it would offer to undo something nobody did. With it, the chip is a
   * pair of controls rather than one — the label opens the picker, the × drops
   * the value — so both are reachable by keyboard and the × carries its own
   * name.
   */
  onRemove?: () => void
  /** What the × is called, for a screen reader. Defaults to `Clear <label>`. */
  removeLabel?: string
}

/**
 * The row above a list that narrows it.
 *
 * Every list surface in the system has one: the roster, datasets, tasks,
 * schedules, workflows, the review queue. It is a `<Toolbar>`-shaped thing but
 * kept separate — a toolbar holds actions that *do* something, this holds
 * controls that *hide* rows, and mixing them costs the reader the guarantee
 * that nothing here changes their data.
 */
export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ summary, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-[30px] shrink-0 items-center gap-1.5 border-b border-border px-2",
        className,
      )}
      {...props}
    >
      {children}
      <span className="flex-1" />
      {summary != null ? (
        <span className="shrink-0 text-sm text-muted-foreground">{summary}</span>
      ) : null}
    </div>
  ),
)
FilterBar.displayName = "FilterBar"

/**
 * One dimension, as a chip that opens a menu.
 *
 * The caret is drawn rather than iconised so the chip stays 22px and reads as
 * one token — `status ▾` — instead of a control with an icon glued to it.
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ label, value, active, onRemove, removeLabel, className, ...props }, ref) => {
    const chip = (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        size="xs"
        data-active={active || undefined}
        className={cn(
          "h-[22px] gap-1 px-1.5 font-normal",
          active && "border-primary/40 text-primary",
          onRemove && "rounded-r-none border-r-0",
          className,
        )}
        {...props}
      >
        <span className={cn(value != null && "text-muted-foreground")}>{label}</span>
        {value != null ? <span className="truncate">{value}</span> : null}
        <span aria-hidden className="text-muted-foreground">
          ▾
        </span>
      </Button>
    )

    if (!onRemove) return chip

    return (
      <span className="inline-flex min-w-0 items-center">
        {chip}
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={onRemove}
          aria-label={
            removeLabel ??
            `Clear ${typeof label === "string" ? label : "filter"}`
          }
          className={cn(
            "h-[22px] rounded-l-none px-1 font-normal text-muted-foreground hover:text-foreground",
            active && "border-primary/40",
          )}
        >
          <span aria-hidden>×</span>
        </Button>
      </span>
    )
  },
)
FilterChip.displayName = "FilterChip"

/** One choice in a {@link MultiFilterChip}: its value, or a value with a label. */
export type FilterChipOption = string | { value: string; label?: React.ReactNode }

export interface MultiFilterChipProps {
  /** The dimension — `kind`, `agent`, `status`. */
  label: React.ReactNode
  options: FilterChipOption[]
  /** What it is narrowed to. Empty means "not filtered". */
  value: string[]
  onChange: (next: string[]) => void
  /**
   * Many at once (the default) — a row matches any of them — or one, where
   * picking a choice replaces the last and picking it again clears it.
   */
  multiple?: boolean
}

/**
 * A `FilterChip` with its menu: the choices for one dimension, checked as
 * they narrow the list. The chip reads what it is set to — the value, or
 * `3 selected` — and, once set, carries the × that clears it.
 */
export function MultiFilterChip({
  label,
  options,
  value,
  onChange,
  multiple = true,
}: MultiFilterChipProps) {
  const choices = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value },
  )
  const shown =
    value.length === 0
      ? undefined
      : value.length === 1
        ? (choices.find((c) => c.value === value[0])?.label ?? value[0])
        : `${value.length} selected`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FilterChip
          label={label}
          value={shown}
          active={value.length > 0}
          onRemove={value.length ? () => onChange([]) : undefined}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {multiple ? (
          choices.map((c) => (
            <DropdownMenuCheckboxItem
              key={c.value}
              checked={value.includes(c.value)}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={(on) =>
                onChange(on ? [...value, c.value] : value.filter((v) => v !== c.value))
              }
            >
              {c.label}
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuRadioGroup
            value={value[0] ?? ""}
            onValueChange={(v) => onChange(v === value[0] ? [] : [v])}
          >
            {choices.map((c) => (
              // Radix reports every pick, the current one included, so
              // picking it again clears the chip.
              <DropdownMenuRadioItem key={c.value} value={c.value}>
                {c.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
