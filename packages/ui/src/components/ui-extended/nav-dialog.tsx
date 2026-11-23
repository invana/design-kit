import * as React from "react"

import { cn } from "../../lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../ui/sidebar"
import { SearchInput } from "./search-input"

/** One section of the dialog, as a row of its `leftNav`. */
export interface NavDialogItem {
  /** The section's identity, as `activeKey` and `onSelect` name it. */
  key: string
  label: string
  /** A lucide icon (or any component), drawn at 16px before the label. */
  icon?: React.ElementType
}

/** Rows of the `leftNav` under one label — `Account`, `Workspace`, `Admin`. */
export interface NavDialogGroup {
  /** The group's label; omit for a group that needs none (the first, usually). */
  label?: string
  items: NavDialogItem[]
}

export interface NavDialogProps {
  open: boolean
  /** `false` when Escape, the close button or the overlay closes it. */
  onOpenChange: (open: boolean) => void
  /** Across the top — `Settings`. */
  title: React.ReactNode
  /** Read to screen readers when the dialog opens; not drawn. */
  description?: React.ReactNode
  groups: NavDialogGroup[]
  /** The section shown in the content pane. */
  activeKey: string
  /** A `leftNav` row was picked. The dialog holds no selection of its own. */
  onSelect: (key: string) => void
  /** A search box over the `leftNav` that narrows its rows by label. On by default. */
  searchable?: boolean
  searchPlaceholder?: string
  /** Pinned under the `leftNav` — a link out, a version line. */
  leftNavFooter?: React.ReactNode
  /** The active section's content. It scrolls; the `leftNav` stays put. */
  children: React.ReactNode
  /** On the dialog's box — its width or height. */
  className?: string
}

const matches = (item: NavDialogItem, query: string) =>
  item.label.toLowerCase().includes(query.trim().toLowerCase())

/**
 * A dialog of sections: a `leftNav` of grouped rows on the left, the picked
 * section on the right. For the work a reader does without leaving what they
 * are on — settings, an admin record, a connection's details.
 *
 * Controlled both ways: the consumer owns `open` and `activeKey`, so either can
 * live in the URL. A section that drills into a record draws its own
 * breadcrumb (`RecordHeader`) inside `children`.
 *
 * The box keeps one size whichever section is shown, so switching sections
 * never moves the dialog's edges.
 *
 * @example
 * ```tsx
 * <NavDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Settings"
 *   groups={[{ items: [{ key: "appearance", label: "Appearance", icon: Palette }] }]}
 *   activeKey={section}
 *   onSelect={setSection}
 * >
 *   {section === "appearance" && <Appearance />}
 * </NavDialog>
 * ```
 */
export function NavDialog({
  open,
  onOpenChange,
  title,
  description,
  groups,
  activeKey,
  onSelect,
  searchable = true,
  searchPlaceholder = "Search",
  leftNavFooter,
  children,
  className,
}: NavDialogProps) {
  const [query, setQuery] = React.useState("")
  const shown = groups
    .map((group) => ({ ...group, items: group.items.filter((item) => matches(item, query)) }))
    .filter((group) => group.items.length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("flex h-[min(90vh,60rem)] w-[min(94vw,92rem)] max-w-none flex-col gap-0 overflow-hidden p-0", className)}
        {...(description ? {} : { "aria-describedby": undefined })}
      >
        <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription className="sr-only">{description}</DialogDescription>}
        </div>
        <div className="flex min-h-0 flex-1">
          <SidebarProvider className="min-h-0 w-auto flex-none">
            <Sidebar collapsible="none" className="border-r border-border">
              {searchable && (
                <SidebarHeader>
                  <SearchInput
                    inputSize="sm"
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    value={query}
                    onChange={setQuery}
                  />
                </SidebarHeader>
              )}
              <SidebarContent>
                <nav aria-label="Sections">
                  {shown.map((group, i) => (
                    <SidebarGroup key={group.label ?? i}>
                      {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {group.items.map(({ key, label, icon: Icon }) => (
                            <SidebarMenuItem key={key}>
                              <SidebarMenuButton
                                isActive={key === activeKey}
                                aria-current={key === activeKey ? "page" : undefined}
                                onClick={() => onSelect(key)}
                              >
                                {Icon && <Icon />}
                                <span>{label}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  ))}
                  {shown.length === 0 && (
                    <p className="px-4 py-2 text-sm text-muted-foreground">No section matches.</p>
                  )}
                </nav>
              </SidebarContent>
              {leftNavFooter && <SidebarFooter className="border-t border-border">{leftNavFooter}</SidebarFooter>}
            </Sidebar>
          </SidebarProvider>
          <section aria-label={groups.flatMap((g) => g.items).find((i) => i.key === activeKey)?.label} className="min-w-0 flex-1 overflow-auto p-6">
            {children}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
