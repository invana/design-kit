"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Sizes are the control scale, so an avatar sits in a row of controls at the
 * row's height: `xs` 22 · `sm` 26 · `md` 32 · `lg` 40px at a 13px root. `lg`
 * is the default — the size it always had. Its initials step down with it.
 */
const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      xs: "size-control-xs text-xs",
      sm: "size-control-sm text-xs",
      md: "size-control-md text-sm",
      lg: "size-control-lg",
    },
  },
  defaultVariants: { size: "lg" },
})

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, size, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show this many and fold the rest into a `+n` avatar. */
  max?: number
  /** The size of the `+n` avatar — the same as the avatars it follows. */
  size?: AvatarProps["size"]
}

/**
 * Avatars overlapping in a row — who is on a run, a thread, a review — each
 * ringed in the background so the overlap reads as edges. Past `max`, the rest
 * are one `+n`.
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, size, children, ...props }, ref) => {
    const all = React.Children.toArray(children)
    const shown = max != null && all.length > max ? all.slice(0, max) : all
    const rest = all.length - shown.length
    return (
      <div
        ref={ref}
        data-slot="avatar-group"
        className={cn("flex items-center -space-x-2 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-background", className)}
        {...props}
      >
        {shown}
        {rest > 0 ? (
          <Avatar size={size} aria-label={`${rest} more`}>
            <AvatarFallback>+{rest}</AvatarFallback>
          </Avatar>
        ) : null}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants }
