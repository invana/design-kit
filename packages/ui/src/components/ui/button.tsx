import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap \
  rounded-control font-medium transition-colors focus-visible:outline-none \
  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 \
  disabled:pointer-events-none disabled:opacity-50 \
  [&_svg]:pointer-events-none \
  [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--primary)_/_var(--surface-alpha))] glassable text-primary-foreground shadow border border-primary/30 \
          hover:border-primary/50 hover:shadow-lg \
          active:bg-[hsl(var(--primary)_/_var(--surface-alpha))]",
        destructive:
          "bg-[hsl(var(--destructive)_/_var(--surface-alpha))] glassable text-destructive-foreground shadow-sm border border-destructive/40 \
          hover:border-destructive/60 \
          active:bg-destructive/70",
        outline:
          "bg-[hsl(var(--background)_/_var(--surface-alpha))] glassable border border-border \
          hover:bg-[hsl(var(--accent)_/_var(--surface-alpha))] hover:text-accent-foreground \
          active:bg-[hsl(var(--accent)_/_var(--surface-alpha))]",
        secondary:
          "bg-[hsl(var(--secondary)_/_var(--surface-alpha))] glassable text-secondary-foreground border border-border \
          hover:bg-secondary/80 hover:border-border \
          active:bg-secondary/60",
        ghost:
          "border border-transparent \
          hover:bg-[hsl(var(--accent)_/_var(--surface-alpha))] hover:text-accent-foreground \
          active:bg-[hsl(var(--accent)_/_var(--surface-alpha))]",
        soft: "bg-primary/10 glassable text-primary border border-primary/30 shadow-sm \
          hover:bg-primary/20 active:bg-primary/25",
        link: "text-primary underline-offset-4 hover:underline \
          hover:text-primary/80 active:text-primary/60",
      },
      /*
       * The control scale from `@invana/styling` — 22 / 26 / 32 / 40 at a
       * 13px root, the same heights every other control uses for the same
       * name. `xs` is an action inside a row, `sm` a toolbar button beside a
       * search, `default` (md) a form or dialog button, `lg` a page action.
       * At `sm` and below the icon comes down with the box: the base class
       * sets size-5, which leaves no padding at 22px or 26px. `nav-icon` is
       * the navigation rail's own target, not a control size.
       */
      size: {
        xs: "h-control-xs rounded-control px-2 gap-1 [&_svg]:size-4",
        sm: "h-control-sm rounded-control px-2.5 gap-1.5 [&_svg]:size-4",
        default: "h-control-md px-3",
        lg: "h-control-lg rounded-control px-6",
        "icon-xs": "size-control-xs rounded-control [&_svg]:size-4",
        "icon-sm": "size-control-sm rounded-control [&_svg]:size-4",
        icon: "size-control-md rounded-control",
        "nav-icon": "h-11 w-11 rounded-control",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
