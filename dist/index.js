import { MetricGrid, MetricTile, PropertyList, PropertyRow, Eyebrow, TaskGantt, Table, TableHeader, TableRow, TableHead, cn, TableBody, TableCell, BoundChip, Badge, ToggleGroup, ToggleGroupItem, Button, Terminal, TerminalLine, Item, ItemMedia, StatusDot, ItemContent, ItemTitle, ItemActions, Alert, AlertDescription, RecordHeader, TraceList, TouchStrip, AttemptClock, ArtifactTable, LayerStrip, LayerSection, ParticipantRow, ExchangeRecord, TraceGate, TraceLoop, TraceStep, MarkChip, AbsenceNote, PanelBox } from '@invana/ui';
import { CodeBlock } from '@invana/editor';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { ParamRow } from '@invana/forms';
import * as React from 'react';

// src/panels/data.tsx
function MetricsPanel({ options, gap }) {
  return /* @__PURE__ */ jsx(MetricGrid, { minTileWidth: options.minTileWidth ?? 130, gap, children: options.tiles.map((tile, i) => /* @__PURE__ */ jsx(
    MetricTile,
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
  return /* @__PURE__ */ jsx(PropertyList, { labelWidth: options.labelWidth ?? 108, children: options.rows.map((row, i) => /* @__PURE__ */ jsx(PropertyRow, { label: row.label, mono: row.mono ?? true, children: row.value }, i)) });
}
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
function GanttPanel({ panel, options, onAction }) {
  return /* @__PURE__ */ jsx(
    TaskGantt,
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
  return /* @__PURE__ */ jsxs(Table, { density: "compact", children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsx(TableRow, { children: options.columns.map((col) => /* @__PURE__ */ jsx(TableHead, { className: cn(col.align === "right" && "text-right"), children: col.label }, col.key)) }) }),
    /* @__PURE__ */ jsx(TableBody, { children: options.rows.map((row, i) => /* @__PURE__ */ jsx(TableRow, { children: options.columns.map((col) => /* @__PURE__ */ jsx(
      TableCell,
      {
        className: cn(col.mono !== false && "font-mono", col.align === "right" && "text-right"),
        children: row[col.key] ?? "\u2014"
      },
      col.key
    )) }, i)) })
  ] });
}
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
  if (action.options?.length) {
    return /* @__PURE__ */ jsx(
      ToggleGroup,
      {
        type: "single",
        size: "sm",
        value: action.value,
        onValueChange: (option) => option && onAction(action.id, { ...ctx, option }),
        children: action.options.map((option) => /* @__PURE__ */ jsx(ToggleGroupItem, { value: option, children: option }, option))
      }
    );
  }
  const Icon = action.icon ? icons[action.icon] : void 0;
  const iconOnly = !action.label && Icon;
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: action.variant ?? "outline",
      size: iconOnly ? "icon" : "sm",
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
  if (!panel.title) {
    return /* @__PURE__ */ jsx("div", { style, className: "min-w-0", children: body });
  }
  return /* @__PURE__ */ jsx(
    PanelBox,
    {
      title: panel.title,
      aside: panel.asideChip ? /* @__PURE__ */ jsx(SpecChip, { chip: panel.asideChip }) : panel.aside,
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
      className: "flex min-w-0 items-stretch",
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
function Dashboard({
  spec,
  onAction,
  registry: extraRegistry,
  icons = {},
  className,
  ...props
}) {
  const registry = React.useMemo(() => resolveRegistry(extraRegistry), [extraRegistry]);
  const gap = spec.gap ?? 12;
  const emit = React.useCallback(
    (id, ctx) => onAction?.(id, ctx),
    [onAction]
  );
  return /* @__PURE__ */ jsxs("div", { className: cn("flex min-h-0 flex-col bg-background", className), ...props, children: [
    spec.header ? /* @__PURE__ */ jsx(
      RecordHeader,
      {
        tone: spec.header.tone,
        crumbs: spec.header.crumbs,
        chips: /* @__PURE__ */ jsx(SpecChips, { chips: spec.header.chips }),
        actions: /* @__PURE__ */ jsx(SpecActions, { actions: spec.header.actions, onAction: emit, icons })
      }
    ) : null,
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "flex min-h-0 flex-1 flex-col overflow-y-auto p-3",
        style: { gap },
        children: spec.rows.filter((row) => row.panels.some((panel) => !isDropped(panel))).map((row, i) => /* @__PURE__ */ jsx(
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
  layers: LayersPanel,
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
function LayersPanel({
  panel,
  options,
  onAction
}) {
  return /* @__PURE__ */ jsx(
    LayerStrip,
    {
      bands: options.bands,
      items: options.items,
      seams: options.seams,
      brackets: options.brackets,
      scale: options.scale ?? "elapsed",
      domain: options.domain,
      ticks: options.ticks,
      palette: options.palette,
      labelWidth: options.labelWidth,
      minTrackWidth: options.minTrackWidth,
      defaultCollapsed: options.defaultCollapsed,
      collapsible: false,
      selectedItem: options.selectedItem ?? void 0,
      onSelectItem: options.selectAction ? (itemId) => onAction(options.selectAction, {
        panelId: panel.id,
        itemId
      }) : void 0
    }
  );
}
function LensPanel({ options }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: options.sections.map((section) => /* @__PURE__ */ jsx(
    LayerSection,
    {
      layer: section.layer,
      summary: section.summary,
      palette: options.palette,
      count: section.count ?? section.participants?.length,
      dim: section.dim,
      children: (section.participants ?? []).map((participant) => /* @__PURE__ */ jsx(
        ParticipantRow,
        {
          address: participant.address,
          verdict: participant.verdict,
          note: participant.note
        },
        participant.address
      ))
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

export { ArtifactsPanel, AttemptsPanel, BUILT_IN_PANELS, ClarificationPanel, CodePanel, Dashboard, ExchangePanel, GanttPanel, JsonPanel, LayersPanel, LensPanel, ListPanel, LogPanel, MetricsPanel, ParamsPanel, PropertiesPanel, RUN_PANELS, SpecAction, SpecActions, SpecChip, SpecChips, TablePanel, TextPanel, TouchedPanel, TracePanel, resolveRegistry };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map