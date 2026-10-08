'use strict';

var ui = require('@invana/ui');
var lucideReact = require('lucide-react');
var jsxRuntime = require('react/jsx-runtime');
var React7 = require('react');
var reactTable = require('@tanstack/react-table');
var core = require('@dnd-kit/core');
var modifiers = require('@dnd-kit/modifiers');
var sortable = require('@dnd-kit/sortable');
var utilities = require('@dnd-kit/utilities');
var forms = require('@invana/forms');

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

var React7__namespace = /*#__PURE__*/_interopNamespace(React7);

// src/data-table.tsx
function columnLabel(column) {
  const header = column.columnDef.header;
  return typeof header === "string" && header !== "" ? header : column.id;
}
var PIN_OPTIONS = [
  { value: "none", label: "Not pinned" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" }
];
function DataTableToolbar({
  table,
  enableColumnVisibility = true,
  enableColumnPinning = false,
  search,
  filters,
  summary,
  children
}) {
  const leafColumns = table.getAllLeafColumns();
  const toggleableCols = leafColumns.filter((c) => c.getCanHide());
  const pinnableCols = enableColumnPinning ? leafColumns.filter((c) => c.getCanPin()) : [];
  const showVisibility = enableColumnVisibility && toggleableCols.length > 0;
  const showMenu = showVisibility || pinnableCols.length > 0;
  const chips = filters?.items.length ? filters.items : null;
  if (!children && !showMenu && !search && !chips) return null;
  const searchBox = search ? /* @__PURE__ */ jsxRuntime.jsx(
    ui.SearchInput,
    {
      inputSize: "sm",
      className: "w-56 shrink-0",
      "aria-label": search.placeholder ?? "Search",
      placeholder: search.placeholder ?? "Search\u2026",
      value: search.value,
      onChange: search.onChange
    }
  ) : null;
  const menu = showMenu ? /* @__PURE__ */ jsxRuntime.jsxs(ui.DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        variant: "ghost",
        size: "icon-sm",
        className: "shrink-0",
        "aria-label": "Columns",
        title: "Columns",
        children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Settings2, { "aria-hidden": true })
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsxs(ui.DropdownMenuContent, { align: "end", className: "w-48", children: [
      showVisibility && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuLabel, { children: "Show columns" }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuSeparator, {}),
        toggleableCols.map((col) => /* @__PURE__ */ jsxRuntime.jsx(
          ui.DropdownMenuCheckboxItem,
          {
            checked: col.getIsVisible(),
            onCheckedChange: (v) => col.toggleVisibility(!!v),
            onSelect: (e) => e.preventDefault(),
            children: columnLabel(col)
          },
          col.id
        ))
      ] }),
      pinnableCols.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        showVisibility && /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuLabel, { children: "Pin columns" }),
        pinnableCols.map((col) => /* @__PURE__ */ jsxRuntime.jsxs(ui.DropdownMenuSub, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuSubTrigger, { children: columnLabel(col) }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.DropdownMenuSubContent, { children: /* @__PURE__ */ jsxRuntime.jsx(
            ui.DropdownMenuRadioGroup,
            {
              value: col.getIsPinned() || "none",
              onValueChange: (v) => col.pin(v === "left" || v === "right" ? v : false),
              children: PIN_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntime.jsx(
                ui.DropdownMenuRadioItem,
                {
                  value: o.value,
                  onSelect: (e) => e.preventDefault(),
                  children: o.label
                },
                o.value
              ))
            }
          ) })
        ] }, col.id))
      ] })
    ] })
  ] }) : null;
  if (chips && filters) {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(ui.FilterBar, { seamless: true, className: "min-w-0 flex-1", summary, children: [
        searchBox,
        chips.map(({ filter, options }) => /* @__PURE__ */ jsxRuntime.jsx(
          ui.MultiFilterChip,
          {
            label: filter.label,
            options,
            multiple: !filter.single,
            value: filters.values[filter.id] ?? [],
            onChange: (picked) => filters.onChange({ ...filters.values, [filter.id]: picked })
          },
          filter.id
        )),
        children
      ] }),
      menu
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
    searchBox,
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "min-w-0 flex-1", children }),
    menu
  ] });
}

// src/core/props.ts
function pickViewProps(props) {
  return {
    footer: props.footer,
    emptyState: props.emptyState,
    groupBy: props.groupBy,
    renderGroupHeader: props.renderGroupHeader,
    density: props.density,
    seamless: props.seamless,
    bordered: props.bordered,
    rowIndent: props.rowIndent,
    isRowSelected: props.isRowSelected,
    isRowHighlighted: props.isRowHighlighted,
    isCellHighlighted: props.isCellHighlighted,
    isTotalRow: props.isTotalRow,
    rowClassName: props.rowClassName,
    headerRowClassName: props.headerRowClassName,
    minWidth: props.minWidth,
    onRowClick: props.onRowClick,
    onCellClick: props.onCellClick,
    getSubRows: props.getSubRows,
    renderExpanded: props.renderExpanded,
    expandOnRowClick: props.expandOnRowClick,
    enableColumnReordering: props.enableColumnReordering,
    enableColumnResizing: props.enableColumnResizing,
    enableSorting: props.enableSorting
  };
}
var FRESH_MS = 1e3;
function merge(rows, incoming, mode, maxRows, getRowId) {
  let next;
  if (mode === "upsert" && getRowId) {
    next = rows.slice();
    const at = new Map(next.map((row, i) => [getRowId(row, i), i]));
    for (const row of incoming) {
      const id = getRowId(row, next.length);
      const i = at.get(id);
      if (i == null) {
        at.set(id, next.length);
        next.push(row);
      } else {
        next[i] = row;
      }
    }
  } else if (mode === "prepend") {
    next = incoming.slice().reverse().concat(rows);
  } else {
    next = rows.concat(incoming);
  }
  if (maxRows != null && next.length > maxRows) {
    next = mode === "prepend" ? next.slice(0, maxRows) : next.slice(-maxRows);
  }
  return next;
}
function useStreamedRows(data, {
  streaming = false,
  stream,
  streamMode = "prepend",
  maxRows,
  getRowId
}) {
  const [rows, setRows] = React7__namespace.useState(data);
  const [fresh, setFresh] = React7__namespace.useState(() => /* @__PURE__ */ new Set());
  const [seed, setSeed] = React7__namespace.useState(data);
  if (seed !== data) {
    setSeed(data);
    setRows(data);
  }
  const latest = React7__namespace.useRef({ stream, streamMode, maxRows, getRowId });
  React7__namespace.useEffect(() => {
    latest.current = { stream, streamMode, maxRows, getRowId };
  });
  React7__namespace.useEffect(() => {
    const source = latest.current.stream;
    if (!streaming || !source) return;
    if (latest.current.streamMode === "upsert" && !latest.current.getRowId) {
      console.warn(
        '@invana/tables: streamMode="upsert" needs getRowId to match rows; appending instead.'
      );
    }
    let pending = [];
    let frame = null;
    let closed = false;
    const timers = /* @__PURE__ */ new Set();
    const flush = () => {
      frame = null;
      if (closed || pending.length === 0) return;
      const batch = pending;
      pending = [];
      const { streamMode: mode, maxRows: cap, getRowId: rowId } = latest.current;
      setRows((prev) => merge(prev, batch, mode, cap, rowId));
      setFresh((prev) => /* @__PURE__ */ new Set([...prev, ...batch]));
      const timer = setTimeout(() => {
        timers.delete(timer);
        setFresh((prev) => {
          const next = new Set(prev);
          for (const row of batch) next.delete(row);
          return next;
        });
      }, FRESH_MS);
      timers.add(timer);
    };
    const stop = source((incoming) => {
      if (closed || incoming.length === 0) return;
      pending.push(...incoming);
      if (frame == null) frame = requestAnimationFrame(flush);
    });
    return () => {
      closed = true;
      if (frame != null) cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      setFresh(/* @__PURE__ */ new Set());
      stop?.();
    };
  }, [streaming]);
  const isRowFresh = React7__namespace.useCallback((row) => fresh.has(row), [fresh]);
  return { rows, isRowFresh };
}
var INDENT_STEP = 14;
var CELL_PAD = 8;
var HIGHLIGHT = "bg-primary/15";
var CONTROL_CELL = "py-1 group-data-[density=compact]/table:py-0";
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
      "aria-sort": canSort ? sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none" : void 0,
      style: {
        width: header.getSize(),
        transform: utilities.CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        ...getCommonPinStyles(header)
      },
      className: ui.cn(
        "group relative select-none",
        isPinned && "bg-chrome shadow-[inset_-1px_0_0_0_hsl(var(--border))] group-data-[seamless]/table:bg-card",
        column.columnDef.meta?.headerClassName
      ),
      ...canDrag ? attributes : {},
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
              className: ui.cn(
                "-mx-1 inline-flex items-center gap-1 rounded-control px-1 font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                // Right-aligned columns keep their text flush right, so the
                // arrow goes on the left where it cannot push the label off it.
                align === "right" && "flex-row-reverse",
                sortDir && "text-foreground"
              ),
              children: [
                reactTable.flexRender(column.columnDef.header, header.getContext()),
                sortDir === "asc" ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowUp, { className: "h-3.5 w-3.5" }) : sortDir === "desc" ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronsUpDown, { className: "h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50 group-focus-within:opacity-50" })
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
function TableGrid({
  table,
  loading = false,
  isRowFresh,
  footer,
  emptyState,
  groupBy,
  renderGroupHeader,
  density = "default",
  seamless = false,
  bordered = true,
  rowIndent,
  isRowSelected,
  isRowHighlighted,
  isCellHighlighted,
  isTotalRow,
  rowClassName,
  headerRowClassName,
  minWidth,
  onRowClick,
  onCellClick,
  getSubRows,
  renderExpanded,
  expandOnRowClick = false,
  enableColumnReordering = false,
  enableColumnResizing = false,
  enableSorting = true
}) {
  const expandable = getSubRows != null || renderExpanded != null;
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
    table.setColumnOrder((prev) => {
      const next = prev.length ? prev : table.getAllLeafColumns().map((c) => c.id);
      const oldIndex = next.indexOf(active.id);
      const newIndex = next.indexOf(over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return sortable.arrayMove(next, oldIndex, newIndex);
    });
  };
  const visibleLeafColumnIds = table.getVisibleLeafColumns().map((c) => c.id);
  const rows = table.getRowModel().rows;
  const topLevel = rows.filter((r) => r.depth === 0);
  return /* @__PURE__ */ jsxRuntime.jsx(
    core.DndContext,
    {
      sensors,
      collisionDetection: core.closestCenter,
      modifiers: [modifiers.restrictToHorizontalAxis],
      onDragEnd: handleDragEnd,
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: ui.cn("relative overflow-auto", bordered && !seamless && "rounded-md border"),
          "aria-busy": loading || void 0,
          children: [
            loading && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-12 text-muted-foreground", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, {}) }),
            /* @__PURE__ */ jsxRuntime.jsxs(
              ui.Table,
              {
                bordered: false,
                seamless,
                density,
                style: {
                  width: enableColumnResizing ? table.getTotalSize() : void 0,
                  minWidth
                },
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.TableHeader, { children: table.getHeaderGroups().map((headerGroup) => (
                    // The header is not a row a reader picks, so it does not light up.
                    /* @__PURE__ */ jsxRuntime.jsx(
                      ui.TableRow,
                      {
                        className: ui.cn("hover:bg-transparent", headerRowClassName),
                        children: /* @__PURE__ */ jsxRuntime.jsx(
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
                        )
                      },
                      headerGroup.id
                    )
                  )) }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.TableBody, { children: rows.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx(ui.TableRow, { className: "hover:bg-transparent", children: /* @__PURE__ */ jsxRuntime.jsx(
                    ui.TableCell,
                    {
                      colSpan: table.getAllLeafColumns().length,
                      className: "h-24 text-center text-muted-foreground",
                      children: loading ? null : emptyState ?? "No results."
                    }
                  ) }) : rows.map((row) => {
                    const groupKey = row.depth === 0 ? groupBy?.(row.original) : void 0;
                    const previousTop = topLevel[topLevel.indexOf(row) - 1];
                    const previousKey = previousTop ? groupBy?.(previousTop.original) : void 0;
                    const startsGroup = groupKey != null && groupKey !== previousKey;
                    const canExpand = expandable && row.getCanExpand();
                    const isExpanded = canExpand && row.getIsExpanded();
                    const panel = isExpanded && renderExpanded ? renderExpanded(row.original) : null;
                    const depth = getSubRows ? row.depth : rowIndent?.(row.original) ?? 0;
                    const activates = onRowClick != null || expandOnRowClick && canExpand;
                    const activate = () => {
                      onRowClick?.(row.original);
                      if (expandOnRowClick && canExpand) row.toggleExpanded();
                    };
                    const selected = isRowSelected?.(row.original) ?? false;
                    const fresh = isRowFresh?.(row.original) ?? false;
                    return /* @__PURE__ */ jsxRuntime.jsxs(React7__namespace.Fragment, { children: [
                      startsGroup ? /* @__PURE__ */ jsxRuntime.jsx(ui.TableRow, { className: "bg-muted/50 hover:bg-muted/50", children: /* @__PURE__ */ jsxRuntime.jsx(
                        ui.TableCell,
                        {
                          colSpan: table.getAllLeafColumns().length,
                          className: "py-1 font-medium",
                          children: renderGroupHeader ? renderGroupHeader(
                            groupKey,
                            topLevel.filter(
                              (r) => groupBy?.(r.original) === groupKey
                            ).map((r) => r.original)
                          ) : groupKey
                        }
                      ) }) : null,
                      /* @__PURE__ */ jsxRuntime.jsx(
                        ui.TableRow,
                        {
                          "data-selected": selected || void 0,
                          "data-streamed": fresh || void 0,
                          "aria-selected": isRowSelected ? selected : void 0,
                          tabIndex: activates ? 0 : void 0,
                          onClick: activates ? activate : void 0,
                          onKeyDown: activates ? (event) => {
                            if (event.target !== event.currentTarget) return;
                            if (event.key !== "Enter" && event.key !== " ")
                              return;
                            event.preventDefault();
                            activate();
                          } : void 0,
                          className: ui.cn(
                            // A streamed row arrives tinted and fades to its own
                            // ground. An animation, not a longer transition: the
                            // duration a transition sets is inherited by every
                            // `transition-colors` inside the row, so its badges
                            // would lag a second behind their own rows.
                            fresh && "animate-row-in motion-reduce:animate-none",
                            isRowHighlighted?.(row.original) && `${HIGHLIGHT} hover:bg-primary/15`,
                            isTotalRow?.(row.original) && "border-t border-border font-semibold hover:bg-transparent [&>td]:border-b-0",
                            selected && "bg-accent shadow-[inset_2px_0_0_var(--color-primary)] hover:bg-accent",
                            // The rule down the leading edge needs the text off it,
                            // even in an unboxed table whose first column is flush.
                            selected && seamless && "[&[data-selected]>td:first-child]:ps-2",
                            activates && "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                            // The panel reads as the row's own continuation, so
                            // no rule between them.
                            panel != null && "border-b-0",
                            rowClassName?.(row.original)
                          ),
                          children: row.getVisibleCells().map((cell, cellIndex) => {
                            const column = cell.column;
                            const meta = column.columnDef.meta;
                            const isPinned = column.getIsPinned();
                            const align = meta?.align ?? "left";
                            const first = cellIndex === 0;
                            const indent = first && depth ? depth : void 0;
                            const highlighted = isCellHighlighted?.(row.original, column.id) ?? false;
                            return /* @__PURE__ */ jsxRuntime.jsx(
                              ui.TableCell,
                              {
                                "data-highlighted": highlighted || void 0,
                                onClick: onCellClick ? (event) => {
                                  const target = event.target;
                                  if (!event.currentTarget.contains(target))
                                    return;
                                  if (event.currentTarget.querySelector(
                                    "[data-cell-editing]"
                                  ))
                                    return;
                                  onCellClick(row.original, column.id);
                                } : void 0,
                                style: {
                                  width: cell.column.getSize(),
                                  ...indent ? {
                                    paddingLeft: `${indent * INDENT_STEP + (seamless ? 0 : CELL_PAD)}px`
                                  } : {},
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
                                  isPinned && "bg-card shadow-[inset_-1px_0_0_0_hsl(var(--border))]",
                                  meta?.mono && "font-mono",
                                  meta?.control && CONTROL_CELL,
                                  highlighted && HIGHLIGHT,
                                  typeof meta?.cellClassName === "function" ? meta.cellClassName(row.original) : meta?.cellClassName
                                ),
                                children: first && expandable ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1", children: [
                                  canExpand ? /* @__PURE__ */ jsxRuntime.jsx(
                                    ui.ExpandToggle,
                                    {
                                      open: isExpanded,
                                      onClick: () => row.toggleExpanded()
                                    }
                                  ) : (
                                    // A leaf keeps the chevron's room, so its
                                    // text lines up with its expandable siblings.
                                    /* @__PURE__ */ jsxRuntime.jsx(ui.ExpandToggle.Spacer, {})
                                  ),
                                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "min-w-0 flex-1", children: reactTable.flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  ) })
                                ] }) : reactTable.flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )
                              },
                              cell.id
                            );
                          })
                        }
                      ),
                      panel != null ? /* @__PURE__ */ jsxRuntime.jsx(ui.TableRow, { className: "hover:bg-transparent", children: /* @__PURE__ */ jsxRuntime.jsx(
                        ui.TableCell,
                        {
                          colSpan: row.getVisibleCells().length,
                          className: "h-auto pt-0",
                          style: {
                            // In line with the row's content: past its
                            // indent and the chevron's 16px + 4px gap.
                            paddingLeft: `${depth * INDENT_STEP + (seamless ? 0 : CELL_PAD) + 20}px`
                          },
                          children: panel
                        }
                      ) }) : null
                    ] }, row.id);
                  }) })
                ]
              }
            ),
            footer != null && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "sticky bottom-0 border-t bg-chrome px-3 py-2 text-muted-foreground", children: footer })
          ]
        }
      )
    }
  );
}

// src/apply-cell-edit.ts
function setAtPath(obj, path, value) {
  const [head, ...rest] = path.split(".");
  const source = obj ?? {};
  return {
    ...source,
    [head]: rest.length ? setAtPath(source[head], rest.join("."), value) : value
  };
}
function applyCellEdit(rows, edit, { subRowsKey, getRowId } = {}) {
  if (edit.field === void 0) return rows;
  const chain = [...edit.ancestors, edit.row];
  const same = (a, b) => getRowId ? getRowId(a) === getRowId(b) : a === b;
  const walk = (list, depth) => {
    const target = chain[depth];
    const i = list.findIndex((r) => same(r, target));
    if (i < 0) return list;
    let next;
    if (depth === chain.length - 1) {
      next = setAtPath(list[i], edit.field, edit.value);
    } else {
      const found = list[i];
      const children = subRowsKey ? found[subRowsKey] : void 0;
      if (!subRowsKey || !Array.isArray(children)) return list;
      const updated = walk(children, depth + 1);
      if (updated === children) return list;
      next = { ...found, [subRowsKey]: updated };
    }
    const copy = list.slice();
    copy[i] = next;
    return copy;
  };
  return walk(rows, 0);
}
var FIELD = "-mx-[7px] -my-[3px] w-[calc(100%+14px)] rounded-control leading-[inherit]";
var READ = "px-[7px] py-[3px]";
var EDIT = "h-auto border border-input px-1.5 py-0.5 text-[length:inherit]";
function EditableCell({
  ctx,
  editType = "text",
  options,
  align = "left",
  onCellEdit,
  trigger = "click"
}) {
  const initial = ctx.getValue();
  const [editing, setEditing] = React7__namespace.useState(false);
  const [save, setSave] = React7__namespace.useState({ state: "idle" });
  const displayRef = React7__namespace.useRef(null);
  const refocus = React7__namespace.useRef(false);
  const cancelled = React7__namespace.useRef(false);
  React7__namespace.useEffect(() => {
    if (!editing && refocus.current) {
      refocus.current = false;
      displayRef.current?.focus();
    }
  }, [editing]);
  const close = (focusCell) => {
    refocus.current = focusCell;
    setEditing(false);
  };
  const open = () => {
    cancelled.current = false;
    setSave({ state: "idle" });
    setEditing(true);
  };
  const commit = (next, focusCell) => {
    close(focusCell);
    if (next === initial) return;
    const row = ctx.row.original;
    const key = ctx.column.columnDef.accessorKey;
    const field = key != null ? String(key) : void 0;
    const result = onCellEdit?.({
      value: next,
      previousValue: initial,
      row,
      updatedRow: field === void 0 ? row : setAtPath(row, field, next),
      rowId: ctx.row.id,
      columnId: ctx.column.id,
      field,
      ancestors: ctx.row.getParentRows().map((r) => r.original),
      rowIndex: ctx.row.index
    });
    if (result && typeof result.then === "function") {
      setSave({ state: "saving", value: next });
      result.then(
        () => setSave({ state: "idle" }),
        (error) => setSave({
          state: "failed",
          message: error instanceof Error ? error.message : String(error ?? "Could not save")
        })
      );
    } else {
      setSave({ state: "idle" });
    }
  };
  const parse = (raw) => {
    if (editType !== "number") return { ok: true, value: raw };
    if (raw.trim() === "") return { ok: true, value: null };
    const n = Number(raw);
    return Number.isFinite(n) ? { ok: true, value: n } : { ok: false, value: initial };
  };
  const alignClass = align === "right" ? "text-right justify-end" : align === "center" ? "text-center justify-center" : "text-left justify-start";
  if (!editing) {
    const shown = save.state === "saving" ? save.value : initial;
    const label = shown == null || shown === "" ? null : editType === "select" ? options?.find((o) => o.value === String(shown))?.label ?? String(shown) : String(shown);
    return /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        ref: displayRef,
        type: "button",
        onClick: trigger === "click" ? open : void 0,
        onDoubleClick: trigger === "dblclick" ? open : void 0,
        onKeyDown: trigger === "dblclick" ? (e) => {
          if (e.key !== "F2") return;
          e.preventDefault();
          open();
        } : void 0,
        "aria-busy": save.state === "saving" || void 0,
        "aria-invalid": save.state === "failed" || void 0,
        title: save.state === "failed" ? save.message : void 0,
        className: ui.cn(
          FIELD,
          READ,
          // Rings, not borders: a box-shadow adds no pixel, so marking the
          // cell never moves its text.
          // A single click edits only when the click is the trigger.
          trigger === "click" ? "cursor-text" : "cursor-default",
          "flex items-center hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          save.state === "saving" && "text-muted-foreground",
          save.state === "failed" && "bg-destructive/5 ring-1 ring-destructive/60",
          alignClass
        ),
        children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate", children: label ?? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "\u2014" }) })
      }
    );
  }
  if (editType === "select") {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      forms.Select,
      {
        defaultValue: initial == null ? void 0 : String(initial),
        onValueChange: (v) => commit(v, true),
        open: true,
        onOpenChange: (open2) => {
          if (!open2) close(true);
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(forms.SelectTrigger, { "data-cell-editing": "", className: ui.cn(FIELD, EDIT), children: /* @__PURE__ */ jsxRuntime.jsx(forms.SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntime.jsx(forms.SelectContent, { children: options?.map((o) => /* @__PURE__ */ jsxRuntime.jsx(forms.SelectItem, { value: o.value, children: o.label }, o.value)) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    forms.Input,
    {
      "data-cell-editing": "",
      autoFocus: true,
      type: editType === "number" ? "number" : "text",
      defaultValue: initial == null ? "" : String(initial),
      onFocus: (e) => e.currentTarget.select(),
      onBlur: (e) => {
        if (cancelled.current) return;
        const { ok, value } = parse(e.currentTarget.value);
        if (ok) commit(value, refocus.current);
        else close(refocus.current);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          refocus.current = true;
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancelled.current = true;
          close(true);
        }
      },
      className: ui.cn(
        FIELD,
        EDIT,
        "ring-offset-0 focus-visible:ring-1",
        alignClass
      )
    }
  );
}
function useControllable(value, onChange, initial) {
  const [internal, setInternal] = React7__namespace.useState(initial);
  const state = value ?? internal;
  const setState = (updater) => {
    onChange?.(updater);
    if (value === void 0) setInternal(updater);
  };
  return [state, setState];
}
function useTableModel({
  columns,
  data,
  onCellEdit,
  editTrigger = "click",
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
  search
}) {
  const expandable = getSubRows != null || renderExpanded != null;
  const [expanded, setExpanded] = useControllable(
    expandedProp,
    onExpandedChange,
    defaultExpanded ?? {}
  );
  const [sorting, setSorting] = useControllable(
    sortingProp,
    onSortingChange,
    defaultSorting ?? []
  );
  const [columnVisibility, setColumnVisibility] = React7__namespace.useState({});
  const [columnPinning, setColumnPinning] = React7__namespace.useState({
    left: [],
    right: []
  });
  const [columnOrder, setColumnOrder] = React7__namespace.useState(
    () => columns.map((c, i) => {
      const def = c;
      return def.id ?? (def.accessorKey != null ? String(def.accessorKey) : String(i));
    })
  );
  const onCellEditRef = React7__namespace.useRef(onCellEdit);
  React7__namespace.useLayoutEffect(() => {
    onCellEditRef.current = onCellEdit;
  });
  const canEdit = onCellEdit != null;
  const wrappedColumns = React7__namespace.useMemo(
    () => columns.map((col) => {
      const meta = col.meta;
      if (!meta?.editable || col.cell) return col;
      return {
        ...col,
        cell: (ctx) => /* @__PURE__ */ jsxRuntime.jsx(
          EditableCell,
          {
            ctx,
            editType: meta.editType,
            options: meta.options,
            align: meta.align,
            onCellEdit: canEdit ? (edit) => onCellEditRef.current?.(edit) : void 0,
            trigger: editTrigger
          }
        )
      };
    }),
    [columns, canEdit, editTrigger]
  );
  const clientPaging = paging?.mode === "client";
  const searchColumns = search?.columns;
  return reactTable.useReactTable({
    data,
    columns: wrappedColumns,
    state: {
      sorting,
      columnVisibility,
      columnPinning,
      columnOrder,
      expanded,
      globalFilter: search?.value ?? "",
      ...paging ? { pagination: paging.state } : {}
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    onExpandedChange: setExpanded,
    onPaginationChange: paging?.onChange,
    getSubRows,
    getRowId,
    getRowCanExpand: (row) => row.subRows.length > 0 || renderExpanded != null && (canExpand?.(row.original) ?? true),
    getExpandedRowModel: expandable ? reactTable.getExpandedRowModel() : void 0,
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
    rowCount: paging?.mode === "server" ? paging.rowCount : void 0,
    globalFilterFn: "includesString",
    // Nested rows: a parent stays when it or anything under it matches, so a
    // search finds a child and the parents that lead to it.
    filterFromLeafRows: getSubRows != null,
    getColumnCanGlobalFilter: (column) => searchColumns ? searchColumns.includes(column.id) : column.accessorFn != null,
    columnResizeMode: "onChange",
    getCoreRowModel: reactTable.getCoreRowModel(),
    getSortedRowModel: enableSorting && !manualSorting ? reactTable.getSortedRowModel() : void 0,
    getFilteredRowModel: search ? reactTable.getFilteredRowModel() : void 0,
    getPaginationRowModel: clientPaging ? reactTable.getPaginationRowModel() : void 0
  });
}
function DataTable(props) {
  const {
    loading,
    preview,
    toolbar,
    className,
    isTotalRow,
    enableColumnVisibility = false,
    enableColumnPinning = false
  } = props;
  const { rows: data, isRowFresh } = useStreamedRows(props.data, props);
  const table = useTableModel({ ...props, data });
  const shown = isTotalRow ? data.filter((r) => !isTotalRow(r)).length : data.length;
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
      TableGrid,
      {
        table,
        loading,
        isRowFresh,
        ...pickViewProps(props)
      }
    ),
    preview && (preview.total != null || preview.action || preview.onOpen) ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-baseline justify-between gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: preview.total != null ? `${shown} of ${preview.total.toLocaleString()}${preview.noun ? ` \xB7 ${preview.noun}` : ""}` : null }),
      preview.action,
      preview.onOpen ? /* @__PURE__ */ jsxRuntime.jsx(
        ui.Button,
        {
          type: "button",
          variant: "link",
          size: "xs",
          className: "h-auto p-0 font-medium",
          onClick: preview.onOpen,
          children: preview.openLabel ?? "Open all"
        }
      ) : null
    ] }) : null
  ] });
}
var DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
var DEFAULT_MAX_PAGE_SIZE = 500;
var CUSTOM = "custom";
function DataTablePagination({
  table,
  pageSizeOptions,
  allowCustomPageSize = false,
  maxPageSize = DEFAULT_MAX_PAGE_SIZE
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const serverRowCount = table.options.rowCount;
  const total = typeof serverRowCount === "number" ? serverRowCount : table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);
  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);
  const [customOpen, setCustomOpen] = React7__namespace.useState(false);
  const sizes = pageSizeOptions ? [.../* @__PURE__ */ new Set([...pageSizeOptions, pageSize])].sort((a, b) => a - b) : [];
  const showPicker = sizes.length > 0 && total > sizes[0];
  if (pageCount <= 1 && !showPicker) return null;
  const commitCustom = (raw) => {
    setCustomOpen(false);
    const n = Math.floor(Number(raw));
    if (!Number.isFinite(n) || n < 1) return;
    table.setPageSize(Math.min(n, maxPageSize));
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between gap-4 px-2 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "tabular-nums", children: total === 0 ? "No rows" : `${start}\u2013${end} of ${total}` }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4", children: [
      showPicker ? /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Rows" }),
        customOpen ? /* @__PURE__ */ jsxRuntime.jsx(
          forms.Input,
          {
            autoFocus: true,
            type: "number",
            inputSize: "sm",
            min: 1,
            max: maxPageSize,
            "aria-label": "Rows per page",
            defaultValue: pageSize,
            className: "w-16 tabular-nums",
            onFocus: (e) => e.currentTarget.select(),
            onBlur: (e) => commitCustom(e.currentTarget.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitCustom(e.currentTarget.value);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setCustomOpen(false);
              }
            }
          }
        ) : /* @__PURE__ */ jsxRuntime.jsxs(
          forms.Select,
          {
            value: String(pageSize),
            onValueChange: (v) => {
              if (v === CUSTOM) setCustomOpen(true);
              else table.setPageSize(Number(v));
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                forms.SelectTrigger,
                {
                  triggerSize: "sm",
                  className: "w-16 tabular-nums",
                  "aria-label": "Rows per page",
                  children: /* @__PURE__ */ jsxRuntime.jsx(forms.SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs(forms.SelectContent, { children: [
                sizes.map((s) => /* @__PURE__ */ jsxRuntime.jsx(forms.SelectItem, { value: String(s), children: s }, s)),
                allowCustomPageSize ? /* @__PURE__ */ jsxRuntime.jsx(forms.SelectItem, { value: CUSTOM, children: "Custom\u2026" }) : null
              ] })
            ]
          }
        )
      ] }) : null,
      /* @__PURE__ */ jsxRuntime.jsx(
        ui.RecordPager,
        {
          className: "tabular-nums",
          position: `page ${pageIndex + 1} of ${pageCount}`,
          previousLabel: "Previous page",
          nextLabel: "Next page",
          onPrevious: table.getCanPreviousPage() ? () => table.previousPage() : void 0,
          onNext: table.getCanNextPage() ? () => table.nextPage() : void 0
        }
      )
    ] })
  ] });
}

// src/core/filters.ts
function readColumnValue(columns, columnId, row, index) {
  for (const col of columns) {
    const def = col;
    const key = def.accessorKey != null ? String(def.accessorKey) : void 0;
    if (def.id !== columnId && key !== columnId) continue;
    if (def.accessorFn) return def.accessorFn(row, index);
    if (key) {
      return key.split(".").reduce(
        (v, part) => v == null ? v : v[part],
        row
      );
    }
  }
  return row[columnId];
}
function activeFilterValues(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, picked]) => picked.length > 0)
  );
}
function filterOptions(filter, columns, data, getSubRows) {
  if (filter.options) return filter.options;
  const seen = /* @__PURE__ */ new Set();
  const visit = (rows) => rows.forEach((row, i) => {
    const v = readColumnValue(columns, filter.columnId ?? filter.id, row, i);
    if (v != null && v !== "") seen.add(String(v));
    const children = getSubRows?.(row);
    if (children) visit(children);
  });
  visit(data);
  return [...seen].sort((a, b) => a.localeCompare(b, void 0, { numeric: true }));
}
function applyFilters(data, filters, values, columns, getSubRows) {
  const active = filters.filter((f) => (values[f.id]?.length ?? 0) > 0);
  if (!active.length) return data;
  const passes = (row, index) => active.every((f) => {
    const picked = values[f.id];
    if (f.match) return f.match(row, picked);
    const v = readColumnValue(columns, f.columnId ?? f.id, row, index);
    return v != null && picked.includes(String(v));
  });
  const keeps = (row, index) => passes(row, index) || (getSubRows?.(row) ?? []).some(keeps);
  return data.filter(keeps);
}
function PaginatedTable(props) {
  const {
    loading,
    toolbar,
    className,
    pageSize = 10,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    allowCustomPageSize = true,
    maxPageSize,
    pagination: paginationProp,
    onPaginationChange,
    searchable = true,
    searchPlaceholder,
    searchColumns,
    search: searchProp,
    onSearchChange,
    filters,
    filterValues: filterValuesProp,
    defaultFilterValues,
    onFiltersChange,
    noun,
    columns,
    getSubRows,
    onSortingChange,
    enableColumnVisibility = true,
    enableColumnPinning = false
  } = props;
  const { rows: data, isRowFresh } = useStreamedRows(props.data, props);
  const [pagination, setPagination] = useControllable(
    paginationProp,
    onPaginationChange,
    { pageIndex: 0, pageSize }
  );
  const [internalSearch, setInternalSearch] = React7__namespace.useState("");
  const search = searchProp ?? internalSearch;
  const setSearch = (value) => {
    onSearchChange?.(value);
    if (searchProp === void 0) setInternalSearch(value);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };
  const [internalFilters, setInternalFilters] = React7__namespace.useState(
    defaultFilterValues ?? {}
  );
  const filterValues = filterValuesProp ?? internalFilters;
  const setFilterValues = (values) => {
    onFiltersChange?.(values);
    if (filterValuesProp === void 0) setInternalFilters(values);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };
  const rows = React7__namespace.useMemo(
    () => applyFilters(data, filters ?? [], filterValues, columns, getSubRows),
    [data, filters, filterValues, columns, getSubRows]
  );
  const filterItems = React7__namespace.useMemo(
    () => (filters ?? []).map((filter) => ({
      filter,
      options: filterOptions(filter, columns, data, getSubRows)
    })),
    [filters, columns, data, getSubRows]
  );
  const table = useTableModel({
    ...props,
    data: rows,
    onSortingChange: (updater) => {
      onSortingChange?.(updater);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    paging: { mode: "client", state: pagination, onChange: setPagination },
    search: { value: search, columns: searchColumns }
  });
  const lastPage = Math.max(table.getPageCount() - 1, 0);
  React7__namespace.useEffect(() => {
    if (pagination.pageIndex > lastPage) {
      setPagination((p) => ({ ...p, pageIndex: lastPage }));
    }
  });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: ui.cn("flex flex-col gap-2", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      DataTableToolbar,
      {
        table,
        enableColumnVisibility,
        enableColumnPinning,
        search: searchable ? { value: search, onChange: setSearch, placeholder: searchPlaceholder } : void 0,
        filters: filterItems.length ? { items: filterItems, values: filterValues, onChange: setFilterValues } : void 0,
        summary: `${table.getFilteredRowModel().rows.length} of ${data.length}${noun ? ` ${noun}` : ""}`,
        children: toolbar
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      TableGrid,
      {
        table,
        loading,
        isRowFresh,
        ...pickViewProps(props)
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      DataTablePagination,
      {
        table,
        pageSizeOptions,
        allowCustomPageSize,
        maxPageSize
      }
    )
  ] });
}
function RemotePaginatedTable(props) {
  const {
    fetchPage,
    refreshKey,
    onCellEdit,
    getRowId,
    toolbar,
    className,
    pageSize = 10,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    allowCustomPageSize = true,
    maxPageSize,
    searchable = true,
    searchPlaceholder,
    search: searchProp,
    onSearchChange,
    searchDebounceMs = 300,
    sorting: sortingProp,
    onSortingChange,
    defaultSorting,
    filters,
    filterValues: filterValuesProp,
    defaultFilterValues,
    onFiltersChange,
    noun,
    columns,
    errorState,
    emptyState,
    enableColumnVisibility = true,
    enableColumnPinning = false
  } = props;
  const fetchRef = React7__namespace.useRef(fetchPage);
  React7__namespace.useLayoutEffect(() => {
    fetchRef.current = fetchPage;
  });
  const [pagination, setPagination] = React7__namespace.useState({
    pageIndex: 0,
    pageSize
  });
  const [sorting, setSortingState] = useControllable(
    sortingProp,
    onSortingChange,
    defaultSorting ?? []
  );
  const setSorting = (updater) => {
    setSortingState(updater);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };
  const [internalFilters, setInternalFilters] = React7__namespace.useState(
    defaultFilterValues ?? {}
  );
  const filterValues = filterValuesProp ?? internalFilters;
  const setFilterValues = (values) => {
    onFiltersChange?.(values);
    if (filterValuesProp === void 0) setInternalFilters(values);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };
  const sentFilters = activeFilterValues(filterValues);
  const [internalTyped, setInternalTyped] = React7__namespace.useState("");
  const typed = searchProp ?? internalTyped;
  const setTyped = (value) => {
    onSearchChange?.(value);
    if (searchProp === void 0) setInternalTyped(value);
  };
  const [search, setSearch] = React7__namespace.useState("");
  React7__namespace.useEffect(() => {
    const t = setTimeout(() => setSearch(typed.trim()), searchDebounceMs);
    return () => clearTimeout(t);
  }, [typed, searchDebounceMs]);
  const [pagedSearch, setPagedSearch] = React7__namespace.useState(search);
  if (search !== pagedSearch) {
    setPagedSearch(search);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }
  const [reloads, setReloads] = React7__namespace.useState(0);
  const [seenRefreshKey, setSeenRefreshKey] = React7__namespace.useState(refreshKey);
  if (refreshKey !== seenRefreshKey) {
    setSeenRefreshKey(refreshKey);
    setReloads((n) => n + 1);
  }
  const retry = React7__namespace.useCallback(() => setReloads((n) => n + 1), []);
  const key = JSON.stringify([
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    search,
    sentFilters,
    reloads
  ]);
  const [settled, setSettled] = React7__namespace.useState({
    key: "",
    rows: [],
    total: 0,
    error: null
  });
  const loading = settled.key !== key;
  React7__namespace.useEffect(() => {
    const controller = new AbortController();
    fetchRef.current({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      search,
      filters: sentFilters,
      signal: controller.signal
    }).then(
      (page) => {
        if (controller.signal.aborted) return;
        setSettled({ key, rows: page.rows, total: page.total, error: null });
      },
      (error2) => {
        if (controller.signal.aborted) return;
        setSettled((prev) => ({
          ...prev,
          key,
          error: error2 instanceof Error ? error2 : new Error(String(error2))
        }));
      }
    );
    return () => controller.abort();
  }, [key]);
  const error = loading ? null : settled.error;
  const rows = error ? [] : settled.rows;
  const handleCellEdit = onCellEdit ? (edit) => {
    const write = () => setSettled((prev) => ({
      ...prev,
      rows: applyCellEdit(prev.rows, edit, { getRowId: idOf })
    }));
    const result = onCellEdit(edit);
    if (result && typeof result.then === "function") {
      return result.then((v) => {
        write();
        return v;
      });
    }
    write();
    return result;
  } : void 0;
  const idOf = getRowId ? (row) => getRowId(row, 0) : void 0;
  const table = useTableModel({
    ...props,
    data: rows,
    onCellEdit: handleCellEdit,
    sorting,
    onSortingChange: setSorting,
    manualSorting: true,
    // The server searches; the model must not filter the page again.
    search: void 0,
    paging: {
      mode: "server",
      state: pagination,
      onChange: setPagination,
      rowCount: settled.total
    }
  });
  const shownError = error ? errorState ? errorState(error, retry) : /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "inline-flex items-baseline gap-2 text-destructive", children: [
    "Could not load: ",
    error.message,
    /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { type: "button", variant: "link", size: "xs", className: "h-auto p-0", onClick: retry, children: "Retry" })
  ] }) : null;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: ui.cn("flex flex-col gap-2", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      DataTableToolbar,
      {
        table,
        enableColumnVisibility,
        enableColumnPinning,
        search: searchable ? { value: typed, onChange: setTyped, placeholder: searchPlaceholder } : void 0,
        filters: filters?.length ? {
          // Named choices; without them, what the page in hand holds.
          items: filters.map((filter) => ({
            filter,
            options: filterOptions(filter, columns, rows)
          })),
          values: filterValues,
          onChange: setFilterValues
        } : void 0,
        summary: `${settled.total.toLocaleString()}${noun ? ` ${noun}` : ""}`,
        children: toolbar
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      TableGrid,
      {
        table,
        loading,
        ...pickViewProps(props),
        emptyState: shownError ?? emptyState
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      DataTablePagination,
      {
        table,
        pageSizeOptions,
        allowCustomPageSize,
        maxPageSize
      }
    )
  ] });
}

exports.DataTable = DataTable;
exports.DataTablePagination = DataTablePagination;
exports.DataTableToolbar = DataTableToolbar;
exports.EditableCell = EditableCell;
exports.PaginatedTable = PaginatedTable;
exports.RemotePaginatedTable = RemotePaginatedTable;
exports.applyCellEdit = applyCellEdit;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map