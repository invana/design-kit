'use strict';

var React18 = require('react');
var charts = require('@invana/charts');
var ui = require('@invana/ui');
var jsxRuntime = require('react/jsx-runtime');
var reactHookForm = require('react-hook-form');
var forms = require('@invana/forms');
var tables = require('@invana/tables');

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

var React18__namespace = /*#__PURE__*/_interopNamespace(React18);

// src/kinds.ts
var BLOCKS = [
  { id: "confirm", name: "Confirm", returns: "boolean", tier: "today" },
  { id: "single", name: "Single choice", returns: "string", tier: "today" },
  { id: "multi", name: "Multiple choice", returns: "string[]", tier: "today" },
  { id: "quick", name: "Quick pick", returns: "string", tier: "today" },
  { id: "period", name: "Period", returns: "{from, to, label}", tier: "today" },
  { id: "number", name: "Number", returns: "number", tier: "today" },
  { id: "short", name: "Short text", returns: "string", tier: "today" },
  { id: "long", name: "Long text", returns: "string", tier: "today" },
  { id: "entity", name: "Entity pick", returns: "id[]", tier: "next" },
  { id: "scale", name: "Scale", returns: "1\u20135", tier: "today" },
  { id: "multistep", name: "Multi-step", returns: "Record<id, value>", tier: "today" },
  { id: "form", name: "Form", returns: "Record<field, value>", tier: "next" },
  { id: "weights", name: "Weights", returns: "Record<objective, 0\u2013100>", tier: "today" },
  { id: "approval", name: "Approval", returns: "approve | reject", tier: "today" },
  { id: "interpretation", name: "Interpretation", returns: "Record<slot, value>", tier: "today" },
  { id: "fork", name: "Reading fork", returns: "readingId", tier: "next" },
  { id: "plan", name: "Plan preview", returns: "stepId[]", tier: "next" },
  { id: "modelspec", name: "Model spec", returns: "{outcome, predictors[], group?, controls[]}", tier: "next" },
  { id: "hypothesis", name: "Hypothesis", returns: "{test, tails, alpha}", tier: "next" },
  { id: "range", name: "Range", returns: "{min, max}", tier: "next" },
  { id: "suggestions", name: "Suggestions", returns: "string", tier: "today" },
  { id: "narrative", name: "Narrative", tier: "today" },
  { id: "metric", name: "Metric", tier: "today" },
  { id: "grid", name: "Metric grid", tier: "today" },
  { id: "table", name: "Table preview", tier: "today" },
  { id: "attr", name: "Attribute matrix", tier: "today" },
  { id: "record", name: "Record", tier: "today" },
  { id: "ranked", name: "Ranked list", tier: "today" },
  { id: "timeseries", name: "Time series", tier: "today" },
  { id: "bars", name: "Bar comparison", tier: "next" },
  { id: "waterfall", name: "Bridge", tier: "next" },
  { id: "matrix", name: "Matrix", tier: "next" },
  { id: "funnel", name: "Funnel", tier: "next" },
  { id: "histogram", name: "Distribution", tier: "next" },
  { id: "timeline", name: "Timeline", tier: "today" },
  { id: "subgraph", name: "Subgraph", tier: "later" },
  { id: "method", name: "Method", tier: "today" },
  { id: "citations", name: "Citations", tier: "today" },
  { id: "files", name: "Files", tier: "today" },
  { id: "proposal", name: "Proposal", tier: "today" },
  { id: "cannot", name: "Cannot answer", tier: "today" },
  { id: "caveat", name: "Caveat", tier: "today" },
  { id: "scope", name: "Scope line", tier: "today" },
  { id: "checks", name: "Checks", tier: "next" },
  { id: "trace", name: "Progress trace", tier: "today" },
  { id: "activity", name: "Layer activity", tier: "today" },
  { id: "gantt", name: "Task timeline", tier: "today" },
  { id: "heatstrip", name: "Heat strip", tier: "today" },
  { id: "test", name: "Test result", tier: "next" },
  { id: "coef", name: "Coefficients", tier: "next" },
  { id: "forest", name: "Forest plot", tier: "next" },
  { id: "scatter", name: "Scatter", tier: "next" },
  { id: "box", name: "Box plot", tier: "next" },
  { id: "correlation", name: "Correlation", tier: "next" },
  { id: "control", name: "Control chart", tier: "next" },
  { id: "pareto", name: "Pareto", tier: "next" },
  { id: "survival", name: "Survival curve", tier: "next" },
  { id: "tornado", name: "Tornado", tier: "next" },
  { id: "decomposition", name: "Decomposition", tier: "next" },
  { id: "modeleval", name: "Model evaluation", tier: "next" },
  { id: "pivot", name: "Pivot", tier: "next" },
  { id: "profile", name: "Column profile", tier: "next" },
  { id: "evidence", name: "Evidence strength", tier: "next" },
  { id: "dumbbell", name: "Dumbbell", tier: "next" },
  { id: "quantiles", name: "Quantiles", tier: "today" }
];
var ASK_KINDS = BLOCKS.filter((b) => "returns" in b).map((b) => b.id);
var ANSWER_KINDS = BLOCKS.filter((b) => !("returns" in b)).map((b) => b.id);

// src/values.ts
var VALUE_TYPES = [
  { id: "quantity", name: "Quantity with unit", example: "2,480 kg/ha \xB7 26 d" },
  { id: "currency", name: "Currency", example: "\xA384k \xB7 \u2212\xA3620k \xB7 \xA34.1M" },
  { id: "percent", name: "Share", example: "76% \xB7 8.2%" },
  { id: "pp", name: "Percentage points", example: "+4.8 pts \xB7 \u25BC 1.8 pts" },
  { id: "bp", name: "Basis points", example: "+12 bp" },
  { id: "ratio", name: "Ratio or index", example: "OR 1.29 \xB7 beta 0.38 \xB7 1.3\xD7" },
  { id: "rate", name: "Rate per N", example: "8.2 per 100 discharges" },
  { id: "count", name: "Count with n", example: "1,284 plots \xB7 n = 1,061" },
  { id: "duration", name: "Duration", example: "1.2 s \xB7 3 min \xB7 26 d" },
  { id: "estimate", name: "Estimate with interval", example: "1.29 (95% CI 1.04\u20131.60)" },
  { id: "pvalue", name: "p-value", example: "p = 0.02 \xB7 p < 0.001" },
  { id: "score", name: "Ordinal score", example: "7 / 9 \xB7 4 of 5" },
  { id: "time", name: "Point in time", example: "as of 29 Sep 06:00 \xB7 Q3 2026" }
];
var VARIANT = {
  primary: "default",
  secondary: "outline",
  ghost: "ghost",
  link: "link"
};
function ActionRow({
  actions,
  onAction
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(ui.ClarifyActions, { className: "w-full", children: actions.map((a) => /* @__PURE__ */ jsxRuntime.jsxs(React18__namespace.Fragment, { children: [
    a.push ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "flex-1" }) : null,
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        size: "xs",
        variant: VARIANT[a.variant ?? "secondary"],
        onClick: () => onAction(a.id),
        children: a.label
      }
    )
  ] }, a.id)) });
}
function strong(text) {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(
    (part, i) => part.startsWith("**") && part.endsWith("**") ? /* @__PURE__ */ jsxRuntime.jsx("strong", { children: part.slice(2, -2) }, i) : part
  );
}
var DIRECTION = /([▲▼]\s?[+−-]?[\d.,]+(?:\s?(?:pts|pp|bps|%))?)/;
var MARKER = /(\[\d+\])/;
function tone(figure2) {
  return figure2.startsWith("\u25B2") ? "text-primary" : "text-destructive";
}
function prose(text, marker) {
  let key = 0;
  const plain = (part) => part.split(MARKER).filter(Boolean).flatMap((piece) => {
    const cite = piece.match(/^\[(\d+)\]$/);
    if (cite) return [/* @__PURE__ */ jsxRuntime.jsx(React18__namespace.Fragment, { children: marker(Number(cite[1])) }, key++)];
    return piece.split(DIRECTION).filter(Boolean).map(
      (bit) => DIRECTION.test(bit) && /^[▲▼]/.test(bit) ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: tone(bit), children: bit }, key++) : /* @__PURE__ */ jsxRuntime.jsx(React18__namespace.Fragment, { children: bit }, key++)
    );
  });
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).flatMap((part) => {
    if (!(part.startsWith("**") && part.endsWith("**"))) return plain(part);
    const figure2 = part.slice(2, -2);
    return [
      /* @__PURE__ */ jsxRuntime.jsx("strong", { className: /^[▲▼]/.test(figure2) ? tone(figure2) : void 0, children: figure2 }, key++)
    ];
  });
}
var RATE_TONE = { hot: "text-info", bad: "text-destructive" };
var lit = (lane) => lane.cells.some((v) => v != null && v > 0);
function LaneRow({
  lane,
  depth,
  open,
  onToggle,
  stale,
  cell,
  pin,
  onPin
}) {
  const name = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate @max-[300px]/activity:hidden", children: lane.label }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate @min-[301px]/activity:hidden", children: lane.short ?? lane.label })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    onToggle ? /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        "aria-expanded": open,
        onClick: onToggle,
        className: "flex min-w-0 items-center gap-1 text-left hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "w-2.5 shrink-0 text-muted-foreground", children: open ? "\u25BE" : "\u25B8" }),
          name
        ]
      }
    ) : /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        className: ui.cn(
          "flex min-w-0 items-center",
          (lane.off || depth > 0) && "text-muted-foreground",
          depth > 0 && "pl-3.5 text-sm"
        ),
        children: name
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      charts.HeatLane,
      {
        "aria-label": lane.label,
        values: lane.off ? lane.cells.map(() => null) : lane.cells,
        marks: lane.marks,
        stale,
        cellLabel: cell ? (i) => `${lane.label} \xB7 cell ${i + 1} \xB7 ${cell}` : void 0,
        pinned: pin?.lane === lane.id ? pin.at : null,
        onPin: stale ? void 0 : (at) => onPin(at == null ? null : { lane: lane.id, at })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        className: ui.cn(
          "truncate text-right font-mono text-sm text-muted-foreground tabular-nums",
          !stale && lane.rateTone && RATE_TONE[lane.rateTone]
        ),
        children: stale ? "\u2014" : lane.rate
      }
    )
  ] });
}
function ActivityBlock({ spec, onAction }) {
  const stale = spec.state === "stale";
  const [opened, setOpened] = React18__namespace.useState(
    () => new Set(spec.lanes.filter((l) => l.open).map((l) => l.id))
  );
  const [pin, setPin] = React18__namespace.useState(
    spec.pinned ? { lane: spec.pinned.lane, at: spec.pinned.at } : null
  );
  const toggle = (id) => setOpened((s) => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const pinCell = (next) => {
    setPin(next);
    if (next) onAction?.("pin", next);
  };
  const record = spec.pinned && pin && spec.pinned.lane === pin.lane && spec.pinned.at === pin.at ? spec.pinned : null;
  const total = spec.lanes.length;
  const lighted = spec.lanes.filter(lit).length;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "@container/activity flex min-w-0 flex-col gap-2", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(2.5rem,auto)] items-center gap-x-2 gap-y-1.5 @max-[300px]/activity:grid-cols-[4rem_minmax(0,1fr)_minmax(1.5rem,auto)]", children: [
      spec.bands?.length ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", {}),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 gap-px text-xs", children: spec.bands.map((b, i) => /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            style: { flex: b.span },
            className: ui.cn(
              "min-w-0 truncate rounded-[2px] px-1",
              b.current ? "bg-info/15 text-foreground" : "bg-muted text-muted-foreground"
            ),
            children: b.label
          },
          i
        )) }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-right text-xs text-muted-foreground", children: spec.state === "live" ? "now" : "" })
      ] }) : null,
      spec.lanes.map((lane) => {
        const open = opened.has(lane.id);
        const kids = lane.children?.length ? lane.children : null;
        return /* @__PURE__ */ jsxRuntime.jsxs(React18__namespace.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            LaneRow,
            {
              lane,
              depth: 0,
              open,
              onToggle: kids ? () => toggle(lane.id) : void 0,
              stale,
              cell: spec.cell,
              pin,
              onPin: pinCell
            }
          ),
          open && kids ? kids.map((child) => /* @__PURE__ */ jsxRuntime.jsx(
            LaneRow,
            {
              lane: child,
              depth: 1,
              open: false,
              stale,
              cell: spec.cell,
              pin,
              onPin: pinCell
            },
            child.id
          )) : null
        ] }, lane.id);
      }),
      spec.axis?.length ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", {}),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex min-w-0 justify-between text-xs text-muted-foreground tabular-nums", children: spec.axis.map((a, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { children: a }, i)) }),
        /* @__PURE__ */ jsxRuntime.jsx("span", {})
      ] }) : null
    ] }),
    record ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1.5 rounded-control border border-border bg-muted/40 p-2", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 items-baseline gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate font-medium", children: record.title }),
        record.time ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 font-mono text-sm text-muted-foreground", children: record.time }) : null
      ] }),
      record.query ? /* @__PURE__ */ jsxRuntime.jsx("code", { className: "truncate font-mono text-sm", children: record.query }) : null,
      record.rows?.length ? /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyList, { children: record.rows.map((r) => /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyRow, { label: r.label, children: r.value }, r.label)) }) : null,
      record.note || record.action ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1 truncate", children: record.note }),
        record.action ? /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            variant: "link",
            size: "xs",
            className: "h-auto p-0",
            onClick: () => onAction?.("action", record.action.id),
            children: record.action.label
          }
        ) : null
      ] }) : null
    ] }) : null,
    spec.legend ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx("i", { "aria-hidden": true, className: "size-2 rounded-[1px] bg-info" }),
        "touched"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx("i", { "aria-hidden": true, className: "size-2 rounded-[1px] bg-destructive" }),
        "refused"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx("i", { "aria-hidden": true, className: "size-2 rounded-[1px] bg-warning" }),
        "left the boundary"
      ] })
    ] }) : null,
    spec.hint ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: ui.cn("text-sm text-muted-foreground", stale && "text-warning"), children: strong(spec.hint) }) : null,
    spec.actions?.length ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 items-center gap-2 border-t border-border pt-1.5 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "shrink-0 tabular-nums", children: [
        total,
        " layers \xB7 ",
        lighted,
        " lit"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(ActionRow, { actions: spec.actions, onAction: (id) => onAction?.("action", id) })
    ] }) : null
  ] });
}
var decimals = (v) => (String(v).split(".")[1] ?? "").length;
var MUTED = "color-mix(in srgb, var(--color-muted-foreground) 45%, transparent)";
function BarsBlock({ spec }) {
  const single = spec.series.length === 1;
  const places = Math.max(0, ...spec.series.flatMap((s) => s.values.map(decimals)));
  const write = (v) => v.toLocaleString("en-GB", { minimumFractionDigits: places, maximumFractionDigits: places }) + (spec.unit === "%" ? "%" : "");
  const highlight = spec.highlight == null ? -1 : spec.groups.indexOf(spec.highlight);
  const called = single && highlight >= 0;
  return /* @__PURE__ */ jsxRuntime.jsx(
    charts.BarChartV,
    {
      "aria-label": spec.series.map((s) => s.name).join(", ") + (spec.unit ? `, ${spec.unit}` : ""),
      variant: "comparison",
      height: 80,
      labelMode: called ? "last" : "none",
      color: called ? "var(--color-muted-foreground)" : "var(--color-primary)",
      highlightColor: "var(--color-primary)",
      highlightIndex: called ? highlight : null,
      target: spec.target ? { ...spec.target, color: "var(--color-warning)" } : void 0,
      planLabel: spec.plan?.name,
      series: single && !spec.plan ? void 0 : spec.series.map((s) => ({
        name: s.name,
        color: s.muted ? MUTED : "var(--color-primary)"
      })),
      data: spec.groups.map(
        (label, i) => single ? {
          label,
          value: spec.series[0].values[i] ?? 0,
          display: write(spec.series[0].values[i] ?? 0),
          plan: spec.plan?.values[i]
        } : {
          label,
          values: spec.series.map((s) => s.values[i] ?? 0),
          display: spec.series.map((s) => write(s.values[i] ?? 0))
        }
      )
    }
  );
}
function Chips({
  items,
  layout,
  sent,
  onSelect
}) {
  const stack = layout === "stack";
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: ui.cn(
        "flex gap-1.5",
        stack ? "flex-col" : "flex-wrap @max-[22rem]:flex-col"
      ),
      children: items.map((text) => {
        const done = sent?.includes(text);
        return /* @__PURE__ */ jsxRuntime.jsxs(
          ui.Button,
          {
            type: "button",
            size: "xs",
            variant: "outline",
            disabled: done,
            className: ui.cn(
              // A follow-up is a whole prompt and can outrun the line: it wraps
              // within the thread rather than running past it.
              "h-auto min-h-control-xs max-w-full items-start whitespace-normal py-0.5 text-left font-normal",
              stack ? "w-full justify-start" : "rounded-full @max-[22rem]:w-full @max-[22rem]:justify-start @max-[22rem]:rounded-control"
            ),
            onClick: () => onSelect?.(text),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "text-muted-foreground", children: "\u21B3" }),
              text
            ]
          },
          text
        );
      })
    }
  );
}
var SuggestionChips = React18__namespace.forwardRef(
  ({ items, groups, layout, sent, lead, onSelect, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: ui.cn("@container flex flex-col gap-1.5", className), ...props, children: [
    lead != null ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-muted-foreground", children: lead }) : null,
    groups?.length ? groups.map((group, i) => /* @__PURE__ */ jsxRuntime.jsxs(React18__namespace.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Eyebrow, { children: group.label }),
      /* @__PURE__ */ jsxRuntime.jsx(Chips, { items: group.items, layout, sent, onSelect })
    ] }, i)) : items?.length ? /* @__PURE__ */ jsxRuntime.jsx(Chips, { items, layout, sent, onSelect }) : null
  ] })
);
SuggestionChips.displayName = "SuggestionChips";
function CannotBlock({ spec, onAction }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.CannotAnswerCard,
      {
        remedy: spec.remedy,
        label: spec.partial ? "answered in part" : void 0,
        tone: spec.partial ? "info" : "default",
        children: spec.reason
      }
    ),
    spec.nearest?.length ? /* @__PURE__ */ jsxRuntime.jsx(
      SuggestionChips,
      {
        lead: "I can answer instead",
        items: spec.nearest,
        onSelect: (text) => onAction?.("prompt", text)
      }
    ) : null
  ] });
}
var TONE = {
  warning: "warning",
  info: "info",
  bad: "destructive"
};
function Note({
  note,
  onAction
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.CaveatNote,
    {
      label: note.label,
      tone: TONE[note.tone ?? "warning"],
      action: note.action?.label,
      onAction: note.action ? () => onAction(note.action.id) : void 0,
      children: note.text
    }
  );
}
function CaveatBlock({ spec, onAction }) {
  const [open, setOpen] = React18__namespace.useState(!spec.folded);
  const act = (id) => onAction?.("action", id);
  if (!spec.items) return /* @__PURE__ */ jsxRuntime.jsx(Note, { note: spec, onAction: act });
  const notes = spec.items.map((note, i) => /* @__PURE__ */ jsxRuntime.jsx(Note, { note, onAction: act }, i));
  if (!spec.folded) return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: notes });
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.ChatSessionDisclosure,
    {
      variant: "inline",
      label: `${spec.items.length} caveats`,
      meta: open ? void 0 : spec.items.map((n) => n.label).join(" \xB7 "),
      open,
      onOpenChange: setOpen,
      children: /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: notes })
    }
  );
}

// src/format.ts
function figureText(figure2) {
  if (typeof figure2 === "string") return figure2;
  if (typeof figure2 === "number") return figure2.toLocaleString("en-GB");
  const n = figure2.value.toLocaleString("en-GB");
  return figure2.unit ? `${n} ${figure2.unit}` : n;
}
function metricValue(value) {
  return value == null ? "\u2014" : figureText(value);
}
var CAPTION_TONE = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: void 0
};
var BADGE_TONE = {
  good: "success",
  bad: "destructive",
  warn: "warning",
  neutral: "muted"
};
function gaugeProps(gauge) {
  if (!gauge) return {};
  const min = gauge.min ?? 0;
  const span = gauge.max - min || 1;
  const fill = (gauge.value - min) / span;
  if (gauge.target == null) return { meter: fill };
  const write = (n) => `${n.toLocaleString("en-GB")}${gauge.unit ?? ""}`;
  return {
    gauge: {
      fill,
      mark: (gauge.target - min) / span,
      labels: [write(min), `target ${write(gauge.target)}`, write(gauge.max)]
    }
  };
}
function CitationsBlock({ spec, active = spec.active }) {
  const [open, setOpen] = React18__namespace.useState(!spec.folded);
  const counts = spec.sources.map((s) => s.count);
  const total = counts.every((c) => typeof c === "number") ? counts.reduce((a, b) => a + b, 0) : void 0;
  const list = /* @__PURE__ */ jsxRuntime.jsx(ui.CitationList, { note: spec.note, noteTone: total === 0 ? "warning" : "muted", children: spec.sources.map((source, i) => /* @__PURE__ */ jsxRuntime.jsx(
    ui.CitationRow,
    {
      marker: i + 1,
      active: active === i + 1,
      detail: source.detail,
      count: source.count == null ? void 0 : figureText(source.count),
      children: source.label
    },
    i
  )) });
  if (!spec.folded) return list;
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.ChatSessionDisclosure,
    {
      variant: "inline",
      label: `${spec.sources.length} sources`,
      meta: total != null ? `${total.toLocaleString("en-GB")} records` : void 0,
      open,
      onOpenChange: setOpen,
      children: list
    }
  );
}
var figure = (value, tone2) => typeof value === "string" || typeof value === "number" ? /* @__PURE__ */ jsxRuntime.jsx("b", { className: ui.cn("font-mono font-normal text-foreground", tone2 === "warning" && "text-warning"), children: value }) : value;
var ConfirmCard = React18__namespace.forwardRef(
  ({ question, description, heading, cost, costAs = "line", seamless, caveat, hint, className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: ui.cn("flex flex-col gap-2", className), ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: heading || description ? "font-semibold" : void 0, children: question }),
    description ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "-mt-1.5 text-sm text-muted-foreground", children: description }) : null,
    cost?.length && costAs === "strip" ? /* @__PURE__ */ jsxRuntime.jsx(
      "dl",
      {
        className: ui.cn(
          "grid",
          // Seamless: it reaches out by a cell's padding and clips that off,
          // so the outer cells are flush.
          seamless ? "-mx-2 -my-1 [clip-path:inset(0.25rem_0.5rem)]" : "overflow-hidden rounded-md border border-border"
        ),
        style: { gridTemplateColumns: `repeat(${cost.length}, minmax(0, 1fr))` },
        children: cost.map((c, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 flex-col border-e border-border/60 px-2 py-1 last:border-e-0", children: [
          /* @__PURE__ */ jsxRuntime.jsx("dt", { className: "truncate text-xs text-muted-foreground", children: c.label }),
          /* @__PURE__ */ jsxRuntime.jsx("dd", { className: ui.cn("font-mono font-medium tabular-nums", c.tone === "warning" && "text-warning"), children: c.value })
        ] }, i))
      }
    ) : cost?.length ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-muted-foreground", children: cost.map((c, i) => /* @__PURE__ */ jsxRuntime.jsxs(React18__namespace.Fragment, { children: [
      i > 0 ? " \xB7 " : null,
      figure(c.value, c.tone),
      " ",
      c.label
    ] }, i)) }) : null,
    caveat,
    /* @__PURE__ */ jsxRuntime.jsx(ui.ClarifyActions, { children }),
    hint ? /* @__PURE__ */ jsxRuntime.jsx(ui.ClarifyFootnote, { children: hint }) : null
  ] })
);
ConfirmCard.displayName = "ConfirmCard";
var isHeading = (text) => Boolean(text.heading || text.description);
function AskQuestion({ text, aside }) {
  const question = /* @__PURE__ */ jsxRuntime.jsx("p", { className: isHeading(text) ? "font-semibold" : void 0, children: strong(text.question) });
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    aside ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
      question,
      aside
    ] }) : question,
    text.description ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "-mt-1.5 text-sm text-muted-foreground", children: text.description }) : null
  ] });
}
function hintText(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return /* @__PURE__ */ jsxRuntime.jsx("b", { className: "font-mono font-normal text-foreground", children: part.slice(2, -2) }, i);
    if (part.startsWith("`") && part.endsWith("`")) return /* @__PURE__ */ jsxRuntime.jsx(ui.Kbd, { children: part.slice(1, -1) }, i);
    return part;
  });
}
function AskLink({ children, onClick }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: "shrink-0 whitespace-nowrap font-sans text-xs font-normal text-primary hover:underline focus-visible:underline focus-visible:outline-none",
      children
    }
  );
}
function AskHint({ children, tone: tone2 }) {
  if (!children) return null;
  return /* @__PURE__ */ jsxRuntime.jsx(ui.ClarifyFootnote, { className: tone2 === "warning" ? "text-warning" : tone2 === "error" ? "text-destructive" : void 0, children: hintText(children) });
}
var FIGURE_TONE = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: void 0
};
function Icon({ path }) {
  return /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: path }) });
}
function choiceParts(o) {
  return {
    props: {
      detail: o.figure ? void 0 : o.note ?? o.detail,
      lead: o.icon ? /* @__PURE__ */ jsxRuntime.jsx(Icon, { path: o.icon }) : o.lead,
      figure: o.figure && { value: o.figure.value, unit: o.figure.unit, tone: o.figure.tone && FIGURE_TONE[o.figure.tone] }
    },
    body: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireChoiceTitle, { children: o.label }),
      o.description ? /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireChoiceDescription, { children: o.description }) : null
    ] })
  };
}
function pickText(o, value) {
  if (!o) return value == null || value === "" ? "\u2014" : String(value);
  if (o.summary) return o.summary;
  return o.detail ? `${o.label} \xB7 ${o.detail}` : o.label;
}
function joinPicks(picked) {
  if (!picked.length) return "\u2014";
  const summarised = picked.some((o) => o.summary);
  return picked.map((o) => o.summary ?? o.label).join(summarised ? " \xB7 " : ", ");
}
function AskSummary({
  rows,
  change,
  onChange,
  children
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyList, { labelWidth: "auto", variant: "summary", children: rows.map((r) => /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyRow, { label: r.label, mono: true, children: r.value }, r.label)) }),
    children,
    change ? /* @__PURE__ */ jsxRuntime.jsx(ui.ClarifyActions, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { size: "xs", variant: "ghost", onClick: onChange, children: change }) }) : null
  ] });
}
function costOf(cost) {
  return cost?.map((c) => ({
    label: c.label,
    value: c.value.includes("**") ? hintText(c.value) : c.value,
    tone: c.tone === "warn" || c.tone === "bad" ? "warning" : void 0
  }));
}
function ConfirmAsk({ spec, state = "pending", value: given, onAction }) {
  const pending = state === "pending";
  if (!pending) {
    const yes = given === void 0 ? spec.default ?? true : given === true;
    const words = yes ? spec.settled?.yes ?? spec.yes : spec.settled?.no ?? spec.no;
    return /* @__PURE__ */ jsxRuntime.jsx(AskSummary, { rows: [{ label: spec.label ?? "Decision", value: words }], children: /* @__PURE__ */ jsxRuntime.jsx(AskHint, { children: spec.hint }) });
  }
  const chosen = spec.default ?? true;
  const end = spec.align === "end";
  const button = (value) => /* @__PURE__ */ jsxRuntime.jsx(
    ui.Button,
    {
      size: "xs",
      variant: value === chosen ? "default" : value === false && spec.dismiss ? "ghost" : "outline",
      className: end && value === chosen ? "ms-auto" : void 0,
      onClick: () => onAction?.("reply", value),
      children: value ? spec.yes : spec.no
    },
    String(value)
  );
  const order = end ? [!chosen, chosen] : [chosen, !chosen];
  return /* @__PURE__ */ jsxRuntime.jsx(
    ConfirmCard,
    {
      question: strong(spec.question),
      description: spec.description,
      heading: spec.heading,
      cost: costOf(spec.cost),
      costAs: spec.costAs,
      seamless: true,
      caveat: spec.caveat ? /* @__PURE__ */ jsxRuntime.jsx(ui.CaveatNote, { label: spec.caveat.label, children: spec.caveat.text }) : void 0,
      hint: spec.hint ? hintText(spec.hint) : void 0,
      children: order.map(button)
    }
  );
}
function FileGlyph() {
  return /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 16 16", width: "13", height: "13", fill: "none", stroke: "currentColor", strokeWidth: "1.3", "aria-hidden": true, children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 1.5h5.5L13 5v9.5H4z" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M9.5 1.5V5H13" })
  ] });
}
var noteOf = (file) => file.note ?? file.size;
function FilesBlock({ spec, onAction }) {
  const download = (file) => onAction?.("download", file.digest ?? file.name);
  if (spec.files.length === 1) {
    const file = spec.files[0];
    return /* @__PURE__ */ jsxRuntime.jsx(
      ui.ArtifactCard,
      {
        file: { name: file.name, size: file.size, digest: file.digest },
        note: noteOf(file),
        aside: file.status ? /* @__PURE__ */ jsxRuntime.jsx(ui.Badge, { variant: "soft", size: "xs", tone: BADGE_TONE[file.status.tone ?? "neutral"], className: "font-normal", children: file.status.label }) : spec.download ? /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { type: "button", variant: "outline", size: "xs", onClick: () => download(file), children: "Download" }) : void 0
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.ArtifactTable,
    {
      variant: "list",
      files: spec.files.map((file) => ({
        name: file.name,
        size: file.size,
        digest: spec.download ? void 0 : file.digest,
        icon: spec.download ? /* @__PURE__ */ jsxRuntime.jsx(FileGlyph, {}) : void 0
      })),
      onDownload: spec.download ? (_, i) => download(spec.files[i]) : void 0
    }
  );
}
var FIELD_TYPE = {
  number: "number",
  text: "text",
  date: "text",
  select: "select",
  textarea: "textarea",
  checkbox: "boolean",
  radio: "radio"
};
var blank = (v) => v == null || typeof v === "string" && v.trim() === "";
function rules(f) {
  if (!f.required && f.above == null && f.below == null) return void 0;
  return {
    validate: (v) => {
      if (f.required && (f.type === "checkbox" ? v !== true : blank(v))) return "Required";
      const n = Number(v);
      if (f.above != null && !(n > f.above)) return `Must be above ${f.above}`;
      if (f.below != null && !(n < f.below)) return `Must be below ${f.below}`;
      return true;
    }
  };
}
function optionsOf(f) {
  if (f.options) return f.options;
  if (f.type === "select" && f.default != null) {
    return [{ value: String(f.default), label: String(f.default) }];
  }
  return void 0;
}
var toField = (f) => ({
  name: f.name,
  type: FIELD_TYPE[f.type],
  control: f.type === "checkbox" ? "checkbox" : void 0,
  label: f.label,
  unit: f.unit,
  aside: f.aside,
  description: f.hint,
  group: f.group,
  options: optionsOf(f),
  rows: f.rows,
  disabled: f.disabled,
  rules: rules(f),
  placeholder: f.placeholder ?? "",
  // A long answer takes the row; so does a list of described choices.
  colSpan: f.type === "textarea" || f.type === "radio" && f.options?.some((o) => o.description) ? 2 : void 0
});
var initial = (f) => f.type === "checkbox" ? f.default ?? false : f.default;
function withUnit(value, unit) {
  if (value == null || value === "") return "\u2014";
  if (!unit) return String(value);
  return /^[A-Za-z]/.test(unit) ? `${value} ${unit}` : `${value}${unit}`;
}
function answerOf(f, value) {
  if (f.type === "checkbox") return value === true ? "Yes" : "No";
  const picked = f.options?.find((o) => o.value === value);
  return picked ? picked.label : withUnit(value, f.unit);
}
function FormAsk({ spec, state = "pending", value: given, onAction }) {
  const auto = React18__namespace.useId();
  const pending = state === "pending";
  const [editing, setEditing] = React18__namespace.useState(false);
  const current = given ?? {};
  const top = spec.labels === "top";
  const defaults = Object.fromEntries(
    spec.fields.map((f) => [f.name, pending ? initial(f) : current[f.name]])
  );
  const form = reactHookForm.useForm({ defaultValues: { values: defaults }, mode: "onChange" });
  if (!pending && !editing) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      AskSummary,
      {
        rows: spec.fields.map((f) => ({ label: f.label, value: answerOf(f, current[f.name]) })),
        change: state === "answered" ? "Change inputs" : void 0,
        onChange: () => setEditing(true)
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(forms.Form, { ...form, children: [
    /* @__PURE__ */ jsxRuntime.jsx(AskQuestion, { text: spec }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "form",
      {
        id: `${auto}-form`,
        onSubmit: form.handleSubmit(({ values }) => {
          onAction?.(editing ? "change" : "reply", values);
          setEditing(false);
        }),
        children: /* @__PURE__ */ jsxRuntime.jsx(
          forms.ObjectField,
          {
            control: form.control,
            name: "values",
            fields: spec.fields.map(toField),
            labelPosition: top ? "top" : "side",
            size: "xs",
            columns: top ? 2 : 1,
            fit: "container",
            groupAs: "section"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(AskHint, { children: spec.hint }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.ClarifyActions, { children: /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        type: "submit",
        form: `${auto}-form`,
        size: "xs",
        className: top ? "ms-auto" : void 0,
        disabled: !form.formState.isValid,
        children: spec.submit ?? "Submit"
      }
    ) })
  ] });
}
var openKeys = (tasks) => Object.fromEntries(
  tasks.flatMap((t) => [...t.open ? [[t.key, true]] : [], ...Object.entries(openKeys(t.subtasks ?? []))])
);
var allKeys = (tasks) => tasks.flatMap((t) => [t.key, ...allKeys(t.subtasks ?? [])]);
var toBar = ({ chip, ...bar }) => ({
  ...bar,
  chip: chip ? /* @__PURE__ */ jsxRuntime.jsx(ui.Badge, { variant: "soft", tone: BADGE_TONE[chip.tone ?? "neutral"], children: chip.label }) : void 0
});
var STEP_TICK = (n) => `step ${Math.round(n)}`;
var STEPS = (n) => Math.round(n) === 1 ? "1 step" : `${Math.round(n)} steps`;
var toRow = ({ open: _open, subtasks, segments, ...task }) => ({
  ...task,
  bars: segments?.map(toBar),
  rows: subtasks?.map(toRow)
});
function GanttBlock({ spec, onAction }) {
  const [selected, setSelected] = React18__namespace.useState(spec.selected ?? null);
  const [expanded, setExpanded] = React18__namespace.useState(() => openKeys(spec.tasks));
  const keys = allKeys(spec.tasks);
  const flagged = openKeys(spec.tasks);
  const openedAmong = (among) => among.filter((key) => flagged[key]).sort().join("\n");
  const [seen, setSeen] = React18__namespace.useState(() => new Set(keys));
  const [lastOpened, setLastOpened] = React18__namespace.useState(() => openedAmong(keys));
  const fresh = keys.filter((key) => !seen.has(key));
  const reflagged = openedAmong(keys.filter((key) => seen.has(key))) !== lastOpened;
  if (fresh.length || reflagged) {
    setSeen(new Set(keys));
    setLastOpened(openedAmong(keys));
    if (reflagged) setExpanded(flagged);
    else {
      const arrived = fresh.filter((key) => flagged[key]);
      if (arrived.length)
        setExpanded((e) => e === true ? e : { ...e, ...Object.fromEntries(arrived.map((k) => [k, true])) });
    }
  }
  const rows = React18__namespace.useMemo(() => spec.tasks.map(toRow), [spec.tasks]);
  const pick = (key) => {
    setSelected(key);
    onAction?.("select", key);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Gantt,
    {
      rows,
      spanMs: spec.spanMs,
      nowMs: spec.nowMs,
      openEnded: spec.openEnded,
      ticks: spec.ticks,
      formatTick: spec.scale === "seq" ? STEP_TICK : void 0,
      formatDuration: spec.scale === "seq" ? STEPS : void 0,
      labelWidth: spec.labelWidth,
      durationWidth: spec.durationWidth,
      palette: spec.palette,
      seams: spec.seams,
      density: spec.density,
      expanded,
      onExpandedChange: setExpanded,
      selectedKey: selected,
      onSelectRow: onAction ? pick : void 0,
      onSelectBar: onAction ? pick : void 0
    }
  );
}
var columnsFor = (n) => n === 4 ? 2 : Math.min(n, 3);
function GridBlock({ spec }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.MetricGrid,
    {
      joined: true,
      seamless: true,
      minTileWidth: spec.minTileWidth,
      columns: spec.minTileWidth ? void 0 : columnsFor(spec.tiles.length),
      children: spec.tiles.map((tile) => /* @__PURE__ */ jsxRuntime.jsx(
        ui.MetricTile,
        {
          variant: "figure",
          label: tile.label,
          value: metricValue(tile.value),
          tone: tile.value == null ? "muted" : void 0,
          caption: tile.delta,
          captionTone: tile.tone ? CAPTION_TONE[tile.tone] : void 0,
          flagged: tile.flag,
          ...gaugeProps(tile.gauge)
        },
        tile.label
      ))
    }
  );
}
var COLOR = {
  good: "var(--color-success)",
  bad: "var(--color-destructive)",
  warn: "var(--color-warning)",
  neutral: "var(--color-muted-foreground)"
};
var toRow2 = ({ id, label, cells, children }) => ({
  key: id,
  label,
  cells,
  children: children?.map(toRow2)
});
var openKeys2 = (rows) => Object.fromEntries(
  rows.flatMap((r) => [...r.open ? [[r.id, true]] : [], ...Object.entries(openKeys2(r.children ?? []))])
);
function HeatStripBlock({ spec }) {
  const states = React18__namespace.useMemo(
    () => spec.states.map((s) => ({ key: s.key, label: s.label, hollow: s.hollow, color: COLOR[s.tone ?? "neutral"] })),
    [spec.states]
  );
  const rows = React18__namespace.useMemo(() => spec.rows?.map(toRow2), [spec.rows]);
  const defaultExpanded = React18__namespace.useMemo(() => openKeys2(spec.rows ?? []), [spec.rows]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    charts.HeatStrip,
    {
      cells: spec.cells,
      rows,
      states,
      ticks: spec.ticks,
      defaultExpanded
    }
  );
}
function MethodBlock({ spec }) {
  const [open, setOpen] = React18__namespace.useState(spec.open ?? false);
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.ChatSessionDisclosure,
    {
      variant: "inline",
      label: spec.label ?? "method",
      meta: spec.meta ?? (open ? void 0 : spec.code?.replace(/\*\*/g, "")),
      open,
      onOpenChange: setOpen,
      children: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        spec.code ? /* @__PURE__ */ jsxRuntime.jsx(ui.ChatSessionDisclosureCode, { children: strong(spec.code) }) : null,
        spec.facts?.length ? /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyList, { labelWidth: "auto", variant: "summary", children: spec.facts.map((fact) => /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyRow, { label: fact.label, mono: true, children: fact.value }, fact.label)) }) : null,
        spec.steps?.length ? /* @__PURE__ */ jsxRuntime.jsx(ui.ChatSessionDisclosureSteps, { steps: spec.steps }) : null
      ] })
    }
  );
}
function MetricBlock({ spec }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.MetricTile,
    {
      variant: "hero",
      label: spec.label,
      value: metricValue(spec.value),
      tone: spec.value == null ? "muted" : void 0,
      caption: spec.delta,
      captionTone: spec.tone ? CAPTION_TONE[spec.tone] : void 0,
      ...gaugeProps(spec.gauge),
      aside: spec.trend?.length ? /* @__PURE__ */ jsxRuntime.jsx(
        charts.Sparkline,
        {
          values: spec.trend,
          width: 96,
          height: 32,
          strokeWidth: 1.4,
          endMarker: false,
          color: "color-mix(in srgb, var(--color-foreground) 70%, transparent)",
          label: `${spec.label}, recent run`
        }
      ) : void 0
    }
  );
}
function submitLabel(question, count, submit) {
  if (submit) return submit.replace("{count}", String(count));
  const q = question.trim();
  return q.endsWith("?") ? `Use ${count} selected` : `${q} ${count}`;
}
function MultiAsk({ spec, state = "pending", value: given, id: idProp, onAction }) {
  const auto = React18__namespace.useId();
  const id = idProp ?? auto;
  const pending = state === "pending";
  const [editing, setEditing] = React18__namespace.useState(false);
  const [picked, setPicked] = React18__namespace.useState(
    pending ? spec.default ?? [] : given ?? []
  );
  if (!pending && !editing) {
    const value = given ?? spec.default ?? [];
    const text = joinPicks(spec.options.filter((o) => value.includes(o.value)));
    return /* @__PURE__ */ jsxRuntime.jsx(
      AskSummary,
      {
        rows: [{ label: spec.label ?? "Answer", value: text || "\u2014" }],
        change: state === "answered" ? "Change answer" : void 0,
        onChange: () => setEditing(true)
      }
    );
  }
  const full = spec.max != null && picked.length >= spec.max;
  const short = spec.min != null && picked.length < spec.min;
  const toggle = (v) => setPicked((now) => now.includes(v) ? now.filter((x) => x !== v) : [...now, v]);
  const all = spec.options.filter((o) => !o.disabled).map((o) => o.value);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Questionnaire,
      {
        id: `${auto}-form`,
        onSubmit: (e) => {
          e.preventDefault();
          if (short) return;
          const value = spec.options.map((o) => o.value).filter((v) => picked.includes(v));
          onAction?.(editing ? "change" : "reply", value);
          setEditing(false);
        },
        children: /* @__PURE__ */ jsxRuntime.jsxs(ui.QuestionnaireItem, { name: id, multiple: true, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
            ui.QuestionnaireTitle,
            {
              className: ui.cn(
                isHeading(spec) && "font-semibold",
                spec.selectAll && "flex w-full items-baseline justify-between gap-2"
              ),
              children: [
                strong(spec.question),
                spec.selectAll ? /* @__PURE__ */ jsxRuntime.jsx(AskLink, { onClick: () => setPicked(spec.max != null ? all.slice(0, spec.max) : all), children: "Select all" }) : null
              ]
            }
          ),
          spec.description ? /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireDescription, { children: spec.description }) : null,
          /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireChoices, { children: spec.options.map((o) => {
            const checked = picked.includes(o.value);
            const { props, body } = choiceParts(o);
            return /* @__PURE__ */ jsxRuntime.jsx(
              ui.QuestionnaireChoice,
              {
                value: o.value,
                ...props,
                disabled: o.disabled || full && !checked,
                checked,
                onChange: () => toggle(o.value),
                children: body
              },
              o.value
            );
          }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(AskHint, { children: spec.hint }),
    /* @__PURE__ */ jsxRuntime.jsxs(ui.ClarifyActions, { children: [
      spec.max != null ? full && spec.max < spec.options.length ? /* @__PURE__ */ jsxRuntime.jsx(AskHint, { tone: "warning", children: "Limit reached \xB7 clear one to swap" }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground", children: hintText(`**${picked.length}** of ${spec.max}`) }) : null,
      /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { type: "submit", form: `${auto}-form`, size: "xs", className: "ms-auto", disabled: short, children: submitLabel(spec.question, picked.length, spec.submit) })
    ] })
  ] });
}
function Placeholder({ kind, options, className }) {
  const { kind: _kind, ...rest } = options ?? {};
  const json = JSON.stringify(rest, null, 2);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      "data-placeholder": kind,
      className: ui.cn("flex min-w-0 flex-col gap-1 border border-dashed border-border p-2", className),
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "No renderer yet for the block ",
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono text-foreground", children: kind })
        ] }),
        json !== "{}" ? /* @__PURE__ */ jsxRuntime.jsx("pre", { className: "max-h-40 overflow-auto font-mono text-sm text-muted-foreground", children: json }) : null
      ]
    }
  );
}
function StepTitle({ step }) {
  if (!("question" in step)) return null;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireTitle, { className: "font-semibold", children: strong(step.question ?? "") }),
    "description" in step && step.description ? /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireDescription, { children: step.description }) : null
  ] });
}
function StepItem({
  step,
  value,
  onStatusChange
}) {
  const item = { name: step.id, required: step.required, onStatusChange };
  switch (step.kind) {
    case "single":
    case "multi": {
      const multiple = step.kind === "multi";
      const chosen = (v) => multiple ? Array.isArray(value) && value.includes(v) : value === v;
      return /* @__PURE__ */ jsxRuntime.jsxs(ui.QuestionnaireItem, { ...item, multiple, children: [
        /* @__PURE__ */ jsxRuntime.jsx(StepTitle, { step }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireChoices, { children: step.options.map((o) => {
          const { props, body } = choiceParts(o);
          return /* @__PURE__ */ jsxRuntime.jsx(
            ui.QuestionnaireChoice,
            {
              value: o.value,
              ...props,
              disabled: o.disabled,
              defaultChecked: chosen(o.value),
              children: body
            },
            o.value
          );
        }) })
      ] });
    }
    case "number":
    case "short":
    case "long":
      return /* @__PURE__ */ jsxRuntime.jsxs(ui.QuestionnaireItem, { ...item, children: [
        /* @__PURE__ */ jsxRuntime.jsx(StepTitle, { step }),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.QuestionnaireInput,
          {
            type: step.kind === "number" ? "number" : "text",
            unit: step.kind === "number" ? step.unit : void 0,
            min: step.kind === "number" ? step.min : void 0,
            max: step.kind === "number" ? step.max : void 0,
            step: step.kind === "number" ? step.step : void 0,
            defaultValue: value == null ? void 0 : String(value),
            "aria-label": step.question
          }
        ),
        "hint" in step ? /* @__PURE__ */ jsxRuntime.jsx(AskHint, { children: step.hint }) : null
      ] });
    default:
      return /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireItem, { ...item, children: /* @__PURE__ */ jsxRuntime.jsx(Placeholder, { kind: step.kind, options: step }) });
  }
}
function numberText(value, unit) {
  const n = typeof value === "number" ? value : Number(value);
  const text = Number.isFinite(n) ? n.toLocaleString("en-GB") : String(value);
  if (!unit) return text;
  return /^[A-Za-z]/.test(unit) ? `${text} ${unit}` : `${text}${unit}`;
}
function answerText(step, value) {
  if (value == null || value === "" || Array.isArray(value) && !value.length) return "\u2014";
  switch (step.kind) {
    case "single":
    case "quick": {
      const o = step.options.find((x) => x.value === value);
      return o ? "summary" in o && o.summary || o.label : String(value);
    }
    case "multi": {
      const values = Array.isArray(value) ? value : [value];
      return joinPicks(values.map((v) => step.options.find((x) => x.value === v) ?? { value: String(v), label: String(v) }));
    }
    case "number":
      return numberText(value, step.unit);
    default:
      return typeof value === "object" ? JSON.stringify(value) : String(value);
  }
}
var labelOf = (step) => "label" in step && step.label || step.id.charAt(0).toUpperCase() + step.id.slice(1);
function collect(steps, form) {
  const data = new FormData(form);
  const out = {};
  for (const step of steps) {
    const all = data.getAll(step.id).map(String).filter(Boolean);
    if (step.kind === "multi") out[step.id] = all;
    else if (!all.length) continue;
    else if (step.kind === "number") out[step.id] = Number(all[0]);
    else out[step.id] = all[0];
  }
  return out;
}
function MultistepAsk({ spec, state = "pending", value: given, onAction }) {
  const pending = state === "pending";
  const [editing, setEditing] = React18__namespace.useState(false);
  const steps = spec.steps;
  const [item, setItem] = React18__namespace.useState(steps[0]?.id ?? "");
  const [status, setStatus] = React18__namespace.useState(
    () => Object.fromEntries(
      steps.filter((s) => "default" in s && s.default != null).map((s) => [s.id, "answered"])
    )
  );
  const [review, setReview] = React18__namespace.useState(null);
  const formRef = React18__namespace.useRef(null);
  const current = given ?? {};
  if (!pending && !editing) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      AskSummary,
      {
        rows: steps.map((step2) => ({ label: labelOf(step2), value: answerText(step2, current[step2.id]) })),
        change: state === "answered" ? "Change answers" : void 0,
        onChange: () => setEditing(true)
      }
    );
  }
  const send = (value) => {
    onAction?.(editing ? "change" : "reply", value);
    setEditing(false);
    setReview(null);
  };
  const initial2 = (step2) => editing ? current[step2.id] : "default" in step2 ? step2.default : void 0;
  const index = Math.max(0, steps.findIndex((s) => s.id === item));
  const step = steps[index];
  const last = index === steps.length - 1;
  const blocked = Boolean(step?.required && status[step.id] !== "answered");
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      ui.Questionnaire,
      {
        ref: formRef,
        item,
        onItemChange: setItem,
        hidden: review != null,
        onSubmit: (e) => {
          e.preventDefault();
          send(collect(steps, e.currentTarget));
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireProgress, {}),
          steps.map((s) => /* @__PURE__ */ jsxRuntime.jsx(
            StepItem,
            {
              step: s,
              value: initial2(s),
              onStatusChange: (st) => setStatus((now) => ({ ...now, [s.id]: st }))
            },
            s.id
          )),
          blocked ? /* @__PURE__ */ jsxRuntime.jsx(AskHint, { tone: "error", children: "Pick one to continue \xB7 this step is required" }) : null,
          /* @__PURE__ */ jsxRuntime.jsxs(ui.QuestionnaireActions, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnairePrevious, {}),
            !last && !step?.required ? /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireSkip, {}) : null,
            /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireNext, { disabled: blocked }),
            last && spec.review ? /* @__PURE__ */ jsxRuntime.jsx(
              ui.Button,
              {
                type: "button",
                size: "xs",
                className: "col-start-3 row-start-1 justify-self-end",
                disabled: blocked,
                onClick: () => formRef.current && setReview(collect(steps, formRef.current)),
                children: "Review"
              }
            ) : /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireSubmit, { disabled: blocked })
          ] })
        ]
      }
    ),
    review ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireProgressBar, { label: "Review", value: 1 }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyList, { labelWidth: "auto", variant: "summary", children: steps.map((s) => /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyRow, { label: labelOf(s), mono: true, children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1", children: answerText(s, review[s.id]) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          AskLink,
          {
            onClick: () => {
              setItem(s.id);
              setReview(null);
            },
            children: "Edit"
          }
        )
      ] }) }, s.id)) }),
      /* @__PURE__ */ jsxRuntime.jsxs(ui.QuestionnaireActions, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { type: "button", size: "xs", variant: "outline", className: "justify-self-start", onClick: () => setReview(null), children: "Previous" }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { type: "button", size: "xs", className: "col-start-3 justify-self-end", onClick: () => send(review), children: `Submit ${steps.length} answers` })
      ] })
    ] }) : null
  ] });
}
function NarrativeBlock({ spec, active = spec.active, onActiveChange, trailing }) {
  const marker = (n) => /* @__PURE__ */ jsxRuntime.jsx(
    ui.CitationMarker,
    {
      "data-active": active === n || void 0,
      onMouseEnter: () => onActiveChange?.(n),
      onMouseLeave: () => onActiveChange?.(void 0),
      children: n
    },
    `cite-${n}`
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
    prose(spec.text, marker),
    spec.cites?.map(marker),
    trailing
  ] });
}
function ProposalBlock({ spec, onAction }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ui.ProposalCard,
    {
      flush: true,
      seamless: true,
      title: spec.heading,
      done: spec.done?.label,
      consequence: spec.consequence,
      actions: spec.actions.length ? /* @__PURE__ */ jsxRuntime.jsx(
        ActionRow,
        {
          actions: spec.actions,
          onAction: (id) => onAction?.("action", id)
        }
      ) : void 0,
      children: [
        spec.rows?.length ? /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyList, { labelWidth: "auto", variant: "summary", children: spec.rows.map((row) => /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyRow, { label: row.label, mono: true, children: row.value }, row.label)) }) : null,
        spec.figures?.length ? /* @__PURE__ */ jsxRuntime.jsx(ui.MetricGrid, { joined: true, seamless: true, minTileWidth: 72, children: spec.figures.map((f) => /* @__PURE__ */ jsxRuntime.jsx(ui.MetricTile, { variant: "figure", label: f.label, value: f.value }, f.label)) }) : null
      ]
    }
  );
}
function QuickAsk({ spec, state = "pending", value: given, onAction }) {
  const pending = state === "pending";
  const [editing, setEditing] = React18__namespace.useState(false);
  const keyed = Boolean(spec.more?.length);
  const rows = [
    { ...spec, key: spec.label ?? spec.question },
    ...(spec.more ?? []).map((r) => ({ ...r, key: r.id }))
  ];
  const settled = () => {
    const value = given;
    if (keyed) return value ?? {};
    return { [rows[0].key]: value ?? spec.default };
  };
  const [picked, setPicked] = React18__namespace.useState(
    () => pending ? Object.fromEntries(rows.map((r) => [r.key, r.default])) : settled()
  );
  if (!pending && !editing) {
    const value = settled();
    return /* @__PURE__ */ jsxRuntime.jsx(
      AskSummary,
      {
        rows: rows.map((r) => ({
          label: r.label ?? r.question,
          value: r.options.find((o) => o.value === value[r.key])?.label ?? value[r.key] ?? "\u2014"
        })),
        change: state === "answered" ? keyed ? "Change answers" : "Change answer" : void 0,
        onChange: () => setEditing(true)
      }
    );
  }
  const pick = (key, v) => {
    const next = { ...picked, [key]: v };
    setPicked(next);
    if (rows.some((r) => next[r.key] == null)) return;
    const value = keyed ? next : v;
    onAction?.(editing ? "change" : "reply", value);
    setEditing(false);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: rows.map((r, i) => /* @__PURE__ */ jsxRuntime.jsxs(React18__namespace.Fragment, { children: [
    i === 0 ? /* @__PURE__ */ jsxRuntime.jsx(AskQuestion, { text: spec }) : /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mt-1", children: r.question }),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.SegmentedControl,
      {
        size: "sm",
        "aria-label": r.question,
        variant: "solid",
        stretch: spec.stretch,
        options: r.options,
        defaultValue: picked[r.key] ?? null,
        onValueChange: (v) => pick(r.key, v)
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(AskHint, { children: r.hint })
  ] }, r.key)) });
}
function RankedBlock({ spec }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    charts.BarChartH,
    {
      variant: "ranked",
      color: "var(--color-primary)",
      diverging: spec.diverging,
      data: spec.items.map((item) => ({
        label: item.label,
        value: item.value,
        display: item.display ?? figureText(item.value),
        muted: item.muted
      }))
    }
  );
}
function Rows({ rows }) {
  return /* @__PURE__ */ jsxRuntime.jsx(ui.PropertyList, { labelWidth: "auto", variant: "summary", children: rows.map((row) => /* @__PURE__ */ jsxRuntime.jsxs(ui.PropertyRow, { label: row.label, mono: row.mono ?? true, children: [
    row.value,
    row.source ? /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-xs text-muted-foreground", children: [
      " \xB7 ",
      row.source
    ] }) : null
  ] }, row.label)) });
}
function RecordBlock({ spec }) {
  const { header } = spec;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 flex-col gap-1.5", children: [
    header ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
      header.initials ? /* @__PURE__ */ jsxRuntime.jsx(ui.Avatar, { className: "size-7 border border-border", children: /* @__PURE__ */ jsxRuntime.jsx(ui.AvatarFallback, { className: "text-xs font-semibold text-muted-foreground", children: header.initials }) }) : null,
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate font-semibold", children: header.title }),
      header.status ? /* @__PURE__ */ jsxRuntime.jsx(
        ui.Badge,
        {
          variant: "soft",
          size: "xs",
          tone: BADGE_TONE[header.status.tone ?? "neutral"],
          className: "ms-auto font-normal",
          children: header.status.label
        }
      ) : null
    ] }) : null,
    spec.rows?.length ? /* @__PURE__ */ jsxRuntime.jsx(Rows, { rows: spec.rows }) : null,
    spec.groups?.map((group, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: i > 0 || spec.rows?.length ? "mt-1 flex flex-col gap-1" : "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Eyebrow, { children: group.label }),
      /* @__PURE__ */ jsxRuntime.jsx(Rows, { rows: group.rows })
    ] }, group.label))
  ] });
}
function ScopeBlock({ spec, fixed, onAction }) {
  const stale = spec.parts.some((p) => typeof p === "object" && p.mark === "stale");
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.ScopeLine,
    {
      parts: spec.parts,
      fixedParts: fixed,
      defaultOpenPart: spec.openPart,
      note: spec.hint,
      noteTone: stale ? "warning" : "muted",
      seamless: true,
      onPartChange: (part, value) => onAction?.("scope", { part, value })
    }
  );
}
var OTHER = "\0other";
function SingleAsk({ spec, state = "pending", value: given, id: idProp, onAction }) {
  const auto = React18__namespace.useId();
  const id = idProp ?? auto;
  const pending = state === "pending";
  const [editing, setEditing] = React18__namespace.useState(false);
  const [picked, setPicked] = React18__namespace.useState(spec.default);
  const settledValue = given ?? spec.default;
  if (!pending && !editing) {
    const option = spec.options.find((o) => o.value === settledValue);
    return /* @__PURE__ */ jsxRuntime.jsx(
      AskSummary,
      {
        rows: [{ label: spec.label ?? "Answer", value: pickText(option, settledValue) }],
        change: state === "answered" ? "Change answer" : void 0,
        onChange: () => setEditing(true)
      }
    );
  }
  const send = (value) => {
    onAction?.(editing ? "change" : "reply", value);
    setEditing(false);
  };
  const pick = (value) => {
    setPicked(value);
    if (value !== OTHER && !spec.submit) send(value);
  };
  const other = picked === OTHER;
  const buttons = spec.submit || spec.skippable || other;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Questionnaire,
      {
        onSubmit: (e) => {
          e.preventDefault();
          if (other) {
            const text = new FormData(e.currentTarget).getAll(id).map(String).find((v) => v !== OTHER);
            if (text?.trim()) send(text.trim());
          } else if (picked) send(picked);
        },
        id: `${auto}-form`,
        children: /* @__PURE__ */ jsxRuntime.jsxs(ui.QuestionnaireItem, { name: id, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireTitle, { className: isHeading(spec) ? "font-semibold" : void 0, children: strong(spec.question) }),
          spec.description ? /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireDescription, { children: spec.description }) : null,
          /* @__PURE__ */ jsxRuntime.jsxs(ui.QuestionnaireChoices, { children: [
            spec.options.map((o) => {
              const { props, body } = choiceParts(o);
              return /* @__PURE__ */ jsxRuntime.jsx(
                ui.QuestionnaireChoice,
                {
                  value: o.value,
                  ...props,
                  disabled: o.disabled,
                  checked: picked === o.value,
                  onChange: () => pick(o.value),
                  children: body
                },
                o.value
              );
            }),
            spec.other ? /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireChoice, { value: OTHER, checked: other, onChange: () => pick(OTHER), children: /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireChoiceTitle, { children: "Other\u2026" }) }) : null
          ] }),
          other ? /* @__PURE__ */ jsxRuntime.jsx(ui.QuestionnaireInput, { "aria-label": "Your answer", autoFocus: true }) : null
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(AskHint, { children: spec.hint }),
    buttons ? /* @__PURE__ */ jsxRuntime.jsxs(ui.ClarifyActions, { align: "end", children: [
      spec.skippable && !other ? /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { size: "xs", variant: "ghost", onClick: () => onAction?.("skip"), children: "Skip" }) : null,
      /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { type: "submit", form: `${auto}-form`, size: "xs", disabled: !picked, children: other ? "Use this" : spec.submit ?? "Use this" })
    ] }) : null
  ] });
}
function SuggestionsAsk({ spec, state = "pending", value: given, onAction }) {
  const open = state === "pending" || state === "answered";
  const picked = typeof given === "string" ? [given] : [];
  const all = spec.groups?.length ? spec.groups.flatMap((g) => g.items) : spec.items ?? [];
  return /* @__PURE__ */ jsxRuntime.jsx(
    SuggestionChips,
    {
      items: spec.items,
      groups: spec.groups,
      layout: spec.layout,
      sent: open ? picked : all,
      onSelect: (text) => onAction?.("reply", text)
    }
  );
}
var FITS = 5;
var COLUMN_MIN = 66;
function cellText(cell) {
  if (cell == null) return void 0;
  if (typeof cell !== "object" || !("value" in cell) || "type" in cell) return figureText(cell);
  return figureText(cell.value);
}
function CellText({ cell }) {
  if (cell == null) return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: "\u2014" });
  if (typeof cell !== "object" || !("value" in cell) || "type" in cell) {
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: figureText(cell) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      className: ui.cn(
        cell.tone === "good" && "text-success",
        cell.tone === "bad" && "text-destructive",
        cell.strong && "font-semibold"
      ),
      children: figureText(cell.value)
    }
  );
}
function TableBlock({ spec, onAction, seamless }) {
  const truncated = spec.total != null && spec.total > spec.rows.length;
  const highlighted = new Set(spec.highlight?.map((i) => spec.rows[i]));
  const data = spec.totals ? [...spec.rows, spec.totals] : spec.rows;
  const columns = spec.columns.map((c) => {
    const sorted = spec.sort?.key === c.key ? spec.sort.dir : void 0;
    return {
      id: c.key,
      header: sorted ? () => /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-foreground", children: `${c.label} ${sorted === "asc" ? "\u25B4" : "\u25BE"}` }) : c.label,
      accessorFn: (row) => row[c.key],
      cell: (ctx) => /* @__PURE__ */ jsxRuntime.jsx(CellText, { cell: ctx.getValue() }),
      meta: { align: c.align, cellClassName: ui.cn("whitespace-nowrap", c.mono && "font-mono") }
    };
  });
  const { rowKey } = spec;
  const keyOf = (row) => rowKey != null && row !== spec.totals ? cellText(row[rowKey]) : void 0;
  const noun = [spec.noun, spec.note].filter(Boolean).join(" \xB7 ") || void 0;
  return /* @__PURE__ */ jsxRuntime.jsx(
    tables.DataTable,
    {
      columns,
      data,
      density: "compact",
      bordered: false,
      seamless,
      enableSorting: false,
      enableColumnVisibility: false,
      minWidth: spec.columns.length > FITS ? spec.columns.length * COLUMN_MIN : void 0,
      isRowHighlighted: highlighted.size ? (row) => highlighted.has(row) : void 0,
      isTotalRow: spec.totals ? (row) => row === spec.totals : void 0,
      isRowSelected: spec.selected != null ? (row) => keyOf(row) === spec.selected : void 0,
      onRowClick: rowKey != null && onAction ? (row) => {
        const key = keyOf(row);
        if (key != null) onAction("select", key);
      } : void 0,
      preview: {
        total: spec.total,
        noun,
        onOpen: truncated && onAction ? () => onAction("open") : void 0
      }
    }
  );
}
var DOT_TONE = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: "muted"
};
function Events({ events }) {
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: events.map((event, i) => /* @__PURE__ */ jsxRuntime.jsxs(React18__namespace.Fragment, { children: [
    event.section && event.section !== events[i - 1]?.section ? /* @__PURE__ */ jsxRuntime.jsx(ui.TimelineSection, { children: event.section }) : null,
    /* @__PURE__ */ jsxRuntime.jsxs(
      ui.TimelineEntry,
      {
        when: event.when,
        marker: /* @__PURE__ */ jsxRuntime.jsx(ui.StatusDot, { tone: DOT_TONE[event.tone ?? "neutral"], size: "md" }),
        highlight: event.highlight ? "error" : void 0,
        nested: event.children?.length ? /* @__PURE__ */ jsxRuntime.jsx(Events, { events: event.children }) : void 0,
        defaultOpen: event.open,
        children: [
          event.text,
          event.detail ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground", children: event.detail }) : null
        ]
      }
    )
  ] }, i)) });
}
function TimelineBlock({ spec }) {
  return /* @__PURE__ */ jsxRuntime.jsx(ui.TimelineList, { variant: "compact", children: /* @__PURE__ */ jsxRuntime.jsx(Events, { events: spec.events }) });
}
var RING_COLOR = {
  good: "var(--color-success)",
  bad: "var(--color-destructive)",
  warn: "var(--color-warning)",
  neutral: "var(--color-muted-foreground)"
};
function TimeseriesBlock({ spec }) {
  const series = spec.series[0];
  if (!series) return null;
  const labels = series.points.map(([at2]) => at2);
  const values = series.points.map(([, value]) => value);
  const at = (label) => label == null ? -1 : labels.indexOf(label);
  const forecastFrom = at(spec.forecastFrom);
  const breaches = spec.reference ? values.flatMap((value, index) => value != null && value > spec.reference.value ? [{ index, color: RING_COLOR.bad }] : []) : [];
  const format = (value) => {
    const n = figureText(Math.round(value * 10) / 10);
    return spec.unit ? `${n} ${spec.unit}` : n;
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    charts.LineChart,
    {
      "aria-label": series.name,
      values,
      name: series.name,
      compare: spec.series.slice(1).map((other) => ({
        name: other.name,
        // Aligned on the first series' periods: a period it lacks is a gap.
        values: labels.map((label) => other.points.find(([at2]) => at2 === label)?.[1] ?? null)
      })),
      labels,
      format,
      zero: false,
      color: "var(--color-foreground)",
      band: spec.band && { ...spec.band, color: "var(--color-primary)" },
      reference: spec.reference,
      highlights: [...(spec.marks ?? []).map((mark) => ({ index: at(mark.at), color: RING_COLOR[mark.tone ?? "neutral"] })), ...breaches].filter((mark) => mark.index >= 0),
      forecastFrom: forecastFrom >= 0 ? forecastFrom : void 0,
      forecastLabel: spec.forecastLabel
    }
  );
}
function TraceBlock({ spec, onAction }) {
  const [open, setOpen] = React18__namespace.useState(!spec.folded);
  const list = /* @__PURE__ */ jsxRuntime.jsx(ui.TraceList, { variant: "progress", children: spec.steps.map((step, i) => /* @__PURE__ */ jsxRuntime.jsx(
    ui.TraceStep,
    {
      name: step.label,
      duration: step.detail,
      status: step.state,
      error: step.error
    },
    step.id ?? i
  )) });
  const actions = spec.actions?.length ? /* @__PURE__ */ jsxRuntime.jsx(ActionRow, { actions: spec.actions, onAction: (id) => onAction?.("action", id) }) : null;
  if (!spec.folded) {
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      list,
      actions
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.ChatSessionDisclosure,
    {
      variant: "inline",
      label: `${spec.steps.length} steps`,
      meta: spec.summary,
      open,
      onOpenChange: setOpen,
      children: list
    }
  );
}

// src/registry.ts
var BLOCK_RENDERERS = {
  confirm: ConfirmAsk,
  single: SingleAsk,
  multi: MultiAsk,
  quick: QuickAsk,
  period: null,
  number: null,
  short: null,
  long: null,
  entity: null,
  scale: null,
  multistep: MultistepAsk,
  form: FormAsk,
  weights: null,
  approval: null,
  interpretation: null,
  fork: null,
  plan: null,
  modelspec: null,
  hypothesis: null,
  range: null,
  suggestions: SuggestionsAsk,
  narrative: NarrativeBlock,
  metric: MetricBlock,
  grid: GridBlock,
  table: TableBlock,
  attr: null,
  record: RecordBlock,
  ranked: RankedBlock,
  timeseries: TimeseriesBlock,
  bars: BarsBlock,
  waterfall: null,
  matrix: null,
  funnel: null,
  histogram: null,
  timeline: TimelineBlock,
  subgraph: null,
  method: MethodBlock,
  citations: CitationsBlock,
  files: FilesBlock,
  proposal: ProposalBlock,
  cannot: CannotBlock,
  caveat: CaveatBlock,
  scope: ScopeBlock,
  checks: null,
  trace: TraceBlock,
  activity: ActivityBlock,
  gantt: GanttBlock,
  heatstrip: HeatStripBlock,
  test: null,
  coef: null,
  forest: null,
  scatter: null,
  box: null,
  correlation: null,
  control: null,
  pareto: null,
  survival: null,
  tornado: null,
  decomposition: null,
  modeleval: null,
  pivot: null,
  profile: null,
  evidence: null,
  dumbbell: null,
  quantiles: null
};

// src/stream/patch.ts
var BlockPatchError = class extends Error {
};
var isObj = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
function merge(target, fields) {
  const next = { ...target, ...fields };
  for (const [name, value] of Object.entries(fields)) if (value === null) delete next[name];
  return next;
}
var identity = (item) => isObj(item) ? item.key ?? item.id : void 0;
var where = (path, depth) => JSON.stringify(path.slice(0, depth));
function indexOn(list, segment, path, depth) {
  const at = typeof segment === "number" ? segment : list.findIndex((item) => identity(item) === segment);
  if (at < 0 || at >= list.length) throw new BlockPatchError(`No item ${JSON.stringify(segment)} at ${where(path, depth)}.`);
  return at;
}
function update(node, path, depth, fn) {
  if (depth === path.length) return fn(node);
  const segment = path[depth];
  if (Array.isArray(node)) {
    const at = indexOn(node, segment, path, depth);
    const next = node.slice();
    next[at] = update(node[at], path, depth + 1, fn);
    return next;
  }
  if (isObj(node) && typeof segment === "string") {
    return { ...node, [segment]: update(node[segment], path, depth + 1, fn) };
  }
  throw new BlockPatchError(`Nothing to read ${JSON.stringify(segment)} from at ${where(path, depth)}.`);
}
function patchValue(value, patch) {
  const at = JSON.stringify(patch.at ?? []);
  switch (patch.op) {
    case "set":
      if (!isObj(value)) throw new BlockPatchError(`"set": ${at} is not an object.`);
      return merge(value, patch.fields);
    case "append":
      if (value !== void 0 && typeof value !== "string") throw new BlockPatchError(`"append": ${at} is not text.`);
      return (value ?? "") + patch.text;
    case "push":
      if (value !== void 0 && !Array.isArray(value)) throw new BlockPatchError(`"push": ${at} is not a list.`);
      return [...value ?? [], ...patch.items];
    case "upsert": {
      if (value !== void 0 && !Array.isArray(value)) throw new BlockPatchError(`"upsert": ${at} is not a list.`);
      const id = identity(patch.item);
      if (id === void 0) throw new BlockPatchError(`"upsert": the item at ${at} has no key or id.`);
      const list = value ?? [];
      const found = list.findIndex((item) => identity(item) === id);
      if (found < 0) return [...list, merge({}, patch.item)];
      return list.map((item, i) => i === found ? merge(item, patch.item) : item);
    }
  }
}
function applyBlockPatch(spec, patch) {
  const next = update(spec, patch.at ?? [], 0, (value) => patchValue(value, patch));
  return "kind" in spec ? { ...next, kind: spec.kind } : next;
}
function applyBlockPatches(spec, patches) {
  return patches.reduce(applyBlockPatch, spec);
}

// src/stream/source.ts
var toArray = (chunk) => Array.isArray(chunk) ? chunk : [chunk];
async function* patchesOf(source) {
  for await (const chunk of source) yield toArray(chunk);
}
async function* fromNdjson(input) {
  const body = input instanceof Response ? input.body : input;
  if (!body) return;
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffered = "";
  try {
    for (; ; ) {
      const { value, done } = await reader.read();
      buffered += decoder.decode(value, { stream: !done });
      let newline = buffered.indexOf("\n");
      while (newline >= 0) {
        const line = buffered.slice(0, newline).trim();
        buffered = buffered.slice(newline + 1);
        if (line) yield JSON.parse(line);
        newline = buffered.indexOf("\n");
      }
      if (done) break;
    }
    const rest = buffered.trim();
    if (rest) yield JSON.parse(rest);
  } finally {
    reader.releaseLock();
  }
}
async function* fromEventSource(source, { event = "message", done = "done", close = true } = {}) {
  const queue = [];
  let finished = false;
  let failure;
  let wake;
  const notify = () => {
    wake?.();
    wake = void 0;
  };
  const onData = (e) => {
    try {
      queue.push(JSON.parse(e.data));
    } catch (error) {
      failure = error;
    }
    notify();
  };
  const onDone = () => {
    finished = true;
    notify();
  };
  const onError = () => {
    if (source.readyState === EventSource.CLOSED) onDone();
  };
  source.addEventListener(event, onData);
  source.addEventListener(done, onDone);
  source.addEventListener("error", onError);
  try {
    for (; ; ) {
      if (failure) throw failure;
      const next = queue.shift();
      if (next) {
        yield next;
        continue;
      }
      if (finished) return;
      await new Promise((resolve) => wake = resolve);
    }
  } finally {
    source.removeEventListener(event, onData);
    source.removeEventListener(done, onDone);
    source.removeEventListener("error", onError);
    if (close) source.close();
  }
}
function sleep(ms, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted || ms <= 0) return resolve();
    const timer = setTimeout(done, ms);
    function done() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", done);
      resolve();
    }
    signal?.addEventListener("abort", done, { once: true });
  });
}
function scriptFrames(script) {
  const frames = [];
  for (const step of [...script].sort((a, b) => a.at - b.at)) {
    const last = frames[frames.length - 1];
    if (last?.at === step.at) last.patches.push(...toArray(step.patch));
    else frames.push({ at: step.at, patches: toArray(step.patch) });
  }
  return frames;
}
async function* playScript(script, { speed = 1, signal } = {}) {
  let clock = 0;
  for (const frame of scriptFrames(script)) {
    if (signal?.aborted) return;
    await sleep((frame.at - clock) / speed, signal);
    if (signal?.aborted) return;
    clock = frame.at;
    yield frame.patches;
  }
}
var offsetScript = (script, ms) => script.map((s) => ({ ...s, at: s.at + ms }));
var scriptLength = (script) => script.reduce((m, s) => Math.max(m, s.at), 0);
function useStreamedSpec(spec, stream, apply, { onEnd, onError, stopPatches } = {}) {
  const [base, setBase] = React18__namespace.useState(spec);
  const [live, setLive] = React18__namespace.useState(spec);
  if (stream && base !== spec) {
    setBase(spec);
    setLive(spec);
  }
  const current = React18__namespace.useRef(spec);
  const abort = React18__namespace.useRef(null);
  const latest = React18__namespace.useRef({ apply, onEnd, onError, stopPatches });
  React18__namespace.useLayoutEffect(() => {
    latest.current = { apply, onEnd, onError, stopPatches };
    current.current = live;
  });
  const set = React18__namespace.useCallback((next) => {
    current.current = next;
    setLive(next);
  }, []);
  React18__namespace.useEffect(() => {
    if (!stream) return;
    const controller = new AbortController();
    abort.current = controller;
    void (async () => {
      try {
        const source = typeof stream === "function" ? stream(controller.signal) : stream;
        for await (const batch of patchesOf(source)) {
          if (controller.signal.aborted) return;
          set(latest.current.apply(current.current, batch));
        }
        if (!controller.signal.aborted) latest.current.onEnd?.(current.current);
      } catch (error) {
        if (!controller.signal.aborted) latest.current.onError?.(error);
      } finally {
        if (abort.current === controller) abort.current = null;
      }
    })();
    return () => controller.abort();
  }, [stream, set]);
  const stop = React18__namespace.useCallback(() => {
    if (!abort.current) return;
    abort.current.abort();
    abort.current = null;
    const { apply: apply2, stopPatches: stopPatches2 } = latest.current;
    if (stopPatches2) set(apply2(current.current, stopPatches2(current.current)));
  }, [set]);
  return { live: stream ? live : spec, stop };
}
function useBlockStream(spec, stream, options) {
  return useStreamedSpec(spec, stream, applyBlockPatches, options);
}
function Block({ spec, stream, onStreamEnd, onStreamError, ...props }) {
  const { live } = useBlockStream(spec, stream, { onEnd: onStreamEnd, onError: onStreamError });
  const Renderer = BLOCK_RENDERERS[live.kind];
  if (!Renderer) return /* @__PURE__ */ jsxRuntime.jsx(Placeholder, { kind: live.kind, options: live });
  return /* @__PURE__ */ jsxRuntime.jsx(Renderer, { spec: live, ...props });
}
var Page = React18__namespace.forwardRef(({ spec, onAction, className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs("article", { ref, className: ui.cn("flex min-w-0 flex-col gap-6", className), ...props, children: [
  spec.title || spec.description ? /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "flex flex-col gap-1", children: [
    spec.title ? /* @__PURE__ */ jsxRuntime.jsx(ui.TypographyH3, { children: spec.title }) : null,
    spec.description ? /* @__PURE__ */ jsxRuntime.jsx(ui.TypographyMuted, { children: spec.description }) : null
  ] }) : null,
  spec.sections.map((section, s) => /* @__PURE__ */ jsxRuntime.jsxs("section", { className: "flex min-w-0 flex-col gap-3", children: [
    section.title ? /* @__PURE__ */ jsxRuntime.jsx(ui.SectionHeader, { title: section.title }) : null,
    section.description ? /* @__PURE__ */ jsxRuntime.jsx(ui.TypographyMuted, { children: section.description }) : null,
    section.blocks.map((block, b) => /* @__PURE__ */ jsxRuntime.jsx(
      Block,
      {
        spec: block,
        onAction: onAction ? (action, value) => onAction(action, value === void 0 ? { section: s, block: b } : { section: s, block: b, value }) : void 0
      },
      b
    ))
  ] }, s))
] }));
Page.displayName = "Page";

exports.ANSWER_KINDS = ANSWER_KINDS;
exports.ASK_KINDS = ASK_KINDS;
exports.ActionRow = ActionRow;
exports.ActivityBlock = ActivityBlock;
exports.BADGE_TONE = BADGE_TONE;
exports.BLOCKS = BLOCKS;
exports.BLOCK_RENDERERS = BLOCK_RENDERERS;
exports.BarsBlock = BarsBlock;
exports.Block = Block;
exports.BlockPatchError = BlockPatchError;
exports.CAPTION_TONE = CAPTION_TONE;
exports.CannotBlock = CannotBlock;
exports.CaveatBlock = CaveatBlock;
exports.CitationsBlock = CitationsBlock;
exports.ConfirmAsk = ConfirmAsk;
exports.ConfirmCard = ConfirmCard;
exports.FilesBlock = FilesBlock;
exports.FormAsk = FormAsk;
exports.GanttBlock = GanttBlock;
exports.GridBlock = GridBlock;
exports.HeatStripBlock = HeatStripBlock;
exports.MethodBlock = MethodBlock;
exports.MetricBlock = MetricBlock;
exports.MultiAsk = MultiAsk;
exports.MultistepAsk = MultistepAsk;
exports.NarrativeBlock = NarrativeBlock;
exports.Page = Page;
exports.Placeholder = Placeholder;
exports.ProposalBlock = ProposalBlock;
exports.QuickAsk = QuickAsk;
exports.RankedBlock = RankedBlock;
exports.RecordBlock = RecordBlock;
exports.ScopeBlock = ScopeBlock;
exports.SingleAsk = SingleAsk;
exports.SuggestionChips = SuggestionChips;
exports.SuggestionsAsk = SuggestionsAsk;
exports.TableBlock = TableBlock;
exports.TimelineBlock = TimelineBlock;
exports.TimeseriesBlock = TimeseriesBlock;
exports.TraceBlock = TraceBlock;
exports.VALUE_TYPES = VALUE_TYPES;
exports.applyBlockPatch = applyBlockPatch;
exports.applyBlockPatches = applyBlockPatches;
exports.figureText = figureText;
exports.fromEventSource = fromEventSource;
exports.fromNdjson = fromNdjson;
exports.metricValue = metricValue;
exports.offsetScript = offsetScript;
exports.patchesOf = patchesOf;
exports.playScript = playScript;
exports.prose = prose;
exports.scriptFrames = scriptFrames;
exports.scriptLength = scriptLength;
exports.strong = strong;
exports.useBlockStream = useBlockStream;
exports.useStreamedSpec = useStreamedSpec;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map