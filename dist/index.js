import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import * as React23 from 'react';
import React23__default, { Component } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown, ArrowLeft, ArrowRight, X, Search, ChevronRight, Check, Circle, PanelLeft, MoreHorizontal, ChevronLeft, Loader2Icon, OctagonXIcon, TriangleAlertIcon, InfoIcon, CircleCheckIcon, Frown, Lock, Construction } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { cva } from 'class-variance-authority';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Slot } from '@radix-ui/react-slot';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import useEmblaCarousel from 'embla-carousel-react';
import { Command as Command$1 } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { Panel, Group, Separator as Separator$1 } from 'react-resizable-panels';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Toaster as Toaster$1 } from 'sonner';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

// src/lib/utils.ts
var twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["meta"] }]
    }
  }
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
var alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Alert = React23.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
var AlertTitle = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("[&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap   rounded-control font-medium transition-colors focus-visible:outline-none   focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2   disabled:pointer-events-none disabled:opacity-50   [&_svg]:pointer-events-none   [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--primary)_/_var(--surface-alpha))] glassable text-primary-foreground shadow ring-1 ring-primary/30           hover:ring-primary/50 hover:shadow-lg           active:bg-[hsl(var(--primary)_/_var(--surface-alpha))]",
        destructive: "bg-[hsl(var(--destructive)_/_var(--surface-alpha))] glassable text-destructive-foreground shadow-sm ring-1 ring-destructive/40           hover:ring-destructive/60           active:bg-destructive/70",
        outline: "bg-[hsl(var(--background)_/_var(--surface-alpha))] glassable shadow-sm ring-1 ring-border           hover:bg-[hsl(var(--accent)_/_var(--surface-alpha))] hover:text-accent-foreground           active:bg-[hsl(var(--accent)_/_var(--surface-alpha))]",
        secondary: "bg-[hsl(var(--secondary)_/_var(--surface-alpha))] glassable text-secondary-foreground shadow-sm ring-1 ring-border           hover:bg-secondary/80 hover:ring-border           active:bg-secondary/60",
        ghost: "ring-1 ring-transparent           hover:bg-[hsl(var(--accent)_/_var(--surface-alpha))] hover:text-accent-foreground           active:bg-[hsl(var(--accent)_/_var(--surface-alpha))]",
        soft: "bg-primary/10 glassable text-primary ring-1 ring-primary/30 shadow-sm           hover:bg-primary/20 active:bg-primary/25",
        link: "text-primary underline-offset-4 hover:underline           hover:text-primary/80 active:text-primary/60"
      },
      /*
       * The scale runs 24 → 48. `xs` and `icon-xs` are the dense tier: a
       * toolbar above a panel, an action inside a list row, a chip-height
       * control beside 13px text. Below `sm` the icon has to come down with
       * the box, so both xs sizes reset `[&_svg]:size-4` — the base class sets
       * size-5, which at h-6 leaves no padding at all.
       */
      size: {
        xs: "h-6 rounded-control px-2 text-meta gap-1 [&_svg]:size-4",
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-control px-3 py-2",
        lg: "h-12 rounded-control px-8 py-3",
        "icon-xs": "h-6 w-6 rounded-control [&_svg]:size-4",
        icon: "h-8 w-8 rounded-control",
        "nav-icon": "h-11 w-11 rounded-control"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React23.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
var Avatar = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    "data-slot": "avatar",
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
var badgeVariants = cva(
  "inline-flex items-center border font-semibold transition-colors   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--badge-solid)] text-[var(--badge-on-solid)] hover:opacity-90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-border text-[var(--badge-ink)]",
        soft: "border-[color-mix(in_srgb,var(--badge-solid)_25%,transparent)]           bg-[color-mix(in_srgb,var(--badge-solid)_15%,transparent)] text-[var(--badge-solid)]           hover:bg-[color-mix(in_srgb,var(--badge-solid)_22%,transparent)]"
      },
      tone: {
        primary: "[--badge-solid:var(--color-primary)] [--badge-on-solid:var(--color-primary-foreground)] [--badge-ink:var(--color-foreground)]",
        success: "[--badge-solid:var(--color-success)] [--badge-on-solid:var(--color-success-foreground)] [--badge-ink:var(--color-success)]",
        warning: "[--badge-solid:var(--color-warning)] [--badge-on-solid:var(--color-warning-foreground)] [--badge-ink:var(--color-warning)]",
        info: "[--badge-solid:var(--color-info)] [--badge-on-solid:var(--color-info-foreground)] [--badge-ink:var(--color-info)]",
        muted: "[--badge-solid:var(--color-muted-foreground)] [--badge-on-solid:var(--color-background)] [--badge-ink:var(--color-muted-foreground)]"
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
        default: "px-2.5 py-0.5 text-meta"
      }
    },
    defaultVariants: {
      variant: "default",
      tone: "primary",
      size: "default"
    }
  }
);
function Badge({ className, variant, tone, size, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(badgeVariants({ variant, tone, size }), className),
      ...props
    }
  );
}
var Breadcrumb = React23.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ol",
  {
    ref,
    className: cn(
      "flex flex-wrap items-center gap-1.5 break-words text-muted-foreground sm:gap-2.5",
      className
    ),
    ...props
  }
));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    className: cn("inline-flex items-center gap-1.5", className),
    ...props
  }
));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = React23.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "span",
  {
    ref,
    role: "link",
    "aria-disabled": "true",
    "aria-current": "page",
    className: cn("font-normal text-foreground", className),
    ...props
  }
));
BreadcrumbPage.displayName = "BreadcrumbPage";
var BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  "span",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "More" })
    ]
  }
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
var Separator = React23.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
var buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
      }
    },
    defaultVariants: {
      orientation: "horizontal"
    }
  }
);
function ButtonGroup({
  className,
  orientation,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "button-group",
      "data-orientation": orientation,
      className: cn(buttonGroupVariants({ orientation }), className),
      ...props
    }
  );
}
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      className: cn(
        "bg-muted shadow-xs flex items-center gap-2 rounded-control border px-4 font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      ),
      ...props
    }
  );
}
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      "data-slot": "button-group-separator",
      orientation,
      className: cn(
        "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      ),
      ...props
    }
  );
}
var Card = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-md border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
var CardHeader = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-3", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none  tracking-tight ", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(" text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-3 flex-1 overflow-y-auto", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-3 ", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
var CardWithHeader = React23.forwardRef(
  ({ className, title, description, headerClassName, contentClassName, footerClassName, footer, children, ...props }, ref) => /* @__PURE__ */ jsxs(Card, { ref, className, ...props, children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: `${headerClassName} rounded-t-md`, children: [
      typeof title === "string" ? /* @__PURE__ */ jsx(CardTitle, { children: title }) : title,
      description && (typeof description === "string" ? /* @__PURE__ */ jsx(CardDescription, { children: description }) : description)
    ] }),
    /* @__PURE__ */ jsx(CardContent, { className: contentClassName, children }),
    footer && /* @__PURE__ */ jsx(CardFooter, { className: footerClassName, children: footer })
  ] })
);
CardWithHeader.displayName = "CardWithHeader";
var CarouselContext = React23.createContext(null);
function useCarousel() {
  const context = React23.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
var Carousel = React23.forwardRef(
  ({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y"
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React23.useState(false);
    const [canScrollNext, setCanScrollNext] = React23.useState(false);
    const onSelect = React23.useCallback((api2) => {
      if (!api2) {
        return;
      }
      setCanScrollPrev(api2.canScrollPrev());
      setCanScrollNext(api2.canScrollNext());
    }, []);
    const scrollPrev = React23.useCallback(() => {
      api?.scrollPrev();
    }, [api]);
    const scrollNext = React23.useCallback(() => {
      api?.scrollNext();
    }, [api]);
    const handleKeyDown = React23.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );
    React23.useEffect(() => {
      if (!api || !setApi) {
        return;
      }
      setApi(api);
    }, [api, setApi]);
    React23.useEffect(() => {
      if (!api) {
        return;
      }
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);
    return /* @__PURE__ */ jsx(
      CarouselContext.Provider,
      {
        value: {
          carouselRef,
          api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext
        },
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref,
            onKeyDownCapture: handleKeyDown,
            className: cn("relative", className),
            role: "region",
            "aria-roledescription": "carousel",
            ...props,
            children
          }
        )
      }
    );
  }
);
Carousel.displayName = "Carousel";
var CarouselContent = React23.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return /* @__PURE__ */ jsx("div", { ref: carouselRef, className: "overflow-hidden", children: /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "flex",
        orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
        className
      ),
      ...props
    }
  ) });
});
CarouselContent.displayName = "CarouselContent";
var CarouselItem = React23.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: "group",
      "aria-roledescription": "slide",
      className: cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      ),
      ...props
    }
  );
});
CarouselItem.displayName = "CarouselItem";
var CarouselPrevious = React23.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      variant,
      size,
      className: cn(
        "absolute  h-8 w-8 rounded-control",
        orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollPrev,
      onClick: scrollPrev,
      ...props,
      children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Previous slide" })
      ]
    }
  );
});
CarouselPrevious.displayName = "CarouselPrevious";
var CarouselNext = React23.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      variant,
      size,
      className: cn(
        "absolute h-8 w-8 rounded-control",
        orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollNext,
      onClick: scrollNext,
      ...props,
      children: [
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Next slide" })
      ]
    }
  );
});
CarouselNext.displayName = "CarouselNext";
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogClose = DialogPrimitive.Close;
var DialogOverlay = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-control opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
var Command = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover/80 backdrop-blur-md supports-[backdrop-filter]:bg-popover/70 text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = Command$1.displayName;
var CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ jsx(Dialog, { ...props, children: /* @__PURE__ */ jsx(DialogContent, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsx(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children }) }) });
};
var CommandInput = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsx(
    Command$1.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-control bg-transparent py-3 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = Command$1.Input.displayName;
var CommandList = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = Command$1.List.displayName;
var CommandEmpty = React23.forwardRef((props, ref) => /* @__PURE__ */ jsx(
  Command$1.Empty,
  {
    ref,
    className: "py-6 text-center",
    ...props
  }
));
CommandEmpty.displayName = Command$1.Empty.displayName;
var CommandGroup = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = Command$1.Group.displayName;
var CommandSeparator = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = Command$1.Separator.displayName;
var CommandItem = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-control px-2 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-primary/15 data-[selected=true]:text-primary data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = Command$1.Item.displayName;
var CommandShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "ml-auto text-meta tracking-widest text-muted-foreground",
        className
      ),
      ...props
    }
  );
};
CommandShortcut.displayName = "CommandShortcut";
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive.Group;
var DropdownMenuPortal = DropdownMenuPrimitive.Portal;
var DropdownMenuSub = DropdownMenuPrimitive.Sub;
var DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
var DropdownMenuSubTrigger = React23.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default gap-2 select-none items-center rounded-control px-2 py-1.5 outline-none focus:bg-primary/15 focus:text-primary data-[state=open]:bg-primary/15 data-[state=open]:text-primary [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover/80 backdrop-blur-md supports-[backdrop-filter]:bg-popover/70 p-1 text-popover-foreground shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React23.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover/80 backdrop-blur-md supports-[backdrop-filter]:bg-popover/70 p-1 text-popover-foreground shadow-xl",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React23.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2       rounded-control px-2 py-1.5 outline-none transition-colors       focus:bg-primary/15 focus:text-primary hover:bg-primary/10 hover:text-primary       data-[disabled]:pointer-events-none data-[disabled]:opacity-50       [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React23.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control py-1.5 pl-8 pr-2 outline-none transition-colors focus:bg-primary/15 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control py-1.5 pl-8 pr-2 outline-none transition-colors focus:bg-primary/15 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React23.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn("ml-auto text-meta tracking-widest opacity-60", className),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var HoverCard = HoverCardPrimitive.Root;
var HoverCardTrigger = HoverCardPrimitive.Trigger;
var HoverCardContent = React23.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  HoverCardPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-64 rounded-md border border-border bg-popover/80 backdrop-blur-md supports-[backdrop-filter]:bg-popover/70 p-4 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",
      className
    ),
    ...props
  }
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;
function ItemGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "list",
      "data-slot": "item-group",
      className: cn("group/item-group flex flex-col", className),
      ...props
    }
  );
}
function ItemSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      "data-slot": "item-separator",
      orientation: "horizontal",
      className: cn("my-0", className),
      ...props
    }
  );
}
var itemVariants = cva(
  "group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent outline-none transition-colors duration-100 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50"
      },
      size: {
        default: "gap-4 p-4 ",
        sm: "gap-2.5 px-4 py-3",
        /**
         * The application row — 30px, the height a dense list actually uses:
         * an agent in a roster, a dataset, a schedule, a node type, a queue
         * entry. `min-h` rather than `h`, so a row that wraps still contains
         * its content instead of clipping it.
         */
        xs: "min-h-[30px] gap-2 px-2 py-1"
      },
      /**
       * Selection, not hover. A row the user has chosen stays marked while
       * they work elsewhere in the panel, which `:hover` cannot express.
       * Drive it from the same state that drives `aria-selected`.
       */
      selected: {
        true: "bg-accent",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      selected: false
    }
  }
);
function Item3({
  className,
  variant = "default",
  size = "default",
  selected,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "item",
      "data-variant": variant,
      "data-size": size,
      "data-selected": selected || void 0,
      className: cn(itemVariants({ variant, size, selected, className })),
      ...props
    }
  );
}
var itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        image: "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function ItemMedia({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "item-media",
      "data-variant": variant,
      className: cn(itemMediaVariants({ variant, className })),
      ...props
    }
  );
}
function ItemContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "item-content",
      className: cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      ),
      ...props
    }
  );
}
function ItemTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "item-title",
      className: cn(
        "flex w-fit items-center gap-2 font-medium leading-snug",
        className
      ),
      ...props
    }
  );
}
function ItemDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "p",
    {
      "data-slot": "item-description",
      className: cn(
        "text-muted-foreground line-clamp-2 text-balance font-normal leading-normal",
        // A dense row's subtitle is one line of meta, not a wrapped paragraph.
        "group-data-[size=xs]/item:line-clamp-1 group-data-[size=xs]/item:text-meta",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      ),
      ...props
    }
  );
}
function ItemActions({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "item-actions",
      className: cn("flex items-center gap-2", className),
      ...props
    }
  );
}
function ItemHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "item-header",
      className: cn(
        "flex basis-full items-center justify-between gap-2",
        className
      ),
      ...props
    }
  );
}
function ItemFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "item-footer",
      className: cn(
        "flex basis-full items-center justify-between gap-2",
        className
      ),
      ...props
    }
  );
}
function Kbd({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "kbd",
    {
      "data-slot": "kbd",
      className: cn(
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-control px-1 font-sans text-meta font-medium",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      ),
      ...props
    }
  );
}
function KbdGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "kbd",
    {
      "data-slot": "kbd-group",
      className: cn("inline-flex items-center gap-1", className),
      ...props
    }
  );
}
function MenubarMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(MenubarPrimitive.Menu, { ...props });
}
function MenubarGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx(MenubarPrimitive.Group, { ...props });
}
function MenubarPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(MenubarPrimitive.Portal, { ...props });
}
function MenubarRadioGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx(MenubarPrimitive.RadioGroup, { ...props });
}
function MenubarSub({
  ...props
}) {
  return /* @__PURE__ */ jsx(MenubarPrimitive.Sub, { "data-slot": "menubar-sub", ...props });
}
var Menubar = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  MenubarPrimitive.Root,
  {
    ref,
    className: cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    ),
    ...props
  }
));
Menubar.displayName = MenubarPrimitive.Root.displayName;
var MenubarTrigger = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  MenubarPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-control px-3 py-1.5 font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    ),
    ...props
  }
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;
var MenubarSubTrigger = React23.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  MenubarPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-control px-2 py-1.5 outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;
var MenubarSubContent = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  MenubarPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    ),
    ...props
  }
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;
var MenubarContent = React23.forwardRef(
  ({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => /* @__PURE__ */ jsx(MenubarPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    MenubarPrimitive.Content,
    {
      ref,
      align,
      alignOffset,
      sideOffset,
      className: cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
        className
      ),
      ...props
    }
  ) })
);
MenubarContent.displayName = MenubarPrimitive.Content.displayName;
var MenubarItem = React23.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  MenubarPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control px-2 py-1.5 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;
var MenubarCheckboxItem = React23.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  MenubarPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control py-1.5 pl-8 pr-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(MenubarPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;
var MenubarRadioItem = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  MenubarPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control py-1.5 pl-8 pr-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(MenubarPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;
var MenubarLabel = React23.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  MenubarPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5  font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;
var MenubarSeparator = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  MenubarPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;
var MenubarShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "ml-auto text-meta tracking-widest text-muted-foreground",
        className
      ),
      ...props
    }
  );
};
MenubarShortcut.displayname = "MenubarShortcut";
var NavigationMenu = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Root,
  {
    ref,
    className: cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
var NavigationMenuList = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.List,
  {
    ref,
    className: cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    ),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
var NavigationMenuItem = NavigationMenuPrimitive.Item;
var navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-control bg-background px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
);
var NavigationMenuTrigger = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Trigger,
  {
    ref,
    className: cn(navigationMenuTriggerStyle(), "group", className),
    ...props,
    children: [
      children,
      " ",
      /* @__PURE__ */ jsx(
        ChevronDown,
        {
          className: "relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        }
      )
    ]
  }
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
var NavigationMenuContent = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Content,
  {
    ref,
    className: cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    ),
    ...props
  }
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
var NavigationMenuLink = NavigationMenuPrimitive.Link;
var NavigationMenuViewport = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: cn("absolute left-0 top-full flex justify-center"), children: /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Viewport,
  {
    className: cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className
    ),
    ref,
    ...props
  }
) }));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
var NavigationMenuIndicator = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Indicator,
  {
    ref,
    className: cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
  }
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;
var Pagination = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "nav",
  {
    role: "navigation",
    "aria-label": "pagination",
    className: cn("mx-auto flex w-full justify-center", className),
    ...props
  }
);
Pagination.displayName = "Pagination";
var PaginationContent = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    className: cn("flex flex-row items-center gap-1", className),
    ...props
  }
));
PaginationContent.displayName = "PaginationContent";
var PaginationItem = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, className: cn("", className), ...props }));
PaginationItem.displayName = "PaginationItem";
var PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => /* @__PURE__ */ jsx(
  "a",
  {
    "aria-current": isActive ? "page" : void 0,
    className: cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size
      }),
      className
    ),
    ...props
  }
);
PaginationLink.displayName = "PaginationLink";
var PaginationPrevious = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  PaginationLink,
  {
    "aria-label": "Go to previous page",
    size: "default",
    className: cn("gap-1 pl-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { children: "Previous" })
    ]
  }
);
PaginationPrevious.displayName = "PaginationPrevious";
var PaginationNext = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  PaginationLink,
  {
    "aria-label": "Go to next page",
    size: "default",
    className: cn("gap-1 pr-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { children: "Next" }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
    ]
  }
);
PaginationNext.displayName = "PaginationNext";
var PaginationEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  "span",
  {
    "aria-hidden": true,
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "More pages" })
    ]
  }
);
PaginationEllipsis.displayName = "PaginationEllipsis";
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React23.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border border-border bg-popover/80 backdrop-blur-md supports-[backdrop-filter]:bg-popover/70 p-4 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
var Progress = React23.forwardRef(({ className, value, size = "default", ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn(
      "relative w-full overflow-hidden rounded-full bg-secondary",
      size === "sm" ? "h-1" : "h-4",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
var ResizablePanelGroup = (props) => /* @__PURE__ */ jsx(Group, { ...props });
var ResizablePanel = Panel;
var ResizableHandle = ({
  withHandle,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  Separator$1,
  {
    className: cn(
      // A themed gap between panels. The separator has no intrinsic size, so give
      // it an explicit one on the main axis or it collapses to 0.
      "relative flex items-center justify-center bg-background transition-colors",
      "aria-[orientation=vertical]:w-1 aria-[orientation=vertical]:cursor-col-resize",
      "aria-[orientation=horizontal]:h-1 aria-[orientation=horizontal]:cursor-row-resize",
      "data-[separator=hover]:bg-accent data-[separator=active]:bg-accent",
      "[&[aria-orientation=horizontal]>div]:rotate-90",
      className
    ),
    ...props,
    children: withHandle && // A subtle pill grip centered in the gutter; rotate handles orientation.
    /* @__PURE__ */ jsx("div", { className: "z-10 h-6 w-[3px] rounded-full bg-muted-foreground/40" })
  }
);
var ScrollArea = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React23.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
var Sheet = DialogPrimitive.Root;
var SheetTrigger = DialogPrimitive.Trigger;
var SheetClose = DialogPrimitive.Close;
var SheetPortal = DialogPrimitive.Portal;
var SheetOverlay = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
var sheetVariants = cva(
  "fixed z-50 gap-4 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 p-6 shadow-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
var SheetContent = React23.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-control opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
SheetContent.displayName = DialogPrimitive.Content.displayName;
var SheetHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
var SheetDescription = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React23.useState(void 0);
  React23.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React23.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border border-border bg-popover/85 backdrop-blur-md supports-[backdrop-filter]:bg-popover/75 px-3 py-1.5 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React23.createContext(null);
function useSidebar() {
  const context = React23.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
var SidebarProvider = React23.forwardRef(
  ({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React23.useState(false);
    const [_open, _setOpen] = React23.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React23.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );
    const toggleSidebar = React23.useCallback(() => {
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile]);
    React23.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);
    const state = open ? "expanded" : "collapsed";
    const contextValue = React23.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );
    return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        ),
        ref,
        ...props,
        children
      }
    ) }) });
  }
);
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = React23.forwardRef(
  ({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          ),
          ref,
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-mobile": "true",
          className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: [
            /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
              /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
              /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
          ]
        }
      ) });
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: "group peer hidden text-sidebar-foreground md:block",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
                "group-data-[collapsible=offcanvas]:w-0",
                "group-data-[side=right]:rotate-180",
                variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
                side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                // Adjust the padding for floating and inset variants.
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  "data-sidebar": "sidebar",
                  className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                  children
                }
              )
            }
          )
        ]
      }
    );
  }
);
Sidebar.displayName = "Sidebar";
var SidebarTrigger = React23.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      "data-sidebar": "trigger",
      variant: "ghost",
      size: "icon",
      className: cn("h-7 w-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeft, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = React23.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      "data-sidebar": "rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
});
SidebarRail.displayName = "SidebarRail";
var SidebarInset = React23.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "main",
    {
      ref,
      className: cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      ),
      ...props
    }
  );
});
SidebarInset.displayName = "SidebarInset";
var SidebarInput = React23.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ref,
      type,
      "data-sidebar": "input",
      className: cn(
        // mirrors @invana/forms <Input> styling
        "flex h-10 w-full rounded-control border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "h-8 w-full shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = React23.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = React23.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = React23.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      ref,
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = React23.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
});
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = React23.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
});
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = React23.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-meta font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = React23.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-action",
      className: cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-control p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "group-content",
    className: cn("w-full", className),
    ...props
  }
));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...props
  }
));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    "data-sidebar": "menu-item",
    className: cn("group/menu-item relative", className),
    ...props
  }
));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-control p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8",
        sm: "h-7",
        lg: "h-12 text-lg group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var SidebarMenuButton = React23.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        ...props
      }
    );
    if (!tooltip) {
      return button;
    }
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip
      };
    }
    return /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx(
        TooltipContent,
        {
          side: "right",
          align: "center",
          hidden: state !== "collapsed" || isMobile,
          ...tooltip
        }
      )
    ] });
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = React23.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-action",
      className: cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-control p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-meta font-medium tabular-nums text-sidebar-foreground",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = React23.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const width = React23.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "h-4 max-w-[--skeleton-width] flex-1",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    }
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu-sub",
    className: cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = React23.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = React23.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-control px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "md" && "text-lg",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
var Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: cn("toaster group", props.className),
      icons: {
        success: /* @__PURE__ */ jsx(CircleCheckIcon, { className: "size-4 text-green-500" }),
        info: /* @__PURE__ */ jsx(InfoIcon, { className: "size-4 text-blue-500" }),
        warning: /* @__PURE__ */ jsx(TriangleAlertIcon, { className: "size-4 text-yellow-500" }),
        error: /* @__PURE__ */ jsx(OctagonXIcon, { className: "size-4 text-red-500" }),
        loading: /* @__PURE__ */ jsx(Loader2Icon, { className: "size-4 animate-spin text-blue-500" })
      },
      toastOptions: {
        classNames: {
          toast: cn(
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground",
            "group-[.toaster]:border-border group-[.toaster]:shadow-lg"
          ),
          description: "group-[.toast]:text-muted-foreground",
          actionButton: cn(
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground"
          ),
          cancelButton: cn(
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
          ),
          success: "group-[.toast]:border-green-500/50 group-[.toast]:bg-green-500/10",
          error: "group-[.toast]:border-red-500/50 group-[.toast]:bg-red-500/10",
          warning: "group-[.toast]:border-yellow-500/50 group-[.toast]:bg-yellow-500/10",
          info: "group-[.toast]:border-blue-500/50 group-[.toast]:bg-blue-500/10"
        },
        ...props.toastOptions
      },
      ...props
    }
  );
};
function Spinner({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Loader2Icon,
    {
      role: "status",
      "aria-label": "Loading",
      className: cn("size-4 animate-spin", className),
      ...props
    }
  );
}
var statusDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    tone: {
      /** Work in flight. The only tone that animates. */
      running: "bg-primary animate-pulse motion-reduce:animate-none",
      /** Finished, and the result stands. */
      success: "bg-success",
      /** Finished, but something wants a person to look. */
      warning: "bg-warning",
      /** Failed. */
      error: "bg-destructive",
      /** Informational — a note, a count, a neutral marker. */
      info: "bg-info",
      /** Not started. Hollow, because there is nothing in it yet. */
      queued: "bg-transparent border-[1.5px] border-muted-foreground",
      /** Present but inactive — retired, paused, skipped, hidden. */
      muted: "bg-muted-foreground"
    },
    size: {
      /** 5px — inside a dense step row. */
      xs: "size-[5px]",
      /** 6px — the default in a thread or a list row. */
      sm: "size-1.5",
      /** 8px — a roster row, a legend swatch. */
      md: "size-2",
      /** 10px — a legend key that stands on its own. */
      lg: "size-2.5"
    }
  },
  defaultVariants: {
    tone: "muted",
    size: "sm"
  }
});
var StatusDot = React23.forwardRef(
  ({ className, tone, size, label, ...props }, ref) => /* @__PURE__ */ jsx(
    "span",
    {
      ref,
      className: cn(statusDotVariants({ tone, size }), className),
      role: label ? "img" : void 0,
      "aria-label": label,
      "aria-hidden": label ? void 0 : true,
      ...props
    }
  )
);
StatusDot.displayName = "StatusDot";
var Table = React23.forwardRef(({ className, density = "default", ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    "data-density": density,
    className: "group/table relative w-full overflow-auto border rounded-md",
    children: /* @__PURE__ */ jsx(
      "table",
      {
        ref,
        className: cn("w-full caption-bottom", className),
        ...props
      }
    )
  }
));
Table.displayName = "Table";
var TableHeader = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
var TableBody = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
var TableFooter = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
var TableRow = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
var TableHead = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      // Compact density: `<Table density="compact">` marks the wrapper, and
      // every cell follows from there. One prop on the table rather than a
      // size on <TableHead> and <TableCell> individually — four places to
      // forget, and a table with two densities in it is always a mistake.
      "group-data-[density=compact]/table:h-[26px] group-data-[density=compact]/table:text-meta",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
var TableCell = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      "group-data-[density=compact]/table:px-2 group-data-[density=compact]/table:py-1",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
var TableCaption = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
var TabsSizeContext = React23.createContext("default");
var Tabs = React23.forwardRef(({ size = "default", ...props }, ref) => /* @__PURE__ */ jsx(TabsSizeContext.Provider, { value: size, children: /* @__PURE__ */ jsx(TabsPrimitive.Root, { ref, ...props }) }));
Tabs.displayName = TabsPrimitive.Root.displayName;
var TabsList = React23.forwardRef(({ className, ...props }, ref) => {
  const size = React23.useContext(TabsSizeContext);
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      ref,
      className: cn(
        "inline-flex items-center justify-center text-muted-foreground",
        size === "sm" ? "h-[30px] gap-1" : "rounded-lg bg-muted p-1",
        className
      ),
      ...props
    }
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React23.forwardRef(({ className, ...props }, ref) => {
  const size = React23.useContext(TabsSizeContext);
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      ref,
      className: cn(
        size === "sm" ? "h-[26px] px-2 text-meta" : "px-3 py-1",
        "inline-flex items-center justify-center whitespace-nowrap rounded-control font-medium ring-offset-background transition-colors text-muted-foreground hover:text-foreground hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:ring-1 data-[state=active]:ring-primary/25 data-[state=active]:shadow-sm",
        className
      ),
      ...props
    }
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
var toggleVariants = cva(
  "inline-flex items-center justify-center rounded-control font-medium ring-offset-background transition-colors text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary/15 data-[state=on]:text-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/25 data-[state=on]:shadow-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted hover:text-foreground data-[state=on]:border-primary/30"
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Toggle = React23.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ jsx(
  TogglePrimitive.Root,
  {
    ref,
    className: cn(toggleVariants({ variant, size, className })),
    ...props
  }
));
Toggle.displayName = TogglePrimitive.Root.displayName;
var ToggleGroupContext = React23.createContext({
  size: "default",
  variant: "default"
});
var ToggleGroup = React23.forwardRef(({ className, variant, size, children, ...props }, ref) => /* @__PURE__ */ jsx(
  ToggleGroupPrimitive.Root,
  {
    ref,
    className: cn("flex items-center justify-center gap-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ToggleGroupContext.Provider, { value: { variant, size }, children })
  }
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
var ToggleGroupItem = React23.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React23.useContext(ToggleGroupContext);
  return /* @__PURE__ */ jsx(
    ToggleGroupPrimitive.Item,
    {
      ref,
      className: cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size
        }),
        className
      ),
      ...props,
      children
    }
  );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
var agentChipVariants = cva(
  "inline-flex max-w-full shrink-0 items-center gap-1 rounded-control border px-1.5   text-meta [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      /**
       * Who this is. The distinction is the point of the component: a reader
       * scanning a task list needs to know at a glance whether a person or an
       * agent is holding it, and reading the name is too slow.
       */
      kind: {
        agent: "border-border bg-transparent text-foreground",
        person: "border-transparent bg-accent text-foreground"
      },
      /** A retired or paused agent still appears in history and lineage. */
      inactive: {
        true: "opacity-60",
        false: ""
      }
    },
    defaultVariants: { kind: "agent", inactive: false }
  }
);
var AgentChip = React23.forwardRef(
  ({ icon, name, kind, inactive, className, ...props }, ref) => /* @__PURE__ */ jsxs(
    "span",
    {
      ref,
      className: cn(agentChipVariants({ kind, inactive }), className),
      ...props,
      children: [
        icon ? /* @__PURE__ */ jsx("span", { className: "flex shrink-0 items-center text-muted-foreground", children: icon }) : null,
        /* @__PURE__ */ jsx("span", { className: "truncate", children: name })
      ]
    }
  )
);
AgentChip.displayName = "AgentChip";
var stateVariants = cva("inline-flex shrink-0 items-center gap-1.5 font-medium", {
  variants: {
    tone: {
      active: "text-success",
      running: "text-primary",
      draft: "text-muted-foreground",
      review: "text-warning",
      error: "text-destructive"
    }
  },
  defaultVariants: { tone: "active" }
});
var AppStatusBar = React23.forwardRef(
  ({ state, tone, end, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex h-[25px] shrink-0 items-center gap-2 border-t border-border px-2 text-meta text-muted-foreground",
        className
      ),
      ...props,
      children: [
        state != null ? /* @__PURE__ */ jsxs("span", { className: cn(stateVariants({ tone })), children: [
          /* @__PURE__ */ jsx(
            StatusDot,
            {
              tone: tone === "error" ? "error" : tone === "review" ? "warning" : tone === "running" ? "running" : tone === "draft" ? "muted" : "success"
            }
          ),
          state
        ] }) : null,
        state != null && children ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u2022" }) : null,
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children }),
        end != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0", children: end }) : null
      ]
    }
  )
);
AppStatusBar.displayName = "AppStatusBar";
var BarChartH = React23.forwardRef(
  ({
    data,
    max,
    labelWidth = 78,
    color = "var(--color-data-1)",
    caption,
    className,
    ...props
  }, ref) => {
    const ceiling = max ?? (Math.max(...data.map((d) => d.value), 0) || 1);
    return /* @__PURE__ */ jsxs("div", { ref, className: cn("flex flex-col gap-1", className), ...props, children: [
      caption != null ? /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: caption }) : null,
      data.map((d, i) => /* @__PURE__ */ jsxs("div", { className: "flex h-4 items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "shrink-0 truncate text-meta text-muted-foreground",
            style: { width: labelWidth },
            children: d.label
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 flex-1 items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              title: `${d.label}: ${d.display ?? d.value}`,
              className: "h-2.5 shrink-0 rounded-e-[4px]",
              style: {
                width: `${Math.max(0, d.value / ceiling * 100)}%`,
                background: d.color ?? color
              }
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "shrink-0 text-meta tabular-nums", children: d.display ?? d.value })
        ] })
      ] }, i))
    ] });
  }
);
BarChartH.displayName = "BarChartH";
var BarChartV = React23.forwardRef(
  ({
    data,
    max,
    gridlines = [],
    height = 160,
    color = "var(--color-data-1)",
    highlightColor,
    highlightIndex,
    labelMode = "last",
    caption,
    className,
    ...props
  }, ref) => {
    const ceiling = max ?? (Math.max(...data.map((d) => d.value), 0) || 1);
    const emphasis = highlightIndex ?? data.length - 1;
    const labelled = (i) => labelMode === "all" || labelMode === "last" && i === emphasis;
    return /* @__PURE__ */ jsxs("div", { ref, className: cn("flex flex-col gap-1", className), ...props, children: [
      caption != null ? /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: caption }) : null,
      /* @__PURE__ */ jsxs("div", { className: "relative mt-2", style: { height }, children: [
        gridlines.map((g) => /* @__PURE__ */ jsxs(
          "div",
          {
            "aria-hidden": true,
            className: "absolute inset-x-0 flex translate-y-1/2 items-center",
            style: { bottom: `${g / ceiling * 100}%` },
            children: [
              /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" }),
              /* @__PURE__ */ jsx("span", { className: "pl-1 text-meta tabular-nums text-muted-foreground", children: g })
            ]
          },
          g
        )),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-end justify-between gap-2", children: data.map((d, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1",
            children: [
              labelled(i) ? /* @__PURE__ */ jsx("span", { className: "text-meta tabular-nums", children: d.display ?? d.value }) : null,
              /* @__PURE__ */ jsx(
                "span",
                {
                  title: `${d.label}: ${d.display ?? d.value}`,
                  className: "w-full max-w-6 rounded-t-[4px]",
                  style: {
                    height: `${Math.max(0, d.value / ceiling * 100)}%`,
                    background: i === emphasis ? highlightColor ?? color : color,
                    opacity: i === emphasis ? 1 : 0.55
                  }
                }
              )
            ]
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-between gap-2", children: data.map((d, i) => /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "truncate text-meta text-muted-foreground", children: d.label }),
        d.sublabel != null ? /* @__PURE__ */ jsx("span", { className: "truncate text-meta text-muted-foreground/70", children: d.sublabel }) : null
      ] }, i)) })
    ] });
  }
);
BarChartV.displayName = "BarChartV";
function ButtonWithTooltip(props) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { delayDuration: 0, children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: cn("hover:bg-transparent", props.className), ...props, children: props.children }) }),
    /* @__PURE__ */ jsx(TooltipContent, { children: props.tooltip })
  ] }) });
}
var CannotAnswerCard = React23.forwardRef(({ label = "cannot answer", remedy, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  "div",
  {
    ref,
    className: cn(
      "flex flex-col gap-1 border border-dashed border-border bg-card p-2",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "text-meta font-medium text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("span", { children }),
      remedy != null ? /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: remedy }) : null
    ]
  }
));
CannotAnswerCard.displayName = "CannotAnswerCard";
function ChatSession({
  children,
  footer,
  emptyState,
  autoScrollKey,
  followThreshold = 80,
  className,
  bodyClassName
}) {
  const rootRef = React23.useRef(null);
  const contentRef = React23.useRef(null);
  const pinnedRef = React23.useRef(true);
  const getViewport = React23.useCallback(
    () => rootRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) ?? null,
    []
  );
  const scrollToBottom = React23.useCallback(() => {
    const viewport = getViewport();
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [getViewport]);
  React23.useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;
    const handleScroll = () => {
      const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      pinnedRef.current = distance <= followThreshold;
    };
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [getViewport, followThreshold]);
  React23.useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) scrollToBottom();
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToBottom]);
  React23.useEffect(() => {
    pinnedRef.current = true;
    scrollToBottom();
  }, [autoScrollKey, scrollToBottom]);
  const isEmpty = React23.Children.count(children) === 0;
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col h-full min-h-0", className), children: [
    /* @__PURE__ */ jsx(
      ScrollArea,
      {
        ref: rootRef,
        className: "flex-1 min-h-0 [&_[data-radix-scroll-area-viewport]>div]:!block",
        children: isEmpty && emptyState ? emptyState : /* @__PURE__ */ jsx(
          "div",
          {
            ref: contentRef,
            className: cn("flex flex-col gap-4 p-3", bodyClassName),
            children
          }
        )
      }
    ),
    footer
  ] });
}
function RunningDots() {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5", "aria-label": "Running", children: [
    /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" }),
    /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" }),
    /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-current animate-bounce" })
  ] });
}
function ChatSessionMessage({
  role,
  children,
  status = "idle",
  icon,
  meta,
  actions,
  footer,
  className
}) {
  if (role === "user") {
    return /* @__PURE__ */ jsx("div", { className: cn("flex justify-end", className), children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "max-w-[85%] bg-secondary px-3 py-2 text-secondary-foreground whitespace-pre-wrap break-words",
          icon && "flex items-center gap-1.5"
        ),
        children: [
          icon && /* @__PURE__ */ jsx("span", { className: "shrink-0 opacity-70", children: icon }),
          icon ? /* @__PURE__ */ jsx("span", { className: "min-w-0 break-words", children }) : children
        ]
      }
    ) });
  }
  if (status === "running") {
    return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-2 text-muted-foreground", className), children: [
      icon && /* @__PURE__ */ jsx("span", { className: "shrink-0", children: icon }),
      /* @__PURE__ */ jsx("span", { children }),
      /* @__PURE__ */ jsx(RunningDots, {})
    ] });
  }
  if (status === "stopped") {
    return /* @__PURE__ */ jsx("p", { className: cn("text-muted-foreground italic", className), children });
  }
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-1", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      icon && /* @__PURE__ */ jsx("span", { className: "mt-0.5 shrink-0", children: icon }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "min-w-0 flex-1 whitespace-pre-wrap break-words",
            status === "error" ? "text-destructive" : "text-foreground"
          ),
          children
        }
      )
    ] }),
    actions,
    meta && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: meta }),
    footer
  ] });
}
var NONE = Object.freeze([]);
function same(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function useOverflowItems({
  count,
  enabled = true,
  pinnedIndex,
  reserve = 32
}) {
  const containerEl = React23.useRef(null);
  const itemEls = React23.useRef([]);
  const widths = React23.useRef([]);
  const itemRefs = React23.useRef([]);
  const [hidden, setHidden] = React23.useState(NONE);
  const fit = React23.useCallback(() => {
    const el = containerEl.current;
    if (!el || !enabled) {
      setHidden((prev) => prev === NONE ? prev : NONE);
      return;
    }
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    for (let i = 0; i < count; i++) {
      const item = itemEls.current[i];
      if (item && item.offsetParent !== null) widths.current[i] = item.offsetWidth + gap;
    }
    const budget = el.clientWidth;
    if (budget <= 0) return;
    let total = 0;
    for (let i = 0; i < count; i++) total += widths.current[i] ?? 0;
    if (total <= budget + gap) {
      setHidden((prev) => prev === NONE ? prev : NONE);
      return;
    }
    const next = [];
    let used = pinnedIndex != null ? widths.current[pinnedIndex] ?? 0 : 0;
    for (let i = 0; i < count; i++) {
      if (i === pinnedIndex) continue;
      const w = widths.current[i] ?? 0;
      if (used + w <= budget - reserve) used += w;
      else next.push(i);
    }
    setHidden((prev) => same(prev, next) ? prev : next);
  }, [count, enabled, pinnedIndex, reserve]);
  React23.useLayoutEffect(() => {
    widths.current = [];
    itemEls.current.length = count;
    setHidden((prev) => prev === NONE ? prev : NONE);
  }, [count]);
  React23.useLayoutEffect(() => {
    fit();
    if (!enabled || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => fit());
    if (containerEl.current) observer.observe(containerEl.current);
    for (const item of itemEls.current) if (item) observer.observe(item);
    return () => observer.disconnect();
  }, [fit, enabled, hidden]);
  const containerRef = React23.useCallback((el) => {
    containerEl.current = el;
  }, []);
  const itemRef = React23.useCallback((index) => {
    let fn = itemRefs.current[index];
    if (!fn) {
      fn = (el) => {
        itemEls.current[index] = el;
      };
      itemRefs.current[index] = fn;
    }
    return fn;
  }, []);
  const isHidden = React23.useCallback(
    (index) => hidden.includes(index),
    [hidden]
  );
  return { containerRef, itemRef, hiddenIndices: hidden, isHidden };
}
var VARIANT = {
  /** The capsule: a filled, ringed chip. Toolbars, rails, header actions. */
  nav: {
    item: "rounded-control ring-1 ring-transparent",
    hover: "hover:bg-primary/10 hover:text-primary hover:ring-primary/25",
    open: "data-[state=open]:bg-primary/15 data-[state=open]:text-primary data-[state=open]:ring-primary/25",
    active: "bg-primary/15 text-primary ring-primary/25",
    strip: ""
  },
  /** The panel tab: accented fill with a rule under it, merging into the body. */
  underline: {
    item: "h-full rounded-none px-3 py-2",
    hover: "hover:text-foreground",
    open: "data-[state=open]:text-foreground",
    active: "bg-primary/10 text-primary border-b-2 border-primary mb-[-1px]",
    strip: "items-stretch"
  },
  /**
   * The workbook tab: boxed on top / left / right with an *open bottom*, so it
   * punches through the strip's own rule — the classic folder-tab notch.
   */
  folder: {
    item: "h-full rounded-none px-3 py-2 gap-1.5",
    hover: "hover:text-foreground",
    open: "data-[state=open]:text-foreground",
    active: "mb-[-1px] rounded-t-md border border-b-0 border-primary text-primary",
    strip: "items-stretch"
  }
};
var keyOf = (item) => item.key ?? item.name;
var NavItems = ({
  items,
  orientation = "horizontal",
  tooltipSide = orientation === "vertical" ? "right" : "bottom",
  iconClassName = orientation === "vertical" ? "w-5 h-5" : "w-4 h-4 flex-shrink-0",
  variant = "nav",
  activeKey,
  onActiveChange,
  selectionMode = "none",
  panelId,
  overflow = false,
  overflowLabel = "More",
  className
}) => {
  const isVertical = orientation === "vertical";
  const isTabs = selectionMode === "tabs";
  const V = VARIANT[variant];
  const [internalActive, setInternalActive] = React23__default.useState(
    null
  );
  const isControlled = activeKey !== void 0;
  const currentKey = isControlled ? activeKey : internalActive;
  const activeIndex = items.findIndex((item) => keyOf(item) === currentKey);
  const nodes = React23__default.useRef({});
  const pendingFocus = React23__default.useRef(null);
  React23__default.useEffect(() => {
    const key = pendingFocus.current;
    if (!key) return;
    const node = nodes.current[key];
    if (!node) return;
    pendingFocus.current = null;
    node.focus();
  });
  const { containerRef, itemRef, hiddenIndices, isHidden } = useOverflowItems({
    count: items.length,
    enabled: overflow && !isVertical,
    pinnedIndex: activeIndex >= 0 ? activeIndex : void 0
  });
  const select = React23__default.useCallback(
    (item) => {
      if (item.disabled) return;
      const key = keyOf(item);
      item.onClick?.();
      if (!isControlled) {
        setInternalActive((prev) => isTabs ? key : prev === key ? null : key);
      }
      onActiveChange?.(key);
    },
    [isControlled, isTabs, onActiveChange]
  );
  const step = (from, delta) => {
    if (items.length === 0) return -1;
    let i = from < 0 ? delta > 0 ? -1 : 0 : from;
    for (let n = 0; n < items.length; n++) {
      i = (i + delta + items.length) % items.length;
      if (!items[i]?.disabled) return i;
    }
    return -1;
  };
  const edge = (delta) => {
    const start = delta > 0 ? -1 : items.length;
    return step(start, delta);
  };
  const handleKeyDown = (event) => {
    if (!isTabs) return;
    const next = isVertical ? "ArrowDown" : "ArrowRight";
    const prev = isVertical ? "ArrowUp" : "ArrowLeft";
    let target = -1;
    if (event.key === next) target = step(activeIndex, 1);
    else if (event.key === prev) target = step(activeIndex, -1);
    else if (event.key === "Home") target = edge(1);
    else if (event.key === "End") target = edge(-1);
    else return;
    const item = items[target];
    if (!item) return;
    event.preventDefault();
    pendingFocus.current = keyOf(item);
    select(item);
  };
  const renderItem = (item, index) => {
    const key = keyOf(item);
    const isActive = key === currentKey;
    const hasMenu = !item.href && Boolean(item.menuItems?.length);
    const asCaret = hasMenu && item.menuTrigger === "caret";
    const isInteractive = Boolean(
      item.href || item.onClick || hasMenu || isTabs
    );
    const padding = variant === "nav" ? item.label ? "px-3 py-1.5" : "px-2 py-2" : "";
    const itemClass = cn(
      `relative inline-flex border-0 items-center justify-center gap-2
       whitespace-nowrap transition-colors
       ring-1 ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
      V.item,
      padding,
      isInteractive && !item.disabled && `cursor-pointer ${V.hover}`,
      hasMenu && !asCaret && V.open,
      item.disabled && "pointer-events-none opacity-50",
      isActive && cn(V.active, item.activeClass),
      item.className
    );
    const icon = item.icon && /* @__PURE__ */ jsx(
      item.icon,
      {
        strokeWidth: item.iconStroke || 2,
        className: item.iconClassName || iconClassName
      }
    );
    const label = item.label && /* @__PURE__ */ jsx("span", { className: item.labelClassName, children: item.label });
    const badge = item.badge != null && /* @__PURE__ */ jsx(
      "span",
      {
        className: "pointer-events-none absolute -right-0.5 -top-0.5 inline-flex h-3.5\n          min-w-3.5 items-center justify-center rounded-full bg-primary px-1\n          text-[9px] font-semibold leading-none text-primary-foreground",
        children: item.badge
      }
    );
    const tabProps = isTabs ? {
      role: "tab",
      "aria-selected": isActive,
      "aria-controls": panelId?.(key),
      tabIndex: isActive || activeIndex < 0 && index === 0 ? 0 : -1
    } : {};
    const setNode = (el) => {
      nodes.current[key] = el;
      itemRef(index)(el);
    };
    const caret = asCaret && /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
      "span",
      {
        role: "button",
        tabIndex: -1,
        "aria-label": `${item.name} menu`,
        onClick: (e) => e.stopPropagation(),
        className: "ml-0.5 grid size-4 shrink-0 cursor-pointer place-items-center\n            rounded-control text-muted-foreground hover:bg-accent hover:text-foreground",
        children: /* @__PURE__ */ jsx(ChevronDown, { className: "size-3" })
      }
    ) });
    const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
      icon,
      label,
      caret,
      badge
    ] });
    const control = asCaret ? /* @__PURE__ */ jsx(
      "div",
      {
        ref: setNode,
        ...tabProps,
        style: item.style,
        onClick: () => select(item),
        className: itemClass,
        children: inner
      }
    ) : item.href ? /* @__PURE__ */ jsx(
      "a",
      {
        ref: setNode,
        href: item.href,
        style: item.style,
        onClick: () => select(item),
        className: itemClass,
        children: inner
      }
    ) : item.onClick || hasMenu || isTabs ? /* @__PURE__ */ jsx(
      "button",
      {
        ref: setNode,
        type: "button",
        disabled: item.disabled,
        ...tabProps,
        style: item.style,
        onClick: () => {
          if (hasMenu) item.onClick?.();
          else select(item);
        },
        className: itemClass,
        children: inner
      }
    ) : /* @__PURE__ */ jsx("div", { ref: setNode, style: item.style, className: itemClass, children: inner });
    const withTooltip = /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: hasMenu && !asCaret ? /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: control }) : control }),
      /* @__PURE__ */ jsx(TooltipContent, { side: item.tooltipSide || tooltipSide, children: item.tooltip || item.name })
    ] });
    return /* @__PURE__ */ jsxs(React23__default.Fragment, { children: [
      hasMenu ? /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        withTooltip,
        /* @__PURE__ */ jsx(
          DropdownMenuContent,
          {
            side: isVertical ? "right" : "bottom",
            align: isVertical ? "start" : "end",
            children: renderMenuRows(item.menuItems)
          }
        )
      ] }) : withTooltip,
      item.showSeperator && /* @__PURE__ */ jsx(
        Separator,
        {
          orientation: isVertical ? "horizontal" : "vertical",
          className: isVertical ? "" : "h-4"
        }
      )
    ] }, item.key || item.name);
  };
  const rendered = items.map(
    (item, index) => isHidden(index) ? null : renderItem(item, index)
  );
  const overflowTrigger = hiddenIndices.length > 0 && /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": overflowLabel,
          className: cn(
            `relative inline-flex shrink-0 items-center justify-center border-0
                 transition-colors ring-1 ring-transparent focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer`,
            V.item,
            variant === "nav" && "px-2 py-2",
            V.hover,
            V.open
          ),
          children: /* @__PURE__ */ jsx(MoreHorizontal, { className: iconClassName })
        }
      ) }) }),
      /* @__PURE__ */ jsx(TooltipContent, { side: tooltipSide, children: overflowLabel })
    ] }),
    /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: hiddenIndices.map((index) => {
      const item = items[index];
      if (!item) return null;
      const Icon = item.icon;
      return /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          disabled: item.disabled,
          onSelect: () => select(item),
          children: [
            Icon ? /* @__PURE__ */ jsx(Icon, {}) : /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "size-4 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label ?? item.name })
          ]
        },
        keyOf(item)
      );
    }) })
  ] });
  if (!isTabs && !overflow) {
    return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: rendered });
  }
  return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      role: isTabs ? "tablist" : void 0,
      "aria-orientation": isTabs ? orientation : void 0,
      onKeyDown: handleKeyDown,
      className: cn(
        "flex min-w-0",
        isVertical ? "flex-col items-center gap-1" : "items-center gap-1",
        V.strip,
        className
      ),
      children: [
        rendered,
        overflowTrigger
      ]
    }
  ) });
};
function renderMenuRows(menuItems) {
  const gutter = menuItems?.some((m) => m.icon);
  return menuItems?.map((menuItem) => {
    const MenuIcon = menuItem.icon;
    return /* @__PURE__ */ jsxs(React23__default.Fragment, { children: [
      menuItem.separatorBefore && /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          disabled: menuItem.disabled,
          onSelect: () => menuItem.onSelect?.(),
          className: cn(
            menuItem.destructive && "text-destructive focus:bg-destructive/15 focus:text-destructive hover:bg-destructive/10 hover:text-destructive"
          ),
          children: [
            MenuIcon ? /* @__PURE__ */ jsx(MenuIcon, {}) : gutter ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "size-4 shrink-0" }) : null,
            /* @__PURE__ */ jsx("span", { className: "truncate", children: menuItem.label }),
            menuItem.shortcut && /* @__PURE__ */ jsx(DropdownMenuShortcut, { children: menuItem.shortcut })
          ]
        }
      )
    ] }, menuItem.id);
  });
}
var NavBase = ({
  className = "",
  orientation,
  sections
}) => {
  const isVertical = orientation === "vertical";
  const containerClass = isVertical ? `flex flex-col items-center h-full ${className}` : `flex items-center   w-full ${className}`;
  const sectionWrapperClass = isVertical ? "flex flex-col items-center gap-1" : "flex items-center gap-1 ";
  return /* @__PURE__ */ jsxs("nav", { className: containerClass, children: [
    sections.start?.content && /* @__PURE__ */ jsx(
      "div",
      {
        className: `${sectionWrapperClass} ${sections.start.className || ""}`,
        children: sections.start.content
      }
    ),
    sections.center?.content ? /* @__PURE__ */ jsx(
      "div",
      {
        className: `flex-1 ${isVertical ? "" : "flex justify-center items-center gap-1"} ${sections.center.className || ""}`,
        children: sections.center.content
      }
    ) : (
      // Empty spacer to push end section to the bottom/right
      /* @__PURE__ */ jsx("div", { className: "flex-1" })
    ),
    sections.end?.content && /* @__PURE__ */ jsx(
      "div",
      {
        className: `${sectionWrapperClass} ${isVertical ? "" : "ml-auto"} ${sections.end.className || ""}`,
        children: sections.end.content
      }
    )
  ] });
};
var NavHorizontalItems = (props) => /* @__PURE__ */ jsx(NavItems, { ...props, orientation: "horizontal" });
var NavHorizontal = ({
  left,
  leftNavItems,
  center,
  centerNavItems,
  right,
  rightNavItems,
  className = ""
}) => {
  return /* @__PURE__ */ jsx(
    NavBase,
    {
      orientation: "horizontal",
      className,
      sections: {
        start: left || leftNavItems ? {
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            left,
            leftNavItems && /* @__PURE__ */ jsx(NavHorizontalItems, { items: leftNavItems })
          ] }),
          className: "text-foreground"
        } : void 0,
        center: center || centerNavItems ? {
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            center,
            centerNavItems && /* @__PURE__ */ jsx(NavHorizontalItems, { items: centerNavItems })
          ] })
        } : void 0,
        end: right || rightNavItems ? {
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            rightNavItems && /* @__PURE__ */ jsx(NavHorizontalItems, { items: rightNavItems }),
            right
          ] })
        } : void 0
      }
    }
  );
};
function ChatSessionMessageOptions({
  actions,
  className
}) {
  const start = actions.filter((a) => (a.align ?? "start") === "start");
  const end = actions.filter((a) => a.align === "end");
  const renderAction = (action, i) => /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: cn(
          "h-6 w-7 text-muted-foreground",
          action.active && (action.activeClassName ?? "text-foreground"),
          action.className
        ),
        onClick: action.onClick,
        disabled: action.disabled,
        "aria-label": action.label,
        children: action.icon
      }
    ) }),
    /* @__PURE__ */ jsx(TooltipContent, { children: action.label })
  ] }, `${action.label}-${i}`);
  return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 300, children: /* @__PURE__ */ jsx(
    NavHorizontal,
    {
      className: cn("text-muted-foreground", className),
      left: start.length > 0 ? /* @__PURE__ */ jsx(Fragment, { children: start.map(renderAction) }) : void 0,
      right: end.length > 0 ? /* @__PURE__ */ jsx(Fragment, { children: end.map(renderAction) }) : void 0
    }
  ) });
}
function ChatSessionComposer({
  value,
  onChange,
  onSend,
  onStop,
  isRunning = false,
  disabled = false,
  placeholder = "Ask anything\u2026",
  toolbarStart,
  toolbarEnd,
  attachments,
  sendIcon,
  stopIcon,
  sendDisabled,
  className,
  textareaClassName
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isRunning && !disabled) onSend();
    }
  };
  const isSendDisabled = sendDisabled ?? (disabled || value.trim().length === 0);
  return /* @__PURE__ */ jsx("div", { className: cn("p-3", className), children: /* @__PURE__ */ jsxs("div", { className: "rounded-control border border-border bg-card shadow-sm overflow-hidden focus-within:border-ring transition-colors", children: [
    attachments && /* @__PURE__ */ jsx("div", { className: "px-2 py-1.5 border-b border-border max-h-24 overflow-y-auto flex items-start gap-1 flex-wrap", children: attachments }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        onKeyDown: handleKeyDown,
        disabled,
        placeholder,
        className: cn(
          "block w-full min-h-16 h-24 max-h-64 bg-transparent p-2 text-foreground outline-none resize-y placeholder:text-muted-foreground",
          textareaClassName
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "px-2 py-1.5 border-t border-border flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 flex items-center gap-1.5", children: toolbarStart }),
      toolbarEnd,
      isRunning ? /* @__PURE__ */ jsx(
        Button,
        {
          size: "icon",
          className: "h-7 w-7 shrink-0 rounded-control",
          onClick: onStop,
          title: "Stop",
          "aria-label": "Stop",
          children: stopIcon
        }
      ) : /* @__PURE__ */ jsx(
        Button,
        {
          size: "icon",
          className: "h-7 w-7 shrink-0 rounded-control",
          onClick: onSend,
          disabled: isSendDisabled,
          title: "Send",
          "aria-label": "Send",
          children: sendIcon
        }
      )
    ] })
  ] }) });
}
var chatSessionGutterClass = "w-3.5 shrink-0 flex justify-center";
var markerClass = {
  default: "bg-muted-foreground",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  pending: "bg-transparent border-[1.5px] border-muted-foreground"
};
function ChatSessionActivityRow({
  status = "default",
  marker,
  children,
  actions,
  meta,
  footer,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex gap-2", className), children: [
    /* @__PURE__ */ jsx("span", { className: cn(chatSessionGutterClass, "pt-[7px]"), "aria-hidden": true, children: marker ?? /* @__PURE__ */ jsx(
      "span",
      {
        className: cn("w-1.5 h-1.5 rounded-full", markerClass[status])
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "whitespace-pre-wrap break-words",
            status === "error" && "text-destructive",
            status === "warning" && "text-warning"
          ),
          children
        }
      ),
      actions,
      meta && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: meta }),
      footer
    ] })
  ] });
}
function ChatSessionActivitySubLine({
  elbow,
  children,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex gap-2 text-muted-foreground", className), children: [
    /* @__PURE__ */ jsx("span", { className: "shrink-0 select-none text-border", "aria-hidden": true, children: elbow ?? "\u2514" }),
    /* @__PURE__ */ jsx("span", { className: "min-w-0 break-words", children })
  ] });
}
function ChatSessionPromptRow({
  children,
  caret,
  meta,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("-mx-3 flex gap-2 bg-muted/70 px-3 py-2", className),
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              chatSessionGutterClass,
              "select-none font-semibold text-primary"
            ),
            "aria-hidden": true,
            children: caret ?? "\u276F"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1 whitespace-pre-wrap break-words", children }),
        meta && /* @__PURE__ */ jsx("span", { className: "shrink-0 self-start text-muted-foreground", children: meta })
      ]
    }
  );
}
function RingSpinner() {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "h-3 w-3 rounded-full border-2 border-muted border-t-primary animate-spin motion-reduce:animate-none",
      role: "status",
      "aria-label": "Working"
    }
  );
}
function ChatSessionProgressLine({
  children,
  spinner,
  elapsed,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2 text-muted-foreground",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: chatSessionGutterClass, children: spinner ?? /* @__PURE__ */ jsx(RingSpinner, {}) }),
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1", children }),
        elapsed && /* @__PURE__ */ jsx("span", { className: "shrink-0 tabular-nums", children: elapsed })
      ]
    }
  );
}
function ChatSessionDisclosure({
  label,
  meta,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  chevron,
  className,
  contentClassName
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React23.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const toggle = () => {
    const next = !isOpen;
    if (open === void 0) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "overflow-hidden rounded-md border border-border bg-accent/40",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: toggle,
            "aria-expanded": isOpen,
            className: "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground",
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "shrink-0 select-none transition-transform",
                    !chevron && isOpen && "rotate-90"
                  ),
                  "aria-hidden": true,
                  children: chevron ?? "\u25B8"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: label }),
              meta && /* @__PURE__ */ jsx("span", { className: "shrink-0 tabular-nums text-muted-foreground", children: meta })
            ]
          }
        ),
        isOpen && /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "overflow-x-auto border-t border-border px-2.5 py-2",
              contentClassName
            ),
            children
          }
        )
      ]
    }
  );
}
var indicatorClass = {
  running: "bg-primary animate-pulse motion-reduce:animate-none",
  "needs-input": "bg-warning",
  success: "bg-success",
  error: "bg-destructive",
  queued: "bg-transparent border-[1.5px] border-muted-foreground"
};
function ChatSessionTaskRow({
  status = "queued",
  indicator,
  name,
  description,
  meta,
  onClick,
  className
}) {
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { className: "flex w-3.5 shrink-0 justify-center", "aria-hidden": true, children: indicator ?? /* @__PURE__ */ jsx(
      "span",
      {
        className: cn("h-1.5 w-1.5 rounded-full", indicatorClass[status])
      }
    ) }),
    /* @__PURE__ */ jsx("span", { className: "shrink-0 font-medium", children: name }),
    description && /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-muted-foreground", children: description }),
    meta && /* @__PURE__ */ jsx("span", { className: "shrink-0 tabular-nums text-muted-foreground", children: meta })
  ] });
  const rowClass = cn(
    "flex w-full items-center gap-2 rounded-control px-1.5 py-1 text-left",
    onClick && "hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring",
    className
  );
  if (onClick) {
    return /* @__PURE__ */ jsx("button", { type: "button", onClick, className: rowClass, children: content });
  }
  return /* @__PURE__ */ jsx("div", { className: rowClass, children: content });
}
function ChatSessionTaskGroup({
  heading,
  children,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-1", className), children: [
    heading && /* @__PURE__ */ jsx("div", { className: "font-semibold", children: heading }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-0.5", children })
  ] });
}
function ChatSessionStatusBar({
  start,
  end,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-3 px-3 py-1.5 text-muted-foreground",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: start }),
        end && /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center gap-3", children: end })
      ]
    }
  );
}
function ChatSessionContextChip({
  icon,
  onDismiss,
  dismissLabel = "Remove context",
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex min-h-[26px] items-center gap-1.5 border border-border bg-muted/40 px-1.5 text-meta",
        className
      ),
      ...props,
      children: [
        icon ? /* @__PURE__ */ jsx("span", { className: "flex shrink-0 items-center text-muted-foreground [&_svg]:size-3", children: icon }) : null,
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children }),
        onDismiss ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            "aria-label": dismissLabel,
            className: "shrink-0 px-1 text-muted-foreground hover:text-foreground",
            children: "\xD7"
          }
        ) : null
      ]
    }
  );
}
var CitationList = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx("ul", { ref, className: cn("flex flex-col", className), ...props, children }));
CitationList.displayName = "CitationList";
var CitationRow = React23.forwardRef(
  ({ kind, source, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "li",
    {
      ref,
      className: cn("flex min-h-[26px] items-center gap-2 py-0.5", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "shrink-0 border border-border px-1 text-meta text-muted-foreground", children: kind }),
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children }),
        source != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-meta text-muted-foreground", children: source }) : null
      ]
    }
  )
);
CitationRow.displayName = "CitationRow";
var ClarifyCard = React23.forwardRef(
  ({
    step,
    waiting,
    question,
    options,
    value,
    onSelect,
    actions,
    footnote,
    className,
    ...props
  }, ref) => {
    const name = React23.useId();
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: cn("flex flex-col overflow-hidden border border-border bg-card", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex h-6 shrink-0 items-center gap-2 border-b border-border bg-muted/40 px-2 text-meta", children: [
            /* @__PURE__ */ jsx("span", { className: "shrink-0 font-medium", children: "question" }),
            step != null ? /* @__PURE__ */ jsx("span", { className: "truncate text-muted-foreground", children: step }) : null,
            /* @__PURE__ */ jsx("span", { className: "flex-1" }),
            waiting != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-muted-foreground", children: waiting }) : null
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-2", children: [
            /* @__PURE__ */ jsx("p", { children: question }),
            /* @__PURE__ */ jsx("div", { role: "radiogroup", className: "flex flex-col gap-1", children: options.map((o) => {
              const checked = value === o.value;
              return /* @__PURE__ */ jsxs(
                "label",
                {
                  className: cn(
                    "flex min-h-[30px] cursor-pointer items-center gap-2 border px-2 py-1",
                    checked ? "border-primary/40 bg-primary/10" : "border-border",
                    o.disabled && "cursor-not-allowed opacity-50"
                  ),
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name,
                        value: o.value,
                        checked,
                        disabled: o.disabled,
                        onChange: () => onSelect?.(o.value),
                        className: "sr-only"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": true,
                        className: cn(
                          "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                          checked ? "border-primary" : "border-muted-foreground"
                        ),
                        children: checked ? /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-primary" }) : null
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children: o.label }),
                    o.detail != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 font-mono text-meta text-muted-foreground", children: o.detail }) : null
                  ]
                },
                o.value
              );
            }) }),
            actions || footnote != null ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              actions,
              footnote != null ? /* @__PURE__ */ jsx("span", { className: "flex-1 text-meta text-muted-foreground", children: footnote }) : null
            ] }) : null
          ] })
        ]
      }
    );
  }
);
ClarifyCard.displayName = "ClarifyCard";
var ContextBar = React23.forwardRef(
  ({ counters, hint, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex h-7 shrink-0 items-center gap-3 border-t border-border px-2 text-meta",
        className
      ),
      ...props,
      children: [
        children ? /* @__PURE__ */ jsx("div", { className: "flex min-w-0 shrink-0 items-center gap-2", children }) : null,
        counters ? /* @__PURE__ */ jsx("div", { className: "flex min-w-0 flex-1 items-center gap-3 text-muted-foreground", children: counters }) : /* @__PURE__ */ jsx("span", { className: "flex-1" }),
        hint != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-muted-foreground", children: hint }) : null
      ]
    }
  )
);
ContextBar.displayName = "ContextBar";
var DiagnosisCard = React23.forwardRef(({ code, attempted, target, actions, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  "div",
  {
    ref,
    className: cn("flex flex-col gap-2 border border-destructive/40 bg-card p-2", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-meta", children: [
        /* @__PURE__ */ jsx("span", { className: "shrink-0 font-medium text-destructive", children: "diagnosis" }),
        /* @__PURE__ */ jsx("span", { className: "truncate font-mono text-muted-foreground", children: code })
      ] }),
      children != null ? /* @__PURE__ */ jsx("div", { children }) : null,
      attempted != null || target != null ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 border border-border bg-muted/40 p-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: "what was tried" }),
        attempted != null ? /* @__PURE__ */ jsx("code", { className: "whitespace-pre-wrap break-all font-mono text-meta", children: attempted }) : null,
        target != null ? /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: target }) : null
      ] }) : null,
      actions ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: actions }) : null
    ]
  }
));
DiagnosisCard.displayName = "DiagnosisCard";
var OP_SIGN = { add: "+", remove: "\u2212", change: "~" };
var OP_CLASS = {
  add: "text-success",
  remove: "text-destructive",
  change: "text-warning"
};
var DiffList = React23.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsx("ul", { ref, className: cn("flex flex-col", className), ...props, children })
);
DiffList.displayName = "DiffList";
var DiffRow = React23.forwardRef(
  ({ op = "add", kind, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "li",
    {
      ref,
      className: cn("flex items-baseline gap-2 py-0.5 text-meta", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: cn("w-3 shrink-0 text-center font-mono", OP_CLASS[op]), children: OP_SIGN[op] }),
        kind != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-muted-foreground", children: kind }) : null,
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1", children })
      ]
    }
  )
);
DiffRow.displayName = "DiffRow";
var DivergingBar = React23.forwardRef(
  ({
    data,
    max,
    labelWidth = 104,
    positiveColor = "var(--color-success)",
    negativeColor = "var(--color-destructive)",
    caption,
    className,
    ...props
  }, ref) => {
    const ceiling = max ?? (Math.max(...data.map((d) => Math.abs(d.value)), 0) || 1);
    return /* @__PURE__ */ jsxs("div", { ref, className: cn("flex flex-col gap-1", className), ...props, children: [
      caption != null ? /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: caption }) : null,
      data.map((d, i) => {
        const positive = d.value >= 0;
        const width = `${Math.abs(d.value) / ceiling * 50}%`;
        return /* @__PURE__ */ jsxs("div", { className: "flex h-4 items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "shrink-0 truncate text-meta text-muted-foreground",
              style: { width: labelWidth },
              children: d.label
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "relative flex min-w-0 flex-1 items-center", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": true,
                className: "absolute left-1/2 h-4 w-px -translate-x-1/2 bg-border"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "flex w-1/2 justify-end", children: !positive ? /* @__PURE__ */ jsx(
              "span",
              {
                title: `${d.label}: ${d.display ?? d.value}`,
                className: "h-2.5 rounded-s-[4px]",
                style: { width, background: negativeColor }
              }
            ) : null }),
            /* @__PURE__ */ jsx("span", { className: "flex w-1/2 justify-start", children: positive ? /* @__PURE__ */ jsx(
              "span",
              {
                title: `${d.label}: ${d.display ?? d.value}`,
                className: "h-2.5 rounded-e-[4px]",
                style: { width, background: positiveColor }
              }
            ) : null })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "w-8 shrink-0 text-right text-meta tabular-nums", children: d.display ?? (d.value > 0 ? `+${d.value}` : d.value) })
        ] }, i);
      })
    ] });
  }
);
DivergingBar.displayName = "DivergingBar";
var EmissionHeader = React23.forwardRef(({ kind, template, citation, note, actions, className, ...props }, ref) => /* @__PURE__ */ jsxs(
  "div",
  {
    ref,
    className: cn(
      "flex h-6 shrink-0 items-center gap-2 border-b border-border bg-muted/40 px-2 text-meta",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "shrink-0 font-medium", children: kind }),
      template != null ? /* @__PURE__ */ jsx("span", { className: "truncate font-mono text-muted-foreground", children: template }) : null,
      note != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 border border-border px-1 text-muted-foreground", children: note }) : null,
      /* @__PURE__ */ jsx("span", { className: "flex-1" }),
      citation != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-muted-foreground", children: citation }) : null,
      actions ? /* @__PURE__ */ jsx("span", { className: "flex shrink-0 items-center", children: actions }) : null
    ]
  }
));
EmissionHeader.displayName = "EmissionHeader";
var EmissionCard = React23.forwardRef(
  ({
    kind,
    template,
    citation,
    note,
    actions,
    showHeader = true,
    className,
    children,
    ...props
  }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-kind": kind,
      className: cn("flex flex-col overflow-hidden border border-border bg-card", className),
      ...props,
      children: [
        showHeader ? /* @__PURE__ */ jsx(
          EmissionHeader,
          {
            kind,
            template,
            citation,
            note,
            actions
          }
        ) : null,
        children
      ]
    }
  )
);
EmissionCard.displayName = "EmissionCard";
var CitationMarker = React23.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  "sup",
  {
    ref,
    className: cn("px-0.5 align-super text-[0.7em] text-primary", className),
    ...props,
    children
  }
));
CitationMarker.displayName = "CitationMarker";
var EmptyState = React23.forwardRef(
  ({ icon, title, description, actions, locks, className, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex flex-col items-center justify-center gap-2 p-6 text-center",
        className
      ),
      ...props,
      children: [
        icon ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: icon }) : null,
        /* @__PURE__ */ jsx("h3", { className: "font-medium", children: title }),
        description != null ? /* @__PURE__ */ jsx("p", { className: "max-w-prose text-muted-foreground", children: description }) : null,
        actions ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-center gap-1.5 pt-1", children: actions }) : null,
        locks ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-center gap-1.5 pt-1", children: locks }) : null
      ]
    }
  )
);
EmptyState.displayName = "EmptyState";
var EmptyStateLock = React23.forwardRef(({ icon, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  "span",
  {
    ref,
    className: cn(
      "inline-flex h-6 items-center gap-1.5 border border-dashed border-border px-2 text-meta text-muted-foreground [&_svg]:size-3",
      className
    ),
    ...props,
    children: [
      icon,
      children
    ]
  }
));
EmptyStateLock.displayName = "EmptyStateLock";
var ErrorBoundary = class extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center h-full w-full", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center", children: [
        /* @__PURE__ */ jsx(Frown, { className: "mr-1 h-4" }),
        "Oops ! something went wrong."
      ] }) });
    }
    return this.props.children;
  }
};
var FilterBar = React23.forwardRef(
  ({ summary, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex h-[30px] shrink-0 items-center gap-1.5 border-b border-border px-2",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx("span", { className: "flex-1" }),
        summary != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-meta text-muted-foreground", children: summary }) : null
      ]
    }
  )
);
FilterBar.displayName = "FilterBar";
var FilterChip = React23.forwardRef(
  ({ label, value, active, className, ...props }, ref) => /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      type: "button",
      variant: "outline",
      size: "xs",
      "data-active": active || void 0,
      className: cn(
        "h-[22px] gap-1 px-1.5 font-normal",
        active && "border-primary/40 text-primary",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: cn(value != null && "text-muted-foreground"), children: label }),
        value != null ? /* @__PURE__ */ jsx("span", { className: "truncate", children: value }) : null,
        /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "text-muted-foreground", children: "\u25BE" })
      ]
    }
  )
);
FilterChip.displayName = "FilterChip";
var HeatStrip = React23.forwardRef(
  ({ cells, states, ticks, cellSize = 14, className, ...props }, ref) => {
    const byKey = React23.useMemo(
      () => new Map(states.map((s) => [s.key, s])),
      [states]
    );
    return /* @__PURE__ */ jsxs("div", { ref, className: cn("flex flex-col gap-1.5", className), ...props, children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: cells.map((c, i) => {
        const s = byKey.get(c.state);
        return /* @__PURE__ */ jsx(
          "span",
          {
            title: `${c.at} \xB7 ${s?.label ?? c.state}${c.detail ? ` \xB7 ${c.detail}` : ""}`,
            className: cn("shrink-0 rounded-[2px]", s?.hollow && "border"),
            style: {
              width: cellSize,
              height: cellSize,
              background: s?.hollow ? "transparent" : s?.color ?? "var(--color-muted)",
              borderColor: s?.hollow ? s.color ?? "var(--color-border)" : void 0
            }
          },
          i
        );
      }) }),
      ticks?.length ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", "aria-hidden": true, children: cells.map((_, i) => {
        const tick = ticks.find((t) => t.at === i);
        return /* @__PURE__ */ jsx(
          "span",
          {
            className: "shrink-0 text-meta tabular-nums text-muted-foreground",
            style: { width: cellSize },
            children: tick ? tick.label : ""
          },
          i
        );
      }) }) : null,
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-meta", children: states.map((s) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            className: cn("size-2.5 shrink-0 rounded-[2px]", s.hollow && "border"),
            style: {
              background: s.hollow ? "transparent" : s.color ?? "var(--color-muted)",
              borderColor: s.hollow ? s.color ?? "var(--color-border)" : void 0
            }
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: s.label })
      ] }, s.key)) })
    ] });
  }
);
HeatStrip.displayName = "HeatStrip";
function Swatch({ kind = "dot", color }) {
  const style = { color };
  if (kind === "dot")
    return /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "size-2 shrink-0 rounded-full bg-current"
      }
    );
  if (kind === "ring")
    return /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "size-2 shrink-0 rounded-full border-[1.5px] border-current"
      }
    );
  if (kind === "line")
    return /* @__PURE__ */ jsx("span", { "aria-hidden": true, style, className: "h-0.5 w-4 shrink-0 bg-current" });
  if (kind === "dashed")
    return /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "h-0 w-4 shrink-0 border-t-[1.5px] border-dashed border-current"
      }
    );
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "aria-hidden": true,
      style,
      className: "w-4 shrink-0 overflow-visible",
      viewBox: "0 0 16 6",
      height: "6",
      fill: "none",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M0 3h11", stroke: "currentColor", strokeWidth: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M10 0l6 3-6 3z", fill: "currentColor" })
      ]
    }
  );
}
var Legend = React23.forwardRef(
  ({ orientation = "row", className, children, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: "list",
      className: cn(
        "flex gap-x-3 gap-y-1 text-meta",
        orientation === "row" ? "flex-wrap items-center" : "flex-col",
        className
      ),
      ...props,
      children
    }
  )
);
Legend.displayName = "Legend";
var LegendItem = React23.forwardRef(
  ({ kind, color, label, count, className, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      role: "listitem",
      className: cn("flex min-w-0 items-center gap-1.5", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(Swatch, { kind, color }),
        /* @__PURE__ */ jsx("span", { className: "truncate", children: label }),
        count != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-muted-foreground", children: count }) : null
      ]
    }
  )
);
LegendItem.displayName = "LegendItem";
var MenuItem = ({
  label,
  icon: Icon,
  shortcut,
  children,
  className,
  level = 0,
  href,
  onClick
}) => {
  const hasChildren = children && children.length > 0;
  const ButtonOrLink = href ? "a" : "button";
  const clickTrigger = href ? { href } : { onClick };
  return /* @__PURE__ */ jsxs("li", { className: "relative group/item", children: [
    /* @__PURE__ */ jsxs(
      ButtonOrLink,
      {
        ...clickTrigger,
        className: cn(
          "flex w-full items-center justify-between  px-4 py-2 ",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none",
          className,
          level === 0 ? "font-medium" : "font-normal"
          // "group-hover/item:bg-accent/50"
        ),
        role: hasChildren ? "menuitem" : void 0,
        "aria-haspopup": hasChildren ? "true" : void 0,
        "aria-expanded": hasChildren ? "true" : void 0,
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: label })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            shortcut && /* @__PURE__ */ jsx("kbd", { className: "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100", children: shortcut }),
            hasChildren && /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
          ] })
        ]
      }
    ),
    hasChildren && /* @__PURE__ */ jsx(
      "ul",
      {
        className: cn(
          "absolute min-w-[240px] border p-1  bg-card text-card-foreground  shadow-md",
          "invisible opacity-0 translate-x-2",
          "group-hover/item:visible group-hover/item:opacity-100 group-hover/item:translate-x-0",
          "transition-all duration-150 ease-in-out",
          level === 0 ? "left-full top-0" : "left-full top-0"
        ),
        style: {
          zIndex: 50 + level
        },
        role: "menu",
        children: children.map((item) => /* @__PURE__ */ jsx(MenuItem, { ...item, level: level + 1 }, item.id))
      }
    )
  ] });
};
var MetricTile = React23.forwardRef(
  ({ label, value, caption, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn("flex flex-col gap-0.5 border border-border bg-card p-2", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "truncate text-meta text-muted-foreground", children: label }),
        /* @__PURE__ */ jsx("span", { className: "text-base font-medium leading-tight", children: value }),
        caption != null ? /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: caption }) : null,
        children
      ]
    }
  )
);
MetricTile.displayName = "MetricTile";
var MetricGrid = React23.forwardRef(
  ({ minTileWidth = 120, className, style, children, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("grid gap-1.5", className),
      style: {
        gridTemplateColumns: `repeat(auto-fit, minmax(${minTileWidth}px, 1fr))`,
        ...style
      },
      ...props,
      children
    }
  )
);
MetricGrid.displayName = "MetricGrid";
var NavVerticalItems = (props) => /* @__PURE__ */ jsx(NavItems, { ...props, orientation: "vertical" });
var NavVertical = ({
  className = "",
  top,
  topNavItems,
  middle,
  bottom,
  bottomNavItems
}) => {
  return /* @__PURE__ */ jsx(
    NavBase,
    {
      orientation: "vertical",
      className: `w-[45px]  h-full  flex flex-col items-center ${className}`,
      sections: {
        start: top || topNavItems ? {
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            top,
            topNavItems && /* @__PURE__ */ jsx(NavVerticalItems, { items: topNavItems })
          ] })
        } : void 0,
        center: middle ? { content: middle } : void 0,
        end: bottom || bottomNavItems ? {
          content: /* @__PURE__ */ jsxs(Fragment, { children: [
            bottomNavItems && /* @__PURE__ */ jsx(NavVerticalItems, { items: bottomNavItems }),
            bottom
          ] })
        } : void 0
      }
    }
  );
};
var NestedMenu = (props) => {
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: cn("w-[220px] !py-0 border  bg-card text-card-foreground shadow-sm", props.className),
      role: "menubar",
      children: /* @__PURE__ */ jsx("ul", { className: "space-y-0.5 p-0", role: "menu", children: props.menuItems.map((item) => /* @__PURE__ */ jsx(MenuItem, { ...item, className: "px-3 py-1.5" }, item.id)) })
    }
  );
};
function PanelContent({
  title,
  titleText,
  children,
  className,
  headerClassName,
  bodyClassName,
  footerContent,
  footerClassName,
  headerActions,
  actionsOnHover = false
}) {
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxs(Card, { className: cn("flex h-full min-h-0 flex-col border-none", className), children: [
    /* @__PURE__ */ jsxs(
      CardHeader,
      {
        className: cn(
          "group/panel-header flex h-[35px] shrink-0 flex-row items-center gap-2",
          "space-y-0 border-b py-0 pr-1",
          headerClassName
        ),
        children: [
          title && /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate font-bold leading-none", children: title }),
          titleText && /* @__PURE__ */ jsx("h4", { className: "min-w-0 truncate font-bold leading-none", children: titleText }),
          headerActions && headerActions.length > 0 && /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "ml-auto flex shrink-0 items-center gap-1 pl-2",
                actionsOnHover && "opacity-0 transition-opacity group-hover/panel-header:opacity-100 focus-within:opacity-100 has-[[data-state=open]]:opacity-100"
              ),
              children: /* @__PURE__ */ jsx(NavHorizontalItems, { items: headerActions })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(CardContent, { className: cn("min-h-0 flex-1 overflow-y-auto", bodyClassName), children }),
    footerContent ? /* @__PURE__ */ jsx(CardFooter, { className: cn("shrink-0 border-t", footerClassName), children: footerContent }) : null
  ] }) }) });
}
function PanelStack({
  sections,
  headerHeight = 35,
  withHandle = false,
  className,
  headerClassName,
  bodyClassName
}) {
  const groupRef = React23.useRef(null);
  const refs = React23.useRef({});
  const [collapsed, setCollapsed] = React23.useState(
    () => Object.fromEntries(sections.map((s) => [s.id, !!s.defaultCollapsed]))
  );
  const didInit = React23.useRef(false);
  React23.useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const targets = sections.filter((s) => s.defaultCollapsed);
    const expanded = sections.filter((s) => !s.defaultCollapsed);
    if (targets.length === 0 || expanded.length === 0) return;
    const group = groupRef.current;
    const probe = refs.current[sections[0].id]?.getSize();
    if (!group || !probe || probe.asPercentage <= 0) {
      for (const s of targets) refs.current[s.id]?.collapse();
      return;
    }
    const groupPx = probe.inPixels / probe.asPercentage * 100;
    const collapsedPct = headerHeight / groupPx * 100;
    const layout = group.getLayout();
    const next = { ...layout };
    let freed = 0;
    for (const s of targets) {
      const current = layout[s.id] ?? 0;
      if (current <= collapsedPct) continue;
      freed += current - collapsedPct;
      next[s.id] = collapsedPct;
    }
    if (freed === 0) return;
    const total = expanded.reduce((sum, s) => sum + (layout[s.id] ?? 0), 0);
    for (const s of expanded) {
      const share = total > 0 ? (layout[s.id] ?? 0) / total : 1 / expanded.length;
      next[s.id] = (layout[s.id] ?? 0) + freed * share;
    }
    for (const s of targets) refs.current[s.id]?.collapse();
    group.setLayout(next);
  }, []);
  const toggle = (id) => {
    const ref = refs.current[id];
    if (!ref) return;
    if (!ref.isCollapsed()) {
      ref.collapse();
      return;
    }
    ref.expand();
    if (!ref.isCollapsed()) return;
    const group = groupRef.current;
    if (!group) return;
    const layout = group.getLayout();
    const donor = Object.entries(layout).filter(([panelId]) => panelId !== id && !collapsed[panelId]).sort((a, b) => b[1] - a[1])[0];
    if (!donor) return;
    const [donorId, donorPct] = donor;
    const share = donorPct / 2;
    group.setLayout({
      ...layout,
      [id]: (layout[id] ?? 0) + share,
      [donorId]: donorPct - share
    });
  };
  return (
    // Header actions are nav items, and those carry tooltips — provide the
    // context here so a `PanelStack` works outside an app shell too. Nesting
    // inside an app's own provider is harmless.
    /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
      ResizablePanelGroup,
      {
        groupRef,
        orientation: "vertical",
        className: cn("h-full w-full", className),
        children: sections.map((section, index) => {
          const Icon = section.icon;
          const isCollapsed = collapsed[section.id];
          const flush = index > 0 && (isCollapsed || collapsed[sections[index - 1].id]);
          return /* @__PURE__ */ jsxs(React23.Fragment, { children: [
            index > 0 && /* @__PURE__ */ jsx(
              ResizableHandle,
              {
                withHandle: withHandle && !flush,
                className: cn(
                  flush && "pointer-events-none bg-border aria-[orientation=horizontal]:h-px aria-[orientation=vertical]:w-px"
                )
              }
            ),
            /* @__PURE__ */ jsxs(
              ResizablePanel,
              {
                id: section.id,
                collapsible: true,
                collapsedSize: `${headerHeight}px`,
                minSize: section.minSize ?? `${headerHeight + 64}px`,
                defaultSize: section.defaultSize,
                panelRef: (ref) => {
                  refs.current[section.id] = ref;
                },
                onResize: (size) => {
                  const next = size.inPixels <= headerHeight + 1;
                  setCollapsed(
                    (prev) => prev[section.id] === next ? prev : { ...prev, [section.id]: next }
                  );
                },
                className: "flex flex-col overflow-hidden",
                children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: { height: headerHeight },
                      className: cn(
                        "group/panel-header flex shrink-0 items-center pr-2 text-muted-foreground",
                        headerClassName
                      ),
                      children: [
                        /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggle(section.id),
                            "aria-expanded": !isCollapsed,
                            className: cn(
                              "flex h-full min-w-0 flex-1 items-center gap-1 pl-2 text-left",
                              "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            ),
                            children: [
                              isCollapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5 shrink-0" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5 shrink-0" }),
                              Icon && /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }),
                              typeof section.title === "string" ? /* @__PURE__ */ jsx("span", { className: "truncate text-meta font-semibold uppercase tracking-wide", children: section.title }) : (
                                // Custom node: rendered as-is so the consumer owns the
                                // styling (icon, casing, colour, badges…).
                                /* @__PURE__ */ jsx("span", { className: "flex min-w-0 flex-1 items-center", children: section.title })
                              )
                            ]
                          }
                        ),
                        section.headerActions && section.headerActions.length > 0 && /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: cn(
                              "flex items-center gap-1 pl-2",
                              // Quiet at rest: the actions appear on hover over the
                              // header, and never hide while one of them holds focus
                              // or has its menu open — so the keyboard path stays
                              // visible.
                              (section.actionsOnHover ?? true) && "opacity-0 transition-opacity group-hover/panel-header:opacity-100 focus-within:opacity-100 has-[[data-state=open]]:opacity-100"
                            ),
                            children: /* @__PURE__ */ jsx(NavHorizontalItems, { items: section.headerActions })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn("min-h-0 flex-1 overflow-auto", bodyClassName),
                      hidden: isCollapsed,
                      children: section.content
                    }
                  )
                ]
              }
            )
          ] }, section.id);
        })
      }
    ) })
  );
}
var PropertyList = React23.forwardRef(
  ({ labelWidth = 78, className, style, children, ...props }, ref) => /* @__PURE__ */ jsx(
    "dl",
    {
      ref,
      className: cn("flex flex-col", className),
      style: {
        "--property-label-width": typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth,
        ...style
      },
      ...props,
      children
    }
  )
);
PropertyList.displayName = "PropertyList";
var PropertyRow = React23.forwardRef(
  ({ label, mono, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn("flex items-baseline gap-2 py-1", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx("dt", { className: "shrink-0 truncate text-meta text-muted-foreground [width:var(--property-label-width,78px)]", children: label }),
        /* @__PURE__ */ jsx("dd", { className: cn("min-w-0 flex-1", mono && "font-mono text-meta"), children })
      ]
    }
  )
);
PropertyRow.displayName = "PropertyRow";
var ProposalCard = React23.forwardRef(
  ({
    title,
    source,
    evidence,
    evidenceTitle,
    evidenceMeta,
    consequence,
    actions,
    className,
    children,
    ...props
  }, ref) => /* @__PURE__ */ jsxs("div", { ref, className: cn("flex flex-col gap-3", className), ...props, children: [
    /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium", children: title }),
        source != null ? /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: source }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border border-border bg-muted/30 p-2", children })
    ] }),
    evidence ? /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium", children: evidenceTitle }),
        evidenceMeta != null ? /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: evidenceMeta }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden border border-border", children: evidence })
    ] }) : null,
    consequence != null ? /* @__PURE__ */ jsx("p", { className: "text-meta text-muted-foreground", children: consequence }) : null,
    actions ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: actions }) : null
  ] })
);
ProposalCard.displayName = "ProposalCard";
var DotRating = React23.forwardRef(
  ({ value, max = 3, onChange, readOnly, label, className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: readOnly ? "img" : "radiogroup",
      "aria-label": label ?? `weight ${value} of ${max}`,
      className: cn("inline-flex items-center gap-1", className),
      ...props,
      children: Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const on = n <= value;
        if (readOnly) {
          return /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": true,
              className: cn(
                "size-2.5 rounded-full border",
                on ? "border-primary bg-primary" : "border-muted-foreground bg-transparent"
              )
            },
            n
          );
        }
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": value === n,
            "aria-label": String(n),
            onClick: () => onChange?.(n),
            className: cn(
              "size-2.5 cursor-pointer rounded-full border",
              on ? "border-primary bg-primary" : "border-muted-foreground bg-transparent"
            )
          },
          n
        );
      })
    }
  )
);
DotRating.displayName = "DotRating";
var RatingControl = React23.forwardRef(
  ({
    verdict,
    onVerdictChange,
    weight,
    onWeightChange,
    maxWeight = 3,
    refines,
    by,
    className,
    children,
    ...props
  }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn("flex flex-col gap-2 border border-border bg-card p-2", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-meta", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Your verdict" }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "becomes a Learning" }),
          /* @__PURE__ */ jsx("span", { className: "flex-1" }),
          by
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { role: "radiogroup", className: "inline-flex border border-border", children: ["appreciate", "depreciate"].map((v) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": verdict === v,
              onClick: () => onVerdictChange?.(v),
              className: cn(
                "h-[22px] px-2 text-meta capitalize",
                verdict === v ? v === "appreciate" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground" : "text-muted-foreground hover:bg-accent"
              ),
              children: v
            },
            v
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: "weight" }),
            /* @__PURE__ */ jsx(DotRating, { value: weight, max: maxWeight, onChange: onWeightChange }),
            /* @__PURE__ */ jsx("span", { className: "text-meta tabular-nums", children: weight })
          ] }),
          refines != null ? /* @__PURE__ */ jsxs("span", { className: "text-meta text-muted-foreground", children: [
            "refines ",
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: refines })
          ] }) : null
        ] }),
        children
      ]
    }
  )
);
RatingControl.displayName = "RatingControl";
var RepairNote = React23.forwardRef(
  ({ from, to, className, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex flex-wrap items-center gap-1 py-0.5 pl-4 text-meta text-muted-foreground",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "font-mono line-through decoration-muted-foreground/60", children: from }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u2192" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-foreground", children: to })
      ]
    }
  )
);
RepairNote.displayName = "RepairNote";
var RetryNote = React23.forwardRef(
  ({ attempt, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex flex-wrap items-baseline gap-1.5 py-0.5 pl-4 text-meta text-muted-foreground",
        className
      ),
      ...props,
      children: [
        attempt != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 font-medium text-warning", children: attempt }) : null,
        /* @__PURE__ */ jsx("span", { children })
      ]
    }
  )
);
RetryNote.displayName = "RetryNote";
function OptionRow({ option }) {
  const Icon = option.icon;
  return /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 flex-col gap-0.5", children: [
    /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
      Icon && /* @__PURE__ */ jsx(Icon, { size: 16, className: "shrink-0" }),
      /* @__PURE__ */ jsx("span", { className: "truncate", children: option.label }),
      option.badge != null && /* @__PURE__ */ jsx("span", { className: "ml-auto pl-2", children: option.badge })
    ] }),
    option.description != null && /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: option.description })
  ] });
}
function RichSelect({
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
  triggerClassName,
  contentClassName,
  className
}) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedOptions = selectedValues.map((v) => options.find((o) => o.value === v)).filter((o) => o != null);
  const toggle = (optionValue) => {
    const next = selectedValues.includes(optionValue) ? selectedValues.filter((v) => v !== optionValue) : [...selectedValues, optionValue];
    onChange(next);
  };
  const triggerLabel = (() => {
    if (renderValue) return renderValue(selectedOptions);
    if (selectedOptions.length === 0) {
      return placeholder ?? label ?? "Select\u2026";
    }
    if (selectedOptions.length === 1) {
      const only = selectedOptions[0];
      const Icon = only.icon;
      return /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
        Icon && /* @__PURE__ */ jsx(Icon, { size: 16, className: "shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "truncate", children: only.label })
      ] });
    }
    return `${label ?? "Selected"}: ${selectedOptions.length}`;
  })();
  const trigger = /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      disabled,
      className: cn(
        "ring-offset-background justify-between gap-2",
        triggerClassName,
        className
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: "flex min-w-0 items-center gap-2", children: triggerLabel }),
        /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 opacity-60" })
      ]
    }
  );
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    tooltip != null ? /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { delayDuration: 0, children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: trigger }) }),
      /* @__PURE__ */ jsx(TooltipContent, { side: tooltipSide, children: tooltip })
    ] }) }) : /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsxs(
      DropdownMenuContent,
      {
        align,
        side,
        sideOffset,
        className: cn("min-w-[14rem] bg-popover", contentClassName),
        children: [
          label && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { children: label }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {})
          ] }),
          multiple ? options.map((option) => {
            const selected = selectedValues.includes(option.value);
            return /* @__PURE__ */ jsx(
              DropdownMenuCheckboxItem,
              {
                checked: selected,
                disabled: option.disabled,
                onSelect: (e) => e.preventDefault(),
                onCheckedChange: () => toggle(option.value),
                children: renderOption ? renderOption(option, { selected }) : /* @__PURE__ */ jsx(OptionRow, { option })
              },
              option.value
            );
          }) : /* @__PURE__ */ jsx(
            DropdownMenuRadioGroup,
            {
              value: selectedValues[0],
              onValueChange: (v) => onChange(v),
              children: options.map((option) => {
                const selected = selectedValues.includes(option.value);
                return /* @__PURE__ */ jsx(
                  DropdownMenuRadioItem,
                  {
                    value: option.value,
                    disabled: option.disabled,
                    children: renderOption ? renderOption(option, { selected }) : /* @__PURE__ */ jsx(OptionRow, { option })
                  },
                  option.value
                );
              })
            }
          )
        ]
      }
    )
  ] });
}
var SearchInput = ({
  value,
  onChange,
  className,
  inputSize = "default",
  placeholder = "Search...",
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type: "text",
      value,
      onChange: (e) => onChange(e.target.value),
      placeholder,
      className: cn(
        "flex w-full rounded-control border border-input bg-background ring-offset-background",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        inputSize === "sm" ? "h-[26px] px-2 py-0 text-meta" : "h-10 px-3 py-2 text-base",
        className
      ),
      ...props
    }
  );
};
var SectionHeader = React23.forwardRef(({ icon, title, count, actions, bare, className, ...props }, ref) => /* @__PURE__ */ jsxs(
  "div",
  {
    ref,
    className: cn(
      "flex h-[35px] shrink-0 items-center gap-2 px-2",
      !bare && "border-b border-border",
      className
    ),
    ...props,
    children: [
      icon ? /* @__PURE__ */ jsx("span", { className: "flex shrink-0 items-center text-muted-foreground [&_svg]:size-3.5", children: icon }) : null,
      /* @__PURE__ */ jsx("span", { className: "flex-1 truncate font-medium", children: title }),
      count != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-meta text-muted-foreground", children: count }) : null,
      actions ? /* @__PURE__ */ jsx("span", { className: "flex shrink-0 items-center gap-1", children: actions }) : null
    ]
  }
));
SectionHeader.displayName = "SectionHeader";
var Sparkline = React23.forwardRef(
  ({
    values,
    width = 72,
    height = 20,
    color = "var(--color-data-1)",
    area,
    endMarker = true,
    label,
    className,
    ...props
  }, ref) => {
    const pad = 3;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const stepX = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
    const points = values.map((v, i) => [
      pad + i * stepX,
      height - pad - (v - min) / span * (height - pad * 2)
    ]);
    const d = points.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
    const last = points[points.length - 1];
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        width,
        height,
        viewBox: `0 0 ${width} ${height}`,
        className: cn("shrink-0 overflow-visible", className),
        role: label ? "img" : void 0,
        "aria-label": label,
        "aria-hidden": label ? void 0 : true,
        ...props,
        children: [
          area ? /* @__PURE__ */ jsx(
            "path",
            {
              d: `${d} L${last[0]} ${height} L${points[0][0]} ${height} Z`,
              fill: color,
              opacity: 0.1
            }
          ) : null,
          /* @__PURE__ */ jsx(
            "path",
            {
              d,
              fill: "none",
              stroke: color,
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          endMarker ? /* @__PURE__ */ jsx(
            "circle",
            {
              cx: last[0],
              cy: last[1],
              r: 4,
              fill: color,
              stroke: "var(--color-card)",
              strokeWidth: 2
            }
          ) : null
        ]
      }
    );
  }
);
Sparkline.displayName = "Sparkline";
function TabbedPanel({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  headerActions,
  overflow = false,
  overflowLabel = "More panels",
  keepMounted = false,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footerContent
}) {
  const [internalTab, setInternalTab] = React23__default.useState(defaultTab || tabs[0]?.value);
  const currentTab = activeTab !== void 0 ? activeTab : internalTab;
  const handleTabChange = (value) => {
    if (activeTab === void 0) {
      setInternalTab(value);
    }
    onTabChange?.(value);
  };
  const uid = React23__default.useId();
  const panelId = (value) => `${uid}-panel-${value}`;
  const items = React23__default.useMemo(
    () => tabs.map((tab) => ({
      key: tab.value,
      name: tab.name ?? (typeof tab.label === "string" ? tab.label : tab.value),
      label: tab.label,
      icon: tab.icon,
      disabled: tab.disabled
    })),
    [tabs]
  );
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxs(Card, { className: cn("flex h-full min-h-0 flex-col border rounded-none", className), children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "flex h-[30px] shrink-0 flex-row items-stretch border-b",
          headerClassName
        ),
        children: [
          /* @__PURE__ */ jsx(
            NavItems,
            {
              items,
              variant: "underline",
              selectionMode: "tabs",
              activeKey: currentTab,
              onActiveChange: handleTabChange,
              panelId,
              overflow,
              overflowLabel,
              className: "min-w-0 flex-1 gap-0",
              iconClassName: "h-3.5 w-3.5 shrink-0"
            }
          ),
          headerActions && headerActions.length > 0 && /* @__PURE__ */ jsx("div", { className: "ml-auto flex h-full shrink-0 items-center gap-1 pr-1", children: /* @__PURE__ */ jsx(NavHorizontalItems, { items: headerActions }) })
        ]
      }
    ),
    tabs.map((tab) => {
      const active = tab.value === currentTab;
      if (!keepMounted && !active) return null;
      return /* @__PURE__ */ jsx(
        "div",
        {
          id: panelId(tab.value),
          role: "tabpanel",
          "aria-label": tab.name ?? (typeof tab.label === "string" ? tab.label : tab.value),
          hidden: !active,
          className: cn("m-0 min-h-0 flex-1 overflow-y-auto", bodyClassName),
          children: tab.content
        },
        tab.value
      );
    }),
    footerContent && /* @__PURE__ */ jsx(CardFooter, { className: cn("shrink-0", footerClassName), children: footerContent })
  ] }) }) });
}
var TemplatePicker = React23.forwardRef(({ heading, options, value, onSelect, footnote, className, ...props }, ref) => /* @__PURE__ */ jsxs(
  "div",
  {
    ref,
    className: cn("flex w-full flex-col border border-border bg-card", className),
    ...props,
    children: [
      heading != null ? /* @__PURE__ */ jsx("div", { className: "flex h-6 shrink-0 items-center border-b border-border px-2 text-meta text-muted-foreground", children: heading }) : null,
      /* @__PURE__ */ jsx("div", { role: "listbox", className: "flex flex-col", children: options.map((o) => {
        const disabled = o.unavailable != null;
        const selected = value === o.id;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": selected,
            disabled,
            onClick: () => onSelect?.(o.id),
            className: cn(
              "flex h-7 items-center gap-2 px-2 text-left",
              selected && "bg-accent",
              disabled ? "cursor-not-allowed opacity-50" : "hover:bg-accent/60"
            ),
            children: [
              /* @__PURE__ */ jsx("span", { className: "w-3 shrink-0 text-primary", children: selected ? "\u2022" : "" }),
              /* @__PURE__ */ jsx("span", { className: "truncate font-mono text-meta", children: o.id }),
              /* @__PURE__ */ jsx("span", { className: "shrink-0 text-meta text-muted-foreground", children: o.kind }),
              /* @__PURE__ */ jsx("span", { className: "flex-1" }),
              /* @__PURE__ */ jsx("span", { className: "shrink-0 truncate text-meta text-muted-foreground", children: o.unavailable ?? o.note })
            ]
          },
          o.id
        );
      }) }),
      footnote != null ? /* @__PURE__ */ jsx("div", { className: "border-t border-border px-2 py-1 text-meta text-muted-foreground", children: footnote }) : null
    ]
  }
));
TemplatePicker.displayName = "TemplatePicker";
var MARKER = {
  prompt: "$",
  output: "\u2192",
  comment: "#"
};
var Terminal = React23.forwardRef(
  ({ cursor, columnTemplate = "150px minmax(0,1fr) auto auto", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      style: { "--terminal-cols": columnTemplate },
      className: cn(
        "overflow-x-auto border border-border bg-muted/40 p-2 font-mono text-meta",
        className
      ),
      ...props,
      children: [
        children,
        cursor ? /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            className: "mt-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-foreground align-middle motion-reduce:animate-none"
          }
        ) : null
      ]
    }
  )
);
Terminal.displayName = "Terminal";
var TerminalLine = React23.forwardRef(
  ({ kind = "output", columns, className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "items-baseline gap-2 whitespace-pre",
        columns ? "grid [grid-template-columns:auto_var(--terminal-cols)]" : "flex",
        kind === "comment" && "text-muted-foreground",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            className: cn(
              "w-3 shrink-0",
              kind === "prompt" ? "text-primary" : "text-muted-foreground"
            ),
            children: MARKER[kind]
          }
        ),
        columns ? columns.map((c, i) => /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "min-w-0 truncate",
              i === columns.length - 1 && "text-muted-foreground"
            ),
            children: c
          },
          i
        )) : /* @__PURE__ */ jsx("span", { className: "min-w-0", children })
      ]
    }
  )
);
TerminalLine.displayName = "TerminalLine";
var TimelineVariantContext = React23.createContext("columns");
var RAIL_MARKER_OFFSET = "h-[0.692rem]";
var RAIL_FOOTER_TAIL = "h-[1.067rem]";
var TimelineList = React23.forwardRef(({ className, variant = "columns", children, ...props }, ref) => /* @__PURE__ */ jsx(TimelineVariantContext.Provider, { value: variant, children: /* @__PURE__ */ jsx("ol", { ref, className: cn("flex flex-col", className), ...props, children }) }));
TimelineList.displayName = "TimelineList";
function RailGutter({ marker }) {
  return /* @__PURE__ */ jsxs("span", { className: "flex w-2.5 shrink-0 flex-col items-center", children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": true,
        className: cn(
          "w-px shrink-0 bg-border group-first/entry:bg-transparent",
          RAIL_MARKER_OFFSET
        )
      }
    ),
    marker,
    /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": true,
        className: "w-px flex-1 bg-border group-last/entry:bg-transparent"
      }
    )
  ] });
}
var TimelineEntry = React23.forwardRef(({ when, title, marker, className, children, ...props }, ref) => {
  const variant = React23.useContext(TimelineVariantContext);
  if (variant === "rail") {
    return /* @__PURE__ */ jsxs(
      "li",
      {
        ref,
        className: cn("group/entry flex gap-2.5", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx(RailGutter, { marker }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5 pb-4 group-last/entry:pb-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-meta text-muted-foreground", children: when }),
            title != null ? /* @__PURE__ */ jsx("span", { className: "font-medium", children: title }) : null,
            children
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "li",
    {
      ref,
      className: cn("flex gap-2 border-b border-border py-1.5 last:border-b-0", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("span", { className: "flex w-[72px] shrink-0 items-baseline gap-1.5 text-meta text-muted-foreground", children: [
          marker ? /* @__PURE__ */ jsx("span", { className: "translate-y-1", children: marker }) : null,
          /* @__PURE__ */ jsx("span", { className: "truncate", children: when })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: [
          title != null ? /* @__PURE__ */ jsx("span", { className: "font-medium", children: title }) : null,
          children
        ] })
      ]
    }
  );
});
TimelineEntry.displayName = "TimelineEntry";
var TimelineFooter = React23.forwardRef(({ className, children, ...props }, ref) => {
  const variant = React23.useContext(TimelineVariantContext);
  if (variant === "rail") {
    return /* @__PURE__ */ jsxs(
      "li",
      {
        ref,
        role: "presentation",
        className: cn("flex gap-2.5", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx("span", { className: "flex w-2.5 shrink-0 justify-center", children: /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: cn("w-px bg-border", RAIL_FOOTER_TAIL) }) }),
          /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1 pt-1.5", children })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx("li", { ref, role: "presentation", className: cn("pt-1.5", className), ...props, children });
});
TimelineFooter.displayName = "TimelineFooter";
var Toolbar = () => {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-5 items-center space-x-2", children: [
    /* @__PURE__ */ jsx(
      ButtonWithTooltip,
      {
        variant: "ghost",
        size: "nav-icon",
        className: "rounded-none hover:bg-gray-100 active:bg-gray:500",
        tooltip: /* @__PURE__ */ jsx("p", { children: "Unlock Canvas" }),
        children: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
    /* @__PURE__ */ jsx("div", { children: "Docs" }),
    /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
    /* @__PURE__ */ jsx("div", { children: "Source" })
  ] });
};
function useTour(options) {
  const {
    steps,
    initialStep = 0,
    loop = false,
    onStepChange,
    onComplete,
    onExit
  } = options;
  const [current, setCurrent] = React23.useState(initialStep);
  const total = steps.length;
  const lastIndex = Math.max(total - 1, 0);
  const clamped = Math.min(Math.max(current, 0), lastIndex);
  const goTo = React23.useCallback(
    (index) => {
      setCurrent((prev2) => {
        const next2 = Math.min(Math.max(index, 0), lastIndex);
        if (next2 !== prev2) onStepChange?.(next2);
        return next2;
      });
    },
    [lastIndex, onStepChange]
  );
  const next = React23.useCallback(() => {
    setCurrent((prev2) => {
      if (prev2 >= lastIndex) {
        if (loop && total > 0) {
          onStepChange?.(0);
          return 0;
        }
        onComplete?.();
        return prev2;
      }
      onStepChange?.(prev2 + 1);
      return prev2 + 1;
    });
  }, [lastIndex, total, loop, onComplete, onStepChange]);
  const prev = React23.useCallback(() => {
    setCurrent((p) => {
      if (p <= 0) {
        if (loop && total > 0) {
          onStepChange?.(lastIndex);
          return lastIndex;
        }
        return p;
      }
      onStepChange?.(p - 1);
      return p - 1;
    });
  }, [lastIndex, total, loop, onStepChange]);
  const exit = React23.useCallback(() => {
    onExit?.();
  }, [onExit]);
  return React23.useMemo(
    () => ({
      step: steps[clamped],
      current: clamped,
      total,
      isFirst: clamped <= 0,
      isLast: clamped >= lastIndex,
      next,
      prev,
      goTo,
      exit
    }),
    [steps, clamped, total, lastIndex, next, prev, goTo, exit]
  );
}
var positionClasses = {
  static: "",
  "top-left": "fixed left-4 top-4 z-50",
  "top-right": "fixed right-4 top-4 z-50",
  "bottom-left": "fixed bottom-4 left-4 z-50",
  "bottom-right": "fixed bottom-4 right-4 z-50",
  center: "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
};
function Tour({
  controller,
  steps,
  onExit,
  onComplete,
  badgeLabel = "TOUR",
  prevLabel = "Prev",
  nextLabel = "Next",
  finishLabel = "Finish",
  exitLabel = "Exit Tour",
  showExit = true,
  showCounter = true,
  showProgressBar = false,
  position = "static",
  className
}) {
  const internal = useTour({ steps: steps ?? [], onExit, onComplete });
  const ctrl = controller ?? internal;
  const { step, current, total, isFirst, isLast } = ctrl;
  if (!step) return null;
  const progress = total > 0 ? (current + 1) / total * 100 : 0;
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "w-80 gap-0 border-border bg-popover p-0 text-popover-foreground shadow-xl",
        positionClasses[position],
        className
      ),
      role: "dialog",
      "aria-label": typeof badgeLabel === "string" ? badgeLabel : void 0,
      children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Badge, { variant: "soft", className: "tracking-wider", children: badgeLabel }),
            showCounter && /* @__PURE__ */ jsxs("span", { className: "text-meta text-muted-foreground", children: [
              current + 1,
              " / ",
              total
            ] })
          ] }),
          showExit && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "-mr-1 h-7 gap-1 px-2 text-meta text-muted-foreground [&_svg]:size-3.5",
              onClick: ctrl.exit,
              children: [
                /* @__PURE__ */ jsx(X, {}),
                exitLabel
              ]
            }
          )
        ] }),
        showProgressBar && /* @__PURE__ */ jsx("div", { className: "mx-3 h-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full rounded-full bg-primary transition-all",
            style: { width: `${progress}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 p-3 pt-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold leading-snug", children: step.title }),
          step.content ?? /* @__PURE__ */ jsxs(Fragment, { children: [
            step.body && /* @__PURE__ */ jsx("div", { className: "leading-relaxed text-muted-foreground", children: step.body }),
            step.callout && /* @__PURE__ */ jsxs("div", { className: "rounded-r-md border-l-2 border-primary bg-muted/40 p-3", children: [
              step.callout.label && /* @__PURE__ */ jsx("div", { className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary", children: step.callout.label }),
              /* @__PURE__ */ jsx("div", { className: "leading-relaxed", children: step.callout.content })
            ] }),
            step.references && step.references.items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              step.references.label && /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: step.references.label }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: step.references.items.map((item, i) => {
                const Icon = item.icon;
                return item.onClick ? /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: item.onClick,
                    className: cn(
                      badgeVariants({ variant: "secondary" }),
                      "cursor-pointer gap-1 transition-colors hover:bg-accent hover:text-accent-foreground"
                    ),
                    children: [
                      Icon && /* @__PURE__ */ jsx(Icon, { className: "size-3" }),
                      item.label
                    ]
                  },
                  `${item.label}-${i}`
                ) : /* @__PURE__ */ jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "gap-1",
                    children: [
                      Icon && /* @__PURE__ */ jsx(Icon, { className: "size-3" }),
                      item.label
                    ]
                  },
                  `${item.label}-${i}`
                );
              }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs(CardFooter, { className: "justify-between p-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: ctrl.prev,
              disabled: isFirst,
              className: "gap-1 [&_svg]:size-4",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, {}),
                prevLabel
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              onClick: ctrl.next,
              className: "gap-1 [&_svg]:size-4",
              children: [
                isLast ? finishLabel : nextLabel,
                /* @__PURE__ */ jsx(ChevronRight, {})
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
var TreeView = ({ searchable = false, ...props }) => {
  const [searchQuery, setSearchQuery] = React23.useState("");
  const filterItems = (items, query) => {
    if (!query) return items;
    return items.map((item) => ({
      ...item,
      children: item.children ? filterItems(item.children, query) : []
    })).filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.children && item.children.length > 0);
  };
  const filteredItems = filterItems(props.items, searchQuery);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("rounded-lg border bg-card text-card-foreground shadow-sm w-[240px]", props.className),
      style: props.style,
      children: /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
        props.header && props.header,
        searchable && /* @__PURE__ */ jsx(SearchInput, { value: searchQuery, onChange: setSearchQuery }),
        /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: filteredItems.map((item) => /* @__PURE__ */ jsx(TreeItem, { item }, item.id)) })
      ] })
    }
  );
};
var TreeItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = React23.useState(item.isExpanded || true);
  const hasChildren = item.children && item.children.length > 0;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          item.onClick?.(item.id, item.label);
        },
        className: cn(
          "flex items-center gap-2 w-full rounded-control px-2 py-1 hover:bg-accent hover:text-accent-foreground",
          hasChildren && "cursor-pointer font-medium"
        ),
        children: [
          hasChildren && /* @__PURE__ */ jsx(
            ChevronRight,
            {
              className: cn(
                "h-4 w-4 shrink-0 transition-transform",
                isExpanded && "rotate-90"
              )
            }
          ),
          item.icon,
          /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label })
        ]
      }
    ),
    hasChildren && isExpanded && /* @__PURE__ */ jsxs("div", { className: "ml-4 pl-4 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 border-l border-muted-foreground/25" }),
      item.children?.map((child, index) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -left-4 top-[15px] w-4 border-t border-muted-foreground/25" }),
        /* @__PURE__ */ jsx(TreeItem, { item: child }, index)
      ] }, child.id))
    ] })
  ] });
};
var underDevelopmentVariants = cva(
  "flex flex-col items-center justify-center h-full gap-4",
  {
    variants: {
      size: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
function UnderDevelopment({
  title = "Under Development",
  description = "This feature is currently being built.",
  iconSize = 48,
  size,
  className = ""
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn(underDevelopmentVariants({ size }), "text-center", className), children: [
    /* @__PURE__ */ jsx(Construction, { size: iconSize, className: "text-primary" }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-md", children: description }),
    /* @__PURE__ */ jsx("span", { className: "mt-4 px-3 py-1 bg-yellow-100 text-yellow-800", children: "Coming Soon" })
  ] });
}
var TypographyH1 = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "h1",
      {
        ref,
        className: cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
          className
        ),
        ...props
      }
    );
  }
);
TypographyH1.displayName = "TypographyH1";
var TypographyH2 = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "h2",
      {
        ref,
        className: cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
          className
        ),
        ...props
      }
    );
  }
);
TypographyH2.displayName = "TypographyH2";
var TypographyH3 = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "h3",
      {
        ref,
        className: cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight",
          className
        ),
        ...props
      }
    );
  }
);
TypographyH3.displayName = "TypographyH3";
var TypographyH4 = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "h4",
      {
        ref,
        className: cn(
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className
        ),
        ...props
      }
    );
  }
);
TypographyH4.displayName = "TypographyH4";
var TypographyH5 = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "h5",
      {
        ref,
        className: cn(
          "scroll-m-20 text-lg font-semibold tracking-tight",
          className
        ),
        ...props
      }
    );
  }
);
TypographyH5.displayName = "TypographyH5";
var TypographyH6 = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "h6",
      {
        ref,
        className: cn(
          "scroll-m-20 text-base font-semibold tracking-tight",
          className
        ),
        ...props
      }
    );
  }
);
TypographyH6.displayName = "TypographyH6";
var TypographyP = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "p",
      {
        ref,
        className: cn(
          "leading-7 [&:not(:first-child)]:mt-6",
          className
        ),
        ...props
      }
    );
  }
);
TypographyP.displayName = "TypographyP";
var TypographyBlockquote = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "blockquote",
      {
        ref,
        className: cn(
          "mt-6 border-l-2 pl-6 italic",
          className
        ),
        ...props
      }
    );
  }
);
TypographyBlockquote.displayName = "TypographyBlockquote";
var TypographyInlineCode = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "code",
      {
        ref,
        className: cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-meta font-semibold",
          className
        ),
        ...props
      }
    );
  }
);
TypographyInlineCode.displayName = "TypographyInlineCode";
var TypographyLead = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "p",
      {
        ref,
        className: cn(
          "text-xl text-muted-foreground",
          className
        ),
        ...props
      }
    );
  }
);
TypographyLead.displayName = "TypographyLead";
var TypographyLarge = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn(
          "text-lg font-semibold",
          className
        ),
        ...props
      }
    );
  }
);
TypographyLarge.displayName = "TypographyLarge";
var TypographySmall = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "small",
      {
        ref,
        className: cn(
          "text-meta font-medium leading-none",
          className
        ),
        ...props
      }
    );
  }
);
TypographySmall.displayName = "TypographySmall";
var TypographyMuted = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "p",
      {
        ref,
        className: cn(
          "text-muted-foreground",
          className
        ),
        ...props
      }
    );
  }
);
TypographyMuted.displayName = "TypographyMuted";
var TypographyList = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "ul",
      {
        ref,
        className: cn(
          "my-6 ml-6 list-disc [&>li]:mt-2",
          className
        ),
        ...props
      }
    );
  }
);
TypographyList.displayName = "TypographyList";
var TypographyPre = React23.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "pre",
      {
        ref,
        className: cn(
          "mt-6 mb-4 overflow-x-auto rounded-lg border bg-muted p-4",
          className
        ),
        ...props
      }
    );
  }
);
TypographyPre.displayName = "TypographyPre";

// src/components/typography/index.ts
var Typography = {
  H1: TypographyH1,
  H2: TypographyH2,
  H3: TypographyH3,
  H4: TypographyH4,
  H5: TypographyH5,
  H6: TypographyH6,
  P: TypographyP,
  Blockquote: TypographyBlockquote,
  Code: TypographyInlineCode,
  Lead: TypographyLead,
  Large: TypographyLarge,
  Small: TypographySmall,
  Muted: TypographyMuted,
  List: TypographyList,
  Pre: TypographyPre
};

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger, AgentChip, Alert, AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AlertTitle, AppStatusBar, Avatar, AvatarFallback, AvatarImage, Badge, BarChartH, BarChartV, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, ButtonWithTooltip, CannotAnswerCard, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardWithHeader, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, ChatSession, ChatSessionActivityRow, ChatSessionActivitySubLine, ChatSessionComposer, ChatSessionContextChip, ChatSessionDisclosure, ChatSessionMessage, ChatSessionMessageOptions, ChatSessionProgressLine, ChatSessionPromptRow, ChatSessionStatusBar, ChatSessionTaskGroup, ChatSessionTaskRow, CitationList, CitationMarker, CitationRow, ClarifyCard, Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, ContextBar, DiagnosisCard, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DiffList, DiffRow, DivergingBar, DotRating, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmissionCard, EmissionHeader, EmptyState, EmptyStateLock, ErrorBoundary, FilterBar, FilterChip, HeatStrip, HoverCard, HoverCardContent, HoverCardTrigger, Item3 as Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, Kbd, KbdGroup, Legend, LegendItem, MenuItem, Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarPortal, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger, MetricGrid, MetricTile, NavBase, NavHorizontal, NavHorizontalItems, NavItems, NavVertical, NavVerticalItems, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, NestedMenu, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PanelContent, PanelStack, Popover, PopoverContent, PopoverTrigger, Progress, PropertyList, PropertyRow, ProposalCard, RatingControl, RepairNote, ResizableHandle, ResizablePanel, ResizablePanelGroup, RetryNote, RichSelect, ScrollArea, ScrollBar, SearchInput, SectionHeader, Separator, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, Skeleton, Sparkline, Spinner, StatusDot, TabbedPanel, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, TemplatePicker, Terminal, TerminalLine, TimelineEntry, TimelineFooter, TimelineList, Toaster, Toggle, ToggleGroup, ToggleGroupItem, Toolbar, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Tour, TreeItem, TreeView, Typography, TypographyBlockquote, TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyH5, TypographyH6, TypographyInlineCode, TypographyLarge, TypographyLead, TypographyList, TypographyMuted, TypographyP, TypographyPre, TypographySmall, UnderDevelopment, agentChipVariants, badgeVariants, buttonGroupVariants, buttonVariants, chatSessionGutterClass, cn, navigationMenuTriggerStyle, statusDotVariants, toggleVariants, useOverflowItems, useSidebar, useTour };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map