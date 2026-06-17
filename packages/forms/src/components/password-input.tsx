import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@invana/ui"
import { Input } from "./input"

export type PasswordInputProps = Omit<
  React.ComponentProps<"input">,
  "type"
> & {
  /** Controls visibility in a controlled fashion. Omit for self-managed toggle. */
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
}

/**
 * Password input with a built-in show/hide toggle. Wraps {@link Input} and
 * overlays an eye / eye-off button that flips the field between `password`
 * and `text`. Visibility is self-managed unless `visible` is supplied.
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, visible, onVisibleChange, disabled, ...props }, ref) => {
    const [internalVisible, setInternalVisible] = React.useState(false)
    const isControlled = visible !== undefined
    const show = isControlled ? visible : internalVisible

    const toggle = () => {
      const next = !show
      if (!isControlled) setInternalVisible(next)
      onVisibleChange?.(next)
    }

    return (
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          className={cn("pr-10", className)}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {show ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
