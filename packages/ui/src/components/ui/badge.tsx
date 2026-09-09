import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

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
 * No pill. A badge is structure, so it takes the structure radius, 0 (see
 * `@invana/styling` › border radius, decided 01-09-2026). Where round *is* the
 * object — a count bubble on a nav item, a state marker — that is `StatusDot`
 * or an explicit `rounded-full`, never a badge variant.
 */
const badgeVariants = cva(
  "inline-flex items-center border font-semibold transition-colors \
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
        muted:
          "[--badge-solid:var(--color-muted-foreground)] [--badge-on-solid:var(--color-background)] [--badge-ink:var(--color-muted-foreground)]",
      },
      size: {
        /** 18px — inline in a title, or a count against a label. */
        xs: "h-[18px] px-1.5 text-meta",
        /** 22px — the row chip: a status beside an entity name. */
        sm: "h-[22px] px-2 text-meta",
        /**
         * Unchanged from before `size` existed: no explicit height, so it sizes
         * from its text. Every badge already written keeps rendering exactly as
         * it did — the two tiers above are additions, not a re-baseline.
         */
        default: "px-2.5 py-0.5 text-meta",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "primary",
      size: "default",
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
