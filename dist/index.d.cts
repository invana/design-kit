import * as React$1 from 'react';
import { RowData, ColumnDef, PaginationState, OnChangeFn, SortingState, Table, CellContext } from '@tanstack/react-table';
export { ColumnDef, ColumnFiltersState, ColumnOrderState, ColumnPinningState, PaginationState, SortingState, VisibilityState } from '@tanstack/react-table';

type EditType = 'text' | 'number' | 'select';
type EditOption = {
    label: string;
    value: string;
};
declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        editable?: boolean;
        editType?: EditType;
        options?: EditOption[];
        align?: 'left' | 'center' | 'right';
        /**
         * Read this column as the record writes it — an id, a digest, a count, a
         * duration. Mono is not decoration here: it is what makes a column of
         * addresses scannable and a column of numbers comparable down its own
         * length.
         */
        mono?: boolean;
        /**
         * Extra class(es) applied to this column's body `<td>`. Use to control
         * padding, vertical alignment, or background when rendering your own
         * always-on controls (Switch/Select/Input) inside `cell()`.
         */
        cellClassName?: string;
        /** Extra class(es) applied to this column's header `<th>`. */
        headerClassName?: string;
    }
}
type CellEditHandler<TData> = (args: {
    rowIndex: number;
    columnId: string;
    value: unknown;
    row: TData;
}) => void;

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    pageSize?: number;
    pageSizeOptions?: number[];
    enableSorting?: boolean;
    enablePagination?: boolean;
    enableColumnVisibility?: boolean;
    enableColumnReordering?: boolean;
    enableColumnResizing?: boolean;
    enableColumnPinning?: boolean;
    onCellEdit?: CellEditHandler<TData>;
    toolbar?: React$1.ReactNode;
    /** Content rendered as a sticky summary bar inside the table's bordered container, below the rows. */
    footer?: React$1.ReactNode;
    className?: string;
    emptyState?: React$1.ReactNode;
    /** Server-side mode: skip client pagination — `data` is already the current page. Requires `pageCount` (or `rowCount`). */
    manualPagination?: boolean;
    /** Server-side mode: skip client sorting — caller refetches when `sorting` changes. */
    manualSorting?: boolean;
    /** Total pages on server (for manualPagination). */
    pageCount?: number;
    /** Total rows on server (drives "Showing X–Y of Z" in manual mode). */
    rowCount?: number;
    /** Controlled pagination state. */
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    /** Controlled sorting state. */
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    /** Show a loading overlay over the table body. */
    loading?: boolean;
    /**
     * Presentational row grouping — returns the group a row belongs to, or
     * `null` for none. A full-width header row is emitted whenever the key
     * changes from the previous row.
     *
     * Deliberately *not* TanStack's aggregating grouping model. This is for a
     * list that already arrives in the right order and wants section headings in
     * it — a story index, a queue split into questions/proposals/results. It
     * sorts nothing and aggregates nothing, so it cannot disagree with the order
     * the caller chose.
     */
    groupBy?: (row: TData) => string | null | undefined;
    /** What a group header row contains. Defaults to the key. */
    renderGroupHeader?: (key: string, rows: TData[]) => React$1.ReactNode;
    /**
     * `compact` is the dense reading — 26px rows at `text-sm`, which is what a
     * journal, a trace or a step's output table is drawn at. The primitive
     * `Table` has carried it all along; this is the table that passes it on.
     */
    density?: "default" | "compact";
    /**
     * How deep this row sits under another — a child run under the run that
     * spawned it. Indents the **first** cell only, so the shape of the list is
     * carried by the column a reader is scanning and not by the whole row.
     *
     * Presentational, like `groupBy`: it nests nothing and sorts nothing, because
     * the caller already has the rows in the order it wants them.
     */
    rowIndent?: (row: TData) => number | undefined;
    /**
     * Which row is the one being read elsewhere — the run open in the panel, the
     * step open on its page. Drawn as an accent ground with a rule down its
     * leading edge, so it is still findable after a scroll.
     */
    isRowSelected?: (row: TData) => boolean;
    /** Makes rows activate — click, `Enter` or `Space`. */
    onRowClick?: (row: TData) => void;
}
declare function DataTable<TData extends RowData>({ columns, data, pageSize, pageSizeOptions, enableSorting, enablePagination, enableColumnVisibility, enableColumnReordering, enableColumnResizing, enableColumnPinning, onCellEdit, toolbar, footer, className, emptyState, manualPagination, manualSorting, pageCount, rowCount, pagination: paginationProp, onPaginationChange, sorting: sortingProp, onSortingChange, loading, groupBy, renderGroupHeader, density, rowIndent, isRowSelected, onRowClick, }: DataTableProps<TData>): React$1.JSX.Element;

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    pageSizeOptions?: number[];
}
declare function DataTablePagination<TData>({ table, pageSizeOptions, }: DataTablePaginationProps<TData>): React$1.JSX.Element;

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    enableColumnVisibility?: boolean;
    enableColumnPinning?: boolean;
    children?: React.ReactNode;
}
declare function DataTableToolbar<TData>({ table, enableColumnVisibility, enableColumnPinning, children, }: DataTableToolbarProps<TData>): React$1.JSX.Element;

interface EditableCellProps<TData> {
    ctx: CellContext<TData, unknown>;
    editType?: EditType;
    options?: EditOption[];
    align?: 'left' | 'center' | 'right';
    onCellEdit?: CellEditHandler<TData>;
}
declare function EditableCell<TData>({ ctx, editType, options, align, onCellEdit, }: EditableCellProps<TData>): React$1.JSX.Element;

export { type CellEditHandler, DataTable, DataTablePagination, type DataTableProps, DataTableToolbar, type EditOption, type EditType, EditableCell };
