'use strict';

var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');
var React23 = require('react');
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
var reactResizablePanels = require('react-resizable-panels');
var ScrollAreaPrimitive = require('@radix-ui/react-scroll-area');
var TooltipPrimitive = require('@radix-ui/react-tooltip');
var sonner = require('sonner');
var TabsPrimitive = require('@radix-ui/react-tabs');
var TogglePrimitive = require('@radix-ui/react-toggle');
var ToggleGroupPrimitive = require('@radix-ui/react-toggle-group');

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

var React23__namespace = /*#__PURE__*/_interopNamespace(React23);
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
function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
}
var Accordion = AccordionPrimitive__namespace.Root;
var AccordionItem = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AccordionPrimitive__namespace.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React23__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(AccordionPrimitive__namespace.Header, { className: "flex", children: /* @__PURE__ */ jsxRuntime.jsxs(
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
var AccordionContent = React23__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Alert = React23__namespace.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
var AlertTitle = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
var buttonVariants = classVarianceAuthority.cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap   rounded-md font-medium transition-colors focus-visible:outline-none   focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2   disabled:pointer-events-none disabled:opacity-50   [&_svg]:pointer-events-none   [&_svg]:size-5 [&_svg]:shrink-0",
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
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 py-2 text-sm",
        lg: "h-12 rounded-md px-8 py-3",
        icon: "h-8 w-8 rounded-md",
        "nav-icon": "h-11 w-11 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React23__namespace.forwardRef(
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
var AlertDialogOverlay = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var AlertDialogContent = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntime.jsx(
    AlertDialogPrimitive__namespace.Content,
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
var AlertDialogTitle = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AlertDialogPrimitive__namespace.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive__namespace.Title.displayName;
var AlertDialogDescription = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AlertDialogPrimitive__namespace.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive__namespace.Description.displayName;
var AlertDialogAction = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AlertDialogPrimitive__namespace.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive__namespace.Action.displayName;
var AlertDialogCancel = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var Avatar = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AvatarPrimitive__namespace.Root,
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
Avatar.displayName = AvatarPrimitive__namespace.Root.displayName;
var AvatarImage = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AvatarPrimitive__namespace.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive__namespace.Image.displayName;
var AvatarFallback = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var badgeVariants = classVarianceAuthority.cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs   font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        soft: "border-primary/25 bg-primary/15 text-primary hover:bg-primary/20"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
var Breadcrumb = React23__namespace.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "ol",
  {
    ref,
    className: cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    ),
    ...props
  }
));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "li",
  {
    ref,
    className: cn("inline-flex items-center gap-1.5", className),
    ...props
  }
));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = React23__namespace.forwardRef(({ asChild, className, ...props }, ref) => {
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
var BreadcrumbPage = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var Separator = React23__namespace.forwardRef(
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
        "bg-muted shadow-xs flex items-center gap-2 rounded-md border px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
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
var Card = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var CardHeader = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-3", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none  tracking-tight ", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn(" text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("p-3 flex-1 overflow-y-auto", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-3 ", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
var CardWithHeader = React23__namespace.forwardRef(
  ({ className, title, description, headerClassName, contentClassName, footerClassName, footer, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(Card, { ref, className, ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { className: `${headerClassName} rounded-t-md`, children: [
      typeof title === "string" ? /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { children: title }) : title,
      description && (typeof description === "string" ? /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: description }) : description)
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: contentClassName, children }),
    footer && /* @__PURE__ */ jsxRuntime.jsx(CardFooter, { className: footerClassName, children: footer })
  ] })
);
CardWithHeader.displayName = "CardWithHeader";
var CarouselContext = React23__namespace.createContext(null);
function useCarousel() {
  const context = React23__namespace.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
var Carousel = React23__namespace.forwardRef(
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
    const [canScrollPrev, setCanScrollPrev] = React23__namespace.useState(false);
    const [canScrollNext, setCanScrollNext] = React23__namespace.useState(false);
    const onSelect = React23__namespace.useCallback((api2) => {
      if (!api2) {
        return;
      }
      setCanScrollPrev(api2.canScrollPrev());
      setCanScrollNext(api2.canScrollNext());
    }, []);
    const scrollPrev = React23__namespace.useCallback(() => {
      api?.scrollPrev();
    }, [api]);
    const scrollNext = React23__namespace.useCallback(() => {
      api?.scrollNext();
    }, [api]);
    const handleKeyDown = React23__namespace.useCallback(
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
    React23__namespace.useEffect(() => {
      if (!api || !setApi) {
        return;
      }
      setApi(api);
    }, [api, setApi]);
    React23__namespace.useEffect(() => {
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
var CarouselContent = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var CarouselItem = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var CarouselPrevious = React23__namespace.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Button,
    {
      ref,
      variant,
      size,
      className: cn(
        "absolute  h-8 w-8 rounded-full",
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
var CarouselNext = React23__namespace.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Button,
    {
      ref,
      variant,
      size,
      className: cn(
        "absolute h-8 w-8 rounded-full",
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
var DialogOverlay = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var DialogContent = React23__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntime.jsxs(
    DialogPrimitive__namespace.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsxs(DialogPrimitive__namespace.Close, { className: "absolute right-4 top-4 rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
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
var DialogTitle = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var DialogDescription = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive__namespace.Description.displayName;
var Command = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover/80 backdrop-blur-md supports-[backdrop-filter]:bg-popover/70 text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = cmdk.Command.displayName;
var CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(Dialog, { ...props, children: /* @__PURE__ */ jsxRuntime.jsx(DialogContent, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntime.jsx(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children }) }) });
};
var CommandInput = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntime.jsx(
    cmdk.Command.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = cmdk.Command.Input.displayName;
var CommandList = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = cmdk.Command.List.displayName;
var CommandEmpty = React23__namespace.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.Empty,
  {
    ref,
    className: "py-6 text-center text-sm",
    ...props
  }
));
CommandEmpty.displayName = cmdk.Command.Empty.displayName;
var CommandGroup = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = cmdk.Command.Group.displayName;
var CommandSeparator = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = cmdk.Command.Separator.displayName;
var CommandItem = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  cmdk.Command.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-md px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-primary/15 data-[selected=true]:text-primary data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
        "ml-auto text-xs tracking-widest text-muted-foreground",
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
var DropdownMenuSubTrigger = React23__namespace.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  DropdownMenuPrimitive__namespace.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default gap-2 select-none items-center rounded-md px-2 py-1.5 outline-none focus:bg-primary/15 focus:text-primary data-[state=open]:bg-primary/15 data-[state=open]:text-primary [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
var DropdownMenuSubContent = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DropdownMenuPrimitive__namespace.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover/80 backdrop-blur-md supports-[backdrop-filter]:bg-popover/70 p-1 text-popover-foreground shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive__namespace.SubContent.displayName;
var DropdownMenuContent = React23__namespace.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuPrimitive__namespace.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
  DropdownMenuPrimitive__namespace.Content,
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
DropdownMenuContent.displayName = DropdownMenuPrimitive__namespace.Content.displayName;
var DropdownMenuItem = React23__namespace.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DropdownMenuPrimitive__namespace.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2       rounded-md px-2 py-1.5 outline-none transition-colors       focus:bg-primary/15 focus:text-primary hover:bg-primary/10 hover:text-primary       data-[disabled]:pointer-events-none data-[disabled]:opacity-50       [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive__namespace.Item.displayName;
var DropdownMenuCheckboxItem = React23__namespace.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  DropdownMenuPrimitive__namespace.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 outline-none transition-colors focus:bg-primary/15 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
var DropdownMenuRadioItem = React23__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  DropdownMenuPrimitive__namespace.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 outline-none transition-colors focus:bg-primary/15 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
var DropdownMenuLabel = React23__namespace.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var DropdownMenuSeparator = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
      className: cn("ml-auto text-xs tracking-widest opacity-60", className),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var HoverCard = HoverCardPrimitive__namespace.Root;
var HoverCardTrigger = HoverCardPrimitive__namespace.Trigger;
var HoverCardContent = React23__namespace.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  HoverCardPrimitive__namespace.Content,
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
  "group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50"
      },
      size: {
        default: "gap-4 p-4 ",
        sm: "gap-2.5 px-4 py-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Item3({
  className,
  variant = "default",
  size = "default",
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
      className: cn(itemVariants({ variant, size, className })),
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
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug",
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
        "text-muted-foreground line-clamp-2 text-balance text-sm font-normal leading-normal",
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
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium",
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
var Menubar = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var MenubarTrigger = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.Trigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    ),
    ...props
  }
));
MenubarTrigger.displayName = MenubarPrimitive__namespace.Trigger.displayName;
var MenubarSubTrigger = React23__namespace.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  MenubarPrimitive__namespace.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
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
var MenubarSubContent = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    ),
    ...props
  }
));
MenubarSubContent.displayName = MenubarPrimitive__namespace.SubContent.displayName;
var MenubarContent = React23__namespace.forwardRef(
  ({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(MenubarPrimitive__namespace.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
    MenubarPrimitive__namespace.Content,
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
MenubarContent.displayName = MenubarPrimitive__namespace.Content.displayName;
var MenubarItem = React23__namespace.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  MenubarPrimitive__namespace.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
MenubarItem.displayName = MenubarPrimitive__namespace.Item.displayName;
var MenubarCheckboxItem = React23__namespace.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  MenubarPrimitive__namespace.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
var MenubarRadioItem = React23__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
  MenubarPrimitive__namespace.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
var MenubarLabel = React23__namespace.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var MenubarSeparator = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      ),
      ...props
    }
  );
};
MenubarShortcut.displayname = "MenubarShortcut";
var NavigationMenu = React23__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
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
var NavigationMenuList = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
);
var NavigationMenuTrigger = React23__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
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
var NavigationMenuContent = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var NavigationMenuViewport = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("absolute left-0 top-full flex justify-center"), children: /* @__PURE__ */ jsxRuntime.jsx(
  NavigationMenuPrimitive__namespace.Viewport,
  {
    className: cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className
    ),
    ref,
    ...props
  }
) }));
NavigationMenuViewport.displayName = NavigationMenuPrimitive__namespace.Viewport.displayName;
var NavigationMenuIndicator = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var PaginationContent = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "ul",
  {
    ref,
    className: cn("flex flex-row items-center gap-1", className),
    ...props
  }
));
PaginationContent.displayName = "PaginationContent";
var PaginationItem = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("li", { ref, className: cn("", className), ...props }));
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
var PopoverContent = React23__namespace.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(PopoverPrimitive__namespace.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
  PopoverPrimitive__namespace.Content,
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
PopoverContent.displayName = PopoverPrimitive__namespace.Content.displayName;
var Progress = React23__namespace.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  ProgressPrimitive__namespace.Root,
  {
    ref,
    className: cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
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
var ResizablePanelGroup = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
  reactResizablePanels.Group,
  {
    className: cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    ),
    ...props
  }
);
var ResizablePanel = reactResizablePanels.Panel;
var ResizableHandle = ({
  withHandle,
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
  reactResizablePanels.Separator,
  {
    className: cn(
      "relative flex items-center justify-center transition-colors",
      "data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
      "data-[panel-group-direction=horizontal]:w-2 data-[panel-group-direction=horizontal]:h-full data-[panel-group-direction=horizontal]:cursor-col-resize",
      "hover:bg-ring/30 focus:bg-ring/30",
      "focus-visible:outline-none       focus-visible:ring-ring       focus-visible:ring-offset-3",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    ),
    ...props,
    children: withHandle && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "z-10 flex h-3 w-4 items-center justify-center rounded-sm border bg-border", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.GripHorizontal, {}) })
  }
);
var ScrollArea = React23__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(
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
var ScrollBar = React23__namespace.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var Sheet = DialogPrimitive__namespace.Root;
var SheetTrigger = DialogPrimitive__namespace.Trigger;
var SheetClose = DialogPrimitive__namespace.Close;
var SheetPortal = DialogPrimitive__namespace.Portal;
var SheetOverlay = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var SheetContent = React23__namespace.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntime.jsxs(
    DialogPrimitive__namespace.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsxs(DialogPrimitive__namespace.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
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
var SheetTitle = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive__namespace.Title.displayName;
var SheetDescription = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = DialogPrimitive__namespace.Description.displayName;
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React23__namespace.useState(void 0);
  React23__namespace.useEffect(() => {
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
var TooltipContent = React23__namespace.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  TooltipPrimitive__namespace.Content,
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
TooltipContent.displayName = TooltipPrimitive__namespace.Content.displayName;
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React23__namespace.createContext(null);
function useSidebar() {
  const context = React23__namespace.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
var SidebarProvider = React23__namespace.forwardRef(
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
    const [openMobile, setOpenMobile] = React23__namespace.useState(false);
    const [_open, _setOpen] = React23__namespace.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React23__namespace.useCallback(
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
    const toggleSidebar = React23__namespace.useCallback(() => {
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile]);
    React23__namespace.useEffect(() => {
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
    const contextValue = React23__namespace.useMemo(
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
var Sidebar = React23__namespace.forwardRef(
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
var SidebarTrigger = React23__namespace.forwardRef(({ className, onClick, ...props }, ref) => {
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
var SidebarRail = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var SidebarInset = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var SidebarInput = React23__namespace.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      ref,
      type,
      "data-sidebar": "input",
      className: cn(
        // mirrors @invana/forms <Input> styling
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "h-8 w-full shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var SidebarFooter = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var SidebarSeparator = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var SidebarContent = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var SidebarGroup = React23__namespace.forwardRef(({ className, ...props }, ref) => {
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
var SidebarGroupLabel = React23__namespace.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "div";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = React23__namespace.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "button";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-action",
      className: cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
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
var SidebarGroupContent = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    "data-sidebar": "group-content",
    className: cn("w-full text-sm", className),
    ...props
  }
));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...props
  }
));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8",
        sm: "h-7 text-sm",
        lg: "h-12 text-lg group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var SidebarMenuButton = React23__namespace.forwardRef(
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
var SidebarMenuAction = React23__namespace.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "button";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-action",
      className: cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
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
var SidebarMenuBadge = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
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
var SidebarMenuSkeleton = React23__namespace.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const width = React23__namespace.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
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
var SidebarMenuSub = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var SidebarMenuSubItem = React23__namespace.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = React23__namespace.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? reactSlot.Slot : "a";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-sm",
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
var Table = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "relative w-full overflow-auto border rounded-md", children: /* @__PURE__ */ jsxRuntime.jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
var TableHeader = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
var TableBody = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
var TableFooter = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var TableRow = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
var TableHead = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
var TableCell = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
var TableCaption = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
var Tabs = TabsPrimitive__namespace.Root;
var TabsList = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  TabsPrimitive__namespace.List,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive__namespace.List.displayName;
var TabsTrigger = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  TabsPrimitive__namespace.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 font-medium ring-offset-background transition-colors text-muted-foreground hover:text-foreground hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:ring-1 data-[state=active]:ring-primary/25 data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive__namespace.Trigger.displayName;
var TabsContent = React23__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
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
  "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary/15 data-[state=on]:text-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/25 data-[state=on]:shadow-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",
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
var Toggle = React23__namespace.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  TogglePrimitive__namespace.Root,
  {
    ref,
    className: cn(toggleVariants({ variant, size, className })),
    ...props
  }
));
Toggle.displayName = TogglePrimitive__namespace.Root.displayName;
var ToggleGroupContext = React23__namespace.createContext({
  size: "default",
  variant: "default"
});
var ToggleGroup = React23__namespace.forwardRef(({ className, variant, size, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  ToggleGroupPrimitive__namespace.Root,
  {
    ref,
    className: cn("flex items-center justify-center gap-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntime.jsx(ToggleGroupContext.Provider, { value: { variant, size }, children })
  }
));
ToggleGroup.displayName = ToggleGroupPrimitive__namespace.Root.displayName;
var ToggleGroupItem = React23__namespace.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React23__namespace.useContext(ToggleGroupContext);
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
function ButtonWithTooltip(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntime.jsxs(Tooltip, { delayDuration: 0, children: [
    /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "ghost", className: cn("hover:bg-transparent", props.className), ...props, children: props.children }) }),
    /* @__PURE__ */ jsxRuntime.jsx(TooltipContent, { children: props.tooltip })
  ] }) });
}
var ErrorBoundary = class extends React23.Component {
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
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col items-center justify-center h-full w-full text-sm", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "inline-flex items-center", children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Frown, { className: "mr-1 h-4" }),
        "Oops ! something went wrong."
      ] }) });
    }
    return this.props.children;
  }
};
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
  return /* @__PURE__ */ jsxRuntime.jsxs("li", { className: "relative group/item", children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
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
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-2", children: [
            Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: label })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-2", children: [
            shortcut && /* @__PURE__ */ jsxRuntime.jsx("kbd", { className: "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100", children: shortcut }),
            hasChildren && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { className: "h-4 w-4" })
          ] })
        ]
      }
    ),
    hasChildren && /* @__PURE__ */ jsxRuntime.jsx(
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
        children: children.map((item) => /* @__PURE__ */ jsxRuntime.jsx(MenuItem, { ...item, level: level + 1 }, item.id))
      }
    )
  ] });
};
var NavItems = ({
  items,
  orientation = "horizontal",
  tooltipSide = orientation === "vertical" ? "right" : "bottom",
  iconClassName = orientation === "vertical" ? "w-5 h-5" : "w-4 h-4 flex-shrink-0"
}) => {
  const isVertical = orientation === "vertical";
  const [activeItem, setActiveItem] = React23__namespace.default.useState(null);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: items.map((item) => {
    const isActive = activeItem === item.name;
    const padding = item.label ? "px-3 py-1.5" : "px-2 py-2";
    const itemClass = `inline-flex border-0 items-center justify-center gap-2
          whitespace-nowrap rounded-md cursor-pointer transition-colors
          ring-1 ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          ${padding}
          hover:bg-primary/10 hover:text-primary hover:ring-primary/25
          ${isActive ? `bg-primary/15 text-primary ring-primary/25 ${item.activeClass || ""}` : ""}
          ${item.className || ""}`;
    const icon = /* @__PURE__ */ jsxRuntime.jsx(
      item.icon,
      {
        strokeWidth: item.iconStroke || 2,
        className: item.iconClassName || iconClassName
      }
    );
    const label = item.label && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm", children: item.label });
    return /* @__PURE__ */ jsxRuntime.jsxs(React23__namespace.default.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { asChild: true, children: item.href ? /* @__PURE__ */ jsxRuntime.jsxs(
          "a",
          {
            href: item.href,
            onClick: () => setActiveItem(item.name),
            className: itemClass,
            children: [
              icon,
              label
            ]
          }
        ) : item.onClick ? /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              item.onClick?.();
              setActiveItem(isActive ? null : item.name);
            },
            className: itemClass,
            children: [
              icon,
              label
            ]
          }
        ) : /* @__PURE__ */ jsxRuntime.jsxs("div", { className: itemClass, children: [
          icon,
          label
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(TooltipContent, { side: item.tooltipSide || tooltipSide, children: item.tooltip || item.name })
      ] }),
      item.showSeperator && /* @__PURE__ */ jsxRuntime.jsx(
        Separator,
        {
          orientation: isVertical ? "horizontal" : "vertical",
          className: isVertical ? "" : "h-4"
        }
      )
    ] }, item.key || item.name);
  }) });
};
var NavBase = ({ className = "", orientation, sections }) => {
  const isVertical = orientation === "vertical";
  const containerClass = isVertical ? `flex flex-col items-center h-full ${className}` : `flex items-center   w-full ${className}`;
  const sectionWrapperClass = isVertical ? "flex flex-col items-center gap-1" : "flex items-center gap-1 ";
  return /* @__PURE__ */ jsxRuntime.jsxs("nav", { className: containerClass, children: [
    sections.start?.content && /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${sectionWrapperClass} ${sections.start.className || ""}`, children: sections.start.content }),
    sections.center?.content ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: `flex-1 ${isVertical ? "" : "flex justify-center items-center gap-1"} ${sections.center.className || ""}`, children: sections.center.content }) : (
      // Empty spacer to push end section to the bottom/right
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1" })
    ),
    sections.end?.content && /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${sectionWrapperClass} ${isVertical ? "" : "ml-auto"} ${sections.end.className || ""}`, children: sections.end.content })
  ] });
};
var NavHorizontalItems = ({ items }) => /* @__PURE__ */ jsxRuntime.jsx(NavItems, { items, orientation: "horizontal" });
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
var NavVerticalItems = ({ items }) => /* @__PURE__ */ jsxRuntime.jsx(NavItems, { items, orientation: "vertical" });
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
function PanelContent({
  title,
  titleText,
  children,
  onClose,
  showClose,
  headerClassName,
  bodyClassName,
  footerContent,
  footerClassName,
  closeIcon
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: `h-full border-none ${headerClassName}`, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { className: "relative flex flex-row items-center py-0 border-b h-[30px]", children: [
      title && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "leading-none font-bold ", children: title }),
      titleText && /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "font-bold leading-none", children: titleText }),
      showClose && /* @__PURE__ */ jsxRuntime.jsxs(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-[0px] right-[5px] h-6 w-6 hover:bg-transparent hover:text-primary/80",
          onClick: onClose,
          children: [
            closeIcon ? closeIcon : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Close panel" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: `overflow-y-auto h-full ${bodyClassName}`, children }),
    footerContent ? /* @__PURE__ */ jsxRuntime.jsx(CardFooter, { className: footerClassName, children: footerContent }) : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, {})
  ] }) });
}
function OptionRow({ option }) {
  const Icon = option.icon;
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-col gap-0.5", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
      Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { size: 16, className: "shrink-0" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: option.label }),
      option.badge != null && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto pl-2", children: option.badge })
    ] }),
    option.description != null && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground", children: option.description })
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
      return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
        Icon && /* @__PURE__ */ jsxRuntime.jsx(Icon, { size: 16, className: "shrink-0" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: only.label })
      ] });
    }
    return `${label ?? "Selected"}: ${selectedOptions.length}`;
  })();
  const trigger = /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex min-w-0 items-center gap-2", children: triggerLabel }),
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
        className: cn("min-w-[14rem] bg-popover", contentClassName),
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
          )
        ]
      }
    )
  ] });
}
function TabbedPanel({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  headerActions,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footerContent,
  showClose: _showClose,
  onClose: _onClose,
  closeIcon: _closeIcon
}) {
  const [internalTab, setInternalTab] = React23__namespace.default.useState(defaultTab || tabs[0]?.value);
  const currentTab = activeTab !== void 0 ? activeTab : internalTab;
  const handleTabChange = (value) => {
    if (activeTab === void 0) {
      setInternalTab(value);
    }
    onTabChange?.(value);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntime.jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxRuntime.jsx(Tabs, { value: currentTab, onValueChange: handleTabChange, className: `h-full ${className || ""}`, children: /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: "h-full border rounded-none", children: [
    /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { className: `flex flex-row items-center justify-between py-0 border-b h-[30px] px-0 space-y-0 ${headerClassName || ""}`, children: [
      /* @__PURE__ */ jsxRuntime.jsx(TabsList, { className: "h-full bg-transparent p-0 gap-0 rounded-none", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntime.jsxs(
        TabsTrigger,
        {
          value: tab.value,
          disabled: tab.disabled,
          className: "h-full text-muted-foreground hover:text-foreground data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:mb-[-1px] rounded-none px-3 py-2",
          children: [
            tab.icon && /* @__PURE__ */ jsxRuntime.jsx(tab.icon, { className: "h-3.5 w-3.5 mr-1.5" }),
            tab.label
          ]
        },
        tab.value
      )) }),
      headerActions && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center h-full", children: /* @__PURE__ */ jsxRuntime.jsx(
        NavHorizontal,
        {
          className: "h-full",
          ...headerActions
        }
      ) })
    ] }),
    tabs.map((tab) => /* @__PURE__ */ jsxRuntime.jsx(
      TabsContent,
      {
        value: tab.value,
        className: `h-[calc(100%-30px)] m-0 ${bodyClassName || ""}`,
        children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "overflow-y-auto h-full p-0", children: tab.content })
      },
      tab.value
    )),
    footerContent && /* @__PURE__ */ jsxRuntime.jsx(CardFooter, { className: footerClassName, children: footerContent })
  ] }) }) }) });
}
var SearchInput = ({ value, onChange, ...props }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      type: "text",
      value,
      onChange: (e) => onChange(e.target.value),
      placeholder: "Search...",
      className: cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "w-full px-2 py-1 border rounded-md dark:bg-neutral-800",
        props?.className
      )
    }
  );
};
var Toolbar = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex h-5 items-center space-x-2 text-sm", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ButtonWithTooltip,
      {
        variant: "ghost",
        size: "nav-icon",
        className: "rounded-none hover:bg-gray-100 active:bg-gray:500",
        tooltip: /* @__PURE__ */ jsxRuntime.jsx("p", { children: "Unlock Canvas" }),
        children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Lock, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(Separator, { orientation: "vertical" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { children: "Docs" }),
    /* @__PURE__ */ jsxRuntime.jsx(Separator, { orientation: "vertical" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { children: "Source" })
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
  const [current, setCurrent] = React23__namespace.useState(initialStep);
  const total = steps.length;
  const lastIndex = Math.max(total - 1, 0);
  const clamped = Math.min(Math.max(current, 0), lastIndex);
  const goTo = React23__namespace.useCallback(
    (index) => {
      setCurrent((prev2) => {
        const next2 = Math.min(Math.max(index, 0), lastIndex);
        if (next2 !== prev2) onStepChange?.(next2);
        return next2;
      });
    },
    [lastIndex, onStepChange]
  );
  const next = React23__namespace.useCallback(() => {
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
  const prev = React23__namespace.useCallback(() => {
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
  const exit = React23__namespace.useCallback(() => {
    onExit?.();
  }, [onExit]);
  return React23__namespace.useMemo(
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
        "w-80 gap-0 border-border bg-popover p-0 text-popover-foreground shadow-xl",
        positionClasses[position],
        className
      ),
      role: "dialog",
      "aria-label": typeof badgeLabel === "string" ? badgeLabel : void 0,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "soft", className: "tracking-wider", children: badgeLabel }),
            showCounter && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-xs text-muted-foreground", children: [
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
              className: "-mr-1 h-7 gap-1 px-2 text-xs text-muted-foreground [&_svg]:size-3.5",
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
            step.body && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm leading-relaxed text-muted-foreground", children: step.body }),
            step.callout && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "rounded-r-md border-l-2 border-primary bg-muted/40 p-3", children: [
              step.callout.label && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary", children: step.callout.label }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm leading-relaxed", children: step.callout.content })
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
var TreeView = ({ searchable = false, ...props }) => {
  const [searchQuery, setSearchQuery] = React23__namespace.useState("");
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
  const [isExpanded, setIsExpanded] = React23__namespace.useState(item.isExpanded || true);
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
          "flex items-center gap-2 w-full rounded-md px-2 py-1 hover:bg-accent hover:text-accent-foreground",
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
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "mt-4 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm", children: "Coming Soon" })
  ] });
}
var TypographyH1 = React23__namespace.forwardRef(
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
var TypographyH2 = React23__namespace.forwardRef(
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
var TypographyH3 = React23__namespace.forwardRef(
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
var TypographyH4 = React23__namespace.forwardRef(
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
var TypographyH5 = React23__namespace.forwardRef(
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
var TypographyH6 = React23__namespace.forwardRef(
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
var TypographyP = React23__namespace.forwardRef(
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
var TypographyBlockquote = React23__namespace.forwardRef(
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
var TypographyInlineCode = React23__namespace.forwardRef(
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
var TypographyLead = React23__namespace.forwardRef(
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
var TypographyLarge = React23__namespace.forwardRef(
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
var TypographySmall = React23__namespace.forwardRef(
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
var TypographyMuted = React23__namespace.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "p",
      {
        ref,
        className: cn(
          "text-sm text-muted-foreground",
          className
        ),
        ...props
      }
    );
  }
);
TypographyMuted.displayName = "TypographyMuted";
var TypographyList = React23__namespace.forwardRef(
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
var TypographyPre = React23__namespace.forwardRef(
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

exports.Accordion = Accordion;
exports.AccordionContent = AccordionContent;
exports.AccordionItem = AccordionItem;
exports.AccordionTrigger = AccordionTrigger;
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
exports.Avatar = Avatar;
exports.AvatarFallback = AvatarFallback;
exports.AvatarImage = AvatarImage;
exports.Badge = Badge;
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
exports.Command = Command;
exports.CommandDialog = CommandDialog;
exports.CommandEmpty = CommandEmpty;
exports.CommandGroup = CommandGroup;
exports.CommandInput = CommandInput;
exports.CommandItem = CommandItem;
exports.CommandList = CommandList;
exports.CommandSeparator = CommandSeparator;
exports.CommandShortcut = CommandShortcut;
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
exports.ErrorBoundary = ErrorBoundary;
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
exports.PanelContent = PanelContent;
exports.Popover = Popover;
exports.PopoverContent = PopoverContent;
exports.PopoverTrigger = PopoverTrigger;
exports.Progress = Progress;
exports.ResizableHandle = ResizableHandle;
exports.ResizablePanel = ResizablePanel;
exports.ResizablePanelGroup = ResizablePanelGroup;
exports.RichSelect = RichSelect;
exports.ScrollArea = ScrollArea;
exports.ScrollBar = ScrollBar;
exports.SearchInput = SearchInput;
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
exports.Spinner = Spinner;
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
exports.Toaster = Toaster;
exports.Toggle = Toggle;
exports.ToggleGroup = ToggleGroup;
exports.ToggleGroupItem = ToggleGroupItem;
exports.Toolbar = Toolbar;
exports.Tooltip = Tooltip;
exports.TooltipContent = TooltipContent;
exports.TooltipProvider = TooltipProvider;
exports.TooltipTrigger = TooltipTrigger;
exports.Tour = Tour;
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
exports.badgeVariants = badgeVariants;
exports.buttonGroupVariants = buttonGroupVariants;
exports.buttonVariants = buttonVariants;
exports.cn = cn;
exports.navigationMenuTriggerStyle = navigationMenuTriggerStyle;
exports.toggleVariants = toggleVariants;
exports.useSidebar = useSidebar;
exports.useTour = useTour;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map