import { cn } from "@invana/ui"
import { DataTable, type ColumnDef } from "@invana/tables"

import type { BlockRendererProps } from "../../conversations/registry"
import type { Cell } from "../../protocol/types"
import { figureText } from "./figure"

type Row = Record<string, Cell>

/** Wider than this many columns, a table keeps them legible and scrolls sideways. */
const FITS = 5
/** The narrowest a column is drawn once the table scrolls, in px. */
const COLUMN_MIN = 66

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
 * are held back, `Open all` asks for them with an `open` event. The column the
 * rows are ordered by is marked, rows an answer turns on are called out, and a
 * total sits under the rows in bold.
 */
export function TableBlock({ block, turn, onEvent }: BlockRendererProps<"table">) {
  const truncated = block.total != null && block.total > block.rows.length
  const index = (turn.blocks as unknown[]).indexOf(block)
  const highlighted = new Set(block.highlight?.map((i) => block.rows[i]))
  const data = block.totals ? [...block.rows, block.totals] : block.rows
  const columns: ColumnDef<Row>[] = block.columns.map((c) => {
    const sorted = block.sort?.key === c.key ? block.sort.dir : undefined
    return {
      id: c.key,
      header: sorted
        ? () => <span className="text-foreground">{`${c.label} ${sorted === "asc" ? "▴" : "▾"}`}</span>
        : c.label,
      accessorFn: (row) => row[c.key],
      cell: (ctx) => <CellText cell={ctx.getValue() as Cell} />,
      meta: { align: c.align, cellClassName: "whitespace-nowrap" },
    }
  })
  const noun = [block.noun, block.note].filter(Boolean).join(" · ") || undefined
  return (
    <DataTable
      columns={columns}
      data={data}
      density="compact"
      enableSorting={false}
      enableColumnVisibility={false}
      minWidth={block.columns.length > FITS ? block.columns.length * COLUMN_MIN : undefined}
      isRowHighlighted={highlighted.size ? (row) => highlighted.has(row) : undefined}
      isTotalRow={block.totals ? (row) => row === block.totals : undefined}
      preview={{
        total: block.total,
        noun,
        onOpen:
          truncated && index >= 0
            ? () => onEvent({ type: "open", turn: turn.id, block: index })
            : undefined,
      }}
    />
  )
}
