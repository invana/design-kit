import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { ButtonWithTooltip } from "./button-with-tooltip"

/** One control of a toolbar: a word, or an icon named by its tooltip. */
export interface ToolbarAction {
  id: string
  /** The word, or — with an `icon` — the tooltip and accessible name. */
  label: string
  /** Draws the control as an icon; the caller's, at 16px. */
  icon?: React.ReactNode
  /** A toggle that is on — `Lock` while the canvas is locked. */
  pressed?: boolean
  disabled?: boolean
}

/** A rule between groups of controls. */
export interface ToolbarSeparator {
  separator: true
}

export type ToolbarItem = ToolbarAction | ToolbarSeparator

export interface ToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: ToolbarItem[]
  /** A control was pressed, by its `id`. */
  onAction?: (id: string) => void
}

const isSeparator = (item: ToolbarItem): item is ToolbarSeparator => "separator" in item

/**
 * A row of controls over a canvas or a panel — icon toggles named by their
 * tooltips, words, and rules between groups — on the control scale a step
 * below its bar (`sm`). What each control does is the caller's: it says which
 * was pressed.
 */
const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(({ items, onAction, className, ...props }, ref) => (
  <div ref={ref} role="toolbar" className={cn("flex h-control-sm items-center gap-1", className)} {...props}>
    {items.map((item, i) => {
      if (isSeparator(item)) return <Separator key={`separator-${i}`} orientation="vertical" className="h-4" />
      const common = {
        variant: "ghost" as const,
        disabled: item.disabled,
        "aria-pressed": item.pressed,
        className: cn(item.pressed && "bg-accent text-accent-foreground"),
        onClick: () => onAction?.(item.id),
      }
      return item.icon ? (
        <ButtonWithTooltip key={item.id} {...common} size="icon-sm" tooltip={item.label} aria-label={item.label}>
          {item.icon}
        </ButtonWithTooltip>
      ) : (
        <Button key={item.id} {...common} size="sm">
          {item.label}
        </Button>
      )
    })}
  </div>
))
Toolbar.displayName = "Toolbar"

export { Toolbar }
