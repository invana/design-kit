import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ExpandedState,
  type Header,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  type TableDensity,
} from "@invana/ui";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronsUpDown,
  GripVertical,
} from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { EditableCell } from "./editable-cell";
import type { CellEditHandler } from "./types";

export interface DataTableProps<TData extends RowData> {
  // TanStack's own idiom: a column's value type varies by column, and a
  // `ColumnDef<T, string>` is not assignable to `ColumnDef<T, unknown>`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  toolbar?: React.ReactNode;
  /** Content rendered as a sticky summary bar inside the table's bordered container, below the rows. */
  footer?: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
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
  renderGroupHeader?: (key: string, rows: TData[]) => React.ReactNode;
  /**
   * `compact` is the dense reading — 26px rows at `text-sm`, which is what a
   * journal, a trace or a step's output table is drawn at. The primitive
   * `Table` has carried it all along; this is the table that passes it on.
   */
  density?: TableDensity;
  /**
   * Draw the box around the table. Off for a table that sits directly in a
   * card or a panel's column — the edge already frames it, and a second border
   * a few pixels in reads as a box inside a box. The row rules stay.
   */
  bordered?: boolean;
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
  /**
   * Rows under a row, with the same columns — a plan's subtasks, a folder's
   * files, a dataset's tables. A row with children gets a chevron in its first
   * cell; each level indents that cell, as `rowIndent` does for a flat list
   * (and wins over it). Sorting orders siblings, so children stay under their
   * parent; pagination counts top-level rows, so opening one never pushes
   * another onto the next page.
   */
  getSubRows?: (row: TData) => TData[] | undefined;
  /**
   * Anything under a row, the full width of the table — a payload, a small
   * table, a trace. Drawn with no box of its own, aligned with the row's
   * content. Every row can open one unless `canExpand` says otherwise.
   */
  renderExpanded?: (row: TData) => React.ReactNode;
  /** Which rows `renderExpanded` has something for. Defaults to all of them. */
  canExpand?: (row: TData) => boolean;
  /**
   * Which rows start open: `true` for all, or `{ [rowId]: true }` for some.
   * Ignored when `expanded` is controlled.
   */
  defaultExpanded?: ExpandedState;
  /** Which rows are open, by row id — `true` for all. Controlled. */
  expanded?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  /** Also open and close a row by clicking it, not only its chevron. */
  expandOnRowClick?: boolean;
  /**
   * A row's id — what `expanded` is keyed by. Defaults to its position
   * (`0`, `0.1`, …), which moves when the data does; pass one to keep a row
   * open across a refetch or a sort.
   */
  getRowId?: (row: TData, index: number, parent?: { id: string }) => string;
}

/** How far a first cell's content steps in per level, in px. */
const INDENT_STEP = 14;
/** The first cell's own left padding, in px — `px-2`. */
const CELL_PAD = 8;

function getCommonPinStyles<TData>(
  header: Header<TData, unknown>,
): React.CSSProperties {
  const isPinned = header.column.getIsPinned();
  if (!isPinned) return {};
  return {
    position: "sticky",
    left: isPinned === "left" ? header.column.getStart("left") : undefined,
    right: isPinned === "right" ? header.column.getAfter("right") : undefined,
    zIndex: 2,
  };
}

interface DraggableHeaderProps<TData> {
  header: Header<TData, unknown>;
  enableReordering: boolean;
  enableResizing: boolean;
  enableSorting: boolean;
}

function DraggableHeader<TData>({
  header,
  enableReordering,
  enableResizing,
  enableSorting,
}: DraggableHeaderProps<TData>) {
  const column = header.column;
  const isPinned = column.getIsPinned();
  const canDrag = enableReordering && !isPinned && column.id !== "__select";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, disabled: !canDrag });

  const sortDir = column.getIsSorted();
  const canSort = enableSorting && column.getCanSort();
  const align = column.columnDef.meta?.align ?? "left";
  const alignClass =
    align === "right"
      ? "justify-end text-right"
      : align === "center"
        ? "justify-center text-center"
        : "justify-start text-left";

  return (
    <TableHead
      ref={setNodeRef}
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        ...getCommonPinStyles(header),
        ...(isPinned ? { backgroundColor: "hsl(var(--background))" } : {}),
      }}
      className={cn(
        "group relative select-none",
        isPinned &&
          "bg-background shadow-[inset_-1px_0_0_0_hsl(var(--border))]",
        column.columnDef.meta?.headerClassName,
      )}
      // Only a draggable header takes dnd-kit's attributes: when reordering is
      // off they carry `aria-disabled`, which a screen reader applies to the
      // whole header — announcing its sort button as disabled.
      {...(canDrag ? attributes : {})}
    >
      <div className={cn("flex items-center gap-1", alignClass)}>
        {canDrag && (
          <button
            type="button"
            className="cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            {...listeners}
            aria-label="Drag column"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        )}
        {canSort ? (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            aria-label={
              sortDir === "asc"
                ? "Sorted ascending — sort descending"
                : sortDir === "desc"
                  ? "Sorted descending — clear sort"
                  : "Sort"
            }
            className={cn(
              "-mx-1 inline-flex items-center gap-1 rounded-control px-1 font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              // Right-aligned columns keep their text flush right, so the
              // arrow goes on the left where it cannot push the label off it.
              align === "right" && "flex-row-reverse",
              sortDir && "text-foreground",
            )}
          >
            {flexRender(column.columnDef.header, header.getContext())}
            {/* The arrow says the column is sorted. Unsorted, it is only an
                offer, so it waits for the pointer rather than repeating down
                every header. */}
            {sortDir === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : sortDir === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50 group-focus-within:opacity-50" />
            )}
          </button>
        ) : (
          <span className="font-medium">
            {flexRender(column.columnDef.header, header.getContext())}
          </span>
        )}
      </div>
      {enableResizing && column.getCanResize() && (
        <button
          type="button"
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={cn(
            "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-transparent hover:bg-border",
            column.getIsResizing() && "bg-primary",
          )}
          aria-label="Resize column"
        />
      )}
    </TableHead>
  );
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions,
  enableSorting = true,
  enablePagination = true,
  enableColumnVisibility = true,
  enableColumnReordering = false,
  enableColumnResizing = false,
  enableColumnPinning = false,
  onCellEdit,
  toolbar,
  footer,
  className,
  emptyState,
  manualPagination = false,
  manualSorting = false,
  pageCount,
  rowCount,
  pagination: paginationProp,
  onPaginationChange,
  sorting: sortingProp,
  onSortingChange,
  loading = false,
  groupBy,
  renderGroupHeader,
  density = "default",
  bordered = true,
  rowIndent,
  isRowSelected,
  onRowClick,
  getSubRows,
  renderExpanded,
  canExpand,
  defaultExpanded,
  expanded: expandedProp,
  onExpandedChange,
  expandOnRowClick = false,
  getRowId,
}: DataTableProps<TData>) {
  const expandable = getSubRows != null || renderExpanded != null;
  const [internalExpanded, setInternalExpanded] = React.useState<ExpandedState>(
    defaultExpanded ?? {},
  );
  const expanded = expandedProp ?? internalExpanded;
  const setExpanded: OnChangeFn<ExpandedState> = (updater) => {
    if (onExpandedChange) onExpandedChange(updater);
    if (!expandedProp) setInternalExpanded(updater);
  };

  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    [],
  );
  const sorting = sortingProp ?? internalSorting;
  const setSorting: OnChangeFn<SortingState> = (updater) => {
    if (onSortingChange) onSortingChange(updater);
    if (!sortingProp) setInternalSorting(updater);
  };

  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize,
    });
  const pagination = paginationProp ?? internalPagination;
  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    if (onPaginationChange) onPaginationChange(updater);
    if (!paginationProp) setInternalPagination(updater);
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as `columns` above
  const wrappedColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    return columns.map((col) => {
      const meta = col.meta;
      if (meta?.editable && !col.cell) {
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
      }
      return col;
    });
  }, [columns, onCellEdit]);

  // TanStack returns functions the React Compiler cannot memoise, so it skips
  // this component — which is correct, and nothing here relies on it.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: wrappedColumns,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      columnPinning,
      columnOrder,
      expanded,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    onExpandedChange: setExpanded,
    getSubRows,
    getRowId,
    getRowCanExpand: (row) =>
      row.subRows.length > 0 ||
      (renderExpanded != null && (canExpand?.(row.original) ?? true)),
    getExpandedRowModel: expandable ? getExpandedRowModel() : undefined,
    // Page by top-level rows: opening one adds its children to this page
    // rather than pushing rows onto the next. TanStack only expands inside its
    // own pagination step when this is off, so a table it does not paginate
    // (pagination off, or paged by the server) must expand the usual way.
    paginateExpandedRows: !(enablePagination && !manualPagination),
    enableSorting,
    enableColumnResizing,
    enableColumnPinning,
    manualPagination,
    manualSorting,
    // Only a server-paged table needs telling how many pages there are; given
    // `-1` a client-paged one reports "Page 1 of -1" and its last-page button
    // jumps nowhere.
    pageCount: manualPagination ? (pageCount ?? -1) : undefined,
    rowCount,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel:
      enablePagination && !manualPagination
        ? getPaginationRowModel()
        : undefined,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColumnOrder((prev) => {
      const next = prev.length
        ? prev
        : table.getAllLeafColumns().map((c) => c.id);
      const oldIndex = next.indexOf(active.id as string);
      const newIndex = next.indexOf(over.id as string);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(next, oldIndex, newIndex);
    });
  };

  const visibleLeafColumnIds = table.getVisibleLeafColumns().map((c) => c.id);
  // Groups section the top level only: a child row sits under its parent,
  // whatever group it would name on its own.
  const topLevel = table.getRowModel().rows.filter((r) => r.depth === 0);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <DataTableToolbar
        table={table}
        enableColumnVisibility={enableColumnVisibility}
        enableColumnPinning={enableColumnPinning}
      >
        {toolbar}
      </DataTableToolbar>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <div className={cn("relative overflow-auto", bordered && "rounded-md border")}>
          {loading && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-12 text-muted-foreground">
              Loading…
            </div>
          )}
          <Table
            bordered={false}
            density={density}
            style={{
              width: enableColumnResizing ? table.getTotalSize() : undefined,
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                // The header is not a row a reader picks, so it does not light up.
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  <SortableContext
                    items={visibleLeafColumnIds}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableHeader
                        key={header.id}
                        header={header}
                        enableReordering={enableColumnReordering}
                        enableResizing={enableColumnResizing}
                        enableSorting={enableSorting}
                      />
                    ))}
                  </SortableContext>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllLeafColumns().length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyState ?? "No results."}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const groupKey =
                    row.depth === 0 ? groupBy?.(row.original) : undefined;
                  const previousTop = topLevel[topLevel.indexOf(row) - 1];
                  const previousKey = previousTop
                    ? groupBy?.(previousTop.original)
                    : undefined;
                  const startsGroup =
                    groupKey != null && groupKey !== previousKey;
                  const canExpand = expandable && row.getCanExpand();
                  const isExpanded = canExpand && row.getIsExpanded();
                  const panel =
                    isExpanded && renderExpanded
                      ? renderExpanded(row.original)
                      : null;
                  const depth = getSubRows
                    ? row.depth
                    : (rowIndent?.(row.original) ?? 0);
                  const activates = onRowClick != null || (expandOnRowClick && canExpand);
                  const activate = () => {
                    onRowClick?.(row.original);
                    if (expandOnRowClick && canExpand) row.toggleExpanded();
                  };
                  return (
                    <React.Fragment key={row.id}>
                      {startsGroup ? (
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableCell
                            colSpan={table.getAllLeafColumns().length}
                            className="py-1 font-medium"
                          >
                            {renderGroupHeader
                              ? renderGroupHeader(
                                  groupKey,
                                  topLevel
                                    .filter(
                                      (r) => groupBy?.(r.original) === groupKey,
                                    )
                                    .map((r) => r.original),
                                )
                              : groupKey}
                          </TableCell>
                        </TableRow>
                      ) : null}
                      <TableRow
                        data-selected={
                          isRowSelected?.(row.original) || undefined
                        }
                        aria-selected={
                          isRowSelected ? isRowSelected(row.original) : undefined
                        }
                        tabIndex={activates ? 0 : undefined}
                        onClick={activates ? activate : undefined}
                        onKeyDown={
                          activates
                            ? (event) => {
                                if (event.target !== event.currentTarget) return;
                                if (event.key !== "Enter" && event.key !== " ")
                                  return;
                                event.preventDefault();
                                activate();
                              }
                            : undefined
                        }
                        className={cn(
                          isRowSelected?.(row.original) &&
                            "bg-accent shadow-[inset_2px_0_0_var(--color-primary)] hover:bg-accent",
                          activates &&
                            "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                          // The panel reads as the row's own continuation, so
                          // no rule between them.
                          panel != null && "border-b-0",
                        )}
                      >
                        {row.getVisibleCells().map((cell, cellIndex) => {
                          const column = cell.column;
                          const isPinned = column.getIsPinned();
                          const align = column.columnDef.meta?.align ?? "left";
                          const first = cellIndex === 0;
                          const indent = first && depth ? depth : undefined;
                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                width: cell.column.getSize(),
                                ...(indent
                                  ? {
                                      paddingLeft: `${indent * INDENT_STEP + CELL_PAD}px`,
                                    }
                                  : {}),
                                ...(isPinned
                                  ? {
                                      position: "sticky",
                                      left:
                                        isPinned === "left"
                                          ? column.getStart("left")
                                          : undefined,
                                      right:
                                        isPinned === "right"
                                          ? column.getAfter("right")
                                          : undefined,
                                      zIndex: 1,
                                      backgroundColor: "hsl(var(--background))",
                                    }
                                  : {}),
                              }}
                              className={cn(
                                align === "right" && "text-right",
                                align === "center" && "text-center",
                                isPinned &&
                                  "bg-background shadow-[inset_-1px_0_0_0_hsl(var(--border))]",
                                column.columnDef.meta?.mono && "font-mono",
                                column.columnDef.meta?.cellClassName,
                              )}
                            >
                              {first && expandable ? (
                                <div className="flex items-center gap-1">
                                  {canExpand ? (
                                    <button
                                      type="button"
                                      aria-expanded={isExpanded}
                                      aria-label={isExpanded ? "Collapse row" : "Expand row"}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        row.toggleExpanded();
                                      }}
                                      className="inline-flex size-4 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                      <ChevronRight
                                        aria-hidden
                                        className={cn(
                                          "size-3.5 transition-transform motion-reduce:transition-none",
                                          isExpanded && "rotate-90",
                                        )}
                                      />
                                    </button>
                                  ) : (
                                    // A leaf keeps the chevron's room, so its
                                    // text lines up with its expandable siblings.
                                    <span aria-hidden className="size-4 shrink-0" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </div>
                                </div>
                              ) : (
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {panel != null ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell
                            colSpan={row.getVisibleCells().length}
                            className="h-auto pt-0"
                            style={{
                              // In line with the row's content: past its
                              // indent and the chevron's 16px + 4px gap.
                              paddingLeft: `${depth * INDENT_STEP + CELL_PAD + 20}px`,
                            }}
                          >
                            {panel}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
          {footer != null && (
            <div className="sticky bottom-0 border-t bg-muted/40 px-3 py-2 text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </DndContext>

      {enablePagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}
