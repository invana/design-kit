'use strict';

var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');
var React25 = require('react');
var AccordionPrimitive = require('@radix-ui/react-accordion');
var lucideReact = require('lucide-react');
var jsxRuntime = require('react/jsx-runtime');
var classVarianceAuthority = require('class-variance-authority');
var AlertDialogPrimitive = require('@radix-ui/react-alert-dialog');
var reactSlot = require('@radix-ui/react-slot');
var AvatarPrimitive = require('@radix-ui/react-avatar');
var SeparatorPrimitive = require('@radix-ui/react-separator');
var useEmblaCarousel = require('embla-carousel-react');
var cmdk = require('cmdk');
var DialogPrimitive = require('@radix-ui/react-dialog');
var DropdownMenuPrimitive = require('@radix-ui/react-dropdown-menu');
var HoverCardPrimitive = require('@radix-ui/react-hover-card');
var MenubarPrimitive = require('@radix-ui/react-menubar');
var NavigationMenuPrimitive = require('@radix-ui/react-navigation-menu');
var PopoverPrimitive = require('@radix-ui/react-popover');
var ProgressPrimitive = require('@radix-ui/react-progress');
var questionnaire = require('@shadcn/react/questionnaire');
var reactResizablePanels = require('react-resizable-panels');
var ScrollAreaPrimitive = require('@radix-ui/react-scroll-area');
var TooltipPrimitive = require('@radix-ui/react-tooltip');
var sonner = require('sonner');
var TabsPrimitive = require('@radix-ui/react-tabs');
var TogglePrimitive = require('@radix-ui/react-toggle');
var ToggleGroupPrimitive = require('@radix-ui/react-toggle-group');
var reactDom = require('react-dom');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React25__namespace = /*#__PURE__*/_interopNamespace(React25);
var AccordionPrimitive__namespace = /*#__PURE__*/_interopNamespace(AccordionPrimitive);
var AlertDialogPrimitive__namespace = /*#__PURE__*/_interopNamespace(AlertDialogPrimitive);
var AvatarPrimitive__namespace = /*#__PURE__*/_interopNamespace(AvatarPrimitive);
var SeparatorPrimitive__namespace = /*#__PURE__*/_interopNamespace(SeparatorPrimitive);
var useEmblaCarousel__default = /*#__PURE__*/_interopDefault(useEmblaCarousel);
var DialogPrimitive__namespace = /*#__PURE__*/_interopNamespace(DialogPrimitive);
var DropdownMenuPrimitive__namespace = /*#__PURE__*/_interopNamespace(DropdownMenuPrimitive);
var HoverCardPrimitive__namespace = /*#__PURE__*/_interopNamespace(HoverCardPrimitive);
var MenubarPrimitive__namespace = /*#__PURE__*/_interopNamespace(MenubarPrimitive);
var NavigationMenuPrimitive__namespace = /*#__PURE__*/_interopNamespace(NavigationMenuPrimitive);
var PopoverPrimitive__namespace = /*#__PURE__*/_interopNamespace(PopoverPrimitive);
var ProgressPrimitive__namespace = /*#__PURE__*/_interopNamespace(ProgressPrimitive);
var ScrollAreaPrimitive__namespace = /*#__PURE__*/_interopNamespace(ScrollAreaPrimitive);
var TooltipPrimitive__namespace = /*#__PURE__*/_interopNamespace(TooltipPrimitive);
var TabsPrimitive__namespace = /*#__PURE__*/_interopNamespace(TabsPrimitive);
var TogglePrimitive__namespace = /*#__PURE__*/_interopNamespace(TogglePrimitive);
var ToggleGroupPrimitive__namespace = /*#__PURE__*/_interopNamespace(ToggleGroupPrimitive);

// src/lib/utils.ts
var twMerge = tailwindMerge.extendTailwindMerge({
  extend: {
    theme: {
      spacing: ["control-xs", "control-sm", "control-md", "control-lg"],
      radius: ["control", "surface"]
    }
  }
});
function cn(...inputs) {
  return twMerge(clsx.clsx(inputs));
}
var Accordion = AccordionPrimitive__namespace.Root;
var AccordionItem = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AccordionPrimitive__namespace.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(AccordionPrimitive__namespace.Header, { className: "flex", children: /* @__PURE__ */ jsxRuntime.jsxs(
  AccordionPrimitive__namespace.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive__namespace.Trigger.displayName;
var AccordionContent = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AccordionPrimitive__namespace.Content,
  {
    ref,
    className: "overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive__namespace.Content.displayName;
var alertVariants = classVarianceAuthority.cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      },
      /**
       * What the alert means, as Badge's `tone` does: the border, a faint
       * ground and the icon take the tone; the words stay foreground, so they
       * read at any contrast. `destructive` here is the tone; the `destructive`
       * variant, which also colours the words, is kept as it was.
       */
      tone: {
        info: "border-info/40 bg-info/5 [&>svg]:text-info",
        success: "border-success/40 bg-success/5 [&>svg]:text-success",
        warning: "border-warning/50 bg-warning/5 [&>svg]:text-warning",
        destructive: "border-destructive/50 bg-destructive/5 [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Alert = React25__namespace.forwardRef(({ className, variant, tone, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant, tone }), className),
    ...props
  }
));
Alert.displayName = "Alert";
var AlertTitle = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("[&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
var buttonVariants = classVarianceAuthority.cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap   rounded-control font-medium transition-colors focus-visible:outline-none   focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2   disabled:pointer-events-none disabled:opacity-50   [&_svg]:pointer-events-none   [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--primary)_/_var(--surface-alpha))] glassable text-primary-foreground shadow border border-primary/30           hover:border-primary/50 hover:shadow-lg           active:bg-[hsl(var(--primary)_/_var(--surface-alpha))]",
        destructive: "bg-[hsl(var(--destructive)_/_var(--surface-alpha))] glassable text-destructive-foreground shadow-sm border border-destructive/40           hover:border-destructive/60           active:bg-destructive/70",
        outline: "bg-[hsl(var(--background)_/_var(--surface-alpha))] glassable border border-border           hover:bg-[hsl(var(--accent)_/_var(--surface-alpha))] hover:text-accent-foreground           active:bg-[hsl(var(--accent)_/_var(--surface-alpha))]",
        secondary: "bg-[hsl(var(--secondary)_/_var(--surface-alpha))] glassable text-secondary-foreground border border-border           hover:bg-secondary/80 hover:border-border           active:bg-secondary/60",
        ghost: "border border-transparent           hover:bg-[hsl(var(--accent)_/_var(--surface-alpha))] hover:text-accent-foreground           active:bg-[hsl(var(--accent)_/_var(--surface-alpha))]",
        soft: "bg-primary/10 glassable text-primary border border-primary/30 shadow-sm           hover:bg-primary/20 active:bg-primary/25",
        link: "text-primary underline-offset-4 hover:underline           hover:text-primary/80 active:text-primary/60"
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
        "nav-icon": "h-11 w-11 rounded-control"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React25__namespace.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? reactSlot.Slot : "button";
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var AlertDialog = AlertDialogPrimitive__namespace.Root;
var AlertDialogTrigger = AlertDialogPrimitive__namespace.Trigger;
var AlertDialogPortal = AlertDialogPrimitive__namespace.Portal;
var AlertDialogOverlay = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AlertDialogPrimitive__namespace.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive__namespace.Overlay.displayName;
var AlertDialogContent = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntime.jsx(
    AlertDialogPrimitive__namespace.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-surface",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive__namespace.Content.displayName;
var AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
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
}) => /* @__PURE__ */ jsxRuntime.jsx(
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
var AlertDialogTitle = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AlertDialogPrimitive__namespace.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive__namespace.Title.displayName;
var AlertDialogDescription = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AlertDialogPrimitive__namespace.Description,
  {
    ref,
    className: cn("text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive__namespace.Description.displayName;
var AlertDialogAction = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AlertDialogPrimitive__namespace.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive__namespace.Action.displayName;
var AlertDialogCancel = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AlertDialogPrimitive__namespace.Cancel,
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
AlertDialogCancel.displayName = AlertDialogPrimitive__namespace.Cancel.displayName;
var avatarVariants = classVarianceAuthority.cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      xs: "size-control-xs text-xs",
      sm: "size-control-sm text-xs",
      md: "size-control-md text-sm",
      lg: "size-control-lg"
    }
  },
  defaultVariants: { size: "lg" }
});
var Avatar = React25__namespace.forwardRef(
  ({ className, size, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    AvatarPrimitive__namespace.Root,
    {
      ref,
      "data-slot": "avatar",
      className: cn(avatarVariants({ size }), className),
      ...props
    }
  )
);
Avatar.displayName = AvatarPrimitive__namespace.Root.displayName;
var AvatarImage = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AvatarPrimitive__namespace.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive__namespace.Image.displayName;
var AvatarFallback = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AvatarPrimitive__namespace.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive__namespace.Fallback.displayName;
var AvatarGroup = React25__namespace.forwardRef(
  ({ className, max, size, children, ...props }, ref) => {
    const all = React25__namespace.Children.toArray(children);
    const shown = max != null && all.length > max ? all.slice(0, max) : all;
    const rest = all.length - shown.length;
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        "data-slot": "avatar-group",
        className: cn("flex items-center -space-x-2 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-background", className),
        ...props,
        children: [
          shown,
          rest > 0 ? /* @__PURE__ */ jsxRuntime.jsx(Avatar, { size, "aria-label": `${rest} more`, children: /* @__PURE__ */ jsxRuntime.jsxs(AvatarFallback, { children: [
            "+",
            rest
          ] }) }) : null
        ]
      }
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";
var badgeVariants = classVarianceAuthority.cva(
  "inline-flex items-center rounded-control border font-semibold transition-colors   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
        destructive: "[--badge-solid:var(--color-destructive)] [--badge-on-solid:var(--color-destructive-foreground)] [--badge-ink:var(--color-destructive)]",
        muted: "[--badge-solid:var(--color-muted-foreground)] [--badge-on-solid:var(--color-background)] [--badge-ink:var(--color-muted-foreground)]"
      },
      size: {
        /**
         * The control scale's `xs` (22px) — the row chip: a status beside an
         * entity name, a count against a label. The default, because a badge
         * labels a row and must fit inside a compact one.
         */
        xs: "h-control-xs px-2 text-sm",
        /** The control scale's `sm` (26px) — beside a search or a filter chip. */
        sm: "h-control-sm px-2 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      tone: "primary",
      size: "xs"
    }
  }
);
function Badge({ className, variant, tone, size, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn(badgeVariants({ variant, tone, size }), className),
      ...props
    }
  );
}
var Breadcrumb = React25__namespace.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var BreadcrumbItem = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "li",
  {
    ref,
    className: cn("inline-flex items-center gap-1.5", className),
    ...props
  }
));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = React25__namespace.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "a";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
}) => /* @__PURE__ */ jsxRuntime.jsx(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, {})
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsxs(
  "span",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.MoreHorizontal, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "More" })
    ]
  }
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
var Separator = React25__namespace.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    SeparatorPrimitive__namespace.Root,
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
Separator.displayName = SeparatorPrimitive__namespace.Root.displayName;
var buttonGroupVariants = classVarianceAuthority.cva(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  const Comp = asChild ? reactSlot.Slot : "div";
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var Card = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-surface border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
var CardHeader = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-3", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none  tracking-tight ", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn(" text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("p-3 flex-1 overflow-y-auto", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-3 ", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
var CardWithHeader = React25__namespace.forwardRef(
  ({ className, title, description, headerClassName, contentClassName, footerClassName, footer, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(Card, { ref, className, ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { className: `${headerClassName} rounded-t-surface`, children: [
      typeof title === "string" ? /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { children: title }) : title,
      description && (typeof description === "string" ? /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: description }) : description)
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: contentClassName, children }),
    footer && /* @__PURE__ */ jsxRuntime.jsx(CardFooter, { className: footerClassName, children: footer })
  ] })
);
CardWithHeader.displayName = "CardWithHeader";
var CarouselContext = React25__namespace.createContext(null);
function useCarousel() {
  const context = React25__namespace.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
var Carousel = React25__namespace.forwardRef(
  ({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  }, ref) => {
    const [carouselRef, api] = useEmblaCarousel__default.default(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y"
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React25__namespace.useState(false);
    const [canScrollNext, setCanScrollNext] = React25__namespace.useState(false);
    const onSelect = React25__namespace.useCallback((api2) => {
      if (!api2) {
        return;
      }
      setCanScrollPrev(api2.canScrollPrev());
      setCanScrollNext(api2.canScrollNext());
    }, []);
    const scrollPrev = React25__namespace.useCallback(() => {
      api?.scrollPrev();
    }, [api]);
    const scrollNext = React25__namespace.useCallback(() => {
      api?.scrollNext();
    }, [api]);
    const handleKeyDown = React25__namespace.useCallback(
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
    React25__namespace.useEffect(() => {
      if (!api || !setApi) {
        return;
      }
      setApi(api);
    }, [api, setApi]);
    React25__namespace.useEffect(() => {
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
    return /* @__PURE__ */ jsxRuntime.jsx(
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
        children: /* @__PURE__ */ jsxRuntime.jsx(
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
var CarouselContent = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return /* @__PURE__ */ jsxRuntime.jsx("div", { ref: carouselRef, className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntime.jsx(
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
var CarouselItem = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var CarouselPrevious = React25__namespace.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowLeft, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Previous slide" })
      ]
    }
  );
});
CarouselPrevious.displayName = "CarouselPrevious";
var CarouselNext = React25__namespace.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowRight, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Next slide" })
      ]
    }
  );
});
CarouselNext.displayName = "CarouselNext";
var Dialog = DialogPrimitive__namespace.Root;
var DialogTrigger = DialogPrimitive__namespace.Trigger;
var DialogPortal = DialogPrimitive__namespace.Portal;
var DialogClose = DialogPrimitive__namespace.Close;
var DialogOverlay = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive__namespace.Overlay.displayName;
var DialogContent = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntime.jsxs(
    DialogPrimitive__namespace.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card text-card-foreground p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-surface",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsxs(DialogPrimitive__namespace.Close, { className: "absolute right-4 top-4 rounded-control opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive__namespace.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
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
}) => /* @__PURE__ */ jsxRuntime.jsx(
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
var DialogTitle = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive__namespace.Title.displayName;
var DialogDescription = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Description,
  {
    ref,
    className: cn("text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive__namespace.Description.displayName;
var Command = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-surface bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = cmdk.Command.displayName;
var CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(Dialog, { ...props, children: /* @__PURE__ */ jsxRuntime.jsx(DialogContent, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntime.jsx(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children }) }) });
};
var CommandInput = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntime.jsx(
    cmdk.Command.Input,
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
CommandInput.displayName = cmdk.Command.Input.displayName;
var CommandList = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = cmdk.Command.List.displayName;
var CommandEmpty = React25__namespace.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.Empty,
  {
    ref,
    className: "py-6 text-center",
    ...props
  }
));
CommandEmpty.displayName = cmdk.Command.Empty.displayName;
var CommandGroup = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = cmdk.Command.Group.displayName;
var CommandSeparator = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = cmdk.Command.Separator.displayName;
var CommandItem = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-control px-2 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-primary/15 data-[selected=true]:text-primary data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = cmdk.Command.Item.displayName;
var CommandShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      className: cn(
        "ml-auto text-sm tracking-widest text-muted-foreground",
        className
      ),
      ...props
    }
  );
};
CommandShortcut.displayName = "CommandShortcut";
var DropdownMenu = DropdownMenuPrimitive__namespace.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive__namespace.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive__namespace.Group;
var DropdownMenuPortal = DropdownMenuPrimitive__namespace.Portal;
var DropdownMenuSub = DropdownMenuPrimitive__namespace.Sub;
var DropdownMenuRadioGroup = DropdownMenuPrimitive__namespace.RadioGroup;
var DropdownMenuSubTrigger = React25__namespace.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  DropdownMenuPrimitive__namespace.SubTrigger,
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
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive__namespace.SubTrigger.displayName;
var DropdownMenuSubContent = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DropdownMenuPrimitive__namespace.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-surface border border-border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive__namespace.SubContent.displayName;
var DropdownMenuContent = React25__namespace.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuPrimitive__namespace.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
  DropdownMenuPrimitive__namespace.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-surface border border-border bg-popover p-1 text-popover-foreground shadow-lg",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive__namespace.Content.displayName;
var DropdownMenuItem = React25__namespace.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DropdownMenuPrimitive__namespace.Item,
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
DropdownMenuItem.displayName = DropdownMenuPrimitive__namespace.Item.displayName;
var DropdownMenuCheckboxItem = React25__namespace.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  DropdownMenuPrimitive__namespace.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control py-1.5 pl-8 pr-2 outline-none transition-colors focus:bg-primary/15 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuPrimitive__namespace.ItemIndicator, { children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive__namespace.CheckboxItem.displayName;
var DropdownMenuRadioItem = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  DropdownMenuPrimitive__namespace.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control py-1.5 pl-8 pr-2 outline-none transition-colors focus:bg-primary/15 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuPrimitive__namespace.ItemIndicator, { children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive__namespace.RadioItem.displayName;
var DropdownMenuLabel = React25__namespace.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DropdownMenuPrimitive__namespace.Label,
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
DropdownMenuLabel.displayName = DropdownMenuPrimitive__namespace.Label.displayName;
var DropdownMenuSeparator = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DropdownMenuPrimitive__namespace.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive__namespace.Separator.displayName;
var DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      className: cn("ml-auto text-sm tracking-widest opacity-60", className),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var HoverCard = HoverCardPrimitive__namespace.Root;
var HoverCardTrigger = HoverCardPrimitive__namespace.Trigger;
var HoverCardContent = React25__namespace.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  HoverCardPrimitive__namespace.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-64 rounded-surface border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",
      className
    ),
    ...props
  }
));
HoverCardContent.displayName = HoverCardPrimitive__namespace.Content.displayName;
function ItemGroup({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    Separator,
    {
      "data-slot": "item-separator",
      orientation: "horizontal",
      className: cn("my-0", className),
      ...props
    }
  );
}
var itemVariants = classVarianceAuthority.cva(
  // A row that is a link or a button (`asChild`) lights on hover and reads left
  // to right; a plain row does neither.
  "group/item [a]:hover:bg-accent/50 [button]:hover:bg-accent/50 [button]:w-full [button]:text-left [button]:cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent outline-none transition-colors duration-100 focus-visible:ring-[3px]",
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
         * The application row — a control's `md` height, the height a dense
         * list actually uses: an agent in a roster, a dataset, a schedule, a
         * node type, a queue entry. `min-h` rather than `h`, so a row that
         * wraps still contains its content instead of clipping it.
         */
        xs: "min-h-control-md gap-2 px-2 py-1"
      },
      /**
       * Selection, not hover. A row the user has chosen stays marked while
       * they work elsewhere in the panel, which `:hover` cannot express.
       * Drive it from the same state that drives `aria-selected`.
       */
      selected: {
        true: "bg-accent",
        false: ""
      },
      /** Present, not in play — queued, held, skipped. Kept in its place, faded. */
      dim: {
        true: "opacity-50",
        false: ""
      },
      /** It ran and failed, or was refused: the title struck, in the destructive tone. */
      struck: {
        true: "[&_[data-slot=item-title]]:text-destructive [&_[data-slot=item-title]]:line-through",
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
  dim,
  struck,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? reactSlot.Slot : "div";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      "data-slot": "item",
      "data-variant": variant,
      "data-size": size,
      "data-selected": selected || void 0,
      className: cn(itemVariants({ variant, size, selected, dim, struck, className })),
      ...props
    }
  );
}
var itemMediaVariants = classVarianceAuthority.cva(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "p",
    {
      "data-slot": "item-description",
      className: cn(
        "text-muted-foreground line-clamp-2 text-balance font-normal leading-normal",
        // A dense row's subtitle is one line of meta, not a wrapped paragraph.
        "group-data-[size=xs]/item:line-clamp-1 group-data-[size=xs]/item:text-sm",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      ),
      ...props
    }
  );
}
function ItemActions({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "item-actions",
      className: cn("flex items-center gap-2", className),
      ...props
    }
  );
}
function ItemHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "kbd",
    {
      "data-slot": "kbd",
      className: cn(
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-control px-1 font-sans text-sm font-medium",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      ),
      ...props
    }
  );
}
function KbdGroup({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "kbd",
    {
      "data-slot": "kbd-group",
      className: cn("inline-flex items-center gap-1", className),
      ...props
    }
  );
}
var linkVariants = classVarianceAuthority.cva(
  "underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2   focus-visible:ring-ring focus-visible:ring-offset-2 rounded-control",
  {
    variants: {
      variant: {
        default: "text-primary hover:underline",
        underlined: "text-primary underline",
        quiet: "text-muted-foreground hover:text-foreground hover:underline"
      }
    },
    defaultVariants: { variant: "default" }
  }
);
var Link = React25__namespace.forwardRef(
  ({ className, variant, external, target, rel, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "a",
    {
      ref,
      className: cn(linkVariants({ variant }), className),
      target: external ? "_blank" : target,
      rel: external ? "noreferrer noopener" : rel,
      ...props
    }
  )
);
Link.displayName = "Link";
function MenubarMenu({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.Menu, { ...props });
}
function MenubarGroup({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.Group, { ...props });
}
function MenubarPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.Portal, { ...props });
}
function MenubarRadioGroup({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.RadioGroup, { ...props });
}
function MenubarSub({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.Sub, { "data-slot": "menubar-sub", ...props });
}
var Menubar = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.Root,
  {
    ref,
    className: cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    ),
    ...props
  }
));
Menubar.displayName = MenubarPrimitive__namespace.Root.displayName;
var MenubarTrigger = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.Trigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-control px-3 py-1.5 font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    ),
    ...props
  }
));
MenubarTrigger.displayName = MenubarPrimitive__namespace.Trigger.displayName;
var MenubarSubTrigger = React25__namespace.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  MenubarPrimitive__namespace.SubTrigger,
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
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
MenubarSubTrigger.displayName = MenubarPrimitive__namespace.SubTrigger.displayName;
var MenubarSubContent = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-surface border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    ),
    ...props
  }
));
MenubarSubContent.displayName = MenubarPrimitive__namespace.SubContent.displayName;
var MenubarContent = React25__namespace.forwardRef(
  ({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
    MenubarPrimitive__namespace.Content,
    {
      ref,
      align,
      alignOffset,
      sideOffset,
      className: cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-surface border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
        className
      ),
      ...props
    }
  ) })
);
MenubarContent.displayName = MenubarPrimitive__namespace.Content.displayName;
var MenubarItem = React25__namespace.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.Item,
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
MenubarItem.displayName = MenubarPrimitive__namespace.Item.displayName;
var MenubarCheckboxItem = React25__namespace.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  MenubarPrimitive__namespace.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control py-1.5 pl-8 pr-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.ItemIndicator, { children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
MenubarCheckboxItem.displayName = MenubarPrimitive__namespace.CheckboxItem.displayName;
var MenubarRadioItem = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  MenubarPrimitive__namespace.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-control py-1.5 pl-8 pr-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.ItemIndicator, { children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
MenubarRadioItem.displayName = MenubarPrimitive__namespace.RadioItem.displayName;
var MenubarLabel = React25__namespace.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.Label,
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
MenubarLabel.displayName = MenubarPrimitive__namespace.Label.displayName;
var MenubarSeparator = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
MenubarSeparator.displayName = MenubarPrimitive__namespace.Separator.displayName;
var MenubarShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      className: cn(
        "ml-auto text-sm tracking-widest text-muted-foreground",
        className
      ),
      ...props
    }
  );
};
MenubarShortcut.displayname = "MenubarShortcut";
var NavigationMenu = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  NavigationMenuPrimitive__namespace.Root,
  {
    ref,
    className: cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntime.jsx(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive__namespace.Root.displayName;
var NavigationMenuList = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  NavigationMenuPrimitive__namespace.List,
  {
    ref,
    className: cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    ),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive__namespace.List.displayName;
var NavigationMenuItem = NavigationMenuPrimitive__namespace.Item;
var navigationMenuTriggerStyle = classVarianceAuthority.cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-control bg-background px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
);
var NavigationMenuTrigger = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  NavigationMenuPrimitive__namespace.Trigger,
  {
    ref,
    className: cn(navigationMenuTriggerStyle(), "group", className),
    ...props,
    children: [
      children,
      " ",
      /* @__PURE__ */ jsxRuntime.jsx(
        lucideReact.ChevronDown,
        {
          className: "relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        }
      )
    ]
  }
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive__namespace.Trigger.displayName;
var NavigationMenuContent = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  NavigationMenuPrimitive__namespace.Content,
  {
    ref,
    className: cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    ),
    ...props
  }
));
NavigationMenuContent.displayName = NavigationMenuPrimitive__namespace.Content.displayName;
var NavigationMenuLink = NavigationMenuPrimitive__namespace.Link;
var NavigationMenuViewport = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("absolute left-0 top-full flex justify-center"), children: /* @__PURE__ */ jsxRuntime.jsx(
  NavigationMenuPrimitive__namespace.Viewport,
  {
    className: cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-surface border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className
    ),
    ref,
    ...props
  }
) }));
NavigationMenuViewport.displayName = NavigationMenuPrimitive__namespace.Viewport.displayName;
var NavigationMenuIndicator = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  NavigationMenuPrimitive__namespace.Indicator,
  {
    ref,
    className: cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
  }
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive__namespace.Indicator.displayName;
var Pagination = ({ className, ...props }) => /* @__PURE__ */ jsxRuntime.jsx(
  "nav",
  {
    role: "navigation",
    "aria-label": "pagination",
    className: cn("mx-auto flex w-full justify-center", className),
    ...props
  }
);
Pagination.displayName = "Pagination";
var PaginationContent = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "ul",
  {
    ref,
    className: cn("flex flex-row items-center gap-1", className),
    ...props
  }
));
PaginationContent.displayName = "PaginationContent";
var PaginationItem = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("li", { ref, className: cn("", className), ...props }));
PaginationItem.displayName = "PaginationItem";
var PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
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
}) => /* @__PURE__ */ jsxRuntime.jsxs(
  PaginationLink,
  {
    "aria-label": "Go to previous page",
    size: "default",
    className: cn("gap-1 pl-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronLeft, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Previous" })
    ]
  }
);
PaginationPrevious.displayName = "PaginationPrevious";
var PaginationNext = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsxs(
  PaginationLink,
  {
    "aria-label": "Go to next page",
    size: "default",
    className: cn("gap-1 pr-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Next" }),
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { className: "h-4 w-4" })
    ]
  }
);
PaginationNext.displayName = "PaginationNext";
var PaginationEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsxs(
  "span",
  {
    "aria-hidden": true,
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.MoreHorizontal, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "More pages" })
    ]
  }
);
PaginationEllipsis.displayName = "PaginationEllipsis";
var Popover = PopoverPrimitive__namespace.Root;
var PopoverTrigger = PopoverPrimitive__namespace.Trigger;
var PopoverContent = React25__namespace.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(PopoverPrimitive__namespace.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
  PopoverPrimitive__namespace.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-surface border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive__namespace.Content.displayName;
var Progress = React25__namespace.forwardRef(({ className, value, size = "default", ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  ProgressPrimitive__namespace.Root,
  {
    ref,
    value,
    className: cn(
      "relative w-full overflow-hidden rounded-full bg-secondary",
      size === "sm" ? "h-1" : "h-4",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntime.jsx(
      ProgressPrimitive__namespace.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive__namespace.Root.displayName;
function Questionnaire({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Root,
    {
      "data-slot": "questionnaire",
      className: cn("flex w-full min-w-0 flex-col gap-2", className),
      ...props
    }
  );
}
function QuestionnaireProgressBar({
  label,
  value,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      "data-slot": "questionnaire-progress",
      className: cn(
        "flex min-h-[1lh] items-center gap-2 font-mono text-xs tabular-nums text-muted-foreground",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0", children: label }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "relative h-[3px] flex-1 overflow-hidden rounded-full bg-border", children: /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: "absolute inset-y-0 start-0 rounded-full bg-primary transition-[width]",
            style: { width: `${Math.min(1, Math.max(0, value)) * 100}%` }
          }
        ) })
      ]
    }
  );
}
function QuestionnaireProgress({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Progress,
    {
      "data-slot": "questionnaire-progress",
      render: (rendered, { current, total }) => /* @__PURE__ */ jsxRuntime.jsx(
        QuestionnaireProgressBar,
        {
          ...rendered,
          className,
          label: children ?? (total ? `${current} of ${total}` : null),
          value: total ? current / total : 0
        }
      ),
      ...props
    }
  );
}
function QuestionnaireItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Item,
    {
      "data-slot": "questionnaire-item",
      className: cn(
        "flex min-w-0 flex-col gap-2 border-0 p-0 outline-none",
        className
      ),
      ...props
    }
  );
}
function QuestionnaireTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Title,
    {
      "data-slot": "questionnaire-title",
      className: cn(
        // A legend is not a flex item, so the item's gap does not reach it.
        "p-0 text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-2",
        className
      ),
      ...props
    }
  );
}
function QuestionnaireDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Description,
    {
      "data-slot": "questionnaire-description",
      className: cn("text-sm text-pretty text-muted-foreground", className),
      ...props
    }
  );
}
function QuestionnaireChoices({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Choices,
    {
      "data-slot": "questionnaire-choices",
      className: cn("group/questionnaire-choices grid min-w-0 gap-1.5", className),
      ...props
    }
  );
}
var FIGURE_TONE = {
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive"
};
function QuestionnaireChoice({
  children,
  className,
  detail,
  readOnly,
  disabled,
  lead,
  figure,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    questionnaire.Questionnaire.Choice,
    {
      "data-slot": "questionnaire-choice",
      "data-readonly": readOnly ? "" : void 0,
      "data-lead": lead != null ? "" : void 0,
      disabled: disabled || readOnly,
      className: cn(
        "group/questionnaire-choice relative flex min-h-7 cursor-pointer select-none items-start gap-2 rounded-control border border-border px-2 py-1 text-start outline-none transition-colors hover:bg-muted/50",
        // A choice with a second line, or a lead, breathes a little more.
        "has-[[data-slot=questionnaire-choice-description]]:py-1.5 data-[lead]:py-1.5",
        "has-[>input:focus-visible]:ring-2 has-[>input:focus-visible]:ring-ring has-[>input:focus-visible]:ring-offset-2 has-[>input:focus-visible]:ring-offset-background",
        "data-[checked]:border-primary/45 data-[checked]:bg-primary/15 data-[invalid]:border-destructive",
        readOnly ? "pointer-events-none cursor-default" : "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          questionnaire.Questionnaire.ChoiceInput,
          {
            "data-slot": "questionnaire-choice-input",
            className: "absolute inset-0 z-10 size-full cursor-pointer opacity-0"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "span",
          {
            "aria-hidden": "true",
            "data-slot": "questionnaire-choice-indicator",
            className: "pointer-events-none relative mt-[0.25em] flex size-[1em] group-data-[lead]/questionnaire-choice:mt-[0.5em] shrink-0 items-center justify-center rounded-control border border-muted-foreground group-data-[type=radio]/questionnaire-choice:rounded-full group-data-[checked]/questionnaire-choice:border-primary group-data-[type=checkbox]/questionnaire-choice:group-data-[checked]/questionnaire-choice:bg-primary group-data-[checked]/questionnaire-choice:text-primary-foreground",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  "data-slot": "questionnaire-choice-indicator-dot",
                  className: "hidden size-[0.46em] rounded-full bg-primary group-data-[type=radio]/questionnaire-choice:group-data-[checked]/questionnaire-choice:block"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "svg",
                {
                  "data-slot": "questionnaire-choice-indicator-check",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 3,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "hidden size-[0.75em] group-data-[type=checkbox]/questionnaire-choice:group-data-[checked]/questionnaire-choice:block",
                  children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M20 6 9 17l-5-5" })
                }
              )
            ]
          }
        ),
        lead != null ? /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            "aria-hidden": "true",
            "data-slot": "questionnaire-choice-lead",
            className: "pointer-events-none flex size-[2em] shrink-0 items-center justify-center rounded-control border border-border/60 bg-muted font-mono text-xs text-muted-foreground [&_svg]:size-[1.1em]",
            children: lead
          }
        ) : null,
        /* @__PURE__ */ jsxRuntime.jsx(
          questionnaire.Questionnaire.ChoiceLabel,
          {
            "data-slot": "questionnaire-choice-label",
            className: "flex min-w-0 flex-1 flex-col gap-0.5 self-baseline group-data-[lead]/questionnaire-choice:self-start",
            children
          }
        ),
        figure != null ? /* @__PURE__ */ jsxRuntime.jsxs(
          "span",
          {
            "data-slot": "questionnaire-choice-figure",
            className: "ms-auto flex shrink-0 flex-col items-end self-start whitespace-nowrap font-mono",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("text-sm font-medium tabular-nums", FIGURE_TONE[figure.tone ?? ""]), children: figure.value }),
              figure.unit != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground", children: figure.unit }) : null
            ]
          }
        ) : detail != null ? /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            "data-slot": "questionnaire-choice-detail",
            className: "ms-auto shrink-0 self-baseline font-mono text-xs text-muted-foreground",
            children: detail
          }
        ) : null,
        /* @__PURE__ */ jsxRuntime.jsx(
          questionnaire.Questionnaire.ChoiceShortcut,
          {
            "data-slot": "questionnaire-choice-shortcut",
            className: "pointer-events-none ms-auto hidden size-5 shrink-0 items-center justify-center rounded-control border border-border bg-background font-mono text-xs font-medium leading-none text-muted-foreground group-data-[shortcut]/questionnaire-choice:inline-flex"
          }
        )
      ]
    }
  );
}
function QuestionnaireChoiceTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      "data-slot": "questionnaire-choice-title",
      className: cn("[&:has(~[data-slot=questionnaire-choice-description])]:font-medium", className),
      ...props
    }
  );
}
function QuestionnaireChoiceDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      "data-slot": "questionnaire-choice-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function QuestionnaireInput({ className, unit, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      "data-slot": "questionnaire-input-wrapper",
      className: "group/questionnaire-input relative flex w-full min-w-0 items-center",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          questionnaire.Questionnaire.Input,
          {
            "data-slot": "questionnaire-input",
            className: cn(
              "flex h-7 w-full min-w-0 rounded-control border border-border bg-background px-2 py-1 outline-none transition-colors placeholder:text-muted-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
              unit != null && "pe-10",
              className
            ),
            ...props
          }
        ),
        unit != null ? /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            "data-slot": "questionnaire-input-unit",
            className: "pointer-events-none absolute end-2 font-mono text-sm text-muted-foreground",
            children: unit
          }
        ) : null
      ]
    }
  );
}
function QuestionnaireError({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Error,
    {
      "data-slot": "questionnaire-error",
      className: cn("text-sm text-destructive", className),
      ...props
    }
  );
}
function QuestionnaireActions({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "questionnaire-actions",
      className: cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-1.5",
        className
      ),
      ...props
    }
  );
}
function QuestionnairePrevious({
  children,
  className,
  size = "xs",
  variant = "outline",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Previous,
    {
      "data-slot": "questionnaire-previous",
      className: cn(
        buttonVariants({ size, variant }),
        "col-start-1 row-start-1 justify-self-start",
        className
      ),
      ...props,
      children: children ?? "Previous"
    }
  );
}
function QuestionnaireSkip({
  children,
  className,
  size = "xs",
  variant = "ghost",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Skip,
    {
      "data-slot": "questionnaire-skip",
      className: cn(
        buttonVariants({ size, variant }),
        "col-start-2 row-start-1 justify-self-end",
        className
      ),
      ...props,
      children: children ?? "Skip"
    }
  );
}
function QuestionnaireNext({
  children,
  className,
  size = "xs",
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Next,
    {
      "data-slot": "questionnaire-next",
      className: cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        className
      ),
      ...props,
      children: children ?? "Next"
    }
  );
}
function QuestionnaireSubmit({
  children,
  className,
  size = "xs",
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    questionnaire.Questionnaire.Submit,
    {
      "data-slot": "questionnaire-submit",
      className: cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        className
      ),
      ...props,
      children: children ?? "Submit"
    }
  );
}
var ResizablePanelGroup = (props) => /* @__PURE__ */ jsxRuntime.jsx(reactResizablePanels.Group, { ...props });
var ResizablePanel = reactResizablePanels.Panel;
var ResizableHandle = ({
  withHandle,
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
  reactResizablePanels.Separator,
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
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "z-10 h-6 w-[3px] rounded-full bg-muted-foreground/40" })
  }
);
var ScrollArea = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  ScrollAreaPrimitive__namespace.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx(ScrollAreaPrimitive__namespace.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntime.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntime.jsx(ScrollAreaPrimitive__namespace.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive__namespace.Root.displayName;
var ScrollBar = React25__namespace.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  ScrollAreaPrimitive__namespace.ScrollAreaScrollbar,
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
    children: /* @__PURE__ */ jsxRuntime.jsx(ScrollAreaPrimitive__namespace.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive__namespace.ScrollAreaScrollbar.displayName;
var GROUP_HEIGHT = { xs: "h-control-xs", sm: "h-control-sm", md: "h-control-md" };
var GROUP_MIN_HEIGHT = {
  xs: "min-h-control-xs",
  sm: "min-h-control-sm",
  md: "min-h-control-md"
};
var SegmentedControl = React25__namespace.forwardRef(
  ({
    options,
    value,
    defaultValue,
    onValueChange,
    size = "md",
    stretch,
    variant = "tint",
    readOnly,
    className,
    ...props
  }, ref) => {
    const [internal, setInternal] = React25__namespace.useState(
      defaultValue === void 0 ? options[0]?.value ?? null : defaultValue
    );
    const active = value === void 0 ? internal : value;
    const entry = options.some((o) => o.value === active) ? active : options.find((o) => !o.disabled)?.value;
    const refs = React25__namespace.useRef([]);
    const select = (next) => {
      if (readOnly) return;
      if (value === void 0) setInternal(next);
      onValueChange?.(next);
    };
    const onKeyDown = (event, index) => {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!forward && !back) return;
      event.preventDefault();
      const step = forward ? 1 : -1;
      for (let i = 1; i <= options.length; i += 1) {
        const next = options[(index + step * i + options.length * i) % options.length];
        if (next && !next.disabled) {
          select(next.value);
          refs.current[options.indexOf(next)]?.focus();
          return;
        }
      }
    };
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        role: "radiogroup",
        "aria-readonly": readOnly || void 0,
        className: cn(
          "inline-flex overflow-hidden rounded-control border border-border",
          // The height is the group's, border included, so it matches every
          // other control of the same size; the options stretch to fill it.
          // An option with a second line sets a floor instead.
          (options.some((o) => o.sub != null) ? GROUP_MIN_HEIGHT : GROUP_HEIGHT)[size],
          // Its own width, even as the child of a column that stretches.
          stretch ? "flex w-full" : "self-start",
          className
        ),
        ...props,
        children: options.map((option, index) => {
          const on = option.value === active;
          return /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              ref: (node) => {
                refs.current[index] = node;
              },
              type: "button",
              role: "radio",
              "aria-checked": on,
              disabled: option.disabled,
              tabIndex: option.value === entry ? 0 : -1,
              onClick: () => select(option.value),
              onKeyDown: (event) => onKeyDown(event, index),
              className: cn(
                "min-w-0 truncate text-center whitespace-nowrap",
                // Stretched, each option has its share already; padding would only truncate it.
                variant === "solid" ? stretch ? "px-1" : "px-3" : "px-2",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                // Two lines take the height they need.
                option.sub != null && "py-1",
                stretch && "flex-1",
                variant === "solid" ? cn(
                  "border-e border-border last:border-e-0",
                  on ? "bg-primary text-primary-foreground" : cn("text-foreground", !readOnly && "hover:bg-accent")
                ) : on ? "bg-primary/12 font-medium text-primary" : cn("text-muted-foreground", !readOnly && "hover:bg-accent hover:text-foreground"),
                readOnly && "cursor-default",
                option.disabled && "pointer-events-none opacity-50"
              ),
              children: option.sub != null ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex flex-col items-center leading-tight", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: option.label }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("truncate font-mono text-xs", on && variant === "solid" ? "opacity-85" : "text-muted-foreground"), children: option.sub })
              ] }) : option.label
            },
            option.value
          );
        })
      }
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";
var Sheet = DialogPrimitive__namespace.Root;
var SheetTrigger = DialogPrimitive__namespace.Trigger;
var SheetClose = DialogPrimitive__namespace.Close;
var SheetPortal = DialogPrimitive__namespace.Portal;
var SheetOverlay = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogPrimitive__namespace.Overlay.displayName;
var sheetVariants = classVarianceAuthority.cva(
  "fixed z-50 gap-4 bg-card text-card-foreground p-6 shadow-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
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
var SheetContent = React25__namespace.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntime.jsxs(
    DialogPrimitive__namespace.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsxs(DialogPrimitive__namespace.Close, { className: "absolute right-4 top-4 rounded-control opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
SheetContent.displayName = DialogPrimitive__namespace.Content.displayName;
var SheetHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
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
}) => /* @__PURE__ */ jsxRuntime.jsx(
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
var SheetTitle = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive__namespace.Title.displayName;
var SheetDescription = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Description,
  {
    ref,
    className: cn("text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = DialogPrimitive__namespace.Description.displayName;
var MOBILE_BREAKPOINT = 768;
var QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
function subscribe(onChange) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}
function useIsMobile() {
  return React25__namespace.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
var TooltipProvider = TooltipPrimitive__namespace.Provider;
var Tooltip = TooltipPrimitive__namespace.Root;
var TooltipTrigger = TooltipPrimitive__namespace.Trigger;
var TooltipContent = React25__namespace.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  TooltipPrimitive__namespace.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-surface border border-border bg-popover px-3 py-1.5 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive__namespace.Content.displayName;
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React25__namespace.createContext(null);
function useSidebar() {
  const context = React25__namespace.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
var SidebarProvider = React25__namespace.forwardRef(
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
    const [openMobile, setOpenMobile] = React25__namespace.useState(false);
    const [_open, _setOpen] = React25__namespace.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React25__namespace.useCallback(
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
    const toggleSidebar = React25__namespace.useCallback(() => {
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile]);
    React25__namespace.useEffect(() => {
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
    const contextValue = React25__namespace.useMemo(
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
    return /* @__PURE__ */ jsxRuntime.jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxRuntime.jsx(
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
var Sidebar = React25__namespace.forwardRef(
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
      return /* @__PURE__ */ jsxRuntime.jsx(
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
      return /* @__PURE__ */ jsxRuntime.jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxRuntime.jsxs(
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
            /* @__PURE__ */ jsxRuntime.jsxs(SheetHeader, { className: "sr-only", children: [
              /* @__PURE__ */ jsxRuntime.jsx(SheetTitle, { children: "Sidebar" }),
              /* @__PURE__ */ jsxRuntime.jsx(SheetDescription, { children: "Displays the mobile sidebar." })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-full w-full flex-col", children })
          ]
        }
      ) });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        className: "group peer hidden text-sidebar-foreground md:block",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
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
          /* @__PURE__ */ jsxRuntime.jsx(
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
              children: /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarTrigger = React25__namespace.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.PanelLeft, {}),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarInset = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarInput = React25__namespace.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarHeader = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarFooter = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarSeparator = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarContent = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarGroup = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarGroupLabel = React25__namespace.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "div";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-sm font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = React25__namespace.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "button";
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarGroupContent = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    "data-sidebar": "group-content",
    className: cn("w-full", className),
    ...props
  }
));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...props
  }
));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "li",
  {
    ref,
    "data-sidebar": "menu-item",
    className: cn("group/menu-item relative", className),
    ...props
  }
));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = classVarianceAuthority.cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-control p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-control-md",
        sm: "h-control-sm",
        lg: "h-control-lg text-lg group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var SidebarMenuButton = React25__namespace.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? reactSlot.Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsxRuntime.jsx(
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
    return /* @__PURE__ */ jsxRuntime.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarMenuAction = React25__namespace.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "button";
  return /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarMenuBadge = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-sm font-medium tabular-nums text-sidebar-foreground",
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
var SidebarMenuSkeleton = React25__namespace.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const [width] = React25__namespace.useState(() => `${Math.floor(Math.random() * 40) + 50}%`);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("flex h-control-md items-center gap-2 rounded-md px-2", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsxRuntime.jsx(
          Skeleton,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarMenuSub = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarMenuSubItem = React25__namespace.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = React25__namespace.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "a";
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    sonner.Toaster,
    {
      className: cn("toaster group", props.className),
      icons: {
        success: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CircleCheckIcon, { className: "size-4 text-green-500" }),
        info: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.InfoIcon, { className: "size-4 text-blue-500" }),
        warning: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.TriangleAlertIcon, { className: "size-4 text-yellow-500" }),
        error: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.OctagonXIcon, { className: "size-4 text-red-500" }),
        loading: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Loader2Icon, { className: "size-4 animate-spin text-blue-500" })
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    lucideReact.Loader2Icon,
    {
      role: "status",
      "aria-label": "Loading",
      className: cn("size-4 animate-spin", className),
      ...props
    }
  );
}
var stackVariants = classVarianceAuthority.cva("flex min-w-0", {
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row"
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-6"
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline"
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between"
    },
    /** A row that runs out of width carries on below — chips, badges, buttons. */
    wrap: {
      true: "flex-wrap",
      false: ""
    },
    /**
     * A page: the stack takes its parent's height and its last child grows
     * into what the others leave — a header, then a canvas or a split.
     */
    fill: {
      true: "h-full min-h-0 [&>:last-child]:min-h-0 [&>:last-child]:flex-1",
      false: ""
    }
  },
  defaultVariants: {
    direction: "column",
    gap: "md"
  }
});
var Stack = React25__namespace.forwardRef(
  ({ className, direction, gap, align, justify, wrap, fill, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      className: cn(
        stackVariants({
          direction,
          gap,
          // A row lines its items up on their centres unless told otherwise.
          align: align ?? (direction === "row" ? "center" : void 0),
          justify,
          wrap,
          fill
        }),
        className
      ),
      ...props
    }
  )
);
Stack.displayName = "Stack";
var statusDotVariants = classVarianceAuthority.cva("inline-block shrink-0 rounded-full", {
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
var StatusDot = React25__namespace.forwardRef(
  ({ className, tone, size, label, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var GLYPH = {
  success: lucideReact.CircleCheck,
  error: lucideReact.CircleX,
  running: lucideReact.LoaderCircle,
  queued: lucideReact.Clock,
  waiting: lucideReact.CirclePause,
  question: lucideReact.CircleHelp,
  alert: lucideReact.CircleAlert,
  cancelled: lucideReact.CircleSlash
};
var statusIconVariants = classVarianceAuthority.cva("inline-block shrink-0", {
  variants: {
    state: {
      /** Finished, and the result stands. */
      success: "text-success",
      /** Failed. */
      error: "text-destructive",
      /** Work in flight. The only state that animates. */
      running: "text-info animate-spin motion-reduce:animate-none",
      /** Not started. */
      queued: "text-muted-foreground",
      /** Parked on a person — an approval, an answer. */
      waiting: "text-warning",
      /** Finished, but it could not answer. */
      question: "text-warning",
      /** Finished, but only in part. */
      alert: "text-warning",
      /** Stopped before it finished. */
      cancelled: "text-muted-foreground"
    },
    size: {
      /** 14px — a dense row. */
      sm: "size-3.5",
      /** 16px — a list row. */
      md: "size-4"
    }
  },
  defaultVariants: {
    state: "queued",
    size: "md"
  }
});
var StatusIcon = React25__namespace.forwardRef(
  ({ state, size, label, className, ...props }, ref) => {
    const Glyph = GLYPH[state];
    return /* @__PURE__ */ jsxRuntime.jsx(
      Glyph,
      {
        ref,
        className: cn(statusIconVariants({ state, size }), className),
        role: label ? "img" : void 0,
        "aria-label": label,
        "aria-hidden": label ? void 0 : true,
        ...props,
        children: label ? /* @__PURE__ */ jsxRuntime.jsx("title", { children: label }) : null
      }
    );
  }
);
StatusIcon.displayName = "StatusIcon";
var Table = React25__namespace.forwardRef(({ className, density = "default", seamless, bordered = true, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    "data-density": density,
    "data-seamless": seamless || void 0,
    className: cn(
      "group/table relative w-full overflow-auto",
      bordered && !seamless && "border rounded-md",
      seamless && "[&_td:first-child]:ps-0 [&_th:first-child]:ps-0 [&_td:last-child]:pe-0 [&_th:last-child]:pe-0"
    ),
    children: /* @__PURE__ */ jsxRuntime.jsx(
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
var TableHeader = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "thead",
  {
    ref,
    className: cn("bg-chrome group-data-[seamless]/table:bg-transparent [&_tr]:border-b", className),
    ...props
  }
));
TableHeader.displayName = "TableHeader";
var TableBody = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
var TableFooter = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var TableRow = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
var TableHead = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "th",
  {
    ref,
    className: cn(
      "h-control-md px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      // Density: `<Table density>` marks the wrapper, and every cell follows
      // from there. One prop on the table rather than a size on <TableHead>
      // and <TableCell> individually — four places to forget, and a table with
      // two densities in it is always a mistake.
      //
      // Each density is a step of the control scale — compact `sm` (26px),
      // default `md` (32px), comfortable `lg` (40px) — and the header is the
      // row's height, so a toolbar control of the same size lines up with a row.
      "group-data-[density=compact]/table:h-control-sm group-data-[density=compact]/table:text-sm",
      "group-data-[density=comfortable]/table:h-control-lg group-data-[density=comfortable]/table:px-3",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
var TableCell = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "td",
  {
    ref,
    className: cn(
      "h-control-md px-2 py-1 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      "group-data-[density=compact]/table:h-control-sm group-data-[density=compact]/table:py-0",
      "group-data-[density=comfortable]/table:h-control-lg group-data-[density=comfortable]/table:px-3 group-data-[density=comfortable]/table:py-2.5",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
var TableCaption = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
var TabsSizeContext = React25__namespace.createContext("default");
var Tabs = React25__namespace.forwardRef(({ size = "default", ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(TabsSizeContext.Provider, { value: size, children: /* @__PURE__ */ jsxRuntime.jsx(TabsPrimitive__namespace.Root, { ref, ...props }) }));
Tabs.displayName = TabsPrimitive__namespace.Root.displayName;
var TabsList = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  const size = React25__namespace.useContext(TabsSizeContext);
  return /* @__PURE__ */ jsxRuntime.jsx(
    TabsPrimitive__namespace.List,
    {
      ref,
      className: cn(
        "inline-flex items-center justify-center text-muted-foreground",
        // The list is the control: its height is on the scale, so it lines up
        // with a button or search beside it. The default's triggers sit inset.
        size === "sm" ? "h-control-sm gap-1" : "h-control-md rounded-lg bg-muted p-0.5",
        className
      ),
      ...props
    }
  );
});
TabsList.displayName = TabsPrimitive__namespace.List.displayName;
var TabsTrigger = React25__namespace.forwardRef(({ className, ...props }, ref) => {
  const size = React25__namespace.useContext(TabsSizeContext);
  return /* @__PURE__ */ jsxRuntime.jsx(
    TabsPrimitive__namespace.Trigger,
    {
      ref,
      className: cn(
        size === "sm" ? "h-control-sm px-2" : "h-full px-3",
        "inline-flex items-center justify-center whitespace-nowrap rounded-control font-medium ring-offset-background transition-colors text-muted-foreground hover:text-foreground hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:ring-1 data-[state=active]:ring-primary/25 data-[state=active]:shadow-sm",
        className
      ),
      ...props
    }
  );
});
TabsTrigger.displayName = TabsPrimitive__namespace.Trigger.displayName;
var TabsContent = React25__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  TabsPrimitive__namespace.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive__namespace.Content.displayName;
var toggleVariants = classVarianceAuthority.cva(
  "inline-flex items-center justify-center rounded-control font-medium ring-offset-background transition-colors text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary/15 data-[state=on]:text-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/25 data-[state=on]:shadow-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted hover:text-foreground data-[state=on]:border-primary/30"
      },
      size: {
        // The control scale: sm 26 / default 32 / lg 40 at a 13px root.
        default: "h-control-md px-3 min-w-control-md",
        sm: "h-control-sm px-2 min-w-control-sm",
        lg: "h-control-lg px-4 min-w-control-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Toggle = React25__namespace.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  TogglePrimitive__namespace.Root,
  {
    ref,
    className: cn(toggleVariants({ variant, size, className })),
    ...props
  }
));
Toggle.displayName = TogglePrimitive__namespace.Root.displayName;
var ToggleGroupContext = React25__namespace.createContext({
  size: "default",
  variant: "default"
});
var ToggleGroup = React25__namespace.forwardRef(({ className, variant, size, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  ToggleGroupPrimitive__namespace.Root,
  {
    ref,
    className: cn("flex items-center justify-center gap-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntime.jsx(ToggleGroupContext.Provider, { value: { variant, size }, children })
  }
));
ToggleGroup.displayName = ToggleGroupPrimitive__namespace.Root.displayName;
var ToggleGroupItem = React25__namespace.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React25__namespace.useContext(ToggleGroupContext);
  return /* @__PURE__ */ jsxRuntime.jsx(
    ToggleGroupPrimitive__namespace.Item,
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
ToggleGroupItem.displayName = ToggleGroupPrimitive__namespace.Item.displayName;
var WORD = {
  unrecorded: "nothing recorded",
  purged: "purged",
  "declared-none": "none declared"
};
var AbsenceNote = React25__namespace.forwardRef(
  ({ reason, label, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn("flex flex-col gap-1 px-2.5 py-2", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono text-xs tracking-wide text-muted-foreground", children: label ?? WORD[reason] }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm leading-relaxed text-muted-foreground", children })
      ]
    }
  )
);
AbsenceNote.displayName = "AbsenceNote";
var TONE = {
  allowed: "text-foreground",
  denied: "text-destructive",
  refused: "text-destructive line-through decoration-destructive/50",
  untouched: "text-muted-foreground/70"
};
function split(address) {
  const cut = address.lastIndexOf("/");
  if (cut < 0) return { head: "", tail: address };
  return { head: address.slice(0, cut + 1), tail: address.slice(cut + 1) };
}
var AddressChip = React25__namespace.forwardRef(
  ({ address, tone = "allowed", onOpen, className, ...props }, ref) => {
    const { head, tail } = split(address);
    const body = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      head ? (
        // `shrink-[999]` makes the head absorb essentially all the shrink, so
        // the kind gives way before the participant does — but the floor is
        // `2ch`, never `0`. A head that collapses to nothing renders
        // `graph_data/stitch/route_airport@…` as `route_airport@…`, which
        // reads as a whole address, and two different participants can come
        // out identical.
        //
        // Exactly two: `text-overflow` draws the ellipsis only when it fits,
        // so at `1ch` the browser keeps the raw first character and drops the
        // marker — `groute_airport@…`, a word that was never there. Two is
        // one character plus the ellipsis, which is the narrowest honest
        // truncation. Every `ch` above that is one the participant loses.
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-[2ch] shrink-[999] truncate opacity-60", children: head })
      ) : null,
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 shrink truncate", children: tail })
    ] });
    const shell = cn(
      "inline-flex min-w-0 max-w-full items-baseline font-mono text-sm",
      TONE[tone] ?? "text-foreground",
      className
    );
    if (onOpen) {
      return /* @__PURE__ */ jsxRuntime.jsx("span", { ref, className: cn(shell, "min-w-0"), ...props, children: /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          title: address,
          onClick: () => onOpen(address),
          className: cn(
            "inline-flex min-w-0 max-w-full cursor-pointer items-baseline rounded-control",
            "hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          ),
          children: body
        }
      ) });
    }
    return /* @__PURE__ */ jsxRuntime.jsx("span", { ref, title: address, className: shell, ...props, children: body });
  }
);
AddressChip.displayName = "AddressChip";
var agentChipVariants = classVarianceAuthority.cva(
  "inline-flex max-w-full shrink-0 items-center gap-1 rounded-control border px-1.5   text-sm [&_svg]:size-3 [&_svg]:shrink-0",
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
var AgentChip = React25__namespace.forwardRef(
  ({ icon, name, kind, inactive, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "span",
    {
      ref,
      className: cn(agentChipVariants({ kind, inactive }), className),
      ...props,
      children: [
        icon ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex shrink-0 items-center text-muted-foreground", children: icon }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: name })
      ]
    }
  )
);
AgentChip.displayName = "AgentChip";
function summarizeReach(models) {
  const readable = models.filter((m) => m.access !== "denied");
  const counting = readable.some((m) => m.records == null);
  const records = readable.reduce((sum, m) => sum + (m.records ?? 0), 0);
  return { readable: readable.length, total: models.length, records, counting };
}
var compact = new Intl.NumberFormat(void 0, { notation: "compact", maximumFractionDigits: 1 });
var formatRecords = (n) => compact.format(n);
var DataReach = React25__namespace.forwardRef(
  ({ models, onRequestAccess, className, ...props }, ref) => {
    const sum = summarizeReach(models);
    const denied = models.filter((m) => m.access === "denied");
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: cn("flex min-w-0 flex-col gap-2", className), ...props, children: [
      /* @__PURE__ */ jsxRuntime.jsxs(Table, { seamless: true, density: "compact", children: [
        /* @__PURE__ */ jsxRuntime.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(TableHead, { children: "Model" }),
          /* @__PURE__ */ jsxRuntime.jsx(TableHead, { className: "text-right", children: "Records" }),
          /* @__PURE__ */ jsxRuntime.jsx(TableHead, { children: "Access" }),
          /* @__PURE__ */ jsxRuntime.jsx(TableHead, { children: "Slice" })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(TableBody, { children: models.map((m) => {
          const access = m.access === "denied" ? null : m.access;
          const off = access == null;
          return /* @__PURE__ */ jsxRuntime.jsxs(TableRow, { className: cn(off && "text-muted-foreground"), children: [
            /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: cn(off && "line-through"), children: m.name }),
            /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "text-right font-mono tabular-nums", children: off ? "\u2014" : m.records == null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "counting\u2026" }) : m.records.toLocaleString() }),
            /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "whitespace-nowrap", children: access ? access.join(" \xB7 ") : "denied" }),
            /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "text-sm text-muted-foreground", children: off ? "\u2014" : m.slice ?? "\u2014" })
          ] }, m.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "tabular-nums", children: [
          sum.readable,
          " of ",
          sum.total,
          " models \xB7 ",
          sum.records.toLocaleString(),
          " records",
          sum.counting ? " so far" : ""
        ] }),
        denied.length && onRequestAccess ? /* @__PURE__ */ jsxRuntime.jsxs(
          Button,
          {
            variant: "link",
            size: "sm",
            className: "ml-auto h-auto p-0",
            onClick: () => onRequestAccess(denied.map((m) => m.id)),
            children: [
              "Request access to ",
              denied.length,
              " ",
              denied.length === 1 ? "model" : "models",
              " \u2192"
            ]
          }
        ) : null
      ] })
    ] });
  }
);
DataReach.displayName = "DataReach";
var EgressList = React25__namespace.forwardRef(
  ({ to, classes = [], cut = [], className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn("flex min-w-0 flex-col gap-1", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(AddressChip, { address: to }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 flex-col gap-0.5 pl-3", children: [
          classes.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-destructive", children: "nothing may be sent" }) : /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-wrap items-center gap-1 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0", children: "may send" }),
            classes.map((c) => /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: "rounded-control bg-muted px-1 font-mono text-foreground",
                children: c
              },
              c
            ))
          ] }),
          cut.length ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-wrap items-center gap-1 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0", children: "cut" }),
            cut.map((c) => /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: "rounded-control bg-muted px-1 font-mono text-destructive line-through decoration-destructive/50",
                children: c
              },
              c
            ))
          ] }) : null
        ] })
      ]
    }
  )
);
EgressList.displayName = "EgressList";
var Eyebrow = React25__namespace.forwardRef(
  ({ aside, tone = "muted", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex items-center gap-2 text-sm font-semibold uppercase tracking-wide",
        tone === "muted" && "text-muted-foreground",
        tone === "foreground" && "text-foreground",
        tone === "accent" && "text-primary",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate", children }),
        aside != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto shrink-0 font-normal normal-case tracking-normal text-muted-foreground", children: aside }) : null
      ]
    }
  )
);
Eyebrow.displayName = "Eyebrow";
var PropertyList = React25__namespace.forwardRef(
  ({ labelWidth = 78, variant = "default", className, style, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "dl",
    {
      ref,
      "data-label-width": labelWidth === "auto" ? "auto" : void 0,
      "data-variant": variant,
      className: cn(
        "group/property-list",
        labelWidth === "auto" ? "grid grid-cols-[max-content_minmax(0,1fr)] gap-x-3" : "flex flex-col",
        className
      ),
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
var PropertyRow = React25__namespace.forwardRef(
  ({ label, mono, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex items-baseline gap-2 py-1 group-data-[variant=summary]/property-list:py-px",
        // An auto-width list is a grid; each row joins its columns.
        "group-data-[label-width=auto]/property-list:col-span-2 group-data-[label-width=auto]/property-list:grid group-data-[label-width=auto]/property-list:grid-cols-subgrid",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("dt", { className: "shrink-0 truncate text-sm text-muted-foreground [width:var(--property-label-width,78px)] group-data-[label-width=auto]/property-list:w-auto", children: label }),
        /* @__PURE__ */ jsxRuntime.jsx("dd", { className: cn("min-w-0 flex-1", mono && "font-mono text-sm"), children })
      ]
    }
  )
);
PropertyRow.displayName = "PropertyRow";
function Fact({ label, children, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      type: "button",
      "aria-label": label,
      title: label,
      className: "inline-flex min-w-0 items-center gap-1 rounded-control px-1 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-3.5 [&_svg]:shrink-0",
      ...props,
      children
    }
  );
}
function SettingsLink({ onClick, children }) {
  return /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "link", size: "sm", className: "h-auto self-start p-0", onClick, children });
}
var AgentHeader = React25__namespace.forwardRef(
  ({
    title,
    agent,
    status,
    actions,
    access,
    lens,
    budget,
    governance,
    icons = {},
    onRequestAccess,
    onOpenSettings,
    className,
    ...props
  }, ref) => {
    const models = access?.models ?? [];
    const sum = summarizeReach(models);
    const where = access?.kind === "world" ? "entire world" : "access group";
    const second = access || lens || budget || governance;
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: cn("@container/header shrink-0 border-b border-border px-3", className), ...props, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex h-control-md items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate font-medium", children: title }),
        agent ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(AgentChip, { name: agent.name, className: "@max-[420px]/header:hidden" }),
          agent.version || agent.model ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm text-muted-foreground @max-[520px]/header:hidden", children: [agent.version, agent.model].filter(Boolean).join(" \xB7 ") }) : null
        ] }) : null,
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "ml-auto flex shrink-0 items-center gap-2", children: [
          status ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntime.jsx(StatusDot, { tone: status.tone }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn(status.short && "@max-[420px]/header:hidden"), children: status.label }),
            status.short ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "@min-[421px]/header:hidden", children: status.short }) : null
          ] }) : null,
          actions
        ] })
      ] }),
      second ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "-mx-1 flex min-w-0 items-center gap-2 pb-1.5 text-sm text-muted-foreground", children: [
        agent ? /* @__PURE__ */ jsxRuntime.jsx(AgentChip, { name: agent.name, className: "@min-[421px]/header:hidden" }) : null,
        access ? /* @__PURE__ */ jsxRuntime.jsxs(Popover, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsxs(Fact, { label: `Data reach: ${access.label}, ${where}`, children: [
            access.kind === "world" ? icons.world : icons.group,
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate", children: access.label }),
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "shrink-0 @max-[420px]/header:hidden", children: [
              "\xB7 ",
              where
            ] }),
            models.length ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "shrink-0 tabular-nums", children: [
              "\xB7 ",
              sum.readable,
              "/",
              sum.total,
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "@max-[420px]/header:hidden", children: " models" }),
              " \xB7 ",
              formatRecords(sum.records),
              sum.counting ? "\u2026" : ""
            ] }) : null
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsxs(PopoverContent, { align: "start", className: "flex w-[min(30rem,calc(100vw-2rem))] flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Eyebrow, { aside: "set for this session", children: "Data reach" }),
            /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
              access.label,
              " \xB7 ",
              where
            ] }),
            models.length ? /* @__PURE__ */ jsxRuntime.jsx(DataReach, { models, onRequestAccess }) : null,
            onOpenSettings ? /* @__PURE__ */ jsxRuntime.jsx(SettingsLink, { onClick: () => onOpenSettings("data"), children: "Open data settings \u2192" }) : null
          ] })
        ] }) : null,
        lens ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 items-center gap-1 @max-[520px]/header:hidden [&_svg]:size-3.5", children: [
          icons.lens,
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: lens })
        ] }) : null,
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "ml-auto flex shrink-0 items-center gap-2", children: [
          budget ? /* @__PURE__ */ jsxRuntime.jsxs(
            "span",
            {
              className: "flex items-center gap-1.5 tabular-nums",
              title: `${budget.used.toLocaleString()} of ${budget.limit.toLocaleString()} tokens`,
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  Progress,
                  {
                    size: "sm",
                    className: "w-10",
                    value: Math.min(100, budget.used / budget.limit * 100),
                    "aria-label": "Token budget"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "@max-[420px]/header:hidden", children: [
                  formatRecords(budget.used),
                  "/",
                  formatRecords(budget.limit)
                ] })
              ]
            }
          ) : null,
          governance ? /* @__PURE__ */ jsxRuntime.jsxs(Popover, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsxs(Fact, { label: `Governance: ${governance.summary}`, children: [
              icons.governance,
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate @max-[420px]/header:hidden", children: governance.summary })
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsxs(PopoverContent, { align: "end", className: "flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Eyebrow, { aside: governance.summary, children: "Governance" }),
              governance.rules?.length ? /* @__PURE__ */ jsxRuntime.jsx(PropertyList, { children: governance.rules.map((r) => /* @__PURE__ */ jsxRuntime.jsx(PropertyRow, { label: r.label, children: r.value }, r.label)) }) : null,
              governance.egress?.map((e) => /* @__PURE__ */ jsxRuntime.jsx(EgressList, { to: e.to, classes: e.classes }, e.to)),
              onOpenSettings ? /* @__PURE__ */ jsxRuntime.jsx(SettingsLink, { onClick: () => onOpenSettings("governance"), children: "Edit in Settings \u2192" }) : null
            ] })
          ] }) : null
        ] })
      ] }) : null
    ] });
  }
);
AgentHeader.displayName = "AgentHeader";
var stateVariants = classVarianceAuthority.cva("inline-flex shrink-0 items-center gap-1.5 font-medium", {
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
var AppStatusBar = React25__namespace.forwardRef(
  ({ state, tone, end, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex h-control-sm shrink-0 items-center gap-2 border-t border-border bg-chrome px-2 text-sm text-muted-foreground",
        className
      ),
      ...props,
      children: [
        state != null ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: cn(stateVariants({ tone })), children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            StatusDot,
            {
              tone: tone === "error" ? "error" : tone === "review" ? "warning" : tone === "running" ? "running" : tone === "draft" ? "muted" : "success"
            }
          ),
          state
        ] }) : null,
        state != null && children ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, children: "\u2022" }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate", children }),
        end != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0", children: end }) : null
      ]
    }
  )
);
AppStatusBar.displayName = "AppStatusBar";
var ArtifactTable = React25__namespace.forwardRef(
  ({ files, variant = "table", onOpen, onDownload, renderActions, className, ...props }, ref) => variant === "list" ? /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("flex flex-col text-sm", className), ...props, children: files.map((file, index) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: "flex items-center gap-2.5 rounded-md border-b border-border/60 py-1 last:border-b-0",
      children: [
        file.icon != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex w-4 shrink-0 justify-center text-muted-foreground", children: file.icon }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("min-w-0 flex-1 truncate", file.gone && "text-muted-foreground line-through"), children: file.name }),
        file.size != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-mono text-xs tabular-nums text-muted-foreground", children: file.size }) : null,
        file.digest != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-mono text-xs text-muted-foreground", children: file.digest }) : null,
        renderActions ? renderActions(file, index) : onDownload ? /* @__PURE__ */ jsxRuntime.jsx(
          Button,
          {
            type: "button",
            variant: "link",
            size: "xs",
            className: "h-auto shrink-0 p-0 text-xs font-normal",
            disabled: file.gone,
            onClick: () => onDownload(file, index),
            children: "Download"
          }
        ) : null
      ]
    },
    index
  )) }) : /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("flex flex-col", className), ...props, children: /* @__PURE__ */ jsxRuntime.jsxs(Table, { density: "compact", children: [
    /* @__PURE__ */ jsxRuntime.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs(TableRow, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(TableHead, { children: "file" }),
      /* @__PURE__ */ jsxRuntime.jsx(TableHead, { className: "w-[7rem]", children: "kind" }),
      /* @__PURE__ */ jsxRuntime.jsx(TableHead, { className: "w-[5rem]", children: "size" }),
      /* @__PURE__ */ jsxRuntime.jsx(TableHead, { className: "w-[7rem]", children: "digest" }),
      /* @__PURE__ */ jsxRuntime.jsx(TableHead, { className: "w-[5.5rem]", children: "written" }),
      /* @__PURE__ */ jsxRuntime.jsx(TableHead, { className: "w-[9.5rem]", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "actions" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(TableBody, { children: files.map((file, index) => /* @__PURE__ */ jsxRuntime.jsxs(TableRow, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        TableCell,
        {
          className: cn(
            "font-mono",
            file.gone && "text-muted-foreground line-through"
          ),
          children: file.name
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(TableCell, { children: file.kind }),
      /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "tabular-nums", children: file.size }),
      /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "font-mono text-muted-foreground", children: file.digest }),
      /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "font-mono tabular-nums", children: file.written }),
      /* @__PURE__ */ jsxRuntime.jsx(TableCell, { children: renderActions ? renderActions(file, index) : /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            disabled: file.gone || !onOpen,
            onClick: () => onOpen?.(file, index),
            children: "Open"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            disabled: file.gone || !onDownload,
            onClick: () => onDownload?.(file, index),
            children: "Download"
          }
        )
      ] }) })
    ] }, index)) })
  ] }) })
);
ArtifactTable.displayName = "ArtifactTable";
function extensionOf(name) {
  if (typeof name !== "string") return null;
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : null;
}
var ArtifactCard = React25__namespace.forwardRef(
  ({ file, note, aside, className, ...props }, ref) => {
    const ext = extensionOf(file.name);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        className: cn("flex items-center gap-2.5 rounded-md border border-border p-2", className),
        ...props,
        children: [
          ext ? /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              "aria-hidden": true,
              className: "flex h-9 w-[30px] shrink-0 items-end justify-center rounded-md border border-border bg-muted pb-[3px] font-mono text-[0.692rem] leading-none text-muted-foreground",
              children: ext
            }
          ) : null,
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("truncate font-semibold", file.gone && "text-muted-foreground line-through"), children: file.name }),
            note != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground", children: note }) : null
          ] }),
          aside != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0", children: aside }) : null
        ]
      }
    );
  }
);
ArtifactCard.displayName = "ArtifactCard";
var UNPAINTED = "bg-muted-foreground";
var BoundChip = React25__namespace.forwardRef(
  ({ bound, swatchOnly, label, swatch, palette, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "span",
    {
      ref,
      className: cn(
        "inline-flex max-w-full shrink-0 items-center gap-1.5 font-mono text-sm text-muted-foreground",
        className
      ),
      "aria-label": swatchOnly ? `bound: ${bound}` : void 0,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            "aria-hidden": true,
            className: cn("size-1.5 shrink-0", swatch ?? palette?.[bound] ?? UNPAINTED)
          }
        ),
        swatchOnly ? null : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: label ?? bound })
      ]
    }
  )
);
BoundChip.displayName = "BoundChip";
function ButtonWithTooltip(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntime.jsxs(Tooltip, { delayDuration: 0, children: [
    /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "ghost", className: cn("hover:bg-transparent", props.className), ...props, children: props.children }) }),
    /* @__PURE__ */ jsxRuntime.jsx(TooltipContent, { children: props.tooltip })
  ] }) });
}
var CannotAnswerCard = React25__namespace.forwardRef(({ label = "cannot answer", remedy, tone = "default", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  "div",
  {
    ref,
    className: cn(
      "flex flex-col gap-1 border border-dashed bg-card p-2",
      tone === "info" ? "border-info/55" : "border-border",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "span",
        {
          className: cn(
            "text-xs font-medium",
            tone === "info" ? "text-info" : "text-muted-foreground"
          ),
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children }),
      remedy != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground", children: remedy }) : null
    ]
  }
));
CannotAnswerCard.displayName = "CannotAnswerCard";
var CAST_ROLES = ["extract", "decide", "judge", "embed"];
var PURPOSE = {
  extract: "prose in, structure out \u2014 the cheap one",
  decide: "writes the number a person acts on",
  judge: "scores an output \u2014 often local",
  embed: "text in, vector out"
};
var CastTable = React25__namespace.forwardRef(
  ({ cast = {}, resolved, readOnly, seamless, bordered, className, ...props }, ref) => {
    const byRole = new Map((resolved ?? []).map((r) => [r.role, r]));
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: cn("min-w-0", className), ...props, children: [
      /* @__PURE__ */ jsxRuntime.jsxs(Table, { density: "compact", seamless, bordered, children: [
        /* @__PURE__ */ jsxRuntime.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(TableHead, { className: "w-[5.5rem]", children: "role" }),
          /* @__PURE__ */ jsxRuntime.jsx(TableHead, { children: "resolves to" }),
          /* @__PURE__ */ jsxRuntime.jsx(TableHead, { children: "why this one" })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(TableBody, { children: CAST_ROLES.map((role) => {
          const hit = byRole.get(role);
          const address = hit ? hit.address : cast[role] ?? null;
          const denied = hit ? !hit.allowed : false;
          return /* @__PURE__ */ jsxRuntime.jsxs(TableRow, { "data-role": role, children: [
            /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "font-mono text-sm text-muted-foreground", children: role }),
            /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "min-w-0", children: address ? /* @__PURE__ */ jsxRuntime.jsx(
              AddressChip,
              {
                address,
                tone: denied ? "denied" : "allowed"
              }
            ) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground/70", children: "nothing casts it" }) }),
            /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: "text-sm text-muted-foreground", children: denied ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-destructive", children: [
              "denied by ",
              hit?.ruleMatched ?? "this world"
            ] }) : hit?.source ? /* @__PURE__ */ jsxRuntime.jsx("span", { children: hit.source !== "shipped" ? `set on the ${hit.source}` : address ? "shipped default" : (
              // No address *and* nothing shipped resolves it —
              // the one row that says the run may open on a
              // model this Graph never chose.
              "nothing casts it, and no shipped default resolves it"
            ) }) : PURPOSE[role] })
          ] }, role);
        }) })
      ] }),
      readOnly ? null : /* @__PURE__ */ jsxRuntime.jsx("p", { className: "px-2 pt-1 text-sm text-muted-foreground/70", children: "A cast picks within the rules \u2014 it never widens them." })
    ] });
  }
);
CastTable.displayName = "CastTable";
var TONE2 = {
  warning: { box: "bg-warning/15", label: "text-warning" },
  info: { box: "bg-info/15", label: "text-info" },
  destructive: { box: "bg-destructive/15", label: "text-destructive" }
};
var CaveatNote = React25__namespace.forwardRef(
  ({ label, tone = "warning", action, onAction, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn("flex items-baseline gap-2 px-2 py-1.5 text-sm", TONE2[tone].box, className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("shrink-0 whitespace-nowrap font-mono text-xs font-semibold", TONE2[tone].label), children: label }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "min-w-0", children: [
          children,
          action != null ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            " ",
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                onClick: onAction,
                className: "whitespace-nowrap text-xs text-primary hover:underline focus-visible:underline focus-visible:outline-none",
                children: action
              }
            )
          ] }) : null
        ] })
      ]
    }
  )
);
CaveatNote.displayName = "CaveatNote";
function ChatSession({
  children,
  footer,
  emptyState,
  autoScrollKey,
  followThreshold = 80,
  className,
  bodyClassName
}) {
  const rootRef = React25__namespace.useRef(null);
  const contentRef = React25__namespace.useRef(null);
  const pinnedRef = React25__namespace.useRef(true);
  const getViewport = React25__namespace.useCallback(
    () => rootRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) ?? null,
    []
  );
  const scrollToBottom = React25__namespace.useCallback(() => {
    const viewport = getViewport();
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [getViewport]);
  React25__namespace.useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;
    const handleScroll = () => {
      const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      pinnedRef.current = distance <= followThreshold;
    };
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [getViewport, followThreshold]);
  React25__namespace.useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) scrollToBottom();
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToBottom]);
  React25__namespace.useEffect(() => {
    pinnedRef.current = true;
    scrollToBottom();
  }, [autoScrollKey, scrollToBottom]);
  const isEmpty = React25__namespace.Children.count(children) === 0;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col h-full min-h-0", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ScrollArea,
      {
        ref: rootRef,
        className: "flex-1 min-h-0 [&_[data-radix-scroll-area-viewport]>div]:!block",
        children: isEmpty && emptyState ? emptyState : /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "inline-flex items-center gap-0.5", "aria-label": "Running", children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w-1 h-1 rounded-full bg-current animate-bounce" })
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
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("flex justify-end", className), children: /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: cn(
          "max-w-[85%] bg-primary/15 px-3 py-2 text-foreground whitespace-pre-wrap break-words",
          icon && "flex items-center gap-1.5"
        ),
        children: [
          icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 opacity-70", children: icon }),
          icon ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 break-words", children }) : children
        ]
      }
    ) });
  }
  if (status === "running") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex items-center gap-2 text-muted-foreground", className), children: [
      icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0", children: icon }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children }),
      /* @__PURE__ */ jsxRuntime.jsx(RunningDots, {})
    ] });
  }
  if (status === "stopped") {
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className: cn("text-muted-foreground italic", className), children });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col gap-1", className), children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start gap-2", children: [
      icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "mt-0.5 shrink-0", children: icon }),
      /* @__PURE__ */ jsxRuntime.jsx(
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
    meta && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: meta }),
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
  const containerEl = React25__namespace.useRef(null);
  const itemEls = React25__namespace.useRef([]);
  const widths = React25__namespace.useRef([]);
  const itemRefs = React25__namespace.useRef([]);
  const [hidden, setHidden] = React25__namespace.useState(NONE);
  const fit = React25__namespace.useCallback(() => {
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
  React25__namespace.useLayoutEffect(() => {
    widths.current = [];
    itemEls.current.length = count;
    setHidden((prev) => prev === NONE ? prev : NONE);
  }, [count]);
  React25__namespace.useLayoutEffect(() => {
    fit();
    if (!enabled || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => fit());
    if (containerEl.current) observer.observe(containerEl.current);
    for (const item of itemEls.current) if (item) observer.observe(item);
    return () => observer.disconnect();
  }, [fit, enabled, hidden]);
  const containerRef = React25__namespace.useCallback((el) => {
    containerEl.current = el;
  }, []);
  const itemRef = React25__namespace.useCallback((index) => {
    let fn = itemRefs.current[index];
    if (!fn) {
      fn = (el) => {
        itemEls.current[index] = el;
      };
      itemRefs.current[index] = fn;
    }
    return fn;
  }, []);
  const isHidden = React25__namespace.useCallback(
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
    active: "bg-primary/10 text-primary border-b-2 border-primary translate-y-px",
    strip: "items-stretch"
  },
  /**
   * The workbook tab: boxed on top / left / right with an *open bottom*, so it
   * punches through the strip's own rule — the classic folder-tab notch. The
   * box wears the rule's own colour and the body's fill, so the active tab and
   * its page read as one surface; the accent is the label plus a 2px line on
   * the tab's outer edge.
   */
  folder: {
    item: "h-full rounded-none px-3 py-2 gap-1.5",
    hover: "hover:text-foreground",
    open: "data-[state=open]:text-foreground",
    active: "z-10 translate-y-px rounded-t-md border border-b-0 border-border bg-card text-primary shadow-[inset_0_2px_0_var(--color-primary)]",
    strip: "items-stretch"
  },
  /** The folder tab turned over, for a strip under its pages: open at the top, rounded below, accent line underneath. */
  "folder-bottom": {
    item: "h-full rounded-none px-3 py-2 gap-1.5",
    hover: "hover:text-foreground",
    open: "data-[state=open]:text-foreground",
    active: "z-10 mt-[-1px] rounded-b-md border border-t-0 border-border bg-card text-primary shadow-[inset_0_-2px_0_var(--color-primary)]",
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
  const [internalActive, setInternalActive] = React25__namespace.default.useState(
    null
  );
  const isControlled = activeKey !== void 0;
  const currentKey = isControlled ? activeKey : internalActive;
  const activeIndex = items.findIndex((item) => keyOf(item) === currentKey);
  const nodes = React25__namespace.default.useRef({});
  const pendingFocus = React25__namespace.default.useRef(null);
  React25__namespace.default.useEffect(() => {
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
  const select = React25__namespace.default.useCallback(
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
    let target;
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
    const hostsButton = asCaret || Boolean(item.onClose);
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
    const icon = item.icon && /* @__PURE__ */ jsxRuntime.jsx(
      item.icon,
      {
        strokeWidth: item.iconStroke || 2,
        className: item.iconClassName || iconClassName
      }
    );
    const label = item.label && /* @__PURE__ */ jsxRuntime.jsx("span", { className: item.labelClassName, children: item.label });
    const a11y = label ? {} : { "aria-label": item.name };
    const badge = item.badge != null && /* @__PURE__ */ jsxRuntime.jsx(
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
      tabIndex: isActive || activeIndex < 0 && index === 0 ? 0 : -1,
      // A closable tab closes from the keyboard with Delete — its × is
      // pointer-only, so the strip stays one tab stop.
      onKeyDown: item.onClose ? (e) => {
        if (e.key === "Delete") {
          e.preventDefault();
          item.onClose?.();
        }
      } : void 0
    } : {};
    const setNode = (el) => {
      nodes.current[key] = el;
      itemRef(index)(el);
    };
    const caret = asCaret && /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        role: "button",
        tabIndex: -1,
        "aria-label": `${item.name} menu`,
        onClick: (e) => e.stopPropagation(),
        className: "ml-0.5 grid size-4 shrink-0 cursor-pointer place-items-center\n            rounded-control text-muted-foreground hover:bg-accent hover:text-foreground",
        children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "size-3" })
      }
    ) });
    const close = item.onClose && /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        role: "button",
        tabIndex: -1,
        "aria-label": `Close ${item.name}`,
        onClick: (e) => {
          e.stopPropagation();
          item.onClose?.();
        },
        className: "ml-0.5 grid size-4 shrink-0 cursor-pointer place-items-center\n          rounded-control text-muted-foreground hover:bg-accent hover:text-foreground",
        children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "size-3" })
      }
    );
    const inner = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      icon,
      label,
      caret,
      close,
      badge
    ] });
    const control = hostsButton ? /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: setNode,
        ...tabProps,
        ...a11y,
        style: item.style,
        onClick: () => select(item),
        className: itemClass,
        children: inner
      }
    ) : item.href ? /* @__PURE__ */ jsxRuntime.jsx(
      "a",
      {
        ref: setNode,
        href: item.href,
        ...a11y,
        style: item.style,
        onClick: () => select(item),
        className: itemClass,
        children: inner
      }
    ) : item.onClick || hasMenu || isTabs ? /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        ref: setNode,
        type: "button",
        disabled: item.disabled,
        ...tabProps,
        ...a11y,
        style: item.style,
        onClick: () => {
          if (hasMenu) item.onClick?.();
          else select(item);
        },
        className: itemClass,
        children: inner
      }
    ) : /* @__PURE__ */ jsxRuntime.jsx("div", { ref: setNode, style: item.style, className: itemClass, children: inner });
    const withTooltip = /* @__PURE__ */ jsxRuntime.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { asChild: true, children: hasMenu && !asCaret ? /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuTrigger, { asChild: true, children: control }) : control }),
      /* @__PURE__ */ jsxRuntime.jsx(TooltipContent, { side: item.tooltipSide || tooltipSide, children: item.tooltip || item.name })
    ] });
    return /* @__PURE__ */ jsxRuntime.jsxs(React25__namespace.default.Fragment, { children: [
      hasMenu ? /* @__PURE__ */ jsxRuntime.jsxs(DropdownMenu, { children: [
        withTooltip,
        /* @__PURE__ */ jsxRuntime.jsx(
          DropdownMenuContent,
          {
            side: isVertical ? "right" : "bottom",
            align: isVertical ? "start" : "end",
            children: renderMenuRows(item.menuItems)
          }
        )
      ] }) : withTooltip,
      item.showSeperator && /* @__PURE__ */ jsxRuntime.jsx(
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
  const overflowTrigger = hiddenIndices.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
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
          children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.MoreHorizontal, { className: iconClassName })
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(TooltipContent, { side: tooltipSide, children: overflowLabel })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuContent, { align: "end", children: hiddenIndices.map((index) => {
      const item = items[index];
      if (!item) return null;
      const Icon = item.icon;
      return /* @__PURE__ */ jsxRuntime.jsxs(
        DropdownMenuItem,
        {
          disabled: item.disabled,
          onSelect: () => select(item),
          children: [
            Icon ? /* @__PURE__ */ jsxRuntime.jsx(Icon, {}) : /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "size-4 shrink-0" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: item.label ?? item.name })
          ]
        },
        keyOf(item)
      );
    }) })
  ] });
  if (!isTabs && !overflow) {
    return /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { delayDuration: 0, children: rendered });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxRuntime.jsxs(
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
    const icon = MenuIcon ? /* @__PURE__ */ jsxRuntime.jsx(MenuIcon, {}) : gutter ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "size-4 shrink-0" }) : null;
    if (menuItem.children?.length) {
      return /* @__PURE__ */ jsxRuntime.jsxs(React25__namespace.default.Fragment, { children: [
        menuItem.separatorBefore && /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntime.jsxs(DropdownMenuSub, { children: [
          /* @__PURE__ */ jsxRuntime.jsxs(DropdownMenuSubTrigger, { disabled: menuItem.disabled, children: [
            icon,
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: menuItem.label })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuSubContent, { children: renderMenuRows(menuItem.children) })
        ] })
      ] }, menuItem.id);
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(React25__namespace.default.Fragment, { children: [
      menuItem.separatorBefore && /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxRuntime.jsxs(
        DropdownMenuItem,
        {
          disabled: menuItem.disabled,
          onSelect: () => menuItem.onSelect?.(),
          className: cn(
            menuItem.destructive && "text-destructive focus:bg-destructive/15 focus:text-destructive hover:bg-destructive/10 hover:text-destructive"
          ),
          children: [
            MenuIcon ? /* @__PURE__ */ jsxRuntime.jsx(MenuIcon, {}) : gutter ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "size-4 shrink-0" }) : null,
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: menuItem.label }),
            menuItem.shortcut && /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuShortcut, { children: menuItem.shortcut })
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
  return /* @__PURE__ */ jsxRuntime.jsxs("nav", { className: containerClass, children: [
    sections.start?.content && /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: `${sectionWrapperClass} ${isVertical ? "" : "min-w-0 shrink"} ${sections.start.className || ""}`,
        children: sections.start.content
      }
    ),
    sections.center?.content ? /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: `flex-1 ${isVertical ? "" : "flex min-w-0 justify-center items-center gap-1"} ${sections.center.className || ""}`,
        children: sections.center.content
      }
    ) : (
      // Empty spacer to push end section to the bottom/right
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1" })
    ),
    sections.end?.content && /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: `${sectionWrapperClass} ${isVertical ? "" : "ml-auto shrink-0"} ${sections.end.className || ""}`,
        children: sections.end.content
      }
    )
  ] });
};
var NavHorizontalItems = (props) => /* @__PURE__ */ jsxRuntime.jsx(NavItems, { ...props, orientation: "horizontal" });
var NavHorizontal = ({
  left,
  leftNavItems,
  center,
  centerNavItems,
  right,
  rightNavItems,
  className = ""
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    NavBase,
    {
      orientation: "horizontal",
      className,
      sections: {
        start: left || leftNavItems ? {
          content: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            left,
            leftNavItems && /* @__PURE__ */ jsxRuntime.jsx(NavHorizontalItems, { items: leftNavItems })
          ] }),
          className: "text-foreground"
        } : void 0,
        center: center || centerNavItems ? {
          content: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            center,
            centerNavItems && /* @__PURE__ */ jsxRuntime.jsx(NavHorizontalItems, { items: centerNavItems })
          ] })
        } : void 0,
        end: right || rightNavItems ? {
          content: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            rightNavItems && /* @__PURE__ */ jsxRuntime.jsx(NavHorizontalItems, { items: rightNavItems }),
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
  const renderAction = (action, i) => /* @__PURE__ */ jsxRuntime.jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
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
    /* @__PURE__ */ jsxRuntime.jsx(TooltipContent, { children: action.label })
  ] }, `${action.label}-${i}`);
  return /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { delayDuration: 300, children: /* @__PURE__ */ jsxRuntime.jsx(
    NavHorizontal,
    {
      className: cn("text-muted-foreground", className),
      left: start.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: start.map(renderAction) }) : void 0,
      right: end.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: end.map(renderAction) }) : void 0
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("p-3", className), children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "rounded-control border border-border bg-card shadow-sm overflow-hidden focus-within:border-ring transition-colors", children: [
    attachments && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "px-2 py-1.5 border-b border-border max-h-24 overflow-y-auto flex items-start gap-1 flex-wrap", children: attachments }),
    /* @__PURE__ */ jsxRuntime.jsx(
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
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "px-2 py-1.5 border-t border-border flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1 min-w-0 flex items-center gap-1.5", children: toolbarStart }),
      toolbarEnd,
      isRunning ? /* @__PURE__ */ jsxRuntime.jsx(
        Button,
        {
          size: "icon",
          className: "h-7 w-7 shrink-0 rounded-control",
          onClick: onStop,
          title: "Stop",
          "aria-label": "Stop",
          children: stopIcon
        }
      ) : /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex gap-2", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn(chatSessionGutterClass, "pt-[7px]"), "aria-hidden": true, children: marker ?? /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        className: cn("w-1.5 h-1.5 rounded-full", markerClass[status])
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "min-w-0 flex-1 flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
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
      meta && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: meta }),
      footer
    ] })
  ] });
}
function ChatSessionActivitySubLine({
  elbow,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex gap-2 text-muted-foreground", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 select-none text-border", "aria-hidden": true, children: elbow ?? "\u2514" }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 break-words", children })
  ] });
}
function ChatSessionPromptRow({
  children,
  caret,
  meta,
  className
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn("-mx-3 flex gap-2 bg-muted/70 px-3 py-2", className),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
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
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "min-w-0 flex-1 whitespace-pre-wrap break-words", children }),
        meta && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 self-start text-muted-foreground", children: meta })
      ]
    }
  );
}
function RingSpinner() {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2 text-muted-foreground",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: chatSessionGutterClass, children: spinner ?? /* @__PURE__ */ jsxRuntime.jsx(RingSpinner, {}) }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1", children }),
        elapsed && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 tabular-nums", children: elapsed })
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
  variant = "card",
  chevron,
  className,
  contentClassName
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React25__namespace.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const toggle = () => {
    const next = !isOpen;
    if (open === void 0) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  if (variant === "inline") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex min-w-0 flex-col gap-1", className), children: [
      /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: toggle,
          "aria-expanded": isOpen,
          className: "flex w-full min-w-0 items-center gap-2 text-left text-sm hover:text-foreground",
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex shrink-0 items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: cn(
                    "shrink-0 select-none text-muted-foreground transition-transform",
                    !chevron && isOpen && "rotate-90"
                  ),
                  "aria-hidden": true,
                  children: chevron ?? "\u25B8"
                }
              ),
              label
            ] }),
            meta && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto min-w-0 truncate font-mono text-xs text-muted-foreground", children: meta })
          ]
        }
      ),
      isOpen && (typeof children === "string" ? /* @__PURE__ */ jsxRuntime.jsx(
        "pre",
        {
          className: cn(
            "m-0 overflow-x-auto rounded-sm border border-border/60 bg-background px-2 py-1.5 font-mono text-xs whitespace-pre text-muted-foreground",
            contentClassName
          ),
          children
        }
      ) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("flex min-w-0 flex-col gap-1.5", contentClassName), children }))
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn(
        "overflow-hidden rounded-md border border-border bg-accent/40",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: toggle,
            "aria-expanded": isOpen,
            className: "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
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
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate", children: label }),
              meta && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 tabular-nums text-muted-foreground", children: meta })
            ]
          }
        ),
        isOpen && /* @__PURE__ */ jsxRuntime.jsx(
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
function ChatSessionDisclosureCode({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "pre",
    {
      className: cn(
        "m-0 overflow-x-auto rounded-sm border border-border/60 bg-background px-2 py-1.5 font-mono text-xs whitespace-pre-wrap text-muted-foreground [&_strong]:font-medium [&_strong]:text-info",
        className
      ),
      ...props
    }
  );
}
function ChatSessionDisclosureSteps({
  steps,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "ol",
    {
      className: cn(
        "m-0 flex list-decimal flex-col gap-0.5 pl-[18px] text-sm marker:font-mono marker:text-xs marker:text-muted-foreground",
        className
      ),
      ...props,
      children: steps.map((step, i) => /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1", children: step.label }),
        step.detail != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-mono text-xs text-muted-foreground", children: step.detail }) : null
      ] }) }, i))
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
  const content = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex w-3.5 shrink-0 justify-center", "aria-hidden": true, children: indicator ?? /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        className: cn("h-1.5 w-1.5 rounded-full", indicatorClass[status])
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-medium", children: name }),
    description && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate text-muted-foreground", children: description }),
    meta && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 tabular-nums text-muted-foreground", children: meta })
  ] });
  const rowClass = cn(
    "flex w-full items-center gap-2 rounded-control px-1.5 py-1 text-left",
    onClick && "hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring",
    className
  );
  if (onClick) {
    return /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", onClick, className: rowClass, children: content });
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: rowClass, children: content });
}
function ChatSessionTaskGroup({
  heading,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col gap-1", className), children: [
    heading && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-semibold", children: heading }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col gap-0.5", children })
  ] });
}
function ChatSessionStatusBar({
  start,
  end,
  className
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-3 px-3 py-1.5 text-muted-foreground",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: start }),
        end && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex shrink-0 items-center gap-3", children: end })
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn(
        "flex min-h-[26px] items-center gap-1.5 border border-border bg-muted/40 px-1.5 text-sm",
        className
      ),
      ...props,
      children: [
        icon ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex shrink-0 items-center text-muted-foreground [&_svg]:size-3", children: icon }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate", children }),
        onDismiss ? /* @__PURE__ */ jsxRuntime.jsx(
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
function ChatSessionCaret({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      "aria-hidden": true,
      className: cn(
        "ml-0.5 inline-block h-[1em] w-1.5 animate-pulse bg-muted-foreground align-[-0.15em] motion-reduce:animate-none",
        className
      ),
      ...props
    }
  );
}
var CitationList = React25__namespace.forwardRef(({ note, noteTone = "muted", className, children, ...props }, ref) => {
  const list = /* @__PURE__ */ jsxRuntime.jsx("ul", { ref: note != null ? void 0 : ref, className: cn("flex flex-col", note == null && className), ...note != null ? {} : props, children });
  if (note == null) return list;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col gap-1.5", className), children: [
    list,
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: cn("text-xs", noteTone === "warning" ? "text-warning" : "text-muted-foreground"), children: note })
  ] });
});
CitationList.displayName = "CitationList";
var CitationRow = React25__namespace.forwardRef(
  ({ kind, marker, source, count, detail, active, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "li",
    {
      ref,
      "data-active": active || void 0,
      className: cn(
        "flex gap-2 py-0.5",
        detail != null ? "items-baseline" : "items-center",
        active && "bg-info/15",
        // A numbered row is an answer's source line, set in the answer's
        // secondary size; a kind row is a record in a list of its own.
        marker != null ? "text-sm" : "min-h-[26px]",
        className
      ),
      ...props,
      children: [
        marker != null ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "w-6 shrink-0 font-mono text-xs text-info", children: [
          "[",
          marker,
          "]"
        ] }) : null,
        kind != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 border border-border px-1 text-sm text-muted-foreground", children: kind }) : null,
        detail != null ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate text-xs text-muted-foreground", children: detail })
        ] }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate", children }),
        source != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: source }) : null,
        count != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-mono text-xs tabular-nums text-muted-foreground", children: count }) : null
      ]
    }
  )
);
CitationRow.displayName = "CitationRow";
var ClampedText = React25__namespace.forwardRef(
  ({
    lines = 3,
    moreLabel = "Show more",
    lessLabel = "Show less",
    className,
    children,
    ...props
  }, ref) => {
    const [expanded, setExpanded] = React25__namespace.useState(false);
    const [clipped, setClipped] = React25__namespace.useState(false);
    const bodyRef = React25__namespace.useRef(null);
    React25__namespace.useLayoutEffect(() => {
      const el = bodyRef.current;
      if (!el || expanded) return;
      const measure = () => setClipped(el.scrollHeight - el.clientHeight > 1);
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, [expanded, children, lines]);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: cn("min-w-0", className), ...props, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          ref: bodyRef,
          className: cn(
            "whitespace-pre-line",
            !expanded && "overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:var(--clamped-lines)] [display:-webkit-box]"
          ),
          style: { "--clamped-lines": lines },
          children
        }
      ),
      clipped ? /* @__PURE__ */ jsxRuntime.jsx(
        Button,
        {
          type: "button",
          variant: "link",
          size: "sm",
          className: "h-auto p-0",
          "aria-expanded": expanded,
          onClick: () => setExpanded((open) => !open),
          children: expanded ? lessLabel : moreLabel
        }
      ) : null
    ] });
  }
);
ClampedText.displayName = "ClampedText";
var ClarifyFootnote = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("p", { ref, className: cn("text-xs text-muted-foreground", className), ...props })
);
ClarifyFootnote.displayName = "ClarifyFootnote";
var ClarifyActions = React25__namespace.forwardRef(
  ({ align = "start", className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      className: cn(
        "flex flex-wrap items-center gap-1.5",
        align === "end" && "justify-end",
        className
      ),
      ...props
    }
  )
);
ClarifyActions.displayName = "ClarifyActions";
var ClarifyCard = React25__namespace.forwardRef(
  ({
    state = "pending",
    kind = "question",
    step,
    waiting,
    time,
    question,
    options,
    value,
    onSelect,
    children,
    footnote,
    actions,
    actionsAlign = "start",
    className,
    ...props
  }, ref) => {
    const settled = state !== "pending";
    const name = React25__namespace.useId();
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        "data-state": state,
        className: cn(
          "flex min-w-0 flex-col overflow-hidden border border-border bg-card",
          (state === "superseded" || state === "expired") && "opacity-75",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex h-control-sm shrink-0 items-center gap-2 border-b border-border bg-chrome px-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-medium", children: settled ? state : kind }),
            step != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate text-muted-foreground", children: step }) : null,
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1" }),
            waiting != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-muted-foreground", children: waiting }) : null,
            time != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-muted-foreground", children: time }) : null
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-1 flex-col gap-2 p-2", children: [
            question != null ? /* @__PURE__ */ jsxRuntime.jsx("p", { children: question }) : null,
            children ?? (options ? /* @__PURE__ */ jsxRuntime.jsx(Questionnaire, { onSubmit: (e) => e.preventDefault(), children: /* @__PURE__ */ jsxRuntime.jsx(QuestionnaireItem, { name, children: /* @__PURE__ */ jsxRuntime.jsx(QuestionnaireChoices, { children: options.map((o) => /* @__PURE__ */ jsxRuntime.jsx(
              QuestionnaireChoice,
              {
                value: o.value,
                detail: o.detail,
                disabled: o.disabled,
                readOnly: settled,
                checked: value === void 0 ? void 0 : value === o.value,
                onChange: () => onSelect?.(o.value),
                children: /* @__PURE__ */ jsxRuntime.jsx(QuestionnaireChoiceTitle, { children: o.label })
              },
              o.value
            )) }) }) }) : null),
            footnote != null ? /* @__PURE__ */ jsxRuntime.jsx(ClarifyFootnote, { children: footnote }) : null,
            actions ? /* @__PURE__ */ jsxRuntime.jsx(ClarifyActions, { align: actionsAlign, children: actions }) : null
          ] })
        ]
      }
    );
  }
);
ClarifyCard.displayName = "ClarifyCard";
var ContextBar = React25__namespace.forwardRef(
  ({ counters, hint, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex h-control-sm shrink-0 items-center gap-3 border-t border-border bg-chrome px-2 text-sm",
        className
      ),
      ...props,
      children: [
        children ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 shrink-0 items-center gap-2", children }) : null,
        counters ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 flex-1 items-center gap-3 text-muted-foreground", children: counters }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1" }),
        hint != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-muted-foreground", children: hint }) : null
      ]
    }
  )
);
ContextBar.displayName = "ContextBar";
var DiagnosisCard = React25__namespace.forwardRef(({ code, attempted, target, actions, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  "div",
  {
    ref,
    className: cn("flex flex-col gap-2 border border-destructive/40 bg-card p-2", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-medium text-destructive", children: "diagnosis" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate font-mono text-muted-foreground", children: code })
      ] }),
      children != null ? /* @__PURE__ */ jsxRuntime.jsx("div", { children }) : null,
      attempted != null || target != null ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1 border border-border bg-muted/40 p-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: "what was tried" }),
        attempted != null ? /* @__PURE__ */ jsxRuntime.jsx("code", { className: "whitespace-pre-wrap break-all font-mono text-sm", children: attempted }) : null,
        target != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: target }) : null
      ] }) : null,
      actions ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-1.5", children: actions }) : null
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
var DiffList = React25__namespace.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("ul", { ref, className: cn("flex flex-col", className), ...props, children })
);
DiffList.displayName = "DiffList";
var DiffRow = React25__namespace.forwardRef(
  ({ op = "add", kind, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "li",
    {
      ref,
      className: cn("flex items-baseline gap-2 py-0.5 text-sm", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("w-3 shrink-0 text-center font-mono", OP_CLASS[op] ?? "text-muted-foreground"), children: OP_SIGN[op] }),
        kind != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-muted-foreground", children: kind }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1", children })
      ]
    }
  )
);
DiffRow.displayName = "DiffRow";
var EmissionHeader = React25__namespace.forwardRef(({ kind, title, template, citation, note, actions, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  "div",
  {
    ref,
    className: cn(
      "flex h-control-sm shrink-0 items-center gap-2 border-b border-border bg-chrome px-2 text-sm",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-medium", children: kind }),
      title != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate text-muted-foreground", children: title }) : null,
      template != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate font-mono text-muted-foreground", children: template }) : null,
      note != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 border border-border px-1 text-muted-foreground", children: note }) : null,
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1" }),
      citation != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-muted-foreground", children: citation }) : null,
      actions ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex shrink-0 items-center", children: actions }) : null
    ]
  }
));
EmissionHeader.displayName = "EmissionHeader";
var EmissionCard = React25__namespace.forwardRef(
  ({
    kind,
    title,
    template,
    citation,
    note,
    actions,
    showHeader = true,
    className,
    children,
    ...props
  }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      "data-kind": kind,
      className: cn("flex flex-col overflow-hidden border border-border bg-card", className),
      ...props,
      children: [
        showHeader ? /* @__PURE__ */ jsxRuntime.jsx(
          EmissionHeader,
          {
            kind,
            title,
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
var EmissionBody = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("flex min-w-0 flex-col gap-2 p-2", className), ...props })
);
EmissionBody.displayName = "EmissionBody";
var CitationMarker = React25__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "sup",
  {
    ref,
    className: cn(
      "ml-px rounded-sm align-super font-mono text-xs leading-none text-info",
      "data-[active=true]:bg-info/15 data-[active=true]:px-0.5",
      className
    ),
    ...props,
    children
  }
));
CitationMarker.displayName = "CitationMarker";
var EmptyState = React25__namespace.forwardRef(
  ({ icon, title, description, actions, locks, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex flex-col items-center justify-center gap-2 p-6 text-center",
        className
      ),
      ...props,
      children: [
        icon ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-muted-foreground", children: icon }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium", children: title }),
        description != null ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "max-w-prose text-muted-foreground", children: description }) : null,
        actions ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap items-center justify-center gap-1.5 pt-1", children: actions }) : null,
        locks ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap items-center justify-center gap-1.5 pt-1", children: locks }) : null
      ]
    }
  )
);
EmptyState.displayName = "EmptyState";
var EmptyStateLock = React25__namespace.forwardRef(({ icon, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  "span",
  {
    ref,
    className: cn(
      "inline-flex h-6 items-center gap-1.5 border border-dashed border-border px-2 text-sm text-muted-foreground [&_svg]:size-3",
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
var ErrorBoundary = class extends React25.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== void 0) return this.props.fallback;
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col items-center justify-center h-full w-full", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "inline-flex items-center", children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Frown, { className: "mr-1 h-4" }),
        "Oops ! something went wrong."
      ] }) });
    }
    return this.props.children;
  }
};
function Bubble({
  who,
  rail,
  children,
  note
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col gap-1 border-l-2 px-2.5 py-2", rail), children: [
    who != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono text-xs font-semibold", children: who }) : null,
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "leading-relaxed", children }),
    note != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: note }) : null
  ] });
}
var ExchangeRecord = React25__namespace.forwardRef(
  ({
    asker,
    question,
    why,
    options,
    answerer,
    answer,
    answerNote,
    className,
    ...props
  }, ref) => /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: cn("flex flex-col", className), ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsx(Bubble, { who: asker, rail: "border-l-warning bg-warning/5", note: why, children: question }),
    options?.length ? /* @__PURE__ */ jsxRuntime.jsx("ul", { className: "flex flex-col", children: options.map((option, index) => /* @__PURE__ */ jsxRuntime.jsxs(
      "li",
      {
        className: "flex items-center gap-2 border-border/55 border-t px-2.5 py-1",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              "aria-hidden": true,
              className: cn(
                "size-2.5 shrink-0 rounded-full border-[1.5px]",
                option.chosen ? "border-primary bg-primary" : "border-border bg-transparent"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: cn(
                "min-w-0 flex-1 truncate font-mono text-sm",
                option.chosen ? "text-foreground" : "text-muted-foreground"
              ),
              children: option.label
            }
          ),
          option.chosen ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-xs text-primary", children: "chosen" }) : null
        ]
      },
      index
    )) }) : null,
    answer != null ? /* @__PURE__ */ jsxRuntime.jsx(
      Bubble,
      {
        who: answerer,
        rail: "border-l-primary bg-primary/5 border-t border-t-border/55",
        note: answerNote,
        children: answer
      }
    ) : null
  ] })
);
ExchangeRecord.displayName = "ExchangeRecord";
var ExpandToggleRoot = React25__namespace.forwardRef(
  ({ open, label, className, onClick, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      ref,
      type: "button",
      "aria-expanded": open,
      "aria-label": label != null ? `${open ? "Close" : "Open"} ${label}` : open ? "Collapse row" : "Expand row",
      onClick: (event) => {
        event.stopPropagation();
        onClick?.(event);
      },
      className: cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        lucideReact.ChevronRight,
        {
          "aria-hidden": true,
          className: cn("size-3.5 transition-transform motion-reduce:transition-none", open && "rotate-90")
        }
      )
    }
  )
);
ExpandToggleRoot.displayName = "ExpandToggle";
function Spacer({ className }) {
  return /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: cn("size-4 shrink-0", className) });
}
var ExpandToggle = Object.assign(ExpandToggleRoot, { Spacer });
var FilterBar = React25__namespace.forwardRef(
  ({ summary, seamless, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex shrink-0 items-center gap-1.5",
        !seamless && "h-control-md border-b border-border bg-chrome px-2",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1" }),
        summary != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: summary }) : null
      ]
    }
  )
);
FilterBar.displayName = "FilterBar";
var FilterChip = React25__namespace.forwardRef(
  ({ label, value, active, onRemove, removeLabel, className, ...props }, ref) => {
    const chip = /* @__PURE__ */ jsxRuntime.jsxs(
      Button,
      {
        ref,
        type: "button",
        variant: "outline",
        size: "sm",
        "data-active": active || void 0,
        className: cn(
          "gap-1 px-1.5 font-normal",
          active && "border-primary/40 text-primary",
          onRemove && "rounded-r-none border-r-0",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn(value != null && "text-muted-foreground"), children: label }),
          value != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: value }) : null,
          /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "text-muted-foreground", children: "\u25BE" })
        ]
      }
    );
    if (!onRemove) return chip;
    return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "inline-flex min-w-0 items-center", children: [
      chip,
      /* @__PURE__ */ jsxRuntime.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: onRemove,
          "aria-label": removeLabel ?? `Clear ${typeof label === "string" ? label : "filter"}`,
          className: cn(
            "rounded-l-none px-1 font-normal text-muted-foreground hover:text-foreground",
            active && "border-primary/40"
          ),
          children: /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, children: "\xD7" })
        }
      )
    ] });
  }
);
FilterChip.displayName = "FilterChip";
function MultiFilterChip({
  label,
  options,
  value,
  onChange,
  multiple = true
}) {
  const choices = options.map(
    (o) => typeof o === "string" ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value }
  );
  const shown = value.length === 0 ? void 0 : value.length === 1 ? choices.find((c) => c.value === value[0])?.label ?? value[0] : `${value.length} selected`;
  return /* @__PURE__ */ jsxRuntime.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
      FilterChip,
      {
        label,
        value: shown,
        active: value.length > 0,
        onRemove: value.length ? () => onChange([]) : void 0
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuContent, { align: "start", children: multiple ? choices.map((c) => /* @__PURE__ */ jsxRuntime.jsx(
      DropdownMenuCheckboxItem,
      {
        checked: value.includes(c.value),
        onSelect: (e) => e.preventDefault(),
        onCheckedChange: (on) => onChange(on ? [...value, c.value] : value.filter((v) => v !== c.value)),
        children: c.label
      },
      c.value
    )) : /* @__PURE__ */ jsxRuntime.jsx(
      DropdownMenuRadioGroup,
      {
        value: value[0] ?? "",
        onValueChange: (v) => onChange(v === value[0] ? [] : [v]),
        children: choices.map((c) => (
          // Radix reports every pick, the current one included, so
          // picking it again clears the chip.
          /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuRadioItem, { value: c.value, children: c.label }, c.value)
        ))
      }
    ) })
  ] });
}
var glyph = "size-3.5";
function FoldGlyph({ collapsed }) {
  return /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: glyph, fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: collapsed ? /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "3", width: "10", height: "10", rx: "1" }) : /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M3 8h10" }) });
}
function CloseGlyph() {
  return /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: glyph, fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 4l8 8M12 4l-8 8" }) });
}
var barButton = "inline-flex size-control-xs shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
var FloatingPanel = React25__namespace.forwardRef(
  ({
    title,
    aside,
    collapsed = false,
    onCollapsedChange,
    summary,
    onClose,
    footer,
    className,
    bodyClassName,
    children,
    ...props
  }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "section",
    {
      ref,
      className: cn(
        "flex min-h-0 min-w-0 flex-col overflow-hidden rounded-surface border border-border bg-card text-card-foreground shadow-lg",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "flex h-control-md shrink-0 items-center gap-2 border-b border-border bg-chrome pl-3 pr-1.5 data-[collapsed]:border-b-0", "data-collapsed": collapsed || void 0, children: [
          /* @__PURE__ */ jsxRuntime.jsx(Eyebrow, { className: "shrink-0", children: title }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground", children: collapsed && summary != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate", children: summary }) : aside }),
          onCollapsedChange ? /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              className: barButton,
              "aria-expanded": !collapsed,
              "aria-label": collapsed ? "Expand" : "Collapse",
              title: collapsed ? "Expand" : "Collapse",
              onClick: () => onCollapsedChange(!collapsed),
              children: /* @__PURE__ */ jsxRuntime.jsx(FoldGlyph, { collapsed })
            }
          ) : null,
          onClose ? /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", className: barButton, "aria-label": "Close", title: "Close", onClick: onClose, children: /* @__PURE__ */ jsxRuntime.jsx(CloseGlyph, {}) }) : null
        ] }),
        collapsed ? null : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("min-h-0 flex-1 overflow-y-auto", bodyClassName), children }),
          footer != null ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex shrink-0 items-center gap-2 border-t border-border px-3 py-1.5 text-sm text-muted-foreground", children: footer }) : null
        ] })
      ]
    }
  )
);
FloatingPanel.displayName = "FloatingPanel";
var KindChip = React25__namespace.forwardRef(
  ({ kind, dim, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      ref,
      className: cn(
        "inline-flex h-[17px] shrink-0 items-center rounded-control px-1.5",
        "bg-muted font-mono text-xs tracking-wide text-muted-foreground",
        dim && "opacity-60",
        className
      ),
      ...props,
      children: kind
    }
  )
);
KindChip.displayName = "KindChip";
var layerLabel = (layer) => layer.replace(/_/g, " ");
var UNPAINTED2 = {
  swatch: "bg-muted-foreground",
  // Edge only, no ground: a bar's identity is its rail and its address, and a
  // wash under every bar turns a track into a stack of coloured blocks. A
  // consumer that wants the ground says so in its own `tint`.
  tint: "border-border",
  // Unpainted type is ordinary type. A muted address would say *subordinate*,
  // which is not what "nobody gave this layer a colour" means.
  text: "text-foreground"
};
var layerPaint = (palette, layer) => ({ ...UNPAINTED2, ...palette?.[layer] });
var LayerChip = React25__namespace.forwardRef(
  ({ layer, count, label, dim, swatch, palette, className, ...props }, ref) => {
    const paint = layerPaint(palette, layer);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "span",
      {
        ref,
        className: cn(
          // A layer is a **name**, not an address. `graph data` has a space in
          // it — it is already prose — so it takes the body face at the root
          // size, and mono is reserved for the thing that really is an address
          // (`model/Orders@v2` on the row below it). Small muted bold mono made
          // a row heading look like a technical footnote.
          "inline-flex max-w-full shrink-0 items-center gap-1.5",
          dim ? "text-muted-foreground/70" : "text-foreground",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              "aria-hidden": true,
              className: cn(
                "size-1.5 shrink-0",
                dim ? "bg-muted-foreground/50" : swatch ?? paint.swatch
              )
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: label ?? layerLabel(layer) }),
          count != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm tabular-nums text-muted-foreground", children: count }) : null
        ]
      }
    );
  }
);
LayerChip.displayName = "LayerChip";
var LayerSection = React25__namespace.forwardRef(
  ({ layer, summary, count, dim, palette, className, children, ...props }, ref) => {
    const empty = React25__namespace.Children.count(children) === 0;
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "section",
      {
        ref,
        className: cn("flex min-w-0 flex-col gap-1", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 items-baseline gap-2 border-b border-border pb-1", children: [
            /* @__PURE__ */ jsxRuntime.jsx(LayerChip, { layer, count, dim, palette }),
            summary != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto min-w-0 shrink truncate text-sm text-muted-foreground", children: summary }) : null
          ] }),
          empty ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "px-1 py-1 text-sm text-muted-foreground/70", children: "no rules in this layer" }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("flex min-w-0 flex-col", dim && "opacity-60"), children })
        ]
      }
    );
  }
);
LayerSection.displayName = "LayerSection";
function Swatch({ kind = "dot", color }) {
  const style = { color };
  if (kind === "dot")
    return /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "size-2 shrink-0 rounded-full bg-current"
      }
    );
  if (kind === "box")
    return /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, style, className: "h-2 w-2.5 shrink-0 rounded-[1px] bg-current" });
  if (kind === "outline")
    return /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "h-2 w-2.5 shrink-0 rounded-[1px] border-[1.5px] border-dashed border-current"
      }
    );
  if (kind === "ring")
    return /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "size-2 shrink-0 rounded-full border-[1.5px] border-current"
      }
    );
  if (kind === "line")
    return /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, style, className: "h-0.5 w-4 shrink-0 bg-current" });
  if (kind === "stripe")
    return /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, style, className: "h-3 w-[3px] shrink-0 bg-current" });
  if (kind === "bracket")
    return /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "h-3 w-3.5 shrink-0 border-l-2 border-current bg-current/10"
      }
    );
  if (kind === "rule")
    return /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "relative h-3 w-4 shrink-0 before:absolute before:inset-x-0 before:top-1.5 before:border-t-2 before:border-current after:absolute after:left-0.5 after:top-[3px] after:size-1.5 after:bg-current"
      }
    );
  if (kind === "dashed")
    return /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": true,
        style,
        className: "h-0 w-4 shrink-0 border-t-[1.5px] border-dashed border-current"
      }
    );
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "svg",
    {
      "aria-hidden": true,
      style,
      className: "w-4 shrink-0 overflow-visible",
      viewBox: "0 0 16 6",
      height: "6",
      fill: "none",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M0 3h11", stroke: "currentColor", strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M10 0l6 3-6 3z", fill: "currentColor" })
      ]
    }
  );
}
var Legend = React25__namespace.forwardRef(
  ({ orientation = "row", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      role: "list",
      className: cn(
        "flex gap-x-3 gap-y-1 text-sm",
        orientation === "row" ? "flex-wrap items-center" : "flex-col",
        className
      ),
      ...props,
      children
    }
  )
);
Legend.displayName = "Legend";
var LegendItem = React25__namespace.forwardRef(
  ({ kind, color, label, count, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      role: "listitem",
      className: cn("flex min-w-0 items-center gap-1.5", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(Swatch, { kind, color }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: label }),
        count != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-muted-foreground", children: count }) : null
      ]
    }
  )
);
LegendItem.displayName = "LegendItem";
function describe(n, palette) {
  switch (n.kind) {
    case "allow":
      return `${n.count} allow`;
    case "deny":
      return `${n.count} deny`;
    case "sliced":
      return "sliced";
    case "excludes":
      return `excludes ${n.properties.join(", ")}`;
    case "casts":
      return `casts ${n.roles.join(", ")}`;
    case "closes":
      return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        "closes",
        n.layers.map((layer) => /* @__PURE__ */ jsxRuntime.jsx(LayerChip, { layer, palette }, layer))
      ] });
  }
}
var LensRow = React25__namespace.forwardRef(
  ({ name, narrows = [], usage, selected, onSelect, palette, className, ...props }, ref) => {
    const interactive = Boolean(onSelect);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        role: interactive ? "button" : void 0,
        tabIndex: interactive ? 0 : void 0,
        "aria-pressed": interactive ? Boolean(selected) : void 0,
        onClick: interactive ? () => onSelect?.(name) : void 0,
        onKeyDown: interactive ? (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect?.(name);
          }
        } : void 0,
        className: cn(
          "flex min-w-0 flex-col gap-0.5 rounded-control px-3 py-1.5",
          interactive && "cursor-pointer hover:bg-accent",
          selected && "bg-accent",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate text-base font-medium text-foreground", children: name }),
            usage ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "ml-auto shrink-0 text-sm text-muted-foreground", children: [
              "used in ",
              usage.runs,
              " run",
              usage.runs === 1 ? "" : "s",
              usage.lastUsed ? ` \xB7 last ${usage.lastUsed}` : ""
            ] }) : null
          ] }),
          narrows.length ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground", children: narrows.map((n, i) => /* @__PURE__ */ jsxRuntime.jsxs(React25__namespace.Fragment, { children: [
            i > 0 ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "opacity-40", children: "\xB7" }) : null,
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "inline-flex items-center", children: describe(n, palette) })
          ] }, `${n.kind}-${i}`)) }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground/70", children: "narrows nothing \u2014 the whole model, inside the guardrails" })
        ]
      }
    );
  }
);
LensRow.displayName = "LensRow";
var Cross = () => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: "size-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 4l8 8M12 4l-8 8" }) });
var SearchInput = ({
  value,
  onChange,
  className,
  inputSize = "default",
  placeholder = "Search...",
  clearable = true,
  clearIcon,
  clearLabel = "Clear search",
  onKeyDown,
  ...props
}) => {
  const field = React25__namespace.default.useRef(null);
  const clearing = clearable && value !== "";
  const clear = () => {
    onChange("");
    field.current?.focus();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("relative w-full", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "input",
      {
        ref: field,
        type: "text",
        value,
        onChange: (e) => onChange(e.target.value),
        onKeyDown: (e) => {
          if (clearable && e.key === "Escape" && value !== "") {
            e.preventDefault();
            clear();
          }
          onKeyDown?.(e);
        },
        placeholder,
        className: cn(
          "flex w-full rounded-control border border-input bg-background ring-offset-background",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "py-0 text-base",
          inputSize === "sm" ? "h-control-sm px-2" : inputSize === "lg" ? "h-control-lg px-3" : "h-control-md px-2.5",
          // Room for the clear button, so text never runs under it.
          clearing && "pe-7"
        ),
        ...props
      }
    ),
    clearing ? /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        "aria-label": clearLabel,
        onClick: clear,
        disabled: props.disabled,
        className: cn(
          "absolute inset-y-0 end-1 my-auto flex size-control-xs items-center justify-center rounded-control",
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        ),
        children: clearIcon ?? /* @__PURE__ */ jsxRuntime.jsx(Cross, {})
      }
    ) : null
  ] });
};
var LEVEL = {
  info: "text-success",
  warn: "text-warning",
  error: "text-destructive",
  debug: "text-muted-foreground"
};
var MARKER = {
  prompt: "$",
  output: "\u2192",
  comment: "#"
};
var Terminal = React25__namespace.forwardRef(
  ({ cursor, columnTemplate = "150px minmax(0,1fr) auto auto", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      style: { "--terminal-cols": columnTemplate },
      className: cn(
        "overflow-x-auto border border-border bg-muted/40 p-2 font-mono text-sm",
        className
      ),
      ...props,
      children: [
        children,
        cursor ? /* @__PURE__ */ jsxRuntime.jsx(
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
var TerminalLine = React25__namespace.forwardRef(
  ({ kind = "output", level, levelColumn = 1, columns, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "items-baseline gap-2 whitespace-pre",
        columns ? level ? "grid [grid-template-columns:var(--terminal-cols)]" : "grid [grid-template-columns:auto_var(--terminal-cols)]" : "flex",
        kind === "comment" && "text-muted-foreground",
        className
      ),
      ...props,
      children: [
        level ? null : /* @__PURE__ */ jsxRuntime.jsx(
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
        columns ? columns.map((c, i) => /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: cn(
              "min-w-0 truncate",
              // A log tints its level cell and greys everything that is not the
              // message; a transcript greys only its trailing cell.
              level ? i === levelColumn ? LEVEL[level] ?? "text-muted-foreground" : i === columns.length - 1 ? void 0 : "text-muted-foreground" : i === columns.length - 1 && "text-muted-foreground"
            ),
            children: c
          },
          i
        )) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0", children })
      ]
    }
  )
);
TerminalLine.displayName = "TerminalLine";
var FLOOR = {
  all: () => true,
  warn: (level) => level === "warn" || level === "error",
  error: (level) => level === "error"
};
function PauseGlyph({ paused }) {
  return /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: "size-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: paused ? /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 3.5v9l7-4.5z" }) : /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5.5 3.5v9M10.5 3.5v9" }) });
}
var LogCard = React25__namespace.forwardRef(
  ({ title = "Logs", lines, live, source = null, onSourceChange, className, ...props }, ref) => {
    const [floor, setFloor] = React25__namespace.useState("all");
    const [query, setQuery] = React25__namespace.useState("");
    const [frozen, setFrozen] = React25__namespace.useState(null);
    const body = React25__namespace.useRef(null);
    const paused = frozen != null;
    const q = query.trim().toLowerCase();
    const shown = (paused ? lines.slice(0, frozen) : lines).filter(
      (l) => FLOOR[floor](l.level) && (source == null || l.source === source) && (!q || `${l.source ?? ""} ${l.message}`.toLowerCase().includes(q))
    );
    const behind = paused ? lines.length - frozen : 0;
    React25__namespace.useLayoutEffect(() => {
      if (paused) return;
      const el = body.current?.parentElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, [shown.length, paused]);
    const errors = lines.filter((l) => l.level === "error").length;
    return /* @__PURE__ */ jsxRuntime.jsxs(
      FloatingPanel,
      {
        ref,
        title,
        className,
        aside: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "min-w-0 truncate tabular-nums", children: [
            lines.length,
            " lines \xB7 ",
            paused ? `paused${behind ? `, ${behind} new` : ""}` : live ? "following" : "ended"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              "aria-pressed": paused,
              "aria-label": paused ? "Resume" : "Pause",
              title: paused ? "Resume" : "Pause",
              onClick: () => setFrozen(paused ? null : lines.length),
              className: "ml-auto inline-flex size-control-xs shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              children: /* @__PURE__ */ jsxRuntime.jsx(PauseGlyph, { paused })
            }
          )
        ] }),
        summary: `${lines.length} lines${errors ? ` \xB7 ${errors} ${errors === 1 ? "error" : "errors"}` : ""}`,
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card px-3 py-1.5", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              SegmentedControl,
              {
                size: "sm",
                "aria-label": "Level",
                value: floor,
                onValueChange: (v) => setFloor(v),
                options: [
                  { value: "all", label: "All" },
                  { value: "warn", label: "Warn" },
                  { value: "error", label: "Error" }
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              SearchInput,
              {
                inputSize: "sm",
                className: "min-w-0 flex-1",
                value: query,
                onChange: setQuery,
                placeholder: "Filter lines",
                "aria-label": "Filter lines"
              }
            ),
            source != null ? /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                onClick: () => onSourceChange?.(null),
                className: "shrink-0 rounded-control bg-muted px-1.5 font-mono text-sm hover:bg-accent",
                title: "Show every source",
                children: [
                  source,
                  " \xD7"
                ]
              }
            ) : null
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            Terminal,
            {
              ref: body,
              cursor: live && !paused,
              columnTemplate: "auto 3rem auto minmax(0,1fr)",
              className: "overflow-x-visible border-0 bg-transparent",
              children: shown.length ? shown.map((l, i) => /* @__PURE__ */ jsxRuntime.jsx(
                TerminalLine,
                {
                  level: l.level,
                  columns: [l.at, l.level, l.source ?? "", l.message]
                },
                l.id ?? i
              )) : /* @__PURE__ */ jsxRuntime.jsx(TerminalLine, { kind: "comment", children: "no lines match" })
            }
          )
        ]
      }
    );
  }
);
LogCard.displayName = "LogCard";
var TONE3 = {
  muted: "border-muted-foreground/50 text-muted-foreground",
  info: "border-info/60 text-info",
  success: "border-success/60 text-success",
  warning: "border-warning/60 text-warning",
  destructive: "border-destructive/60 text-destructive"
};
var MarkChip = React25__namespace.forwardRef(
  ({ tone = "warning", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      ref,
      className: cn(
        "inline-flex shrink-0 items-center rounded-control border px-1 py-px",
        "font-mono text-xs whitespace-nowrap",
        TONE3[tone],
        className
      ),
      ...props,
      children
    }
  )
);
MarkChip.displayName = "MarkChip";
var MatchPreview = React25__namespace.forwardRef(
  ({ pattern, matches = [], loading, limit = 8, className, ...props }, ref) => {
    const hits = matches.filter((m) => m.matched);
    const misses = matches.filter((m) => !m.matched);
    const shown = [...hits, ...misses].slice(0, limit);
    const hidden = matches.length - shown.length;
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        className: cn(
          "flex min-w-0 flex-col gap-1 rounded-md border border-border p-2",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: "what this matches" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto shrink-0 text-sm tabular-nums text-muted-foreground", children: loading ? "\u2026" : `${hits.length} of ${matches.length}` })
          ] }),
          loading ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1 py-0.5", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "h-3 w-3/5" }),
            /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "h-3 w-2/5" }),
            /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "h-3 w-1/2" })
          ] }) : matches.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground/70", children: "nothing in this Graph to match \u2014 the layer has no participants yet" }) : hits.length === 0 ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-sm text-destructive", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono", children: pattern }),
            " matches nothing here"
          ] }) : null,
          !loading && shown.length ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 flex-col gap-0.5", children: [
            shown.map((m) => /* @__PURE__ */ jsxRuntime.jsx(
              AddressChip,
              {
                address: m.address,
                tone: m.matched ? "allowed" : "untouched"
              },
              m.address
            )),
            hidden > 0 ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pt-0.5 text-sm text-muted-foreground/70", children: [
              "and ",
              hidden,
              " more"
            ] }) : null
          ] }) : null
        ]
      }
    );
  }
);
MatchPreview.displayName = "MatchPreview";
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
  const hasChildren = !!children && children.length > 0;
  const [open, setOpen] = React25__namespace.useState(false);
  const row = React25__namespace.useRef(null);
  const list = React25__namespace.useRef(null);
  const ButtonOrLink = href ? "a" : "button";
  const clickTrigger = href ? { href } : { onClick };
  const openInto = () => {
    reactDom.flushSync(() => setOpen(true));
    const first = list.current?.querySelector(":scope > li > a, :scope > li > button");
    first?.focus();
  };
  const closeBack = () => {
    setOpen(false);
    row.current?.focus();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "li",
    {
      className: "relative",
      onMouseEnter: hasChildren ? () => setOpen(true) : void 0,
      onMouseLeave: hasChildren ? () => setOpen(false) : void 0,
      onBlur: hasChildren ? (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      } : void 0,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          ButtonOrLink,
          {
            ...clickTrigger,
            ref: row,
            className: cn(
              "flex w-full items-center justify-between  px-4 py-2 ",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none",
              className,
              level === 0 ? "font-medium" : "font-normal"
            ),
            role: hasChildren ? "menuitem" : void 0,
            "aria-haspopup": hasChildren ? "menu" : void 0,
            "aria-expanded": hasChildren ? open : void 0,
            onKeyDown: hasChildren ? (e) => {
              if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openInto();
              }
            } : void 0,
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-2", children: [
                Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: label })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-2", children: [
                shortcut && /* @__PURE__ */ jsxRuntime.jsx("kbd", { className: "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100", children: shortcut }),
                hasChildren && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { className: "h-4 w-4" })
              ] })
            ]
          }
        ),
        hasChildren && /* @__PURE__ */ jsxRuntime.jsx(
          "ul",
          {
            ref: list,
            className: cn(
              "absolute left-full top-0 min-w-[240px] border p-1  bg-card text-card-foreground  shadow-md",
              // Visibility flips at once (only the fade and slide animate), so a row can take focus as it opens.
              "transition-[opacity,transform] duration-150 ease-in-out",
              open ? "visible opacity-100 translate-x-0" : "invisible opacity-0 translate-x-2"
            ),
            style: {
              zIndex: 50 + level
            },
            role: "menu",
            "aria-label": label,
            onKeyDown: (e) => {
              if (e.key === "ArrowLeft" || e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                closeBack();
              }
            },
            children: children.map((item) => /* @__PURE__ */ jsxRuntime.jsx(MenuItem, { ...item, level: level + 1 }, item.id))
          }
        )
      ]
    }
  );
};
var TONE4 = {
  running: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground"
};
var MetricTile = React25__namespace.forwardRef(
  ({ label, value, caption, tone, captionTone, meter, gauge, flagged, aside, variant = "tile", className, children, ...props }, ref) => {
    const hero = variant === "hero";
    const figure = variant === "figure";
    const clamp = (n) => Math.min(Math.max(n, 0), 1) * 100;
    const tile = /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: aside == null ? ref : void 0,
        "data-variant": aside == null ? variant : void 0,
        className: cn(
          "flex min-w-0 flex-col gap-px",
          !hero && "border border-border bg-card",
          // Mixed onto the card rather than translucent, so the tile reads the
          // same on whatever ground the grid sits on.
          flagged && "bg-[color-mix(in_srgb,var(--color-warning)_15%,var(--color-card))]",
          variant === "tile" && "px-3 py-2.5",
          figure && "px-2 py-1.5",
          aside == null && className
        ),
        ...aside == null ? props : {},
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: cn(
                "truncate text-muted-foreground",
                figure || hero ? "text-xs" : "text-sm",
                variant === "tile" && "font-semibold uppercase tracking-wide"
              ),
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: cn(
                // Mono, because a metric is a figure: proportional digits make
                // `1,880` and `2 / 5` in adjacent tiles sit at different widths, and
                // a strip of six stops reading as one row of numbers. A hero stands
                // alone, so it is set in the text face at display size, with
                // tabular digits.
                hero ? "text-3xl font-semibold leading-tight tracking-tight tabular-nums" : figure ? "text-xl font-semibold leading-tight tracking-tight tabular-nums" : "font-mono text-lg font-semibold leading-tight",
                tone ? TONE4[tone] ?? "text-foreground" : void 0
              ),
              children: value
            }
          ),
          caption != null ? /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: cn(
                figure || hero ? "text-xs" : "text-sm",
                (hero || figure) && "font-mono",
                captionTone ? TONE4[captionTone] ?? "text-muted-foreground" : "text-muted-foreground"
              ),
              children: caption
            }
          ) : null,
          meter != null ? (
            // Not a <Progress>: that is a control-sized, rounded, animated bar for
            // work in flight. This is a 4px rule that says how much of a ceiling is
            // gone, and it must not read as a second value in the tile.
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: "mt-1 h-1 w-full bg-muted",
                role: "img",
                "aria-label": `${Math.round(Math.min(Math.max(meter, 0), 1) * 100)}% of the ceiling`,
                children: /* @__PURE__ */ jsxRuntime.jsx(
                  "div",
                  {
                    className: cn("h-full", tone ? TONE4[tone] ?? "text-foreground" : "text-primary", "bg-current"),
                    style: { width: `${Math.min(Math.max(meter, 0), 1) * 100}%` }
                  }
                )
              }
            )
          ) : null,
          children
        ]
      }
    );
    const withGauge = gauge == null ? tile : /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1", children: [
      tile,
      /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: "relative mt-1.5 h-1.5 rounded-[1px] bg-muted",
          role: "img",
          "aria-label": `${Math.round(clamp(gauge.fill))}% of the scale, target at ${Math.round(clamp(gauge.mark))}%`,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-full rounded-[1px] bg-primary", style: { width: `${clamp(gauge.fill)}%` } }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                "aria-hidden": true,
                className: "absolute -top-[3px] h-3 w-0.5 -translate-x-1/2 bg-foreground",
                style: { left: `${clamp(gauge.mark)}%` }
              }
            )
          ]
        }
      ),
      gauge.labels ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: gauge.labels.map((l, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { children: l }, i)) }) : null
    ] });
    if (aside == null) return withGauge;
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, "data-variant": variant, className: cn("flex items-end gap-2.5", className), ...props, children: [
      withGauge,
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ms-auto shrink-0", children: aside })
    ] });
  }
);
MetricTile.displayName = "MetricTile";
var MetricGrid = React25__namespace.forwardRef(
  ({ minTileWidth = 120, gap = 6, joined, seamless, columns, className, style, children, ...props }, ref) => {
    const gridStyle = {
      gap: joined ? void 0 : gap,
      gridTemplateColumns: columns ? `repeat(${columns}, minmax(0, 1fr))` : `repeat(auto-fit, minmax(${minTileWidth}px, 1fr))`,
      ...style
    };
    const rules = "gap-px [&>*]:border-0 [&>*]:shadow-[0_0_0_1px_var(--color-border)]";
    if (!(joined && seamless)) {
      return /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref,
          className: cn("grid", joined && cn(rules, "border border-border"), className),
          style: gridStyle,
          ...props,
          children
        }
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsx("div", { ref, "data-seamless": true, className: cn("overflow-hidden", className), ...props, children: /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: cn(
          "grid",
          rules,
          "[--edge-x:0.75rem] [--edge-y:0.625rem] has-[>[data-variant=figure]]:[--edge-x:0.5rem] has-[>[data-variant=figure]]:[--edge-y:0.375rem] -mx-(--edge-x) -my-(--edge-y)"
        ),
        style: gridStyle,
        children
      }
    ) });
  }
);
MetricGrid.displayName = "MetricGrid";
var NavVerticalItems = (props) => /* @__PURE__ */ jsxRuntime.jsx(NavItems, { ...props, orientation: "vertical" });
var NavVertical = ({
  className = "",
  top,
  topNavItems,
  middle,
  bottom,
  bottomNavItems
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    NavBase,
    {
      orientation: "vertical",
      className: `w-[45px]  h-full  flex flex-col items-center ${className}`,
      sections: {
        start: top || topNavItems ? {
          content: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            top,
            topNavItems && /* @__PURE__ */ jsxRuntime.jsx(NavVerticalItems, { items: topNavItems })
          ] })
        } : void 0,
        center: middle ? { content: middle } : void 0,
        end: bottom || bottomNavItems ? {
          content: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            bottomNavItems && /* @__PURE__ */ jsxRuntime.jsx(NavVerticalItems, { items: bottomNavItems }),
            bottom
          ] })
        } : void 0
      }
    }
  );
};
var NestedMenu = (props) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "nav",
    {
      className: cn("w-[220px] !py-0 border  bg-card text-card-foreground shadow-sm", props.className),
      role: "menubar",
      children: /* @__PURE__ */ jsxRuntime.jsx("ul", { className: "space-y-0.5 p-0", role: "menu", children: props.menuItems.map((item) => /* @__PURE__ */ jsxRuntime.jsx(MenuItem, { ...item, className: "px-3 py-1.5" }, item.id)) })
    }
  );
};
var PanelBox = React25__namespace.forwardRef(
  ({ title, aside, flush, fill, className, headerClassName, bodyClassName, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    Card,
    {
      ref,
      className: cn(
        // A band is flat: the lift belongs to cards that float, and twenty of
        // these in a column would read as twenty floating things rather than
        // one page. Its corner is the surface dial, as a Card's is.
        "flex min-w-0 flex-col overflow-hidden rounded-surface shadow-none",
        fill && "h-full min-h-0",
        className
      ),
      ...props,
      children: [
        title != null ? /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: cn(
              "flex h-control-md shrink-0 items-center border-b border-border bg-chrome px-2.5",
              headerClassName
            ),
            children: /* @__PURE__ */ jsxRuntime.jsx(Eyebrow, { aside, className: "w-full", children: title })
          }
        ) : null,
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: cn(
              "flex min-w-0 flex-col",
              fill && "min-h-0 flex-1",
              flush ? "p-0" : title != null ? "px-2.5 py-2" : "p-2.5",
              bodyClassName
            ),
            children
          }
        )
      ]
    }
  )
);
PanelBox.displayName = "PanelBox";
function PanelContent({
  title,
  titleText,
  count,
  children,
  className,
  headerClassName,
  bodyClassName,
  footerContent,
  footerClassName,
  headerActions,
  actionsOnHover = false
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: cn("flex h-full min-h-0 flex-col border-none", className), children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      CardHeader,
      {
        className: cn(
          "group/panel-header flex h-control-md shrink-0 flex-row items-center gap-2",
          "space-y-0 border-b bg-chrome py-0 pr-1",
          headerClassName
        ),
        children: [
          title && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate font-bold leading-none", children: title }),
          titleText && /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "min-w-0 truncate font-bold leading-none", children: titleText }),
          count != null && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm leading-none text-muted-foreground", children: count }),
          headerActions && headerActions.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: cn(
                "ml-auto flex shrink-0 items-center gap-1 pl-2",
                actionsOnHover && "opacity-0 transition-opacity group-hover/panel-header:opacity-100 focus-within:opacity-100 has-[[data-state=open]]:opacity-100"
              ),
              children: /* @__PURE__ */ jsxRuntime.jsx(NavHorizontalItems, { items: headerActions })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: cn("min-h-0 flex-1 overflow-y-auto", bodyClassName), children }),
    footerContent ? /* @__PURE__ */ jsxRuntime.jsx(CardFooter, { className: cn("shrink-0 border-t bg-chrome", footerClassName), children: footerContent }) : null
  ] }) }) });
}
function PanelStack({
  sections,
  stackRef,
  onCollapsedChange,
  headerHeight = 35,
  withHandle = false,
  className,
  headerClassName,
  bodyClassName
}) {
  const groupRef = React25__namespace.useRef(null);
  const refs = React25__namespace.useRef({});
  const [collapsed, setCollapsed] = React25__namespace.useState(
    () => Object.fromEntries(sections.map((s) => [s.id, !!s.defaultCollapsed]))
  );
  const didInit = React25__namespace.useRef(false);
  React25__namespace.useLayoutEffect(() => {
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
  const notify = React25__namespace.useRef(onCollapsedChange);
  React25__namespace.useEffect(() => {
    notify.current = onCollapsedChange;
  }, [onCollapsedChange]);
  const collapsedRef = React25__namespace.useRef(collapsed);
  React25__namespace.useLayoutEffect(() => {
    collapsedRef.current = collapsed;
  }, [collapsed]);
  const collapsePanel = React25__namespace.useCallback((id) => {
    const ref = refs.current[id];
    if (!ref || ref.isCollapsed()) return;
    ref.collapse();
  }, []);
  const expandPanel = React25__namespace.useCallback((id) => {
    const ref = refs.current[id];
    if (!ref || !ref.isCollapsed()) return;
    ref.expand();
    if (!ref.isCollapsed()) return;
    const group = groupRef.current;
    if (!group) return;
    const layout = group.getLayout();
    const donor = Object.entries(layout).filter(([panelId]) => panelId !== id && !collapsedRef.current[panelId]).sort((a, b) => b[1] - a[1])[0];
    if (!donor) return;
    const [donorId, donorPct] = donor;
    const share = donorPct / 2;
    group.setLayout({
      ...layout,
      [id]: (layout[id] ?? 0) + share,
      [donorId]: donorPct - share
    });
  }, []);
  const toggle = React25__namespace.useCallback(
    (id) => {
      const ref = refs.current[id];
      if (!ref) return;
      if (ref.isCollapsed()) expandPanel(id);
      else collapsePanel(id);
    },
    [expandPanel, collapsePanel]
  );
  React25__namespace.useImperativeHandle(
    stackRef,
    () => ({
      expand: expandPanel,
      collapse: collapsePanel,
      toggle,
      isCollapsed: (id) => !!collapsedRef.current[id]
    }),
    [expandPanel, collapsePanel, toggle]
  );
  return (
    // Header actions are nav items, and those carry tooltips — provide the
    // context here so a `PanelStack` works outside an app shell too. Nesting
    // inside an app's own provider is harmless.
    /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxRuntime.jsx(
      ResizablePanelGroup,
      {
        groupRef,
        orientation: "vertical",
        className: cn("h-full w-full", className),
        children: sections.map((section, index) => {
          const Icon = section.icon;
          const isCollapsed = collapsed[section.id];
          const flush = index > 0 && (isCollapsed || collapsed[sections[index - 1].id]);
          return /* @__PURE__ */ jsxRuntime.jsxs(React25__namespace.Fragment, { children: [
            index > 0 && /* @__PURE__ */ jsxRuntime.jsx(
              ResizableHandle,
              {
                withHandle: withHandle && !flush,
                className: cn(
                  flush && "pointer-events-none bg-border aria-[orientation=horizontal]:h-px aria-[orientation=vertical]:w-px"
                )
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(
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
                  setCollapsed((prev) => {
                    if (prev[section.id] === next) return prev;
                    const map = { ...prev, [section.id]: next };
                    notify.current?.(map);
                    return map;
                  });
                },
                className: "flex flex-col overflow-hidden",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(
                    "div",
                    {
                      style: { height: headerHeight },
                      className: cn(
                        "group/panel-header flex shrink-0 items-center pr-2 text-muted-foreground",
                        headerClassName
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntime.jsxs(
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
                              isCollapsed ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { className: "h-5 w-5 shrink-0" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-5 w-5 shrink-0" }),
                              Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }),
                              typeof section.title === "string" ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate text-sm font-semibold uppercase tracking-wide", children: section.title }) : (
                                // Custom node: rendered as-is so the consumer owns the
                                // styling (icon, casing, colour, badges…).
                                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex min-w-0 flex-1 items-center", children: section.title })
                              ),
                              section.count != null && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ms-1 shrink-0 text-sm text-muted-foreground", children: section.count })
                            ]
                          }
                        ),
                        section.headerActions && section.headerActions.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(
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
                            children: /* @__PURE__ */ jsxRuntime.jsx(NavHorizontalItems, { items: section.headerActions })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsx(
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
var TONE5 = {
  success: "text-success",
  muted: "text-muted-foreground",
  warning: "text-warning",
  destructive: "text-destructive"
};
var DEFAULT_TONE = {
  touched: "success",
  refused: "destructive",
  denied: "destructive"
};
var ADDRESS_TONE = {
  touched: "allowed",
  refused: "refused",
  denied: "denied",
  "never touched": "untouched",
  miss: "untouched"
};
var ParticipantRow = React25__namespace.forwardRef(({ address, verdict, note, tone, addressTone, className, ...props }, ref) => {
  const resolved = tone ?? DEFAULT_TONE[verdict] ?? "muted";
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex min-w-0 items-baseline gap-2 border-border/55 border-t py-1 first:border-t-0",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          AddressChip,
          {
            address,
            tone: addressTone ?? ADDRESS_TONE[verdict] ?? "allowed",
            className: "min-w-0 flex-1"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("shrink-0 text-sm", TONE5[resolved]), children: verdict }),
        note != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "max-w-[18rem] shrink-0 truncate text-sm text-muted-foreground", children: note }) : null
      ]
    }
  );
});
ParticipantRow.displayName = "ParticipantRow";
var ProposalCard = React25__namespace.forwardRef(
  ({
    title,
    source,
    flush,
    evidence,
    seamless,
    evidenceTitle,
    evidenceMeta,
    consequence,
    actions,
    done,
    className,
    children,
    ...props
  }, ref) => /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: cn("flex flex-col gap-3", flush && "gap-2", className), ...props, children: [
    done != null ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "flex items-center gap-1.5 text-sm text-primary", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, children: "\u2713" }),
      done
    ] }) : null,
    /* @__PURE__ */ jsxRuntime.jsxs("section", { className: "flex flex-col gap-1", children: [
      title != null || source != null ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-baseline gap-2", children: [
        title != null ? /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "font-semibold", children: title }) : null,
        source != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: source }) : null
      ] }) : null,
      flush ? children : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border border-border bg-muted/30 p-2", children })
    ] }),
    evidence ? /* @__PURE__ */ jsxRuntime.jsxs("section", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "font-medium", children: evidenceTitle }),
        evidenceMeta != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: evidenceMeta }) : null
      ] }),
      seamless ? evidence : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-hidden border border-border", children: evidence })
    ] }) : null,
    consequence != null ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-muted-foreground", children: consequence }) : null,
    actions ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: actions }) : null
  ] })
);
ProposalCard.displayName = "ProposalCard";
var DotRating = React25__namespace.forwardRef(
  ({ value, max = 3, onChange, readOnly, label, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
          return /* @__PURE__ */ jsxRuntime.jsx(
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
        return /* @__PURE__ */ jsxRuntime.jsx(
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
var RatingControl = React25__namespace.forwardRef(
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
  }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn("flex flex-col gap-2 border border-border bg-card p-2", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: "Your verdict" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "becomes a Learning" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1" }),
          by
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { role: "radiogroup", className: "inline-flex border border-border", children: ["appreciate", "depreciate"].map((v) => /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": verdict === v,
              onClick: () => onVerdictChange?.(v),
              className: cn(
                "h-control-sm px-2 text-base capitalize",
                verdict === v ? v === "appreciate" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground" : "text-muted-foreground hover:bg-accent"
              ),
              children: v
            },
            v
          )) }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: "weight" }),
            /* @__PURE__ */ jsxRuntime.jsx(DotRating, { value: weight, max: maxWeight, onChange: onWeightChange }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm tabular-nums", children: weight })
          ] }),
          refines != null ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "refines ",
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-foreground", children: refines })
          ] }) : null
        ] }),
        children
      ]
    }
  )
);
RatingControl.displayName = "RatingControl";
var SIZE = {
  md: "h-control-md gap-2 px-3",
  lg: "h-control-lg gap-2.5 px-4"
};
var RecordHeader = React25__namespace.forwardRef(
  ({ tone, crumbs, chips, actions, size = "lg", className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex shrink-0 items-center border-b border-border bg-chrome",
        SIZE[size],
        className
      ),
      ...props,
      children: [
        tone ? /* @__PURE__ */ jsxRuntime.jsx(StatusDot, { tone, size }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 items-center gap-1.5", children: crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return /* @__PURE__ */ jsxRuntime.jsxs(React25__namespace.Fragment, { children: [
            i > 0 ? /* @__PURE__ */ jsxRuntime.jsx(
              lucideReact.ChevronRight,
              {
                "aria-hidden": true,
                className: "size-3.5 shrink-0 text-muted-foreground/60"
              }
            ) : null,
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: cn(
                  "truncate font-mono",
                  // The **last** crumb gives way first. It is the record's own
                  // name and the longest of them, and the reader is already on
                  // it; the parents are what say *which board this is*, and
                  // at four characters `runs` truncated to `ru…` leaves the one
                  // question a crumb trail exists to answer unanswered.
                  last ? "min-w-[6ch] shrink-[999] text-base font-semibold text-foreground" : "min-w-[3ch] text-muted-foreground"
                ),
                children: crumb
              }
            )
          ] }, i);
        }) }),
        chips ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex shrink-0 items-center gap-1.5", children: chips }) : null,
        actions ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto flex shrink-0 items-center gap-1.5", children: actions }) : null
      ]
    }
  )
);
RecordHeader.displayName = "RecordHeader";
var RecordPager = React25__namespace.forwardRef(
  ({
    position,
    onPrevious,
    onNext,
    previousLabel = "Previous",
    nextLabel = "Next",
    className,
    ...props
  }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn("flex items-center gap-1.5", className),
      ...props,
      children: [
        position != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: position }) : null,
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon-xs",
              "aria-label": previousLabel,
              disabled: !onPrevious,
              onClick: onPrevious,
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronLeft, { "aria-hidden": true })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon-xs",
              "aria-label": nextLabel,
              disabled: !onNext,
              onClick: onNext,
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { "aria-hidden": true })
            }
          )
        ] })
      ]
    }
  )
);
RecordPager.displayName = "RecordPager";
var RefusalCard = React25__namespace.forwardRef(
  ({ label = "refused", remedy, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      role: "note",
      className: cn(
        "flex flex-col gap-1 border border-destructive/40 bg-destructive/5 p-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1 text-sm font-medium text-destructive", children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ShieldX, { className: "size-3.5 shrink-0", "aria-hidden": true }),
          label
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-foreground", children }),
        remedy != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: remedy }) : null
      ]
    }
  )
);
RefusalCard.displayName = "RefusalCard";
var RepairNote = React25__namespace.forwardRef(
  ({ from, to, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex flex-wrap items-center gap-1 py-0.5 pl-4 text-sm text-muted-foreground",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono line-through decoration-muted-foreground/60", children: from }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, children: "\u2192" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono text-foreground", children: to })
      ]
    }
  )
);
RepairNote.displayName = "RepairNote";
var RetryNote = React25__namespace.forwardRef(
  ({ attempt, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex flex-wrap items-baseline gap-1.5 py-0.5 pl-4 text-sm text-muted-foreground",
        className
      ),
      ...props,
      children: [
        attempt != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-medium text-warning", children: attempt }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("span", { children })
      ]
    }
  )
);
RetryNote.displayName = "RetryNote";
function OptionRow({ option }) {
  const Icon = option.icon;
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-col gap-0.5", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
      Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { size: 16, className: "shrink-0" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: option.label }),
      option.badge != null && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto pl-2", children: option.badge })
    ] }),
    option.description != null && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: option.description }),
    option.disabled && option.disabledReason != null && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-warning", children: option.disabledReason })
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
  appearance = "field",
  triggerIcon: TriggerIcon,
  triggerTag,
  triggerAriaLabel,
  toggles,
  actions,
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
      return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
        Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { size: 16, className: "shrink-0" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: only.label })
      ] });
    }
    return `${label ?? "Selected"}: ${selectedOptions.length}`;
  })();
  const inline = appearance === "inline";
  const trigger = /* @__PURE__ */ jsxRuntime.jsxs(
    Button,
    {
      variant: inline ? "ghost" : "outline",
      size: inline ? "xs" : "sm",
      disabled,
      "aria-label": triggerAriaLabel,
      className: cn(
        "ring-offset-background justify-between gap-2",
        inline && "min-w-0 gap-1 px-1.5 font-normal",
        triggerClassName,
        className
      ),
      children: [
        TriggerIcon && /* @__PURE__ */ jsxRuntime.jsx(TriggerIcon, { size: 14, className: "shrink-0 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex min-w-0 items-center gap-2", children: triggerLabel }),
        triggerTag != null && /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "outline", tone: "warning", size: "xs", className: "shrink-0 font-normal", children: triggerTag }),
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-4 w-4 shrink-0 opacity-60" })
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(DropdownMenu, { children: [
    tooltip != null ? /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntime.jsxs(Tooltip, { delayDuration: 0, children: [
      /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuTrigger, { asChild: true, children: trigger }) }),
      /* @__PURE__ */ jsxRuntime.jsx(TooltipContent, { side: tooltipSide, children: tooltip })
    ] }) }) : /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuTrigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      DropdownMenuContent,
      {
        align,
        side,
        sideOffset,
        className: cn("min-w-[14rem]", contentClassName),
        children: [
          label && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuLabel, { children: label }),
            /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuSeparator, {})
          ] }),
          multiple ? options.map((option) => {
            const selected = selectedValues.includes(option.value);
            return /* @__PURE__ */ jsxRuntime.jsx(
              DropdownMenuCheckboxItem,
              {
                checked: selected,
                disabled: option.disabled,
                onSelect: (e) => e.preventDefault(),
                onCheckedChange: () => toggle(option.value),
                children: renderOption ? renderOption(option, { selected }) : /* @__PURE__ */ jsxRuntime.jsx(OptionRow, { option })
              },
              option.value
            );
          }) : /* @__PURE__ */ jsxRuntime.jsx(
            DropdownMenuRadioGroup,
            {
              value: selectedValues[0],
              onValueChange: (v) => onChange(v),
              children: options.map((option) => {
                const selected = selectedValues.includes(option.value);
                return /* @__PURE__ */ jsxRuntime.jsx(
                  DropdownMenuRadioItem,
                  {
                    value: option.value,
                    disabled: option.disabled,
                    children: renderOption ? renderOption(option, { selected }) : /* @__PURE__ */ jsxRuntime.jsx(OptionRow, { option })
                  },
                  option.value
                );
              })
            }
          ),
          toggles && toggles.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuSeparator, {}),
            toggles.map((t) => /* @__PURE__ */ jsxRuntime.jsx(
              DropdownMenuCheckboxItem,
              {
                checked: t.checked,
                disabled: t.disabled,
                onSelect: (e) => e.preventDefault(),
                onCheckedChange: (c) => t.onCheckedChange(c === true),
                children: t.label
              },
              t.id
            ))
          ] }),
          actions && actions.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuSeparator, {}),
            actions.map((a) => {
              const Icon = a.icon;
              return /* @__PURE__ */ jsxRuntime.jsxs(DropdownMenuItem, { onSelect: a.onSelect, className: "text-muted-foreground", children: [
                Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { size: 16 }),
                a.label
              ] }, a.id);
            })
          ] })
        ]
      }
    )
  ] });
}
function describeSlice(select, declared) {
  const out = [];
  if (select.time) {
    const { axis, from, to } = select.time;
    out.push({
      axisKind: "time",
      text: `time ${from ?? "\u2026"} \u2192 ${to ?? "\u2026"} \xB7 axis ${axis}`,
      undeclared: declared ? declared.time == null : void 0
    });
  }
  if (select.geo) {
    const { axis, vocab, in: values } = select.geo;
    out.push({
      axisKind: "geo",
      text: `geo ${values.join(", ")} \xB7 axis ${axis}${vocab ? ` \xB7 ${vocab}` : ""}`,
      undeclared: declared ? declared.geo == null : void 0
    });
  }
  for (const [dim, values] of Object.entries(select.dims ?? {})) {
    out.push({
      axisKind: dim,
      text: `${dim} ${values.join(", ")}`,
      undeclared: declared ? !(declared.dims ?? []).includes(dim) : void 0
    });
  }
  return out;
}
var SliceSummary = React25__namespace.forwardRef(
  ({ select, declaredAxes, modelLabel, variant = "line", className, ...props }, ref) => {
    const lines = select ? describeSlice(select, declaredAxes) : [];
    if (!lines.length) {
      return /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref,
          className: cn("text-sm text-muted-foreground/70", className),
          ...props,
          children: "not sliced \u2014 the whole model"
        }
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: cn(
          "flex min-w-0 flex-col gap-0.5",
          variant === "block" && "rounded-md border border-border p-2",
          className
        ),
        ...props,
        children: lines.map((line) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 flex-col", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: cn(
                "truncate text-sm",
                line.undeclared ? "text-destructive line-through decoration-destructive/50" : "text-muted-foreground"
              ),
              children: line.text
            }
          ),
          line.undeclared ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-sm text-destructive", children: [
            modelLabel ?? "this model",
            " declares no ",
            line.axisKind,
            " axis, so it cannot be sliced by one. Declaring one is a modelling act."
          ] }) : null
        ] }, line.axisKind))
      }
    );
  }
);
SliceSummary.displayName = "SliceSummary";
var RuleRow = React25__namespace.forwardRef(
  ({ match, allow, properties, select, egress, readOnly, className, ...props }, ref) => {
    const excluded = properties?.exclude ?? [];
    const sends = egress?.may_send ?? [];
    const sliced = Boolean(
      select?.time || select?.geo || Object.keys(select?.dims ?? {}).length
    );
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        className: cn(
          // The verb column is `5ch` — the width of `allow` in the mono face it
          // is set in. A character unit rather than a pixel one, so the indent
          // holds when `data-density` moves the font size, and so every row
          // aligns whether its verb is `allow` or `deny`.
          "grid min-w-0 grid-cols-[5ch_minmax(0,1fr)] items-baseline gap-x-2 gap-y-0.5",
          "rounded-control px-1 py-1",
          !readOnly && "hover:bg-accent",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: cn(
                "font-mono text-sm",
                allow ? "text-muted-foreground" : "font-semibold text-destructive"
              ),
              children: allow ? "allow" : "deny"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            AddressChip,
            {
              address: match,
              tone: allow ? "allowed" : "denied",
              className: "min-w-0"
            }
          ),
          excluded.length || sliced || sends.length ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "col-start-2 flex min-w-0 flex-col gap-0.5", children: [
            excluded.length ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "truncate text-sm text-muted-foreground", children: [
              "excludes ",
              excluded.join(", ")
            ] }) : null,
            sliced ? /* @__PURE__ */ jsxRuntime.jsx(SliceSummary, { select, variant: "line" }) : null,
            sends.length ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "truncate text-sm text-muted-foreground", children: [
              "may send ",
              sends.join(", ")
            ] }) : null
          ] }) : null
        ]
      }
    );
  }
);
RuleRow.displayName = "RuleRow";
var TONE6 = {
  queued: "queued",
  running: "running",
  succeeded: "success",
  failed: "error",
  cancelled: "muted",
  cannot_answer: "warning",
  awaiting_approval: "warning",
  awaiting_input: "warning",
  partial: "warning",
  skipped: "muted",
  held: "muted",
  purged: "muted"
};
var TEXT = {
  running: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info",
  queued: "text-muted-foreground",
  muted: "text-muted-foreground"
};
var RunStatusText = React25__namespace.forwardRef(({ status, tone, dot, label, className, ...props }, ref) => {
  const resolved = tone ?? TONE6[status] ?? "muted";
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "span",
    {
      ref,
      className: cn(
        "inline-flex min-w-0 items-center gap-1.5",
        TEXT[resolved],
        className
      ),
      ...props,
      children: [
        dot ? /* @__PURE__ */ jsxRuntime.jsx(StatusDot, { tone: resolved }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: label ?? status })
      ]
    }
  );
});
RunStatusText.displayName = "RunStatusText";
var ICON = {
  queued: "queued",
  running: "running",
  succeeded: "success",
  failed: "error",
  cancelled: "cancelled",
  cannot_answer: "question",
  awaiting_approval: "waiting",
  awaiting_input: "waiting",
  held: "waiting",
  partial: "alert",
  skipped: "cancelled",
  purged: "cancelled"
};
var RunRow = React25__namespace.forwardRef(
  ({
    status,
    state,
    kind,
    address,
    title,
    titleMono,
    meta,
    aside,
    depth = 0,
    selected,
    onSelect,
    className,
    ...props
  }, ref) => {
    const Row = onSelect ? "button" : "div";
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: cn(
          "border-b border-border/55",
          selected && "bg-accent shadow-[inset_2px_0_0_var(--color-primary)]",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsxRuntime.jsxs(
          Row,
          {
            type: onSelect ? "button" : void 0,
            onClick: onSelect,
            "aria-current": onSelect && selected ? "true" : void 0,
            style: depth ? { "--row-indent": `${depth * 18}px` } : void 0,
            className: cn(
              "flex w-full items-start gap-2 px-3 py-1.5 text-left",
              depth > 0 && "ps-[calc(var(--spacing)*3+var(--row-indent))]",
              onSelect && "cursor-pointer hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
            ),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                StatusIcon,
                {
                  state: state ?? ICON[status] ?? "queued",
                  className: "mt-0.5",
                  label: state === "alert" ? "partial" : status
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [
                /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 items-center gap-1.5", children: [
                  kind ? /* @__PURE__ */ jsxRuntime.jsx(KindChip, { kind }) : null,
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("min-w-0 truncate", titleMono && "font-mono"), children: title })
                ] }),
                address != null || meta != null ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "truncate text-sm text-muted-foreground", children: [
                  address != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "mr-1.5 font-mono", children: address }) : null,
                  meta
                ] }) : null
              ] }),
              aside != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 pt-0.5 text-sm text-muted-foreground", children: aside }) : null
            ]
          }
        )
      }
    );
  }
);
RunRow.displayName = "RunRow";
var MARK = {
  changed: "bg-primary/15 text-primary",
  stale: "bg-warning/15 text-warning"
};
function isPart(part) {
  return typeof part === "object" && part !== null && !React25__namespace.isValidElement(part) && "text" in part;
}
var PART = "border-r border-border/60 px-2 py-0.5 last:border-r-0";
function EditablePart({
  value,
  onChange,
  className
}) {
  const [editing, setEditing] = React25__namespace.useState(false);
  const [draft, setDraft] = React25__namespace.useState(value);
  if (!editing) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        className: cn(
          PART,
          "cursor-text text-left hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
          className
        ),
        onClick: () => {
          setDraft(value);
          setEditing(true);
        },
        children: value
      }
    );
  }
  const done = (commit) => {
    setEditing(false);
    const next = draft.trim();
    if (commit && next && next !== value) onChange(next);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      autoFocus: true,
      "aria-label": `Change ${value}`,
      value: draft,
      size: Math.max(draft.length, 4),
      onChange: (event) => setDraft(event.target.value),
      onBlur: () => done(false),
      onKeyDown: (event) => {
        if (event.key === "Enter") done(true);
        if (event.key === "Escape") done(false);
      },
      className: cn(PART, "bg-background text-foreground outline-none ring-1 ring-inset ring-ring")
    }
  );
}
var ScopeLine = React25__namespace.forwardRef(
  ({
    parts,
    onPartChange,
    fixedParts,
    openPart,
    defaultOpenPart,
    onOpenPartChange,
    note,
    noteTone = "muted",
    seamless,
    className,
    ...props
  }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React25__namespace.useState(
      defaultOpenPart ?? null
    );
    const open = openPart !== void 0 ? openPart : uncontrolledOpen;
    const setOpen = (index) => {
      if (openPart === void 0) setUncontrolledOpen(index);
      onOpenPartChange?.(index);
    };
    const opened = open != null ? parts[open] : void 0;
    const choices = isPart(opened) ? opened.choices : void 0;
    const wrapped = !!choices?.length || note != null;
    const line = /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: wrapped ? void 0 : ref,
        className: cn(
          "flex w-fit flex-wrap font-mono text-xs text-muted-foreground",
          // Seamless: it reaches out by a part's padding and clips that off, so
          // the first part is flush. Sideways only, so a part's focus ring
          // keeps its top and bottom.
          seamless ? "-mx-2 max-w-[calc(100%+1rem)] [clip-path:inset(0_0.5rem)]" : "max-w-full border border-border",
          !wrapped && className
        ),
        ...wrapped ? {} : props,
        children: parts.map((part, i) => {
          if (isPart(part)) {
            const mark = part.mark ? MARK[part.mark] : void 0;
            if (part.choices?.length) {
              return /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  type: "button",
                  "aria-expanded": open === i,
                  className: cn(
                    PART,
                    "text-left hover:bg-accent hover:text-foreground focus-visible:outline-none",
                    open === i && "shadow-[inset_0_0_0_1px_var(--color-primary)]",
                    mark
                  ),
                  onClick: () => setOpen(open === i ? null : i),
                  children: part.text
                },
                i
              );
            }
            if (onPartChange && typeof part.text === "string" && !fixedParts?.includes(i)) {
              return /* @__PURE__ */ jsxRuntime.jsx(
                EditablePart,
                {
                  value: part.text,
                  className: mark,
                  onChange: (value) => onPartChange(i, value)
                },
                i
              );
            }
            return /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn(PART, mark), children: part.text }, i);
          }
          return onPartChange && typeof part === "string" && !fixedParts?.includes(i) ? /* @__PURE__ */ jsxRuntime.jsx(EditablePart, { value: part, onChange: (value) => onPartChange(i, value) }, i) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: PART, children: part }, i);
        })
      }
    );
    if (!wrapped) return line;
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: cn("flex min-w-0 flex-col gap-1.5", className), ...props, children: [
      line,
      choices?.length && open != null ? /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          role: "listbox",
          className: "flex flex-col rounded-sm border border-border bg-card p-0.5 shadow-md",
          children: choices.map((choice) => {
            const current = isPart(opened) && choice.label === opened.text;
            return /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": current,
                className: cn(
                  "flex items-baseline gap-2 rounded-sm px-1.5 py-1 text-left text-sm hover:bg-accent",
                  current && "bg-primary/15 text-primary hover:bg-primary/15"
                ),
                onClick: () => {
                  setOpen(null);
                  if (!current && open != null) onPartChange?.(open, choice.value);
                },
                children: [
                  choice.label,
                  choice.detail != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto font-mono text-xs text-muted-foreground", children: choice.detail }) : null
                ]
              },
              choice.value
            );
          })
        }
      ) : null,
      note != null ? /* @__PURE__ */ jsxRuntime.jsx(
        "span",
        {
          className: cn(
            "text-xs",
            noteTone === "warning" ? "text-warning" : "text-muted-foreground"
          ),
          children: note
        }
      ) : null
    ] });
  }
);
ScopeLine.displayName = "ScopeLine";
var SectionHeader = React25__namespace.forwardRef(({ icon, title, count, actions, bare, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  "div",
  {
    ref,
    className: cn(
      "flex h-[35px] shrink-0 items-center gap-2 px-3",
      !bare && "border-b border-border",
      className
    ),
    ...props,
    children: [
      icon ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex shrink-0 items-center text-muted-foreground [&_svg]:size-3.5", children: icon }) : null,
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1 truncate font-medium", children: title }),
      count != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: count }) : null,
      actions ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex shrink-0 items-center gap-1", children: actions }) : null
    ]
  }
));
SectionHeader.displayName = "SectionHeader";
var TONE7 = { done: "success", current: "info", todo: "queued" };
var StageTrail = React25__namespace.forwardRef(
  ({ steps, onPick, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "nav",
    {
      ref,
      "aria-label": "Stages",
      className: cn("@container/trail flex w-full min-w-0 justify-center", className),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx("ol", { className: "flex min-w-0 items-center gap-1", children: steps.map((step, i) => {
        const current = step.state === "current";
        return /* @__PURE__ */ jsxRuntime.jsxs("li", { className: "flex min-w-0 items-center gap-1", children: [
          i ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "h-px w-3 shrink bg-border @min-[560px]/trail:w-8" }) : null,
          /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              type: "button",
              disabled: !onPick,
              "aria-current": current ? "step" : void 0,
              "aria-label": `${step.label} \xB7 ${step.state === "todo" ? "not started" : step.state}`,
              title: step.label,
              onClick: () => onPick?.(step.id),
              className: cn(
                "inline-flex h-control-sm shrink-0 items-center gap-1.5 rounded-control px-2 text-muted-foreground",
                "enabled:hover:bg-accent enabled:hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-default",
                current && "bg-secondary text-foreground"
              ),
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(StatusDot, { tone: TONE7[step.state] }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("truncate", !current && "@max-[559px]/trail:sr-only"), children: step.label })
              ]
            }
          )
        ] }, step.id);
      }) })
    }
  )
);
StageTrail.displayName = "StageTrail";
function TabbedPanel({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  onTabClose,
  headerActions,
  headerContent,
  overflow = false,
  overflowLabel = "More panels",
  keepMounted = false,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footerContent
}) {
  const [internalTab, setInternalTab] = React25__namespace.default.useState(defaultTab || tabs[0]?.value);
  const currentTab = activeTab !== void 0 ? activeTab : internalTab;
  const handleTabChange = (value) => {
    if (activeTab === void 0) {
      setInternalTab(value);
    }
    onTabChange?.(value);
  };
  const uid = React25__namespace.default.useId();
  const panelId = (value) => `${uid}-panel-${value}`;
  const items = React25__namespace.default.useMemo(
    () => tabs.map((tab) => ({
      key: tab.value,
      name: tab.name ?? (typeof tab.label === "string" ? tab.label : tab.value),
      label: tab.label,
      icon: tab.icon,
      disabled: tab.disabled,
      onClose: tab.closable && onTabClose ? () => onTabClose(tab.value) : void 0
    })),
    [tabs, onTabClose]
  );
  return /* @__PURE__ */ jsxRuntime.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: cn("flex h-full min-h-0 flex-col border rounded-none", className), children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: cn(
          "flex h-control-md shrink-0 flex-row items-stretch border-b bg-chrome",
          headerClassName
        ),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
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
          headerContent != null ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ml-auto flex h-full shrink-0 items-center gap-1 px-1", children: headerContent }) : null,
          headerActions && headerActions.length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ml-auto flex h-full shrink-0 items-center gap-1 pr-1", children: /* @__PURE__ */ jsxRuntime.jsx(NavHorizontalItems, { items: headerActions }) })
        ]
      }
    ),
    tabs.map((tab) => {
      const active = tab.value === currentTab;
      if (!keepMounted && !active) return null;
      return /* @__PURE__ */ jsxRuntime.jsx(
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
    footerContent && /* @__PURE__ */ jsxRuntime.jsx(CardFooter, { className: cn("shrink-0", footerClassName), children: footerContent })
  ] }) }) });
}
function useExpandedKeys({
  expanded,
  defaultExpanded,
  onExpandedChange,
  keys
}) {
  const [own, setOwn] = React25__namespace.useState(defaultExpanded ?? {});
  const state = expanded ?? own;
  const isOpen = (key) => state === true || state[key] === true;
  const toggle = (key) => {
    const map = state === true ? Object.fromEntries(keys.map((k) => [k, true])) : state;
    const next = { ...map, [key]: !isOpen(key) };
    if (expanded === void 0) setOwn(next);
    onExpandedChange?.(next);
  };
  return { isOpen, toggle };
}
var BAR = {
  succeeded: "bg-success",
  running: "bg-info",
  failed: "bg-destructive",
  needs_input: "bg-warning",
  stopped: "bg-muted-foreground",
  skipped: "bg-transparent",
  queued: "bg-transparent",
  refused: "bg-destructive/35"
};
var DOT = {
  succeeded: "success",
  running: "running",
  failed: "error",
  needs_input: "warning",
  stopped: "muted",
  skipped: "muted",
  queued: "queued",
  refused: "error"
};
var STATUS_LABEL = {
  succeeded: "succeeded",
  running: "running",
  failed: "failed",
  needs_input: "needs input",
  stopped: "stopped",
  skipped: "never ran",
  queued: "not started",
  refused: "refused"
};
function renderResult(result) {
  if (result == null) return null;
  if (React25__namespace.isValidElement(result)) return result;
  if (typeof result !== "object") {
    return /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono text-sm", children: String(result) });
  }
  const entries = Object.entries(result);
  const scalars = entries.filter(([, v]) => v == null || typeof v !== "object");
  const nested = entries.filter(([, v]) => v != null && typeof v === "object");
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    scalars.length ? /* @__PURE__ */ jsxRuntime.jsx(PropertyList, { labelWidth: 96, children: scalars.map(([k, v]) => /* @__PURE__ */ jsxRuntime.jsx(PropertyRow, { label: k, mono: true, className: "py-0.5", children: v == null ? "\u2014" : String(v) }, k)) }) : null,
    nested.map(([k, v]) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: k }),
      /* @__PURE__ */ jsxRuntime.jsx("pre", { className: "max-h-40 overflow-auto border border-border bg-muted/40 p-1.5 font-mono text-sm", children: JSON.stringify(v, null, 2) })
    ] }, k))
  ] });
}
var GanttDetailCard = React25__namespace.forwardRef(({ row, elapsedMs, formatDuration = defaultFormatDuration, className, ...props }, ref) => {
  const status = row.status ?? "succeeded";
  const ms = row.durationMs ?? elapsedMs;
  const duration = row.duration ?? (ms != null ? formatDuration(ms) : "\u2014");
  const attempts = row.attempts ?? [];
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: cn("flex flex-col gap-2", className), ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ jsxRuntime.jsx(StatusDot, { tone: DOT[status], size: "md", className: "translate-y-px" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-sm font-medium", children: row.key }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-mono text-sm text-muted-foreground tabular-nums", children: duration })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-sm text-muted-foreground", children: [
      STATUS_LABEL[status],
      row.summary != null ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        " \xB7 ",
        row.summary
      ] }) : null
    ] }),
    attempts.length ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col gap-0.5", children: attempts.map((a, i) => /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "font-medium text-warning", children: [
        "attempt ",
        i + 1
      ] }),
      " ",
      a.title ?? `${a.status ?? "failed"}${a.durationMs != null ? ` \xB7 ${formatDuration(a.durationMs)}` : ""}`
    ] }, i)) }) : null,
    row.bars?.length ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col gap-0.5", children: row.bars.map((s, i) => /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-baseline gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-foreground", children: s.label ?? s.title ?? s.status ?? "\u2014" }),
      s.durationMs != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-mono tabular-nums", children: formatDuration(s.durationMs) }) : null
    ] }, i)) }) : null,
    row.error != null ? /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        style: { borderColor: "var(--color-destructive)" },
        className: "border-l-2 bg-destructive/10 px-2 py-1.5",
        children: [
          row.error.code != null ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-mono text-sm font-medium text-destructive", children: row.error.code }) : null,
          row.error.message != null ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm", children: row.error.message }) : null,
          row.error.detail != null ? /* @__PURE__ */ jsxRuntime.jsx("pre", { className: "mt-1 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-sm text-muted-foreground", children: row.error.detail }) : null
        ]
      }
    ) : null,
    row.result != null ? renderResult(row.result) : null,
    row.log != null ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border-t border-border pt-1.5 font-mono text-sm text-muted-foreground", children: row.log }) : null
  ] });
});
GanttDetailCard.displayName = "GanttDetailCard";
var toMs = (t) => t instanceof Date ? t.getTime() : typeof t === "number" ? t : Date.parse(t);
var defaultFormatDuration = (ms) => {
  if (ms < 100) return `${Math.round(ms)}ms`;
  const s = ms / 1e3;
  return s < 10 ? `${(Math.round(s * 10) / 10).toFixed(1)}s` : `${Math.round(s)}s`;
};
var defaultFormatTick = (ms) => {
  if (ms === 0) return "0s";
  const s = ms / 1e3;
  return Number.isInteger(s) ? `${s}s` : `${(Math.round(s * 10) / 10).toFixed(1)}s`;
};
function place(bar, origin) {
  let start = bar.startMs;
  if (start == null && bar.startedAt != null && origin != null) {
    start = toMs(bar.startedAt) - origin;
  }
  if (start == null || Number.isNaN(start)) return null;
  let duration = bar.durationMs;
  if (duration == null && bar.startedAt != null && bar.finishedAt != null) {
    duration = toMs(bar.finishedAt) - toMs(bar.startedAt);
  }
  return { start, duration: duration != null && duration > 0 ? duration : 0 };
}
var everyRow = (rows) => rows.flatMap((t) => [t, ...everyRow(t.rows ?? [])]);
var barsOf = (row, zero) => [
  ...row.attempts ?? [],
  ...row.bars ?? [],
  { ...row, label: void 0, summary: void 0, result: void 0, error: void 0, log: void 0 }
].map((bar) => {
  const at = place(bar, zero);
  return at ? { ...at, status: bar.status ?? row.status ?? "succeeded", title: bar.title, bar } : null;
}).filter((s) => s !== null);
var VARIANT2 = {
  solid: "",
  outline: "border border-foreground/40 bg-transparent",
  dashed: "border border-dashed border-foreground/40 bg-transparent"
};
var hasCard = (bar) => bar.summary != null || bar.result != null || bar.error != null || bar.log != null;
var INDENT = 12;
var TOGGLE = 16;
function RowCard({
  trigger,
  detail,
  detailProps
}) {
  const x = React25__namespace.useRef(0);
  const [offset, setOffset] = React25__namespace.useState(0);
  const atCursor = detailProps?.side == null && detailProps?.align == null;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    HoverCard,
    {
      openDelay: detailProps?.openDelay ?? 200,
      closeDelay: detailProps?.closeDelay ?? 80,
      onOpenChange: (open) => {
        if (open) setOffset(x.current);
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          HoverCardTrigger,
          {
            asChild: true,
            onPointerMove: (e) => {
              x.current = e.clientX - e.currentTarget.getBoundingClientRect().left;
            },
            children: trigger
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          HoverCardContent,
          {
            side: detailProps?.side ?? "bottom",
            align: detailProps?.align ?? "start",
            alignOffset: atCursor ? offset + 16 : void 0,
            sideOffset: detailProps?.sideOffset ?? (atCursor ? 4 : 8),
            style: detailProps?.width != null ? { width: detailProps.width } : void 0,
            className: cn("w-72 p-3", detailProps?.className),
            children: detail
          }
        )
      ]
    }
  );
}
var Gantt = React25__namespace.forwardRef(
  ({
    rows,
    origin,
    spanMs,
    nowMs,
    openEnded,
    ticks = 4,
    formatTick = defaultFormatTick,
    formatDuration = defaultFormatDuration,
    labelWidth,
    durationWidth,
    brackets = [],
    seams = [],
    palette,
    renderBar,
    density = "comfortable",
    showDetail = true,
    renderDetail,
    detailProps,
    selectedKey,
    onSelectRow,
    onSelectBar,
    expanded,
    defaultExpanded,
    onExpandedChange,
    className,
    ...props
  }, ref) => {
    const barHeight = density === "compact" ? 11 : 13;
    const all = React25__namespace.useMemo(() => everyRow(rows), [rows]);
    const parents = all.filter((t) => t.rows?.length).map((t) => t.key);
    const nested = parents.length > 0;
    const { isOpen, toggle } = useExpandedKeys({
      expanded,
      defaultExpanded,
      onExpandedChange,
      keys: parents
    });
    const zero = React25__namespace.useMemo(() => {
      const stamps = [];
      for (const t of [...all, ...all.flatMap((t2) => t2.attempts ?? [])]) {
        if (t.startedAt != null) stamps.push(toMs(t.startedAt));
      }
      return origin != null ? toMs(origin) : stamps.length ? Math.min(...stamps) : void 0;
    }, [all, origin]);
    const placed = React25__namespace.useMemo(() => {
      const own = new Map(all.map((t) => [t.key, barsOf(t, zero)]));
      const reach = (t) => {
        const segs = everyRow([t]).flatMap((d) => own.get(d.key) ?? []);
        if (!segs.length) return null;
        return {
          start: Math.min(...segs.map((s) => s.start)),
          end: Math.max(...segs.map((s) => s.start + s.duration))
        };
      };
      return new Map(
        all.map((t) => [t.key, { bars: own.get(t.key) ?? [], reach: t.rows?.length ? reach(t) : null }])
      );
    }, [all, zero]);
    const visible = [];
    const walk = (list, depth) => {
      for (const row of list) {
        visible.push({ row, depth });
        if (row.rows?.length && isOpen(row.key)) walk(row.rows, depth + 1);
      }
    };
    walk(rows, 0);
    const placedSeams = seams.map((seam) => ({ seam, at: place(seam, zero) })).filter((s) => s.at !== null);
    const ends = [...placed.values()].flatMap((p) => p.bars.map((s) => s.start + s.duration));
    const span = Math.max(
      spanMs ?? Math.max(
        nowMs ?? 0,
        ...ends,
        ...placedSeams.map((s) => s.at.start + s.at.duration)
      ),
      1
    );
    const inBracket = /* @__PURE__ */ new Set();
    const opens = /* @__PURE__ */ new Map();
    for (const b of brackets) {
      const from = visible.findIndex((r) => r.row.key === b.from);
      const to = visible.findIndex((r, i) => i >= from && r.row.key === b.to);
      if (from < 0 || to < 0) continue;
      opens.set(visible[from].row.key, b);
      for (let i = from; i <= to; i++) inBracket.add(i);
    }
    const seamsAfter = (key) => placedSeams.filter((s) => s.seam.after === key);
    const pct = (ms) => `${Math.max(0, Math.min(100, ms / span * 100))}%`;
    const axis = Array.from(
      { length: ticks + 1 },
      (_, i) => formatTick(span / ticks * i)
    );
    const lastLabel = openEnded ? `${axis[axis.length - 1]}+` : axis[axis.length - 1];
    const detailFor = (row, elapsedMs) => {
      if (!showDetail) return null;
      if (renderDetail) return renderDetail(row);
      if (row.detail != null) return row.detail;
      const hasBody = row.result != null || row.error != null || row.log != null || row.summary != null || (row.attempts?.length ?? 0) > 0 || (row.bars?.length ?? 0) > 0;
      if (!hasBody) return null;
      return /* @__PURE__ */ jsxRuntime.jsx(
        GanttDetailCard,
        {
          row,
          elapsedMs,
          formatDuration
        }
      );
    };
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        className: cn("grid gap-x-2", className),
        style: {
          gridTemplateColumns: `${labelWidth != null ? `${labelWidth}px` : "fit-content(40%)"} minmax(0, 1fr) ${durationWidth != null ? `${durationWidth}px` : "max-content"}`
        },
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "col-span-full grid grid-cols-subgrid items-center pt-0.5 pb-1", "aria-hidden": true, children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", {}),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex", children: axis.slice(0, -1).map((label, i) => /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: "flex-1 border-l border-border pl-1 text-sm text-muted-foreground tabular-nums",
                children: label
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-right text-sm text-muted-foreground tabular-nums", children: lastLabel })
          ] }),
          visible.map(({ row, depth }, index) => {
            const { bars, reach } = placed.get(row.key);
            const kids = (row.rows?.length ?? 0) > 0;
            const open = kids && isOpen(row.key);
            const neverRan = bars.length === 0 && reach == null;
            const selected = selectedKey != null && selectedKey === row.key;
            const bracketed = inBracket.has(index);
            const barPicks = onSelectBar != null && (row.bars ?? []).some((s) => s.key != null);
            const pickable = onSelectRow != null && !barPicks;
            const ownBar = place(row, zero) != null;
            const elapsed = row.durationMs ?? (row.bars?.length && !ownBar ? bars.reduce((n, s) => n + s.duration, 0) : bars[bars.length - 1]?.duration) ?? (reach ? reach.end - reach.start : void 0);
            const duration = row.duration ?? (neverRan || elapsed == null ? "\u2014" : formatDuration(elapsed));
            const barCards = bars.map(
              (s) => showDetail && hasCard(s.bar) ? /* @__PURE__ */ jsxRuntime.jsx(
                GanttDetailCard,
                {
                  row: {
                    key: s.bar.key ?? row.key,
                    label: s.bar.label,
                    status: s.status,
                    durationMs: s.duration,
                    summary: s.bar.summary,
                    result: s.bar.result,
                    error: s.bar.error,
                    log: s.bar.log
                  },
                  formatDuration
                }
              ) : null
            );
            const detail = barCards.some((c) => c != null) ? null : detailFor(row, elapsed);
            const contents = bars.map(
              (s) => renderBar ? renderBar(s.bar, row) : s.bar.label ?? null
            );
            const tall = contents.some((c) => c != null);
            const twoLines = tall && bars.some((s) => s.bar.note != null);
            const cells = /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "col-span-full grid grid-cols-subgrid items-center py-[3px]", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: cn(
                    "min-w-0 truncate font-mono text-sm",
                    neverRan && "text-muted-foreground"
                  ),
                  style: nested ? { paddingLeft: depth * INDENT + TOGGLE } : void 0,
                  title: row.key,
                  children: row.label ?? row.key
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs(
                "span",
                {
                  className: cn(
                    "relative min-w-0 bg-muted/55",
                    twoLines ? "h-control-md" : tall && "h-control-xs"
                  ),
                  style: tall ? void 0 : { height: barHeight },
                  children: [
                    neverRan ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute inset-0 border border-dashed border-border" }) : bars.length ? bars.map((b, i) => {
                      const fill = b.status !== "failed" && b.status !== "refused" && b.bar.group != null && palette?.[b.bar.group] || BAR[b.status];
                      const variant = VARIANT2[b.bar.variant ?? "solid"];
                      const inside = contents[i];
                      const title = b.title ?? `${row.key} \xB7 ${b.status} \xB7 ${formatDuration(b.duration)}`;
                      const at = { left: pct(b.start), width: pct(b.duration), minWidth: 2 };
                      const key = b.bar.key;
                      const Bar = barPicks && key != null ? "button" : "span";
                      const pick = Bar === "button" ? {
                        type: "button",
                        "aria-label": title,
                        "aria-pressed": selectedKey === key,
                        onClick: () => onSelectBar(key, row.key)
                      } : {};
                      const lit = key != null && selectedKey === key && "ring-1 ring-ring";
                      const picking = Bar === "button" && "cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
                      const card = barCards[i];
                      const tip = card == null ? title : void 0;
                      const drawn = inside == null ? /* @__PURE__ */ jsxRuntime.jsx(
                        Bar,
                        {
                          title: tip,
                          className: cn("absolute inset-y-0 rounded-[1px]", variant || fill, picking, lit),
                          style: at,
                          ...pick
                        },
                        i
                      ) : (
                        // A card with the fill as its rail: text on a status colour
                        // is unreadable in half the themes.
                        /* @__PURE__ */ jsxRuntime.jsxs(
                          Bar,
                          {
                            title: tip,
                            className: cn(
                              "absolute inset-y-px flex min-w-0 items-stretch overflow-hidden rounded-xs border border-border bg-card text-left",
                              b.bar.variant === "dashed" && "border-dashed",
                              // Muted, not accent: in some themes accent is a strong hue
                              // and the bar's text would sit on it.
                              picking && [picking, "hover:bg-muted"],
                              lit
                            ),
                            style: at,
                            ...pick,
                            children: [
                              /* @__PURE__ */ jsxRuntime.jsx(
                                "span",
                                {
                                  "aria-hidden": true,
                                  className: cn("w-1 shrink-0", b.bar.variant && b.bar.variant !== "solid" ? "bg-border" : fill)
                                }
                              ),
                              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-auto flex-col justify-center px-1", children: [
                                /* @__PURE__ */ jsxRuntime.jsx(
                                  "span",
                                  {
                                    className: cn(
                                      "truncate font-mono text-sm",
                                      b.status === "refused" && "text-destructive line-through"
                                    ),
                                    children: inside
                                  }
                                ),
                                b.bar.note != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate text-sm text-muted-foreground", children: b.bar.note }) : null
                              ] }),
                              b.bar.chip != null ? (
                                // The chip gives way first: a narrow bar keeps its name.
                                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex min-w-0 shrink-[100] items-center overflow-hidden pr-1", children: b.bar.chip })
                              ) : null
                            ]
                          },
                          i
                        )
                      );
                      return card == null ? drawn : /* @__PURE__ */ jsxRuntime.jsx(RowCard, { trigger: drawn, detail: card, detailProps }, i);
                    }) : reach ? /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        title: `${row.key} \xB7 ${row.rows.length} rows \xB7 ${formatDuration(reach.end - reach.start)}`,
                        className: "absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-foreground/45",
                        style: {
                          left: pct(reach.start),
                          width: pct(reach.end - reach.start),
                          minWidth: 2
                        }
                      }
                    ) : null,
                    nowMs != null ? /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        className: "absolute -top-0.5 -bottom-0.5 w-px bg-info/70",
                        style: { left: pct(nowMs) },
                        "aria-hidden": true
                      }
                    ) : null
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-right font-mono text-sm text-muted-foreground tabular-nums", children: duration })
            ] });
            const trigger = pickable ? /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                "aria-pressed": selected,
                onClick: () => onSelectRow(row.key),
                className: cn(
                  "col-span-full row-start-1 grid cursor-pointer grid-cols-subgrid text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  "hover:bg-accent/60",
                  bracketed && !selected && "bg-warning/5",
                  selected && "bg-accent"
                ),
                children: cells
              }
            ) : /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: cn(
                  "col-span-full row-start-1 grid grid-cols-subgrid",
                  bracketed && "bg-warning/5",
                  detail != null && "hover:bg-accent/60"
                ),
                children: cells
              }
            );
            const line = /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "col-span-full grid grid-cols-subgrid", children: [
              detail == null ? trigger : /* @__PURE__ */ jsxRuntime.jsx(RowCard, { trigger, detail, detailProps }),
              kids ? /* @__PURE__ */ jsxRuntime.jsx(
                ExpandToggle,
                {
                  open,
                  label: row.key,
                  onClick: () => toggle(row.key),
                  className: "z-10 col-start-1 row-start-1 self-center justify-self-start",
                  style: { marginLeft: depth * INDENT }
                }
              ) : null
            ] });
            const bracket = opens.get(row.key);
            return /* @__PURE__ */ jsxRuntime.jsxs(React25__namespace.Fragment, { children: [
              bracket ? /* @__PURE__ */ jsxRuntime.jsx(
                "div",
                {
                  className: "col-span-full truncate border-l-2 bg-warning/10 px-2 py-0.5 font-mono text-sm font-medium text-warning",
                  style: { borderColor: "var(--color-warning)" },
                  children: bracket.label
                }
              ) : null,
              line,
              seamsAfter(row.key).map(({ seam, at }, i) => /* @__PURE__ */ jsxRuntime.jsxs(
                "div",
                {
                  className: "col-span-full grid grid-cols-subgrid items-center py-[3px]",
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate font-mono text-sm font-medium text-destructive", children: seam.label }),
                    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "relative min-w-0", style: { height: barHeight }, children: [
                      /* @__PURE__ */ jsxRuntime.jsx(
                        "span",
                        {
                          className: "absolute top-1/2 border-t-2 border-dashed",
                          style: {
                            left: pct(at.start),
                            width: pct(at.duration),
                            borderColor: "var(--color-destructive)"
                          }
                        }
                      ),
                      seam.note != null ? /* @__PURE__ */ jsxRuntime.jsx(
                        "span",
                        {
                          className: "absolute top-1/2 max-w-full -translate-x-1/2 -translate-y-1/2 truncate bg-card px-1.5 text-sm text-destructive",
                          style: { left: pct(at.start + at.duration / 2) },
                          children: seam.note
                        }
                      ) : null
                    ] }),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-right font-mono text-sm text-destructive tabular-nums", children: seam.duration ?? formatDuration(at.duration) })
                  ]
                },
                `seam-${i}`
              ))
            ] }, row.key);
          })
        ]
      }
    );
  }
);
Gantt.displayName = "Gantt";
var HeaderTrail = React25__namespace.forwardRef(
  ({ brand, crumbs, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs("nav", { ref, "aria-label": "Breadcrumb", className: cn("flex min-w-0 items-center gap-1", className), ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 select-none px-2 text-xl font-bold", children: brand }),
    /* @__PURE__ */ jsxRuntime.jsx(Separator, { orientation: "vertical", className: "h-4 shrink-0" }),
    /* @__PURE__ */ jsxRuntime.jsx("ol", { className: "flex min-w-0 items-center gap-1.5 px-1.5 font-bold", children: crumbs.map((c, i) => /* @__PURE__ */ jsxRuntime.jsxs("li", { className: cn("flex min-w-0 items-center gap-1.5", i === crumbs.length - 1 ? "shrink" : "shrink-[2]"), children: [
      i ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "shrink-0 text-muted-foreground", children: "/" }) : null,
      c.href || c.onClick ? /* @__PURE__ */ jsxRuntime.jsx(
        "a",
        {
          href: c.href ?? "#",
          onClick: c.onClick ? (e) => {
            e.preventDefault();
            c.onClick();
          } : void 0,
          "aria-current": i === crumbs.length - 1 ? "page" : void 0,
          className: "min-w-0 truncate rounded-control hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          children: c.label
        }
      ) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate", "aria-current": i === crumbs.length - 1 ? "page" : void 0, children: c.label })
    ] }, `${i}-${c.label}`)) })
  ] })
);
HeaderTrail.displayName = "HeaderTrail";
var TaskNode = React25__namespace.forwardRef(
  ({
    taskKey,
    bound,
    boundSwatch,
    boundPalette,
    status,
    tags,
    meta,
    selected,
    readOnly,
    gate,
    dim,
    ghost,
    className,
    ...props
  }, ref) => {
    if (ghost) {
      return /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref,
          className: cn(
            "flex w-[146px] flex-col gap-1 border border-dashed border-border p-2",
            "text-sm text-muted-foreground",
            className
          ),
          ...props,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate font-mono", children: taskKey }),
            meta != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: meta }) : null
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        "data-selected": selected || void 0,
        className: cn(
          "relative flex w-[146px] flex-col gap-1 border bg-card p-2 shadow-xs",
          // The ring says one thing at a time, in this order: you picked it,
          // it is held for approval, it failed. A node cannot be two of those.
          selected ? "border-primary ring-2 ring-primary/25" : gate ? "border-warning" : status === "error" ? "border-destructive" : "border-border",
          dim && "opacity-45",
          className
        ),
        ...props,
        children: [
          selected && !readOnly ? ["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(
            (pos) => /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                "aria-hidden": true,
                className: cn("absolute size-[7px] border-[1.5px] border-primary bg-card", pos)
              },
              pos
            )
          ) : null,
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1.5", children: [
            status ? /* @__PURE__ */ jsxRuntime.jsx(StatusDot, { tone: status, size: "sm" }) : null,
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate font-mono", children: taskKey })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntime.jsx(BoundChip, { bound, swatch: boundSwatch, palette: boundPalette }),
            tags?.map((tag, i) => /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: cn(
                  "shrink-0 border px-1 text-sm",
                  tag.tone === "warning" ? "border-warning/40 text-warning" : "border-border text-muted-foreground"
                ),
                children: tag.label
              },
              i
            ))
          ] }),
          meta != null ? /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: cn(
                "truncate text-sm",
                gate ? "text-warning" : "text-muted-foreground"
              ),
              children: meta
            }
          ) : null
        ]
      }
    );
  }
);
TaskNode.displayName = "TaskNode";
var TemplatePicker = React25__namespace.forwardRef(({ heading, options, value, onSelect, footnote, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  "div",
  {
    ref,
    className: cn("flex w-full flex-col border border-border bg-card", className),
    ...props,
    children: [
      heading != null ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-control-sm shrink-0 items-center border-b border-border bg-chrome px-2 text-sm text-muted-foreground", children: heading }) : null,
      /* @__PURE__ */ jsxRuntime.jsx("div", { role: "listbox", className: "flex flex-col", children: options.map((o) => {
        const disabled = o.unavailable != null;
        const selected = value === o.id;
        return /* @__PURE__ */ jsxRuntime.jsxs(
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
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w-3 shrink-0 text-primary", children: selected ? "\u2022" : "" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate font-mono text-sm", children: o.id }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: o.kind }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 truncate text-sm text-muted-foreground", children: o.unavailable ?? o.note })
            ]
          },
          o.id
        );
      }) }),
      footnote != null ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border-t border-border bg-chrome px-2 py-1 text-sm text-muted-foreground", children: footnote }) : null
    ]
  }
));
TemplatePicker.displayName = "TemplatePicker";
var TimelineVariantContext = React25__namespace.createContext("columns");
var RAIL_MARKER_OFFSET = "h-[0.692rem]";
var RAIL_FOOTER_TAIL = "h-[1.067rem]";
var TimelineList = React25__namespace.forwardRef(({ className, variant = "columns", children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(TimelineVariantContext.Provider, { value: variant, children: /* @__PURE__ */ jsxRuntime.jsx("ol", { ref, className: cn("flex flex-col", className), ...props, children }) }));
TimelineList.displayName = "TimelineList";
function RailGutter({ marker }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex w-2.5 shrink-0 flex-col items-center", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
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
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": true,
        className: "w-px flex-1 bg-border group-last/entry:bg-transparent"
      }
    )
  ] });
}
function EntryBody({
  title,
  children,
  nested,
  open,
  onToggle
}) {
  const text = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    title != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: title }) : null,
    children
  ] });
  if (nested == null) return text;
  const label = [title, ...React25__namespace.Children.toArray(children)].find(
    (n) => typeof n === "string"
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 items-start gap-1", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        ExpandToggle,
        {
          open,
          label,
          onClick: onToggle,
          className: "mt-px"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: text })
    ] }),
    open ? /* @__PURE__ */ jsxRuntime.jsx("ol", { className: "flex flex-col pt-1", children: nested }) : null
  ] });
}
var TimelineEntry = React25__namespace.forwardRef(({ when, title, marker, highlight, nested, open: openProp, defaultOpen, onOpenChange, className, children, ...props }, ref) => {
  const variant = React25__namespace.useContext(TimelineVariantContext);
  const [ownOpen, setOwnOpen] = React25__namespace.useState(defaultOpen ?? false);
  const open = openProp ?? ownOpen;
  const toggle = () => {
    if (openProp === void 0) setOwnOpen(!open);
    onOpenChange?.(!open);
  };
  const body = /* @__PURE__ */ jsxRuntime.jsx(EntryBody, { title, nested, open, onToggle: toggle, children });
  if (variant === "compact") {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "li",
      {
        ref,
        className: cn(
          "grid grid-cols-[3.5rem_0.75rem_minmax(0,1fr)] items-baseline gap-1.5 pb-1 last:pb-0",
          highlight && "rounded-md",
          highlight === "error" && "bg-destructive/15",
          highlight === "warning" && "bg-warning/15",
          highlight === "success" && "bg-success/15",
          highlight === "info" && "bg-info/15",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate font-mono text-xs text-muted-foreground", children: when }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex justify-center", children: marker }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 flex-col gap-0.5 text-sm", children: body })
        ]
      }
    );
  }
  if (variant === "rail") {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "li",
      {
        ref,
        className: cn("group/entry flex gap-2.5", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(RailGutter, { marker }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5 pb-4 group-last/entry:pb-0", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: when }),
            body
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "li",
    {
      ref,
      className: cn("flex gap-2 border-b border-border py-1.5 last:border-b-0", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex w-[72px] shrink-0 items-baseline gap-1.5 text-sm text-muted-foreground", children: [
          marker ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "translate-y-1", children: marker }) : null,
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: when })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: body })
      ]
    }
  );
});
TimelineEntry.displayName = "TimelineEntry";
var TimelineFooter = React25__namespace.forwardRef(({ className, children, ...props }, ref) => {
  const variant = React25__namespace.useContext(TimelineVariantContext);
  if (variant === "rail") {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "li",
      {
        ref,
        role: "presentation",
        className: cn("flex gap-2.5", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex w-2.5 shrink-0 justify-center", children: /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: cn("w-px bg-border", RAIL_FOOTER_TAIL) }) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "min-w-0 flex-1 pt-1.5", children })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx("li", { ref, role: "presentation", className: cn("pt-1.5", className), ...props, children });
});
TimelineFooter.displayName = "TimelineFooter";
var TimelineSection = React25__namespace.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "li",
    {
      ref,
      role: "presentation",
      className: cn(
        "pt-1 pb-0.5 font-mono text-xs uppercase tracking-wide text-muted-foreground",
        className
      ),
      ...props,
      children
    }
  )
);
TimelineSection.displayName = "TimelineSection";
var isSeparator = (item) => "separator" in item;
var Toolbar = React25__namespace.forwardRef(({ items, onAction, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { ref, role: "toolbar", className: cn("flex h-control-sm items-center gap-1", className), ...props, children: items.map((item, i) => {
  if (isSeparator(item)) return /* @__PURE__ */ jsxRuntime.jsx(Separator, { orientation: "vertical", className: "h-4" }, `separator-${i}`);
  const common = {
    variant: "ghost",
    disabled: item.disabled,
    "aria-pressed": item.pressed,
    className: cn(item.pressed && "bg-accent text-accent-foreground"),
    onClick: () => onAction?.(item.id)
  };
  return item.icon ? /* @__PURE__ */ jsxRuntime.jsx(ButtonWithTooltip, { ...common, size: "icon-sm", tooltip: item.label, "aria-label": item.label, children: item.icon }, item.id) : /* @__PURE__ */ jsxRuntime.jsx(Button, { ...common, size: "sm", children: item.label }, item.id);
}) }));
Toolbar.displayName = "Toolbar";
var TouchStrip = React25__namespace.forwardRef(
  ({ items, palette, orientation = "row", className, ...props }, ref) => orientation === "column" ? /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      role: "list",
      className: cn("flex flex-col", className),
      ...props,
      children: items.map((item) => {
        const paint = layerPaint(palette, item.layer);
        return /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            role: "listitem",
            className: "flex min-w-0 items-center gap-2 py-1",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  "aria-hidden": true,
                  className: cn(
                    "size-2 shrink-0 rounded-[2px]",
                    item.dim ? "bg-muted-foreground/30" : paint.swatch
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: cn(
                    "min-w-0 flex-1 truncate",
                    item.dim && "text-muted-foreground",
                    item.refused && "line-through"
                  ),
                  children: item.label ?? layerLabel(item.layer)
                }
              ),
              item.note != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 truncate font-mono text-sm text-muted-foreground", children: item.note }) : null
            ]
          },
          String(item.layer)
        );
      })
    }
  ) : /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      role: "list",
      className: cn("flex flex-wrap gap-2", className),
      ...props,
      children: items.map((item) => {
        const paint = layerPaint(palette, item.layer);
        return /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            role: "listitem",
            className: cn(
              "flex min-w-0 flex-1 flex-col gap-px rounded-md border border-border bg-card px-2 py-1",
              item.dim && "opacity-55"
            ),
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    "aria-hidden": true,
                    className: cn(
                      "size-1.5 shrink-0 rounded-full",
                      item.dim ? "bg-muted-foreground" : paint.swatch
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    className: cn(
                      "min-w-0 truncate",
                      item.dim && "text-muted-foreground"
                    ),
                    children: item.label ?? layerLabel(item.layer)
                  }
                )
              ] }),
              item.note != null ? /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: cn(
                    "truncate font-mono text-xs text-muted-foreground",
                    item.refused && "line-through"
                  ),
                  children: item.note
                }
              ) : null
            ]
          },
          String(item.layer)
        );
      })
    }
  )
);
TouchStrip.displayName = "TouchStrip";
function useTour(options) {
  const {
    steps,
    initialStep = 0,
    loop = false,
    onStepChange,
    onComplete,
    onExit
  } = options;
  const [current, setCurrent] = React25__namespace.useState(initialStep);
  const total = steps.length;
  const lastIndex = Math.max(total - 1, 0);
  const clamped = Math.min(Math.max(current, 0), lastIndex);
  const at = React25__namespace.useRef(clamped);
  at.current = clamped;
  const move = React25__namespace.useCallback(
    (to) => {
      if (to === at.current) return;
      at.current = to;
      setCurrent(to);
      onStepChange?.(to);
    },
    [onStepChange]
  );
  const goTo = React25__namespace.useCallback(
    (index) => move(Math.min(Math.max(index, 0), lastIndex)),
    [lastIndex, move]
  );
  const next = React25__namespace.useCallback(() => {
    if (at.current < lastIndex) return move(at.current + 1);
    if (loop && total > 0) return move(0);
    onComplete?.();
  }, [lastIndex, total, loop, onComplete, move]);
  const prev = React25__namespace.useCallback(() => {
    if (at.current > 0) return move(at.current - 1);
    if (loop && total > 0) move(lastIndex);
  }, [lastIndex, total, loop, move]);
  const exit = React25__namespace.useCallback(() => {
    onExit?.();
  }, [onExit]);
  return React25__namespace.useMemo(
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
  return /* @__PURE__ */ jsxRuntime.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntime.jsxs(
    Card,
    {
      className: cn(
        "w-80 gap-0 border-border bg-popover p-0 text-popover-foreground shadow-lg",
        positionClasses[position],
        className
      ),
      role: "dialog",
      "aria-label": typeof badgeLabel === "string" ? badgeLabel : void 0,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "soft", className: "tracking-wider", children: badgeLabel }),
            showCounter && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              current + 1,
              " / ",
              total
            ] })
          ] }),
          showExit && /* @__PURE__ */ jsxRuntime.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "-mr-1 h-7 gap-1 px-2 text-sm text-muted-foreground [&_svg]:size-3.5",
              onClick: ctrl.exit,
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, {}),
                exitLabel
              ]
            }
          )
        ] }),
        showProgressBar && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mx-3 h-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: "h-full rounded-full bg-primary transition-all",
            style: { width: `${progress}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "space-y-4 p-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-base font-semibold leading-snug", children: step.title }),
          step.content ?? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            step.body && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "leading-relaxed text-muted-foreground", children: step.body }),
            step.callout && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "rounded-r-md border-l-2 border-primary bg-muted/40 p-3", children: [
              step.callout.label && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary", children: step.callout.label }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "leading-relaxed", children: step.callout.content })
            ] }),
            step.references && step.references.items.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
              step.references.label && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: step.references.label }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-2", children: step.references.items.map((item, i) => {
                const Icon = item.icon;
                return item.onClick ? /* @__PURE__ */ jsxRuntime.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: item.onClick,
                    className: cn(
                      badgeVariants({ variant: "secondary" }),
                      "cursor-pointer gap-1 transition-colors hover:bg-accent hover:text-accent-foreground"
                    ),
                    children: [
                      Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "size-3" }),
                      item.label
                    ]
                  },
                  `${item.label}-${i}`
                ) : /* @__PURE__ */ jsxRuntime.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "gap-1",
                    children: [
                      Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "size-3" }),
                      item.label
                    ]
                  },
                  `${item.label}-${i}`
                );
              }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntime.jsxs(CardFooter, { className: "justify-between p-3", children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: ctrl.prev,
              disabled: isFirst,
              className: "gap-1 [&_svg]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronLeft, {}),
                prevLabel
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              onClick: ctrl.next,
              className: "gap-1 [&_svg]:size-4",
              children: [
                isLast ? finishLabel : nextLabel,
                /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, {})
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
var TraceVariant = React25__namespace.createContext("default");
var TraceList = React25__namespace.forwardRef(
  ({ variant = "default", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(TraceVariant.Provider, { value: variant, children: /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      role: "list",
      className: cn(
        "flex flex-col",
        variant === "progress" ? "gap-1" : "[&>*:first-child]:border-t-0",
        className
      ),
      ...props,
      children
    }
  ) })
);
TraceList.displayName = "TraceList";
var STATUS_DOT = {
  done: "bg-primary",
  running: "bg-info animate-pulse motion-reduce:animate-none",
  pending: "border-[1.5px] border-muted-foreground",
  failed: "bg-destructive",
  waiting: "border-[1.5px] border-info",
  retrying: "bg-warning animate-pulse motion-reduce:animate-none",
  stopped: "bg-warning"
};
var TraceStep = React25__namespace.forwardRef(
  ({
    seq,
    name,
    description,
    layer,
    role,
    duration,
    note,
    mark,
    palette,
    depth = 0,
    dim,
    struck,
    selected,
    onSelect,
    status = "done",
    error,
    className,
    ...props
  }, ref) => {
    const variant = React25__namespace.useContext(TraceVariant);
    if (variant === "progress") {
      return /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref,
          role: "listitem",
          className: cn("grid min-w-0 grid-cols-[0.75rem_1fr_auto] items-center gap-x-2 text-sm", className),
          ...props,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                role: "img",
                "aria-label": status,
                className: cn("size-[7px] rounded-full", STATUS_DOT[status])
              }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: cn("min-w-0 truncate", status === "pending" && "text-muted-foreground"), children: name }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: duration }),
            error != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "col-start-2 col-end-4 text-xs text-destructive", children: error }) : null
          ]
        }
      );
    }
    const paint = layer ? layerPaint(palette, layer) : void 0;
    const Row = onSelect ? "button" : "div";
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        role: "listitem",
        className: cn(
          "flex min-h-[46px] items-stretch border-t border-border/55",
          selected && "bg-accent shadow-[inset_2px_0_0_var(--color-primary)]",
          dim && "opacity-50",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              "aria-hidden": true,
              className: cn(
                "w-[3px] shrink-0",
                struck ? "bg-destructive" : paint?.swatch ?? "bg-muted-foreground"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            Row,
            {
              type: onSelect ? "button" : void 0,
              onClick: onSelect,
              className: cn(
                "flex min-w-0 flex-1 items-center gap-2 pr-3 text-left",
                onSelect && "cursor-pointer hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
              ),
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    style: { width: 26 + depth * 18 },
                    className: "shrink-0 text-right font-mono text-xs text-muted-foreground",
                    children: seq
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-1 flex-col gap-px py-1.5 pl-2", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        className: cn(
                          "min-w-0 truncate font-mono font-semibold",
                          struck && "text-destructive line-through"
                        ),
                        children: name
                      }
                    ),
                    mark
                  ] }),
                  description != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate text-sm text-muted-foreground", children: description }) : null
                ] }),
                layer != null ? (
                  // The layer is never the part that gives way: it is one of six short
                  // words and it is what the row is *about*. The role is the longer,
                  // subordinate string, so it truncates first.
                  /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex w-[10.5rem] shrink-0 items-center justify-end gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        "aria-hidden": true,
                        className: cn(
                          "size-1.5 shrink-0 rounded-full",
                          dim ? "bg-muted-foreground" : paint?.swatch
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        className: cn(
                          "shrink-0 text-sm whitespace-nowrap",
                          dim && "text-muted-foreground"
                        ),
                        children: layerLabel(layer)
                      }
                    ),
                    role != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate font-mono text-xs text-muted-foreground", children: role }) : null
                  ] })
                ) : null,
                /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex w-[6rem] shrink-0 flex-col items-end", children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono text-sm", children: duration }),
                  note != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground", children: note }) : null
                ] })
              ]
            }
          )
        ]
      }
    );
  }
);
TraceStep.displayName = "TraceStep";
var LOOP_TONE = {
  warning: { box: "border-l-warning bg-warning/5", label: "text-warning" },
  info: { box: "border-l-info bg-info/5", label: "text-info" },
  muted: { box: "border-l-muted-foreground bg-muted/40", label: "text-muted-foreground" }
};
var TraceLoop = React25__namespace.forwardRef(
  ({ label, summary, tone = "warning", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      role: "group",
      "aria-label": typeof label === "string" ? label : void 0,
      className: cn("border-l-2", LOOP_TONE[tone].box, className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex h-[25px] items-center gap-2 border-t border-border/55 px-3", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: cn(
                "truncate font-mono text-xs font-semibold",
                LOOP_TONE[tone].label
              ),
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1" }),
          summary != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-xs text-muted-foreground", children: summary }) : null
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "[&>*:first-child]:border-t-0", children })
      ]
    }
  )
);
TraceLoop.displayName = "TraceLoop";
var GATE_TONE = {
  destructive: "border-destructive text-destructive",
  warning: "border-warning text-warning",
  muted: "border-muted-foreground text-muted-foreground"
};
var TraceGate = React25__namespace.forwardRef(
  ({ label, note, tone = "destructive", edge = "before", className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      role: "separator",
      "aria-label": typeof label === "string" ? label : void 0,
      className: cn("relative flex h-[38px] items-center", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            "aria-hidden": true,
            className: cn(
              "absolute inset-x-0 border-t-2",
              GATE_TONE[tone],
              edge === "before" ? "top-[18px]" : "bottom-[18px]"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "span",
          {
            className: cn(
              "relative ml-8 flex items-center gap-2 rounded-md border bg-card px-2 py-0.5",
              GATE_TONE[tone]
            ),
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "font-mono text-xs font-semibold whitespace-nowrap", children: [
                "\u25C8 ",
                label
              ] }),
              note != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate text-xs text-muted-foreground", children: note }) : null
            ]
          }
        )
      ]
    }
  )
);
TraceGate.displayName = "TraceGate";
var TreeView = ({ searchable = false, ...props }) => {
  const [searchQuery, setSearchQuery] = React25__namespace.useState("");
  const filterItems = (items, query) => {
    if (!query) return items;
    return items.map((item) => ({
      ...item,
      children: item.children ? filterItems(item.children, query) : []
    })).filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.children && item.children.length > 0);
  };
  const filteredItems = filterItems(props.items, searchQuery);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn("rounded-lg border bg-card text-card-foreground shadow-sm w-[240px]", props.className),
      style: props.style,
      children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-3", children: [
        props.header && props.header,
        searchable && /* @__PURE__ */ jsxRuntime.jsx(SearchInput, { value: searchQuery, onChange: setSearchQuery }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-0.5", children: filteredItems.map((item) => /* @__PURE__ */ jsxRuntime.jsx(TreeItem, { item }, item.id)) })
      ] })
    }
  );
};
var TreeItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = React25__namespace.useState(item.isExpanded ?? true);
  const hasChildren = item.children && item.children.length > 0;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
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
          hasChildren && /* @__PURE__ */ jsxRuntime.jsx(
            lucideReact.ChevronRight,
            {
              className: cn(
                "h-4 w-4 shrink-0 transition-transform",
                isExpanded && "rotate-90"
              )
            }
          ),
          item.icon,
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: item.label })
        ]
      }
    ),
    hasChildren && isExpanded && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ml-4 pl-4 relative", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute left-0 top-0 bottom-0 border-l border-muted-foreground/25" }),
      item.children?.map((child, index) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute -left-4 top-[15px] w-4 border-t border-muted-foreground/25" }),
        /* @__PURE__ */ jsxRuntime.jsx(TreeItem, { item: child }, index)
      ] }, child.id))
    ] })
  ] });
};
var underDevelopmentVariants = classVarianceAuthority.cva(
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
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn(underDevelopmentVariants({ size }), "text-center", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Construction, { size: iconSize, className: "text-primary" }),
    /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "text-2xl font-bold", children: title }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-muted-foreground max-w-md", children: description }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "mt-4 px-3 py-1 bg-yellow-100 text-yellow-800", children: "Coming Soon" })
  ] });
}
function HeaderIconButton({
  icon: Icon,
  label,
  onClick,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      type: "button",
      "aria-label": label,
      title: label,
      onClick,
      disabled,
      className: "grid h-full w-control-md shrink-0 place-items-center rounded-none text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
      children: /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "h-4 w-4" })
    }
  );
}
function PagerControls({
  position,
  hasPager,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onAdd,
  addLabel
}) {
  if (!hasPager && !onAdd) return null;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex shrink-0 items-stretch", position === "start" ? "border-r" : "border-l"), children: [
    hasPager ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(HeaderIconButton, { icon: lucideReact.ChevronLeft, label: "Previous tab", onClick: onPrev, disabled: !canPrev }),
      /* @__PURE__ */ jsxRuntime.jsx(HeaderIconButton, { icon: lucideReact.ChevronRight, label: "Next tab", onClick: onNext, disabled: !canNext })
    ] }) : null,
    onAdd ? /* @__PURE__ */ jsxRuntime.jsx(HeaderIconButton, { icon: lucideReact.Plus, label: addLabel, onClick: onAdd }) : null
  ] });
}
function Workbook({
  pages,
  activeId,
  onSelect,
  onAdd,
  tabPosition = "top",
  pagerPosition = "end",
  headerActions,
  pageMenuItems,
  onClose,
  addLabel = "New page",
  overflow = true,
  overflowLabel = "More pages",
  keepMounted = true,
  className,
  headerClassName,
  bodyClassName,
  tabClassName,
  activeTabClassName
}) {
  const activePage = pages.find((p) => p.id === activeId);
  const activeIndex = pages.findIndex((p) => p.id === activeId);
  const uid = React25.useId();
  const panelId = (pageId) => `${uid}-page-${pageId}`;
  const items = React25.useMemo(
    () => pages.map((page) => {
      const active = page.id === activeId;
      const closable = Boolean(page.closable && onClose);
      const menuItems = active && !closable && pageMenuItems && pageMenuItems.length > 0 ? pageMenuItems.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        destructive: item.destructive,
        separatorBefore: item.separatorBefore,
        disabled: typeof item.disabled === "function" ? item.disabled(page.id) : item.disabled,
        onSelect: () => item.onSelect(page.id)
      })) : void 0;
      return {
        key: page.id,
        name: page.title,
        label: page.title,
        labelClassName: "max-w-[16ch] truncate",
        icon: page.icon,
        disabled: page.disabled,
        style: page.tabStyle,
        menuItems,
        menuTrigger: "caret",
        onClose: closable ? () => onClose?.(page.id) : void 0,
        // Ordered so consumer overrides win via tailwind-merge, exactly as the
        // hand-rolled tab did: the strip's own text treatment, then view-level
        // classes (every tab), then per-page, then the active-only view class.
        // `text-muted-foreground` is conditional so the variant's active
        // `text-primary` isn't overridden by it.
        className: cn(
          "shrink-0",
          !active && "text-muted-foreground",
          tabClassName,
          page.tabClassName,
          active && activeTabClassName
        )
      };
    }),
    [pages, activeId, pageMenuItems, onClose, tabClassName, activeTabClassName]
  );
  const hasPager = pages.length > 1;
  const goPrev = () => {
    if (activeIndex > 0) onSelect(pages[activeIndex - 1].id);
  };
  const goNext = () => {
    if (activeIndex >= 0 && activeIndex < pages.length - 1) onSelect(pages[activeIndex + 1].id);
  };
  const pager = /* @__PURE__ */ jsxRuntime.jsx(
    PagerControls,
    {
      position: pagerPosition,
      hasPager,
      canPrev: activeIndex > 0,
      canNext: activeIndex >= 0 && activeIndex < pages.length - 1,
      onPrev: goPrev,
      onNext: goNext,
      onAdd,
      addLabel
    }
  );
  const bottom = tabPosition === "bottom";
  const strip = /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn(
        "flex h-control-md shrink-0 items-stretch",
        bottom ? "border-t" : "border-b",
        headerClassName
      ),
      children: [
        pagerPosition === "start" ? pager : null,
        /* @__PURE__ */ jsxRuntime.jsx(
          NavItems,
          {
            items,
            variant: bottom ? "folder-bottom" : "folder",
            selectionMode: "tabs",
            activeKey: activeId,
            onActiveChange: onSelect,
            panelId,
            overflow,
            overflowLabel,
            tooltipSide: bottom ? "top" : void 0,
            iconClassName: "h-3.5 w-3.5 shrink-0",
            className: "min-w-0 flex-1 gap-0"
          }
        ),
        pagerPosition === "end" ? pager : null,
        headerActions && headerActions.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex shrink-0 items-stretch border-l", children: headerActions.map((action) => /* @__PURE__ */ jsxRuntime.jsx(
          HeaderIconButton,
          {
            icon: action.icon,
            label: action.label,
            onClick: action.onClick,
            disabled: action.disabled
          },
          action.id
        )) }) : null
      ]
    }
  );
  const body = /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("relative min-h-0 flex-1", bodyClassName), children: keepMounted ? pages.map((page) => {
    const active = page.id === activeId;
    const style = {
      visibility: active ? "visible" : "hidden",
      pointerEvents: active ? "auto" : "none",
      zIndex: active ? 1 : 0
    };
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        id: panelId(page.id),
        role: "tabpanel",
        "aria-hidden": !active,
        className: "absolute inset-0",
        style,
        children: page.content
      },
      page.id
    );
  }) : activePage && /* @__PURE__ */ jsxRuntime.jsx("div", { id: panelId(activePage.id), role: "tabpanel", className: "absolute inset-0", children: activePage.content }) });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex h-full min-h-0 flex-col bg-card text-card-foreground", className), children: [
    bottom ? body : strip,
    bottom ? strip : body
  ] });
}
var TypographyH1 = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyH2 = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyH3 = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyH4 = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyH5 = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyH6 = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyP = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyBlockquote = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyInlineCode = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "code",
      {
        ref,
        className: cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          className
        ),
        ...props
      }
    );
  }
);
TypographyInlineCode.displayName = "TypographyInlineCode";
var TypographyLead = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyLarge = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographySmall = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "small",
      {
        ref,
        className: cn(
          "text-sm font-medium leading-none",
          className
        ),
        ...props
      }
    );
  }
);
TypographySmall.displayName = "TypographySmall";
var TypographyMuted = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyList = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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
var TypographyPre = React25__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
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

exports.AbsenceNote = AbsenceNote;
exports.Accordion = Accordion;
exports.AccordionContent = AccordionContent;
exports.AccordionItem = AccordionItem;
exports.AccordionTrigger = AccordionTrigger;
exports.AddressChip = AddressChip;
exports.AgentChip = AgentChip;
exports.AgentHeader = AgentHeader;
exports.Alert = Alert;
exports.AlertDescription = AlertDescription;
exports.AlertDialog = AlertDialog;
exports.AlertDialogAction = AlertDialogAction;
exports.AlertDialogCancel = AlertDialogCancel;
exports.AlertDialogContent = AlertDialogContent;
exports.AlertDialogDescription = AlertDialogDescription;
exports.AlertDialogFooter = AlertDialogFooter;
exports.AlertDialogHeader = AlertDialogHeader;
exports.AlertDialogOverlay = AlertDialogOverlay;
exports.AlertDialogPortal = AlertDialogPortal;
exports.AlertDialogTitle = AlertDialogTitle;
exports.AlertDialogTrigger = AlertDialogTrigger;
exports.AlertTitle = AlertTitle;
exports.AppStatusBar = AppStatusBar;
exports.ArtifactCard = ArtifactCard;
exports.ArtifactTable = ArtifactTable;
exports.Avatar = Avatar;
exports.AvatarFallback = AvatarFallback;
exports.AvatarGroup = AvatarGroup;
exports.AvatarImage = AvatarImage;
exports.Badge = Badge;
exports.BoundChip = BoundChip;
exports.Breadcrumb = Breadcrumb;
exports.BreadcrumbEllipsis = BreadcrumbEllipsis;
exports.BreadcrumbItem = BreadcrumbItem;
exports.BreadcrumbLink = BreadcrumbLink;
exports.BreadcrumbList = BreadcrumbList;
exports.BreadcrumbPage = BreadcrumbPage;
exports.BreadcrumbSeparator = BreadcrumbSeparator;
exports.Button = Button;
exports.ButtonGroup = ButtonGroup;
exports.ButtonGroupSeparator = ButtonGroupSeparator;
exports.ButtonGroupText = ButtonGroupText;
exports.ButtonWithTooltip = ButtonWithTooltip;
exports.CAST_ROLES = CAST_ROLES;
exports.CannotAnswerCard = CannotAnswerCard;
exports.Card = Card;
exports.CardContent = CardContent;
exports.CardDescription = CardDescription;
exports.CardFooter = CardFooter;
exports.CardHeader = CardHeader;
exports.CardTitle = CardTitle;
exports.CardWithHeader = CardWithHeader;
exports.Carousel = Carousel;
exports.CarouselContent = CarouselContent;
exports.CarouselItem = CarouselItem;
exports.CarouselNext = CarouselNext;
exports.CarouselPrevious = CarouselPrevious;
exports.CastTable = CastTable;
exports.CaveatNote = CaveatNote;
exports.ChatSession = ChatSession;
exports.ChatSessionActivityRow = ChatSessionActivityRow;
exports.ChatSessionActivitySubLine = ChatSessionActivitySubLine;
exports.ChatSessionCaret = ChatSessionCaret;
exports.ChatSessionComposer = ChatSessionComposer;
exports.ChatSessionContextChip = ChatSessionContextChip;
exports.ChatSessionDisclosure = ChatSessionDisclosure;
exports.ChatSessionDisclosureCode = ChatSessionDisclosureCode;
exports.ChatSessionDisclosureSteps = ChatSessionDisclosureSteps;
exports.ChatSessionMessage = ChatSessionMessage;
exports.ChatSessionMessageOptions = ChatSessionMessageOptions;
exports.ChatSessionProgressLine = ChatSessionProgressLine;
exports.ChatSessionPromptRow = ChatSessionPromptRow;
exports.ChatSessionStatusBar = ChatSessionStatusBar;
exports.ChatSessionTaskGroup = ChatSessionTaskGroup;
exports.ChatSessionTaskRow = ChatSessionTaskRow;
exports.CitationList = CitationList;
exports.CitationMarker = CitationMarker;
exports.CitationRow = CitationRow;
exports.ClampedText = ClampedText;
exports.ClarifyActions = ClarifyActions;
exports.ClarifyCard = ClarifyCard;
exports.ClarifyFootnote = ClarifyFootnote;
exports.Command = Command;
exports.CommandDialog = CommandDialog;
exports.CommandEmpty = CommandEmpty;
exports.CommandGroup = CommandGroup;
exports.CommandInput = CommandInput;
exports.CommandItem = CommandItem;
exports.CommandList = CommandList;
exports.CommandSeparator = CommandSeparator;
exports.CommandShortcut = CommandShortcut;
exports.ContextBar = ContextBar;
exports.DataReach = DataReach;
exports.DiagnosisCard = DiagnosisCard;
exports.Dialog = Dialog;
exports.DialogClose = DialogClose;
exports.DialogContent = DialogContent;
exports.DialogDescription = DialogDescription;
exports.DialogFooter = DialogFooter;
exports.DialogHeader = DialogHeader;
exports.DialogOverlay = DialogOverlay;
exports.DialogPortal = DialogPortal;
exports.DialogTitle = DialogTitle;
exports.DialogTrigger = DialogTrigger;
exports.DiffList = DiffList;
exports.DiffRow = DiffRow;
exports.DotRating = DotRating;
exports.DropdownMenu = DropdownMenu;
exports.DropdownMenuCheckboxItem = DropdownMenuCheckboxItem;
exports.DropdownMenuContent = DropdownMenuContent;
exports.DropdownMenuGroup = DropdownMenuGroup;
exports.DropdownMenuItem = DropdownMenuItem;
exports.DropdownMenuLabel = DropdownMenuLabel;
exports.DropdownMenuPortal = DropdownMenuPortal;
exports.DropdownMenuRadioGroup = DropdownMenuRadioGroup;
exports.DropdownMenuRadioItem = DropdownMenuRadioItem;
exports.DropdownMenuSeparator = DropdownMenuSeparator;
exports.DropdownMenuShortcut = DropdownMenuShortcut;
exports.DropdownMenuSub = DropdownMenuSub;
exports.DropdownMenuSubContent = DropdownMenuSubContent;
exports.DropdownMenuSubTrigger = DropdownMenuSubTrigger;
exports.DropdownMenuTrigger = DropdownMenuTrigger;
exports.EgressList = EgressList;
exports.EmissionBody = EmissionBody;
exports.EmissionCard = EmissionCard;
exports.EmissionHeader = EmissionHeader;
exports.EmptyState = EmptyState;
exports.EmptyStateLock = EmptyStateLock;
exports.ErrorBoundary = ErrorBoundary;
exports.ExchangeRecord = ExchangeRecord;
exports.ExpandToggle = ExpandToggle;
exports.Eyebrow = Eyebrow;
exports.FilterBar = FilterBar;
exports.FilterChip = FilterChip;
exports.FloatingPanel = FloatingPanel;
exports.Gantt = Gantt;
exports.GanttDetailCard = GanttDetailCard;
exports.HeaderTrail = HeaderTrail;
exports.HoverCard = HoverCard;
exports.HoverCardContent = HoverCardContent;
exports.HoverCardTrigger = HoverCardTrigger;
exports.Item = Item3;
exports.ItemActions = ItemActions;
exports.ItemContent = ItemContent;
exports.ItemDescription = ItemDescription;
exports.ItemFooter = ItemFooter;
exports.ItemGroup = ItemGroup;
exports.ItemHeader = ItemHeader;
exports.ItemMedia = ItemMedia;
exports.ItemSeparator = ItemSeparator;
exports.ItemTitle = ItemTitle;
exports.Kbd = Kbd;
exports.KbdGroup = KbdGroup;
exports.KindChip = KindChip;
exports.LayerChip = LayerChip;
exports.LayerSection = LayerSection;
exports.Legend = Legend;
exports.LegendItem = LegendItem;
exports.LensRow = LensRow;
exports.Link = Link;
exports.LogCard = LogCard;
exports.MarkChip = MarkChip;
exports.MatchPreview = MatchPreview;
exports.MenuItem = MenuItem;
exports.Menubar = Menubar;
exports.MenubarCheckboxItem = MenubarCheckboxItem;
exports.MenubarContent = MenubarContent;
exports.MenubarGroup = MenubarGroup;
exports.MenubarItem = MenubarItem;
exports.MenubarLabel = MenubarLabel;
exports.MenubarMenu = MenubarMenu;
exports.MenubarPortal = MenubarPortal;
exports.MenubarRadioGroup = MenubarRadioGroup;
exports.MenubarRadioItem = MenubarRadioItem;
exports.MenubarSeparator = MenubarSeparator;
exports.MenubarShortcut = MenubarShortcut;
exports.MenubarSub = MenubarSub;
exports.MenubarSubContent = MenubarSubContent;
exports.MenubarSubTrigger = MenubarSubTrigger;
exports.MenubarTrigger = MenubarTrigger;
exports.MetricGrid = MetricGrid;
exports.MetricTile = MetricTile;
exports.MultiFilterChip = MultiFilterChip;
exports.NavBase = NavBase;
exports.NavHorizontal = NavHorizontal;
exports.NavHorizontalItems = NavHorizontalItems;
exports.NavItems = NavItems;
exports.NavVertical = NavVertical;
exports.NavVerticalItems = NavVerticalItems;
exports.NavigationMenu = NavigationMenu;
exports.NavigationMenuContent = NavigationMenuContent;
exports.NavigationMenuIndicator = NavigationMenuIndicator;
exports.NavigationMenuItem = NavigationMenuItem;
exports.NavigationMenuLink = NavigationMenuLink;
exports.NavigationMenuList = NavigationMenuList;
exports.NavigationMenuTrigger = NavigationMenuTrigger;
exports.NavigationMenuViewport = NavigationMenuViewport;
exports.NestedMenu = NestedMenu;
exports.Pagination = Pagination;
exports.PaginationContent = PaginationContent;
exports.PaginationEllipsis = PaginationEllipsis;
exports.PaginationItem = PaginationItem;
exports.PaginationLink = PaginationLink;
exports.PaginationNext = PaginationNext;
exports.PaginationPrevious = PaginationPrevious;
exports.PanelBox = PanelBox;
exports.PanelContent = PanelContent;
exports.PanelStack = PanelStack;
exports.ParticipantRow = ParticipantRow;
exports.Popover = Popover;
exports.PopoverContent = PopoverContent;
exports.PopoverTrigger = PopoverTrigger;
exports.Progress = Progress;
exports.PropertyList = PropertyList;
exports.PropertyRow = PropertyRow;
exports.ProposalCard = ProposalCard;
exports.Questionnaire = Questionnaire;
exports.QuestionnaireActions = QuestionnaireActions;
exports.QuestionnaireChoice = QuestionnaireChoice;
exports.QuestionnaireChoiceDescription = QuestionnaireChoiceDescription;
exports.QuestionnaireChoiceTitle = QuestionnaireChoiceTitle;
exports.QuestionnaireChoices = QuestionnaireChoices;
exports.QuestionnaireDescription = QuestionnaireDescription;
exports.QuestionnaireError = QuestionnaireError;
exports.QuestionnaireInput = QuestionnaireInput;
exports.QuestionnaireItem = QuestionnaireItem;
exports.QuestionnaireNext = QuestionnaireNext;
exports.QuestionnairePrevious = QuestionnairePrevious;
exports.QuestionnaireProgress = QuestionnaireProgress;
exports.QuestionnaireProgressBar = QuestionnaireProgressBar;
exports.QuestionnaireSkip = QuestionnaireSkip;
exports.QuestionnaireSubmit = QuestionnaireSubmit;
exports.QuestionnaireTitle = QuestionnaireTitle;
exports.RatingControl = RatingControl;
exports.RecordHeader = RecordHeader;
exports.RecordPager = RecordPager;
exports.RefusalCard = RefusalCard;
exports.RepairNote = RepairNote;
exports.ResizableHandle = ResizableHandle;
exports.ResizablePanel = ResizablePanel;
exports.ResizablePanelGroup = ResizablePanelGroup;
exports.RetryNote = RetryNote;
exports.RichSelect = RichSelect;
exports.RuleRow = RuleRow;
exports.RunRow = RunRow;
exports.RunStatusText = RunStatusText;
exports.ScopeLine = ScopeLine;
exports.ScrollArea = ScrollArea;
exports.ScrollBar = ScrollBar;
exports.SearchInput = SearchInput;
exports.SectionHeader = SectionHeader;
exports.SegmentedControl = SegmentedControl;
exports.Separator = Separator;
exports.Sheet = Sheet;
exports.SheetClose = SheetClose;
exports.SheetContent = SheetContent;
exports.SheetDescription = SheetDescription;
exports.SheetFooter = SheetFooter;
exports.SheetHeader = SheetHeader;
exports.SheetOverlay = SheetOverlay;
exports.SheetPortal = SheetPortal;
exports.SheetTitle = SheetTitle;
exports.SheetTrigger = SheetTrigger;
exports.Sidebar = Sidebar;
exports.SidebarContent = SidebarContent;
exports.SidebarFooter = SidebarFooter;
exports.SidebarGroup = SidebarGroup;
exports.SidebarGroupAction = SidebarGroupAction;
exports.SidebarGroupContent = SidebarGroupContent;
exports.SidebarGroupLabel = SidebarGroupLabel;
exports.SidebarHeader = SidebarHeader;
exports.SidebarInput = SidebarInput;
exports.SidebarInset = SidebarInset;
exports.SidebarMenu = SidebarMenu;
exports.SidebarMenuAction = SidebarMenuAction;
exports.SidebarMenuBadge = SidebarMenuBadge;
exports.SidebarMenuButton = SidebarMenuButton;
exports.SidebarMenuItem = SidebarMenuItem;
exports.SidebarMenuSkeleton = SidebarMenuSkeleton;
exports.SidebarMenuSub = SidebarMenuSub;
exports.SidebarMenuSubButton = SidebarMenuSubButton;
exports.SidebarMenuSubItem = SidebarMenuSubItem;
exports.SidebarProvider = SidebarProvider;
exports.SidebarRail = SidebarRail;
exports.SidebarSeparator = SidebarSeparator;
exports.SidebarTrigger = SidebarTrigger;
exports.Skeleton = Skeleton;
exports.SliceSummary = SliceSummary;
exports.Spinner = Spinner;
exports.Stack = Stack;
exports.StageTrail = StageTrail;
exports.StatusDot = StatusDot;
exports.StatusIcon = StatusIcon;
exports.TabbedPanel = TabbedPanel;
exports.Table = Table;
exports.TableBody = TableBody;
exports.TableCaption = TableCaption;
exports.TableCell = TableCell;
exports.TableFooter = TableFooter;
exports.TableHead = TableHead;
exports.TableHeader = TableHeader;
exports.TableRow = TableRow;
exports.Tabs = Tabs;
exports.TabsContent = TabsContent;
exports.TabsList = TabsList;
exports.TabsTrigger = TabsTrigger;
exports.TaskNode = TaskNode;
exports.TemplatePicker = TemplatePicker;
exports.Terminal = Terminal;
exports.TerminalLine = TerminalLine;
exports.TimelineEntry = TimelineEntry;
exports.TimelineFooter = TimelineFooter;
exports.TimelineList = TimelineList;
exports.TimelineSection = TimelineSection;
exports.Toaster = Toaster;
exports.Toggle = Toggle;
exports.ToggleGroup = ToggleGroup;
exports.ToggleGroupItem = ToggleGroupItem;
exports.Toolbar = Toolbar;
exports.Tooltip = Tooltip;
exports.TooltipContent = TooltipContent;
exports.TooltipProvider = TooltipProvider;
exports.TooltipTrigger = TooltipTrigger;
exports.TouchStrip = TouchStrip;
exports.Tour = Tour;
exports.TraceGate = TraceGate;
exports.TraceList = TraceList;
exports.TraceLoop = TraceLoop;
exports.TraceStep = TraceStep;
exports.TreeItem = TreeItem;
exports.TreeView = TreeView;
exports.Typography = Typography;
exports.TypographyBlockquote = TypographyBlockquote;
exports.TypographyH1 = TypographyH1;
exports.TypographyH2 = TypographyH2;
exports.TypographyH3 = TypographyH3;
exports.TypographyH4 = TypographyH4;
exports.TypographyH5 = TypographyH5;
exports.TypographyH6 = TypographyH6;
exports.TypographyInlineCode = TypographyInlineCode;
exports.TypographyLarge = TypographyLarge;
exports.TypographyLead = TypographyLead;
exports.TypographyList = TypographyList;
exports.TypographyMuted = TypographyMuted;
exports.TypographyP = TypographyP;
exports.TypographyPre = TypographyPre;
exports.TypographySmall = TypographySmall;
exports.UnderDevelopment = UnderDevelopment;
exports.Workbook = Workbook;
exports.agentChipVariants = agentChipVariants;
exports.avatarVariants = avatarVariants;
exports.badgeVariants = badgeVariants;
exports.buttonGroupVariants = buttonGroupVariants;
exports.buttonVariants = buttonVariants;
exports.chatSessionGutterClass = chatSessionGutterClass;
exports.cn = cn;
exports.describeSlice = describeSlice;
exports.formatRecords = formatRecords;
exports.layerLabel = layerLabel;
exports.layerPaint = layerPaint;
exports.linkVariants = linkVariants;
exports.navigationMenuTriggerStyle = navigationMenuTriggerStyle;
exports.runStatusIcons = ICON;
exports.runStatusTones = TONE6;
exports.splitAddress = split;
exports.stackVariants = stackVariants;
exports.statusDotVariants = statusDotVariants;
exports.statusIconVariants = statusIconVariants;
exports.summarizeReach = summarizeReach;
exports.toggleVariants = toggleVariants;
exports.useExpandedKeys = useExpandedKeys;
exports.useOverflowItems = useOverflowItems;
exports.useSidebar = useSidebar;
exports.useTour = useTour;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map