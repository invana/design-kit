import { cn, Button, PropertyList, PropertyRow, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Eyebrow, ButtonGroup, BoundChip, Badge, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, ToggleGroup, ToggleGroupItem, Terminal, TerminalLine, Item, ItemMedia, StatusDot, ItemContent, ItemTitle, ItemActions, Alert, AlertDescription, TabbedPanel, RecordHeader, Workbook, TraceList, TouchStrip, ArtifactTable, LayerSection, ParticipantRow, LensRow, ExchangeRecord, TraceGate, TraceLoop, TraceStep, MarkChip, AbsenceNote, PanelBox } from '@invana/ui';
import { CodeBlock } from '@invana/editor';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { PaginatedTable, DataTable } from '@invana/tables';
import { BLOCKS, Block, useStreamedSpec, applyBlockPatch, BlockPatchError } from '@invana/blocks';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label, Switch, ParamRow } from '@invana/forms';
import { X, Lock, ChevronDown, Check } from 'lucide-react';

// src/panels/data.tsx
function JsonPanel({ options }) {
  const value = typeof options.value === "string" ? options.value : JSON.stringify(options.value, null, 2);
  return /* @__PURE__ */ jsx(CodeBlock, { language: "json", value, maxHeight: options.maxHeight, className: "border-0" });
}
function CodePanel({ options }) {
  return /* @__PURE__ */ jsx(
    CodeBlock,
    {
      language: options.language ?? "plain",
      value: options.value,
      maxHeight: options.maxHeight,
      showLineNumbers: options.showLineNumbers,
      className: "border-0"
    }
  );
}
function ExchangePanel({ options }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: options.blocks.map((block, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsx(Eyebrow, { children: block.label }),
    /* @__PURE__ */ jsx(CodeBlock, { language: block.language ?? "plain", value: block.value })
  ] }, i)) });
}
var LEVELS = ["error", "warn", "info", "debug"];
var offset = (ms) => `${(ms / 1e3).toFixed(3)}s`;
var took = (ms) => ms == null ? "\u2014" : ms < 1e3 ? `${ms}ms` : `${(ms / 1e3).toFixed(1)}s`;
function KindBadge({ kind, level }) {
  if (level === "error")
    return /* @__PURE__ */ jsx(Badge, { variant: "destructive", size: "xs", children: kind });
  if (level === "warn")
    return /* @__PURE__ */ jsx(Badge, { variant: "soft", tone: "warning", size: "xs", children: kind });
  return /* @__PURE__ */ jsx(Badge, { variant: "outline", tone: "muted", size: "xs", children: kind });
}
function StatusBadge({ status }) {
  if (status === "succeeded")
    return /* @__PURE__ */ jsx(Badge, { variant: "soft", tone: "success", size: "xs", children: status });
  if (status === "failed")
    return /* @__PURE__ */ jsx(Badge, { variant: "destructive", size: "xs", children: status });
  return /* @__PURE__ */ jsx(Badge, { variant: "outline", tone: "muted", size: "xs", children: status.replace("_", " ") });
}
function EventsPanel(props) {
  return props.options.layout === "tree" ? /* @__PURE__ */ jsx(EventTree, { ...props }) : /* @__PURE__ */ jsx(EventLog, { ...props });
}
function EventLog({ panel, options, onAction }) {
  const { selectAction, hideTask } = options;
  const columns = React.useMemo(
    () => [
      {
        id: "at",
        accessorKey: "atMs",
        header: "t",
        size: 84,
        meta: { mono: true, align: "right" },
        cell: ({ getValue }) => offset(getValue())
      },
      {
        id: "kind",
        accessorKey: "kind",
        header: "Kind",
        size: 132,
        cell: ({ row }) => /* @__PURE__ */ jsx(KindBadge, { kind: row.original.kind, level: row.original.level })
      },
      ...hideTask ? [] : [
        {
          id: "task",
          accessorKey: "task",
          header: "Task",
          size: 150,
          meta: { mono: true },
          cell: ({ getValue }) => getValue() ?? "\u2014"
        }
      ],
      {
        id: "took",
        accessorKey: "tookMs",
        header: "Took",
        size: 72,
        meta: { mono: true, align: "right" },
        cell: ({ getValue }) => took(getValue())
      },
      { id: "message", accessorKey: "message", header: "Detail", size: 360, enableSorting: false }
    ],
    [hideTask]
  );
  const levels = React.useMemo(() => LEVELS.filter((l) => options.events.some((e) => e.level === l)), [options.events]);
  const filters = React.useMemo(
    () => [
      { id: "kind", label: "kind" },
      ...hideTask ? [] : [{ id: "task", label: "task" }],
      { id: "level", label: "level", options: levels, match: (e, picked) => picked.includes(e.level) }
    ],
    [hideTask, levels]
  );
  return /* @__PURE__ */ jsx(
    PaginatedTable,
    {
      columns,
      data: options.events,
      density: "compact",
      seamless: true,
      filters,
      searchColumns: hideTask ? ["message"] : ["task", "message"],
      searchPlaceholder: hideTask ? "Search detail\u2026" : "Search task or detail\u2026",
      noun: "events",
      pageSize: options.pageSize ?? 25,
      pageSizeOptions: [25, 50, 100],
      onRowClick: selectAction ? (e) => e.task && onAction(selectAction, { panelId: panel.id, value: e.task }) : void 0
    }
  );
}
function treeOf(options) {
  const tasks = options.tasks ?? [];
  const row = (t) => ({
    id: t.key,
    name: t.key,
    atMs: t.startMs,
    tookMs: t.durationMs,
    summary: t.summary ?? "",
    status: t.status,
    task: t.key,
    children: [
      ...options.events.filter((e) => e.task === t.key).sort((a, b) => a.atMs - b.atMs).map((e) => ({
        id: e.id,
        name: e.kind,
        atMs: e.atMs,
        tookMs: e.tookMs,
        summary: e.message,
        event: e,
        task: t.key
      })),
      ...tasks.filter((c) => c.parent === t.key).map(row)
    ]
  });
  return tasks.filter((t) => !t.parent).map(row);
}
function troublePaths(options) {
  const parent = new Map((options.tasks ?? []).map((t) => [t.key, t.parent]));
  const open = {};
  for (const e of options.events.filter((ev) => ev.level === "error" || ev.level === "warn")) {
    open[e.id] = true;
    for (let k = e.task; k; k = parent.get(k)) open[k] = true;
  }
  return open;
}
var resolve = (next, old) => typeof next === "function" ? next(old) : next;
var TREE_COLUMNS = [
  {
    id: "name",
    accessorKey: "name",
    header: "Task / event",
    size: 260,
    cell: ({ row }) => row.original.event ? /* @__PURE__ */ jsx(KindBadge, { kind: row.original.event.kind, level: row.original.event.level }) : /* @__PURE__ */ jsx("span", { className: "font-mono", children: row.original.name })
  },
  {
    id: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => row.original.status ? /* @__PURE__ */ jsx(StatusBadge, { status: row.original.status }) : "\u2014"
  },
  {
    id: "at",
    accessorKey: "atMs",
    header: "t",
    size: 84,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => {
      const v = getValue();
      return v == null ? "\u2014" : offset(v);
    }
  },
  {
    id: "took",
    accessorKey: "tookMs",
    header: "Took",
    size: 72,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => took(getValue())
  },
  { id: "summary", accessorKey: "summary", header: "Detail", size: 360, enableSorting: false }
];
function EventTree({ panel, options, onAction }) {
  const tree = React.useMemo(() => treeOf(options), [options]);
  const roots = React.useMemo(() => Object.fromEntries(tree.map((r) => [r.id, true])), [tree]);
  const [expanded, setExpanded] = React.useState(roots);
  const { selectAction } = options;
  return /* @__PURE__ */ jsx(
    DataTable,
    {
      columns: TREE_COLUMNS,
      data: tree,
      density: "compact",
      seamless: true,
      getSubRows: (r) => r.children,
      getRowId: (r) => r.id,
      expanded,
      onExpandedChange: (next) => setExpanded(resolve(next, expanded)),
      canExpand: (r) => r.event?.fields != null,
      enableSorting: false,
      enableColumnVisibility: false,
      onRowClick: selectAction ? (r) => r.task && onAction(selectAction, { panelId: panel.id, value: r.task }) : void 0,
      toolbar: /* @__PURE__ */ jsxs(ButtonGroup, { children: [
        /* @__PURE__ */ jsx(Button, { size: "xs", variant: "outline", onClick: () => setExpanded(troublePaths(options)), children: "Open failures" }),
        /* @__PURE__ */ jsx(Button, { size: "xs", variant: "outline", onClick: () => setExpanded(true), children: "Expand all" }),
        /* @__PURE__ */ jsx(Button, { size: "xs", variant: "outline", onClick: () => setExpanded({}), children: "Collapse all" })
      ] }),
      renderExpanded: (r) => r.event?.fields ? /* @__PURE__ */ jsx(PropertyList, { labelWidth: 80, children: Object.entries(r.event.fields).map(([label, value]) => /* @__PURE__ */ jsx(PropertyRow, { label, mono: true, children: value }, label)) }) : null
    }
  );
}
function BlockPanel({ panel, options, onAction }) {
  return /* @__PURE__ */ jsx(
    Block,
    {
      spec: { kind: panel.kind, ...options },
      id: panel.id,
      state: panel.state,
      value: panel.value,
      onAction: (action, value) => (
        // An action the spec declares arrives by its own id, as every panel's does.
        action === "action" ? onAction(String(value), { panelId: panel.id }) : onAction(action, { panelId: panel.id, value })
      )
    }
  );
}
var BLOCK_PANELS = Object.fromEntries(BLOCKS.map((b) => [b.id, BlockPanel]));
function SpecChip({ chip }) {
  if (chip.bound)
    return /* @__PURE__ */ jsx(BoundChip, { bound: chip.bound, swatch: chip.swatch });
  return /* @__PURE__ */ jsx(
    Badge,
    {
      variant: chip.variant ?? "outline",
      tone: chip.tone === "running" || chip.tone === "error" ? void 0 : chip.tone,
      size: "sm",
      children: chip.label
    }
  );
}
function SpecChips({ chips }) {
  if (!chips?.length) return null;
  return /* @__PURE__ */ jsx(Fragment, { children: chips.map((chip, i) => /* @__PURE__ */ jsx(SpecChip, { chip }, i)) });
}
function SpecAction({
  action,
  onAction,
  icons,
  ctx
}) {
  const switchId = React.useId();
  const optionLabel = (option) => action.optionLabels?.[option] ?? option;
  if (action.options?.length && action.menu) {
    const Trigger = action.icon ? icons[action.icon] : void 0;
    return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: action.variant ?? "outline",
          size: Trigger ? "icon-sm" : "sm",
          disabled: action.disabled,
          "aria-label": action.label ?? action.id,
          children: Trigger ? /* @__PURE__ */ jsx(Trigger, {}) : action.label
        }
      ) }),
      /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: action.options.map((option) => /* @__PURE__ */ jsx(DropdownMenuItem, { onSelect: () => onAction(action.id, { ...ctx, option }), children: optionLabel(option) }, option)) })
    ] });
  }
  if (action.options?.length && action.picker) {
    return /* @__PURE__ */ jsxs(
      Select,
      {
        value: action.value,
        disabled: action.disabled,
        onValueChange: (option) => onAction(action.id, { ...ctx, option }),
        children: [
          /* @__PURE__ */ jsx(SelectTrigger, { triggerSize: "sm", className: "w-auto gap-2", "aria-label": action.label ?? action.id, children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsx(SelectContent, { children: action.options.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option, children: optionLabel(option) }, option)) })
        ]
      }
    );
  }
  if (action.options?.length) {
    return /* @__PURE__ */ jsx(
      ToggleGroup,
      {
        type: "single",
        size: "sm",
        value: action.value,
        disabled: action.disabled,
        onValueChange: (option) => option && onAction(action.id, { ...ctx, option }),
        children: action.options.map((option) => /* @__PURE__ */ jsx(ToggleGroupItem, { value: option, children: optionLabel(option) }, option))
      }
    );
  }
  const Icon = action.icon ? icons[action.icon] : void 0;
  const iconOnly = !action.label && Icon;
  if (action.pressed != null) {
    return /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: switchId, className: "font-normal", children: action.label ?? action.id }),
      /* @__PURE__ */ jsx(
        Switch,
        {
          id: switchId,
          checked: action.pressed,
          disabled: action.disabled,
          onCheckedChange: (pressed) => onAction(action.id, { ...ctx, pressed })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: action.variant ?? "outline",
      size: iconOnly ? "icon-sm" : "sm",
      disabled: action.disabled,
      "aria-label": iconOnly ? action.id : void 0,
      onClick: () => onAction(action.id, ctx),
      children: [
        Icon ? /* @__PURE__ */ jsx(Icon, {}) : null,
        action.label
      ]
    }
  );
}
function SpecActions({
  actions,
  onAction,
  icons,
  ctx
}) {
  if (!actions?.length) return null;
  return /* @__PURE__ */ jsx(Fragment, { children: actions.map((action) => /* @__PURE__ */ jsx(
    SpecAction,
    {
      action,
      onAction,
      icons,
      ctx
    },
    action.id
  )) });
}
function LogPanel({ options }) {
  const columns = options.columnTemplate ?? "48px 44px 132px minmax(0,1fr)";
  return /* @__PURE__ */ jsx(Terminal, { columnTemplate: columns, children: options.lines.map((line, i) => /* @__PURE__ */ jsx(
    TerminalLine,
    {
      level: line.level,
      columns: [
        line.time ?? "",
        line.level ? line.level.toUpperCase() : "",
        line.source ?? "",
        line.message
      ]
    },
    i
  )) });
}
function ListPanel({ panel, options, onAction, icons }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: options.items.map((item, i) => {
    const Icon = item.icon ? icons[item.icon] : void 0;
    const clickable = Boolean(item.action);
    return /* @__PURE__ */ jsxs(
      Item,
      {
        size: "xs",
        className: cn(
          "flex-nowrap gap-2 border-b border-border/55 last:border-b-0",
          clickable && "cursor-pointer"
        ),
        onClick: clickable ? () => onAction(item.action, { panelId: panel.id, itemId: item.id }) : void 0,
        children: [
          item.tone || Icon ? /* @__PURE__ */ jsxs(ItemMedia, { children: [
            item.tone ? /* @__PURE__ */ jsx(StatusDot, { tone: item.tone, size: "md" }) : null,
            Icon ? /* @__PURE__ */ jsx(Icon, { className: "size-3.5 text-muted-foreground" }) : null
          ] }) : null,
          /* @__PURE__ */ jsx(ItemContent, { className: "min-w-0", children: /* @__PURE__ */ jsx(ItemTitle, { className: cn("w-auto min-w-0", item.mono && "font-mono"), children: /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate", children: item.title }) }) }),
          item.meta || item.chip ? /* @__PURE__ */ jsxs(ItemActions, { className: "min-w-0 shrink justify-end", children: [
            item.meta ? /* @__PURE__ */ jsx("span", { className: "max-w-[16ch] truncate font-mono text-sm text-muted-foreground", children: item.meta }) : null,
            item.chip ? /* @__PURE__ */ jsx("span", { className: "shrink-0", children: /* @__PURE__ */ jsx(SpecChip, { chip: item.chip }) }) : null
          ] }) : null
        ]
      },
      item.id ?? i
    );
  }) });
}
function ParamsPanel({ panel, options, onAction }) {
  const emit = options.changeAction;
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: options.params.map((param) => /* @__PURE__ */ jsx(
    ParamRow,
    {
      name: param.name,
      type: param.type,
      source: param.source,
      value: param.value,
      note: param.note,
      invalid: param.invalid,
      disabled: param.disabled,
      onSourceChange: emit ? (source) => onAction(emit, {
        panelId: panel.id,
        param: { name: param.name, source, value: param.value }
      }) : void 0,
      onValueChange: emit ? (value) => onAction(emit, {
        panelId: panel.id,
        param: { name: param.name, source: param.source, value }
      }) : void 0
    },
    param.name
  )) });
}
var TEXT_TONE = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info"
};
function TextPanel({ panel, options, onAction, icons }) {
  const body = /* @__PURE__ */ jsx("p", { className: cn("text-sm", TEXT_TONE[options.tone ?? "muted"]), children: options.text });
  const content = options.callout ? /* @__PURE__ */ jsx(Alert, { variant: options.tone === "error" ? "destructive" : "default", children: /* @__PURE__ */ jsx(AlertDescription, { children: body }) }) : body;
  if (!options.actions?.length) return content;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: content }),
    /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center gap-1.5", children: /* @__PURE__ */ jsx(
      SpecActions,
      {
        actions: options.actions,
        onAction,
        icons,
        ctx: { panelId: panel.id }
      }
    ) })
  ] });
}

// src/registry.ts
var BUILT_IN_PANELS = {
  json: JsonPanel,
  code: CodePanel,
  exchange: ExchangePanel,
  log: LogPanel,
  events: EventsPanel,
  list: ListPanel,
  params: ParamsPanel,
  text: TextPanel
};
function resolveRegistry(extra) {
  return { ...BLOCK_PANELS, ...BUILT_IN_PANELS, ...extra };
}
var RecordDescription = React.forwardRef(
  ({ description, details, moreLabel = "More", lessLabel = "Less", className, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState(false);
    const [clipped, setClipped] = React.useState(false);
    const lineRef = React.useRef(null);
    React.useLayoutEffect(() => {
      const el = lineRef.current;
      if (!el || expanded) return;
      const measure = () => setClipped(el.scrollWidth - el.clientWidth > 1);
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, [expanded, description]);
    const hasMore = clipped || expanded || (details?.length ?? 0) > 0;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: cn("flex flex-col gap-1 border-b border-border bg-card px-3 pb-2", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-baseline gap-2", children: [
            /* @__PURE__ */ jsx(
              "p",
              {
                ref: lineRef,
                className: cn(
                  "min-w-0 flex-1 text-sm text-muted-foreground",
                  expanded ? "whitespace-pre-line" : "truncate"
                ),
                children: description
              }
            ),
            hasMore ? /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "link",
                size: "sm",
                className: "h-auto shrink-0 p-0",
                "aria-expanded": expanded,
                onClick: () => setExpanded((open) => !open),
                children: expanded ? lessLabel : moreLabel
              }
            ) : null
          ] }),
          expanded && details?.length ? /* @__PURE__ */ jsx(PropertyList, { labelWidth: 110, children: details.map((d, i) => /* @__PURE__ */ jsx(PropertyRow, { label: d.label, mono: d.mono, children: d.value }, i)) }) : null
        ]
      }
    );
  }
);
RecordDescription.displayName = "RecordDescription";
var OP_SIGN = { add: "+", remove: "\u2212", change: "~" };
var OP_CLASS = {
  add: "text-success",
  remove: "text-destructive",
  change: "text-warning"
};
var StagedBar = React.forwardRef(
  ({ items, onDiscard, onDiscardAll, hint, discardAllLabel = "Discard all", className, ...props }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      role: "region",
      "aria-label": "Staged changes",
      className: cn(
        "flex min-h-control-md shrink-0 flex-wrap items-center gap-2 border-b border-border bg-primary/5 px-3 py-1",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-sm font-semibold", children: [
          items.length,
          " staged"
        ] }),
        items.map((item) => /* @__PURE__ */ jsxs(
          "span",
          {
            className: "inline-flex max-w-full items-center gap-1.5 border border-border bg-card px-1.5 py-0.5 text-xs",
            children: [
              /* @__PURE__ */ jsx("span", { className: cn("font-mono", OP_CLASS[item.op] ?? "text-muted-foreground"), children: OP_SIGN[item.op] ?? item.op }),
              /* @__PURE__ */ jsx("span", { className: "truncate font-mono", children: item.name }),
              item.note != null ? /* @__PURE__ */ jsx("span", { className: "truncate text-muted-foreground", children: item.note }) : null,
              onDiscard ? /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Discard this change",
                  className: "text-muted-foreground hover:text-foreground focus-visible:outline-none",
                  onClick: () => onDiscard(item.id),
                  children: /* @__PURE__ */ jsx(X, { className: "size-3" })
                }
              ) : null
            ]
          },
          item.id
        )),
        /* @__PURE__ */ jsx("span", { className: "flex-1" }),
        onDiscardAll ? /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: onDiscardAll, children: discardAllLabel }) : null,
        hint != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: hint }) : null
      ]
    }
  )
);
StagedBar.displayName = "StagedBar";
var BoardPatchError = class extends Error {
};
function onRows(rows, id, fn, hit) {
  return rows.map((row) => {
    if (!row.panels.some((p) => p.id === id)) return row;
    hit.found = true;
    return { ...row, panels: row.panels.map((p) => p.id === id ? fn(p) : p) };
  });
}
function patchPanel(panel, patch) {
  if (patch.op === "update-panel") {
    const { id, kind, options } = panel;
    return { ...applyBlockPatch(panel, { op: "set", fields: patch.fields }), id, kind, options };
  }
  try {
    return { ...panel, options: applyBlockPatch(panel.options ?? {}, patch.patch) };
  } catch (error) {
    if (error instanceof BlockPatchError) throw new BoardPatchError(`"patch-panel" on "${patch.panel}": ${error.message}`);
    throw error;
  }
}
function applyBoardPatch(spec, patch) {
  const loose = spec;
  const hit = { found: false };
  const fn = (panel) => patchPanel(panel, patch);
  const next = {
    ...loose,
    rows: onRows(loose.rows, patch.panel, fn, hit),
    ...loose.tabs ? { tabs: loose.tabs.map((tab) => ({ ...tab, rows: onRows(tab.rows, patch.panel, fn, hit) })) } : {}
  };
  if (!hit.found) throw new BoardPatchError(`"${patch.op}": no panel "${patch.panel}" on the board.`);
  return next;
}
function applyBoardPatches(spec, patches) {
  return patches.reduce(applyBoardPatch, spec);
}
function isDropped(panel) {
  return panel.absent?.reason === "unrecorded";
}
function UnknownPanel({ kind }) {
  return /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-border p-3 text-sm text-muted-foreground", children: [
    "No renderer for panel kind ",
    /* @__PURE__ */ jsx("span", { className: "font-mono", children: kind }),
    ". Register one, or remove it from the spec."
  ] });
}
function Panel({
  panel,
  registry,
  onAction,
  icons,
  gap
}) {
  const Renderer = registry[panel.kind];
  const body = panel.absent ? /* @__PURE__ */ jsx(AbsenceNote, { reason: panel.absent.reason, label: panel.absent.label, children: panel.absent.note }) : panel.render ?? (Renderer ? /* @__PURE__ */ jsx(
    Renderer,
    {
      panel,
      options: panel.options ?? {},
      onAction,
      icons,
      gap
    }
  ) : /* @__PURE__ */ jsx(UnknownPanel, { kind: panel.kind }));
  const style = panel.width ? { width: panel.width, flexShrink: 0 } : { flexGrow: panel.grow ?? 1, flexBasis: 0, minWidth: 0 };
  return /* @__PURE__ */ jsx(
    PanelBox,
    {
      title: panel.title,
      aside: panel.actions?.length ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
        panel.asideChip ? /* @__PURE__ */ jsx(SpecChip, { chip: panel.asideChip }) : panel.aside,
        /* @__PURE__ */ jsx(
          SpecActions,
          {
            actions: panel.actions,
            onAction,
            icons,
            ctx: { panelId: panel.id }
          }
        )
      ] }) : panel.asideChip ? /* @__PURE__ */ jsx(SpecChip, { chip: panel.asideChip }) : panel.aside,
      flush: panel.flush || panel.absent != null,
      style,
      children: body
    }
  );
}
function Row({
  row,
  gap,
  registry,
  onAction,
  icons
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("flex min-w-0 items-stretch", row.fill && row.height == null && "min-h-0 flex-1"),
      style: { gap: row.gap ?? gap, height: row.height },
      children: row.panels.filter((panel) => !isDropped(panel)).map((panel, i) => /* @__PURE__ */ jsx(
        Panel,
        {
          panel,
          registry,
          onAction,
          icons,
          gap
        },
        panel.id ?? i
      ))
    }
  );
}
function Board({
  spec: given,
  onAction,
  registry: extraRegistry,
  icons = {},
  stream,
  onStreamEnd,
  onStreamError,
  className,
  ...props
}) {
  const { live: spec } = useStreamedSpec(given, stream, applyBoardPatches, {
    onEnd: onStreamEnd,
    onError: onStreamError
  });
  const registry = React.useMemo(() => resolveRegistry(extraRegistry), [extraRegistry]);
  const gap = spec.gap ?? 12;
  const emit = React.useCallback(
    (id, ctx) => onAction?.(id, ctx),
    [onAction]
  );
  const tabs = spec.tabs?.length ? spec.tabs : null;
  const inspector = spec.inspector;
  const [ownTab, setOwnTab] = React.useState(spec.tab ?? tabs?.[0]?.id);
  const activeTab = spec.tabAction ? spec.tab ?? tabs?.[0]?.id : ownTab;
  const body = (rows, flush) => /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("flex min-h-0 flex-1 flex-col overflow-y-auto", !flush && "p-3"),
      style: { gap },
      children: rows.filter((row) => row.panels.some((panel) => !isDropped(panel))).map((row, i) => /* @__PURE__ */ jsx(
        Row,
        {
          row,
          gap,
          registry,
          onAction: emit,
          icons
        },
        row.id ?? i
      ))
    }
  );
  const main = tabs ? /* @__PURE__ */ jsx(
    TabbedPanel,
    {
      className: "min-h-0 flex-1 border-0 bg-transparent shadow-none",
      bodyClassName: "flex min-h-0 flex-col",
      activeTab,
      onTabChange: (value) => spec.tabAction ? emit(spec.tabAction, { option: value }) : setOwnTab(value),
      headerContent: spec.tabActions?.length ? /* @__PURE__ */ jsx(SpecActions, { actions: spec.tabActions, onAction: emit, icons }) : void 0,
      tabs: tabs.map((tab) => ({
        value: tab.id,
        label: tab.label,
        icon: tab.locked ? Lock : void 0,
        disabled: tab.locked,
        content: body(tab.rows, tab.flush)
      }))
    }
  ) : body(spec.rows);
  return /* @__PURE__ */ jsxs("div", { className: cn("flex min-h-0 flex-col bg-background", className), ...props, children: [
    spec.header ? /* @__PURE__ */ jsx(SpecHeader, { header: spec.header, onAction: emit, icons }) : null,
    spec.header?.description != null || spec.header?.details?.length ? /* @__PURE__ */ jsx(RecordDescription, { description: spec.header.description, details: spec.header.details }) : null,
    spec.staged ? /* @__PURE__ */ jsx(SpecStaged, { staged: spec.staged, onAction: emit }) : null,
    inspector ? /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col", children: main }),
      /* @__PURE__ */ jsx(
        Board,
        {
          className: "border-l border-border",
          style: { width: inspector.width ?? 440, flexShrink: 0 },
          spec: {
            ...inspector.spec,
            inspector: void 0,
            header: inspector.spec.header && { size: "md", ...inspector.spec.header }
          },
          onAction: emit,
          registry: extraRegistry,
          icons
        }
      )
    ] }) : main
  ] });
}
function SpecStaged({
  staged,
  onAction
}) {
  const { discardAction, discardAllAction } = staged;
  return /* @__PURE__ */ jsx(
    StagedBar,
    {
      items: staged.items,
      hint: staged.hint,
      onDiscard: discardAction ? (id) => onAction(discardAction, { itemId: id }) : void 0,
      onDiscardAll: discardAllAction ? () => onAction(discardAllAction) : void 0
    }
  );
}
function SpecHeader({
  header,
  onAction,
  icons
}) {
  const last = header.crumbs.length - 1;
  const crumbs = header.crumbs.map((crumb, i) => {
    const action = header.crumbActions?.[i];
    if (i === last && header.crumbMenu) {
      const menu = header.crumbMenu;
      return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxs(DropdownMenuTrigger, { className: "inline-flex items-center gap-1 hover:text-primary focus-visible:outline-none", children: [
          crumb,
          /* @__PURE__ */ jsx(ChevronDown, { className: "size-3.5 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "start", className: "max-h-96 min-w-64 overflow-y-auto", children: [
          menu.placeholder ? /* @__PURE__ */ jsx("div", { className: "px-2 py-1 text-sm text-muted-foreground", children: menu.placeholder }) : null,
          menu.items.map((item) => /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onSelect: () => onAction(menu.action, { itemId: item.id }),
              className: cn(item.id === menu.selected && "bg-accent"),
              children: [
                item.tone ? /* @__PURE__ */ jsx(StatusDot, { tone: item.tone }) : null,
                /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate font-mono", children: item.label }),
                item.aside ? /* @__PURE__ */ jsx("span", { className: "font-mono text-sm text-muted-foreground tabular-nums", children: item.aside }) : null,
                item.id === menu.selected ? /* @__PURE__ */ jsx(Check, { className: "size-3.5 text-primary" }) : /* @__PURE__ */ jsx("span", { className: "size-3.5" })
              ]
            },
            item.id
          ))
        ] })
      ] }, i);
    }
    return action ? /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "hover:text-primary hover:underline focus-visible:outline-none",
        onClick: () => onAction(action),
        children: crumb
      },
      i
    ) : crumb;
  });
  return /* @__PURE__ */ jsx(
    RecordHeader,
    {
      size: header.size,
      tone: header.tone,
      crumbs,
      chips: /* @__PURE__ */ jsx(SpecChips, { chips: header.chips }),
      actions: /* @__PURE__ */ jsx(SpecActions, { actions: header.actions, onAction, icons })
    }
  );
}
function BoardPages({
  spec,
  onAction,
  registry,
  icons = {},
  className
}) {
  const first = spec.pages[0]?.id ?? "";
  const [ownActive, setOwnActive] = React.useState(spec.active ?? first);
  const active = spec.selectAction ? spec.active ?? first : ownActive;
  const emit = React.useCallback(
    (id, ctx) => onAction?.(id, ctx),
    [onAction]
  );
  const pages = React.useMemo(
    () => spec.pages.map((page) => ({
      id: page.id,
      title: page.title,
      icon: page.icon ? icons[page.icon] : void 0,
      disabled: page.disabled,
      closable: page.closable,
      content: /* @__PURE__ */ jsx(
        Board,
        {
          spec: page.board,
          registry,
          icons,
          className: "h-full",
          onAction: (id, ctx) => emit(id, { ...ctx, pageId: page.id })
        }
      )
    })),
    [spec.pages, icons, registry, emit]
  );
  return /* @__PURE__ */ jsx(
    Workbook,
    {
      pages,
      activeId: active,
      tabPosition: spec.tabPosition,
      pagerPosition: spec.pagerPosition,
      onSelect: (id) => {
        setOwnActive(id);
        if (spec.selectAction) emit(spec.selectAction, { pageId: id });
      },
      onAdd: spec.addAction ? () => emit(spec.addAction) : void 0,
      addLabel: spec.addLabel,
      onClose: spec.closeAction ? (id) => emit(spec.closeAction, { pageId: id }) : void 0,
      className
    }
  );
}
var TONE = {
  muted: "text-muted-foreground",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive"
};
var AttemptClock = React.forwardRef(
  ({ rows, summary, className, ...props }, ref) => /* @__PURE__ */ jsxs("div", { ref, className: cn("flex flex-col", className), ...props, children: [
    /* @__PURE__ */ jsxs(Table, { density: "compact", children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-[7rem]", children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "what" }) }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[6rem]", children: "started" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[5.5rem]", children: "took" }),
        /* @__PURE__ */ jsx(TableHead, { children: "what happened" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: rows.map((row, index) => {
        const tone = row.tone ? TONE[row.tone] : void 0;
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: cn(tone, row.struck && "line-through"), children: row.label }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono tabular-nums text-muted-foreground", children: row.started }),
          /* @__PURE__ */ jsx(TableCell, { className: cn("font-mono tabular-nums", tone), children: row.took }),
          /* @__PURE__ */ jsx(
            TableCell,
            {
              className: cn(row.struck && ["line-through", tone]),
              children: row.what
            }
          )
        ] }, index);
      }) })
    ] }),
    summary != null ? /* @__PURE__ */ jsx("div", { className: "border-border border-t px-2.5 py-1.5 text-sm text-muted-foreground", children: summary }) : null
  ] })
);
AttemptClock.displayName = "AttemptClock";
function TracePanel({
  panel,
  options,
  onAction
}) {
  const step = (entry, key) => /* @__PURE__ */ jsx(
    TraceStep,
    {
      seq: entry.seq,
      name: entry.name,
      description: entry.description,
      layer: entry.layer,
      role: entry.role,
      duration: entry.duration,
      note: entry.note,
      mark: entry.mark ? /* @__PURE__ */ jsx(MarkChip, { tone: entry.markTone, children: entry.mark }) : void 0,
      palette: options.palette,
      depth: entry.depth,
      dim: entry.dim,
      struck: entry.struck,
      selected: entry.id != null && entry.id === options.selectedId,
      onSelect: options.selectAction && entry.id ? () => onAction(options.selectAction, {
        panelId: panel.id,
        stepId: entry.id
      }) : void 0
    },
    key
  );
  const draw = (entry, key) => {
    if (entry.kind === "gate")
      return /* @__PURE__ */ jsx(
        TraceGate,
        {
          label: entry.label,
          note: entry.note,
          tone: entry.tone,
          edge: entry.edge
        },
        key
      );
    if (entry.kind === "loop")
      return /* @__PURE__ */ jsx(
        TraceLoop,
        {
          label: entry.label,
          summary: entry.summary,
          tone: entry.tone,
          children: entry.rounds.map((round, i) => draw(round, `${key}-${i}`))
        },
        key
      );
    return step(entry, key);
  };
  return /* @__PURE__ */ jsx(TraceList, { children: options.entries.map((entry, i) => draw(entry, `${i}`)) });
}
function TouchedPanel({ options }) {
  return /* @__PURE__ */ jsx(TouchStrip, { items: options.items, palette: options.palette });
}
function AttemptsPanel({ options }) {
  return /* @__PURE__ */ jsx(AttemptClock, { rows: options.rows, summary: options.summary });
}
var RUN_PANELS = {
  trace: TracePanel,
  touched: TouchedPanel,
  attempts: AttemptsPanel,
  artifacts: ArtifactsPanel,
  lens: LensPanel,
  clarification: ClarificationPanel
};
function ArtifactsPanel({
  panel,
  options,
  onAction
}) {
  return /* @__PURE__ */ jsx(
    ArtifactTable,
    {
      files: options.files,
      onOpen: options.openAction ? (file) => onAction(options.openAction, {
        panelId: panel.id,
        itemId: String(file.digest ?? file.name)
      }) : void 0,
      onDownload: options.downloadAction ? (file) => onAction(options.downloadAction, {
        panelId: panel.id,
        itemId: String(file.digest ?? file.name)
      }) : void 0
    }
  );
}
function LensPanel({ panel, options, onAction }) {
  const pick = options.selectAction ? (lens) => onAction(options.selectAction, { panelId: panel.id, lens }) : void 0;
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: options.sections.map((section) => /* @__PURE__ */ jsxs(
    LayerSection,
    {
      layer: section.layer,
      summary: section.summary,
      palette: options.palette,
      count: section.count ?? section.participants?.length,
      dim: section.dim,
      children: [
        (section.participants ?? []).map((participant) => /* @__PURE__ */ jsx(
          ParticipantRow,
          {
            address: participant.address,
            verdict: participant.verdict,
            note: participant.note
          },
          participant.address
        )),
        (section.rows ?? []).map((row) => /* @__PURE__ */ jsx(
          LensRow,
          {
            name: row.name,
            narrows: row.narrows,
            usage: row.usage,
            palette: options.palette,
            selected: options.selected === row.name,
            onSelect: pick
          },
          row.name
        ))
      ]
    },
    section.layer
  )) });
}
function ClarificationPanel({
  options
}) {
  return /* @__PURE__ */ jsx(
    ExchangeRecord,
    {
      asker: options.asker,
      question: options.question,
      why: options.why,
      options: options.options,
      answerer: options.answerer,
      answer: options.answer,
      answerNote: options.answerNote
    }
  );
}

export { ArtifactsPanel, AttemptClock, AttemptsPanel, BLOCK_PANELS, BUILT_IN_PANELS, BlockPanel, Board, BoardPages, BoardPatchError, ClarificationPanel, CodePanel, EventsPanel, ExchangePanel, JsonPanel, LensPanel, ListPanel, LogPanel, ParamsPanel, RUN_PANELS, RecordDescription, SpecAction, SpecActions, SpecChip, SpecChips, StagedBar, TextPanel, TouchedPanel, TracePanel, applyBoardPatch, applyBoardPatches, resolveRegistry };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map