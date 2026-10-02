import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * `variant` is the treatment, `tone` is the meaning.
 *
 * They are separate axes on purpose: "this is a warning" and "this is filled
 * rather than outlined" are different questions, and crossing them into one
 * enum (`warning-soft`, `warning-outline`, …) multiplies into a list nobody can
 * hold. A tone sets two custom properties; the treatments read them. So `tone`
 * recolours `default`, `outline` and `soft`, and leaves `secondary` and
 * `destructive` alone — those are already a colour decision.
 *
 * No pill. A badge sits at control height beside buttons, so it takes the
 * control radius, `rounded-control` (see `@invana/styling` › border radius).
 * Where round *is* the object — a count bubble on a nav item, a state marker —
 * that is `StatusDot` or an explicit `rounded-full`, never a badge variant.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-control border font-semibold transition-colors \
  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--badge-solid)] text-[var(--badge-on-solid)] hover:opacity-90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-border text-[var(--badge-ink)]",
        soft:
          "border-[color-mix(in_srgb,var(--badge-solid)_25%,transparent)] \
          bg-[color-mix(in_srgb,var(--badge-solid)_15%,transparent)] text-[var(--badge-solid)] \
          hover:bg-[color-mix(in_srgb,var(--badge-solid)_22%,transparent)]",
      },
      tone: {
        primary:
          "[--badge-solid:var(--color-primary)] [--badge-on-solid:var(--color-primary-foreground)] [--badge-ink:var(--color-foreground)]",
        success:
          "[--badge-solid:var(--color-success)] [--badge-on-solid:var(--color-success-foreground)] [--badge-ink:var(--color-success)]",
        warning:
          "[--badge-solid:var(--color-warning)] [--badge-on-solid:var(--color-warning-foreground)] [--badge-ink:var(--color-warning)]",
        info:
          "[--badge-solid:var(--color-info)] [--badge-on-solid:var(--color-info-foreground)] [--badge-ink:var(--color-info)]",
        destructive:
          "[--badge-solid:var(--color-destructive)] [--badge-on-solid:var(--color-destructive-foreground)] [--badge-ink:var(--color-destructive)]",
        muted:
          "[--badge-solid:var(--color-muted-foreground)] [--badge-on-solid:var(--color-background)] [--badge-ink:var(--color-muted-foreground)]",
      },
      size: {
        /**
         * The control scale's `xs` (22px) — the row chip: a status beside an
         * entity name, a count against a label. The default, because a badge
         * labels a row and must fit inside a compact one.
         */
        xs: "h-control-xs px-2 text-sm",
        /** The control scale's `sm` (26px) — beside a search or a filter chip. */
        sm: "h-control-sm px-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "primary",
      size: "xs",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, tone, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, tone, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
