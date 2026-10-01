import { cn } from "@invana/ui"
import { DataTable, type ColumnDef } from "@invana/tables"

import { figureText } from "../format"
import type { BlockProps, Cell } from "../types"

type Row = Record<string, Cell>

/** Wider than this many columns, a table keeps them legible and scrolls sideways. */
const FITS = 5
/** The narrowest a column is drawn once the table scrolls, in px. */
const COLUMN_MIN = 66

/** A cell's figure as text — what a row's key is compared and sent as. */
function cellText(cell: Cell): string | undefined {
  if (cell == null) return undefined
  if (typeof cell !== "object" || !("value" in cell) || "type" in cell) return figureText(cell)
  return figureText(cell.value)
}

/**
 * One cell. A good or bad change is inked by its tone, and the figure a row
 * turns on is strong; an empty cell is a dash, never blank.
 */
function CellText({ cell }: { cell: Cell }) {
  if (cell == null) return <>—</>
  if (typeof cell !== "object" || !("value" in cell) || "type" in cell) {
    return <>{figureText(cell)}</>
  }
  return (
    <span
      className={cn(
        cell.tone === "good" && "text-success",
        cell.tone === "bad" && "text-destructive",
        cell.strong && "font-semibold",
      )}
    >
      {figureText(cell.value)}
    </span>
  )
}

/**
 * The first rows of a longer table, and how many there are in all. When rows
 * are held back, `Open all` asks for them with the `open` action. The column the
 * rows are ordered by is marked, rows an answer turns on are called out, and a
 * total sits under the rows in bold. With a `rowKey`, picking a row sends
 * `select` with its key, and the `selected` row is drawn picked.
 */
export function TableBlock({ spec, onAction }: BlockProps<"table">) {
  const truncated = spec.total != null && spec.total > spec.rows.length
  const highlighted = new Set(spec.highlight?.map((i) => spec.rows[i]))
  const data = spec.totals ? [...spec.rows, spec.totals] : spec.rows
  const columns: ColumnDef<Row>[] = spec.columns.map((c) => {
    const sorted = spec.sort?.key === c.key ? spec.sort.dir : undefined
    return {
      id: c.key,
      header: sorted
        ? () => <span className="text-foreground">{`${c.label} ${sorted === "asc" ? "▴" : "▾"}`}</span>
        : c.label,
      accessorFn: (row) => row[c.key],
      cell: (ctx) => <CellText cell={ctx.getValue() as Cell} />,
      meta: { align: c.align, cellClassName: cn("whitespace-nowrap", c.mono && "font-mono") },
    }
  })
  const { rowKey } = spec
  const keyOf = (row: Row) => (rowKey != null && row !== spec.totals ? cellText(row[rowKey]) : undefined)
  const noun = [spec.noun, spec.note].filter(Boolean).join(" · ") || undefined
  return (
    <DataTable
      columns={columns}
      data={data}
      density="compact"
      seamless
      enableSorting={false}
      enableColumnVisibility={false}
      minWidth={spec.columns.length > FITS ? spec.columns.length * COLUMN_MIN : undefined}
      isRowHighlighted={highlighted.size ? (row) => highlighted.has(row) : undefined}
      isTotalRow={spec.totals ? (row) => row === spec.totals : undefined}
      isRowSelected={spec.selected != null ? (row) => keyOf(row) === spec.selected : undefined}
      onRowClick={
        rowKey != null && onAction
          ? (row) => {
              const key = keyOf(row)
              if (key != null) onAction("select", key)
            }
          : undefined
      }
      preview={{
        total: spec.total,
        noun,
        onOpen: truncated && onAction ? () => onAction("open") : undefined,
      }}
    />
  )
}
