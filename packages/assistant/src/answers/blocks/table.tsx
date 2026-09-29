import { cn } from "@invana/ui"
import { DataTable, type ColumnDef } from "@invana/tables"

import type { BlockRendererProps } from "../../conversations/registry"
import type { Cell } from "../../protocol/types"
import { figureText } from "./figure"

type Row = Record<string, Cell>

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

/** The first rows of a longer table, and how many there are in all. */
export function TableBlock({ block }: BlockRendererProps<"table">) {
  const columns: ColumnDef<Row>[] = block.columns.map((c) => ({
    id: c.key,
    header: c.label,
    accessorFn: (row) => row[c.key],
    cell: (ctx) => <CellText cell={ctx.getValue() as Cell} />,
    meta: { align: c.align },
  }))
  return (
    <DataTable
      columns={columns}
      data={block.rows}
      density="compact"
      bordered={false}
      enableSorting={false}
      enableColumnVisibility={false}
      preview={{ total: block.total, noun: block.noun }}
    />
  )
}
