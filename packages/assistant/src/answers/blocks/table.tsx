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

/**
 * The first rows of a longer table, and how many there are in all. When rows
 * are held back, `Open all` asks for them with an `open` event.
 */
export function TableBlock({ block, turn, onEvent }: BlockRendererProps<"table">) {
  const truncated = block.total != null && block.total > block.rows.length
  const index = (turn.blocks as unknown[]).indexOf(block)
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
      preview={{
        total: block.total,
        noun: block.noun,
        onOpen:
          truncated && index >= 0
            ? () => onEvent({ type: "open", turn: turn.id, block: index })
            : undefined,
      }}
    />
  )
}
