import * as React from "react"
import { ChevronDown } from "lucide-react"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { cn } from "../../lib/utils"

export interface RichSelectOption {
  /** Stable key used as the selection value. */
  value: string
  /** Rich primary content — string or JSX. */
  label: React.ReactNode
  /** Secondary line shown muted under the label. */
  description?: React.ReactNode
  /** Lucide glyph or any component accepting `{ size }`. */
  icon?: React.ElementType
  /** Trailing content (e.g. a count or status badge), pushed to the right. */
  badge?: React.ReactNode
  disabled?: boolean
  /**
   * Why a disabled option cannot be picked, shown under it in the warning
   * tone. A greyed-out row with no reason is a refusal nobody can act on.
   */
  disabledReason?: React.ReactNode
}

/**
 * An on/off setting beside the choice — *Next ask only* on a world picker. It
 * is not an option: it scopes the choice, so it sits below the options and
 * toggling it keeps the menu open.
 */
export interface RichSelectToggle {
  id: string
  label: React.ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

/**
 * Something to do rather than something to pick — *Manage worlds…*. It sits
 * last, below a separator, so it is never mistaken for a value.
 */
export interface RichSelectAction {
  id: string
  label: React.ReactNode
  icon?: React.ElementType
  onSelect: () => void
}

export interface RichSelectProps {
  options: RichSelectOption[]
  /** `string` in single mode, `string[]` in multi mode. */
  value: string | string[]
  /** Fired with the new selection — mirrors the mode of {@link value}. */
  onChange: (value: string | string[]) => void
  /** Enable multi-select (checkboxes). Default `false` (radio). */
  multiple?: boolean
  /** Menu heading and default trigger prefix. */
  label?: string
  /** Trigger content when nothing is selected. */
  placeholder?: React.ReactNode
  /** Full custom row JSX. Overrides the default row layout. */
  renderOption?: (
    option: RichSelectOption,
    state: { selected: boolean }
  ) => React.ReactNode
  /** Full custom trigger JSX for the current selection. Overrides the default. */
  renderValue?: (selected: RichSelectOption[]) => React.ReactNode
  /** Menu alignment relative to the trigger. Default `'start'`. */
  align?: "start" | "center" | "end"
  /**
   * Side the menu opens toward, relative to the trigger. Default `'bottom'`.
   * Use `'top'` when the trigger sits in a footer so options open upward.
   * Radix still flips on collision if the chosen side lacks space.
   */
  side?: "top" | "right" | "bottom" | "left"
  /** Gap in px between the trigger and the menu. Default `4`. */
  sideOffset?: number
  /**
   * `field` (default) is an outlined control for a form. `inline` is the
   * borderless, compact trigger a toolbar uses — every control in a chat
   * composer is one, so the ask kind and the world read as one row.
   */
  appearance?: "field" | "inline"
  /** Glyph before the selected value on the trigger — a globe for a world. */
  triggerIcon?: React.ElementType
  /** A short tag after the value on the trigger — `next ask only`. */
  triggerTag?: React.ReactNode
  /** Settings that scope the choice; rendered below the options. */
  toggles?: RichSelectToggle[]
  /** Acts, not values; rendered last. */
  actions?: RichSelectAction[]
  /**
   * The trigger's accessible name — *Ask kind*, *World*. An inline trigger
   * shows only the current value, which names the choice made, not the control.
   */
  triggerAriaLabel?: string
  /** Trigger tooltip content; omit to disable the tooltip. */
  tooltip?: React.ReactNode
  /** Side the trigger tooltip is placed on. Default `'top'`. */
  tooltipSide?: "top" | "right" | "bottom" | "left"
  disabled?: boolean
  /** Class merged onto the trigger Button. */
  triggerClassName?: string
  /** Class merged onto the dropdown content. */
  contentClassName?: string
  /** Alias of {@link triggerClassName} for ergonomics. */
  className?: string
}

/** Default row body: icon + label (+ trailing badge) with an optional muted description. */
function OptionRow({ option }: { option: RichSelectOption }) {
  const Icon = option.icon
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="flex min-w-0 items-center gap-2">
        {Icon && <Icon size={16} className="shrink-0" />}
        <span className="truncate">{option.label}</span>
        {option.badge != null && <span className="ml-auto pl-2">{option.badge}</span>}
      </span>
      {option.description != null && (
        <span className="text-sm text-muted-foreground">{option.description}</span>
      )}
      {option.disabled && option.disabledReason != null && (
        <span className="text-sm text-warning">{option.disabledReason}</span>
      )}
    </span>
  )
}

/**
 * A `<select>` replacement built on {@link DropdownMenu}. Each option carries
 * rich content (`label`, `description`, `icon`, `badge`) and both the rows and
 * the trigger are fully customizable via `renderOption` / `renderValue`.
 * Supports single (radio) and multi (checkbox) selection via `multiple`.
 *
 * Beyond the choice it can carry **toggles** that scope it and **actions**
 * below it, and an `inline` trigger for toolbars — which is what lets every
 * control in a chat composer (ask kind, query language, world, timeout) be the
 * same component rather than a `Select` beside a hand-rolled menu.
 */
export function RichSelect({
  options,
  value,
  onChange,
  multiple = false,
  label,
  placeholder,
  renderOption,
  renderValue,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  tooltip,
  tooltipSide = "top",
  disabled,
  appearance = "field",
  triggerIcon: TriggerIcon,
  triggerTag,
  triggerAriaLabel,
  toggles,
  actions,
  triggerClassName,
  contentClassName,
  className,
}: RichSelectProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : []
  const selectedOptions = selectedValues
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is RichSelectOption => o != null)

  const toggle = (optionValue: string) => {
    const next = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue]
    onChange(next)
  }

  const triggerLabel = (() => {
    if (renderValue) return renderValue(selectedOptions)
    if (selectedOptions.length === 0) {
      return placeholder ?? label ?? "Select…"
    }
    if (selectedOptions.length === 1) {
      const only = selectedOptions[0]
      const Icon = only.icon
      return (
        <span className="flex min-w-0 items-center gap-2">
          {Icon && <Icon size={16} className="shrink-0" />}
          <span className="truncate">{only.label}</span>
        </span>
      )
    }
    return `${label ?? "Selected"}: ${selectedOptions.length}`
  })()

  // `ring-offset-background`: the design-kit Button sets `ring-offset-2` but no
  // offset colour, so the focus ring's 2px offset falls back to white — a light
  // halo around the open trigger in dark mode. Pin it to the background token.
  const inline = appearance === "inline"
  const trigger = (
    <Button
      variant={inline ? "ghost" : "outline"}
      size={inline ? "xs" : "sm"}
      disabled={disabled}
      aria-label={triggerAriaLabel}
      className={cn(
        "ring-offset-background justify-between gap-2",
        inline && "min-w-0 gap-1 px-1.5 font-normal",
        triggerClassName,
        className
      )}
    >
      {TriggerIcon && <TriggerIcon size={14} className="shrink-0 text-muted-foreground" />}
      <span className="flex min-w-0 items-center gap-2">{triggerLabel}</span>
      {triggerTag != null && (
        <Badge variant="outline" tone="warning" size="xs" className="shrink-0 font-normal">
          {triggerTag}
        </Badge>
      )}
      <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
    </Button>
  )

  return (
    <DropdownMenu>
      {tooltip != null ? (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      )}
      {/* Force the solid token background: the primitive's default popover is
          translucent (`bg-popover/80` + backdrop-blur), which reads as
          transparent over a busy canvas. `tailwind-merge` keeps the later
          `bg-popover`, and any consumer `contentClassName` still wins. */}
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn("min-w-[14rem] bg-popover", contentClassName)}
      >
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {multiple
          ? options.map((option) => {
              const selected = selectedValues.includes(option.value)
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={selected}
                  disabled={option.disabled}
                  // Keep the menu open while toggling multiple options.
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={() => toggle(option.value)}
                >
                  {renderOption ? renderOption(option, { selected }) : <OptionRow option={option} />}
                </DropdownMenuCheckboxItem>
              )
            })
          : (
              <DropdownMenuRadioGroup
                value={selectedValues[0]}
                onValueChange={(v) => onChange(v)}
              >
                {options.map((option) => {
                  const selected = selectedValues.includes(option.value)
                  return (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {renderOption ? renderOption(option, { selected }) : <OptionRow option={option} />}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            )}
        {toggles && toggles.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {toggles.map((t) => (
              <DropdownMenuCheckboxItem
                key={t.id}
                checked={t.checked}
                disabled={t.disabled}
                // A setting, not a pick — keep the menu open.
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(c) => t.onCheckedChange(c === true)}
              >
                {t.label}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
        {actions && actions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {actions.map((a) => {
              const Icon = a.icon
              return (
                <DropdownMenuItem key={a.id} onSelect={a.onSelect} className="text-muted-foreground">
                  {Icon && <Icon size={16} />}
                  {a.label}
                </DropdownMenuItem>
              )
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
