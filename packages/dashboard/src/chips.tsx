import * as React from "react"
import { Badge, BoundChip, Button, ToggleGroup, ToggleGroupItem } from "@invana/ui"

import type { ActionContext, ActionSpec, ChipSpec } from "./types"

/** A chip from its spec — a bound renders as a `BoundChip`, everything else as a `Badge`. */
export function SpecChip({ chip }: { chip: ChipSpec }) {
  if (chip.bound)
    return <BoundChip bound={chip.bound} swatch={chip.swatch} />
  return (
    <Badge
      variant={chip.variant ?? "outline"}
      tone={chip.tone === "running" || chip.tone === "error" ? undefined : chip.tone}
      size="sm"
    >
      {chip.label}
    </Badge>
  )
}

export function SpecChips({ chips }: { chips?: ChipSpec[] }) {
  if (!chips?.length) return null
  return (
    <>
      {chips.map((chip, i) => (
        <SpecChip key={i} chip={chip} />
      ))}
    </>
  )
}

/**
 * An action from its spec.
 *
 * `options` turns it into a segmented switch, because a view switch is one
 * decision with several positions and rendering it as three buttons would let a
 * reader think they could pick two.
 */
export function SpecAction({
  action,
  onAction,
  icons,
  ctx,
}: {
  action: ActionSpec
  onAction: (id: string, ctx?: ActionContext) => void
  icons: Record<string, React.ComponentType<{ className?: string }>>
  ctx?: ActionContext
}) {
  if (action.options?.length) {
    return (
      <ToggleGroup
        type="single"
        size="sm"
        value={action.value}
        onValueChange={(option: string) => option && onAction(action.id, { ...ctx, option })}
      >
        {action.options.map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    )
  }

  const Icon = action.icon ? icons[action.icon] : undefined
  const iconOnly = !action.label && Icon

  return (
    <Button
      variant={action.variant ?? "outline"}
      size={iconOnly ? "icon" : "sm"}
      disabled={action.disabled}
      aria-label={iconOnly ? action.id : undefined}
      onClick={() => onAction(action.id, ctx)}
    >
      {Icon ? <Icon /> : null}
      {action.label}
    </Button>
  )
}

export function SpecActions({
  actions,
  onAction,
  icons,
  ctx,
}: {
  actions?: ActionSpec[]
  onAction: (id: string, ctx?: ActionContext) => void
  icons: Record<string, React.ComponentType<{ className?: string }>>
  ctx?: ActionContext
}) {
  if (!actions?.length) return null
  return (
    <>
      {actions.map((action) => (
        <SpecAction
          key={action.id}
          action={action}
          onAction={onAction}
          icons={icons}
          ctx={ctx}
        />
      ))}
    </>
  )
}
