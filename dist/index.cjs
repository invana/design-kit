'use strict';

var ui = require('@invana/ui');
var editor = require('@invana/editor');
var jsxRuntime = require('react/jsx-runtime');
var forms = require('@invana/forms');
var React = require('react');

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

var React__namespace = /*#__PURE__*/_interopNamespace(React);

// src/panels/data.tsx
function MetricsPanel({ options, gap }) {
  return /* @__PURE__ */ jsxRuntime.jsx(ui.MetricGrid, { minTileWidth: options.minTileWidth ?? 130, gap, children: options.tiles.map((tile, i) => /* @__PURE__ */ jsxRuntime.jsx(
    ui.MetricTile,
    {
      label: tile.label,
      value: tile.value,
      caption: tile.caption,
      tone: tile.tone,
      meter: tile.meter
    },
    i
  )) });
}
function PropertiesPanel({ options }) {
  return /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyList, { labelWidth: options.labelWidth ?? 108, children: options.rows.map((row, i) => /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyRow, { label: row.label, mono: row.mono ?? true, children: row.value }, i)) });
}
function JsonPanel({ options }) {
  const value = typeof options.value === "string" ? options.value : JSON.stringify(options.value, null, 2);
  return /* @__PURE__ */ jsxRuntime.jsx(editor.CodeBlock, { language: "json", value, maxHeight: options.maxHeight, className: "border-0" });
}
function CodePanel({ options }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    editor.CodeBlock,
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col gap-2", children: options.blocks.map((block, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.Eyebrow, { children: block.label }),
    /* @__PURE__ */ jsxRuntime.jsx(editor.CodeBlock, { language: block.language ?? "plain", value: block.value })
  ] }, i)) });
}
function GanttPanel({ panel, options, onAction }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.TaskGantt,
    {
      tasks: options.tasks,
      labelWidth: options.labelWidth,
      density: options.density,
      nowMs: options.nowMs,
      openEnded: options.openEnded,
      selectedKey: options.selectedKey,
      onSelectTask: options.selectAction ? (taskKey) => onAction(options.selectAction, { panelId: panel.id, taskKey }) : void 0
    }
  );
}
function TablePanel({ options }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Table, { density: "compact", children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.TableHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.TableRow, { children: options.columns.map((col) => /* @__PURE__ */ jsxRuntime.jsx(ui.TableHead, { className: ui.cn(col.align === "right" && "text-right"), children: col.label }, col.key)) }) }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.TableBody, { children: options.rows.map((row, i) => /* @__PURE__ */ jsxRuntime.jsx(ui.TableRow, { children: options.columns.map((col) => /* @__PURE__ */ jsxRuntime.jsx(
      ui.TableCell,
      {
        className: ui.cn(col.mono !== false && "font-mono", col.align === "right" && "text-right"),
        children: row[col.key] ?? "\u2014"
      },
      col.key
    )) }, i)) })
  ] });
}
function SpecChip({ chip }) {
  if (chip.bound) return /* @__PURE__ */ jsxRuntime.jsx(ui.BoundChip, { bound: chip.bound });
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Badge,
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
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: chips.map((chip, i) => /* @__PURE__ */ jsxRuntime.jsx(SpecChip, { chip }, i)) });
}
function SpecAction({
  action,
  onAction,
  icons,
  ctx
}) {
  if (action.options?.length) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      ui.ToggleGroup,
      {
        type: "single",
        size: "sm",
        value: action.value,
        onValueChange: (option) => option && onAction(action.id, { ...ctx, option }),
        children: action.options.map((option) => /* @__PURE__ */ jsxRuntime.jsx(ui.ToggleGroupItem, { value: option, children: option }, option))
      }
    );
  }
  const Icon = action.icon ? icons[action.icon] : void 0;
  const iconOnly = !action.label && Icon;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ui.Button,
    {
      variant: action.variant ?? "outline",
      size: iconOnly ? "icon" : "sm",
      disabled: action.disabled,
      "aria-label": iconOnly ? action.id : void 0,
      onClick: () => onAction(action.id, ctx),
      children: [
        Icon ? /* @__PURE__ */ jsxRuntime.jsx(Icon, {}) : null,
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
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: actions.map((action) => /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(ui.Terminal, { columnTemplate: columns, children: options.lines.map((line, i) => /* @__PURE__ */ jsxRuntime.jsx(
    ui.TerminalLine,
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col", children: options.items.map((item, i) => {
    const Icon = item.icon ? icons[item.icon] : void 0;
    const clickable = Boolean(item.action);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      ui.Item,
      {
        size: "xs",
        className: ui.cn(
          "flex-nowrap gap-2 border-b border-border/55 last:border-b-0",
          clickable && "cursor-pointer"
        ),
        onClick: clickable ? () => onAction(item.action, { panelId: panel.id, itemId: item.id }) : void 0,
        children: [
          item.tone || Icon ? /* @__PURE__ */ jsxRuntime.jsxs(ui.ItemMedia, { children: [
            item.tone ? /* @__PURE__ */ jsxRuntime.jsx(ui.StatusDot, { tone: item.tone, size: "md" }) : null,
            Icon ? /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "size-3.5 text-muted-foreground" }) : null
          ] }) : null,
          /* @__PURE__ */ jsxRuntime.jsx(ui.ItemContent, { className: "min-w-0", children: /* @__PURE__ */ jsxRuntime.jsx(ui.ItemTitle, { className: ui.cn("w-auto min-w-0", item.mono && "font-mono"), children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate", children: item.title }) }) }),
          item.meta || item.chip ? /* @__PURE__ */ jsxRuntime.jsxs(ui.ItemActions, { className: "min-w-0 shrink justify-end", children: [
            item.meta ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "max-w-[16ch] truncate font-mono text-meta text-muted-foreground", children: item.meta }) : null,
            item.chip ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntime.jsx(SpecChip, { chip: item.chip }) }) : null
          ] }) : null
        ]
      },
      item.id ?? i
    );
  }) });
}
function ParamsPanel({ panel, options, onAction }) {
  const emit = options.changeAction;
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col", children: options.params.map((param) => /* @__PURE__ */ jsxRuntime.jsx(
    forms.ParamRow,
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
  const body = /* @__PURE__ */ jsxRuntime.jsx("p", { className: ui.cn("text-meta", TEXT_TONE[options.tone ?? "muted"]), children: options.text });
  const content = options.callout ? /* @__PURE__ */ jsxRuntime.jsx(ui.Alert, { variant: options.tone === "error" ? "destructive" : "default", children: /* @__PURE__ */ jsxRuntime.jsx(ui.AlertDescription, { children: body }) }) : body;
  if (!options.actions?.length) return content;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "min-w-0 flex-1", children: content }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex shrink-0 items-center gap-1.5", children: /* @__PURE__ */ jsxRuntime.jsx(
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
  metrics: MetricsPanel,
  properties: PropertiesPanel,
  json: JsonPanel,
  code: CodePanel,
  exchange: ExchangePanel,
  gantt: GanttPanel,
  table: TablePanel,
  log: LogPanel,
  list: ListPanel,
  params: ParamsPanel,
  text: TextPanel
};
function resolveRegistry(extra) {
  return extra ? { ...BUILT_IN_PANELS, ...extra } : BUILT_IN_PANELS;
}
function UnknownPanel({ kind }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border border-dashed border-border p-3 text-meta text-muted-foreground", children: [
    "No renderer for panel kind ",
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono", children: kind }),
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
  const body = panel.render ?? (Renderer ? /* @__PURE__ */ jsxRuntime.jsx(
    Renderer,
    {
      panel,
      options: panel.options ?? {},
      onAction,
      icons,
      gap
    }
  ) : /* @__PURE__ */ jsxRuntime.jsx(UnknownPanel, { kind: panel.kind }));
  const style = panel.width ? { width: panel.width, flexShrink: 0 } : { flexGrow: panel.grow ?? 1, flexBasis: 0, minWidth: 0 };
  if (!panel.title) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { style, className: "min-w-0", children: body });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.PanelBox,
    {
      title: panel.title,
      aside: panel.asideChip ? /* @__PURE__ */ jsxRuntime.jsx(SpecChip, { chip: panel.asideChip }) : panel.aside,
      flush: panel.flush,
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: "flex min-w-0 items-stretch",
      style: { gap: row.gap ?? gap, height: row.height },
      children: row.panels.map((panel, i) => /* @__PURE__ */ jsxRuntime.jsx(
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
function Dashboard({
  spec,
  onAction,
  registry: extraRegistry,
  icons = {},
  className,
  ...props
}) {
  const registry = React__namespace.useMemo(() => resolveRegistry(extraRegistry), [extraRegistry]);
  const gap = spec.gap ?? 12;
  const emit = React__namespace.useCallback(
    (id, ctx) => onAction?.(id, ctx),
    [onAction]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: ui.cn("flex min-h-0 flex-col bg-background", className), ...props, children: [
    spec.header ? /* @__PURE__ */ jsxRuntime.jsx(
      ui.RecordHeader,
      {
        tone: spec.header.tone,
        crumbs: spec.header.crumbs,
        chips: /* @__PURE__ */ jsxRuntime.jsx(SpecChips, { chips: spec.header.chips }),
        actions: /* @__PURE__ */ jsxRuntime.jsx(SpecActions, { actions: spec.header.actions, onAction: emit, icons })
      }
    ) : null,
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "flex min-h-0 flex-1 flex-col overflow-y-auto p-3",
        style: { gap },
        children: spec.rows.map((row, i) => /* @__PURE__ */ jsxRuntime.jsx(
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
    )
  ] });
}

exports.BUILT_IN_PANELS = BUILT_IN_PANELS;
exports.CodePanel = CodePanel;
exports.Dashboard = Dashboard;
exports.ExchangePanel = ExchangePanel;
exports.GanttPanel = GanttPanel;
exports.JsonPanel = JsonPanel;
exports.ListPanel = ListPanel;
exports.LogPanel = LogPanel;
exports.MetricsPanel = MetricsPanel;
exports.ParamsPanel = ParamsPanel;
exports.PropertiesPanel = PropertiesPanel;
exports.SpecAction = SpecAction;
exports.SpecActions = SpecActions;
exports.SpecChip = SpecChip;
exports.SpecChips = SpecChips;
exports.TablePanel = TablePanel;
exports.TextPanel = TextPanel;
exports.resolveRegistry = resolveRegistry;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map