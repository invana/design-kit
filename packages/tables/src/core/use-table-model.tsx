import * as React from "react";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  type ExpandedState,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type SortingState,
  type Table,
  type VisibilityState,
} from "@tanstack/react-table";
import { EditableCell } from "../editable-cell";
import type { TableBaseProps } from "./props";

/**
 * State the caller may own or leave to the table. Controlled when `value` is
 * given; either way `onChange` hears every change.
 */
export function useControllable<T>(
  value: T | undefined,
  onChange: OnChangeFn<T> | undefined,
  initial: T | (() => T),
): [T, OnChangeFn<T>] {
  const [internal, setInternal] = React.useState<T>(initial);
  const state = value ?? internal;
  const setState: OnChangeFn<T> = (updater) => {
    onChange?.(updater);
    if (value === undefined) setInternal(updater);
  };
  return [state, setState];
}

export type TableModelOptions<TData extends RowData> = Pick<
  TableBaseProps<TData>,
  | "columns"
  | "onCellEdit"
  | "enableSorting"
  | "sorting"
  | "onSortingChange"
  | "defaultSorting"
  | "enableColumnResizing"
  | "enableColumnPinning"
  | "getSubRows"
  | "renderExpanded"
  | "canExpand"
  | "defaultExpanded"
  | "expanded"
  | "onExpandedChange"
  | "getRowId"
> & {
  data: TData[];
  /** The server sorts; the table only reports what was asked for. */
  manualSorting?: boolean;
  /**
   * Page the rows. `client` slices `data` itself; `server` takes `data` as
   * the page already and needs `rowCount`. Absent, every row is shown.
   */
  paging?: {
    mode: "client" | "server";
    state: PaginationState;
    onChange: OnChangeFn<PaginationState>;
    rowCount?: number;
  };
  /** Filter rows on the client by this text, across `searchColumns` (default: every column with an accessor). */
  search?: { value: string; columns?: string[] };
};

/**
 * The TanStack model the three tables share: sorting, column visibility,
 * order, pinning and sizing, expansion, editable cells, and — when asked —
 * client search and paging. What differs between the tables is who owns the
 * page and the search, which arrives here already decided.
 */
export function useTableModel<TData extends RowData>({
  columns,
  data,
  onCellEdit,
  enableSorting = true,
  sorting: sortingProp,
  onSortingChange,
  defaultSorting,
  manualSorting = false,
  enableColumnResizing = false,
  enableColumnPinning = false,
  getSubRows,
  renderExpanded,
  canExpand,
  defaultExpanded,
  expanded: expandedProp,
  onExpandedChange,
  getRowId,
  paging,
  search,
}: TableModelOptions<TData>): Table<TData> {
  const expandable = getSubRows != null || renderExpanded != null;
  const [expanded, setExpanded] = useControllable<ExpandedState>(
    expandedProp,
    onExpandedChange,
    defaultExpanded ?? {},
  );
  const [sorting, setSorting] = useControllable<SortingState>(
    sortingProp,
    onSortingChange,
    defaultSorting ?? [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: [],
    right: [],
  });
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(() =>
    columns.map((c, i) => {
      const def = c as { id?: string; accessorKey?: unknown };
      return def.id ?? (def.accessorKey != null ? String(def.accessorKey) : String(i));
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as `columns`
  const wrappedColumns = React.useMemo<ColumnDef<TData, any>[]>(
    () =>
      columns.map((col) => {
        const meta = col.meta;
        if (!meta?.editable || col.cell) return col;
        return {
          ...col,
          cell: (ctx) => (
            <EditableCell
              ctx={ctx}
              editType={meta.editType}
              options={meta.options}
              align={meta.align}
              onCellEdit={onCellEdit}
            />
          ),
        };
      }),
    [columns, onCellEdit],
  );

  const clientPaging = paging?.mode === "client";
  const searchColumns = search?.columns;

  // TanStack returns functions the React Compiler cannot memoise, so it skips
  // this hook — which is correct, and nothing here relies on it.
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
    data,
    columns: wrappedColumns,
    state: {
      sorting,
      columnVisibility,
      columnPinning,
      columnOrder,
      expanded,
      globalFilter: search?.value ?? "",
      ...(paging ? { pagination: paging.state } : {}),
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    onExpandedChange: setExpanded,
    onPaginationChange: paging?.onChange,
    getSubRows,
    getRowId,
    getRowCanExpand: (row) =>
      row.subRows.length > 0 ||
      (renderExpanded != null && (canExpand?.(row.original) ?? true)),
    getExpandedRowModel: expandable ? getExpandedRowModel() : undefined,
    // Page by top-level rows: opening one adds its children to this page
    // rather than pushing rows onto the next. TanStack only expands inside its
    // own pagination step when this is off, so a table it does not paginate
    // (every row shown, or paged by the server) must expand the usual way.
    paginateExpandedRows: !clientPaging,
    // Paging is reset where it should be — a new search, a new sort — and not
    // on every change to `data`, which would throw a reader editing a cell on
    // page 3 back to page 1.
    autoResetPageIndex: false,
    enableSorting,
    enableColumnResizing,
    enableColumnPinning,
    manualSorting,
    manualPagination: paging?.mode === "server",
    manualFiltering: search == null,
    rowCount: paging?.mode === "server" ? paging.rowCount : undefined,
    globalFilterFn: "includesString",
    // Nested rows: a parent stays when it or anything under it matches, so a
    // search finds a child and the parents that lead to it.
    filterFromLeafRows: getSubRows != null,
    getColumnCanGlobalFilter: (column) =>
      searchColumns ? searchColumns.includes(column.id) : column.accessorFn != null,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: search ? getFilteredRowModel() : undefined,
    getPaginationRowModel: clientPaging ? getPaginationRowModel() : undefined,
  });
}
