import * as React from "react";
import {
  flexRender,
  type Header,
  type RowData,
  type Table as TanstackTable,
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
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@invana/ui";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronsUpDown,
  GripVertical,
} from "lucide-react";
import type { TableViewProps } from "./props";

/** How far a first cell's content steps in per level, in px. */
const INDENT_STEP = 14;
/** The first cell's own left padding, in px — `px-2`. */
const CELL_PAD = 8;
/** The tint a called-out row or cell sits on. */
const HIGHLIGHT = "bg-primary/15";
/**
 * A cell holding an always-on `sm` control: the control's border is the
 * cell's breathing room, so the cell drops most of its own and the row keeps
 * the height a row of text has.
 */
const CONTROL_CELL = "py-1 group-data-[density=compact]/table:py-0";

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
      // The button is named by its column; the header says how it is sorted.
      aria-sort={
        canSort
          ? sortDir === "asc"
            ? "ascending"
            : sortDir === "desc"
              ? "descending"
              : "none"
          : undefined
      }
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

export interface TableGridProps<TData extends RowData>
  extends TableViewProps<TData> {
  table: TanstackTable<TData>;
  /** Dim the rows under a spinner — a page on its way. */
  loading?: boolean;
}

/**
 * The rows themselves — header, body, group headings, expanded panels and
 * the sticky footer, in their box. Each table draws its own chrome around
 * this and hands it the model.
 */
export function TableGrid<TData extends RowData>({
  table,
  loading = false,
  footer,
  emptyState,
  groupBy,
  renderGroupHeader,
  density = "default",
  seamless = false,
  rowIndent,
  isRowSelected,
  isRowHighlighted,
  isCellHighlighted,
  isTotalRow,
  rowClassName,
  headerRowClassName,
  minWidth,
  onRowClick,
  getSubRows,
  renderExpanded,
  expandOnRowClick = false,
  enableColumnReordering = false,
  enableColumnResizing = false,
  enableSorting = true,
}: TableGridProps<TData>) {
  const expandable = getSubRows != null || renderExpanded != null;

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
    table.setColumnOrder((prev) => {
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
  const rows = table.getRowModel().rows;
  // Groups section the top level only: a child row sits under its parent,
  // whatever group it would name on its own.
  const topLevel = rows.filter((r) => r.depth === 0);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn("relative overflow-auto", !seamless && "rounded-md border")}
        aria-busy={loading || undefined}
      >
        {loading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-12 text-muted-foreground">
            <Spinner />
          </div>
        )}
        <Table
          bordered={false}
          seamless={seamless}
          density={density}
          style={{
            width: enableColumnResizing ? table.getTotalSize() : undefined,
            minWidth,
          }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              // The header is not a row a reader picks, so it does not light up.
              <TableRow
                key={headerGroup.id}
                className={cn("hover:bg-transparent", headerRowClassName)}
              >
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
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {/* A first page still on its way is not an empty table;
                      the spinner already says so. */}
                  {loading ? null : (emptyState ?? "No results.")}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
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
                const selected = isRowSelected?.(row.original) ?? false;
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
                      data-selected={selected || undefined}
                      aria-selected={isRowSelected ? selected : undefined}
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
                        isRowHighlighted?.(row.original) &&
                          `${HIGHLIGHT} hover:bg-primary/15`,
                        isTotalRow?.(row.original) &&
                          "border-t border-border font-semibold hover:bg-transparent [&>td]:border-b-0",
                        selected &&
                          "bg-accent shadow-[inset_2px_0_0_var(--color-primary)] hover:bg-accent",
                        // The rule down the leading edge needs the text off it,
                        // even in an unboxed table whose first column is flush.
                        selected &&
                          seamless &&
                          "[&[data-selected]>td:first-child]:ps-2",
                        activates &&
                          "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                        // The panel reads as the row's own continuation, so
                        // no rule between them.
                        panel != null && "border-b-0",
                        rowClassName?.(row.original),
                      )}
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        const column = cell.column;
                        const meta = column.columnDef.meta;
                        const isPinned = column.getIsPinned();
                        const align = meta?.align ?? "left";
                        const first = cellIndex === 0;
                        const indent = first && depth ? depth : undefined;
                        const highlighted =
                          isCellHighlighted?.(row.original, column.id) ?? false;
                        return (
                          <TableCell
                            key={cell.id}
                            data-highlighted={highlighted || undefined}
                            style={{
                              width: cell.column.getSize(),
                              ...(indent
                                ? {
                                    paddingLeft: `${indent * INDENT_STEP + (seamless ? 0 : CELL_PAD)}px`,
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
                              meta?.mono && "font-mono",
                              meta?.control && CONTROL_CELL,
                              highlighted && HIGHLIGHT,
                              typeof meta?.cellClassName === "function"
                                ? meta.cellClassName(row.original)
                                : meta?.cellClassName,
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
                            paddingLeft: `${depth * INDENT_STEP + (seamless ? 0 : CELL_PAD) + 20}px`,
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
  );
}
