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

declare const Sheet: React$1.FC<DialogPrimitive.DialogProps>;
declare const SheetTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const SheetOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const sheetVariants: (props?: ({
    side?: "bottom" | "left" | "right" | "top" | null | undefined;
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

type DiffOp = "add" | "remove" | "change";
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

type LegendSwatchKind = "dot" | "line" | "dashed" | "arrow" | "ring";
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

interface MetricTileProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** What is being measured — `accepted`, `served (plan.verified)`, `hit rate`. */
    label: React$1.ReactNode;
    /** The number. `31 of 38`, `91%`, `9.6 s`, `$38.20`. */
    value: React$1.ReactNode;
    /** Why the number is what it is — the denominator, the window, the caveat. */
    caption?: React$1.ReactNode;
    /** A bar, a sparkline, anything that sits under the value. */
    children?: React$1.ReactNode;
}
interface MetricGridProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Smallest a tile may get before the grid drops a column. */
    minTileWidth?: number;
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
interface PanelStackProps {
    /** Ordered list of sections that make up the stack. */
    sections: PanelStackSection[];
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
declare function PanelStack({ sections, headerHeight, withHandle, className, headerClassName, bodyClassName, }: PanelStackProps): React$1.JSX.Element;

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
interface TerminalLineProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "children"> {
    kind?: TerminalLineKind;
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

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger, AgentChip, type AgentChipProps, Alert, AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AlertTitle, AppStatusBar, type AppStatusBarProps, Avatar, AvatarFallback, AvatarImage, Badge, type BadgeProps, BarChartH, type BarChartHProps, BarChartV, type BarChartVProps, type BarDatum, type BaseNavProps, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, type ButtonProps, ButtonWithTooltip, type ButtonWithTooltipProps, CannotAnswerCard, type CannotAnswerCardProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardWithHeader, Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, ChatSession, ChatSessionActivityRow, type ChatSessionActivityRowProps, type ChatSessionActivityStatus, ChatSessionActivitySubLine, type ChatSessionActivitySubLineProps, ChatSessionComposer, type ChatSessionComposerProps, ChatSessionContextChip, type ChatSessionContextChipProps, ChatSessionDisclosure, type ChatSessionDisclosureProps, ChatSessionMessage, type ChatSessionMessageAction, ChatSessionMessageOptions, type ChatSessionMessageOptionsProps, type ChatSessionMessageProps, type ChatSessionMessageRole, type ChatSessionMessageStatus, ChatSessionProgressLine, type ChatSessionProgressLineProps, ChatSessionPromptRow, type ChatSessionPromptRowProps, type ChatSessionProps, ChatSessionStatusBar, type ChatSessionStatusBarProps, ChatSessionTaskGroup, type ChatSessionTaskGroupProps, ChatSessionTaskRow, type ChatSessionTaskRowProps, type ChatSessionTaskStatus, CitationList, type CitationListProps, CitationMarker, CitationRow, type CitationRowProps, ClarifyCard, type ClarifyCardProps, type ClarifyOption, type ColumnDatum, Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, ContextBar, type ContextBarProps, DiagnosisCard, type DiagnosisCardProps, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DiffList, type DiffListProps, type DiffOp, DiffRow, type DiffRowProps, DivergingBar, type DivergingBarProps, type DivergingDatum, DotRating, type DotRatingProps, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmissionCard, type EmissionCardProps, EmissionHeader, type EmissionHeaderProps, type EmissionKind, EmptyState, EmptyStateLock, type EmptyStateLockProps, type EmptyStateProps, ErrorBoundary, FilterBar, type FilterBarProps, FilterChip, type FilterChipProps, type HeatCell, type HeatState, HeatStrip, type HeatStripProps, HoverCard, HoverCardContent, HoverCardTrigger, Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, Kbd, KbdGroup, Legend, LegendItem, type LegendItemProps, type LegendProps, type LegendSwatchKind, MenuItem, type MenuItemProps, Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarPortal, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger, MetricGrid, type MetricGridProps, MetricTile, type MetricTileProps, NavBase, NavHorizontal, type NavHorizontalItem, NavHorizontalItems, type NavHorizontalItemsProps, type NavHorizontalProps, type NavItemConfig, NavItems, type NavItemsProps, type NavItemsVariant, type NavMenuItem, type NavSection, NavVertical, type NavVerticalItem, NavVerticalItems, type NavVerticalItemsProps, type NavVerticalProps, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, NestedMenu, type NestedMenuProps, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PanelContent, type PanelContentProps, PanelStack, type PanelStackProps, type PanelStackSection, Popover, PopoverContent, PopoverTrigger, Progress, PropertyList, type PropertyListProps, PropertyRow, type PropertyRowProps, ProposalCard, type ProposalCardProps, RatingControl, type RatingControlProps, RepairNote, type RepairNoteProps, ResizableHandle, ResizablePanel, ResizablePanelGroup, RetryNote, type RetryNoteProps, RichSelect, type RichSelectOption, type RichSelectProps, ScrollArea, ScrollBar, SearchInput, type SearchInputProps, type SearchInputSize, SectionHeader, type SectionHeaderProps, Separator, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, Skeleton, Sparkline, type SparklineProps, Spinner, StatusDot, type StatusDotProps, type TabConfig, TabbedPanel, type TabbedPanelProps, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, type TemplateOption, TemplatePicker, type TemplatePickerProps, Terminal, TerminalLine, type TerminalLineKind, type TerminalLineProps, type TerminalProps, TimelineEntry, type TimelineEntryProps, TimelineFooter, type TimelineFooterProps, TimelineList, type TimelineListProps, type TimelineVariant, Toaster, Toggle, ToggleGroup, ToggleGroupItem, Toolbar, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Tour, type TourController, type TourProps, type TourReference, type TourStep, TreeItem, TreeView, type TreeViewProps, Typography, TypographyBlockquote, type TypographyBlockquoteProps, TypographyH1, type TypographyH1Props, TypographyH2, type TypographyH2Props, TypographyH3, type TypographyH3Props, TypographyH4, type TypographyH4Props, TypographyH5, type TypographyH5Props, TypographyH6, type TypographyH6Props, TypographyInlineCode, type TypographyInlineCodeProps, TypographyLarge, type TypographyLargeProps, TypographyLead, type TypographyLeadProps, TypographyList, type TypographyListProps, TypographyMuted, type TypographyMutedProps, TypographyP, type TypographyPProps, TypographyPre, type TypographyPreProps, TypographySmall, type TypographySmallProps, UnderDevelopment, type UnderDevelopmentProps, type UseOverflowItemsOptions, type UseOverflowItemsResult, type UseTourOptions, type Verdict, agentChipVariants, badgeVariants, buttonGroupVariants, buttonVariants, chatSessionGutterClass, cn, navigationMenuTriggerStyle, statusDotVariants, toggleVariants, useOverflowItems, useSidebar, useTour };
