import { ClassValue } from 'clsx';
import * as React$1 from 'react';
import React__default, { Component, ReactNode } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogProps } from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { Separator as Separator$1, Panel, Group } from 'react-resizable-panels';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Toaster as Toaster$1 } from 'sonner';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { LucideIcon } from 'lucide-react';

/**
 * `clsx` + `tailwind-merge`, and nothing else.
 *
 * This used to be an `extendTailwindMerge` that registered one class group.
 * `text-*` is ambiguous — it is both the font-size scale and the text-colour
 * scale — so tailwind-merge decides which group a class belongs to by matching
 * its value against Tailwind's built-in size names. `meta` was not one of them,
 * so `text-meta` was read as a *colour* and silently dropped whatever colour
 * class came before it:
 *
 *   cn("text-[var(--badge-ink)]", "text-meta")  →  "text-meta"   // colour lost
 *
 * The type ladder is now `base · sm · xs` (`@invana/styling`), every one of
 * them a Tailwind built-in, so there is nothing left to register and the
 * footgun is gone with the token that caused it. If a future `--text-*` token
 * invents a name Tailwind does not know, bring the `extend` back in the same
 * breath — it will eat colours at a distance and the cause will not be obvious.
 */
declare function cn(...inputs: ClassValue[]): string;

declare const Accordion: React$1.ForwardRefExoticComponent<(AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps) & React$1.RefAttributes<HTMLDivElement>>;
declare const AccordionItem: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const AccordionTrigger: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const AccordionContent: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Alert: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & VariantProps<(props?: ({
    variant?: "default" | "destructive" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string> & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertTitle: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLHeadingElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const AlertDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const AlertDialog: React$1.FC<AlertDialogPrimitive.AlertDialogProps>;
declare const AlertDialogTrigger: React$1.ForwardRefExoticComponent<AlertDialogPrimitive.AlertDialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogPortal: React$1.FC<AlertDialogPrimitive.AlertDialogPortalProps>;
declare const AlertDialogOverlay: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertDialogContent: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertDialogHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
    displayName: string;
};
declare const AlertDialogFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
    displayName: string;
};
declare const AlertDialogTitle: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const AlertDialogDescription: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const AlertDialogAction: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogActionProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogCancel: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogCancelProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const Avatar: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
declare const AvatarImage: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarImageProps & React$1.RefAttributes<HTMLImageElement>, "ref"> & React$1.RefAttributes<HTMLImageElement>>;
declare const AvatarFallback: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarFallbackProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;

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
declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | "soft" | null | undefined;
    tone?: "primary" | "success" | "warning" | "info" | "muted" | null | undefined;
    size?: "default" | "xs" | "sm" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface BadgeProps extends React$1.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, tone, size, ...props }: BadgeProps): React$1.JSX.Element;

declare const Breadcrumb: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & {
    separator?: React$1.ReactNode;
} & React$1.RefAttributes<HTMLElement>>;
declare const BreadcrumbList: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>, "ref"> & React$1.RefAttributes<HTMLOListElement>>;
declare const BreadcrumbItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
declare const BreadcrumbLink: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref"> & {
    asChild?: boolean;
} & React$1.RefAttributes<HTMLAnchorElement>>;
declare const BreadcrumbPage: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
declare const BreadcrumbSeparator: {
    ({ children, className, ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;
    displayName: string;
};
declare const BreadcrumbEllipsis: {
    ({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
    displayName: string;
};

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "soft" | null | undefined;
    size?: "default" | "xs" | "sm" | "lg" | "icon-xs" | "icon" | "nav-icon" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: React$1.ForwardRefExoticComponent<ButtonProps & React$1.RefAttributes<HTMLButtonElement>>;

declare const Separator: React$1.ForwardRefExoticComponent<Omit<SeparatorPrimitive.SeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const buttonGroupVariants: (props?: ({
    orientation?: "horizontal" | "vertical" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function ButtonGroup({ className, orientation, ...props }: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>): React$1.JSX.Element;
declare function ButtonGroupText({ className, asChild, ...props }: React.ComponentProps<"div"> & {
    asChild?: boolean;
}): React$1.JSX.Element;
declare function ButtonGroupSeparator({ className, orientation, ...props }: React.ComponentProps<typeof Separator>): React$1.JSX.Element;

declare const Card: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardTitle: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardContent: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
interface CardWithHeaderProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: string | React$1.ReactNode;
    description?: string | React$1.ReactNode;
    headerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    footer?: React$1.ReactNode;
}
declare const CardWithHeader: React$1.ForwardRefExoticComponent<CardWithHeaderProps & React$1.RefAttributes<HTMLDivElement>>;

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};
declare const Carousel: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & CarouselProps & React$1.RefAttributes<HTMLDivElement>>;
declare const CarouselContent: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CarouselItem: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CarouselPrevious: React$1.ForwardRefExoticComponent<Omit<ButtonProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const CarouselNext: React$1.ForwardRefExoticComponent<Omit<ButtonProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const Command: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | keyof React$1.HTMLAttributes<HTMLDivElement> | "asChild"> & {
    label?: string;
    shouldFilter?: boolean;
    filter?: (value: string, search: string, keywords?: string[]) => number;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    loop?: boolean;
    disablePointerSelection?: boolean;
    vimBindings?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandDialog: ({ children, ...props }: DialogProps) => React$1.JSX.Element;
declare const CommandInput: React$1.ForwardRefExoticComponent<Omit<Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React$1.InputHTMLAttributes<HTMLInputElement>> & {
    ref?: React$1.Ref<HTMLInputElement>;
} & {
    asChild?: boolean;
}, "key" | "asChild" | keyof React$1.InputHTMLAttributes<HTMLInputElement>>, "onChange" | "value" | "type"> & {
    value?: string;
    onValueChange?: (search: string) => void;
} & React$1.RefAttributes<HTMLInputElement>, "ref"> & React$1.RefAttributes<HTMLInputElement>>;
declare const CommandList: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | keyof React$1.HTMLAttributes<HTMLDivElement> | "asChild"> & {
    label?: string;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandEmpty: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | keyof React$1.HTMLAttributes<HTMLDivElement> | "asChild"> & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandGroup: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | keyof React$1.HTMLAttributes<HTMLDivElement> | "asChild">, "heading" | "value"> & {
    heading?: React$1.ReactNode;
    value?: string;
    forceMount?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandSeparator: React$1.ForwardRefExoticComponent<Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | keyof React$1.HTMLAttributes<HTMLDivElement> | "asChild"> & {
    alwaysRender?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandItem: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | keyof React$1.HTMLAttributes<HTMLDivElement> | "asChild">, "onSelect" | "disabled" | "value"> & {
    disabled?: boolean;
    onSelect?: (value: string) => void;
    value?: string;
    keywords?: string[];
    forceMount?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): React$1.JSX.Element;
    displayName: string;
};

declare const Dialog: React$1.FC<DialogPrimitive.DialogProps>;
declare const DialogTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const DialogClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogContent: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
    displayName: string;
};
declare const DialogFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
    displayName: string;
};
declare const DialogTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const DropdownMenu: React$1.FC<DropdownMenuPrimitive.DropdownMenuProps>;
declare const DropdownMenuTrigger: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuPortal: React$1.FC<DropdownMenuPrimitive.DropdownMenuPortalProps>;
declare const DropdownMenuSub: React$1.FC<DropdownMenuPrimitive.DropdownMenuSubProps>;
declare const DropdownMenuRadioGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuRadioGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubTrigger: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubTriggerProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuCheckboxItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuCheckboxItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuRadioItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): React$1.JSX.Element;
    displayName: string;
};

declare const HoverCard: React$1.FC<HoverCardPrimitive.HoverCardProps>;
declare const HoverCardTrigger: React$1.ForwardRefExoticComponent<HoverCardPrimitive.HoverCardTriggerProps & React$1.RefAttributes<HTMLAnchorElement>>;
declare const HoverCardContent: React$1.ForwardRefExoticComponent<Omit<HoverCardPrimitive.HoverCardContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare function ItemGroup({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function ItemSeparator({ className, ...props }: React$1.ComponentProps<typeof Separator>): React$1.JSX.Element;
declare const itemVariants: (props?: ({
    variant?: "default" | "outline" | "muted" | null | undefined;
    size?: "default" | "xs" | "sm" | null | undefined;
    selected?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Item({ className, variant, size, selected, asChild, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof itemVariants> & {
    asChild?: boolean;
}): React$1.JSX.Element;
declare const itemMediaVariants: (props?: ({
    variant?: "image" | "default" | "icon" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function ItemMedia({ className, variant, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>): React$1.JSX.Element;
declare function ItemContent({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function ItemTitle({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function ItemDescription({ className, ...props }: React$1.ComponentProps<"p">): React$1.JSX.Element;
declare function ItemActions({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function ItemHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function ItemFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;

declare function Kbd({ className, ...props }: React.ComponentProps<"kbd">): React$1.JSX.Element;
declare function KbdGroup({ className, ...props }: React.ComponentProps<"div">): React$1.JSX.Element;

/**
 * `variant` is how loudly the link asks to be clicked.
 *
 * Three, because three is what the product actually uses and a fourth would be
 * a decision nobody could state:
 *
 * - `default` — a link inside a sentence. Accent-coloured, underlined on hover.
 *   The colour is what marks it as a link while reading; the underline confirms
 *   it under the cursor.
 * - `underlined` — always underlined, accent-coloured. For a link that has to
 *   read as a link **before** the cursor arrives: terms and conditions under a
 *   sign-in button, a citation, anything legal or referential.
 * - `quiet` — muted, brightening to the foreground on hover. A footer link, a
 *   row that happens to be navigable. It is not shouting, and it is not
 *   pretending to be body copy either: the hover is the affordance.
 *
 * Deliberately **not** a `Button` variant. A button performs an act on this
 * page; a link goes somewhere, which is a different promise, a different
 * element and a different set of things a browser will do for you (middle
 * click, copy address, open in a tab). A `<button>` styled as a link takes all
 * of that away, and `Button asChild` around an `<a>` is the escape hatch for
 * the genuinely button-shaped case.
 *
 * No size axis. A link takes the size of the text it sits in — that is what
 * makes it a link *in a sentence* rather than a control dropped into one.
 */
declare const linkVariants: (props?: ({
    variant?: "default" | "underlined" | "quiet" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface LinkProps extends React$1.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
    /**
     * The destination is outside this app: opens in a new tab, and carries
     * `rel="noreferrer noopener"` so the opened page cannot reach back through
     * `window.opener`.
     *
     * A flag rather than asking every call site to remember `target` and `rel`
     * together — the pair is the thing that is correct, and half of it is a
     * security bug nobody notices.
     */
    external?: boolean;
}
/**
 * A link. An `<a>` with the kit's colours, and the two behaviours an external
 * one needs.
 *
 * It exists because every surface was writing its own — `text-primary
 * hover:underline` here, `text-muted-foreground hover:underline` there — which
 * is four spellings of one object and a colour that drifts the day the accent
 * moves.
 *
 * Routing is the consumer's: this renders an `<a>`, and a router's own `Link`
 * wraps it (`<RouterLink asChild>`) or takes these classes. The kit does not
 * depend on a router, because a component that did could only ever be used with
 * that one.
 */
declare const Link: React$1.ForwardRefExoticComponent<LinkProps & React$1.RefAttributes<HTMLAnchorElement>>;

declare function MenubarMenu({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Menu>): React$1.JSX.Element;
declare function MenubarGroup({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Group>): React$1.JSX.Element;
declare function MenubarPortal({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Portal>): React$1.JSX.Element;
declare function MenubarRadioGroup({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.RadioGroup>): React$1.JSX.Element;
declare function MenubarSub({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Sub>): React$1.JSX.Element;
declare const Menubar: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarTrigger: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const MenubarSubTrigger: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarSubTriggerProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarSubContent: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarSubContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarContent: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarItem: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarCheckboxItem: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarCheckboxItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarRadioItem: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarRadioItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarLabel: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarSeparator: React$1.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const MenubarShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): React$1.JSX.Element;
    displayname: string;
};

declare const NavigationMenu: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuProps & React$1.RefAttributes<HTMLElement>, "ref"> & React$1.RefAttributes<HTMLElement>>;
declare const NavigationMenuList: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuListProps & React$1.RefAttributes<HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const NavigationMenuItem: React$1.ForwardRefExoticComponent<NavigationMenuPrimitive.NavigationMenuItemProps & React$1.RefAttributes<HTMLLIElement>>;
declare const navigationMenuTriggerStyle: (props?: class_variance_authority_types.ClassProp | undefined) => string;
declare const NavigationMenuTrigger: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const NavigationMenuContent: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const NavigationMenuLink: React$1.ForwardRefExoticComponent<NavigationMenuPrimitive.NavigationMenuLinkProps & React$1.RefAttributes<HTMLAnchorElement>>;
declare const NavigationMenuViewport: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuViewportProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const NavigationMenuIndicator: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuIndicatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Pagination: {
    ({ className, ...props }: React$1.ComponentProps<"nav">): React$1.JSX.Element;
    displayName: string;
};
declare const PaginationContent: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const PaginationItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, "size"> & React$1.ComponentProps<"a">;
declare const PaginationLink: {
    ({ className, isActive, size, ...props }: PaginationLinkProps): React$1.JSX.Element;
    displayName: string;
};
declare const PaginationPrevious: {
    ({ className, ...props }: React$1.ComponentProps<typeof PaginationLink>): React$1.JSX.Element;
    displayName: string;
};
declare const PaginationNext: {
    ({ className, ...props }: React$1.ComponentProps<typeof PaginationLink>): React$1.JSX.Element;
    displayName: string;
};
declare const PaginationEllipsis: {
    ({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
    displayName: string;
};

declare const Popover: React$1.FC<PopoverPrimitive.PopoverProps>;
declare const PopoverTrigger: React$1.ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const PopoverContent: React$1.ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

/**
 * `sm` (4px) is the inline meter — a budget bar under a figure, a quota in a
 * row. At that height it reads as part of the number above it rather than as a
 * control, which is the point: nobody drags it.
 */
type ProgressSize = "default" | "sm";
declare const Progress: React$1.ForwardRefExoticComponent<Omit<ProgressPrimitive.ProgressProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    size?: ProgressSize;
} & React$1.RefAttributes<HTMLDivElement>>;

declare const ResizablePanelGroup: (props: React.ComponentProps<typeof Group>) => React$1.JSX.Element;
declare const ResizablePanel: typeof Panel;
declare const ResizableHandle: ({ withHandle, className, ...props }: React.ComponentProps<typeof Separator$1> & {
    withHandle?: boolean;
}) => React$1.JSX.Element;

declare const ScrollArea: React$1.ForwardRefExoticComponent<Omit<ScrollAreaPrimitive.ScrollAreaProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const ScrollBar: React$1.ForwardRefExoticComponent<Omit<ScrollAreaPrimitive.ScrollAreaScrollbarProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

interface SegmentedOption {
    /** What the caller gets back. */
    value: string;
    label: React$1.ReactNode;
    disabled?: boolean;
}
interface SegmentedControlProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    options: SegmentedOption[];
    /** Controlled. Pass it with {@link onValueChange}. */
    value?: string;
    /** Uncontrolled starting option. Defaults to the first. */
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** `xs` is 22px — a pagehead slot. `sm` is 26px, for a panel header. */
    size?: "xs" | "sm";
    /** Fill the width given, each option an equal share of it. */
    stretch?: boolean;
}
/**
 * One page, read another way.
 *
 * A run has four readings and a step has three — *In order · Layers · Flow ·
 * Lens*, *Overview · Touched · Log* — and each of them is the **same record**
 * drawn differently. That is what this control says and a tab strip does not:
 * tabs own a panel and imply separate content underneath, so four tabs over one
 * trace read as four pages that happen to share a header. A segmented control
 * sits in the pagehead's action slot, beside the chips that describe the record,
 * and says *this is a switch on what you are already looking at*.
 *
 * It is also not `ToggleGroup`. That is a set of independent toggles which may
 * all be off; a reading is never off, so the control is a radio group and is
 * announced as one. Arrow keys move between options, which is what a reader who
 * never leaves the keyboard expects of a radio group.
 *
 * **The frame is the control.** One border around the whole thing, the active
 * option filled with the primary tint and the rest plain — never a border per
 * option, which draws three controls where there is one.
 */
declare const SegmentedControl: React$1.ForwardRefExoticComponent<SegmentedControlProps & React$1.RefAttributes<HTMLDivElement>>;

declare const Sheet: React$1.FC<DialogPrimitive.DialogProps>;
declare const SheetTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const SheetOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const sheetVariants: (props?: ({
    side?: "top" | "right" | "bottom" | "left" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SheetContentProps extends React$1.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, VariantProps<typeof sheetVariants> {
}
declare const SheetContent: React$1.ForwardRefExoticComponent<SheetContentProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SheetHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
    displayName: string;
};
declare const SheetFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
    displayName: string;
};
declare const SheetTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const SheetDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const TooltipProvider: React$1.FC<TooltipPrimitive.TooltipProviderProps>;
declare const Tooltip: React$1.FC<TooltipPrimitive.TooltipProps>;
declare const TooltipTrigger: React$1.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const TooltipContent: React$1.ForwardRefExoticComponent<Omit<TooltipPrimitive.TooltipContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type SidebarContextProps = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};
declare function useSidebar(): SidebarContextProps;
declare const SidebarProvider: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLDivElement> & React$1.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const Sidebar: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLDivElement> & React$1.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarTrigger: React$1.ForwardRefExoticComponent<Omit<ButtonProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarRail: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarInset: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarInput: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & React$1.RefAttributes<HTMLInputElement>>;
declare const SidebarHeader: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarFooter: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarSeparator: React$1.ForwardRefExoticComponent<Omit<Omit<SeparatorPrimitive.SeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarContent: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarGroup: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarGroupLabel: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLDivElement> & React$1.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarGroupAction: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLButtonElement> & React$1.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarGroupContent: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarMenu: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const SidebarMenuItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
declare const SidebarMenuButton: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLButtonElement> & React$1.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React$1.ComponentProps<typeof TooltipContent>;
} & VariantProps<(props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarMenuAction: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLButtonElement> & React$1.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    showOnHover?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarMenuBadge: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarMenuSkeleton: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLDivElement> & React$1.HTMLAttributes<HTMLDivElement> & {
    showIcon?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarMenuSub: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const SidebarMenuSubItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
declare const SidebarMenuSubButton: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLAnchorElement> & React$1.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLAnchorElement>>;

declare function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;

type ToasterProps = React.ComponentProps<typeof Toaster$1>;
declare const Toaster: ({ ...props }: ToasterProps) => React$1.JSX.Element;

declare function Spinner({ className, ...props }: React.ComponentProps<"svg">): React$1.JSX.Element;

/**
 * The state of one thing, as a dot.
 *
 * It appears beside almost everything that has a state — a step in a run, an
 * agent in a roster, a dataset, a schedule firing, a node type in a legend.
 * Extracted from `ChatSessionTaskRow`, which had grown its own copy: the same
 * six states were being re-declared per surface, and two of them had already
 * drifted apart.
 *
 * `rounded-full` is correct here and not a violation of the radius rule — a
 * status dot is one of the shapes where round *is* the object, alongside
 * avatars and spinners (see `@invana/styling` › border radius).
 *
 * **A dot is never the only carrier of state.** Every use names the state
 * beside it, or exposes it through `label`. Colour alone fails colour-blind
 * readers, and a `running` pulse fails anyone with motion reduced — which the
 * `motion-reduce` variant below honours by design.
 */
declare const statusDotVariants: (props?: ({
    tone?: "success" | "warning" | "info" | "muted" | "error" | "running" | "queued" | null | undefined;
    size?: "xs" | "sm" | "lg" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface StatusDotProps extends Omit<React$1.HTMLAttributes<HTMLSpanElement>, "children">, VariantProps<typeof statusDotVariants> {
    /**
     * What this state is called, for a screen reader.
     *
     * Pass it when the dot is the only thing carrying the state. Omit it when
     * the state is already written beside the dot, so it is not announced twice.
     */
    label?: string;
}
declare const StatusDot: React$1.ForwardRefExoticComponent<StatusDotProps & React$1.RefAttributes<HTMLSpanElement>>;

declare const Table: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableElement> & {
    density?: "default" | "compact";
} & React$1.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableRowElement> & React$1.RefAttributes<HTMLTableRowElement>>;
declare const TableHead: React$1.ForwardRefExoticComponent<React$1.ThHTMLAttributes<HTMLTableCellElement> & React$1.RefAttributes<HTMLTableCellElement>>;
declare const TableCell: React$1.ForwardRefExoticComponent<React$1.TdHTMLAttributes<HTMLTableCellElement> & React$1.RefAttributes<HTMLTableCellElement>>;
declare const TableCaption: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableCaptionElement> & React$1.RefAttributes<HTMLTableCaptionElement>>;

/**
 * Density for a tab strip.
 *
 * `sm` (28px) is the application tab strip — a panel's views, a canvas's open
 * tabs. It drops the list's inset background and padding: at that height the
 * tray reads as a second toolbar, and the strip sits directly on the panel's
 * own rule instead.
 *
 * Passed through context rather than as a prop on every part, so a caller sets
 * it once on `<Tabs>` and the list and triggers follow.
 */
type TabsSize = "default" | "sm";
declare const Tabs: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    size?: TabsSize;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const TabsList: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsListProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const TabsTrigger: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const toggleVariants: (props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare const Toggle: React$1.ForwardRefExoticComponent<Omit<TogglePrimitive.ToggleProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & VariantProps<(props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string> & React$1.RefAttributes<HTMLButtonElement>>;

declare const ToggleGroup: React$1.ForwardRefExoticComponent<((Omit<ToggleGroupPrimitive.ToggleGroupSingleProps & React$1.RefAttributes<HTMLDivElement>, "ref"> | Omit<ToggleGroupPrimitive.ToggleGroupMultipleProps & React$1.RefAttributes<HTMLDivElement>, "ref">) & VariantProps<(props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string>) & React$1.RefAttributes<HTMLDivElement>>;
declare const ToggleGroupItem: React$1.ForwardRefExoticComponent<Omit<ToggleGroupPrimitive.ToggleGroupItemProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & VariantProps<(props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string> & React$1.RefAttributes<HTMLButtonElement>>;

/**
 * Why a band is not drawn — **and these are three different facts.**
 *
 * - `unrecorded` — nobody wrote this document. A step in flight has no
 *   `result.json` because the interpreter writes it when the row settles.
 * - `purged` — it was written, and retention removed it. The counts and the
 *   outcome stay; the input, the output and the log do not.
 * - `declared-none` — the step declares no such output at all: a `notify` step
 *   returns nothing, and a read under `read_only: true` writes nothing.
 *
 * Collapsing them into one *empty* is the thing this component exists to stop.
 * An empty table claims a step returned an empty result; *purged* claims it
 * returned nothing. Both are lies about a different record.
 */
type AbsenceReason = "unrecorded" | "purged" | "declared-none";
interface AbsenceNoteProps extends React$1.HTMLAttributes<HTMLDivElement> {
    reason: AbsenceReason;
    /** Overrides the word. The engine's own term is better where there is one — `read_only: true`. */
    label?: React$1.ReactNode;
    /** Why, in the record's terms. One or two sentences, and it is not optional in spirit. */
    children?: React$1.ReactNode;
}
/**
 * A band with nothing in it, saying which kind of nothing.
 *
 * It is not `EmptyState`: that invites an action — *load a dataset*, *ask a
 * question* — and there is no action here. A step that recorded nothing is a
 * finished fact about a finished record, and the only thing owed to the reader
 * is which fact it is.
 */
declare const AbsenceNote: React$1.ForwardRefExoticComponent<AbsenceNoteProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * How this address stood in the run, or in the rule being read.
 *
 * `denied` and `refused` are two different facts and the boards print both:
 * a **denied** address is what the bound says, read at rest; a **refused** one
 * is what actually happened when a run reached for it. One is a rule, the other
 * is an event, and collapsing them loses *the bound was there and nothing ever
 * tested it*.
 */
type KnownAddressTone = "allowed" | "denied" | "refused" | "untouched";
/**
 * The values the kit draws specially — **suggestions, not a limit.** Anything
 * else renders with the neutral token and its own name.
 */
type AddressTone = KnownAddressTone | (string & {});
/**
 * Split an address so the **participant survives truncation**.
 *
 * `graph_data/model/Deals@1.0.0` is read right-to-left: the last segment is
 * which thing, and the first two are which kind of thing — and the kind is
 * already carried by the `LayerChip` beside it. So the head flexes and clips
 * and the tail is pinned, giving `graph_data/mod…/Deals@1.0.0` rather than the
 * `graph_data/model/Dea…` a plain `truncate` would give.
 *
 * A wildcard pattern is the same shape (`graph_data/model/Deals@*`), and
 * `third_party/**` has no tail to lose.
 */
declare function split(address: string): {
    head: string;
    tail: string;
};
interface AddressChipProps extends Omit<React$1.HTMLAttributes<HTMLSpanElement>, "children" | "onClick"> {
    /** `graph_data/model/Deals@1.0.0`, or a pattern — `third_party/**`. */
    address: string;
    tone?: AddressTone;
    /**
     * Open the participant this names. Present makes the chip a button; absent
     * leaves it text, because an address that looks pressable and is not teaches
     * the reader to stop pressing.
     */
    onOpen?: (address: string) => void;
}
/**
 * One participant's address, printed so the participant stays readable.
 *
 * The address is the only identifier there is — the lens matches on it, the
 * ledger records it, the run drawing expands it — so it appears wherever a
 * bound, a touch or a refusal is shown, and it has to survive a narrow column
 * without becoming three of the same string.
 *
 * **It truncates in the middle, not the end.** See {@link split}: the last
 * segment is which thing and the ones before it are which kind, so the kind is
 * what gives way. Clipping the tail would render every model in a Graph as
 * `graph_data/model/…`.
 *
 * The separators sit at half opacity so the segments read as three parts of one
 * name rather than one long token. Monospace for the same reason it is
 * monospace in the ledger: these are compared by eye, down a column.
 */
declare const AddressChip: React$1.ForwardRefExoticComponent<AddressChipProps & React$1.RefAttributes<HTMLSpanElement>>;

declare const agentChipVariants: (props?: ({
    kind?: "agent" | "person" | null | undefined;
    inactive?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface AgentChipProps extends React$1.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof agentChipVariants> {
    /** A 12px lucide icon, or an `<Avatar>`. */
    icon?: React$1.ReactNode;
    name: React$1.ReactNode;
}
/**
 * Who did this — an agent or a person — as a 22px chip.
 *
 * It appears wherever work has a holder: a task row's assignee, a step's actor,
 * a skill's users, a rule's audience, a proposal's author.
 *
 * Deliberately not a `Badge`. A badge carries a *state* and takes a tone from
 * the status palette; this carries an *identity* and must never look like a
 * status. Same reason it does not take a colour: agents are told apart by name,
 * not by hue.
 */
declare const AgentChip: React$1.ForwardRefExoticComponent<AgentChipProps & React$1.RefAttributes<HTMLSpanElement>>;

declare const stateVariants: (props?: ({
    tone?: "active" | "error" | "running" | "draft" | "review" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface AppStatusBarProps extends React$1.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stateVariants> {
    /** The session's state — `ACTIVE`, `DRAFT`, `RUNNING`, `REVIEW`. */
    state?: React$1.ReactNode;
    /** What the session currently holds — `26 nodes · 41 edges · 60 fps`. */
    children?: React$1.ReactNode;
    /** Right-hand slot. The build version, usually. */
    end?: React$1.ReactNode;
}
/**
 * The 25px line at the bottom of the window.
 *
 * It describes the **session**, not the screen: what is loaded, what state it
 * is in, which build is running. That is why it barely changes as you navigate
 * — a status bar that flickered with every route would stop being somewhere the
 * eye can rest.
 *
 * Generalised from `ChatSessionStatusBar`, which is the same bar scoped to a
 * thread. This one adds the state marker, because at the application level
 * "what state is this in" is the first question and a bare row of counters does
 * not answer it.
 */
declare const AppStatusBar: React$1.ForwardRefExoticComponent<AppStatusBarProps & React$1.RefAttributes<HTMLDivElement>>;

interface Artifact {
    /** The file's name as the step wrote it — `rows-1284.csv`. */
    name: React$1.ReactNode;
    /** What produced it — `interpreter`, `export`, `rejects`, `input`. */
    kind?: React$1.ReactNode;
    size?: React$1.ReactNode;
    /**
     * **The address.** The same bytes produced twice are one artifact, so the
     * digest — eight characters, mono — is what a reader quotes, not the name.
     */
    digest?: React$1.ReactNode;
    /** When it landed, on the run's own clock — `+76.8s`. */
    written?: React$1.ReactNode;
    /**
     * Retention has taken the bytes. The row stays and is struck: *this file
     * existed and is gone* is a different fact from *no file was written*.
     */
    gone?: boolean;
}
interface ArtifactTableProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    files: Artifact[];
    onOpen?: (file: Artifact, index: number) => void;
    onDownload?: (file: Artifact, index: number) => void;
    /** Anything else a row offers. Replaces the two defaults when given. */
    renderActions?: (file: Artifact, index: number) => React$1.ReactNode;
}
/**
 * The files a step left behind.
 *
 * A file is the one thing a step produces that outlives the reading of it, and
 * it is **addressed by digest** — which is why the digest is drawn beside the
 * name rather than hidden behind a tooltip: a file that outlives its run is
 * still reachable, and two runs that produced the same bytes produced one
 * artifact.
 *
 * Rejected records are a file like any other. That is what makes `18 rejected`
 * something a person can open instead of a dead count.
 *
 * **A step that left nothing draws no table.** Absence is the caller's to
 * render — see `AbsenceNote` — because an empty table here would claim the step
 * wrote an empty file.
 */
declare const ArtifactTable: React$1.ForwardRefExoticComponent<ArtifactTableProps & React$1.RefAttributes<HTMLDivElement>>;

interface AttemptRow {
    /** `queued` · `attempt 1` · `attempt 2` · `settled`. */
    label: React$1.ReactNode;
    /** When it started, on the run's own clock — `+44.5s`. */
    started?: React$1.ReactNode;
    /** How long it took — `30.0s`, or `4.2s…` while it is still running. */
    took?: React$1.ReactNode;
    /** What happened, in one line. */
    what?: React$1.ReactNode;
    tone?: "muted" | "info" | "success" | "warning" | "destructive";
    /** It ran and it did not stick. **Struck, never dropped.** */
    struck?: boolean;
}
interface AttemptClockProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    rows: AttemptRow[];
    /**
     * What the two numbers are — `elapsed 32.4s · working 2.3s · the gap is the
     * attempt that timed out`.
     *
     * **Stated, never left as arithmetic.** A reader who has to subtract two
     * durations to find a 30-second timeout has been handed a sum instead of an
     * answer.
     */
    summary?: React$1.ReactNode;
}
/**
 * A step's clock, attempt by attempt.
 *
 * One duration cannot say what happened to a step that timed out once and then
 * returned: `2.1s` is what it *did*, `32.4s` is what a reader waited, and the
 * gap between them **is** the first attempt. So the clock is a row per attempt
 * — queued, each try, settled — and the try that failed keeps its place, struck.
 *
 * Nothing new is recorded for this: it is the `timing` and `attempt` fields the
 * interpreter already writes, read as a list instead of as a total.
 */
declare const AttemptClock: React$1.ForwardRefExoticComponent<AttemptClockProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface BarDatum {
    label: React$1.ReactNode;
    value: number;
    /**
     * Overrides the series colour for this bar. Use a data-palette token
     * (`var(--color-data-3)`) when the bar's identity is an entity — a node type,
     * a theme — so it matches that entity everywhere else it appears.
     */
    color?: string;
    /** What the tip should read, if not the raw value. */
    display?: React$1.ReactNode;
}
interface BarChartHProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    data: BarDatum[];
    /** Fixes the scale. Defaults to the largest value present. */
    max?: number;
    /** Width of the label column, so bars start on the same x. */
    labelWidth?: number;
    /** Series colour when a datum does not override it. */
    color?: string;
    /** Names what is plotted. A single series needs no legend when this is set. */
    caption?: React$1.ReactNode;
}
/**
 * Magnitude across a handful of named things.
 *
 * Horizontal because the labels are words — a stock, a pattern, a theme — and
 * words read badly rotated under a column. Bars grow from a single baseline on
 * the left, so length is the only thing carrying the value.
 *
 * One series, so there is no legend: `caption` names what is plotted. Every bar
 * is directly labelled at its tip, which is also what discharges the light-mode
 * contrast obligation on the data palette — identity and value are never
 * carried by hue alone.
 */
declare const BarChartH: React$1.ForwardRefExoticComponent<BarChartHProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface ColumnDatum {
    /** The period — `wk 36`. */
    label: React$1.ReactNode;
    /** A second line under the label — `1–5 Sep`. */
    sublabel?: React$1.ReactNode;
    value: number;
    display?: React$1.ReactNode;
}
interface BarChartVProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    data: ColumnDatum[];
    /** Fixes the scale. Defaults to the largest value present. */
    max?: number;
    /** Values to draw a hairline at — `[50, 75, 100]`. */
    gridlines?: number[];
    height?: number;
    color?: string;
    /** Colour for the column the story is about. Defaults to `color`. */
    highlightColor?: string;
    /** Which column carries the emphasis — usually the most recent. */
    highlightIndex?: number;
    /**
     * Which columns get a value on the cap.
     *
     * `last` by default. A number on every column stops being a label and becomes
     * texture; the gridlines carry the rest.
     */
    labelMode?: "last" | "all" | "none";
    caption?: React$1.ReactNode;
}
/**
 * One measure over a few periods.
 *
 * Vertical because the x-axis is time and time reads left to right. Columns are
 * capped at 24px and separated by real gaps, so the band's leftover is air
 * rather than a fatter bar.
 *
 * `labelMode` defaults to `last`: the current period is the one being asked
 * about, and the gridlines carry the others. One series, so no legend —
 * `caption` says what is plotted.
 */
declare const BarChartV: React$1.ForwardRefExoticComponent<BarChartVProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * The capabilities Invana ships today — **suggestions, not a limit.**
 *
 * These are what {@link Bound} autocompletes to. They bind nothing: a product
 * that adds a `vector_write` bound as it grows passes `"vector_write"` and the
 * chip draws it. The catalogue groups by these and an envelope ceilings them,
 * but that is the *runtime's* vocabulary to police — a chip that refused to
 * render an unknown bound would make the design kit a release blocker for
 * every new capability.
 */
type KnownBound = "none" | "network" | "graph_read" | "graph_write" | "schema_write" | "ingest" | "llm" | "plan_write" | "work_write";
/**
 * What a callable may spend — any identifier at all.
 *
 * `(string & {})` keeps the known set autocompleting while accepting anything
 * else without a cast. See {@link KnownBound}.
 */
type Bound = KnownBound | (string & {});
/**
 * What each bound is painted with — **the kit ships no hues.**
 *
 * Which colour means `schema_write` is a product's decision. Four of the nine
 * were only ever data-palette slots picked for being distinguishable from one
 * another, which is exactly the kind of choice a component should not be
 * making on a consumer's behalf; and holding the map forced every consumer
 * onto a stylesheet that defines those slots, which is how `bg-data-*` came to
 * be dead in the precompiled `@invana/ui/styles.css` without anyone noticing.
 *
 * Values are class strings, so a surface spends whatever its own Tailwind
 * build has — a data-palette token, a status token, a brand colour. A bound
 * left out draws in the neutral.
 */
type BoundPalette = Partial<Record<Bound, string>>;
interface BoundChipProps extends Omit<React$1.HTMLAttributes<HTMLSpanElement>, "children"> {
    bound: Bound;
    /**
     * Render the swatch alone, for somewhere the name is already written beside
     * it. Use sparingly — see the note on colour below.
     */
    swatchOnly?: boolean;
    /** What to call it, when the identifier is not what this surface says. */
    label?: React$1.ReactNode;
    /**
     * This chip's swatch class, given directly — `bg-data-7`, `bg-violet-500`.
     * The shortest path when a call site draws one chip and knows its bound.
     * Wins over {@link BoundChipProps.palette}.
     */
    swatch?: string;
    /**
     * What the bounds are painted with, when a caller draws several and would
     * rather state the map once. Only this chip's own bound is read.
     */
    palette?: BoundPalette;
}
/**
 * What a task is allowed to spend, as a swatch and a name.
 *
 * It appears on a task node in a flow, in a run's record header, on a catalogue
 * row and in the parameter form's contract card — everywhere a reader has to
 * know *what this act costs* before reading what it does.
 *
 * **The name is always there.** The swatch is a scanning aid, not the carrier:
 * nine hues cannot be told apart reliably, several pairs are close, and a
 * colour-blind reader gets nothing from any of them. `swatchOnly` exists for
 * the one case where the name is already printed next to the chip.
 *
 * Deliberately not a `Badge`. A badge carries *state* and takes a tone from the
 * status palette; a bound is a fixed property of a callable and must not read
 * as "this went well" because it happens to be green.
 */
declare const BoundChip: React$1.ForwardRefExoticComponent<BoundChipProps & React$1.RefAttributes<HTMLSpanElement>>;

interface ButtonWithTooltipProps extends ButtonProps {
    tooltip: React__default.ReactNode;
}
declare function ButtonWithTooltip(props: ButtonWithTooltipProps): React__default.JSX.Element;

interface CannotAnswerCardProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** What the graph does not hold. One sentence, in the graph's own terms. */
    children?: React$1.ReactNode;
    /**
     * What would change the answer — an import, a connector, a missing model.
     *
     * Not optional in spirit. A refusal without a next step is a dead end, and the
     * reader is left unable to tell "never" from "not yet".
     */
    remedy?: React$1.ReactNode;
    /** Overrides the label. Defaults to `cannot answer`. */
    label?: React$1.ReactNode;
}
/**
 * The graph does not hold what was asked.
 *
 * One of the four run outcomes, and its own component rather than a variant
 * (DS8) — because it is neither a failure nor an empty answer, and it must not
 * be reachable by flipping a prop on either.
 *
 * Dashed, and with **no citation strip**: there is nothing to cite, and an empty
 * strip would read as an uncited claim. This is the surface that keeps the
 * system's promise that it says so when it cannot answer.
 */
declare const CannotAnswerCard: React$1.ForwardRefExoticComponent<CannotAnswerCardProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * The classes of participant Invana ships today — **suggestions, not a limit.**
 *
 * These are what {@link Layer} autocompletes to. They bind nothing: a product
 * that grows a `vector_store` layer next week passes `"vector_store"` and every
 * component here draws it, because a component that had to be edited before a
 * developer could name a new layer is a component that owns the product's
 * vocabulary.
 *
 * `agent` is the **spine**: the runtime itself, which does the participating
 * rather than being a participant, and is never governed. Nothing in this file
 * knows that — a band says so with `spine`, see `LayerStrip`.
 */
type KnownLayer = "graph_data" | "llm" | "third_party" | "cache" | "human" | "agent";
/**
 * What a participant **is** — any identifier at all.
 *
 * `(string & {})` is what keeps both halves: the known set still autocompletes
 * and still documents itself, while an unknown string is accepted without a
 * cast. Widening this to plain `string` would silently drop the suggestions;
 * narrowing it back to the union would make the kit the gatekeeper of a
 * vocabulary it does not own.
 */
type Layer = KnownLayer | (string & {});
/**
 * What a reader calls the layer: the identifier with its underscores opened up.
 *
 * Derived rather than looked up — a table would have to be edited for every
 * layer a product adds, and for all six Invana ships today the table said
 * exactly this anyway (`graph_data` → `graph data`). A layer that wants
 * something else passes `label`.
 */
declare const layerLabel: (layer: Layer) => string;
/**
 * How one layer is painted. **The kit ships no hues** — a consumer supplies
 * these, because which colour means `llm` is a product's decision and not a
 * component's.
 *
 * Both are class strings rather than colours, so a surface spends whatever
 * palette its own Tailwind build already has: `bg-data-7` from
 * `@invana/styling`, a brand token, a plain `bg-violet-500`. A component that
 * held the map would force every consumer onto the kit's palette *and* onto a
 * stylesheet that defines it — which is how `bg-data-*` came to be dead in the
 * precompiled `@invana/ui/styles.css` without anyone noticing.
 *
 * It is passed to the component that draws, as a prop, every time — never
 * installed once for a tree. A caller restating its palette at four call sites
 * is the honest cost: the alternative hides *which* colours a drawing is using
 * behind a provider somebody else mounted.
 *
 * - `swatch` is the **solid mark**: the dot beside a name, the rail down a bar.
 * - `tint` is the **wash**: a bar's ground and edge together. Keep it faint —
 *   it sits *behind* text, so a hue dark enough to label in is a hue too dark
 *   to wash with.
 * - `text` is the hue **as type**: a participant address written in its layer's
 *   colour, so `model/Orders@v2` and the `graph data` dot above it are visibly
 *   the same thing. This is the one that has to clear a contrast floor, which
 *   is why it is yours to choose and separate from `swatch` — the token that
 *   makes a legible 6px dot is often not the one that makes legible 13px mono.
 */
interface LayerPaint {
    /** The solid mark — `bg-data-7`. */
    swatch?: string;
    /** The wash, ground and edge — `border-data-7/35 bg-data-7/10`. */
    tint?: string;
    /** The hue as type, for an address that should read as its layer — `text-data-7`. */
    text?: string;
}
/**
 * What each layer is painted with. Partial on purpose: a layer left out falls
 * back to the neutral, which is a legible answer rather than a blank one.
 */
type LayerPalette = Partial<Record<Layer, LayerPaint>>;
/**
 * One layer's paint, with the neutral filled in for anything unsaid — so a
 * caller never branches on `undefined` to draw a dot.
 *
 * There is no provider and no context. Colour arrives as the `palette` prop on
 * the component that draws, every time: a chip painted from somewhere up the
 * tree is a chip whose colour you cannot find by reading its call site.
 */
declare const layerPaint: (palette: LayerPalette | undefined, layer: Layer) => Required<LayerPaint>;
interface LayerChipProps extends Omit<React$1.HTMLAttributes<HTMLSpanElement>, "children"> {
    layer: Layer;
    /**
     * How many participants this layer holds — `graph data 4`. Omit where the
     * count is already in the row, and note that `0` is a fact worth printing:
     * *nothing is configured* reads differently from *nothing matched*.
     */
    count?: number;
    /** What to call it, when {@link layerLabel} is not what this surface says. */
    label?: React$1.ReactNode;
    /**
     * The layer is closed, empty or out of view: the swatch drops to the muted
     * token and the label goes with it. The chip stays legible — this is *not
     * in play*, never *not there*.
     */
    dim?: boolean;
    /**
     * This chip's swatch class, given directly — `bg-data-7`, `bg-violet-500`.
     * The shortest path when a call site draws one chip and knows its layer.
     * Wins over {@link LayerChipProps.palette}.
     */
    swatch?: string;
    /**
     * What the layers are painted with, when a caller draws several and would
     * rather state the map once. Only this chip's own layer is read.
     */
    palette?: LayerPalette;
}
/**
 * One class of participant, as a swatch and a name.
 *
 * It heads a `LayerSection`, bands a run's `LayerStrip`, and counts a layer in
 * the Worlds drawer — everywhere a reader has to know *what kind of thing this
 * is* before reading which one.
 *
 * **The name is always there.** Six hues cannot be told apart reliably and a
 * colour-blind reader gets nothing from any of them: the swatch speeds up
 * scanning a list you can already read, and carries nothing on its own.
 *
 * Deliberately not a `Badge` and deliberately not `BoundChip`. A badge carries
 * *state* from the status palette; a bound is what a callable may **spend**; a
 * layer is what a participant **is**. The two chips co-occur on the agent
 * boards, which is why they never share a hue.
 */
declare const LayerChip: React$1.ForwardRefExoticComponent<LayerChipProps & React$1.RefAttributes<HTMLSpanElement>>;

/** The four roles a plan may name. Fixed — `tier` would not survive a re-cast. */
type CastRole = "extract" | "decide" | "judge" | "embed";
/**
 * One thing a lens does to the world it is read against.
 *
 * A closed set, because the drawer's job is *what does this narrow* answered at
 * a glance, and a free-text summary is a sentence each caller writes
 * differently. Empty means the lens narrows nothing — which is a real state and
 * the row says so in words, never with a blank.
 */
type Narrowing = {
    kind: "allow";
    count: number;
} | {
    kind: "deny";
    count: number;
} | {
    kind: "sliced";
} | {
    kind: "excludes";
    properties: string[];
} | {
    kind: "closes";
    layers: Layer[];
} | {
    kind: "casts";
    roles: CastRole[];
};
interface LensUsage {
    /** How many runs opened under this lens. `0` is printed, not hidden. */
    runs: number;
    /** Already humanised — `2h ago`. The row does not own a clock. */
    lastUsed?: string;
}
interface LensRowProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
    name: string;
    narrows?: Narrowing[];
    usage?: LensUsage;
    selected?: boolean;
    onSelect?: (name: string) => void;
    /**
     * What the layers of a `closes` narrowing are painted with. Omitted, those
     * chips draw in the neutral.
     */
    palette?: LayerPalette;
}
/**
 * One world in the Worlds drawer: its name, what it narrows, and how used it is.
 *
 * **What it narrows is chips, not prose.** A world is picked by comparing it
 * with the four above it, and four sentences do not compare — six fixed kinds
 * of narrowing do. `closes` renders its layers as `LayerChip`s because *which*
 * layer is closed is the part being compared.
 *
 * **A world that narrows nothing says so in words.** `Everything` is a real
 * world and the default one; a blank row would read as a world whose summary
 * failed to load, which is the opposite of the reassurance it is there to give.
 *
 * **Usage is a fact, not a ranking.** `used in 34 runs · last 2h ago` tells a
 * reader whether they are about to edit something live. It never sorts the list
 * — a world used once may be the one that matters, and a list that reorders
 * itself under you cannot be scanned twice.
 */
declare const LensRow: React$1.ForwardRefExoticComponent<LensRowProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * The four roles, in the order a run spends them. Fixed, and **always all four**
 * — see the note on the component.
 */
declare const CAST_ROLES: CastRole[];
/** Where a resolved address came from. Innermost wins. */
type CastSource = "todo" | "plan" | "agent" | "shipped";
interface CastResolution {
    role: CastRole;
    /** `null` when nothing casts the role and no shipped default resolves it. */
    address: string | null;
    allowed: boolean;
    /** The rule that denied it, when one did — so a refusal names its bound. */
    ruleMatched?: string | null;
    source?: CastSource;
}
interface CastTableProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** What the lens itself casts: role → model address. Partial is normal. */
    cast?: Partial<Record<CastRole, string>>;
    /**
     * The same four roles after resolution — innermost wins, then checked against
     * the effective rules. Absent leaves the table read as *what this lens says*
     * rather than *what a run would get*.
     */
    resolved?: CastResolution[];
    readOnly?: boolean;
}
/**
 * `role → resolves to → why this one`, four fixed rows.
 *
 * A plan names a **role**, not a model: `decide` says *how much this matters*,
 * which stays true when the line-up moves, in a way `tier` and a hard-coded
 * model id do not. The cast is what turns the role into an address.
 *
 * **All four rows, always — including the ones nothing casts.** A table that
 * showed only what was set would make *nothing casts `judge`* invisible, and
 * that is precisely the state worth seeing before a run opens: it is the one
 * that falls to a shipped default, which may name a model this Graph is not
 * credentialed for.
 *
 * **The cast is not a bound.** It picks *within* the rules and never widens
 * them: innermost wins, and the resolved address is then checked against the
 * effective rules and refused by name if denied. That is why a denied row names
 * the rule rather than just going red — the recourse is to edit that rule, and
 * the reader has to know which.
 */
declare const CastTable: React$1.ForwardRefExoticComponent<CastTableProps & React$1.RefAttributes<HTMLDivElement>>;

interface ChatSessionProps {
    /** The message list — typically `<ChatSessionMessage />` nodes. */
    children?: React$1.ReactNode;
    /** Fixed content below the scroll area (typically a `<ChatSessionComposer />`). */
    footer?: React$1.ReactNode;
    /** Rendered inside the scroll area when there are no messages. */
    emptyState?: React$1.ReactNode;
    /** Bump to force a jump to the latest message — e.g. when a new turn is
     *  appended. In-place growth (a reply resolving from "Thinking…" to its full
     *  body) is followed automatically and needs no key change. */
    autoScrollKey?: React$1.Key | null;
    /** How close to the bottom (px) still counts as "following". Scroll further up
     *  than this and new content stops yanking the view down. Defaults to 80. */
    followThreshold?: number;
    className?: string;
    /** Classes for the inner message column (padding, gap overrides). */
    bodyClassName?: string;
}
/**
 * The chat thread view: a scrollable stack of messages that sticks to the
 * latest, plus a fixed `footer` (the composer). Fills its parent's height, so
 * drop it into any sized container — panel chrome (header, breadcrumb, close)
 * is a separate concern the host provides.
 *
 * Auto-follow keeps the newest reply in view even as it grows in place (a
 * ResizeObserver watches the message column), but only while the user is already
 * near the bottom — scroll up to read history and the view stays put. Layout and
 * scroll behaviour only; it owns no session state.
 */
declare function ChatSession({ children, footer, emptyState, autoScrollKey, followThreshold, className, bodyClassName, }: ChatSessionProps): React$1.JSX.Element;

type ChatSessionMessageRole = "user" | "assistant";
/**
 * Lifecycle of an assistant message. `running` shows the bouncing dots,
 * `stopped` renders a muted italic note (user-aborted), `error` tints the body
 * with the destructive colour. `idle` is a settled reply.
 */
type ChatSessionMessageStatus = "idle" | "running" | "error" | "stopped";
interface ChatSessionMessageProps {
    /** "user" renders a right-aligned bubble; "assistant" a left-aligned block. */
    role: ChatSessionMessageRole;
    /** Message body. Plain text wraps and preserves newlines; nodes render as-is. */
    children?: React$1.ReactNode;
    /** Assistant lifecycle — ignored for user messages. Defaults to "idle". */
    status?: ChatSessionMessageStatus;
    /** Leading icon slot — e.g. a canvas-operation glyph on a user bubble, or an
     *  avatar on an assistant reply. Icon-agnostic: pass your own node. */
    icon?: React$1.ReactNode;
    /** Meta line under the body — e.g. "Cypher · 50 rows · 12ms". */
    meta?: React$1.ReactNode;
    /** Action row, typically a `<ChatSessionMessageOptions />`. Assistant only by
     *  convention; rendered between the body and the meta line. */
    actions?: React$1.ReactNode;
    /** Extra content below the meta line — a query disclosure, a result block, etc. */
    footer?: React$1.ReactNode;
    className?: string;
}
/**
 * A single turn in a {@link ChatSession}. User turns are right-aligned bubbles;
 * assistant turns are left-aligned blocks that can carry a meta line, an action
 * row ({@link ChatSessionMessageOptions}), and arbitrary footer content
 * (query disclosure, result preview, …).
 *
 * Presentational only — no data fetching or state — so it composes over any
 * backend.
 */
declare function ChatSessionMessage({ role, children, status, icon, meta, actions, footer, className, }: ChatSessionMessageProps): React$1.JSX.Element;

/**
 * A single action in a message's option row. The library is icon-agnostic — pass
 * your own icon node (e.g. `<RotateCw className="w-3 h-3" />`), so no icon
 * dependency is baked into `@invana/ui`.
 */
interface ChatSessionMessageAction {
    /** Icon node rendered inside the button. */
    icon: React$1.ReactNode;
    /** Accessible label, also used as the hover tooltip. */
    label: string;
    onClick?: () => void;
    /** Highlight the button — e.g. an active 👍/👎 vote. */
    active?: boolean;
    /** Extra classes when `active` (or always), for custom accents like green/red votes. */
    activeClassName?: string;
    /** Which group the action sits in: "start" (left) or "end" (right). Defaults to "start". */
    align?: "start" | "end";
    disabled?: boolean;
    className?: string;
}
interface ChatSessionMessageOptionsProps {
    /** Actions rendered as icon buttons, grouped by their `align`. */
    actions: ChatSessionMessageAction[];
    className?: string;
}
/**
 * The action toolbar shown under an assistant message — re-run, view query,
 * copy, context, and 👍/👎 in the reference design. Start-aligned actions sit on
 * the left; end-aligned actions (typically feedback votes) float to the right.
 *
 * Purely presentational and icon-agnostic: you supply the icons and handlers, so
 * it slots into any backend.
 */
declare function ChatSessionMessageOptions({ actions, className, }: ChatSessionMessageOptionsProps): React$1.JSX.Element;

interface ChatSessionComposerProps {
    /** Controlled input value. */
    value: string;
    onChange: (value: string) => void;
    /** Fired on the send button and on Enter (Shift+Enter inserts a newline). */
    onSend: () => void;
    /** Fired on the stop button, shown in place of send while `isRunning`. */
    onStop?: () => void;
    /** Swaps send → stop and keeps Enter from re-submitting mid-run. */
    isRunning?: boolean;
    /** Disables the textarea and send button. */
    disabled?: boolean;
    placeholder?: string;
    /** Left-aligned toolbar slot — mode/model selects, etc. Grows to fill and truncates. */
    toolbarStart?: React$1.ReactNode;
    /** Toolbar slot between the start controls and the send button — timeout, attach, … */
    toolbarEnd?: React$1.ReactNode;
    /** Chips row above the input (attachments). Border-separated when present. */
    attachments?: React$1.ReactNode;
    /** Send button icon — icon-agnostic, pass your own (e.g. `<ArrowUp />`). */
    sendIcon?: React$1.ReactNode;
    /** Stop button icon, shown while running (e.g. `<Square />`). */
    stopIcon?: React$1.ReactNode;
    /** Override the send button's disabled state. Defaults to disabled when the
     *  input is empty (or the composer is `disabled`). */
    sendDisabled?: boolean;
    className?: string;
    textareaClassName?: string;
}
/**
 * The chat-style bottom bar: a bordered card with a growable textarea on top and
 * a toolbar (start slot / end slot / send-or-stop) underneath. Enter submits,
 * Shift+Enter inserts a newline.
 *
 * Deliberately dependency-free — no query-language editor or provider selects
 * are baked in. Drop your own controls into `toolbarStart` / `toolbarEnd` (and
 * a QL editor into a custom layout if you need one).
 */
declare function ChatSessionComposer({ value, onChange, onSend, onStop, isRunning, disabled, placeholder, toolbarStart, toolbarEnd, attachments, sendIcon, stopIcon, sendDisabled, className, textareaClassName, }: ChatSessionComposerProps): React$1.JSX.Element;

/**
 * Shared gutter column for the console-style transcript. Every leading glyph —
 * status dot, prompt caret, spinner — occupies this fixed-width column so all
 * body text starts on one left edge ({@link ChatSessionPromptRow},
 * {@link ChatSessionProgressLine} and this row all use it).
 */
declare const chatSessionGutterClass = "w-3.5 shrink-0 flex justify-center";
/**
 * Semantic state of an activity row, mapped to the status tokens from
 * `@invana/styling`. `pending` renders a hollow dot (queued / not started).
 */
type ChatSessionActivityStatus = "default" | "info" | "success" | "warning" | "error" | "pending";
interface ChatSessionActivityRowProps {
    /** Colors the gutter marker; `warning`/`error` also tint the body text. */
    status?: ChatSessionActivityStatus;
    /** Replaces the status dot with a custom gutter node (e.g. a spinner). */
    marker?: React$1.ReactNode;
    /** Row body. Plain text wraps and preserves newlines; nodes render as-is. */
    children?: React$1.ReactNode;
    /** Action row, typically a `<ChatSessionMessageOptions />`. */
    actions?: React$1.ReactNode;
    /** Meta line under the body — e.g. "Cypher · 50 rows · 12ms". */
    meta?: React$1.ReactNode;
    /** Extra content below — sub-lines, a `<ChatSessionDisclosure />`, results. */
    footer?: React$1.ReactNode;
    className?: string;
}
/**
 * One event in a console-style transcript: a status-colored dot in the shared
 * gutter and a left-aligned body. Assistant text, tool calls, spawned agents,
 * and errors all render as activity rows — one visual grammar for everything
 * the system does. Nest `<ChatSessionActivitySubLine />` in `footer` for the
 * elbow-prefixed detail lines, and drop `<ChatSessionMessageOptions />` into
 * `actions` for the re-run / view-query / copy / vote toolbar.
 *
 * Presentational only — no data fetching or state.
 */
declare function ChatSessionActivityRow({ status, marker, children, actions, meta, footer, className, }: ChatSessionActivityRowProps): React$1.JSX.Element;
interface ChatSessionActivitySubLineProps {
    /** Elbow glyph in front of the line. Defaults to "└". */
    elbow?: React$1.ReactNode;
    children?: React$1.ReactNode;
    className?: string;
}
/**
 * An indented detail line under an activity row — "└ Backgrounded agent
 * (↓ to manage)", an interruption note, a one-line result. Render inside the
 * row's `footer` (or directly after the body in `children`).
 */
declare function ChatSessionActivitySubLine({ elbow, children, className, }: ChatSessionActivitySubLineProps): React$1.JSX.Element;

interface ChatSessionPromptRowProps {
    /** The echoed user input. Plain text wraps and preserves newlines. */
    children?: React$1.ReactNode;
    /** Gutter glyph. Defaults to "❯". */
    caret?: React$1.ReactNode;
    /** Right-aligned meta — a timestamp, an attachment count. */
    meta?: React$1.ReactNode;
    className?: string;
}
/**
 * The user's turn in a console-style transcript: a full-bleed highlighted band
 * with the caret in the shared gutter, so the echoed text sits on exactly the
 * same left edge as the {@link ChatSessionActivityRow} bodies below it.
 *
 * Full bleed assumes the default `ChatSession` body padding (`p-3`) — the
 * negative margins here cancel it. If you override `bodyClassName` with a
 * different horizontal padding, pass matching `-mx-*`/`px-*` via `className`.
 */
declare function ChatSessionPromptRow({ children, caret, meta, className, }: ChatSessionPromptRowProps): React$1.JSX.Element;

interface ChatSessionProgressLineProps {
    /** What's happening — "Waiting for 1 background agent to finish". */
    children?: React$1.ReactNode;
    /** Custom spinner node in the gutter; defaults to a CSS ring spinner. */
    spinner?: React$1.ReactNode;
    /** Right-aligned elapsed/progress readout — "29s", "12k tokens". */
    elapsed?: React$1.ReactNode;
    className?: string;
}
/**
 * A transient "work in flight" line in the transcript — spinner in the shared
 * gutter, label, and an optional right-aligned elapsed readout. Replace it with
 * a settled {@link ChatSessionActivityRow} when the run finishes.
 */
declare function ChatSessionProgressLine({ children, spinner, elapsed, className, }: ChatSessionProgressLineProps): React$1.JSX.Element;

interface ChatSessionDisclosureProps {
    /** Header label — "cypher", "result", "context". */
    label: React$1.ReactNode;
    /** Right-aligned header meta — "50 rows · 12ms". */
    meta?: React$1.ReactNode;
    /** Disclosed content. Wrapped in an `overflow-x-auto` container. */
    children?: React$1.ReactNode;
    /** Controlled open state. Omit for uncontrolled (see `defaultOpen`). */
    open?: boolean;
    /** Uncontrolled initial state. Defaults to closed. */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Custom chevron node; the default "▸" rotates when open. */
    chevron?: React$1.ReactNode;
    className?: string;
    /** Classes for the content area — e.g. `font-mono` for a query block. */
    contentClassName?: string;
}
/**
 * A collapsible detail block under an activity row — the expanded state of
 * "View query": generated Cypher, a result preview, gathered context. Renders
 * as a bordered card with a click-to-toggle header (label + meta) and an
 * `overflow-x-auto` body, matching the transcript's nested-detail grammar.
 *
 * Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
 */
declare function ChatSessionDisclosure({ label, meta, children, open, defaultOpen, onOpenChange, chevron, className, contentClassName, }: ChatSessionDisclosureProps): React$1.JSX.Element;

/**
 * Lifecycle of a background task / session. Mapped to the status tokens from
 * `@invana/styling`: `running` pulses the primary dot, `needs-input` is the
 * warning color, `queued` renders hollow.
 */
type ChatSessionTaskStatus = "running" | "needs-input" | "success" | "error" | "queued";
interface ChatSessionTaskRowProps {
    /** Colors the leading dot. */
    status?: ChatSessionTaskStatus;
    /** Replaces the status dot — e.g. a spinner node for a running task. */
    indicator?: React$1.ReactNode;
    /** Task/agent name, kept bold and never truncated. */
    name: React$1.ReactNode;
    /** One-line summary; truncates with ellipsis. */
    description?: React$1.ReactNode;
    /** Right-aligned meta — "2s · ↑ 18.4k tokens", "38d". */
    meta?: React$1.ReactNode;
    /** Makes the row an interactive button (hover surface, focus ring). */
    onClick?: () => void;
    className?: string;
}
/**
 * One background task / agent / session: status dot, bold name, truncating
 * description, right-aligned meta. Used both in the pinned strip under a
 * transcript and in the grouped task dashboard ({@link ChatSessionTaskGroup}).
 */
declare function ChatSessionTaskRow({ status, indicator, name, description, meta, onClick, className, }: ChatSessionTaskRowProps): React$1.JSX.Element;
interface ChatSessionTaskGroupProps {
    /** Section heading — "Needs input", "Completed", "Running". */
    heading?: React$1.ReactNode;
    /** The rows — typically `<ChatSessionTaskRow />` nodes. */
    children?: React$1.ReactNode;
    className?: string;
}
/**
 * A titled section of task rows — the "Needs input" / "Completed" groups of a
 * session dashboard.
 */
declare function ChatSessionTaskGroup({ heading, children, className, }: ChatSessionTaskGroupProps): React$1.JSX.Element;

interface ChatSessionStatusBarProps {
    /** Left-aligned items — mode indicator, view switch. Grows and truncates. */
    start?: React$1.ReactNode;
    /** Right-aligned items — agent count, shortcut hints. */
    end?: React$1.ReactNode;
    className?: string;
}
/**
 * The slim bar under a chat session's composer — mode indicator, view
 * switches, agent counts, keyboard hints. Two slots, muted by default; put
 * interactive elements (buttons, toggles) straight into the slots.
 */
declare function ChatSessionStatusBar({ start, end, className, }: ChatSessionStatusBarProps): React$1.JSX.Element;

interface ChatSessionContextChipProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** A small icon for what is bound — a node, a dataset, a task. */
    icon?: React$1.ReactNode;
    /** What the question will be about — `Asking about obs_20260908_bpcl_01`. */
    children?: React$1.ReactNode;
    /** Unbinds it. Omit to make the binding fixed. */
    onDismiss?: () => void;
    dismissLabel?: string;
}
/**
 * What the next question is about, shown above the composer.
 *
 * Selecting something on a canvas binds it here, so the thing you are looking
 * at is the thing you are asking about — that is the whole point of the chip.
 * It fills `ChatSessionComposer`'s `attachments` slot rather than living inside
 * the composer, because what is bound is the surface's business, not the
 * composer's.
 *
 * It states the binding in words. A highlight on the canvas alone would leave
 * the reader guessing what scope their question has.
 */
declare function ChatSessionContextChip({ icon, onDismiss, dismissLabel, className, children, ...props }: ChatSessionContextChipProps): React$1.JSX.Element;

interface CitationRowProps extends Omit<React$1.HTMLAttributes<HTMLLIElement>, "children"> {
    /** What kind of record this is — `Article`, `Bar`, `Event`. */
    kind: React$1.ReactNode;
    /** The record itself, in the words it was stored with. */
    children?: React$1.ReactNode;
    /** Where it came from — the dataset, the publisher, the timestamp. */
    source?: React$1.ReactNode;
}
interface CitationListProps extends React$1.HTMLAttributes<HTMLUListElement> {
    children?: React$1.ReactNode;
}
/**
 * The records an answer rests on.
 *
 * Every claim in this system is traceable to records, and this is where that
 * trace is read. A row names the **kind** first because that is what tells the
 * reader whether the claim is grounded in the right sort of evidence — a
 * recommendation citing three Articles and no Bar is a different thing from one
 * citing both.
 *
 * `source` is not optional in spirit: a citation you cannot locate is not a
 * citation. An absent one should mean the record has no source, not that the
 * caller could not be bothered.
 */
declare const CitationList: React$1.ForwardRefExoticComponent<CitationListProps & React$1.RefAttributes<HTMLUListElement>>;
declare const CitationRow: React$1.ForwardRefExoticComponent<CitationRowProps & React$1.RefAttributes<HTMLLIElement>>;

interface ClampedTextProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** How many lines survive before the fold. Three is the panel default. */
    lines?: number;
    moreLabel?: string;
    lessLabel?: string;
    children?: React$1.ReactNode;
}
/**
 * Prose that shows its first few lines and offers the rest.
 *
 * A project's purpose, an agent's instructions, a dataset's note: text whose
 * *first sentence* is what a panel is for, and whose full length would push the
 * list under it off the screen. It clamps to `lines`, and reveals the rest in
 * place — never in a tooltip or a dialog, because the reader is already looking
 * at the right place.
 *
 * **The toggle only exists when there is something behind it.** The clamp is
 * measured, not guessed from a character count: a three-line paragraph in a
 * wide panel is one line in a wider one, and a `Show more` that reveals nothing
 * teaches the reader to stop pressing it. Re-measured on resize for the same
 * reason.
 */
declare const ClampedText: React$1.ForwardRefExoticComponent<ClampedTextProps & React$1.RefAttributes<HTMLDivElement>>;

interface ClarifyOption {
    /** Stable id handed back to `onSelect`. */
    value: string;
    /** The choice, in the user's terms — `Theme velocity, 5 sessions`. */
    label: React$1.ReactNode;
    /**
     * Where the choice comes from in the model — `Theme.velocity_5d · 14 themes`.
     *
     * This is what makes the question answerable rather than a guess: the reader
     * can see that each option is a measure the graph actually holds.
     */
    detail?: React$1.ReactNode;
    disabled?: boolean;
}
interface ClarifyCardProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    /** Which step asked — `understand`. */
    step?: React$1.ReactNode;
    /** How long it has been waiting — `parked 14 min`. */
    waiting?: React$1.ReactNode;
    /** The question. One sentence. */
    question: React$1.ReactNode;
    options: ClarifyOption[];
    value?: string;
    onSelect?: (value: string) => void;
    /** The confirm control. */
    actions?: React$1.ReactNode;
    /** Why these options and not others. */
    footnote?: React$1.ReactNode;
}
/**
 * The run stopped and asked, rather than guessing.
 *
 * A thinking that cannot tell which of two measures was meant parks and asks —
 * parked, not failed. Answering resumes *that* thinking rather than starting a
 * new one, which is why this renders inline in the thread and not as a modal:
 * the question belongs to the run above it.
 *
 * **Options are declared, never generated.** Each one names a measure the model
 * holds, which is why `detail` exists and why `footnote` is worth saying out
 * loud. A card that offered invented options would undo the grounding the rest
 * of the system is built on.
 */
declare const ClarifyCard: React$1.ForwardRefExoticComponent<ClarifyCardProps & React$1.RefAttributes<HTMLDivElement>>;

interface ContextBarProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /**
     * What this surface is showing — usually tabs, or a tab-shaped set of views.
     * Sits first because it is the only thing here that changes what you see.
     */
    children?: React$1.ReactNode;
    /**
     * Counts and states about the current view — `1 running`, `2 in review`.
     * Facts, never controls: nothing here should be clickable.
     */
    counters?: React$1.ReactNode;
    /** The keyboard route out — `⌘↵ accept`, `⌘N new task`. */
    hint?: React$1.ReactNode;
}
/**
 * The 28px bar between a panel and the status bar.
 *
 * It answers "where am I, and what is true right now" — the view switch, the
 * counts that matter for the work in front of you, and the shortcut that
 * finishes it.
 *
 * Distinct from `AppStatusBar` below it: this describes the *surface* you are
 * on and changes as you move around; the status bar describes the *session* and
 * barely changes at all. Two bars because they answer different questions —
 * merging them would make a stable line flicker with navigation.
 */
declare const ContextBar: React$1.ForwardRefExoticComponent<ContextBarProps & React$1.RefAttributes<HTMLDivElement>>;

interface DiagnosisCardProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Where it broke and how — `execute · connection_refused`. Shown in mono. */
    code: React$1.ReactNode;
    /** One sentence a person can act on. Not a stack trace. */
    children?: React$1.ReactNode;
    /** The query, command or request that was attempted. Mono, wraps. */
    attempted?: React$1.ReactNode;
    /** What it ran against, and how hard — `bolt://…:7687 · 2 attempts · 4.1s`. */
    target?: React$1.ReactNode;
    /** `Open the trace`, `Retry`. */
    actions?: React$1.ReactNode;
}
/**
 * Something broke, and it is named.
 *
 * One of the four run outcomes, and its own component (DS8) — a failure must
 * never be one prop away from an answer.
 *
 * Built from evidence: what was tried, against what, how many times. It carries
 * its next step, and nothing partial is dressed up as a result — which is why
 * there is no slot here for "the rows we did get".
 */
declare const DiagnosisCard: React$1.ForwardRefExoticComponent<DiagnosisCardProps & React$1.RefAttributes<HTMLDivElement>>;

type KnownDiffOp = "add" | "remove" | "change";
/**
 * The values the kit draws specially — **suggestions, not a limit.** Anything
 * else renders with the neutral token and its own name.
 */
type DiffOp = KnownDiffOp | (string & {});
interface DiffRowProps extends Omit<React$1.HTMLAttributes<HTMLLIElement>, "children"> {
    op?: DiffOp;
    /** What kind of thing changed — `node`, `edge`, `property`. */
    kind?: React$1.ReactNode;
    children?: React$1.ReactNode;
}
interface DiffListProps extends React$1.HTMLAttributes<HTMLUListElement> {
    children?: React$1.ReactNode;
}
/**
 * What a change would do, before it is committed.
 *
 * Staged model edits, a schedule's firing diff against the previous run, a
 * proposal's additions. It is a *preview*, which is why the sign is spelled out
 * per row rather than implied by colour alone — a reader who cannot separate
 * red from green still has to be able to tell an addition from a removal before
 * approving it.
 */
declare const DiffList: React$1.ForwardRefExoticComponent<DiffListProps & React$1.RefAttributes<HTMLUListElement>>;
declare const DiffRow: React$1.ForwardRefExoticComponent<DiffRowProps & React$1.RefAttributes<HTMLLIElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface DivergingDatum {
    label: React$1.ReactNode;
    /** Signed. The sign is the whole point of this chart. */
    value: number;
    display?: React$1.ReactNode;
}
interface DivergingBarProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    data: DivergingDatum[];
    /** Fixes the scale on both sides. Defaults to the largest magnitude present. */
    max?: number;
    labelWidth?: number;
    /** Above the midpoint. Defaults to `--color-success`. */
    positiveColor?: string;
    /** Below it. Defaults to `--color-destructive`. */
    negativeColor?: string;
    caption?: React$1.ReactNode;
}
/**
 * Polarity — how far either side of zero.
 *
 * A net learning weight, a delta against a baseline, a sentiment score. The
 * midpoint is a real zero line, drawn in the neutral border colour, and both
 * sides share one scale so a `−9` is visibly longer than a `+6`.
 *
 * The poles use the **status** colours rather than data-palette hues, because
 * this chart's two directions are good and bad, not two categories. That is the
 * one place status colour belongs on a chart — it is encoding valence, not
 * identity, so it is never "series 1 and series 2". Every bar is directly
 * labelled, so the sign is readable without seeing colour at all.
 */
declare const DivergingBar: React$1.ForwardRefExoticComponent<DivergingBarProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * What of the Graph's data may accompany a call across the boundary.
 *
 * A **closed** set, because an open one is a list nobody can audit: a reader
 * has to know that what is not named cannot be sent, and that only holds if the
 * vocabulary is fixed.
 */
type EgressClass = "type_names" | "property_names" | "the_question" | "property_values" | "record_ids" | "aggregates" | "everything";
interface EgressListProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** The destination this governs — `llm/anthropic-prod/claude-opus-5`. */
    to: string;
    /** What may be sent. **Empty is the default and means nothing may.** */
    classes?: EgressClass[];
    /**
     * What was actually withheld on a real crossing. Absent reads as a **rule**
     * at rest; present reads as an **event** — see the note below.
     */
    cut?: EgressClass[];
}
/**
 * Per destination: what may be sent, and what was cut.
 *
 * **Egress is declared per destination, on the rule that matched it.** A
 * run-wide setting would have to be the strictest of its destinations, which is
 * the least useful one — so this component is always about *one* address, and a
 * surface showing several renders several.
 *
 * **Reading a thing and sending it are different permissions.** A query may
 * filter on `Deal.revenue` while the value never enters a prompt — used to
 * **compute**, not to **reason**. That is the distinction this list exists to
 * make visible, and it is why `property_values` being absent is worth as much
 * screen as the classes that are present.
 *
 * **`cut` is what makes it evidence rather than configuration.** The same
 * component states the bound before a run and what the bound actually withheld
 * after one; without `cut`, a reader cannot tell a rule that did work from a
 * rule that never bit.
 *
 * An empty `classes` is drawn in words, because the lens default is `[]` and a
 * blank row would read as *not configured* rather than *nothing may leave*.
 */
declare const EgressList: React$1.ForwardRefExoticComponent<EgressListProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * How an answer's records are rendered. A kind is a *body inside* the emission
 * card, never a block of its own (DS9) — so this names the body, it does not
 * pick a different container.
 */
type EmissionKind = "metric" | "table" | "chart" | "subgraph" | "prose" | "empty" | "html";
interface EmissionHeaderProps extends React$1.HTMLAttributes<HTMLDivElement> {
    kind: EmissionKind;
    /** The projection template that rendered it — `table-compact@3`. Shown in mono. */
    template?: React$1.ReactNode;
    /**
     * What the answer is grounded in — `cite · 214 records`.
     *
     * Absent means *not applicable*, not *none*: an emission with nothing to cite
     * says so with `0 records`. A missing strip must never read as an uncited
     * claim.
     */
    citation?: React$1.ReactNode;
    /** A short state word — `in use`, `switched`. */
    note?: React$1.ReactNode;
    /** Trailing controls, usually the template switcher. */
    actions?: React$1.ReactNode;
}
interface EmissionCardProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "title">, Omit<EmissionHeaderProps, keyof React$1.HTMLAttributes<HTMLDivElement>> {
    /** Set false to render the body alone, where a surface supplies its own header. */
    showHeader?: boolean;
    children?: React$1.ReactNode;
}
/**
 * The strip that says what an emission is and what it is grounded in.
 *
 * One component wherever an emission appears — the assistant thread, a task
 * result, a scheduled answer (DS7). It is exported on its own so a surface that
 * already owns its container can still show the same header rather than
 * inventing a second one that drifts.
 */
declare const EmissionHeader: React$1.ForwardRefExoticComponent<EmissionHeaderProps & React$1.RefAttributes<HTMLDivElement>>;
/**
 * One rendered piece of an answer.
 *
 * Every emission renders through this card, whatever its kind (DS9): a metric,
 * a table, a chart, a subgraph, cited prose, an empty result. That is what makes
 * an answer scannable — the reader learns one shape and then only reads the
 * body.
 *
 * The card takes a **kind, a template name and children** — never a domain
 * object (DS6). It does not know what an Observation is, and it does not fetch,
 * re-render or re-query anything; switching templates is the caller's job,
 * handed in through `actions`.
 */
declare const EmissionCard: React$1.ForwardRefExoticComponent<EmissionCardProps & React$1.RefAttributes<HTMLDivElement>>;
/**
 * The `prose` body's citation marker — the superscript that ties a clause to
 * the records behind it.
 */
declare const CitationMarker: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLElement> & React$1.RefAttributes<HTMLElement>>;

interface EmptyStateProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "title"> {
    /** An icon or illustration. Sized by the caller. */
    icon?: React$1.ReactNode;
    /** What is not here — `Nothing loaded yet`. States the fact, not an apology. */
    title: React$1.ReactNode;
    /** The path out of it, in order. */
    description?: React$1.ReactNode;
    /** Live actions the user can take now. */
    actions?: React$1.ReactNode;
    /** What is not available yet, and what unlocks it. See `EmptyStateLock`. */
    locks?: React$1.ReactNode;
}
interface EmptyStateLockProps extends React$1.HTMLAttributes<HTMLSpanElement> {
    icon?: React$1.ReactNode;
    children?: React$1.ReactNode;
}
/**
 * A surface with nothing in it yet.
 *
 * The important half is `locks`. An empty product that only says "nothing here"
 * leaves the user guessing whether they are stuck or simply early; naming the
 * thing that unlocks each surface turns an empty screen into a sequence.
 *
 * Separate from `UnderDevelopment`, which says *we* have not built it. This one
 * says *you* have not filled it — different cause, different next step.
 */
declare const EmptyState: React$1.ForwardRefExoticComponent<EmptyStateProps & React$1.RefAttributes<HTMLDivElement>>;
/** One not-yet-available surface, and the condition that opens it. */
declare const EmptyStateLock: React$1.ForwardRefExoticComponent<EmptyStateLockProps & React$1.RefAttributes<HTMLSpanElement>>;

declare class ErrorBoundary extends Component<{
    children: ReactNode;
}, {
    hasError: boolean;
}> {
    constructor(props: {
        children: ReactNode;
    });
    static getDerivedStateFromError(_: Error): {
        hasError: boolean;
    };
    componentDidCatch(error: Error, errorInfo: any): void;
    render(): string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | React$1.ReactPortal | React$1.ReactElement<unknown, string | React$1.JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | React$1.JSX.Element | null | undefined;
}

interface ExchangeOption {
    label: React$1.ReactNode;
    /** The one that was taken. */
    chosen?: boolean;
}
interface ExchangeRecordProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** Who asked — `the agent asks`. */
    asker?: React$1.ReactNode;
    question: React$1.ReactNode;
    /** Why it had to ask — `parse_intent found two readings and was told not to guess`. */
    why?: React$1.ReactNode;
    /** What it offered. Every option, with the taken one marked. */
    options?: ExchangeOption[];
    /** Who answered — `ravi answers`. */
    answerer?: React$1.ReactNode;
    answer?: React$1.ReactNode;
    /** What the answer cost and what happened next — `after 41.2s · the run resumed on round 2`. */
    answerNote?: React$1.ReactNode;
}
/**
 * A question a run asked a person, after it was answered.
 *
 * `ClarifyCard` is the **live** ask — it has controls, and the run is waiting on
 * them. This is the same exchange once it is a record: the question, every
 * option it offered with the one taken marked, who answered and how long the
 * run stood still. Nothing here is pickable, because the choice was made and a
 * trace is never rewritten.
 *
 * **The options that were not taken stay.** *It chose by promise date* is a
 * different fact from *it was offered two readings and chose by promise date* —
 * the second is the one that explains the round that follows.
 *
 * The rails mark the **act**, not the participant: asking is an interruption,
 * answering is what let the run continue. Which colour means `human` is a
 * palette decision and belongs to the layer components.
 */
declare const ExchangeRecord: React$1.ForwardRefExoticComponent<ExchangeRecordProps & React$1.RefAttributes<HTMLDivElement>>;

interface EyebrowProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /**
     * Right-aligned trailing text — a count, a position, a state. Kept separate
     * from `children` so the label stays left and the fact stays right without
     * every call site building its own flex row.
     */
    aside?: React$1.ReactNode;
    /**
     * `muted` (default) for a label being scanned past, `foreground` when it
     * titles a card that has no other heading, `accent` when it names something
     * the reader is being taught.
     */
    tone?: "muted" | "foreground" | "accent";
    children?: React$1.ReactNode;
}
/**
 * The smallest heading in the system: a label over the thing it names.
 *
 * `WHY IT MATTERS`, `1 · CONNECTED`, `OPTIONAL`, `REFERENCED COMPONENTS`. It
 * titles a band of content without the weight — or the 35px and the rule — of
 * a {@link SectionHeader}, so several can sit in one scrolling column and still
 * read as subordinate to the panel's own title.
 *
 * Uppercase at `text-sm` with tracking, because at this size caps are what
 * separate a label from the sentence under it; lowercase at 11px reads as body
 * copy set small. That is also why it is a component rather than four utility
 * classes: the treatment was being retyped, and a label that drifts a weight or
 * a tracking step in one panel stops reading as the same kind of thing.
 *
 * `tone="accent"` is for a label that names something the reader is being
 * *taught* rather than something they are scanning — a callout's kind, a
 * concept's name. Use it rarely; muted is the default for a reason.
 */
declare const Eyebrow: React$1.ForwardRefExoticComponent<EyebrowProps & React$1.RefAttributes<HTMLDivElement>>;

interface FilterBarProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** The filter controls. `FilterChip`s, a `SearchInput`, a toggle. */
    children?: React$1.ReactNode;
    /**
     * What the filters left behind — `8 datasets`, `6 tasks`, `7 waiting`.
     *
     * Sits after a spacer, hard right. It is the answer to the question the
     * filters ask, so it belongs on the same line as them and nowhere else.
     */
    summary?: React$1.ReactNode;
}
interface FilterChipProps extends Omit<React$1.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
    /** The dimension — `status`, `kind`, `agent`, `age`. */
    label: React$1.ReactNode;
    /** What it is narrowed to. Absent means "not filtered". */
    value?: React$1.ReactNode;
    /** Marks the chip as narrowing the list, so an active filter is visible while scrolling. */
    active?: boolean;
    /**
     * Clear this one filter, without opening its menu.
     *
     * Only for a chip that **is** set: an unset chip has nothing to clear, and an
     * × on it would offer to undo something nobody did. With it, the chip is a
     * pair of controls rather than one — the label opens the picker, the × drops
     * the value — so both are reachable by keyboard and the × carries its own
     * name.
     */
    onRemove?: () => void;
    /** What the × is called, for a screen reader. Defaults to `Clear <label>`. */
    removeLabel?: string;
}
/**
 * The row above a list that narrows it.
 *
 * Every list surface in the system has one: the roster, datasets, tasks,
 * schedules, workflows, the review queue. It is a `<Toolbar>`-shaped thing but
 * kept separate — a toolbar holds actions that *do* something, this holds
 * controls that *hide* rows, and mixing them costs the reader the guarantee
 * that nothing here changes their data.
 */
declare const FilterBar: React$1.ForwardRefExoticComponent<FilterBarProps & React$1.RefAttributes<HTMLDivElement>>;
/**
 * One dimension, as a chip that opens a menu.
 *
 * The caret is drawn rather than iconised so the chip stays 22px and reads as
 * one token — `status ▾` — instead of a control with an icon glued to it.
 */
declare const FilterChip: React$1.ForwardRefExoticComponent<FilterChipProps & React$1.RefAttributes<HTMLButtonElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface HeatCell {
    /** When this cell is — `09:45`. Used in the hover title. */
    at: React$1.ReactNode;
    /** Which state key this cell is in. Must exist in `states`. */
    state: string;
    /** Extra detail for the hover title — `2 names: BPCL, HINDPETRO`. */
    detail?: React$1.ReactNode;
}
interface HeatState {
    key: string;
    /** What the state is called. Shown in the legend and the hover title. */
    label: React$1.ReactNode;
    color?: string;
    /** Renders as a ring rather than a fill — for "nothing happened here". */
    hollow?: boolean;
}
interface HeatStripProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    cells: HeatCell[];
    states: HeatState[];
    /** Axis ticks under the strip — `[{at: 0, label: '09'}, …]`. */
    ticks?: {
        at: number;
        label: React$1.ReactNode;
    }[];
    cellSize?: number;
}
/**
 * A run of firings, one square each, in time order.
 *
 * A schedule's day: twenty-one firings, most served, one skipped, one that could
 * not answer. The shape of the day is the point — a reader sees the run of green
 * and the one square that is not, without reading any of them.
 *
 * These are **status** colours, so they are reserved and never stand in for
 * categories. The legend is mandatory rather than optional: a square carries no
 * label of its own, so without the legend the strip would be colour-alone. Each
 * cell also names its state in the hover title, which is what a screen reader
 * and a keyboard user get.
 */
declare const HeatStrip: React$1.ForwardRefExoticComponent<HeatStripProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * The kinds of run Invana opens today — **suggestions, not a limit.**
 *
 * A product that grows a `simulate` kind passes `"simulate"` and the chip draws
 * it. The journal is one list with one filter over it ([SR7]), so the kind is a
 * *column value*, never a panel of its own — and a component that refused an
 * unknown value would make the kit a release blocker for every new one.
 */
type KnownRunKind = "ask" | "import" | "bulk" | "stitch" | "enrich" | "schedule";
/** What a run is, as an identifier — any string at all. See {@link KnownRunKind}. */
type RunKind = KnownRunKind | (string & {});
interface KindChipProps extends Omit<React$1.HTMLAttributes<HTMLSpanElement>, "children"> {
    kind: RunKind;
    /** Not in play — a kind the current filter excludes. */
    dim?: boolean;
}
/**
 * What kind of run this row is: `ask` · `import` · `bulk` · `stitch` · `enrich`.
 *
 * **Neutral on purpose.** A kind is not a status and not a layer: it says which
 * shape of work opened the run, and every kind is equally ordinary. Painting
 * them would put five more hues on a row that already carries a status dot and
 * a layer, and would invite a reader to think `import` is worse than `ask`.
 *
 * Mono, because the value is the engine's own (`kind in (import, bulk)` is a
 * filter a person types), and small, because it sits inside a row that is
 * already carrying an address and a summary.
 */
declare const KindChip: React$1.ForwardRefExoticComponent<KindChipProps & React$1.RefAttributes<HTMLSpanElement>>;

interface LayerSectionProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
    layer: Layer;
    /**
     * What this layer amounts to, in the reader's words — `permitted whole`,
     * `4 of 5 models · sliced`, `closed · nothing but the two below`.
     *
     * **A closed layer says so here.** Closing a layer is what picking four
     * models out of six means, and it is a stated field rather than something
     * inferred from *there is an allow rule in this band* — so the band has to
     * print it, or an auditor reads an allow-list as a list of exceptions.
     */
    summary?: React$1.ReactNode;
    /** The layer's `RuleRow`s. None is a real state — see `summary`. */
    children?: React$1.ReactNode;
    /** How many participants the layer holds, shown on the chip. */
    count?: number;
    /**
     * What the layer is painted with — only this band's own layer is read.
     * Omitted, the chip draws in the neutral.
     */
    palette?: LayerPalette;
    /** The layer is out of view for this lens: the whole band dims. */
    dim?: boolean;
}
/**
 * One layer's band of rules, under the layer's own name and summary.
 *
 * A lens reads as five of these stacked — graph data, llm, third party, cache,
 * human — so *what is shut* is answered by scanning five summary lines rather
 * than by reading every rule. That is the shape the Worlds and Guardrails
 * drawers share, which is why the band is a component and not a heading each
 * screen retypes.
 *
 * **A band with no rules still appears.** An absent layer and a layer with
 * nothing in it are different facts: one is *this Graph has no third parties
 * configured*, the other is *it has them and this lens admits none*. A band
 * that vanished when empty would make the two look alike, and the second is the
 * one worth seeing.
 *
 * The rule is subordinate to the band, so the band's label is a `LayerChip`
 * rather than a heading — the panel's own title is the heading, and five
 * headings under it would compete with it.
 */
declare const LayerSection: React$1.ForwardRefExoticComponent<LayerSectionProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * What an item is doing where it sits — the two tenses in one vocabulary.
 *
 * `declared` is the plan tense: this is what the playbook **will** engage.
 * `out` · `in` · `refused` · `skipped` are the run tense: what it did engage,
 * what a bound stopped, and what it never reached for. Refused and skipped stay
 * two different facts, and both are drawn — a drawing that showed only what
 * happened would answer *what did this run do* and not *what was it stopped
 * from doing*, and the second is the question the strip exists for.
 */
type KnownLayerItemState = "declared" | "out" | "in" | "refused" | "skipped";
/**
 * What an item is doing — **suggestions, not a limit.** A run that grows a
 * `deferred` or a `retried` passes it and the bar draws: the neutral edge, and
 * the state's own name under the label. Only the states above carry special
 * drawing, because only they have a meaning defined here to draw.
 */
type LayerItemState = KnownLayerItemState | (string & {});
/** The run half of {@link LayerItemState}, as the ledger's `direction` column. */
type TouchDirection = Exclude<KnownLayerItemState, "declared"> | (string & {});
/**
 * One participant under a band — the row a task actually lands on.
 *
 * A band says *llm*; a part says **which** llm, or which role a caller may
 * re-cast: `role: decide`, `model/Orders@v2`, `third_party/app/email`. Reading
 * a plan is reading its parts, because that is the list a world is checked
 * against.
 */
interface LayerPart {
    id: string;
    /** The participant address, or the role — `model/Orders@v2`, `role: decide`. */
    label: string;
    /** What the caller still owes, or what the crossing is — `egress: the note`. */
    note?: string;
}
interface LayerBand {
    layer: Layer;
    /** Overrides the layer's own name. */
    label?: React$1.ReactNode;
    /** Right of the name — `declared · 1`, `nothing declared`, `2 roles`. */
    note?: string;
    /** The participants under it, each its own row. */
    parts?: LayerPart[];
    /**
     * This band is the **spine** — the runtime's own dispatches, which the other
     * bands are timed against and which is never governed. Its wire runs the
     * whole axis and it is never drawn as unspent.
     *
     * The band says so rather than the component recognising a layer by name:
     * `agent` is Invana's spine, but the layer vocabulary is a product's to grow
     * and a strip that hard-coded one of its values would be a strip that had to
     * be edited before anyone could rename it.
     */
    spine?: boolean;
}
/**
 * One task, where it sits and how long it takes.
 *
 * `start` and `end` are in the axis's own unit — a step ordinal under `seq`, a
 * millisecond under `elapsed`. A task with no `end` is an instant and is drawn
 * at the minimum width.
 */
interface LayerItem {
    id: string;
    /** The task. This is the only place a task name is written. */
    label: string;
    layer: Layer;
    /** The {@link LayerPart} it lands on. Omitted, it sits on the band itself. */
    part?: string;
    start: number;
    end?: number;
    state?: LayerItemState;
    /** Under the name — `decide`, `${supplier_id}`, `form: human`. */
    note?: string;
    /** The rule that refused it, when one did. */
    ruleMatched?: string;
    /** What this task usually takes — see {@link LayerForecast}. */
    forecast?: LayerForecast;
}
/**
 * What this task usually costs, drawn **on** the bar that says what it cost
 * this time.
 *
 * `p50` is a **duration in the axis's own unit**, not a position: the median is
 * a length of time a step takes, and placing it as an absolute moment would
 * make the same forecast wrong for every run that started the step a second
 * later. The strip turns it into a mark at `start + p50`, so the overrun is the
 * gap between the mark and the bar's end — visible, rather than two numbers a
 * reader has to subtract.
 *
 * Drawn for a task that came in **under** its median too. *Faster than usual*
 * is a finding, and a forecast that only ever showed overruns would be a
 * warning light rather than a comparison.
 */
interface LayerForecast {
    /** The median, as a duration in the axis's unit. */
    p50: number;
    /** The gap in the caller's words — `+11%`, `−33%`, `inside p95`. */
    note?: React$1.ReactNode;
}
/** A bounded repetition over a stretch of the axis — `loop · max 3`. */
interface LayerBracket {
    id: string;
    start: number;
    end: number;
    label: string;
}
/**
 * A **seam** — a moment on the axis where everything stops at once.
 *
 * A gate belongs to no band. It is not dispatched, it holds no slot and it has
 * no participant, so it cannot be a bar: it is a condition on the way into a
 * step, and it stops every layer together. That makes it a **position on the
 * axis**, drawn as a rule the bands are crossed by — which is also the only
 * drawing left once task names stop being the axis, because there are no
 * columns for it to sit between.
 *
 * **Which side of the line the label sits on is the price of saying no.**
 * `before` means nothing has been spent yet; `after` means the work up to here
 * is already paid for. A reader gets what declining costs from where the mark
 * sits, before reading a word of it.
 */
interface LayerSeam {
    id: string;
    /**
     * Where it sits, in the axis's own unit. **Omitted, it has no position** —
     * it can be raised at any dispatch, and it is drawn across the whole axis
     * rather than at a point. Placing such a gate on one moment would be a guess.
     */
    at?: number;
    /** What it is — `approval · before dispatch`, `verdict · after the pass`. */
    label: string;
    /** Which side of the line the cost falls on. Defaults to `before`. */
    edge?: "before" | "after";
    /**
     * It is not on the plan: it resolves at dispatch, so the same plan is gated
     * for one caller and not another. Drawn dashed — *this may appear*.
     */
    conditional?: boolean;
    /**
     * **Nothing can forecast this one.** How long a person takes to say yes is
     * not in the record, so a gate marked this way is drawn dashed like a
     * conditional one and its note carries the actual instead of a comparison.
     *
     * It exists as its own flag rather than as a caller's choice of words because
     * *there is no estimate* and *the estimate was met* must not look alike on a
     * drawing whose whole subject is forecast against actual. Drawing a guess
     * here would be the one dishonest mark on the strip.
     */
    noEstimate?: boolean;
    /** Under the label — `nothing spent · finance-approvers · 4h`. */
    note?: string;
}
/** What the axis counts. */
type LayerScale = "seq" | "elapsed";
interface LayerStripProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
    bands: LayerBand[];
    items: LayerItem[];
    /**
     * `seq` is a plan's time — what happens before what, one unit per step.
     * `elapsed` is a run's, in milliseconds from the run opening.
     */
    scale?: LayerScale;
    /** The axis extent. Defaults to the items' own. */
    domain?: [number, number];
    /** Tick positions in axis units. Defaults to integers (`seq`) or five (`elapsed`). */
    ticks?: number[];
    formatTick?: (value: number) => string;
    brackets?: LayerBracket[];
    /**
     * The gates — the moments the whole drawing stops at. They get a row of their
     * own above the bands *and* a rule down the track, because a gate has to read
     * both as a thing with a name and as something every band is stopped by.
     */
    seams?: LayerSeam[];
    onSelectItem?: (itemId: string) => void;
    selectedItem?: string;
    /**
     * The bands whose participants are folded away, uncontrolled. Their tasks do
     * not disappear with them: they drop onto the band's own line, which is the
     * whole point of shutting one.
     */
    defaultCollapsed?: Layer[];
    /** The same, controlled. Pass it with `onCollapsedChange`. */
    collapsed?: Layer[];
    onCollapsedChange?: (layers: Layer[]) => void;
    /**
     * Offer the disclosures at all. Off, the bands render as given and a caller
     * that wants an overview passes the bands it wants shut in `collapsed`.
     */
    collapsible?: boolean;
    /**
     * A hover card on each task, saying what the bar cannot fit: the participant
     * it spends, when it runs and for how long, and the rule that refused it. On
     * by default; off falls back to the native `title`.
     */
    hoverDetail?: boolean;
    /** What that card says, when the default is not what this surface owes. */
    itemDetail?: (item: LayerItem) => React$1.ReactNode;
    /**
     * Keep the band labels in place while time scrolls. On by default: a run with
     * forty steps scrolls, and a band you cannot name is a row of marks.
     */
    frozenLabels?: boolean;
    /**
     * The label column, in `rem`. The default fits a layer name at the root size
     * beside its note — `human` and `3 rounds · 6m 01s` on one line.
     */
    labelWidth?: number;
    /** The narrowest the track is drawn before it scrolls, in `rem`. */
    minTrackWidth?: number;
    /**
     * The narrowest one tick may be squeezed to, in `rem`. Past that the strip
     * scrolls rather than shrinking: a bar too narrow to carry its task's name
     * has stopped being a drawing of that task.
     */
    minSlotWidth?: number;
    /**
     * What the layers are painted with. The same map reaches the band chips and
     * the bars, so a strip never disagrees with its own labels; a layer left out
     * draws in the neutral.
     */
    palette?: LayerPalette;
}
/** An unknown state is still a state: it says its own name. */
declare const stateLabel: (state: LayerItemState) => string;
/**
 * A plan or a run as layer bands over a time axis — a gantt, not a matrix.
 *
 * **Time is the x axis, in whichever tense the drawing is in.** A plan's time
 * is its order (`seq` — what happens before what); a run's is the wall clock
 * (`elapsed`). Task names are not an axis: a task is a bar, written once where
 * it sits, so a reader answers *what does this engage, and for how long* by
 * scanning across, and *what spends this participant* by scanning down.
 *
 * **A band opens into its participants.** `llm` is a band; `role: decide` and
 * `role: extract` are the rows under it, and the task sits on the row it
 * actually spends. The band alone cannot say which model a step will reach, and
 * that is the list a world is checked against.
 *
 * **A band folds its participants away without losing its tasks.** Shut, the
 * rows go and every task the layer spends drops onto the band's own line —
 * which is the overview: six lines, every task placed in time, *what was this
 * layer busy with* answered without reading twelve rows. Open, the same tasks
 * sit on the participant that spends them. `collapse all` in the header does it
 * to every band that has participants to fold, and nothing is hidden either
 * way: folding moves a task up a row, it never drops it.
 *
 * **A bar says what it is; hovering it says what it cannot fit.** The card
 * carries the participant the row truncates or folding took away, when the task
 * runs and for how long, and the rule that refused it — so a bar can stay a bar
 * rather than growing a second line for every fact somebody might want.
 *
 * **Refusals are struck in place, not removed.** A refused engagement keeps its
 * bar and takes a struck label, because the gap it would otherwise leave is
 * indistinguishable from a stretch of time that never reached for that layer.
 *
 * **A row nothing spent is drawn muted, never dropped.** A band no task
 * touched takes the muted ground **across its whole width** — label column and
 * track together — and so does a participant row under an open band:
 * `role: extract` declared and never reached reads as *this run did not get
 * that far*, not as an ordinary empty row. A dropped row would say nothing at
 * all, and *this plan never reaches for a cache* is a finding.
 *
 * The ground is the carrier, not the type colour. A row is unspent because it
 * is *empty*, and an empty row has no text to mute past its own name — greying
 * the chip while the row keeps the card ground says *this label is quiet* when
 * the fact is *nothing spends this layer*.
 *
 * **A bar wears its layer, and its state is the edge.** The hue tints the bar's
 * ground and border and runs down its rail; dashed says the task never ran, and
 * the destructive token says a rule refused it — the one fact that outranks
 * whose bar it is. The label itself stays on a text token: the data palette is
 * a surface palette here, which keeps `cache` as legible as `human`.
 *
 * **Refused is not unspent.** A row whose only task was refused keeps its full
 * weight: being stopped from reaching a participant and never reaching for one
 * are the two facts this drawing exists to separate.
 *
 * **A gate is a seam, not a row.** Nothing is dispatched at a gate, so it has
 * no participant and cannot be a bar; it stops every band at once, so it is a
 * position on the axis and the bands are crossed by it. Which side of the line
 * its label hangs on is what saying no costs — `before` and nothing is spent,
 * `after` and the pass is already paid for. A gate that can be raised at any
 * dispatch has no position and draws across the whole axis instead.
 *
 * **The spine band is always drawn**, with its wire running the whole axis: the
 * runtime's own dispatches are what the other bands are timed against, and it
 * is never governed. A band declares itself the spine with `spine` — the strip
 * recognises no layer by name. A spine that has dispatched nothing recedes like
 * any other empty row: the wire still says *this is the clock*, and the muted
 * ground says *it has not run yet*, which are two different facts.
 *
 * DOM over a fixed track, not canvas: it binds to no canvas store, it lives in
 * `mainSection` where no canvas exists, and frozen row labels plus text
 * selection are free here and expensive there.
 */
declare const LayerStrip: React$1.ForwardRefExoticComponent<LayerStripProps & React$1.RefAttributes<HTMLDivElement>>;

type LegendSwatchKind = "dot" | "line" | "dashed" | "arrow" | "ring"
/** The rail down a row — how a trace says which layer a step spent. */
 | "stripe"
/** A box around what it holds — a bounded repetition, drawn by containment. */
 | "bracket"
/** A line the drawing is crossed by, with the mark that names it — a gate. */
 | "rule";
interface LegendItemProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "color"> {
    /**
     * What the mark looks like on the canvas. A legend that draws a dot for
     * something rendered as a dashed line is worse than no legend.
     */
    kind?: LegendSwatchKind;
    /**
     * The mark's colour — a CSS colour or, preferably, a data-palette token:
     * `var(--color-data-3)`. Defaults to the current text colour.
     */
    color?: string;
    label: React$1.ReactNode;
    /** Trailing count — `1,912`, `52,100`. */
    count?: React$1.ReactNode;
}
interface LegendProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** `row` wraps inline under a canvas; `column` stacks in a panel. */
    orientation?: "row" | "column";
    children?: React$1.ReactNode;
}
/**
 * What the colours on a canvas mean.
 *
 * Every canvas in the system carries one: node types, edge kinds, run outcomes,
 * schedule firings, plan dependencies. It is the other half of the rule that
 * colour never carries meaning alone — the palette says which hue, the legend
 * says what the hue is.
 *
 * `kind` exists because these canvases draw more than dots. A dependency that
 * renders as a dashed arrow needs a dashed arrow in the legend, or the legend
 * is describing a different picture.
 */
declare const Legend: React$1.ForwardRefExoticComponent<LegendProps & React$1.RefAttributes<HTMLDivElement>>;
declare const LegendItem: React$1.ForwardRefExoticComponent<LegendItemProps & React$1.RefAttributes<HTMLDivElement>>;

interface LensChipProps extends Omit<React$1.HTMLAttributes<HTMLSpanElement>, "children" | "onClick"> {
    /**
     * The lens in force. **`undefined` is a real, common state** and reads
     * `Everything` — see below.
     */
    lens?: {
        name: string;
        kind?: "world" | "guardrail";
    };
    /** Open the picker. Absent leaves the chip as a statement. */
    onPick?: () => void;
}
/**
 * Which world a run is being read under — the header's right-hand chip, and the
 * one on an agent's row.
 *
 * **No lens reads `Everything`, never blank and never `None`.** A Graph that
 * sets no lens sees the whole global model, every configured provider and every
 * third party its agents are credentialed for: the widest state is the default,
 * and it is a *state*, not a missing value. `None` would suggest nothing is in
 * view, which is the exact opposite of what is true. `Everything` is also still
 * inside the guardrails, which is why a guardrail is not a lens you pick.
 *
 * It is the smallest surface in Govern and the one most often on screen, so it
 * carries the name and nothing else. What that world narrows belongs in the
 * drawer the chip opens — a chip that listed its rules would be a rule list
 * that happened to be in a header.
 */
declare const LensChip: React$1.ForwardRefExoticComponent<LensChipProps & React$1.RefAttributes<HTMLSpanElement>>;

/** What the mark means, as a tone. The same seven `StatusDot` uses, less the dot. */
type MarkTone = "muted" | "info" | "success" | "warning" | "destructive";
interface MarkChipProps extends React$1.HTMLAttributes<HTMLSpanElement> {
    tone?: MarkTone;
    /** `↺ 2 of 3`, `⏸ 1 of 3`, `live`, `↳ delegates`. */
    children?: React$1.ReactNode;
}
/**
 * What happened to this row that its own columns cannot say.
 *
 * A run's trace row already carries a name, a description, a layer, a role and
 * a duration. What it does *not* carry is the exception: this step took two
 * attempts, this one is painting right now, this one asked a person, this one
 * delegated a run of its own. Those are marks — they appear on a handful of
 * rows and they are the rows a reader is looking for.
 *
 * **Outlined, never filled.** A filled chip competes with the row's own name at
 * the same size; an outline reads as an annotation on the name, which is what it
 * is. Mono, because most marks are counts against a bound (`2 of 3`) and the
 * bound is the engine's number.
 *
 * Distinct from `BoundChip`, and the distinction is the point: a bound is what a
 * callable **may** spend, declared before anything ran. A mark is what a run
 * **did** — it exists only in the record, and it is usually the reason a reader
 * opened the trace at all.
 */
declare const MarkChip: React$1.ForwardRefExoticComponent<MarkChipProps & React$1.RefAttributes<HTMLSpanElement>>;

interface MatchCandidate {
    address: string;
    matched: boolean;
}
interface MatchPreviewProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** The pattern as typed, wildcards and all — `graph_data/model/Deals@*`. */
    pattern: string;
    /**
     * The catalogue, each entry saying whether this pattern reaches it. Both
     * halves are needed: see the note on near-misses.
     */
    matches?: MatchCandidate[];
    loading?: boolean;
    /** Cap the list; the rest are counted. Default 8. */
    limit?: number;
}
/**
 * What an address pattern matches **right now**, resolved against the live
 * catalogue as the pattern is typed.
 *
 * **Narrowing is picking, not writing.** Every control in the rule builder
 * offers what the catalogue holds, so nothing can name something that is not
 * there — and this is the surface that makes that true for the one control
 * which *is* free text. A pattern is written against what it visibly bites, not
 * from memory.
 *
 * **The near-misses are shown, greyed, not filtered out.** A preview listing
 * only hits cannot distinguish *this pattern is precise* from *this pattern is
 * wrong* — both render as a short list. Showing what it passed over is how a
 * reader sees that `Deals@1.0.0` missed because they wrote the version out
 * instead of `Deals@*`, which is the mistake that makes a bound quietly stop
 * applying on the next publish.
 *
 * **Nothing matched is a first-class state**, and distinct from a layer with
 * nothing in it. One means the pattern is wrong; the other means the Graph has
 * nothing of that kind configured yet.
 */
declare const MatchPreview: React$1.ForwardRefExoticComponent<MatchPreviewProps & React$1.RefAttributes<HTMLDivElement>>;

interface MenuItemProps extends MenuItem {
    level?: number;
}
interface MenuItem {
    id: string;
    label: string;
    icon?: React$1.ElementType | LucideIcon;
    shortcut?: string;
    className?: string;
    href?: string;
    onClick?: () => void;
    children?: MenuItem[];
}
declare const MenuItem: React$1.FC<MenuItemProps>;

/**
 * The ink on the value, for a number whose *state* is the thing being read —
 * `running` while in flight, `ok` when it finished, `failed` when it did not.
 *
 * Omit it for an ordinary measurement. A grid where every tile is coloured
 * carries no signal, and a number that is merely large is not a warning.
 */
type KnownMetricTone = "running" | "success" | "warning" | "error" | "info";
/**
 * The values the kit draws specially — **suggestions, not a limit.** Anything
 * else renders with the neutral token and its own name.
 */
type MetricTone = KnownMetricTone | (string & {});
interface MetricTileProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** What is being measured — `accepted`, `served (plan.verified)`, `hit rate`. */
    label: React$1.ReactNode;
    /** The number. `31 of 38`, `91%`, `9.6 s`, `$38.20`. */
    value: React$1.ReactNode;
    /** Why the number is what it is — the denominator, the window, the caveat. */
    caption?: React$1.ReactNode;
    /** Tints the value. See {@link MetricTone} — most tiles should not set it. */
    tone?: MetricTone;
    /**
     * How much of a known ceiling has been spent, `0`–`1`, as a 4px bar under the
     * caption. Takes `tone`'s colour when one is set.
     *
     * Only for a value with a **real ceiling** — a budget, a token limit, a lane
     * pool, a task count. Never a rate or a duration: a sliver under `$0.04 of
     * $2.00` says the budget is safe, while the same bar under `12s` would invent
     * a deadline that does not exist.
     */
    meter?: number;
    /** A sparkline, or anything else that sits under the value. */
    children?: React$1.ReactNode;
}
interface MetricGridProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Smallest a tile may get before the grid drops a column. */
    minTileWidth?: number;
    /**
     * Gap between tiles, in px.
     *
     * It is a prop because a tile strip is usually one band of something larger,
     * and a grid that keeps its own tighter rhythm makes the whole surface read
     * as two grids. A dashboard passes its own gap; a standalone strip keeps the
     * default.
     */
    gap?: number;
    children?: React$1.ReactNode;
}
/**
 * One number, with enough around it to be read correctly.
 *
 * `caption` is not decoration. A tile that says `91%` and nothing else invites
 * the reader to supply their own denominator; `of thinkings` stops that. If
 * there is no honest caption, the number probably needs a different surface.
 */
declare const MetricTile: React$1.ForwardRefExoticComponent<MetricTileProps & React$1.RefAttributes<HTMLDivElement>>;
/**
 * Tiles at whatever width the panel gives them.
 *
 * `auto-fit` rather than a column count, because the same set of tiles appears
 * in a 420px panel and across a full-width board and should not need a
 * different call site for each.
 */
declare const MetricGrid: React$1.ForwardRefExoticComponent<MetricGridProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * NavMenuItem - one row of the dropdown a nav item can open. Give an item
 * `menuItems` and it becomes a menu trigger instead of a plain button: the
 * `…` overflow in a panel header, a "New…" split action, an account menu.
 */
interface NavMenuItem {
    /** Unique identifier within the menu. */
    id: string;
    /** Row label — a string, or any node if you need your own markup. */
    label: React__default.ReactNode;
    /** Optional leading icon component. */
    icon?: React__default.ElementType;
    /** Keyboard hint, shown right-aligned (display only — bind the key yourself). */
    shortcut?: string;
    disabled?: boolean;
    /** Render the row in the destructive colour (delete, drop, remove…). */
    destructive?: boolean;
    /** Draw a separator immediately above this row. */
    separatorBefore?: boolean;
    onSelect?: () => void;
}
/**
 * NavItemConfig - Shared configuration for a single navigation item, used by
 * both NavHorizontal and NavVertical. An item renders as an `<a>` (when `href`
 * is set), a `<button>` (when `onClick` is set), or a static `<div>`.
 */
interface NavItemConfig {
    /** Optional unique key for React rendering, and the item's identity for
     *  `activeKey`. Falls back to `name`. */
    key?: string;
    /** Display name shown in tooltip */
    name: string;
    /** Optional label text to display next to the icon */
    label?: React__default.ReactNode;
    /** Navigation URL (for anchor tag) */
    href?: string;
    /** Click handler (for button behavior) */
    onClick?: () => void;
    /** Additional CSS classes for the item wrapper */
    className?: string;
    /** CSS classes applied when item is active */
    activeClass?: string;
    /** CSS classes for the icon */
    iconClassName?: string;
    /** Classes for the label span alone — a truncation cap, usually
     *  (`max-w-[16ch] truncate`). */
    labelClassName?: string;
    /** Stroke width for the icon (default: 2) */
    iconStroke?: number;
    /** Tooltip position */
    tooltipSide?: "top" | "right" | "bottom" | "left";
    /** Show a separator line after this item */
    showSeperator?: boolean;
    /** Lucide icon component. Optional — items may be label-only (e.g. status-bar text). */
    icon?: React__default.ElementType | LucideIcon;
    /** Custom tooltip content (overrides name) */
    tooltip?: React__default.ReactNode;
    /** Greys the item out and drops every interaction on it. */
    disabled?: boolean;
    /**
     * Inline style passthrough — for a per-item value the theme cannot express,
     * such as a colour carried by the data (a page's own accent). Everything
     * static belongs in `className`.
     */
    style?: React__default.CSSProperties;
    /**
     * Rows of a dropdown opened by this item. With `menuItems` the item is a
     * menu trigger — it needs no `onClick`, and stays highlighted while its menu
     * is open. Ignored when `href` is set.
     */
    menuItems?: NavMenuItem[];
    /**
     * Where `menuItems` hangs off.
     *
     * `'item'` (the default) — the whole item is the trigger. Clicking anywhere
     * on it opens the menu.
     *
     * `'caret'` — a chevron button *inside* the item: the body still selects,
     * and only the caret opens the menu. That is what a page tab needs, and it
     * is why a tab strip could not be built on nav items before.
     */
    menuTrigger?: "item" | "caret";
    /**
     * A count pinned to the item's top-right — unread reviews, waiting questions.
     *
     * The one place in the kit where a rounded capsule is right: a count bubble
     * is a round object, not a rectangle with soft ends (see `@invana/styling`
     * › border radius). Keep it short; it is a signal, not a readout.
     *
     * The badge text sits inside the item, so it contributes to the accessible
     * name; the item's `name` reaches assistive tech through its tooltip. Pass a
     * bare number — anything longer belongs in the tooltip.
     */
    badge?: React__default.ReactNode;
}
/**
 * The visual treatments a strip of nav items can wear.
 *
 * One table, because the kit draws all three and used to draw two of them by
 * hand in separate components. `nav` is what nav items have always looked
 * like; `underline` and `folder` are the two tab strips — a panel's views and
 * a workbook's pages — lifted out of `TabbedPanel` and
 * `CanvasPagesViewPanel` unchanged, so migrating those renders identically.
 */
declare const VARIANT: {
    /** The capsule: a filled, ringed chip. Toolbars, rails, header actions. */
    readonly nav: {
        readonly item: "rounded-control ring-1 ring-transparent";
        readonly hover: "hover:bg-primary/10 hover:text-primary hover:ring-primary/25";
        readonly open: "data-[state=open]:bg-primary/15 data-[state=open]:text-primary data-[state=open]:ring-primary/25";
        readonly active: "bg-primary/15 text-primary ring-primary/25";
        readonly strip: "";
    };
    /** The panel tab: accented fill with a rule under it, merging into the body. */
    readonly underline: {
        readonly item: "h-full rounded-none px-3 py-2";
        readonly hover: "hover:text-foreground";
        readonly open: "data-[state=open]:text-foreground";
        readonly active: "bg-primary/10 text-primary border-b-2 border-primary mb-[-1px]";
        readonly strip: "items-stretch";
    };
    /**
     * The workbook tab: boxed on top / left / right with an *open bottom*, so it
     * punches through the strip's own rule — the classic folder-tab notch.
     */
    readonly folder: {
        readonly item: "h-full rounded-none px-3 py-2 gap-1.5";
        readonly hover: "hover:text-foreground";
        readonly open: "data-[state=open]:text-foreground";
        readonly active: "mb-[-1px] rounded-t-md border border-b-0 border-primary text-primary";
        readonly strip: "items-stretch";
    };
};
type NavItemsVariant = keyof typeof VARIANT;
interface NavItemsProps {
    items: NavItemConfig[];
    /** Layout orientation — drives default icon size, padding, tooltip side and separator. */
    orientation?: "horizontal" | "vertical";
    /** Default tooltip side when an item doesn't specify one. */
    tooltipSide?: "top" | "right" | "bottom" | "left";
    /** Default icon classes when an item doesn't specify `iconClassName`. */
    iconClassName?: string;
    /** Visual treatment — see {@link VARIANT}. Defaults to `nav`. */
    variant?: NavItemsVariant;
    /**
     * The selected item's key (`item.key ?? item.name`).
     *
     * Passing it makes the strip **controlled**: the internal highlight is
     * bypassed entirely and the caller owns which item is lit. Omit it and the
     * strip keeps its own state exactly as it always has.
     */
    activeKey?: string;
    /** Fires with the item's key whenever selection changes, controlled or not. */
    onActiveChange?: (key: string) => void;
    /**
     * `'tabs'` announces the strip as a tab list and gives it tab keyboard
     * behaviour: `role="tablist"` on the container, `role="tab"` +
     * `aria-selected` per item, ONE tab stop for the whole strip (roving
     * tabindex), and ← → ↑ ↓ Home End moving between items with selection
     * following focus — the same model Radix's tabs use.
     *
     * `'none'` (the default) leaves items as the plain buttons and links they
     * have always been.
     */
    selectionMode?: "none" | "tabs";
    /** Item key → the `id` of the panel it controls, for `aria-controls`. */
    panelId?: (key: string) => string;
    /**
     * Fold the items that do not fit into a `…` dropdown at the end of the strip.
     *
     * **Off by default.** A strip only becomes responsive because its owner asked
     * it to — a toolbar that would rather scroll, or one whose items must all
     * stay visible, is unaffected by this existing.
     *
     * Requires the strip to have a bounded width to measure against: put
     * `min-w-0` on it (or on its flex parent) or it will report that everything
     * fits, forever. Ignored on a vertical strip, which grows downward.
     */
    overflow?: boolean;
    /** Accessible name and tooltip for the overflow trigger. */
    overflowLabel?: string;
    /** Classes for the strip container. Only rendered when the strip needs one —
     *  see the note on the return value in {@link NavItems}. */
    className?: string;
}
/**
 * NavItems - Shared renderer for navigation items. Renders href / onClick /
 * static items with identical styling so all three share the same padding,
 * primary hover + active highlight, and icon size.
 *
 * **What it returns.** With neither `selectionMode` nor `overflow` set it
 * returns a bare fragment, exactly as it always has, and the caller's own
 * wrapper lays the items out — every existing consumer is untouched. Ask for
 * either and it renders its own container, because both need one: a tab list
 * needs an element to carry `role="tablist"` and the keyboard handler, and
 * overflow needs an element whose width is the budget.
 */
declare const NavItems: React__default.FC<NavItemsProps>;
interface NavSection {
    content?: React__default.ReactNode;
    className?: string;
}
interface BaseNavProps {
    className?: string;
    orientation: "horizontal" | "vertical";
    sections: {
        start?: NavSection;
        center?: NavSection;
        end?: NavSection;
    };
}
/**
 * Base navigation component that handles both orientations
 * Use NavHorizontal or NavVertical wrappers for better DX
 */
declare const NavBase: React__default.FC<BaseNavProps>;

/**
 * NavHorizontalItem - Configuration for a single horizontal navigation item
 *
 * @example
 * ```tsx
 * const items: NavHorizontalItem[] = [
 *   {
 *     name: 'Dashboard',
 *     icon: Home,
 *     label: 'Dashboard', // Optional: shows text next to icon
 *     onClick: () => navigate('/dashboard')
 *   },
 *   {
 *     name: 'Settings',
 *     icon: Settings,
 *     href: '/settings',
 *     showSeperator: true
 *   }
 * ];
 * ```
 */
type NavHorizontalItem = NavItemConfig;
/**
 * Everything `NavItems` takes except the orientation, which this component
 * fixes. Forwarding the whole surface is what lets a header opt into
 * `overflow`, `variant` or tab semantics without reaching past the wrapper.
 */
interface NavHorizontalItemsProps extends Omit<NavItemsProps, 'orientation' | 'items'> {
    items: NavHorizontalItem[];
}
declare const NavHorizontalItems: React__default.FC<NavHorizontalItemsProps>;
/**
 * NavHorizontal - Horizontal navigation component for headers/top navigation
 *
 * @example
 * ```tsx
 * <NavHorizontal
 *   // Custom content at left (e.g., logo, brand)
 *   left={<Logo />}
 *
 *   // Navigation items in the left section
 *   leftNavItems={[
 *     { name: 'Home', label: 'Home', onClick: () => navigate('/') },
 *     { name: 'Products', label: 'Products', href: '/products' }
 *   ]}
 *
 *   // Content that should be centered
 *   center={<SearchBar />}
 *
 *   // Navigation items in the center
 *   centerNavItems={[
 *     { name: 'Features', label: 'Features', href: '/features' }
 *   ]}
 *
 *   // Right side navigation items
 *   rightNavItems={[
 *     { name: 'Login', label: 'Login', variant: 'outline', onClick: handleLogin }
 *   ]}
 *
 *   // Custom content at right (e.g., user menu, notifications)
 *   right={<UserMenu />}
 * />
 * ```
 *
 * @remarks
 * - `left`/`center`/`right`: For arbitrary React content
 * - `leftNavItems`/`centerNavItems`/`rightNavItems`: For navigation items with labels and click handlers
 * - All props are optional - use only what you need
 */
interface NavHorizontalProps {
    /** Custom content rendered on the left */
    left?: React__default.ReactNode;
    /** Navigation items for the left section */
    leftNavItems?: NavHorizontalItem[];
    /** Custom content rendered in the center */
    center?: React__default.ReactNode;
    /** Navigation items for the center section */
    centerNavItems?: NavHorizontalItem[];
    /** Custom content rendered on the right */
    right?: React__default.ReactNode;
    /** Navigation items for the right section */
    rightNavItems?: NavHorizontalItem[];
    /** Additional CSS classes for the navigation container */
    className?: string;
}
declare const NavHorizontal: React__default.FC<NavHorizontalProps>;

/**
 * NavVerticalItem - Configuration for a single navigation item
 *
 * @example
 * ```tsx
 * const items: NavVerticalItem[] = [
 *   {
 *     name: 'Dashboard',
 *     icon: Home,
 *     onClick: () => navigate('/dashboard')
 *   },
 *   {
 *     name: 'Settings',
 *     icon: Settings,
 *     href: '/settings',
 *     showSeperator: true
 *   }
 * ];
 * ```
 */
type NavVerticalItem = NavItemConfig;
/**
 * Everything `NavItems` takes except the orientation, which this component
 * fixes — so a rail can opt into `variant`, controlled selection or tab
 * semantics without reaching past the wrapper. (`overflow` is ignored on a
 * vertical strip: it grows downward, where there is always room.)
 */
interface NavVerticalItemsProps extends Omit<NavItemsProps, 'orientation' | 'items'> {
    items: NavVerticalItem[];
}
declare const NavVerticalItems: React__default.FC<NavVerticalItemsProps>;
/**
 * NavVertical - Vertical navigation component for sidebars
 *
 * @example
 * ```tsx
 * <NavVertical
 *   // Custom content at top (e.g., logo, branding)
 *   top={<div className="p-2"><Logo /></div>}
 *
 *   // Navigation items with icons, tooltips, and interactions
 *   topNavItems={[
 *     { name: 'Home', icon: Home, onClick: () => navigate('/') },
 *     { name: 'Search', icon: Search, href: '/search' },
 *     { name: 'Settings', icon: Settings, onClick: handleSettings, showSeperator: true }
 *   ]}
 *
 *   // Content that should be centered/flexible (e.g., notifications, status)
 *   middle={<NotificationBell />}
 *
 *   // Bottom navigation items
 *   bottomNavItems={[
 *     { name: 'Help', icon: HelpCircle, onClick: openHelp },
 *     { name: 'Profile', icon: User, href: '/profile' }
 *   ]}
 *
 *   // Custom content at bottom (e.g., user avatar, logout button)
 *   bottom={<UserAvatar />}
 * />
 * ```
 *
 * @remarks
 * - `top`/`bottom`: For arbitrary React content (logos, avatars, custom JSX)
 * - `topNavItems`/`bottomNavItems`: For navigation items with icons, tooltips, and click handlers
 * - `middle`: Content that fills the flexible space between top and bottom
 * - All props are optional - use only what you need
 */
interface NavVerticalProps {
    /** Custom content rendered at the very top */
    top?: React__default.ReactNode;
    /** Navigation items with icons and interactions for the top section */
    topNavItems?: NavVerticalItem[];
    /** Custom content rendered in the flexible middle section */
    middle?: React__default.ReactNode;
    /** Custom content rendered at the very bottom */
    bottom?: React__default.ReactNode;
    /** Navigation items with icons and interactions for the bottom section */
    bottomNavItems?: NavVerticalItem[];
    /** Additional CSS classes for the navigation container */
    className?: string;
}
declare const NavVertical: React__default.FC<NavVerticalProps>;

interface NestedMenuProps {
    menuItems: MenuItemProps[];
    className?: string;
}
declare const NestedMenu: React__default.FC<NestedMenuProps>;

interface PanelBoxProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "title"> {
    /** What this band is — `Input · what opened this run`, `result.json`, `Log`. */
    title: React$1.ReactNode;
    /**
     * The fact on the right of the header — `214 lines · tailing`, `rendered from
     * result.json`, a `<Badge>`, a count.
     *
     * Facts and affordances, never a toolbar. A band that needs icon buttons in
     * its header is a panel, and a panel is {@link PanelContent}.
     */
    aside?: React$1.ReactNode;
    /**
     * Drop the body padding, so a full-bleed child meets the border: a canvas, a
     * `DataTable` whose header rule should line up with the box, a chart.
     */
    flush?: boolean;
    children?: React$1.ReactNode;
    headerClassName?: string;
    bodyClassName?: string;
}
/**
 * One band of a dashboard: a bordered box with a label bar over it.
 *
 * A dashboard is a scrolling column of these — tiles, then the flow, then
 * Input beside `result.json`, then the Log. Each box is **content-height and
 * owns no scroller**: the column scrolls, so a band that scrolled itself would
 * hide its own content behind a second bar.
 *
 * Not {@link PanelContent}, which is the other shape: that one fills its
 * parent's height, owns an `overflow-y-auto` body, drops its border because it
 * sits inside panel chrome, and types its header's right side as nav items. All
 * four are wrong for a band. Two components because they are two objects, not
 * one object with a variant.
 *
 * Not {@link SectionHeader} either — that titles a section *inside* a scrolling
 * panel and carries a rule instead of a border box. This is the border box, so
 * its label is an {@link Eyebrow}: the smallest heading, subordinate to the
 * page's own title, which is what a band of six should be.
 */
declare const PanelBox: React$1.ForwardRefExoticComponent<PanelBoxProps & React$1.RefAttributes<HTMLDivElement>>;

interface PanelContentProps {
    /** Header title as a node — rendered as-is, so you own its typography. */
    title?: React__default.ReactNode;
    /** Header title as plain text, rendered in the default panel header style. */
    titleText?: string;
    children?: React__default.ReactNode;
    /** Classes for the outer card. */
    className?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerContent?: React__default.ReactNode;
    footerClassName?: string;
    /**
     * Actions on the right of the title bar, as `NavHorizontal` items. A panel
     * header has one action area — the right — so this is the item list itself
     * rather than the full `NavHorizontal` props that `PanelStack` and
     * `TabbedPanel` take: there is no left or centre slot to fill here, and the
     * title already owns the left.
     *
     * Give an item `menuItems` and it becomes a `…` overflow dropdown.
     *
     * ```tsx
     * headerActions={[
     *   { name: "Refresh", icon: RefreshCw, onClick: refetch },
     *   { name: "More options", icon: MoreHorizontal, menuItems: [
     *     { id: "export", label: "Export as CSV", onSelect: exportCsv },
     *   ] },
     *   { name: "Close panel", icon: X, onClick: close },
     * ]}
     * ```
     *
     * Closing is one of these and nothing more — there is no `onClose` prop. A
     * panel that dismisses lists a close item like any other action, which is
     * why the two look and behave identically.
     */
    headerActions?: NavHorizontalItem[];
    /**
     * Keep the header actions hidden until the header is hovered or focused (or
     * a menu inside them is open). Defaults to `false` — unlike a `PanelStack`
     * section, a `PanelContent` is one panel rather than one of a column, so its
     * actions are not noise. A close affordance in particular should not have to
     * be hunted for.
     */
    actionsOnHover?: boolean;
}
declare function PanelContent({ title, titleText, children, className, headerClassName, bodyClassName, footerContent, footerClassName, headerActions, actionsOnHover, }: PanelContentProps): React__default.JSX.Element;

interface PanelStackSection {
    /** Unique identifier for the section within the stack. */
    id: string;
    /**
     * Header content in the always-visible title bar. A plain string gets the
     * default VS-Code header styling (compact, uppercase, muted). Pass any
     * React node (an element with your own icon, badges, colours, casing…) to
     * take full control — the node is rendered as-is, without the forced
     * typography.
     */
    title: React$1.ReactNode;
    /** Body content, revealed when the section is expanded and scrolled within. */
    content: React$1.ReactNode;
    /** Optional leading icon component, shown before the title. */
    icon?: React$1.ElementType;
    /**
     * Actions on the right of the title bar, as `NavHorizontal` items — the same
     * list `PanelContent` and `TabbedPanel` take, so a header is described once
     * and reads the same everywhere. A header has one action area, so this is
     * the item list itself rather than left/centre/right slots; the title owns
     * the left. Give an item `menuItems` and it becomes the `…` overflow
     * dropdown.
     *
     * ```tsx
     * headerActions: [
     *   { name: "Refresh", icon: RefreshCw, onClick: refetch },
     *   { name: "More options", icon: MoreHorizontal, menuItems: [
     *     { id: "sort", label: "Sort oldest first", onSelect: sort },
     *   ] },
     * ]
     * ```
     */
    headerActions?: NavHorizontalItem[];
    /**
     * Keep `headerActions` hidden until the header is hovered or focused (or a
     * menu inside them is open) — VS Code's quiet view header. Defaults to
     * `true`. Chrome that must always read, like a count, belongs in `title`.
     */
    actionsOnHover?: boolean;
    /** Start the section collapsed (header only). Defaults to `false`. */
    defaultCollapsed?: boolean;
    /**
     * Initial expanded size, as a share of the stack. A number/`"%"` string is a
     * percentage; append `px`/`rem`/`vh` for absolute units. When omitted, the
     * remaining height is split evenly across the expanded sections.
     */
    defaultSize?: number | string;
    /**
     * Minimum expanded size (below which a drag collapses the section). Defaults
     * to `headerHeight + 64` px so an expanded section always shows some content.
     */
    minSize?: number | string;
}
/**
 * Drive a stack from outside — open the section a route just navigated to,
 * close one a filter emptied.
 *
 * **Why this is a handle and not a `collapsed` prop.** The stack's geometry is
 * owned by the resizable group: a drag past `minSize` collapses a section, and
 * releasing it opens one again. A controlled `collapsed` map would be a second
 * owner of that state and would fight every drag — the parent would re-assert
 * a stale value the moment the user let go. So the stack stays the owner,
 * reports every change through `onCollapsedChange`, and takes instructions
 * through this handle.
 */
interface PanelStackHandle {
    /** Open a section, taking the room from the tallest expanded sibling. */
    expand: (id: string) => void;
    /** Collapse a section to its header. */
    collapse: (id: string) => void;
    /** Collapse it if open, open it if collapsed — what the header click does. */
    toggle: (id: string) => void;
    /** Whether that section is currently collapsed. */
    isCollapsed: (id: string) => boolean;
}
interface PanelStackProps {
    /** Ordered list of sections that make up the stack. */
    sections: PanelStackSection[];
    /**
     * Imperative access to the stack — see {@link PanelStackHandle}. Use it when
     * something outside the stack decides a section should be open: a route, a
     * drill-in, a search that landed in a collapsed list.
     *
     * ```tsx
     * const stack = React.useRef<PanelStackHandle>(null)
     * React.useEffect(() => stack.current?.expand(openDrawer), [openDrawer])
     * <PanelStack stackRef={stack} sections={…} />
     * ```
     */
    stackRef?: React$1.Ref<PanelStackHandle>;
    /**
     * Called whenever a section opens or closes — by a header click, by a drag
     * past `minSize`, or through {@link PanelStackHandle}. Receives the whole
     * map, so a consumer can persist the shape of the column.
     */
    onCollapsedChange?: (collapsed: Record<string, boolean>) => void;
    /**
     * Height of each section's title bar, in pixels. Doubles as the collapsed
     * size so a collapsed section shows only its header. Defaults to `35`.
     */
    headerHeight?: number;
    /** Show a grip in the drag dividers between expanded sections. */
    withHandle?: boolean;
    /** Extra classes merged onto the outer group (it fills its parent by default). */
    className?: string;
    /** Extra classes merged onto every section header. */
    headerClassName?: string;
    /** Extra classes merged onto every section body. */
    bodyClassName?: string;
}
/**
 * A vertical stack of collapsible, resizable panels — the VS Code "view
 * container" layout. Every section header stays visible; expanding a section
 * fills the remaining column height, and when several are open they share that
 * height with draggable dividers between them ("show both partially"). Each
 * section collapses to just its header, independently of the others.
 *
 * Unlike an `Accordion` (whose panels size to their content), a `PanelStack`
 * fills the full height of its container, so wrap it in a sized parent
 * (`h-screen`, a flex/grid track, a fixed-height sidebar…).
 *
 * ```tsx
 * <div className="h-screen w-72">
 *   <PanelStack
 *     sections={[
 *       { id: "changes", title: "Changes", content: <ChangesList /> },
 *       { id: "graph", title: "Graph", content: <CommitGraph /> },
 *     ]}
 *   />
 * </div>
 * ```
 */
declare function PanelStack({ sections, stackRef, onCollapsedChange, headerHeight, withHandle, className, headerClassName, bodyClassName, }: PanelStackProps): React$1.JSX.Element;

/**
 * What a run did with a participant it was allowed — **suggestions, not a
 * limit.** A product with a seventh verdict passes it and the row draws it in
 * the neutral.
 */
type KnownParticipantVerdict = "touched" | "never touched" | "refused" | "miss" | "denied";
type ParticipantVerdict = KnownParticipantVerdict | (string & {});
interface ParticipantRowProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** The participant, as the world addresses it — `model/Routes@v4`. */
    address: string;
    verdict: ParticipantVerdict;
    /** What happened — `1,284 rows · step 7`, `allowed, and nothing asked for it`. */
    note?: React$1.ReactNode;
    /**
     * The tone the verdict is read in. Defaults: `touched` succeeds, `refused`
     * and `denied` are destructive, everything else is muted — *allowed and never
     * reached for* is not a failure, it is an invitation to narrow.
     */
    tone?: "success" | "muted" | "warning" | "destructive";
    /**
     * How the **address** is drawn. Derived from the verdict — `refused` strikes
     * it in place, `never touched` mutes it — and overridable for a vocabulary
     * the kit has not seen.
     *
     * Striking is `AddressChip`'s job and not this row's: the address is struck
     * everywhere a refusal is shown, and two components deciding that
     * independently is how one surface comes to strike and another to hide.
     */
    addressTone?: AddressTone;
}
/**
 * One participant a run could have spent, and what it actually did with it.
 *
 * The Lens reading of a run is a list of these under their layers: every
 * address the world allowed, each marked `touched` · `never touched` ·
 * `refused`. **Nothing is filtered out**, because the list is not an inventory
 * of what ran — it is the gap between *declared* and *did*, and each kind of
 * gap names a different act. Three allowed and never touched is an invitation
 * to narrow the world; a refusal is an invitation to widen it, or to accept
 * that the graph cannot answer inside it.
 *
 * It is not `RuleRow`: a rule is a sentence about what *may* happen, written
 * before anything ran. This is a fact about one execution.
 */
declare const ParticipantRow: React$1.ForwardRefExoticComponent<ParticipantRowProps & React$1.RefAttributes<HTMLDivElement>>;

interface PropertyListProps extends React$1.HTMLAttributes<HTMLDListElement> {
    /**
     * Width of the label column. One value for the whole list, so every value
     * starts on the same x — the reason to use this rather than a row of flexes.
     */
    labelWidth?: number | string;
    children?: React$1.ReactNode;
}
interface PropertyRowProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    label: React$1.ReactNode;
    children?: React$1.ReactNode;
    /** Renders the value in the mono face — an id, a key, a query fragment. */
    mono?: boolean;
}
/**
 * What one selected thing *is*, as label/value pairs.
 *
 * The inspector's body: a node's properties, an agent's bindings, a proposal's
 * draft, a run's parameters. A `<dl>` because that is what this is — pairs, not
 * a two-column table and not a form.
 *
 * The label column is fixed by the list rather than by each row, so values line
 * up down the panel. A ragged value column is the thing that makes an inspector
 * read as noise.
 */
declare const PropertyList: React$1.ForwardRefExoticComponent<PropertyListProps & React$1.RefAttributes<HTMLDListElement>>;
declare const PropertyRow: React$1.ForwardRefExoticComponent<PropertyRowProps & React$1.RefAttributes<HTMLDivElement>>;

interface ProposalCardProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "title"> {
    /** What is being proposed — `Draft pattern`. */
    title: React$1.ReactNode;
    /** Where it came from — `from the agent's result`. */
    source?: React$1.ReactNode;
    /** The draft itself. A `PropertyList`, usually. */
    children?: React$1.ReactNode;
    /** What the proposal rests on — the instances, as a table or list. */
    evidence?: React$1.ReactNode;
    /** A heading for the evidence — `The six instances`. */
    evidenceTitle?: React$1.ReactNode;
    /** Scope of the evidence — `30 days`. */
    evidenceMeta?: React$1.ReactNode;
    /** What authoring would actually write. */
    consequence?: React$1.ReactNode;
    /** Author / reject / reassign. */
    actions?: React$1.ReactNode;
}
/**
 * An agent proposes; a person publishes.
 *
 * Nothing here exists in the graph yet — the draft is a shape the agent found,
 * and authoring is what writes it. The card is built so that separation is
 * legible: the draft and the evidence it rests on are shown together, so the
 * decision is made against the instances rather than against a summary of them.
 *
 * `consequence` says what authoring will write. A person approving something
 * should not have to infer the side effects.
 */
declare const ProposalCard: React$1.ForwardRefExoticComponent<ProposalCardProps & React$1.RefAttributes<HTMLDivElement>>;

type Verdict = "appreciate" | "depreciate";
interface DotRatingProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: number;
    max?: number;
    onChange?: (value: number) => void;
    /** Read-only display, e.g. inside a history entry. */
    readOnly?: boolean;
    label?: string;
}
interface RatingControlProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onChange"> {
    verdict?: Verdict;
    onVerdictChange?: (v: Verdict) => void;
    weight: number;
    onWeightChange?: (w: number) => void;
    maxWeight?: number;
    /** What the rating refines — a pattern name. */
    refines?: React$1.ReactNode;
    /** Who is rating. An `AgentChip`, usually. */
    by?: React$1.ReactNode;
    /** The note field, and anything else the caller wants under the controls. */
    children?: React$1.ReactNode;
}
/**
 * A small integer, as dots.
 *
 * Weight is 1–3, so a slider or a number input would both be heavier than the
 * value they carry. Dots read at a glance and are still a real radio group
 * underneath. Lives beside `RatingControl` rather than in `ui/` because it is
 * the only thing that uses it; promote it if a second caller appears.
 */
declare const DotRating: React$1.ForwardRefExoticComponent<DotRatingProps & React$1.RefAttributes<HTMLDivElement>>;
/**
 * A person's verdict on an agent's result.
 *
 * This is the capture signal the learning loop runs on: accepting or rejecting
 * with a weight becomes a Learning that rates the observation and refines the
 * pattern behind it. So the control states its consequence rather than implying
 * it — `by` and `refines` are shown on the control itself.
 *
 * Appreciate and depreciate are one control with two positions, not two
 * buttons: it is a single decision with a sign, and two buttons would invite
 * pressing both.
 */
declare const RatingControl: React$1.ForwardRefExoticComponent<RatingControlProps & React$1.RefAttributes<HTMLDivElement>>;

interface RecordHeaderProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     * The record's state, as the dot on the left. Omit for a record that has no
     * state of its own — a catalogue entry, a draft being edited.
     */
    tone?: StatusDotProps["tone"];
    /**
     * The record and its parents, outermost first. The **last** crumb is the
     * record this surface is about and is set solid; the ones before it are the
     * path to it and are muted.
     *
     * One crumb is the normal case — a run, a plan. Two is a child: `a run › the
     * task inside it`.
     */
    crumbs: React$1.ReactNode[];
    /** What is true about it — a `<BoundChip>`, a status `<Badge>`, a kind. */
    chips?: React$1.ReactNode;
    /** What you can do to it — prev/next, a view switch, buttons, a `…` menu. */
    actions?: React$1.ReactNode;
}
/**
 * Which record you are looking at, across the top of the surface showing it.
 *
 * A run dashboard, a step dashboard, a plan, a draft — every one of them opens
 * with this line, so a reader who followed a link knows what they are reading
 * before they read any of it.
 *
 * It is **not** a `ContextBar`. That is 28px under a panel and describes the
 * *view* — counts, a keyboard hint, a tab-shaped switch. This is above the
 * content and names the *record*, which is why the crumbs are mono: they are
 * identifiers, not prose.
 *
 * It is not a `Breadcrumb` either, though it contains one shape of one. A
 * breadcrumb is navigation up a tree; these two crumbs are a record and its
 * parent, shown so the child is not read out of context.
 */
declare const RecordHeader: React$1.ForwardRefExoticComponent<RecordHeaderProps & React$1.RefAttributes<HTMLDivElement>>;

interface RecordPagerProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** Where the reader is — `step 7 of 9`. */
    position?: React$1.ReactNode;
    onPrevious?: () => void;
    onNext?: () => void;
    /** What the two controls are called. The defaults name the *record*, not the direction. */
    previousLabel?: string;
    nextLabel?: string;
}
/**
 * The record before this one, and the one after.
 *
 * A step opened from a run's trace is one of nine, and the reader almost always
 * wants the next one — so walking the run costs two keystrokes rather than a
 * return to the list and a second drill-in.
 *
 * **Both controls carry a name.** An icon-only button with no accessible name
 * is a control a screen reader announces as "button", which is the one thing a
 * pager must not be; `previousLabel` and `nextLabel` name the record, so it
 * reads *previous step* rather than *left*.
 *
 * At either end the control is **disabled, not hidden**: a pager that loses a
 * button at the edges moves the other one under the reader's cursor.
 */
declare const RecordPager: React$1.ForwardRefExoticComponent<RecordPagerProps & React$1.RefAttributes<HTMLDivElement>>;

interface RepairNoteProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** What was wrong — `unknown property Theme.velocity5d`. */
    from: React$1.ReactNode;
    /** What it became — `Theme.velocity_5d`. */
    to: React$1.ReactNode;
}
/**
 * The query went back once, carrying its error, and came back correct.
 *
 * One of the four run outcomes (DS8). It renders **on the step that repaired
 * it**, never as a message in the thread — a repair is a detail of how the
 * answer was reached, not something asked of the reader. Promoting it to a card
 * would make a successful run look like a problem.
 */
declare const RepairNote: React$1.ForwardRefExoticComponent<RepairNoteProps & React$1.RefAttributes<HTMLDivElement>>;

interface RetryNoteProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Which attempt this is — `retry 1 of 2`. */
    attempt?: React$1.ReactNode;
    /** What happened, in time — `no response in 2.0s; the second returned in 0.6s`. */
    children?: React$1.ReactNode;
}
/**
 * The database was slow, not wrong.
 *
 * One of the four run outcomes (DS8), and like a repair it renders on its step
 * rather than as a card. Transient: nothing is asked of the reader, because it
 * is already retrying — visibly — and the answer still arrives.
 *
 * Separate from `RepairNote` on purpose. A retry means *the same query, again*;
 * a repair means *a different query*. Collapsing them into one component with a
 * `reason` prop would lose the only distinction that matters to the reader.
 */
declare const RetryNote: React$1.ForwardRefExoticComponent<RetryNoteProps & React$1.RefAttributes<HTMLDivElement>>;

interface RichSelectOption {
    /** Stable key used as the selection value. */
    value: string;
    /** Rich primary content — string or JSX. */
    label: React$1.ReactNode;
    /** Secondary line shown muted under the label. */
    description?: React$1.ReactNode;
    /** Lucide glyph or any component accepting `{ size }`. */
    icon?: React$1.ElementType;
    /** Trailing content (e.g. a count or status badge), pushed to the right. */
    badge?: React$1.ReactNode;
    disabled?: boolean;
}
interface RichSelectProps {
    options: RichSelectOption[];
    /** `string` in single mode, `string[]` in multi mode. */
    value: string | string[];
    /** Fired with the new selection — mirrors the mode of {@link value}. */
    onChange: (value: string | string[]) => void;
    /** Enable multi-select (checkboxes). Default `false` (radio). */
    multiple?: boolean;
    /** Menu heading and default trigger prefix. */
    label?: string;
    /** Trigger content when nothing is selected. */
    placeholder?: React$1.ReactNode;
    /** Full custom row JSX. Overrides the default row layout. */
    renderOption?: (option: RichSelectOption, state: {
        selected: boolean;
    }) => React$1.ReactNode;
    /** Full custom trigger JSX for the current selection. Overrides the default. */
    renderValue?: (selected: RichSelectOption[]) => React$1.ReactNode;
    /** Menu alignment relative to the trigger. Default `'start'`. */
    align?: "start" | "center" | "end";
    /**
     * Side the menu opens toward, relative to the trigger. Default `'bottom'`.
     * Use `'top'` when the trigger sits in a footer so options open upward.
     * Radix still flips on collision if the chosen side lacks space.
     */
    side?: "top" | "right" | "bottom" | "left";
    /** Gap in px between the trigger and the menu. Default `4`. */
    sideOffset?: number;
    /** Trigger tooltip content; omit to disable the tooltip. */
    tooltip?: React$1.ReactNode;
    /** Side the trigger tooltip is placed on. Default `'top'`. */
    tooltipSide?: "top" | "right" | "bottom" | "left";
    disabled?: boolean;
    /** Class merged onto the trigger Button. */
    triggerClassName?: string;
    /** Class merged onto the dropdown content. */
    contentClassName?: string;
    /** Alias of {@link triggerClassName} for ergonomics. */
    className?: string;
}
/**
 * A `<select>` replacement built on {@link DropdownMenu}. Each option carries
 * rich content (`label`, `description`, `icon`, `badge`) and both the rows and
 * the trigger are fully customizable via `renderOption` / `renderValue`.
 * Supports single (radio) and multi (checkbox) selection via `multiple`.
 */
declare function RichSelect({ options, value, onChange, multiple, label, placeholder, renderOption, renderValue, align, side, sideOffset, tooltip, tooltipSide, disabled, triggerClassName, contentClassName, className, }: RichSelectProps): React$1.JSX.Element;

/** A slice along the axes the matched model **declared**. */
interface RuleSelect {
    time?: {
        axis: string;
        from?: string;
        to?: string;
    };
    geo?: {
        axis: string;
        vocab?: string;
        in: string[];
    };
    dims?: Record<string, string[]>;
}
/**
 * What a published model version says may be narrowed.
 *
 * Empty is the default and means *nothing is selectable* — the model can still
 * be allowed or denied whole, it simply cannot be sliced. Nothing is inferred
 * from a property's name or type, because that would make *which rows did this
 * run see* depend on a guess.
 */
interface DeclaredAxes {
    time?: {
        property: string;
    };
    geo?: {
        property: string;
        vocab?: string;
    };
    dims?: string[];
}
interface SliceLine {
    /** `time` · `geo` · a dimension's own name. */
    axisKind: string;
    text: string;
    /** The model declared no such axis — this slice would be refused at save. */
    undeclared?: boolean;
}
/**
 * One slice, as lines, with **the axis always named**.
 *
 * `time 2026-01-01 → 2026-06-30 · axis signed_at`. The axis is never implied: a
 * model declares which property carries valid time, two models in one Graph
 * declare different ones, and *which rows did this run see* must not depend on
 * the reader guessing which was used.
 *
 * When `declared` is given, a slice along an axis the model never declared is
 * marked — that is the refusal the authoring form has to show before a save,
 * naming the model **and** the axis.
 */
declare function describeSlice(select: RuleSelect, declared?: DeclaredAxes): SliceLine[];
interface SliceSummaryProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    select?: RuleSelect;
    /**
     * The matched model version's declared axes. Given, the summary can mark a
     * slice the model cannot support; omitted, it states the slice and claims
     * nothing about whether it is legal.
     */
    declaredAxes?: DeclaredAxes;
    /** Which model is being sliced — named in the undeclared-axis refusal. */
    modelLabel?: string;
    /** `line` sits under a `RuleRow`; `block` stands alone on W3 and R2. */
    variant?: "line" | "block";
}
/**
 * What a rule narrows to, stated so the axis is never in doubt.
 *
 * **The axis is always named.** See {@link describeSlice} — this is the one
 * rule the component exists to hold, and it is why a slice is a component
 * rather than a template string at each call site.
 *
 * **An undeclared axis is shown, not hidden.** A lens asking for an axis a
 * model never declared is refused at save naming the model and the axis, so the
 * form has to render the illegal state on the way to being told about it.
 * Silently dropping the line would make the refusal arrive from nowhere.
 *
 * `variant="line"` is what a `RuleRow` renders — the same description, so the
 * two never drift into two accounts of one slice.
 */
declare const SliceSummary: React$1.ForwardRefExoticComponent<SliceSummaryProps & React$1.RefAttributes<HTMLDivElement>>;

/** Which properties of the matched participant survive into the answer. */
interface RuleProperties {
    /**
     * Excluded by name. Exclusion is the only form: an allow-list of properties
     * would silently drop a property added to the model later, which is the kind
     * of bound that stops applying without anybody editing it.
     */
    exclude?: string[];
}
/** What may accompany a crossing to this destination. */
interface RuleEgress {
    may_send: string[];
}

interface RuleRowProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** The address pattern this rule matches — `graph_data/model/Deals@*`. */
    match: string;
    /** `true` allows, `false` denies. Deny wins at any specificity. */
    allow: boolean;
    properties?: RuleProperties;
    select?: RuleSelect;
    egress?: RuleEgress;
    /**
     * The row is being read rather than authored. Read-only rows lose the hover
     * affordance, so a guardrail somebody cannot edit does not look pressable.
     */
    readOnly?: boolean;
}
/**
 * One rule, read as a sentence: what it matches, whether it allows, and what it
 * narrows.
 *
 * It is the unit of a `LayerSection`, so a lens reads as five bands of these
 * rather than a table of five columns most of which are empty — a rule that
 * slices carries a select line, one that does not carries nothing.
 *
 * **Deny is the loud one.** An allow is the ordinary state and sits muted; a
 * deny takes the destructive token, because [deny wins at any specificity] and
 * a reader scanning a long lens for *what is shut* should find it without
 * reading every row.
 *
 * The sub-lines are facts about the match, so they hang under it and inherit
 * its indent rather than becoming columns. A row with none of them is one line
 * tall, which is what most rows are.
 */
declare const RuleRow: React$1.ForwardRefExoticComponent<RuleRowProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * How a run or a step ended, as the engine writes it — **suggestions, not a
 * limit.** An unknown status still renders: it says its own name, in the
 * neutral.
 */
type KnownRunStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled" | "cannot_answer" | "awaiting_approval" | "skipped" | "held" | "purged";
type RunStatus = KnownRunStatus | (string & {});
/**
 * Which tone each status is read in.
 *
 * The kit owns this map where it does **not** own a layer's or a bound's
 * colour, and the difference is real: a layer is a product's vocabulary, while
 * *finished · finished but look at it · failed · not started* is the same small
 * set of states every surface in the system already draws with `StatusDot`. Two
 * maps for one idea is how a journal row and its own pagehead come to disagree.
 *
 * **`succeeded` and `cannot_answer` are deliberately different tones.** The
 * machinery succeeded; the reading is that the graph cannot answer inside this
 * world. A run that says both in one green word would be hiding the only fact
 * the reader needs ([SR53]).
 */
declare const TONE: Record<string, StatusDotProps["tone"]>;
interface RunStatusTextProps extends Omit<React$1.HTMLAttributes<HTMLSpanElement>, "children"> {
    status: RunStatus;
    /** Overrides the tone {@link RunStatus} resolves to. */
    tone?: StatusDotProps["tone"];
    /** Draw the dot before the word. Off in a table cell, on in a row. */
    dot?: boolean;
    /** What to call it, when the engine's own word is not what this surface says. */
    label?: React$1.ReactNode;
}
/**
 * A run's outcome, in its tone and in the engine's own word.
 *
 * `succeeded` · `running` · `cannot_answer` · `awaiting_approval` — written as
 * the record writes them, underscores and all, because these are the values a
 * reader filters on and quotes into a support thread. Prettifying them here
 * would mean the word on screen is not the word in the API.
 *
 * The word is always present, so colour is never the only carrier of the state.
 */
declare const RunStatusText: React$1.ForwardRefExoticComponent<RunStatusTextProps & React$1.RefAttributes<HTMLSpanElement>>;

interface RunRowProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "title" | "onSelect"> {
    status: RunStatus;
    /** Overrides the tone the status resolves to. */
    tone?: StatusDotProps["tone"];
    kind?: RunKind;
    /**
     * The run's address — the last eight characters of its uuid, mono.
     *
     * **First on the row, before anything measured.** A row a reader cannot
     * quote into a log line, a support thread or `GET …/runs/{id}` has made them
     * drill in to find out what they are looking at.
     */
    address?: React$1.ReactNode;
    /** What it was about — the question asked, the dataset loaded, the stitch run. */
    title: React$1.ReactNode;
    /** Under it — `2m 51s · 21.4k · 9/9 · 4 mins ago`. */
    meta?: React$1.ReactNode;
    /** Hard right — a badge, a count, an outcome. */
    aside?: React$1.ReactNode;
    /** A child run sits under the step that spawned it, indented — never a sibling. */
    depth?: number;
    selected?: boolean;
    onSelect?: () => void;
}
/**
 * One run in the journal.
 *
 * Every execution in a Graph is one of these — a question answered, a dataset
 * loaded, a stitch committed, an enrichment gated on a person — because they
 * are one record walked by one interpreter. **There is no row type per kind**
 * and no panel per kind: the kind is a chip and a filter value, which is what
 * keeps one journal from becoming four lists that drift apart.
 *
 * The order on the row is addressed, then described, then measured: the id, the
 * kind, what it was about, and the numbers underneath. A reader scanning for
 * *the run I was just looking at* finds it by id; a reader scanning for *what
 * has this system been doing* reads the line under it.
 *
 * With `onSelect` the whole row is one button, so the accessible name is the
 * whole row — the id, the kind and the summary in one string, which is exactly
 * what a reader driving this from the keyboard needs to hear.
 */
declare const RunRow: React$1.ForwardRefExoticComponent<RunRowProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * `sm` (26px) is the application field — a search box docked in a panel header,
 * beside a 30px tab strip. `default` (40px) stays the page size.
 *
 * Named `inputSize` for the same reason `Input` is: `size` is already an
 * `<input>` attribute meaning "how many characters wide".
 */
type SearchInputSize = 'default' | 'sm';
interface SearchInputProps extends Omit<React__default.ComponentProps<'input'>, 'value' | 'onChange' | 'size' | 'type'> {
    className?: string;
    value: string;
    /** Receives the raw string, not the event — a search box has one value. */
    onChange: (value: string) => void;
    inputSize?: SearchInputSize;
}
declare const SearchInput: React__default.FC<SearchInputProps>;

interface SectionHeaderProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "title"> {
    /** Sits before the title. A 14px lucide icon, usually. */
    icon?: React$1.ReactNode;
    /** What this section is. */
    title: React$1.ReactNode;
    /**
     * How many things are in it — `4`, `6 shown · 1 hidden`, `derived`.
     *
     * Kept separate from `actions` because a count is a fact about the section
     * and an action is something you do to it. They read differently and they
     * align differently.
     */
    count?: React$1.ReactNode;
    /** Trailing controls — `+ add`, `edit`, a toggle. */
    actions?: React$1.ReactNode;
    /** Renders the header without its bottom rule, for a section that opens a card. */
    bare?: boolean;
}
/**
 * The bar that titles one section of a panel.
 *
 * A panel is a stack of these: Node types, Edge types, Relationships, Selected,
 * Anchors, Recent plans. It is 35px because that is what reads as a heading
 * against 30px rows without becoming a second toolbar.
 *
 * Not a `<Card>` header — a section is a band inside a scrolling panel, not a
 * container, so it carries a rule rather than a border box.
 */
declare const SectionHeader: React$1.ForwardRefExoticComponent<SectionHeaderProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface SparklineProps extends Omit<React$1.SVGAttributes<SVGSVGElement>, "children" | "values"> {
    values: number[];
    width?: number;
    height?: number;
    color?: string;
    /** Washes the area under the line at 10%. Off by default at this size. */
    area?: boolean;
    /** A filled dot on the last point, ringed in the surface colour. */
    endMarker?: boolean;
    /** What the line is, for assistive tech. The surface around it usually says. */
    label?: string;
}
/**
 * The shape of a series, small enough to sit inside a row.
 *
 * No axis, no gridlines, no labels — a sparkline answers "which way, and how
 * steadily", and the number it accompanies answers "how much". If a reader
 * needs to read a value off it, it wanted to be a chart.
 *
 * The end marker carries a 2px ring in the surface colour so it stays legible
 * where the line runs under it.
 */
declare const Sparkline: React$1.ForwardRefExoticComponent<SparklineProps & React$1.RefAttributes<SVGSVGElement>>;

interface TabConfig {
    /** Unique identifier for the tab */
    value: string;
    /** Label text or custom React node to display in the tab */
    label: string | React__default.ReactNode;
    /**
     * Plain-text name for the tab's tooltip and its accessible name. Only needed
     * when `label` is a node rather than a string — the value is used otherwise.
     */
    name?: string;
    /** Optional icon component to show before the label */
    icon?: React__default.ElementType;
    /** Content to display when this tab is active */
    content: React__default.ReactNode;
    /** Whether this tab should be disabled */
    disabled?: boolean;
}
interface TabbedPanelProps {
    /** Array of tab configurations */
    tabs: TabConfig[];
    /** Default active tab value (uncontrolled mode) */
    defaultTab?: string;
    /** Controlled active tab value */
    activeTab?: string;
    /** Callback when tab changes */
    onTabChange?: (value: string) => void;
    /**
     * Actions on the right of the tab bar, as `NavHorizontal` items. A panel
     * header has one action area — the right — so this is the item list itself
     * rather than full `NavHorizontal` props: the tabs already own the left.
     *
     * Give an item `menuItems` and it becomes a `…` overflow dropdown. Closing
     * is one of these items and nothing more; there is no close prop.
     *
     * ```tsx
     * headerActions={[
     *   { name: "Split editor", icon: Columns2, onClick: split },
     *   { name: "Close panel", icon: X, onClick: close },
     * ]}
     * ```
     */
    headerActions?: NavHorizontalItem[];
    /**
     * Fold the tabs that do not fit the header into a `…` dropdown at the end of
     * the strip, instead of letting the strip set the panel's minimum width.
     *
     * **Off by default**, so an existing panel renders exactly as it did. Turn it
     * on for a panel whose width the user controls — a resizable inspector, a
     * side panel — or any strip carrying more than a handful of tabs. The active
     * tab never folds, and arrowing onto a folded one brings it back.
     *
     * ```tsx
     * <TabbedPanel overflow tabs={nineOfThem} />
     * ```
     */
    overflow?: boolean;
    /** Accessible name for the overflow trigger. */
    overflowLabel?: string;
    /**
     * Keep every tab's content mounted and hide the inactive ones, instead of
     * mounting only the active tab.
     *
     * Off by default. Turn it on when a panel's tabs hold state worth keeping —
     * a scroll position, a half-typed edit, a live canvas — and pay for it in
     * the work every hidden tab keeps doing.
     */
    keepMounted?: boolean;
    /** Additional CSS classes for the container */
    className?: string;
    /** Additional CSS classes for the header */
    headerClassName?: string;
    /** Additional CSS classes for the body/content area */
    bodyClassName?: string;
    /** Additional CSS classes for the footer */
    footerClassName?: string;
    /** Optional footer content */
    footerContent?: React__default.ReactNode;
}
/**
 * TabbedPanel — a panel whose views sit behind one 30px tab strip.
 *
 * The strip is a `NavItems` tab list (`variant="underline"`), not a Radix
 * `Tabs`: the same component draws this kit's nav rails and its workbook tabs,
 * so tab keyboard behaviour, the `…` overflow and the three visual treatments
 * are written once. Switching content here is a plain `active === value`,
 * which is what makes `keepMounted` possible — Radix unmounts an inactive
 * `TabsContent`, and a panel that tears its canvas down on every tab switch is
 * not a panel anyone wants.
 */
declare function TabbedPanel({ tabs, defaultTab, activeTab, onTabChange, headerActions, overflow, overflowLabel, keepMounted, className, headerClassName, bodyClassName, footerClassName, footerContent, }: TabbedPanelProps): React__default.JSX.Element;

/**
 * What a task did with its slice of the run's clock.
 *
 * These are the engine's own step statuses (`StepStatus`, plus `skipped` for a
 * branch that never ran), not a second vocabulary: a Gantt row and a log line
 * are the same task seen twice, so they say the same word for the same state.
 */
type TaskGanttStatus = "succeeded" | "running" | "failed" | "needs_input" | "stopped" | "skipped" | "queued";
/** A `Date`, an ISO string, or epoch milliseconds — whatever the JSON carried. */
type TaskGanttInstant = string | number | Date;
/**
 * One bar. A task is usually one of these; a retried task is two or more, the
 * failed attempt sitting to the left of the one that stuck.
 */
interface TaskGanttSegment {
    /** Offset from the run's zero. Use this, or `startedAt` with `origin`. */
    startMs?: number;
    durationMs?: number;
    startedAt?: TaskGanttInstant;
    finishedAt?: TaskGanttInstant;
    status?: TaskGanttStatus;
    /** Overrides the hover text, which otherwise reads `key · status · duration`. */
    title?: string;
}
interface TaskGanttTask extends TaskGanttSegment {
    /** `task_key` — what the log lines call this task. Also the row's label. */
    key: string;
    /** Shown instead of `key`, when the row wants a human name. */
    label?: React$1.ReactNode;
    /** Earlier attempts, oldest first. A failed one draws in `destructive`. */
    attempts?: TaskGanttSegment[];
    /** Overrides the right-hand duration cell. `—` when the task never ran. */
    duration?: React$1.ReactNode;
    /** One line — what the task said. The card's last line. */
    log?: React$1.ReactNode;
    /** A sentence under the card's header, when the row wants one. */
    summary?: React$1.ReactNode;
    /**
     * What the task produced — its `result.json`, or any part of it.
     *
     * An object renders as label/value pairs, with nested values as JSON; a node
     * renders as given, which is the hook for a kind-specific card (a table
     * preview, a subgraph thumb) without replacing the whole body.
     */
    result?: React$1.ReactNode | Record<string, unknown>;
    /** Why it failed. Drawn in `destructive`, above the result. */
    error?: {
        code?: React$1.ReactNode;
        message?: React$1.ReactNode;
        detail?: React$1.ReactNode;
    };
    /** Replaces this row's card body entirely. */
    detail?: React$1.ReactNode;
}
interface TaskGanttProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    /** One entry per task, in plan order — the run's `steps`, grouped by task. */
    tasks: TaskGanttTask[];
    /** The run's zero, when tasks carry timestamps. Defaults to the earliest one. */
    origin?: TaskGanttInstant;
    /** The clock's ceiling. Defaults to the last end, or `nowMs` if that is later. */
    spanMs?: number;
    /** Draws the *now* line. Set it while the run is in flight; omit it after. */
    nowMs?: number;
    /** Marks the last axis label `8s+` — the run has not decided its own length yet. */
    openEnded?: boolean;
    /** Intervals on the axis. Five labels by default. */
    ticks?: number;
    formatTick?: (ms: number) => string;
    formatDuration?: (ms: number) => string;
    /** The key column, in px. 112 in the drawer, wider on a dashboard. */
    labelWidth?: number;
    /**
     * `compact` in a drawer, `comfortable` on a dashboard. It moves the bar's
     * height, not the type scale — one component, three surfaces (SR14).
     */
    density?: "compact" | "comfortable";
    /**
     * The card on hover. On by default; a row with nothing to say shows none.
     *
     * Supplementary by design — the same facts are in the log band and in
     * `result.json`, because a hover card is not reachable by touch.
     */
    showDetail?: boolean;
    /**
     * Replaces the default card body, for every row. Return `null` for a row that
     * should not open one.
     */
    renderDetail?: (task: TaskGanttTask) => React$1.ReactNode;
    /** Where the card sits, how fast it opens, and how wide it is. */
    detailProps?: TaskGanttDetailProps;
    /** The task the log is currently filtered to (SR15). */
    selectedKey?: string | null;
    /** Makes the rows pickable. Picking one is what filters the log. */
    onSelectTask?: (key: string) => void;
}
interface TaskGanttDetailProps {
    /** @default "right" */
    side?: "top" | "right" | "bottom" | "left";
    /** @default "start" */
    align?: "start" | "center" | "end";
    sideOffset?: number;
    /** @default 200 */
    openDelay?: number;
    /** @default 80 */
    closeDelay?: number;
    /** The card's width. A `result.json` wants more than the 256px default. */
    width?: number | string;
    className?: string;
}
interface TaskGanttDetailCardProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    task: TaskGanttTask;
    /** Elapsed so far, for a task still running — it has no `durationMs` yet. */
    elapsedMs?: number;
    formatDuration?: (ms: number) => string;
}
/**
 * What one task did, as a card.
 *
 * The body of the hover card, and exported so a surface can compose its own
 * around the same header — `renderDetail` returning this with a kind-specific
 * block under it is the intended way to specialise, rather than redrawing the
 * header and drifting the status vocabulary.
 *
 * Order is fixed and is the order a reader asks in: what state, how long, what
 * went wrong, what came out, what it said last.
 */
declare const TaskGanttDetailCard: React$1.ForwardRefExoticComponent<TaskGanttDetailCardProps & React$1.RefAttributes<HTMLDivElement>>;
/**
 * Where the time went — one row per task, on the run's own clock.
 *
 * Duration is the question a run detail is opened with, and a step list with a
 * duration column answers it one row at a time. A bar placed by start and sized
 * by duration puts the slow task, the retry and the branch that never ran in one
 * glance (SR14).
 *
 * It is one component across three surfaces — the Runs drawer (compact, with a
 * line of log per row), the run dashboard (full width, logs off) and the
 * document rendering — so `density` and `showLogs` are props, not three
 * drawings.
 *
 * Colour never carries state alone: every row names its duration, the bar
 * titles itself with its status, and a task that never ran is an *outline*
 * rather than a paler fill.
 */
declare const TaskGantt: React$1.ForwardRefExoticComponent<TaskGanttProps & React$1.RefAttributes<HTMLDivElement>>;

interface TaskNodeTag {
    /** `3 lanes`, `attempt 2`, `map_over: datasets`. */
    label: React$1.ReactNode;
    /** `warning` for a retry or a hold; plain otherwise. */
    tone?: "default" | "warning";
}
interface TaskNodeProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    /** The task's `step_key`. Mono, because it is an identifier. */
    taskKey: React$1.ReactNode;
    /** What it may spend. */
    bound: Bound;
    /** The bound's swatch class, given directly — `bg-data-7`. */
    boundSwatch?: string;
    /** The bounds' palette, when a caller would rather state the map once. */
    boundPalette?: BoundPalette;
    /**
     * How it went, when this node is painting a **run**. Omit when the node is
     * painting a plan or a draft, which have no status of their own.
     */
    status?: StatusDotProps["tone"];
    /** Chips on the bound line — lanes, attempts, a `map_over`. */
    tags?: TaskNodeTag[];
    /**
     * The one line under the chips: what it did (`1,204 of 1,251 · 1.2s`), what
     * it will do (`when: counts differ`), or how it usually behaves
     * (`p50 3.4s · 14/14`). One rendering, three readings.
     */
    meta?: React$1.ReactNode;
    /**
     * The drawing is a **record**, not a draft: a picked node gets the ring and
     * **no handles**.
     *
     * Handles are an offer to move something. A run paints status onto the plan
     * it ran and nothing on it is editable, so a handle there is a control that
     * does nothing — the one thing worse on a trace than a missing affordance.
     */
    readOnly?: boolean;
    /** Picked — draws the ring and four corner handles. */
    selected?: boolean;
    /** Needs an approval before it writes. Rings it in `warning`. */
    gate?: boolean;
    /** Did not run on this pass — present in the plan, absent from the trace. */
    dim?: boolean;
    /** A placeholder slot on a draft canvas: dashed, no fill, no content of its own. */
    ghost?: boolean;
}
/**
 * One task in a flow, as a card.
 *
 * The same card serves three renderings, which is the point: a **run** paints
 * status onto it, a **plan** paints medians, a **draft** paints handles. One
 * component, so the three views cannot drift into three different pictures of
 * the same graph.
 *
 * It is presentational and knows nothing about a canvas — no position, no
 * camera, no store. Whatever lays a flow out places these; that is why the card
 * lives here rather than in `@invana/canvas-ui`, and why `selected` is a prop
 * rather than something read from a selection.
 */
declare const TaskNode: React$1.ForwardRefExoticComponent<TaskNodeProps & React$1.RefAttributes<HTMLDivElement>>;

interface TemplateOption {
    /** The projection template — `table-compact@3`. */
    id: string;
    kind: EmissionKind;
    /**
     * Why it cannot be used on these records — `needs a time column`,
     * `needs 1 record, has 4`.
     *
     * Present means unavailable. Saying *why* is the point: a greyed row with no
     * reason reads as a bug.
     */
    unavailable?: React$1.ReactNode;
    /** A note on an available row — `in use`, `sandboxed`. */
    note?: React$1.ReactNode;
}
interface TemplatePickerProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    /** How many records are being re-rendered — `Render these 4 records as`. */
    heading?: React$1.ReactNode;
    options: TemplateOption[];
    value?: string;
    onSelect?: (id: string) => void;
    /** The reassurance under the list. */
    footnote?: React$1.ReactNode;
}
/**
 * Render the same records a different way.
 *
 * It hangs off an emission's header, because a template belongs to **that
 * emission** — not to the thread, and not to a setting somewhere else.
 *
 * Switching re-renders from records already in hand: **the query does not run
 * again**. That is why unavailable options are listed rather than hidden — the
 * reason a template does not fit ("needs a time column") is information about
 * the data, and hiding it would leave the reader wondering what else exists.
 */
declare const TemplatePicker: React$1.ForwardRefExoticComponent<TemplatePickerProps & React$1.RefAttributes<HTMLDivElement>>;

type TerminalLineKind = "prompt" | "output" | "comment";
/**
 * The severity a **log** line was emitted at, as the runtime recorded it.
 *
 * Distinct from `kind`, which says what part of a *transcript* a line is — a
 * command you typed, what it printed, a comment. A run's log has no prompts and
 * no comments; every line is output, and what varies is how loud it is.
 */
type KnownTerminalLevel = "info" | "warn" | "error" | "debug";
/**
 * The values the kit draws specially — **suggestions, not a limit.** Anything
 * else renders with the neutral token and its own name.
 */
type TerminalLevel = KnownTerminalLevel | (string & {});
interface TerminalLineProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    kind?: TerminalLineKind;
    /**
     * How loud this line is. Tints **one** cell — the one named by
     * `levelColumn` — and nothing else.
     *
     * Only the level word is coloured, never the message: a wall of amber
     * sentences is unreadable, and what a reader scans is the column, not the
     * prose. Setting this also drops the `kind` marker — a log line is not a
     * transcript line and does not want a `→` in front of it.
     *
     * The level **word** stays in `columns`. Colour is never the carrier.
     */
    level?: TerminalLevel;
    /**
     * Which cell of `columns` holds the level word. Defaults to `1`, because a
     * log line reads `time · LEVEL · source · message` and the timestamp comes
     * first in every log anyone has ever read.
     */
    levelColumn?: number;
    /**
     * Columns, for the step-shaped output a run prints — name, detail, timing,
     * result. Given as cells so they align down the transcript instead of each
     * line padding itself with spaces.
     */
    columns?: React$1.ReactNode[];
    children?: React$1.ReactNode;
}
interface TerminalProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children?: React$1.ReactNode;
    /** Shows a blinking block at the end. */
    cursor?: boolean;
    /**
     * `grid-template-columns` for every columned line in this transcript.
     *
     * Set once here rather than per line, because the point of columns is that
     * they line up *down* the transcript — a width chosen per row aligns nothing.
     */
    columnTemplate?: string;
}
/**
 * A shell transcript, as a first-class surface.
 *
 * Some of this product's work happens outside Studio — imports run from the
 * CLI, a scheduler calls the Python API — and the hand-off has to be shown
 * honestly rather than redrawn as a wizard. So this renders what the terminal
 * actually printed.
 *
 * It is presentational: a record of a run that already happened, not a live
 * console. There is no input here, and it does not scroll itself.
 */
declare const Terminal: React$1.ForwardRefExoticComponent<TerminalProps & React$1.RefAttributes<HTMLDivElement>>;
declare const TerminalLine: React$1.ForwardRefExoticComponent<TerminalLineProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * How the list arranges one entry.
 *
 * `columns` — `when` is a fixed left column, entries divided by a rule. The
 * dense-log shape: `when` is short and uniform (`Fri 08:00`) and a reader
 * scanning for "what changed on Friday" reads down one edge. Needs the width.
 *
 * `rail` — `when` sits above the title and a line threads the markers. For a
 * narrow card or sidebar, where a 72px column would eat a third of the width
 * and titles wrap anyway; the rail supplies the alignment the column was.
 */
type TimelineVariant = "columns" | "rail";
interface TimelineEntryProps extends Omit<React$1.HTMLAttributes<HTMLLIElement>, "title"> {
    /** When — `Fri 5 Sep`, `09:47`, `Sun`. */
    when: React$1.ReactNode;
    /** A one-line summary. The body below carries the detail. */
    title?: React$1.ReactNode;
    /** A marker in the rail — a `StatusDot`, usually. */
    marker?: React$1.ReactNode;
    children?: React$1.ReactNode;
}
interface TimelineListProps extends React$1.HTMLAttributes<HTMLOListElement> {
    /** @default "columns" */
    variant?: TimelineVariant;
    children?: React$1.ReactNode;
}
interface TimelineFooterProps extends React$1.HTMLAttributes<HTMLLIElement> {
    children?: React$1.ReactNode;
}
/**
 * What happened, newest first.
 *
 * A task's history, a session's past rounds, a schedule's firings. An `<ol>`
 * because the order carries meaning — these are events in sequence, not a set.
 *
 * Both variants take the same entries; only the arrangement differs. See
 * `TimelineVariant` for which one a surface wants.
 */
declare const TimelineList: React$1.ForwardRefExoticComponent<TimelineListProps & React$1.RefAttributes<HTMLOListElement>>;
declare const TimelineEntry: React$1.ForwardRefExoticComponent<TimelineEntryProps & React$1.RefAttributes<HTMLLIElement>>;
/**
 * What to do next, at the end of the rail — `View changelog →`, `See all runs`.
 *
 * The rail runs into it, which is what says the list continues rather than
 * stops. `role="presentation"` because a footer is not one of the events: it
 * drops the `<li>` from the list's count while its content stays readable.
 *
 * `columns` has no rail to run on, so the footer is a plain last row there.
 */
declare const TimelineFooter: React$1.ForwardRefExoticComponent<TimelineFooterProps & React$1.RefAttributes<HTMLLIElement>>;

declare const Toolbar: React__default.FC;

interface TouchItem {
    layer: Layer;
    /** What it amounts to — `3 calls`, `1,284 rows`, `miss`, `asked + approved`. */
    note?: React$1.ReactNode;
    /** What to call it, when {@link layerLabel} is not what this surface says. */
    label?: React$1.ReactNode;
    /** A guardrail said no. Struck in place, never dropped. */
    refused?: boolean;
    /** Allowed, and nothing reached for it. Present, and visibly not in play. */
    dim?: boolean;
}
interface TouchStripProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    items: TouchItem[];
    palette?: LayerPalette;
}
/**
 * What a run touched at all — one cell per layer, on one line.
 *
 * This is a **summary**, and the whole reason it is a strip and not an axis.
 * *What did this touch* is answered once for the whole run, so it costs one
 * line above the list; drawn as a band per layer down a trace it would be a
 * matrix one sixth full, because a step spends exactly one layer.
 *
 * **Refused is struck in place and never touched is dimmed, and neither is
 * hidden.** The gap between what a world allowed and what the run reached for
 * is the finding: three layers allowed and never touched is an invitation to
 * narrow, and a refusal is an invitation to widen or to accept that the graph
 * cannot answer. A strip that showed only what was spent could say neither.
 */
declare const TouchStrip: React$1.ForwardRefExoticComponent<TouchStripProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * A single clickable/displayed reference shown in a step's
 * "REFERENCED COMPONENTS" row.
 */
interface TourReference {
    label: string;
    /** Optional leading icon (e.g. a Lucide component). */
    icon?: React$1.ElementType;
    /** When set, the chip becomes a button. */
    onClick?: () => void;
}
/**
 * A single step of a {@link Tour}. Provide the typed fields for the standard
 * layout, or use {@link TourStep.content} as an escape hatch to render a fully
 * custom body.
 */
interface TourStep {
    id?: string;
    title: React$1.ReactNode;
    body?: React$1.ReactNode;
    /** Highlighted callout box, e.g. label "LANGUAGE LESSON". */
    callout?: {
        label?: string;
        content: React$1.ReactNode;
    };
    /** Chip row, e.g. label "REFERENCED COMPONENTS". */
    references?: {
        label?: string;
        items: TourReference[];
    };
    /** Replaces the typed body/callout/references region when provided. */
    content?: React$1.ReactNode;
}
/** Step state + navigation handlers, produced by {@link useTour}. */
interface TourController {
    step: TourStep | undefined;
    /** 0-based index of the active step. */
    current: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
    next: () => void;
    prev: () => void;
    goTo: (index: number) => void;
    exit: () => void;
}
interface UseTourOptions {
    steps: TourStep[];
    /** Initial 0-based step index. Default `0`. */
    initialStep?: number;
    /** Wrap around at the ends instead of stopping. Default `false`. */
    loop?: boolean;
    onStepChange?: (index: number) => void;
    /** Called when `next` is pressed on the last step (and not looping). */
    onComplete?: () => void;
    /** Called when `exit` is invoked. */
    onExit?: () => void;
}
/**
 * Headless controller for a {@link Tour}. Owns the current step index and
 * exposes navigation handlers. Pass the result to `<Tour controller={...} />`,
 * or let `<Tour steps={...} />` manage its own controller internally.
 */
declare function useTour(options: UseTourOptions): TourController;
type TourPosition = "static" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
interface TourProps {
    /** External controller from {@link useTour}. Omit to self-manage from `steps`. */
    controller?: TourController;
    /** Steps used to build an internal controller when `controller` is omitted. */
    steps?: TourStep[];
    onExit?: () => void;
    onComplete?: () => void;
    badgeLabel?: string;
    prevLabel?: string;
    nextLabel?: string;
    /** Label for the Next button on the last step. */
    finishLabel?: string;
    exitLabel?: string;
    showExit?: boolean;
    /** Show the "{current} / {total}" counter. Default `true`. */
    showCounter?: boolean;
    /** Show a slim progress bar under the header. Default `false`. */
    showProgressBar?: boolean;
    position?: TourPosition;
    className?: string;
}
/**
 * A self-contained, step-through tour panel: header with a label badge, step
 * counter and exit action; a body with title, copy, an accented callout and a
 * row of reference chips; and Prev / Next footer controls.
 *
 * @example
 * ```tsx
 * <Tour steps={steps} onExit={close} onComplete={close} />
 * ```
 * @example
 * ```tsx
 * const tour = useTour({ steps, onExit: close });
 * <Tour controller={tour} position="bottom-right" />
 * ```
 */
declare function Tour({ controller, steps, onExit, onComplete, badgeLabel, prevLabel, nextLabel, finishLabel, exitLabel, showExit, showCounter, showProgressBar, position, className, }: TourProps): React$1.JSX.Element | null;

interface TraceListProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children?: React$1.ReactNode;
}
/**
 * A run, in the order it happened.
 *
 * The default reading of a trace, because *what happened, and then what* is the
 * cheapest honest answer to a reader opening a run. Its rows are
 * {@link TraceStep}s; a bounded repetition **contains** its rounds
 * ({@link TraceLoop}) and a gate lies **between** rows ({@link TraceGate}).
 *
 * Nothing here is an axis. The layer a step spent is a column on its row, so a
 * list nests for free and a second round is simply another row inside the box
 * that holds it. The clock reading of the same trace is `LayerStrip`.
 */
declare const TraceList: React$1.ForwardRefExoticComponent<TraceListProps & React$1.RefAttributes<HTMLDivElement>>;
interface TraceStepProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onSelect" | "role"> {
    /** Where it sits in the run — the sequence number. */
    seq?: React$1.ReactNode;
    /** The step's key — `execute_query`. Mono, because it is the plan's own word. */
    name: React$1.ReactNode;
    /** One line: what it did, in the graph's terms. */
    description?: React$1.ReactNode;
    /** The participant class it spent. A step spends exactly one. */
    layer?: Layer;
    /** What it spent it on — `extract`, `decide`, `read_only`, `schema`. */
    role?: React$1.ReactNode;
    /** How long it took, or `—` when it never ran. */
    duration?: React$1.ReactNode;
    /** Under the duration — `ok`, `round 2`, `1,284 rows`, `skipped`. */
    note?: React$1.ReactNode;
    /** The exception this row carries — a `MarkChip`. */
    mark?: React$1.ReactNode;
    palette?: LayerPalette;
    /** A delegated run's steps sit under the step that spawned them. */
    depth?: number;
    /** Dispatched to nobody: queued, held, or never reached. Present, not in play. */
    dim?: boolean;
    /** It ran and it failed, or it was refused. The name is struck, in the destructive tone. */
    struck?: boolean;
    selected?: boolean;
    onSelect?: () => void;
}
/**
 * One event of a run: a step, and everything that is true of it.
 *
 * **The stripe is the layer.** A step touches exactly one participant class, so
 * the layer is a 3px rail down the row rather than a column of its own — which
 * leaves the row's width for the two things a reader is actually scanning, the
 * step's key and what it did.
 *
 * A row keeps its place in every state. A step that is painting right now, one
 * that was skipped because the step above it failed, one that was refused: all
 * three stay where they sit in the order, dimmed or struck. A list that dropped
 * them would be a list that cannot say *nothing below the failure was
 * dispatched*.
 */
declare const TraceStep: React$1.ForwardRefExoticComponent<TraceStepProps & React$1.RefAttributes<HTMLDivElement>>;
interface TraceLoopProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** What bounded it — `↻ 2 of 3 rounds — understood on round 2`. */
    label: React$1.ReactNode;
    /** Hard right — `3 events · 42.8s`. */
    summary?: React$1.ReactNode;
    /** The rail and wash it is drawn in. Defaults to the warning token. */
    tone?: "warning" | "info" | "muted";
    children?: React$1.ReactNode;
}
/**
 * A bounded repetition, drawn by containment.
 *
 * The rounds are **inside** it, so a second round is one more row in the box
 * and a list nests for free. Drawing a loop as a marker beside its rows would
 * make a reader reconstruct which rows it held; drawing it as a bracket down the
 * side is the clock reading's job, where the axis is time and rows are bands.
 */
declare const TraceLoop: React$1.ForwardRefExoticComponent<TraceLoopProps & React$1.RefAttributes<HTMLDivElement>>;
interface TraceGateProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** What it is — `approval — approved by ravi`. */
    label: React$1.ReactNode;
    /** What it cost — `waited 2m 04s · nothing was spent while it waited`. */
    note?: React$1.ReactNode;
    /** Defaults to the destructive token, which is what a stop is drawn in. */
    tone?: "destructive" | "warning" | "muted";
    /**
     * Which side of the line the cost falls on. `before` — nothing has been spent
     * yet; `after` — the work up to here is already paid for.
     */
    edge?: "before" | "after";
}
/**
 * A gate — a rule across the list, never a row in it.
 *
 * It is dispatched by nobody, holds no slot and spends no participant, so it is
 * not a step: it is a **condition on the way into one**. Drawn as a full-width
 * rule with its chip hung off the side the cost falls on, *above this, nothing
 * has been spent* becomes something the drawing says rather than something a
 * legend has to claim.
 */
declare const TraceGate: React$1.ForwardRefExoticComponent<TraceGateProps & React$1.RefAttributes<HTMLDivElement>>;

interface TreeViewProps {
    style?: React$1.CSSProperties;
    className?: string;
    items: TreeItem[];
    header?: React$1.ReactElement;
    searchable?: boolean;
}
declare const TreeView: React$1.FC<TreeViewProps>;
interface TreeItem {
    id: string | number;
    label: string;
    icon?: React$1.ReactElement<React$1.ComponentProps<'svg'>> | React$1.ReactNode;
    onClick?: (id: string | number, label: string) => void;
    isExpanded?: boolean;
    children?: TreeItem[];
}
declare const TreeItem: React$1.FC<{
    item: TreeItem;
}>;

declare const underDevelopmentVariants: (props?: ({
    size?: "sm" | "lg" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface UnderDevelopmentProps extends VariantProps<typeof underDevelopmentVariants> {
    title?: string;
    description?: string;
    iconSize?: number;
    className?: string;
}
declare function UnderDevelopment({ title, description, iconSize, size, className, }: UnderDevelopmentProps): React$1.JSX.Element;

interface TypographyPreProps extends React$1.HTMLAttributes<HTMLPreElement> {
}
declare const TypographyPre: React$1.ForwardRefExoticComponent<TypographyPreProps & React$1.RefAttributes<HTMLPreElement>>;

interface TypographyListProps extends React$1.HTMLAttributes<HTMLUListElement> {
}
declare const TypographyList: React$1.ForwardRefExoticComponent<TypographyListProps & React$1.RefAttributes<HTMLUListElement>>;

interface TypographyMutedProps extends React$1.HTMLAttributes<HTMLParagraphElement> {
}
declare const TypographyMuted: React$1.ForwardRefExoticComponent<TypographyMutedProps & React$1.RefAttributes<HTMLParagraphElement>>;

interface TypographySmallProps extends React$1.HTMLAttributes<HTMLElement> {
}
declare const TypographySmall: React$1.ForwardRefExoticComponent<TypographySmallProps & React$1.RefAttributes<HTMLElement>>;

interface TypographyLargeProps extends React$1.HTMLAttributes<HTMLDivElement> {
}
declare const TypographyLarge: React$1.ForwardRefExoticComponent<TypographyLargeProps & React$1.RefAttributes<HTMLDivElement>>;

interface TypographyLeadProps extends React$1.HTMLAttributes<HTMLParagraphElement> {
}
declare const TypographyLead: React$1.ForwardRefExoticComponent<TypographyLeadProps & React$1.RefAttributes<HTMLParagraphElement>>;

interface TypographyInlineCodeProps extends React$1.HTMLAttributes<HTMLElement> {
}
declare const TypographyInlineCode: React$1.ForwardRefExoticComponent<TypographyInlineCodeProps & React$1.RefAttributes<HTMLElement>>;

interface TypographyBlockquoteProps extends React$1.BlockquoteHTMLAttributes<HTMLQuoteElement> {
}
declare const TypographyBlockquote: React$1.ForwardRefExoticComponent<TypographyBlockquoteProps & React$1.RefAttributes<HTMLQuoteElement>>;

interface TypographyPProps extends React$1.HTMLAttributes<HTMLParagraphElement> {
}
declare const TypographyP: React$1.ForwardRefExoticComponent<TypographyPProps & React$1.RefAttributes<HTMLParagraphElement>>;

interface TypographyH6Props extends React$1.HTMLAttributes<HTMLHeadingElement> {
}
declare const TypographyH6: React$1.ForwardRefExoticComponent<TypographyH6Props & React$1.RefAttributes<HTMLHeadingElement>>;

interface TypographyH5Props extends React$1.HTMLAttributes<HTMLHeadingElement> {
}
declare const TypographyH5: React$1.ForwardRefExoticComponent<TypographyH5Props & React$1.RefAttributes<HTMLHeadingElement>>;

interface TypographyH4Props extends React$1.HTMLAttributes<HTMLHeadingElement> {
}
declare const TypographyH4: React$1.ForwardRefExoticComponent<TypographyH4Props & React$1.RefAttributes<HTMLHeadingElement>>;

interface TypographyH3Props extends React$1.HTMLAttributes<HTMLHeadingElement> {
}
declare const TypographyH3: React$1.ForwardRefExoticComponent<TypographyH3Props & React$1.RefAttributes<HTMLHeadingElement>>;

interface TypographyH2Props extends React$1.HTMLAttributes<HTMLHeadingElement> {
}
declare const TypographyH2: React$1.ForwardRefExoticComponent<TypographyH2Props & React$1.RefAttributes<HTMLHeadingElement>>;

interface TypographyH1Props extends React$1.HTMLAttributes<HTMLHeadingElement> {
}
declare const TypographyH1: React$1.ForwardRefExoticComponent<TypographyH1Props & React$1.RefAttributes<HTMLHeadingElement>>;

declare const Typography: {
    H1: React$1.ForwardRefExoticComponent<TypographyH1Props & React$1.RefAttributes<HTMLHeadingElement>>;
    H2: React$1.ForwardRefExoticComponent<TypographyH2Props & React$1.RefAttributes<HTMLHeadingElement>>;
    H3: React$1.ForwardRefExoticComponent<TypographyH3Props & React$1.RefAttributes<HTMLHeadingElement>>;
    H4: React$1.ForwardRefExoticComponent<TypographyH4Props & React$1.RefAttributes<HTMLHeadingElement>>;
    H5: React$1.ForwardRefExoticComponent<TypographyH5Props & React$1.RefAttributes<HTMLHeadingElement>>;
    H6: React$1.ForwardRefExoticComponent<TypographyH6Props & React$1.RefAttributes<HTMLHeadingElement>>;
    P: React$1.ForwardRefExoticComponent<TypographyPProps & React$1.RefAttributes<HTMLParagraphElement>>;
    Blockquote: React$1.ForwardRefExoticComponent<TypographyBlockquoteProps & React$1.RefAttributes<HTMLQuoteElement>>;
    Code: React$1.ForwardRefExoticComponent<TypographyInlineCodeProps & React$1.RefAttributes<HTMLElement>>;
    Lead: React$1.ForwardRefExoticComponent<TypographyLeadProps & React$1.RefAttributes<HTMLParagraphElement>>;
    Large: React$1.ForwardRefExoticComponent<TypographyLargeProps & React$1.RefAttributes<HTMLDivElement>>;
    Small: React$1.ForwardRefExoticComponent<TypographySmallProps & React$1.RefAttributes<HTMLElement>>;
    Muted: React$1.ForwardRefExoticComponent<TypographyMutedProps & React$1.RefAttributes<HTMLParagraphElement>>;
    List: React$1.ForwardRefExoticComponent<TypographyListProps & React$1.RefAttributes<HTMLUListElement>>;
    Pre: React$1.ForwardRefExoticComponent<TypographyPreProps & React$1.RefAttributes<HTMLPreElement>>;
};

interface UseOverflowItemsOptions {
    /** How many items the strip renders. */
    count: number;
    /**
     * Off when false: nothing is measured, nothing folds, and the hook costs a
     * consumer nothing but a ref it can ignore. This is what keeps `overflow` an
     * opt-in on every component that wires the hook up.
     */
    enabled?: boolean;
    /**
     * An index that must never fold — the selected tab. A strip whose active
     * item has folded reads as having no selection at all, and arrowing onto a
     * folded tab is what brings it back (the new active index is pinned, so the
     * next fit keeps it).
     */
    pinnedIndex?: number;
    /**
     * Width to keep free for the overflow trigger, in px. Only charged when
     * something actually folds — see `fit`.
     */
    reserve?: number;
}
interface UseOverflowItemsResult {
    /** Attach to the element whose width is the budget. */
    containerRef: React$1.RefCallback<HTMLElement>;
    /** Attach to item `index`. Stable per index, so items don't re-attach. */
    itemRef: (index: number) => React$1.RefCallback<HTMLElement>;
    /** Indices that do not fit, ascending. Identity is stable while unchanged. */
    hiddenIndices: readonly number[];
    /** `true` when item `index` should not be rendered on the strip. */
    isHidden: (index: number) => boolean;
}
/**
 * Measure a horizontal strip and report which of its items do not fit.
 *
 * The hook owns **only the arithmetic**. It renders nothing, knows nothing
 * about tabs, nav items or menus, and takes no opinion on what a consumer does
 * with the overflow — `NavItems` folds it into a `…` dropdown, but a
 * breadcrumb could collapse it to an ellipsis and a toolbar could drop it
 * entirely. That is the whole reason it is a hook and not a prop on one
 * component: the three strips in this kit render through three different
 * components and share no markup.
 *
 * **How it measures.** An item that has been folded has no box to measure, so
 * the hook caches each item's natural width the last time it was on the strip
 * and plans with that. The first render therefore lays every item out — that
 * pass is what fills the cache — and the fold is applied in a layout effect,
 * before the browser paints, so there is no flash of an overflowing strip.
 *
 * **How it avoids looping.** Folding changes the DOM, which fires the observers
 * again; the result only reaches React when the index list actually differs,
 * and widths are cached only from items that are currently laid out (a
 * `display:none` item reports `0`, which would otherwise poison the cache).
 *
 * @example
 * ```tsx
 * const { containerRef, itemRef, hiddenIndices, isHidden } = useOverflowItems({
 *   count: items.length,
 *   enabled: overflow,
 *   pinnedIndex: items.findIndex((i) => i.key === activeKey),
 * });
 *
 * <div ref={containerRef} className="flex min-w-0 flex-1 items-center gap-1">
 *   {items.map((item, i) =>
 *     isHidden(i) ? null : <button key={item.key} ref={itemRef(i)}>{item.label}</button>
 *   )}
 *   {hiddenIndices.length > 0 && <OverflowMenu items={hiddenIndices.map((i) => items[i])} />}
 * </div>
 * ```
 */
declare function useOverflowItems({ count, enabled, pinnedIndex, reserve, }: UseOverflowItemsOptions): UseOverflowItemsResult;

export { AbsenceNote, type AbsenceNoteProps, type AbsenceReason, Accordion, AccordionContent, AccordionItem, AccordionTrigger, AddressChip, type AddressChipProps, type AddressTone, AgentChip, type AgentChipProps, Alert, AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AlertTitle, AppStatusBar, type AppStatusBarProps, type Artifact, ArtifactTable, type ArtifactTableProps, AttemptClock, type AttemptClockProps, type AttemptRow, Avatar, AvatarFallback, AvatarImage, Badge, type BadgeProps, BarChartH, type BarChartHProps, BarChartV, type BarChartVProps, type BarDatum, type BaseNavProps, type Bound, BoundChip, type BoundChipProps, type BoundPalette, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, type ButtonProps, ButtonWithTooltip, type ButtonWithTooltipProps, CAST_ROLES, CannotAnswerCard, type CannotAnswerCardProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardWithHeader, Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CastResolution, type CastRole, type CastSource, CastTable, type CastTableProps, ChatSession, ChatSessionActivityRow, type ChatSessionActivityRowProps, type ChatSessionActivityStatus, ChatSessionActivitySubLine, type ChatSessionActivitySubLineProps, ChatSessionComposer, type ChatSessionComposerProps, ChatSessionContextChip, type ChatSessionContextChipProps, ChatSessionDisclosure, type ChatSessionDisclosureProps, ChatSessionMessage, type ChatSessionMessageAction, ChatSessionMessageOptions, type ChatSessionMessageOptionsProps, type ChatSessionMessageProps, type ChatSessionMessageRole, type ChatSessionMessageStatus, ChatSessionProgressLine, type ChatSessionProgressLineProps, ChatSessionPromptRow, type ChatSessionPromptRowProps, type ChatSessionProps, ChatSessionStatusBar, type ChatSessionStatusBarProps, ChatSessionTaskGroup, type ChatSessionTaskGroupProps, ChatSessionTaskRow, type ChatSessionTaskRowProps, type ChatSessionTaskStatus, CitationList, type CitationListProps, CitationMarker, CitationRow, type CitationRowProps, ClampedText, type ClampedTextProps, ClarifyCard, type ClarifyCardProps, type ClarifyOption, type ColumnDatum, Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, ContextBar, type ContextBarProps, type DeclaredAxes, DiagnosisCard, type DiagnosisCardProps, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DiffList, type DiffListProps, type DiffOp, DiffRow, type DiffRowProps, DivergingBar, type DivergingBarProps, type DivergingDatum, DotRating, type DotRatingProps, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, type EgressClass, EgressList, type EgressListProps, EmissionCard, type EmissionCardProps, EmissionHeader, type EmissionHeaderProps, type EmissionKind, EmptyState, EmptyStateLock, type EmptyStateLockProps, type EmptyStateProps, ErrorBoundary, type ExchangeOption, ExchangeRecord, type ExchangeRecordProps, Eyebrow, type EyebrowProps, FilterBar, type FilterBarProps, FilterChip, type FilterChipProps, type HeatCell, type HeatState, HeatStrip, type HeatStripProps, HoverCard, HoverCardContent, HoverCardTrigger, Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, Kbd, KbdGroup, KindChip, type KindChipProps, type KnownAddressTone, type KnownBound, type KnownDiffOp, type KnownLayer, type KnownLayerItemState, type KnownMetricTone, type KnownParticipantVerdict, type KnownRunKind, type KnownRunStatus, type KnownTerminalLevel, type Layer, type LayerBand, type LayerBracket, LayerChip, type LayerChipProps, type LayerForecast, type LayerItem, type LayerItemState, type LayerPaint, type LayerPalette, type LayerPart, type LayerScale, type LayerSeam, LayerSection, type LayerSectionProps, LayerStrip, type LayerStripProps, Legend, LegendItem, type LegendItemProps, type LegendProps, type LegendSwatchKind, LensChip, type LensChipProps, LensRow, type LensRowProps, type LensUsage, Link, type LinkProps, MarkChip, type MarkChipProps, type MarkTone, type MatchCandidate, MatchPreview, type MatchPreviewProps, MenuItem, type MenuItemProps, Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarPortal, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger, MetricGrid, type MetricGridProps, MetricTile, type MetricTileProps, type MetricTone, type Narrowing, NavBase, NavHorizontal, type NavHorizontalItem, NavHorizontalItems, type NavHorizontalItemsProps, type NavHorizontalProps, type NavItemConfig, NavItems, type NavItemsProps, type NavItemsVariant, type NavMenuItem, type NavSection, NavVertical, type NavVerticalItem, NavVerticalItems, type NavVerticalItemsProps, type NavVerticalProps, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, NestedMenu, type NestedMenuProps, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PanelBox, type PanelBoxProps, PanelContent, type PanelContentProps, PanelStack, type PanelStackHandle, type PanelStackProps, type PanelStackSection, ParticipantRow, type ParticipantRowProps, type ParticipantVerdict, Popover, PopoverContent, PopoverTrigger, Progress, PropertyList, type PropertyListProps, PropertyRow, type PropertyRowProps, ProposalCard, type ProposalCardProps, RatingControl, type RatingControlProps, RecordHeader, type RecordHeaderProps, RecordPager, type RecordPagerProps, RepairNote, type RepairNoteProps, ResizableHandle, ResizablePanel, ResizablePanelGroup, RetryNote, type RetryNoteProps, RichSelect, type RichSelectOption, type RichSelectProps, type RuleEgress, type RuleProperties, RuleRow, type RuleRowProps, type RuleSelect, type RunKind, RunRow, type RunRowProps, type RunStatus, RunStatusText, type RunStatusTextProps, ScrollArea, ScrollBar, SearchInput, type SearchInputProps, type SearchInputSize, SectionHeader, type SectionHeaderProps, SegmentedControl, type SegmentedControlProps, type SegmentedOption, Separator, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, Skeleton, type SliceLine, SliceSummary, type SliceSummaryProps, Sparkline, type SparklineProps, Spinner, StatusDot, type StatusDotProps, type TabConfig, TabbedPanel, type TabbedPanelProps, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, TaskGantt, TaskGanttDetailCard, type TaskGanttDetailCardProps, type TaskGanttDetailProps, type TaskGanttInstant, type TaskGanttProps, type TaskGanttSegment, type TaskGanttStatus, type TaskGanttTask, TaskNode, type TaskNodeProps, type TaskNodeTag, type TemplateOption, TemplatePicker, type TemplatePickerProps, Terminal, type TerminalLevel, TerminalLine, type TerminalLineKind, type TerminalLineProps, type TerminalProps, TimelineEntry, type TimelineEntryProps, TimelineFooter, type TimelineFooterProps, TimelineList, type TimelineListProps, type TimelineVariant, Toaster, Toggle, ToggleGroup, ToggleGroupItem, Toolbar, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, type TouchDirection, type TouchItem, TouchStrip, type TouchStripProps, Tour, type TourController, type TourProps, type TourReference, type TourStep, TraceGate, type TraceGateProps, TraceList, type TraceListProps, TraceLoop, type TraceLoopProps, TraceStep, type TraceStepProps, TreeItem, TreeView, type TreeViewProps, Typography, TypographyBlockquote, type TypographyBlockquoteProps, TypographyH1, type TypographyH1Props, TypographyH2, type TypographyH2Props, TypographyH3, type TypographyH3Props, TypographyH4, type TypographyH4Props, TypographyH5, type TypographyH5Props, TypographyH6, type TypographyH6Props, TypographyInlineCode, type TypographyInlineCodeProps, TypographyLarge, type TypographyLargeProps, TypographyLead, type TypographyLeadProps, TypographyList, type TypographyListProps, TypographyMuted, type TypographyMutedProps, TypographyP, type TypographyPProps, TypographyPre, type TypographyPreProps, TypographySmall, type TypographySmallProps, UnderDevelopment, type UnderDevelopmentProps, type UseOverflowItemsOptions, type UseOverflowItemsResult, type UseTourOptions, type Verdict, agentChipVariants, badgeVariants, buttonGroupVariants, buttonVariants, chatSessionGutterClass, cn, describeSlice, stateLabel as layerItemLabel, layerLabel, layerPaint, linkVariants, navigationMenuTriggerStyle, TONE as runStatusTones, split as splitAddress, statusDotVariants, toggleVariants, useOverflowItems, useSidebar, useTour };
