"use client"
import * as React from "react"
import { ChevronRight } from 'lucide-react'
import { cn } from "../../lib/utils"
import { toneText, type TextTone } from "../../lib/tone-text"
import { type ExpandedKeys, useExpandedKeys } from "../../hooks/use-expanded-keys"
import { StatusDot, type StatusDotProps } from "../ui/status-dot"
import { Eyebrow } from "./eyebrow"
import { SearchInput } from "./search-input"


export interface TreeItem {
  id: string | number
  label: string
  icon?: React.ReactElement<React.ComponentProps<'svg'>> | React.ReactNode
  /** Called with the row's id and label, and the click event (to `preventDefault` a link for a router). */
  onClick?: (id: string | number, label: string, event: React.MouseEvent) => void
  /** Where this item starts when the tree takes neither `expanded` nor `defaultExpanded`: open (the default) or shut. */
  isExpanded?: boolean
  children?: TreeItem[]
  /** A count or short fact, right-aligned. */
  meta?: React.ReactNode
  /** The meta's colour: `warning` for "staged", `destructive` for "end gone". Muted by default. */
  metaTone?: TextTone
  /** A status dot before the meta. */
  tone?: StatusDotProps["tone"]
  /** On a top-level item: drawn under this header with the others that share it, in first-seen order. */
  group?: string
  /** The row's tooltip. */
  title?: string
  /** Draws the row as a link to this address. */
  href?: string
}

export interface TreeViewProps {
  style?: React.CSSProperties,
  className?: string,
  items: TreeItem[],
  header?: React.ReactElement
  searchable?: boolean
  /** The search box's placeholder and accessible name — "Filter models and types". */
  searchPlaceholder?: string
  /**
   * `card` (the default) is a bordered box with guide lines. `column` fills a
   * left-side column: full height, flat, the filter on top, rows indented
   * 14px a level with no guides.
   */
  variant?: "card" | "column"
  /** The open item's id: its row is lit and carries `aria-current`. */
  activeId?: string | number
  /**
   * Which items are open, by id — `true` for every one; the same shape as a
   * `DataTable`'s or a `Gantt`'s `expanded`. Passing it makes expansion
   * controlled; pair it with `onExpandedChange`.
   */
  expanded?: ExpandedKeys
  /**
   * Uncontrolled: what is open at first. Omit both this and `expanded` and
   * each item keeps its own state, starting at its `isExpanded`.
   */
  defaultExpanded?: ExpandedKeys
  /** Fires with what is open whenever a row folds or opens. */
  onExpandedChange?: (expanded: ExpandedKeys) => void
  /** A short fact right-aligned on a group's header, by group name — "4 models". */
  groupMeta?: Record<string, React.ReactNode>
}

interface TreeContext {
  variant: "card" | "column"
  activeId?: string | number
  /** A filter is typed: every branch shows open, so no match hides in a shut one. */
  filtering: boolean
  /** Whether an item is open, when the tree holds expansion; undefined when each item keeps its own. */
  isOpen?: (key: string) => boolean
  toggle: (key: string) => void
}

const Ctx = React.createContext<TreeContext>({ variant: "card", filtering: false, toggle: () => {} })

/**
 * A nested list with an optional filter. `card` is a bordered box with guide
 * lines; `column` fills a left-side column, as the shell's tree column does.
 * Rows can be lit (`activeId`), opened from outside (`expanded`), and carry
 * a right-aligned meta in a tone, a status dot, a tooltip and a link.
 */
export const TreeView: React.FC<TreeViewProps> = ({
  searchable = false,
  variant = "card",
  ...props
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const held = props.expanded !== undefined || props.defaultExpanded !== undefined
  const { isOpen, toggle } = useExpandedKeys({
    expanded: props.expanded,
    defaultExpanded: props.defaultExpanded,
    onExpandedChange: props.onExpandedChange,
    keys: idsOf(props.items),
  })

  const filterItems = (items: TreeItem[], query: string): TreeItem[] => {
    if (!query) return items;
    return items
      .map(item => ({
        ...item,
        children: item.children ? filterItems(item.children, query) : [],
      }))
      .filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || (item.children && item.children.length > 0));
  };

  const filteredItems = filterItems(props.items, searchQuery);
  const ctx: TreeContext = {
    variant,
    activeId: props.activeId,
    filtering: searchQuery !== "",
    isOpen: held ? isOpen : undefined,
    toggle,
  }
  const column = variant === "column"
  const groupMeta = props.groupMeta ?? {}
  const search = searchable ? (
    <SearchInput
      value={searchQuery}
      onChange={setSearchQuery}
      inputSize={column ? "sm" : undefined}
      placeholder={props.searchPlaceholder}
      aria-label={props.searchPlaceholder}
    />
  ) : null

  return (
    <Ctx.Provider value={ctx}>
      {column ? (
        <div className={cn("flex h-full w-full flex-col bg-background text-foreground", props.className)} style={props.style}>
          {props.header || search ? (
            <div className="shrink-0 px-3 pt-1.5 pb-2">
              {props.header}
              {search}
            </div>
          ) : null}
          <div className="min-h-0 flex-1 overflow-y-auto pb-2">
            <Groups items={filteredItems} groupMeta={groupMeta} />
          </div>
        </div>
      ) : (
        <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm w-[240px]", props.className)} style={props.style}>
          <div className="p-3">
            {props.header}
            {search}
            <Groups items={filteredItems} groupMeta={groupMeta} />
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

/** Top-level items under their group headers, each header with its meta. */
function Groups({ items, groupMeta }: { items: TreeItem[]; groupMeta: Record<string, React.ReactNode> }) {
  const column = React.useContext(Ctx).variant === "column"
  return (
    <div className="space-y-0.5">
      {groupsOf(items).map(({ group, items }) => (
        <div key={group ?? ""} className={cn("space-y-0.5", group && (column ? "pt-1" : "pt-2"))}>
          {group ? (
            <div className={cn("flex items-center gap-2 pb-1", column ? "px-3 pt-2" : "px-2")}>
              <Eyebrow className="min-w-0 flex-1 truncate">{group}</Eyebrow>
              {groupMeta[group] != null ? <Eyebrow className="shrink-0">{groupMeta[group]}</Eyebrow> : null}
            </div>
          ) : null}
          {items.map((item) => (
            <TreeItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Every item's id, as an expansion key, at every depth. */
function idsOf(items: TreeItem[]): string[] {
  return items.flatMap((i) => [String(i.id), ...(i.children ? idsOf(i.children) : [])])
}

/** Top-level items in runs by `group`, in the order each group is first seen; ungrouped ones form their own run. */
function groupsOf(items: TreeItem[]): { group?: string; items: TreeItem[] }[] {
  const runs: { group?: string; items: TreeItem[] }[] = []
  for (const item of items) {
    const run = runs.find((r) => r.group === item.group)
    if (run) run.items.push(item)
    else runs.push({ group: item.group, items: [item] })
  }
  return runs
}

export const TreeItem: React.FC<{ item: TreeItem; depth?: number }> = ({ item, depth = 0 }) => {
  const ctx = React.useContext(Ctx)
  const [ownExpanded, setOwnExpanded] = React.useState<boolean>(item.isExpanded ?? true)
  const isExpanded = ctx.filtering || (ctx.isOpen ? ctx.isOpen(String(item.id)) : ownExpanded)
  const hasChildren = Boolean(item.children && item.children.length > 0)
  const column = ctx.variant === "column"
  const active = ctx.activeId !== undefined && ctx.activeId === item.id

  const onClick = (event: React.MouseEvent) => {
    if (hasChildren) {
      if (ctx.isOpen) ctx.toggle(String(item.id))
      else setOwnExpanded(!isExpanded)
    }
    item.onClick?.(item.id, item.label, event)
  }

  const chevron = (
    <ChevronRight
      aria-hidden
      className={cn(
        "shrink-0 transition-transform",
        column ? "size-3 text-muted-foreground" : "h-4 w-4",
        isExpanded && "rotate-90",
      )}
    />
  )
  const body = (
    <>
      {column ? <span aria-hidden className="flex w-3 shrink-0">{hasChildren ? chevron : null}</span> : hasChildren ? chevron : null}
      {item.icon}
      <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
      {item.tone ? <StatusDot tone={item.tone} /> : null}
      {item.meta != null ? (
        <span className={cn("shrink-0 text-sm font-normal", toneText[item.metaTone ?? "muted"])}>{item.meta}</span>
      ) : null}
    </>
  )
  const row = {
    onClick,
    title: item.title,
    className: cn(
      "flex w-full items-center text-left text-foreground no-underline outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
      column ? "min-h-7 gap-1.5 pr-3" : "gap-2 rounded-control px-2 py-1",
      hasChildren && "cursor-pointer font-medium",
      active && "bg-accent font-semibold shadow-[inset_2px_0_0_var(--color-primary)]",
    ),
    // Column rows indent by depth instead of nesting under guide lines.
    style: column ? { paddingLeft: 12 + 14 * depth } : undefined,
    "aria-current": active ? ("page" as const) : undefined,
    "aria-expanded": hasChildren ? isExpanded : undefined,
  }

  return (
    <div>
      {item.href ? <a href={item.href} {...row}>{body}</a> : <button type="button" {...row}>{body}</button>}
      {hasChildren && isExpanded && (
        column ? (
          item.children?.map((child) => <TreeItem key={child.id} item={child} depth={depth + 1} />)
        ) : (
          <div className="ml-4 pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 border-l border-muted-foreground/25" />
            {item.children?.map((child) => (
              <div key={child.id} className="relative">
                <div className="absolute -left-4 top-[15px] w-4 border-t border-muted-foreground/25" />
                <TreeItem item={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
