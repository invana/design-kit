"use client"
import * as React from "react"
import { ChevronRight } from 'lucide-react'
import { cn } from "../../lib/utils"
import { StatusDot, type StatusDotProps } from "../ui/status-dot"
import { Eyebrow } from "./eyebrow"
import { SearchInput } from "./search-input"

export interface TreeItem {
  id: string | number
  label: string
  icon?: React.ReactElement<React.ComponentProps<'svg'>> | React.ReactNode
  onClick?: (id: string | number, label: string) => void
  isExpanded?: boolean
  children?: TreeItem[]
  /** A count or short fact, right-aligned. */
  meta?: React.ReactNode
  /** A status dot before the meta. */
  tone?: StatusDotProps["tone"]
  /** On a top-level item: drawn under this header with the others that share it, in first-seen order. */
  group?: string
}

export interface TreeViewProps {
  style?: React.CSSProperties,
  className?: string,
  items: TreeItem[],
  header?: React.ReactElement
  searchable?: boolean
}


export const TreeView: React.FC<TreeViewProps> = ({ searchable = false, ...props }) => {
  /*
  const exampleData: TreeItem[] = [
    {
      id: 0,
      label: "Root",
      icon: <Folder className="h-4 w-4 shrink-0 text-yellow-500" />,
      children: [
        {
          id: "1",
          label: "Root 1",
          icon: <Folder className="h-4 w-4 shrink-0 text-yellow-500" />,
          children: [
            {
              id: "1-1",
              label: "Child 1-1",
              icon: <Folder className="h-4 w-4 shrink-0 text-yellow-500" />,
              children: [
                {
                  id: "1-1-1",
                  icon: <File className="h-4 w-4 shrink-0 text-gray-500" />,
                  label: "Clickable Grandchild 1-1-1",
                  onClick: (id, label) => alert(`Clicked id:${id}; label:${label}`)
                },
                { id: "1-1-2", icon: <File className="h-4 w-4 shrink-0 text-gray-500" />, label: "Grandchild 1-1-2" }
              ]
            },
            { id: "1-2", icon: <File className="h-4 w-4 shrink-0 text-gray-500" />, label: "Child 1-2" }
          ]
        },
        {
          id: "2",
          label: "Root 2",
          icon: <Folder className="h-4 w-4 shrink-0 text-yellow-500" />,
          children: [
            { id: "2-1", icon: <File className="h-4 w-4 shrink-0 text-gray-500" />, label: "Child 2-1" },
            { id: "2-2", icon: <File className="h-4 w-4 shrink-0 text-gray-500" />, label: "Child 2-2" }
          ]
        }
      ]
    }

  ]

  */

  const [searchQuery, setSearchQuery] = React.useState<string>('');

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

  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm w-[240px]", props.className)}
      style={props.style} >
      <div className="p-3">
        {props.header && props.header}
        {searchable && <SearchInput value={searchQuery} onChange={setSearchQuery} />}

        {/* <h2 className="text-lg font-semibold px-2 mb-2">Left Side</h2> */}
        <div className="space-y-0.5">
          {groupsOf(filteredItems).map(({ group, items }) => (
            <div key={group ?? ""} className={cn("space-y-0.5", group && "pt-2")}>
              {group ? <Eyebrow className="px-2 pb-1">{group}</Eyebrow> : null}
              {items.map((item) => (
                <TreeItem key={item.id} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
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

export const TreeItem: React.FC<{ item: TreeItem }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(item.isExpanded ?? true)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) { setIsExpanded(!isExpanded); }
          item.onClick?.(item.id, item.label);
        }}
        className={cn(
          "flex items-center gap-2 w-full rounded-control px-2 py-1 hover:bg-accent hover:text-accent-foreground",
          hasChildren && "cursor-pointer font-medium"
        )}
      >
        {hasChildren && (
          <ChevronRight
            className={cn("h-4 w-4 shrink-0 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        )}
        {item.icon}
        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
        {item.tone ? <StatusDot tone={item.tone} /> : null}
        {item.meta != null ? (
          <span className="shrink-0 text-sm font-normal text-muted-foreground">{item.meta}</span>
        ) : null}
      </button>
      {hasChildren && isExpanded && (
        <div className="ml-4 pl-4 relative">
          <div className="absolute left-0 top-0 bottom-0 border-l border-muted-foreground/25" />
          {item.children?.map((child, index) => (
            <div key={child.id} className="relative">
              <div className="absolute -left-4 top-[15px] w-4 border-t border-muted-foreground/25" />
              <TreeItem key={index} item={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

