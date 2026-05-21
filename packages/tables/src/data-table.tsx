import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type Header,
  type RowData,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@invana/ui';
import { ArrowDown, ArrowUp, ChevronsUpDown, GripVertical } from 'lucide-react';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { EditableCell } from './editable-cell';
import type { CellEditHandler } from './types';

export interface DataTableProps<TData extends RowData> {
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
  className?: string;
  emptyState?: React.ReactNode;
}

function getCommonPinStyles<TData>(header: Header<TData, unknown>): React.CSSProperties {
  const isPinned = header.column.getIsPinned();
  if (!isPinned) return {};
  return {
    position: 'sticky',
    left: isPinned === 'left' ? header.column.getStart('left') : undefined,
    right: isPinned === 'right' ? header.column.getAfter('right') : undefined,
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
  const canDrag = enableReordering && !isPinned && column.id !== '__select';
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: column.id, disabled: !canDrag });

  const sortDir = column.getIsSorted();
  const canSort = enableSorting && column.getCanSort();
  const align = column.columnDef.meta?.align ?? 'left';
  const alignClass =
    align === 'right' ? 'justify-end text-right' : align === 'center' ? 'justify-center text-center' : 'justify-start text-left';

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
        ...(isPinned ? { backgroundColor: 'hsl(var(--background))' } : {}),
      }}
      className={cn(
        'group relative select-none bg-muted/40',
        isPinned && 'bg-background shadow-[inset_-1px_0_0_0_hsl(var(--border))]',
      )}
      {...attributes}
    >
      <div className={cn('flex items-center gap-1', alignClass)}>
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
            className="inline-flex items-center gap-1 font-medium hover:text-foreground"
          >
            {flexRender(column.columnDef.header, header.getContext())}
            {sortDir === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : sortDir === 'desc' ? (
              <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
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
            'absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-transparent hover:bg-border',
            column.getIsResizing() && 'bg-primary',
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
  className,
  emptyState,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: [],
    right: [],
  });
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(() =>
    columns.map((c, i) => (c as any).id ?? (c as any).accessorKey ?? String(i)),
  );

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

  const table = useReactTable({
    data,
    columns: wrappedColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnPinning,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    initialState: {
      pagination: { pageIndex: 0, pageSize },
    },
    enableSorting,
    enableColumnResizing,
    enableColumnPinning,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColumnOrder((prev) => {
      const next = prev.length ? prev : table.getAllLeafColumns().map((c) => c.id);
      const oldIndex = next.indexOf(active.id as string);
      const newIndex = next.indexOf(over.id as string);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(next, oldIndex, newIndex);
    });
  };

  const visibleLeafColumnIds = table.getVisibleLeafColumns().map((c) => c.id);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
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
        <div className="overflow-auto rounded-md border">
          <Table
            style={{
              width: enableColumnResizing ? table.getTotalSize() : undefined,
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
                    {emptyState ?? 'No results.'}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const column = cell.column;
                      const isPinned = column.getIsPinned();
                      const align = column.columnDef.meta?.align ?? 'left';
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                            ...(isPinned
                              ? {
                                  position: 'sticky',
                                  left:
                                    isPinned === 'left'
                                      ? column.getStart('left')
                                      : undefined,
                                  right:
                                    isPinned === 'right'
                                      ? column.getAfter('right')
                                      : undefined,
                                  zIndex: 1,
                                  backgroundColor: 'hsl(var(--background))',
                                }
                              : {}),
                          }}
                          className={cn(
                            align === 'right' && 'text-right',
                            align === 'center' && 'text-center',
                            isPinned &&
                              'bg-background shadow-[inset_-1px_0_0_0_hsl(var(--border))]',
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DndContext>

      {enablePagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}
