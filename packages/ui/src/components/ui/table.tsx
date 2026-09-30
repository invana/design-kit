import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * How much room a row gets. The type size never moves — a row is the root size
 * at every density — only the height and the cell padding do.
 *
 * - `compact` — 26px rows: a journal, a trace, a step's output, a log.
 * - `default` — 34px rows at a 13px root: a list in an application.
 * - `comfortable` — 44px rows at a 13px root: a table standing alone on a
 *   page, a settings list.
 *
 * `default` and `comfortable` are ratios of the root, like the type, so a
 * site that sets a 16px root gets proportionally roomier rows.
 */
export type TableDensity = "compact" | "default" | "comfortable"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    density?: TableDensity
    /**
     * Draw the box around the table. Off for a table that sits directly in a
     * panel's column — the panel edge already frames it, and a second border a
     * few pixels in reads as a box inside a box. The row rules stay.
     */
    bordered?: boolean
  }
>(({ className, density = "default", bordered = true, ...props }, ref) => (
  <div
    data-density={density}
    className={cn(
      "group/table relative w-full overflow-auto",
      bordered && "border rounded-md",
    )}
  >
    <table
      ref={ref}
      className={cn("w-full caption-bottom", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      // Density: `<Table density>` marks the wrapper, and every cell follows
      // from there. One prop on the table rather than a size on <TableHead>
      // and <TableCell> individually — four places to forget, and a table with
      // two densities in it is always a mistake.
      "group-data-[density=compact]/table:h-[26px] group-data-[density=compact]/table:text-sm",
      "group-data-[density=comfortable]/table:h-[3.375rem] group-data-[density=comfortable]/table:px-3",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "h-[2.625rem] px-2 py-1.5 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      "group-data-[density=compact]/table:h-[26px] group-data-[density=compact]/table:py-1",
      "group-data-[density=comfortable]/table:h-[3.375rem] group-data-[density=comfortable]/table:px-3 group-data-[density=comfortable]/table:py-2.5",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
