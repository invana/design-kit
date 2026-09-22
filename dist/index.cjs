'use strict';

var React2 = require('react');
var reactTable = require('@tanstack/react-table');
var core = require('@dnd-kit/core');
var modifiers = require('@dnd-kit/modifiers');
var sortable = require('@dnd-kit/sortable');
var utilities = require('@dnd-kit/utilities');
var ui = require('@invana/ui');
var lucideReact = require('lucide-react');
var forms = require('@invana/forms');
var jsxRuntime = require('react/jsx-runtime');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React2__namespace = /*#__PURE__*/_interopNamespace(React2);

// src/data-table.tsx
function DataTablePagination({
  table,
  pageSizeOptions = [10, 20, 50, 100]
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const serverRowCount = table.options.rowCount;
  const total = typeof serverRowCount === "number" ? serverRowCount : table.getFilteredRowModel().rows.length;
  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between gap-4 px-2 py-2", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-muted-foreground", children: total === 0 ? "No rows" : `Showing ${start}\u2013${end} of ${total}` }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "Rows per page" }),
        /* @__PURE__ */ jsxRuntime.jsxs(
          forms.Select,
          {
            value: String(pageSize),
            onValueChange: (v) => table.setPageSize(Number(v)),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(forms.SelectTrigger, { className: "h-8 w-[72px]", children: /* @__PURE__ */ jsxRuntime.jsx(forms.SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntime.jsx(forms.SelectContent, { children: pageSizeOptions.map((s) => /* @__PURE__ */ jsxRuntime.jsx(forms.SelectItem, { value: String(s), children: s }, s)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-muted-foreground tabular-nums", children: [
        "Page ",
        pageIndex + 1,
        " of ",
        table.getPageCount() || 1
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            variant: "outline",
            size: "icon",
            className: "h-8 w-8",
            onClick: () => table.setPageIndex(0),
            disabled: !table.getCanPreviousPage(),
            "aria-label": "First page",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronsLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            variant: "outline",
            size: "icon",
            className: "h-8 w-8",
            onClick: () => table.previousPage(),
            disabled: !table.getCanPreviousPage(),
            "aria-label": "Previous page",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            variant: "outline",
            size: "icon",
            className: "h-8 w-8",
            onClick: () => table.nextPage(),
            disabled: !table.getCanNextPage(),
            "aria-label": "Next page",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            variant: "outline",
            size: "icon",
            className: "h-8 w-8",
            onClick: () => table.setPageIndex(table.getPageCount() - 1),
            disabled: !table.getCanNextPage(),
            "aria-label": "Last page",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronsRight, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] });
}
function DataTableToolbar({
  table,
  enableColumnVisibility = true,
  enableColumnPinning = false,
  children
}) {
  const toggleableCols = table.getAllLeafColumns().filter((c) => c.getCanHide());
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between gap-2 px-2 py-2", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2", children }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2", children: enableColumnVisibility && toggleableCols.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(ui.DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Button, { variant: "outline", size: "sm", className: "h-8", children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Settings2, { className: "mr-2 h-4 w-4" }),
        "Columns"
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs(ui.DropdownMenuContent, { align: "end", className: "w-48", children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuLabel, { children: "Toggle columns" }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuSeparator, {}),
        toggleableCols.map((col) => /* @__PURE__ */ jsxRuntime.jsx(
          ui.DropdownMenuCheckboxItem,
          {
            className: "capitalize",
            checked: col.getIsVisible(),
            onCheckedChange: (v) => col.toggleVisibility(!!v),
            onSelect: (e) => e.preventDefault(),
            children: String(col.columnDef.header ?? col.id)
          },
          col.id
        )),
        enableColumnPinning && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuLabel, { children: "Pinning" }),
          table.getAllLeafColumns().map((col) => {
            if (!col.getCanPin()) return null;
            const pinned = col.getIsPinned();
            return /* @__PURE__ */ jsxRuntime.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-2 py-1",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "capitalize truncate", children: String(col.columnDef.header ?? col.id) }),
                  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => col.pin(pinned === "left" ? false : "left"),
                        className: `rounded px-1.5 py-0.5 text-sm ${pinned === "left" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`,
                        children: "L"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => col.pin(pinned === "right" ? false : "right"),
                        className: `rounded px-1.5 py-0.5 text-sm ${pinned === "right" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`,
                        children: "R"
                      }
                    )
                  ] })
                ]
              },
              col.id
            );
          })
        ] })
      ] })
    ] }) })
  ] });
}
function EditableCell({
  ctx,
  editType = "text",
  options,
  align = "left",
  onCellEdit
}) {
  const initial = ctx.getValue();
  const [editing, setEditing] = React2__namespace.useState(false);
  const [draft, setDraft] = React2__namespace.useState(initial);
  React2__namespace.useEffect(() => {
    if (!editing) setDraft(initial);
  }, [initial, editing]);
  const commit = (next) => {
    setEditing(false);
    if (next === initial) return;
    onCellEdit?.({
      rowIndex: ctx.row.index,
      columnId: ctx.column.id,
      value: next,
      row: ctx.row.original
    });
  };
  const alignClass = align === "right" ? "text-right justify-end" : align === "center" ? "text-center justify-center" : "text-left justify-start";
  if (!editing) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        onClick: () => setEditing(true),
        className: ui.cn(
          "group flex w-full items-center rounded-control px-1.5 py-1 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring",
          alignClass
        ),
        title: "Click to edit",
        children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: initial == null || initial === "" ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground italic", children: "empty" }) : String(initial) })
      }
    );
  }
  if (editType === "select") {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      forms.Select,
      {
        defaultValue: initial == null ? void 0 : String(initial),
        onValueChange: (v) => commit(v),
        open: true,
        onOpenChange: (open) => {
          if (!open) setEditing(false);
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(forms.SelectTrigger, { className: "h-8", children: /* @__PURE__ */ jsxRuntime.jsx(forms.SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntime.jsx(forms.SelectContent, { children: options?.map((o) => /* @__PURE__ */ jsxRuntime.jsx(forms.SelectItem, { value: o.value, children: o.label }, o.value)) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    forms.Input,
    {
      autoFocus: true,
      type: editType === "number" ? "number" : "text",
      defaultValue: initial == null ? "" : String(initial),
      onBlur: (e) => {
        const v = editType === "number" ? Number(e.currentTarget.value) : e.currentTarget.value;
        commit(v);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          e.preventDefault();
          setEditing(false);
        }
      },
      className: ui.cn("h-8", alignClass)
    }
  );
}
function getCommonPinStyles(header) {
  const isPinned = header.column.getIsPinned();
  if (!isPinned) return {};
  return {
    position: "sticky",
    left: isPinned === "left" ? header.column.getStart("left") : void 0,
    right: isPinned === "right" ? header.column.getAfter("right") : void 0,
    zIndex: 2
  };
}
function DraggableHeader({
  header,
  enableReordering,
  enableResizing,
  enableSorting
}) {
  const column = header.column;
  const isPinned = column.getIsPinned();
  const canDrag = enableReordering && !isPinned && column.id !== "__select";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = sortable.useSortable({ id: column.id, disabled: !canDrag });
  const sortDir = column.getIsSorted();
  const canSort = enableSorting && column.getCanSort();
  const align = column.columnDef.meta?.align ?? "left";
  const alignClass = align === "right" ? "justify-end text-right" : align === "center" ? "justify-center text-center" : "justify-start text-left";
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ui.TableHead,
    {
      ref: setNodeRef,
      colSpan: header.colSpan,
      style: {
        width: header.getSize(),
        transform: utilities.CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        ...getCommonPinStyles(header),
        ...isPinned ? { backgroundColor: "hsl(var(--background))" } : {}
      },
      className: ui.cn(
        "group relative select-none bg-muted/40",
        isPinned && "bg-background shadow-[inset_-1px_0_0_0_hsl(var(--border))]",
        column.columnDef.meta?.headerClassName
      ),
      ...attributes,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: ui.cn("flex items-center gap-1", alignClass), children: [
          canDrag && /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              className: "cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing",
              ...listeners,
              "aria-label": "Drag column",
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.GripVertical, { className: "h-3.5 w-3.5" })
            }
          ),
          canSort ? /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              type: "button",
              onClick: column.getToggleSortingHandler(),
              className: "inline-flex items-center gap-1 font-medium hover:text-foreground",
              children: [
                reactTable.flexRender(column.columnDef.header, header.getContext()),
                sortDir === "asc" ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowUp, { className: "h-3.5 w-3.5" }) : sortDir === "desc" ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronsUpDown, { className: "h-3.5 w-3.5 opacity-50" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: reactTable.flexRender(column.columnDef.header, header.getContext()) })
        ] }),
        enableResizing && column.getCanResize() && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: ui.cn(
              "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-transparent hover:bg-border",
              column.getIsResizing() && "bg-primary"
            ),
            "aria-label": "Resize column"
          }
        )
      ]
    }
  );
}
function DataTable({
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
  rowIndent,
  isRowSelected,
  onRowClick
}) {
  const [internalSorting, setInternalSorting] = React2__namespace.useState(
    []
  );
  const sorting = sortingProp ?? internalSorting;
  const setSorting = (updater) => {
    if (onSortingChange) onSortingChange(updater);
    if (!sortingProp) setInternalSorting(updater);
  };
  const [internalPagination, setInternalPagination] = React2__namespace.useState({
    pageIndex: 0,
    pageSize
  });
  const pagination = paginationProp ?? internalPagination;
  const setPagination = (updater) => {
    if (onPaginationChange) onPaginationChange(updater);
    if (!paginationProp) setInternalPagination(updater);
  };
  const [columnFilters, setColumnFilters] = React2__namespace.useState(
    []
  );
  const [columnVisibility, setColumnVisibility] = React2__namespace.useState({});
  const [columnPinning, setColumnPinning] = React2__namespace.useState({
    left: [],
    right: []
  });
  const [columnOrder, setColumnOrder] = React2__namespace.useState(
    () => columns.map((c, i) => c.id ?? c.accessorKey ?? String(i))
  );
  const wrappedColumns = React2__namespace.useMemo(() => {
    return columns.map((col) => {
      const meta = col.meta;
      if (meta?.editable && !col.cell) {
        return {
          ...col,
          cell: (ctx) => /* @__PURE__ */ jsxRuntime.jsx(
            EditableCell,
            {
              ctx,
              editType: meta.editType,
              options: meta.options,
              align: meta.align,
              onCellEdit
            }
          )
        };
      }
      return col;
    });
  }, [columns, onCellEdit]);
  const table = reactTable.useReactTable({
    data,
    columns: wrappedColumns,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      columnPinning,
      columnOrder
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    enableSorting,
    enableColumnResizing,
    enableColumnPinning,
    manualPagination,
    manualSorting,
    pageCount: pageCount ?? -1,
    rowCount,
    columnResizeMode: "onChange",
    getCoreRowModel: reactTable.getCoreRowModel(),
    getSortedRowModel: enableSorting && !manualSorting ? reactTable.getSortedRowModel() : void 0,
    getFilteredRowModel: reactTable.getFilteredRowModel(),
    getPaginationRowModel: enablePagination && !manualPagination ? reactTable.getPaginationRowModel() : void 0
  });
  const sensors = core.useSensors(
    core.useSensor(core.MouseSensor, { activationConstraint: { distance: 4 } }),
    core.useSensor(core.TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 }
    }),
    core.useSensor(core.KeyboardSensor)
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColumnOrder((prev) => {
      const next = prev.length ? prev : table.getAllLeafColumns().map((c) => c.id);
      const oldIndex = next.indexOf(active.id);
      const newIndex = next.indexOf(over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return sortable.arrayMove(next, oldIndex, newIndex);
    });
  };
  const visibleLeafColumnIds = table.getVisibleLeafColumns().map((c) => c.id);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: ui.cn("flex flex-col gap-2", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      DataTableToolbar,
      {
        table,
        enableColumnVisibility,
        enableColumnPinning,
        children: toolbar
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      core.DndContext,
      {
        sensors,
        collisionDetection: core.closestCenter,
        modifiers: [modifiers.restrictToHorizontalAxis],
        onDragEnd: handleDragEnd,
        children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative overflow-auto rounded-md border", children: [
          loading && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-12 text-muted-foreground", children: "Loading\u2026" }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            ui.Table,
            {
              density,
              style: {
                width: enableColumnResizing ? table.getTotalSize() : void 0
              },
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(ui.TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsxRuntime.jsx(ui.TableRow, { children: /* @__PURE__ */ jsxRuntime.jsx(
                  sortable.SortableContext,
                  {
                    items: visibleLeafColumnIds,
                    strategy: sortable.horizontalListSortingStrategy,
                    children: headerGroup.headers.map((header) => /* @__PURE__ */ jsxRuntime.jsx(
                      DraggableHeader,
                      {
                        header,
                        enableReordering: enableColumnReordering,
                        enableResizing: enableColumnResizing,
                        enableSorting
                      },
                      header.id
                    ))
                  }
                ) }, headerGroup.id)) }),
                /* @__PURE__ */ jsxRuntime.jsx(ui.TableBody, { children: table.getRowModel().rows.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx(ui.TableRow, { children: /* @__PURE__ */ jsxRuntime.jsx(
                  ui.TableCell,
                  {
                    colSpan: table.getAllLeafColumns().length,
                    className: "h-24 text-center text-muted-foreground",
                    children: emptyState ?? "No results."
                  }
                ) }) : table.getRowModel().rows.map((row, rowIndex, allRows) => {
                  const groupKey = groupBy?.(row.original);
                  const previousKey = rowIndex > 0 ? groupBy?.(allRows[rowIndex - 1].original) : void 0;
                  const startsGroup = groupKey != null && groupKey !== previousKey;
                  return /* @__PURE__ */ jsxRuntime.jsxs(React2__namespace.Fragment, { children: [
                    startsGroup ? /* @__PURE__ */ jsxRuntime.jsx(ui.TableRow, { className: "bg-muted/50 hover:bg-muted/50", children: /* @__PURE__ */ jsxRuntime.jsx(
                      ui.TableCell,
                      {
                        colSpan: table.getAllLeafColumns().length,
                        className: "py-1 font-medium",
                        children: renderGroupHeader ? renderGroupHeader(
                          groupKey,
                          allRows.filter(
                            (r) => groupBy?.(r.original) === groupKey
                          ).map((r) => r.original)
                        ) : groupKey
                      }
                    ) }) : null,
                    /* @__PURE__ */ jsxRuntime.jsx(
                      ui.TableRow,
                      {
                        "data-selected": isRowSelected?.(row.original) || void 0,
                        "aria-selected": isRowSelected ? isRowSelected(row.original) : void 0,
                        tabIndex: onRowClick ? 0 : void 0,
                        onClick: onRowClick ? () => onRowClick(row.original) : void 0,
                        onKeyDown: onRowClick ? (event) => {
                          if (event.key !== "Enter" && event.key !== " ")
                            return;
                          event.preventDefault();
                          onRowClick(row.original);
                        } : void 0,
                        className: ui.cn(
                          isRowSelected?.(row.original) && "bg-accent shadow-[inset_2px_0_0_var(--color-primary)] hover:bg-accent",
                          onRowClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
                        ),
                        children: row.getVisibleCells().map((cell, cellIndex) => {
                          const column = cell.column;
                          const isPinned = column.getIsPinned();
                          const align = column.columnDef.meta?.align ?? "left";
                          const indent = cellIndex === 0 ? rowIndent?.(row.original) : void 0;
                          return /* @__PURE__ */ jsxRuntime.jsx(
                            ui.TableCell,
                            {
                              style: {
                                width: cell.column.getSize(),
                                ...indent ? { paddingLeft: `${indent * 14 + 8}px` } : {},
                                ...isPinned ? {
                                  position: "sticky",
                                  left: isPinned === "left" ? column.getStart("left") : void 0,
                                  right: isPinned === "right" ? column.getAfter("right") : void 0,
                                  zIndex: 1,
                                  backgroundColor: "hsl(var(--background))"
                                } : {}
                              },
                              className: ui.cn(
                                align === "right" && "text-right",
                                align === "center" && "text-center",
                                isPinned && "bg-background shadow-[inset_-1px_0_0_0_hsl(var(--border))]",
                                column.columnDef.meta?.mono && "font-mono",
                                column.columnDef.meta?.cellClassName
                              ),
                              children: reactTable.flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            },
                            cell.id
                          );
                        })
                      }
                    )
                  ] }, row.id);
                }) })
              ]
            }
          ),
          footer != null && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "sticky bottom-0 border-t bg-muted/40 px-3 py-2 text-muted-foreground", children: footer })
        ] })
      }
    ),
    enablePagination && /* @__PURE__ */ jsxRuntime.jsx(DataTablePagination, { table, pageSizeOptions })
  ] });
}

exports.DataTable = DataTable;
exports.DataTablePagination = DataTablePagination;
exports.DataTableToolbar = DataTableToolbar;
exports.EditableCell = EditableCell;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map