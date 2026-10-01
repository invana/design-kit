import * as React from "react";
import type { RowData } from "@tanstack/react-table";
import { Button, cn } from "@invana/ui";
import { DataTableToolbar } from "./data-table-toolbar";
import { pickViewProps, type TableBaseProps } from "./core/props";
import { TableGrid } from "./core/table-grid";
import { useTableModel } from "./core/use-table-model";

export interface DataTableProps<TData extends RowData>
  extends TableBaseProps<TData> {
  data: TData[];
  /** Dim the rows under a spinner. */
  loading?: boolean;
  /**
   * The table as a preview of a longer one — the first rows an answer shows.
   * Says how much there is under the rows: `3 of 214 · stores`, with `action`
   * (an `Open all`) at the end. `data` is the rows shown; `total` is how many
   * exist, and without it there is no count line, since `3 of 3` says nothing.
   *
   * `onOpen` draws the `Open all` link itself (`openLabel` renames it), in the
   * primary colour and flush with the count; `action` is for anything else.
   */
  preview?: {
    total?: number;
    noun?: string;
    action?: React.ReactNode;
    onOpen?: () => void;
    openLabel?: React.ReactNode;
  };
}

/**
 * Every row, at once — the table inside a card, an answer, a panel, a run's
 * record. No search and no pages: when the rows need either, it is a
 * `PaginatedTable`, or a `RemotePaginatedTable` when the server holds them.
 *
 * Sorting, inline editing, highlighting, grouping, nesting, expanding and the
 * column features are all here, and are the same in the other two.
 */
export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const {
    data,
    loading,
    preview,
    toolbar,
    className,
    isTotalRow,
    enableColumnVisibility = false,
    enableColumnPinning = false,
  } = props;
  const table = useTableModel({ ...props, data });

  const shown = isTotalRow ? data.filter((r) => !isTotalRow(r)).length : data.length;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <DataTableToolbar
        table={table}
        enableColumnVisibility={enableColumnVisibility}
        enableColumnPinning={enableColumnPinning}
      >
        {toolbar}
      </DataTableToolbar>

      <TableGrid table={table} loading={loading} {...pickViewProps(props)} />

      {preview && (preview.total != null || preview.action || preview.onOpen) ? (
        <div className="flex items-baseline justify-between gap-2 text-sm text-muted-foreground">
          <span>
            {preview.total != null
              ? `${shown} of ${preview.total.toLocaleString()}${preview.noun ? ` · ${preview.noun}` : ""}`
              : null}
          </span>
          {preview.action}
          {preview.onOpen ? (
            <Button
              type="button"
              variant="link"
              size="xs"
              className="h-auto p-0 font-medium"
              onClick={preview.onOpen}
            >
              {preview.openLabel ?? "Open all"}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
