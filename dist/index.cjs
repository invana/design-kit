'use strict';

var React2 = require('react');
var uPlot2 = require('uplot');
var ui = require('@invana/ui');
var tables = require('@invana/tables');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

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
var uPlot2__default = /*#__PURE__*/_interopDefault(uPlot2);

// src/line-chart.tsx

// src/base/theme.ts
var DATA_SLOTS = 8;
function resolveColor(host, css) {
  const probe = document.createElement("span");
  probe.style.color = css;
  probe.style.display = "none";
  host.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return toRgba(value);
}
var pixel;
function toRgba(css) {
  if (/^rgba?\(/.test(css)) return css;
  if (pixel === void 0) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    pixel = canvas.getContext("2d", { willReadFrequently: true });
  }
  if (!pixel) return css;
  pixel.clearRect(0, 0, 1, 1);
  pixel.fillStyle = css;
  pixel.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${Math.round(a / 255 * 1e3) / 1e3})`;
}
function resolveSize(host, css) {
  const probe = document.createElement("span");
  probe.style.fontSize = css;
  probe.style.display = "none";
  host.appendChild(probe);
  const value = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  return value;
}
function readChartTheme(host) {
  const color = (name) => resolveColor(host, `var(${name})`);
  const family = getComputedStyle(host).fontFamily;
  const size = {
    base: resolveSize(host, "var(--text-base, 1rem)"),
    sm: resolveSize(host, "var(--text-sm, 0.923rem)"),
    xs: resolveSize(host, "var(--text-xs, 0.846rem)")
  };
  return {
    data: Array.from(
      { length: DATA_SLOTS },
      (_, i) => resolveColor(host, `var(--color-data-${i + 1}, var(--color-muted-foreground))`)
    ),
    success: color("--color-success"),
    warning: color("--color-warning"),
    destructive: color("--color-destructive"),
    foreground: color("--color-foreground"),
    mutedForeground: color("--color-muted-foreground"),
    border: color("--color-border"),
    card: color("--color-card"),
    // Whole pixels: uPlot rescales a font for the device by matching
    // `(\d+)px`, which reads `10.998px` as `998px`.
    font: {
      base: `${Math.round(size.base)}px ${family}`,
      sm: `${Math.round(size.sm)}px ${family}`,
      xs: `${Math.round(size.xs)}px ${family}`
    },
    size,
    family
  };
}
function withAlpha(rgb, alpha) {
  const parts = rgb.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return rgb;
  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
}

// src/base/hooks.ts
var THEME_ATTRIBUTES = ["class", "style", "data-theme", "data-density"];
function useChartTheme(ref) {
  const [theme, setTheme] = React2__namespace.useState(null);
  React2__namespace.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setTheme(readChartTheme(el));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: THEME_ATTRIBUTES
    });
    const scheme = window.matchMedia?.("(prefers-color-scheme: dark)");
    scheme?.addEventListener?.("change", read);
    document.fonts?.ready.then(read).catch(() => {
    });
    return () => {
      observer.disconnect();
      scheme?.removeEventListener?.("change", read);
    };
  }, [ref]);
  return theme;
}
function useWidth(ref) {
  const [width, setWidth] = React2__namespace.useState(0);
  React2__namespace.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(Math.floor(el.getBoundingClientRect().width));
    const observer = new ResizeObserver(
      ([entry]) => setWidth(Math.floor(entry.contentRect.width))
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

// src/base/uplot-styles.ts
var CSS = `
.invana-uplot, .invana-uplot * { box-sizing: border-box; }
.invana-uplot { width: min-content; line-height: 1; }
.invana-uplot .u-wrap { position: relative; user-select: none; }
.invana-uplot .u-over, .invana-uplot .u-under { position: absolute; }
.invana-uplot .u-under { overflow: hidden; }
.invana-uplot canvas { display: block; position: relative; width: 100%; height: 100%; }
.invana-uplot .u-axis { position: absolute; }
.invana-uplot .u-select { position: absolute; pointer-events: none; }
.invana-uplot .u-cursor-x, .invana-uplot .u-cursor-y {
  position: absolute; left: 0; top: 0; pointer-events: none; will-change: transform;
}
.invana-uplot .u-hz .u-cursor-x { height: 100%; border-right: 1px solid var(--color-border); }
.invana-uplot .u-cursor-pt {
  position: absolute; top: 0; left: 0; border-radius: 50%; border: 0 solid;
  pointer-events: none; will-change: transform; background-clip: padding-box !important;
}
.invana-uplot .u-off { display: none; }
`;
var ID = "invana-charts-uplot";
function installUPlotStyles() {
  if (typeof document === "undefined" || document.getElementById(ID)) return;
  const style = document.createElement("style");
  style.id = ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}
var measure = /* @__PURE__ */ (() => {
  let ctx;
  return (font, text) => {
    if (ctx === void 0) ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return text.length * 7;
    ctx.font = font;
    return ctx.measureText(text).width;
  };
})();
var ChartFrame = React2__namespace.forwardRef(
  ({
    summary,
    labels,
    height,
    ticks,
    marks = [],
    reference,
    legend = [],
    empty,
    build,
    tooltip,
    table,
    className,
    "aria-label": ariaLabel,
    ...props
  }, ref) => {
    const root = React2__namespace.useRef(null);
    React2__namespace.useImperativeHandle(ref, () => root.current);
    const mount = React2__namespace.useRef(null);
    const plot = React2__namespace.useRef(null);
    const theme = useChartTheme(root);
    const width = useWidth(root);
    const widthRef = React2__namespace.useRef(width);
    React2__namespace.useLayoutEffect(() => {
      widthRef.current = width;
    });
    const [asTable, setAsTable] = React2__namespace.useState(false);
    const [hover, setHover] = React2__namespace.useState(null);
    const [box, setBox] = React2__namespace.useState(null);
    const [crosshair, setCrosshair] = React2__namespace.useState(true);
    const n = labels.length;
    const blank = empty != null || n === 0;
    const marksKey = JSON.stringify(marks);
    const referenceKey = JSON.stringify(reference ?? null);
    const hasWidth = width > 0;
    React2__namespace.useEffect(() => {
      const el = mount.current;
      const host = root.current;
      if (!el || !host || !theme || !hasWidth || blank || asTable) return;
      installUPlotStyles();
      const built = build(theme, host);
      const marksNow = JSON.parse(marksKey);
      const referenceNow = JSON.parse(referenceKey);
      setCrosshair(built.crosshair);
      const labelBand = marksNow.some((m) => m.label) ? Math.ceil(theme.size.xs) + 8 : 0;
      const half = Math.ceil(theme.size.xs / 2) + 1;
      const axisWidth = Math.ceil(Math.max(0, ...built.splits.map((s) => measure(theme.font.xs, built.format(s))))) + 10;
      const referenceBand = referenceNow ? Math.ceil(measure(theme.font.xs, referenceNow.label)) + 10 : 0;
      const readBox = (u2) => setBox({
        left: u2.over.offsetLeft,
        top: u2.over.offsetTop,
        width: u2.over.clientWidth,
        height: u2.over.clientHeight
      });
      const drawMarks = (u2) => {
        const ctx = u2.ctx;
        const pr = uPlot2__default.default.pxRatio;
        const { left, top, width: w, height: h } = u2.bbox;
        ctx.save();
        ctx.font = `${theme.size.xs * pr}px ${theme.family}`;
        ctx.lineWidth = pr;
        ctx.setLineDash([3 * pr, 3 * pr]);
        ctx.strokeStyle = theme.mutedForeground;
        ctx.fillStyle = theme.mutedForeground;
        ctx.textBaseline = "bottom";
        let lastRight = -Infinity;
        for (const m of marksNow) {
          if (m.index < 0 || m.index >= n) continue;
          const x = Math.round(u2.valToPos(m.index, "x", true)) + 0.5;
          ctx.beginPath();
          ctx.moveTo(x, top - 2 * pr);
          ctx.lineTo(x, top + h);
          ctx.stroke();
          if (!m.label) continue;
          const tw = ctx.measureText(m.label).width;
          const flip = x + 4 * pr + tw > left + w;
          const start = flip ? x - 4 * pr - tw : x + 4 * pr;
          if (start < lastRight + 6 * pr) continue;
          ctx.textAlign = "left";
          ctx.fillText(m.label, start, top - 2 * pr);
          lastRight = start + tw;
        }
        if (referenceNow) {
          const y = Math.round(u2.valToPos(referenceNow.value, "y", true)) + 0.5;
          ctx.setLineDash([2 * pr, 4 * pr]);
          ctx.beginPath();
          ctx.moveTo(left, y);
          ctx.lineTo(left + w, y);
          ctx.stroke();
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(referenceNow.label, left + w + 6 * pr, y);
        }
        ctx.restore();
      };
      const color = (u2, i) => {
        const stroke = u2.series[i].stroke;
        return String(typeof stroke === "function" ? stroke(u2, i) : stroke);
      };
      const opts = {
        class: "invana-uplot",
        width: widthRef.current,
        height,
        padding: [labelBand || half, Math.max(built.padRight ?? 4, referenceBand), half, 0],
        legend: { show: false },
        scales: {
          x: { time: false, range: [-0.5, n - 0.5] },
          y: { range: [built.floor ?? 0, built.ceiling] }
        },
        axes: [
          { show: false },
          {
            scale: "y",
            side: 3,
            size: axisWidth,
            gap: 6,
            font: theme.font.xs,
            stroke: theme.mutedForeground,
            ticks: { show: false },
            grid: { stroke: theme.border, width: 1 },
            splits: () => built.splits,
            values: (_u, splits) => splits.map((s) => built.format(s))
          }
        ],
        series: [{}, ...built.series],
        bands: built.bands,
        cursor: {
          x: built.crosshair,
          y: false,
          drag: { x: false, y: false, setScale: false },
          points: {
            show: built.cursorPoints ?? built.crosshair,
            size: 8,
            width: 2,
            stroke: () => theme.card,
            fill: color
          }
        },
        hooks: {
          ready: [readBox],
          setSize: [readBox],
          setCursor: [(u2) => setHover(u2.cursor.idx ?? null)],
          drawAxes: built.drawUnder ? [built.drawUnder] : [],
          draw: [...built.draw ? [built.draw] : [], drawMarks]
        }
      };
      const xs = Array.from({ length: n }, (_, i) => i);
      const u = new uPlot2__default.default(opts, [xs, ...built.data], el);
      plot.current = u;
      return () => {
        u.destroy();
        plot.current = null;
        setHover(null);
      };
    }, [theme, build, hasWidth, blank, asTable, n, height, marksKey, referenceKey]);
    React2__namespace.useEffect(() => {
      if (hasWidth) plot.current?.setSize({ width, height });
    }, [width, height, hasWidth]);
    const slot = box ? box.width / Math.max(n, 1) : 0;
    const xAt = (i) => box ? box.left + (i + 0.5) * slot : 0;
    const tickStyle = (i) => n > 1 && i === 0 ? { left: xAt(i) - slot / 2 } : n > 1 && i === n - 1 ? { right: (width || 0) - (xAt(i) + slot / 2) } : { left: xAt(i), transform: "translateX(-50%)" };
    const tickSpan = (i) => {
      const w = theme ? measure(theme.font.xs, labels[i] ?? "") : 0;
      if (n > 1 && i === 0) return [xAt(i) - slot / 2, xAt(i) - slot / 2 + w];
      if (n > 1 && i === n - 1) return [xAt(i) + slot / 2 - w, xAt(i) + slot / 2];
      return [xAt(i) - w / 2, xAt(i) + w / 2];
    };
    const wanted = [...new Set(ticks ?? (n > 1 ? [0, n - 1] : [0]))].filter((i) => i >= 0 && i < n);
    const placed = [];
    const named = [
      ...wanted.filter((i) => i === 0 || i === n - 1),
      ...wanted.filter((i) => i !== 0 && i !== n - 1)
    ].filter((i) => {
      const [a, b] = tickSpan(i);
      if (placed.some(([c, d]) => a < d + 8 && b > c - 8)) return false;
      placed.push([a, b]);
      return true;
    });
    const tip = hover != null && hover < n ? tooltip(hover) : null;
    const markHere = hover != null ? marks.flatMap((m) => m.index === hover && m.label ? [m.label] : []) : [];
    const tipLeft = hover != null ? xAt(hover) : 0;
    const tipFlip = box ? tipLeft > box.left + box.width / 2 : false;
    const onKeyDown = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const step = e.key === "ArrowLeft" ? -1 : 1;
      setHover((at) => Math.min(n - 1, Math.max(0, (at ?? (step > 0 ? -1 : n)) + step)));
    };
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: root, className: ui.cn("flex min-w-0 flex-col gap-1", className), ...props, children: [
      asTable ? /* @__PURE__ */ jsxRuntime.jsx(
        tables.DataTable,
        {
          columns: table.columns,
          data: table.rows,
          enableSorting: false
        }
      ) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            role: "img",
            "aria-label": ariaLabel ?? summary,
            tabIndex: blank ? void 0 : 0,
            onKeyDown,
            onBlur: () => setHover(null),
            className: "relative w-full rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-ring",
            style: { height },
            children: blank ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: empty ?? "Nothing in this period" }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              !crosshair && hover != null && box ? (
                // The hover band sits behind the transparent canvas, so a
                // column lifts without its colour being tinted.
                /* @__PURE__ */ jsxRuntime.jsx(
                  "div",
                  {
                    "aria-hidden": true,
                    className: "absolute rounded-sm bg-muted",
                    style: { left: xAt(hover) - slot / 2, width: slot, top: box.top, height: box.height }
                  }
                )
              ) : null,
              /* @__PURE__ */ jsxRuntime.jsx("div", { ref: mount, "aria-hidden": true, className: "relative" }),
              tip && box ? /* @__PURE__ */ jsxRuntime.jsxs(
                ui.Card,
                {
                  "aria-hidden": true,
                  className: "pointer-events-none absolute z-10 flex min-w-32 max-w-64 flex-col gap-1 px-2 py-1.5 shadow-sm",
                  style: {
                    top: box.top,
                    left: tipFlip ? void 0 : tipLeft + 10,
                    right: tipFlip ? (width || 0) - tipLeft + 10 : void 0
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Eyebrow, { children: tip.title }),
                    tip.rows.map((r) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "h-0.5 w-3 shrink-0 rounded-full", style: { background: r.color } }),
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-semibold tabular-nums", children: r.value }),
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate text-muted-foreground", children: r.label })
                    ] }, r.key)),
                    [...markHere, ...tip.note ? [tip.note] : []].map((note) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: note }, note))
                  ]
                }
              ) : null
            ] })
          }
        ),
        !blank && box ? /* @__PURE__ */ jsxRuntime.jsx("div", { "aria-hidden": true, className: "relative h-4 text-xs text-muted-foreground", children: named.map((i) => /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: "absolute top-0 whitespace-nowrap tabular-nums",
            style: tickStyle(i),
            children: labels[i]
          },
          i
        )) }) : null
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1", children: [
        legend.length > 1 && !blank ? /* @__PURE__ */ jsxRuntime.jsx(ui.Legend, { children: legend.map((s) => /* @__PURE__ */ jsxRuntime.jsx(ui.LegendItem, { color: s.color, label: s.label, kind: s.kind }, s.key)) }) : null,
        blank ? null : /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            variant: "link",
            size: "xs",
            className: "ml-auto px-0 text-muted-foreground",
            "aria-pressed": asTable,
            onClick: () => setAsTable((v) => !v),
            children: asTable ? "View as chart" : "View as table"
          }
        )
      ] })
    ] });
  }
);
ChartFrame.displayName = "ChartFrame";

// src/base/floors.ts
var COUNT_FLOOR = 5;
var MAX_BAR_WIDTH = 24;
var SEGMENT_GAP = 2;
var BAR_RADIUS = 4;
function niceScale(max, { integers = false } = {}) {
  const top = max > 0 ? max : 1;
  let power = 10 ** Math.floor(Math.log10(top / 4));
  if (integers) power = Math.max(1, power);
  for (; ; ) {
    for (const m of [1, 2, 5]) {
      const step = m * power;
      const k = Math.max(1, Math.ceil(top / step - 1e-9));
      if (k <= 4) return { ceiling: step * k, splits: Array.from({ length: k + 1 }, (_, i) => i * step) };
    }
    power *= 10;
  }
}
function niceRange(min, max) {
  const span = max > min ? max - min : Math.abs(max) || 1;
  let power = 10 ** Math.floor(Math.log10(span / 4));
  for (; ; ) {
    for (const m of [1, 2, 5]) {
      const step = m * power;
      const floor = Math.floor(min / step + 1e-9) * step;
      const k = Math.max(1, Math.ceil((max - floor) / step - 1e-9));
      if (k <= 4) {
        return {
          floor,
          ceiling: floor + step * k,
          splits: Array.from({ length: k + 1 }, (_, i) => floor + i * step)
        };
      }
    }
    power *= 10;
  }
}
function countScale(max) {
  return niceScale(Math.max(max, COUNT_FLOOR), { integers: true });
}
function fixedSplits(ceiling) {
  return [0, ceiling / 2, ceiling];
}
var compact = new Intl.NumberFormat(void 0, { notation: "compact", maximumFractionDigits: 1 });
var whole = new Intl.NumberFormat();
function formatCount(value) {
  return Math.abs(value) < 1e4 ? whole.format(value) : compact.format(value);
}
function useLatest(value) {
  const ref = React2__namespace.useRef(value);
  React2__namespace.useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
var NONE = [];
var LineChart = React2__namespace.forwardRef(
  ({
    values,
    name,
    compare = NONE,
    labels,
    format = String,
    max,
    gridlines = NONE,
    marks = NONE,
    reference,
    band,
    highlights = NONE,
    forecastFrom,
    forecastLabel,
    zero = true,
    ticks,
    height = 132,
    color = "var(--color-primary)",
    empty,
    ...props
  }, ref) => {
    const fmt = useLatest(format);
    const referenceValue = reference?.value;
    const n = values.length;
    const [lower, upper] = React2__namespace.useMemo(() => {
      const spread = (edge) => edge == null ? null : Array.from({ length: n }, (_, i) => typeof edge === "number" ? edge : edge[i] ?? null);
      return [spread(band?.lower), spread(band?.upper)];
    }, [band?.lower, band?.upper, n]);
    const forecast = forecastFrom != null && forecastFrom >= 0 && forecastFrom < n ? forecastFrom : null;
    const highlightsKey = JSON.stringify(highlights);
    const compareKey = JSON.stringify(compare);
    const named = compare.length > 0;
    const build = React2__namespace.useCallback(
      (theme, host) => {
        const stroke = resolveColor(host, color);
        const rings = JSON.parse(highlightsKey).filter((h) => h.index >= 0 && h.index < n).map((h) => ({ index: h.index, color: h.color ? resolveColor(host, h.color) : stroke }));
        const ringed = new Set(rings.map((r) => r.index));
        const others = JSON.parse(compareKey).map((c) => ({
          ...c,
          stroke: resolveColor(host, c.color ?? "var(--color-muted-foreground)")
        }));
        const measured2 = [...values, ...others.flatMap((c) => c.values)].filter((v) => v != null);
        const edges = [...lower ?? [], ...upper ?? []].filter((v) => v != null);
        const top = Math.max(...measured2, ...edges, referenceValue ?? -Infinity);
        const bottom = Math.min(...measured2, ...edges, referenceValue ?? Infinity);
        const scale = zero ? { floor: 0, ...niceScale(Math.max(0, top) * 1.05) } : niceRange(bottom, top + (top - bottom) * 0.05);
        const ceiling = max ?? Math.max(scale.ceiling, ...gridlines);
        const last = forecast ?? values.reduce((at, v, i) => v != null ? i : at, -1);
        const points = values.map((v, i) => v != null && (i === last || values[i - 1] == null && values[i + 1] == null) ? i : -1).filter((i) => i >= 0 && !ringed.has(i));
        const line = (dash) => ({
          stroke,
          width: 2,
          dash,
          spanGaps: false,
          points: {
            show: !dash,
            size: 10,
            width: 2,
            stroke: theme.card,
            fill: stroke,
            filter: () => points
          }
        });
        const actual = forecast == null ? values : values.map((v, i) => i <= forecast ? v : null);
        const ahead = forecast == null ? null : values.map((v, i) => i >= forecast ? v : null);
        const bandFill = withAlpha(band?.color ? resolveColor(host, band.color) : stroke, 0.1);
        const bandLabel = band?.label;
        const drawUnder = (u) => {
          if (!lower || !upper) return;
          const ctx = u.ctx;
          const pr = uPlot2__default.default.pxRatio;
          const { left, width: w, top: t, height: h } = u.bbox;
          ctx.save();
          ctx.beginPath();
          ctx.rect(left, t, w, h);
          ctx.clip();
          ctx.fillStyle = bandFill;
          const y = (v) => u.valToPos(v, "y", true);
          if (typeof band?.lower === "number" && typeof band?.upper === "number") {
            ctx.fillRect(left, y(band.upper), w, y(band.lower) - y(band.upper));
          } else {
            let run = [];
            const flush = () => {
              if (run.length) {
                const x = (i) => u.valToPos(i, "x", true);
                ctx.beginPath();
                run.forEach((i, k) => k ? ctx.lineTo(x(i), y(upper[i])) : ctx.moveTo(x(i), y(upper[i])));
                for (const i of [...run].reverse()) ctx.lineTo(x(i), y(lower[i]));
                ctx.closePath();
                ctx.fill();
              }
              run = [];
            };
            for (let i = 0; i < n; i++) {
              if (lower[i] != null && upper[i] != null) run.push(i);
              else flush();
            }
            flush();
          }
          ctx.restore();
          if (bandLabel) {
            const at = n - 1 - [...lower].reverse().findIndex((v, k) => v != null && upper[n - 1 - k] != null);
            if (at < n) {
              ctx.save();
              ctx.font = `${theme.size.xs * pr}px ${theme.family}`;
              ctx.fillStyle = theme.mutedForeground;
              ctx.textAlign = "right";
              const below = y(lower[at]) + 3 * pr;
              const room = below + theme.size.xs * pr <= t + h;
              ctx.textBaseline = room ? "top" : "bottom";
              ctx.fillText(bandLabel, left + w - 4 * pr, room ? below : y(upper[at]) - 3 * pr);
              ctx.restore();
            }
          }
        };
        const lastOf = (vs) => vs.reduce((at, v, i) => v != null ? i : at, -1);
        const endLabels = named ? [{ name: name ?? "", values, stroke, main: true }, ...others.map((c) => ({ ...c, main: false }))] : [];
        const font = `600 ${theme.size.xs}px ${theme.family}`;
        const padRight = named ? Math.ceil(
          Math.max(
            0,
            ...endLabels.map((l) => {
              const m = document.createElement("canvas").getContext("2d");
              if (!m) return l.name.length * 7;
              m.font = font;
              return m.measureText(l.name).width;
            })
          )
        ) + 12 : void 0;
        const drawLabels = (u) => {
          if (!named) return;
          const ctx = u.ctx;
          const pr = uPlot2__default.default.pxRatio;
          const x = u.bbox.left + u.bbox.width + 6 * pr;
          const step = theme.size.xs * pr + 2 * pr;
          const placed = endLabels.map((l) => {
            const at = lastOf(l.values);
            return at < 0 ? null : { ...l, y: u.valToPos(l.values[at], "y", true) };
          }).filter((l) => l != null).sort((a, b) => a.y - b.y);
          for (let i = 1; i < placed.length; i++) placed[i].y = Math.max(placed[i].y, placed[i - 1].y + step);
          ctx.save();
          ctx.font = `600 ${theme.size.xs * pr}px ${theme.family}`;
          ctx.textBaseline = "middle";
          ctx.textAlign = "left";
          for (const l of placed) {
            ctx.fillStyle = l.main ? theme.foreground : l.stroke;
            ctx.fillText(l.name, x, l.y);
          }
          ctx.restore();
        };
        const draw = (u) => {
          drawLabels(u);
          if (!rings.length) return;
          const ctx = u.ctx;
          const pr = uPlot2__default.default.pxRatio;
          ctx.save();
          ctx.lineWidth = 1.5 * pr;
          for (const r of rings) {
            const v = values[r.index];
            if (v == null) continue;
            ctx.strokeStyle = r.color;
            ctx.beginPath();
            ctx.arc(u.valToPos(r.index, "x", true), u.valToPos(v, "y", true), 4.5 * pr, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        };
        const behind = others.map(
          (c) => ({ stroke: c.stroke, width: 2, spanGaps: false, points: { show: false } })
        );
        return {
          series: [...behind, ...ahead ? [line(), line([6, 4])] : [line()]],
          data: [...others.map((c) => c.values), ...ahead ? [actual, ahead] : [actual]],
          padRight,
          floor: scale.floor,
          ceiling,
          splits: gridlines.length ? gridlines : max != null ? fixedSplits(max) : scale.splits,
          format: (v) => fmt.current(v),
          crosshair: true,
          cursorPoints: true,
          drawUnder,
          draw
        };
      },
      [values, name, compareKey, named, color, max, gridlines, referenceValue, fmt, zero, lower, upper, band?.lower, band?.upper, band?.color, band?.label, forecast, highlightsKey, n]
    );
    const measured = values.filter((v) => v != null);
    const blank = measured.length === 0;
    const summary = React2__namespace.useMemo(() => {
      if (blank) return "Line chart with no measured periods.";
      const f = format;
      let top = 0;
      values.forEach((v, i) => {
        if (v != null && v > (values[top] ?? -Infinity)) top = i;
      });
      const lastIdx = forecast ?? values.reduce((at, v, i) => v != null ? i : at, -1);
      const parts = [
        `Line chart over ${values.length} periods, ${labels[0]} to ${labels[labels.length - 1]}.`,
        `Latest ${f(values[lastIdx])} on ${labels[lastIdx]}; highest ${f(values[top])} on ${labels[top]}.`
      ];
      const gaps = values.length - measured.length;
      if (gaps) parts.push(`${gaps} periods with nothing measured.`);
      if (forecast != null) parts.push(`Forecast from ${labels[forecast]}.`);
      if (band && typeof band.lower === "number" && typeof band.upper === "number")
        parts.push(`${band.label ?? "Band"} ${f(band.lower)} to ${f(band.upper)}.`);
      else if (band) parts.push(`${band.label ?? "A band"} shaded.`);
      if (highlights.length) parts.push(`Highlighted: ${highlights.map((h) => labels[h.index]).join(", ")}.`);
      const named2 = marks.filter((m) => m.label);
      if (named2.length) parts.push(`Marked: ${named2.map((m) => `${m.label} (${labels[m.index]})`).join(", ")}.`);
      if (reference) parts.push(`Reference ${reference.label} at ${f(reference.value)}.`);
      for (const c of compare) {
        const at = c.values.reduce((last, v, i) => v != null ? i : last, -1);
        if (at >= 0) parts.push(`Against ${c.name}: ${f(c.values[at])} on ${labels[at]}.`);
      }
      return parts.join(" ");
    }, [blank, values, labels, marks, reference, measured.length, format, forecast, band, highlights, compare]);
    const allMarks = React2__namespace.useMemo(
      () => forecast == null ? marks : [...marks, { index: forecast, label: forecastLabel }],
      [marks, forecast, forecastLabel]
    );
    const bandText = (i) => lower?.[i] != null && upper?.[i] != null ? `${format(lower[i])} \u2013 ${format(upper[i])}` : "";
    return /* @__PURE__ */ jsxRuntime.jsx(
      ChartFrame,
      {
        ref,
        summary,
        labels,
        height,
        ticks,
        marks: allMarks,
        reference,
        empty: blank ? empty ?? "Nothing measured in this period" : void 0,
        build,
        tooltip: (i) => ({
          title: labels[i],
          rows: [
            ...values[i] != null ? [{ key: "value", label: named ? name ?? "" : "", color, value: format(values[i]) }] : [],
            ...compare.flatMap(
              (c, k) => c.values[i] != null ? [{ key: `compare-${k}`, label: c.name, color: c.color ?? "var(--color-muted-foreground)", value: format(c.values[i]) }] : []
            )
          ],
          note: values[i] == null ? "nothing ran" : [
            forecast != null && i > forecast ? "forecast" : "",
            bandText(i) ? `${band?.label ?? "band"} ${bandText(i)}` : ""
          ].filter(Boolean).join(" \xB7 ") || void 0
        }),
        table: {
          columns: [
            { accessorKey: "period", header: "Period" },
            { accessorKey: "value", header: name ?? "Value" },
            ...compare.map((c, k) => ({ accessorKey: `compare${k}`, header: c.name })),
            ...band ? [{ accessorKey: "band", header: band.label ?? "Band" }] : []
          ],
          rows: values.map((v, i) => ({
            period: labels[i],
            value: v != null ? `${format(v)}${forecast != null && i > forecast ? " (forecast)" : ""}` : "\u2014",
            ...Object.fromEntries(compare.map((c, k) => [`compare${k}`, c.values[i] != null ? format(c.values[i]) : "\u2014"])),
            band: bandText(i) || "\u2014"
          }))
        },
        ...props
      }
    );
  }
);
LineChart.displayName = "LineChart";

// src/base/draw.ts
function topRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h));
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
}
var NONE2 = [];
var StackedBarChartV = React2__namespace.forwardRef(
  ({ data, series, max, gridlines = NONE2, height = 132, ticks, empty, ...props }, ref) => {
    const totals = React2__namespace.useMemo(
      () => data.map((d) => series.reduce((sum, s) => sum + (d.values[s.key] ?? 0), 0)),
      [data, series]
    );
    const blank = totals.every((t) => t === 0);
    const build = React2__namespace.useCallback(
      (_theme, host) => {
        const colors = series.map((s) => resolveColor(host, s.color));
        const scale = countScale(Math.max(0, ...totals));
        const ceiling = max ?? Math.max(scale.ceiling, ...gridlines);
        const draw = (u) => {
          const ctx = u.ctx;
          const pr = uPlot2__default.default.pxRatio;
          const slot = u.bbox.width / Math.max(data.length, 1);
          const width = Math.max(pr, Math.min(MAX_BAR_WIDTH * pr, slot * 0.72));
          const gap = SEGMENT_GAP * pr;
          const baseline = u.valToPos(0, "y", true);
          ctx.save();
          data.forEach((d, i) => {
            const x = Math.round(u.valToPos(i, "x", true) - width / 2);
            const parts = series.map((s, k) => ({ value: d.values[s.key] ?? 0, color: colors[k] })).filter((p) => p.value > 0);
            let sum = 0;
            let bottom = baseline;
            parts.forEach((p, j) => {
              sum += p.value;
              const top = u.valToPos(Math.min(sum, ceiling), "y", true);
              const last = j === parts.length - 1;
              const y = last ? top : Math.min(top + gap, bottom - pr);
              const h = Math.max(pr, bottom - y);
              ctx.fillStyle = p.color;
              if (last) topRoundedRect(ctx, x, y, width, h, BAR_RADIUS * pr);
              else ctx.fillRect(x, y, width, h);
              bottom = top;
            });
          });
          ctx.restore();
        };
        return {
          // One invisible series carries the totals, so the cursor has a value
          // to snap to on every day; the columns themselves are drawn above.
          series: [{ stroke: "transparent", paths: () => null, points: { show: false } }],
          data: [totals],
          ceiling,
          splits: gridlines.length ? gridlines : max != null ? fixedSplits(max) : scale.splits,
          format: formatCount,
          crosshair: false,
          draw
        };
      },
      [data, series, totals, max, gridlines]
    );
    const summary = React2__namespace.useMemo(() => {
      if (blank) return "Stacked column chart with nothing counted in this period.";
      const sums = series.map((s) => data.reduce((sum, d) => sum + (d.values[s.key] ?? 0), 0));
      const busiest = totals.indexOf(Math.max(...totals));
      return [
        `Stacked column chart over ${data.length} periods, ${data[0].label} to ${data[data.length - 1].label}.`,
        `Totals: ${series.map((s, k) => `${s.label} ${formatCount(sums[k])}`).join(", ")}.`,
        `Busiest: ${data[busiest].label} with ${formatCount(totals[busiest])}.`
      ].join(" ");
    }, [blank, data, series, totals]);
    return /* @__PURE__ */ jsxRuntime.jsx(
      ChartFrame,
      {
        ref,
        summary,
        labels: data.map((d) => d.label),
        height,
        ticks,
        legend: series,
        empty: blank ? empty ?? "Nothing counted in this period" : void 0,
        build,
        tooltip: (i) => ({
          title: data[i].label,
          rows: series.map((s) => ({
            key: s.key,
            label: s.label,
            color: s.color,
            value: formatCount(data[i].values[s.key] ?? 0)
          }))
        }),
        table: {
          columns: [
            { accessorKey: "period", header: "Period" },
            ...series.map((s) => ({ accessorKey: s.key, header: s.label })),
            { accessorKey: "__total", header: "Total" }
          ],
          rows: data.map((d, i) => ({
            period: d.label,
            ...Object.fromEntries(series.map((s) => [s.key, formatCount(d.values[s.key] ?? 0)])),
            __total: formatCount(totals[i])
          }))
        },
        ...props
      }
    );
  }
);
StackedBarChartV.displayName = "StackedBarChartV";
var NONE3 = [];
var FILL_ALPHA = 0.78;
var StackedAreaChart = React2__namespace.forwardRef(
  ({
    data,
    series,
    marks = NONE3,
    markLegend,
    format = formatCount,
    max,
    gridlines = NONE3,
    ticks,
    height = 200,
    directLabels,
    empty,
    ...props
  }, ref) => {
    const fmt = useLatest(format);
    const labelled = directLabels ?? series.length <= 4;
    const stack = React2__namespace.useMemo(() => {
      const sums = data.map(() => 0);
      return series.map(
        (s) => data.map((d, i) => {
          sums[i] += d.values[s.key] ?? 0;
          return sums[i];
        })
      );
    }, [data, series]);
    const totals = stack.length ? stack[stack.length - 1] : data.map(() => 0);
    const blank = totals.every((t) => t === 0);
    const build = React2__namespace.useCallback(
      (theme, host) => {
        const colors = series.map((s) => resolveColor(host, s.color));
        const scale = niceScale(Math.max(0, ...totals));
        const ceiling = max ?? Math.max(scale.ceiling, ...gridlines);
        const stepped = uPlot2__default.default.paths.stepped({ align: 1 });
        const last = data.length - 1;
        const uSeries = series.map((_, k) => ({
          stroke: theme.card,
          width: 2,
          paths: stepped,
          points: { show: false },
          // The bottom band fills to the baseline; every other band is a
          // `bands` entry filling down to the band beneath it.
          fill: k === 0 ? withAlpha(colors[0], FILL_ALPHA) : void 0
        }));
        const bands = series.slice(1).map((_, j) => ({
          series: [j + 2, j + 1],
          fill: withAlpha(colors[j + 1], FILL_ALPHA)
        }));
        const measure2 = document.createElement("canvas").getContext("2d");
        let padRight = 4;
        if (labelled && measure2) {
          measure2.font = `600 ${theme.font.xs}`;
          padRight = Math.ceil(Math.max(0, ...series.map((s) => measure2.measureText(s.label).width))) + 20;
        }
        const draw = (u) => {
          if (!labelled || last < 0) return;
          const ctx = u.ctx;
          const pr = uPlot2__default.default.pxRatio;
          const x = u.bbox.left + u.bbox.width + 6 * pr;
          const line = theme.size.xs * pr + 2 * pr;
          const placed = series.map((s, k) => {
            const top = stack[k][last];
            const bottom = k ? stack[k - 1][last] : 0;
            return { s, k, empty: top === bottom, y: u.valToPos((top + bottom) / 2, "y", true) };
          }).filter((p) => !p.empty).sort((a, b) => b.y - a.y);
          ctx.save();
          ctx.font = `600 ${theme.size.xs * pr}px ${theme.family}`;
          ctx.textBaseline = "middle";
          ctx.textAlign = "left";
          let prev = Infinity;
          for (const p of placed) {
            if (prev - p.y < line) continue;
            ctx.fillStyle = colors[p.k];
            ctx.fillRect(x, Math.round(p.y - pr), 6 * pr, 2 * pr);
            ctx.fillStyle = theme.foreground;
            ctx.fillText(p.s.label, x + 10 * pr, p.y);
            prev = p.y;
          }
          ctx.restore();
        };
        return {
          series: uSeries,
          data: stack,
          bands,
          ceiling,
          splits: gridlines.length ? gridlines : max != null ? fixedSplits(max) : scale.splits,
          format: (v) => fmt.current(v),
          crosshair: true,
          cursorPoints: false,
          draw,
          padRight
        };
      },
      [data, series, stack, totals, max, gridlines, labelled, fmt]
    );
    const legend = [
      ...series,
      ...marks.length && markLegend ? [{ key: "__mark", label: markLegend, color: "var(--color-muted-foreground)", kind: "dashed" }] : []
    ];
    const summary = React2__namespace.useMemo(() => {
      if (blank) return "Stacked area chart with nothing recorded in this period.";
      const last = data.length - 1;
      return [
        `Stacked area chart over ${data.length} periods, ${data[0].label} to ${data[last].label}.`,
        `${format(totals[0])} at the start, ${format(totals[last])} at the end.`,
        `At the end: ${series.map((s) => `${s.label} ${format(data[last].values[s.key] ?? 0)}`).join(", ")}.`,
        marks.length ? `Writes marked: ${marks.map((m) => `${m.label} (${data[m.index]?.label})`).join(", ")}.` : ""
      ].filter(Boolean).join(" ");
    }, [blank, data, series, totals, marks, format]);
    return /* @__PURE__ */ jsxRuntime.jsx(
      ChartFrame,
      {
        ref,
        summary,
        labels: data.map((d) => d.label),
        height,
        ticks,
        marks,
        legend,
        empty: blank ? empty ?? "Nothing recorded in this period" : void 0,
        build,
        tooltip: (i) => ({
          title: data[i].label,
          // Top-down, the order the bands are read in.
          rows: [...series].reverse().map((s) => ({
            key: s.key,
            label: s.label,
            color: s.color,
            value: format(data[i].values[s.key] ?? 0)
          })),
          note: `${format(totals[i])} in all`
        }),
        table: {
          columns: [
            { accessorKey: "period", header: "Period" },
            ...series.map((s) => ({ accessorKey: s.key, header: s.label })),
            { accessorKey: "__total", header: "Total" }
          ],
          rows: data.map((d, i) => ({
            period: d.label,
            ...Object.fromEntries(series.map((s) => [s.key, format(d.values[s.key] ?? 0)])),
            __total: format(totals[i])
          }))
        },
        ...props
      }
    );
  }
);
StackedAreaChart.displayName = "StackedAreaChart";
var Sparkline = React2__namespace.forwardRef(
  ({
    values,
    width = 72,
    height = 20,
    color = "var(--color-data-1)",
    area,
    strokeWidth = 2,
    endMarker = true,
    label,
    className,
    ...props
  }, ref) => {
    const pad = 3;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const stepX = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
    const points = values.map((v, i) => [
      pad + i * stepX,
      height - pad - (v - min) / span * (height - pad * 2)
    ]);
    const d = points.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
    const last = points[points.length - 1];
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "svg",
      {
        ref,
        width,
        height,
        viewBox: `0 0 ${width} ${height}`,
        className: ui.cn("shrink-0 overflow-visible", className),
        role: label ? "img" : void 0,
        "aria-label": label,
        "aria-hidden": label ? void 0 : true,
        ...props,
        children: [
          area ? /* @__PURE__ */ jsxRuntime.jsx(
            "path",
            {
              d: `${d} L${last[0]} ${height} L${points[0][0]} ${height} Z`,
              fill: color,
              opacity: 0.1
            }
          ) : null,
          /* @__PURE__ */ jsxRuntime.jsx(
            "path",
            {
              d,
              fill: "none",
              stroke: color,
              strokeWidth,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          endMarker ? /* @__PURE__ */ jsxRuntime.jsx(
            "circle",
            {
              cx: last[0],
              cy: last[1],
              r: 4,
              fill: color,
              stroke: "var(--color-card)",
              strokeWidth: 2
            }
          ) : null
        ]
      }
    );
  }
);
Sparkline.displayName = "Sparkline";
var TONE = {
  primary: "bg-primary",
  muted: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive"
};
var percent = (v) => `${Math.round(v * 100)}%`;
var InlineMeter = React2__namespace.forwardRef(
  ({ value, max = 1, format = percent, tone = "primary", color, label, className, ...props }, ref) => {
    const none = value == null || value <= 0;
    const share = none ? 0 : Math.min(1, value / (max || 1));
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        role: none ? void 0 : "meter",
        "aria-label": label,
        "aria-valuenow": none ? void 0 : value,
        "aria-valuemin": none ? void 0 : 0,
        "aria-valuemax": none ? void 0 : max,
        className: ui.cn("flex min-w-0 items-center gap-2", className),
        ...props,
        children: [
          none ? null : /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: ui.cn("block h-full rounded-full", color ? void 0 : TONE[tone]),
              style: { width: `${share * 100}%`, background: color }
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm tabular-nums text-muted-foreground", children: none ? "\u2014" : format(value) })
        ]
      }
    );
  }
);
InlineMeter.displayName = "InlineMeter";
var whole2 = new Intl.NumberFormat();
var SegmentedBar = React2__namespace.forwardRef(
  ({ values, series, format = (v) => whole2.format(v), className, ...props }, ref) => {
    const total = series.reduce((sum, s) => sum + Math.max(0, values[s.key] ?? 0), 0);
    const parts = series.map((s) => ({ ...s, value: Math.max(0, values[s.key] ?? 0) })).filter((p) => p.value > 0);
    const pct = (v) => `${Math.round(v / total * 100)}%`;
    const summary = total ? parts.map((p) => `${p.label} ${pct(p.value)}`).join(", ") : "nothing counted";
    return /* @__PURE__ */ jsxRuntime.jsx(ui.TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        role: "img",
        "aria-label": summary,
        className: ui.cn(
          "flex h-2 w-full min-w-16 gap-[2px] overflow-hidden rounded-full",
          total === 0 && "bg-muted",
          className
        ),
        ...props,
        children: parts.map((p) => /* @__PURE__ */ jsxRuntime.jsxs(ui.Tooltip, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "h-full min-w-[2px]",
              style: { flexGrow: p.value, flexBasis: 0, background: p.color }
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.TooltipContent, { children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "tabular-nums", children: [
            p.label,
            " \xB7 ",
            format(p.value),
            " \xB7 ",
            pct(p.value)
          ] }) })
        ] }, p.key))
      }
    ) });
  }
);
SegmentedBar.displayName = "SegmentedBar";
var SegmentedBarLegend = React2__namespace.forwardRef(
  ({ series, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(ui.Legend, { ref, ...props, children: series.map((s) => /* @__PURE__ */ jsxRuntime.jsx(ui.LegendItem, { color: s.color, label: s.label }, s.key)) })
);
SegmentedBarLegend.displayName = "SegmentedBarLegend";
var MARK = {
  refused: "bg-destructive",
  egress: "bg-warning"
};
var HeatLane = React2__namespace.forwardRef(
  ({ values, marks, pinned, onPin, cellLabel, fill = "bg-info", stale, className, style, ...props }, ref) => {
    const markAt = React2__namespace.useMemo(() => new Map((marks ?? []).map((m) => [m.at, m.kind])), [marks]);
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: ui.cn("grid h-3 gap-px", stale && "opacity-40 grayscale", className),
        style: { gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`, ...style },
        ...props,
        children: values.map((v, i) => {
          const mark = markAt.get(i);
          const label = `${cellLabel ? cellLabel(i) : i}${mark ? ` \xB7 ${mark}` : v == null ? " \xB7 not touched" : ""}`;
          const cls = ui.cn(
            "block h-full min-w-0 rounded-[1px]",
            mark ? MARK[mark] : v == null ? "border border-border" : v === 0 ? "bg-muted" : fill,
            pinned === i && "ring-1 ring-foreground ring-offset-1 ring-offset-background"
          );
          const opacity = mark || v == null || v === 0 ? void 0 : Math.max(0.18, Math.min(1, v));
          return onPin && v != null ? /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              title: label,
              "aria-label": label,
              "aria-pressed": pinned === i,
              className: ui.cn(cls, "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"),
              style: { opacity },
              onClick: () => onPin(pinned === i ? null : i)
            },
            i
          ) : /* @__PURE__ */ jsxRuntime.jsx("span", { title: label, className: cls, style: { opacity } }, i);
        })
      }
    );
  }
);
HeatLane.displayName = "HeatLane";
var BarChartH = React2__namespace.forwardRef(
  ({
    data,
    max,
    labelWidth,
    color = "var(--color-data-1)",
    caption,
    variant = "tips",
    negativeColor = "var(--color-destructive)",
    diverging,
    className,
    ...props
  }, ref) => {
    if (variant === "ranked") {
      const ceiling2 = max ?? (Math.max(...data.map((d) => Math.abs(d.value)), 0) || 1);
      const share = (d) => Math.min(100, Math.abs(d.value) / ceiling2 * 100);
      const fill = (d) => d.color ?? (d.muted ? "color-mix(in srgb, var(--color-muted-foreground) 40%, transparent)" : d.value < 0 ? negativeColor : color);
      const columns = labelWidth != null ? { gridTemplateColumns: `${labelWidth}px minmax(0, 1fr) 40px` } : void 0;
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: ui.cn("@container flex flex-col gap-1.5", className), ...props, children: [
        caption != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: caption }) : null,
        data.map((d, i) => /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: ui.cn(
              "grid items-center gap-[7px] text-sm",
              labelWidth == null && "grid-cols-[96px_minmax(0,1fr)_40px] @max-[290px]:grid-cols-[74px_minmax(0,1fr)_36px]"
            ),
            style: columns,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: ui.cn("min-w-0 truncate", d.muted && "text-muted-foreground"), children: d.label }),
              diverging ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "relative block h-2 before:absolute before:-inset-y-[3px] before:left-1/2 before:border-l before:border-border", children: /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  title: `${d.label}: ${d.display ?? d.value}`,
                  className: "absolute top-0 h-2 rounded-[1px] opacity-85",
                  style: {
                    left: d.value < 0 ? `${50 - share(d) / 2}%` : "50%",
                    width: `${share(d) / 2}%`,
                    background: fill(d)
                  }
                }
              ) }) : /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  title: `${d.label}: ${d.display ?? d.value}`,
                  className: "h-2 rounded-[1px] opacity-85",
                  style: { width: `${share(d)}%`, background: fill(d) }
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-end font-mono text-xs tabular-nums", children: d.display ?? d.value })
            ]
          },
          i
        )),
        diverging ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: diverging.below }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "0" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: diverging.above })
        ] }) : null
      ] });
    }
    const ceiling = max ?? (Math.max(...data.map((d) => d.value), 0) || 1);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: ui.cn("flex flex-col gap-1", className), ...props, children: [
      caption != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: caption }) : null,
      data.map((d, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex h-4 items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: "shrink-0 truncate text-sm text-muted-foreground",
            style: { width: labelWidth ?? 78 },
            children: d.label
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex min-w-0 flex-1 items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              title: `${d.label}: ${d.display ?? d.value}`,
              className: "h-2.5 shrink-0 rounded-e-[4px]",
              style: {
                width: `${Math.max(0, d.value / ceiling * 100)}%`,
                background: d.color ?? color
              }
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "shrink-0 text-sm tabular-nums", children: d.display ?? d.value })
        ] })
      ] }, i))
    ] });
  }
);
BarChartH.displayName = "BarChartH";
var isGrouped = (d) => "values" in d && Array.isArray(d.values);
var BarChartV = React2__namespace.forwardRef(
  ({
    data,
    series,
    max,
    gridlines = [],
    target,
    height = 160,
    color = "var(--color-data-1)",
    highlightColor,
    highlightIndex,
    labelMode = "last",
    caption,
    variant = "default",
    planLabel,
    className,
    ...props
  }, ref) => {
    const grouped = data.some(isGrouped);
    const seriesColor = (k) => series?.[k]?.color ?? (k === 0 ? color : `var(--color-data-${k + 1})`);
    const emphasis = highlightIndex === void 0 ? grouped ? void 0 : data.length - 1 : highlightIndex ?? void 0;
    const marks = data.map(
      (d, i) => isGrouped(d) ? d.values.map((value, k) => ({
        value,
        display: d.display?.[k] ?? value,
        color: seriesColor(k)
      })) : [
        {
          plan: d.plan,
          value: d.value,
          display: d.display ?? d.value,
          color: i === emphasis ? highlightColor ?? color : color
        }
      ]
    );
    const largest = Math.max(
      0,
      ...marks.flat().map((m) => Math.max(m.value, m.plan ?? 0)),
      target?.value ?? 0
    );
    const planned = marks.some((g) => g.some((m) => m.plan != null));
    const ceiling = max ?? (largest || 1);
    const labelled = (i) => labelMode === "all" || labelMode === "last" && i === emphasis;
    const at = (v) => `${v / ceiling * 100}%`;
    const comparison = variant === "comparison";
    const legend = series != null && series.length > 1 || planned && planLabel != null;
    const rules = [
      ...gridlines.map((g) => ({ key: `g${g}`, value: g, label: g })),
      // With a legend the target is named there, and a gutter label would only
      // take width from the plot.
      ...target?.label != null && !legend ? [{ key: "target", value: target.value, label: target.label }] : []
    ];
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: ui.cn("flex flex-col gap-1", className), ...props, children: [
      caption != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: caption }) : null,
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-y-1", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", style: { height }, children: [
          gridlines.map((g) => /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              "aria-hidden": true,
              className: "absolute inset-x-0 h-px bg-border",
              style: { bottom: at(g) }
            },
            g
          )),
          comparison ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, className: "absolute inset-x-0 bottom-0 h-px bg-border" }) : null,
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute inset-0 flex items-end justify-between gap-2", children: marks.map((group, i) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-full min-w-0 flex-1 justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: ui.cn(
                "flex h-full min-w-0 items-end justify-center gap-0.5",
                comparison ? "w-2/3" : "w-full"
              ),
              children: group.map((m, k) => /* @__PURE__ */ jsxRuntime.jsxs(
                "div",
                {
                  className: ui.cn(
                    "relative flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1",
                    !comparison && "max-w-6"
                  ),
                  children: [
                    m.plan != null ? /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        "aria-hidden": true,
                        className: "absolute inset-x-0 bottom-0 border border-dashed border-muted-foreground",
                        style: { height: `${Math.max(0, m.plan / ceiling * 100)}%` }
                      }
                    ) : null,
                    labelled(i) ? /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        className: ui.cn(
                          "text-sm whitespace-nowrap tabular-nums",
                          comparison && "text-muted-foreground"
                        ),
                        children: m.display
                      }
                    ) : null,
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        title: `${textOf(data[i].label)}: ${textOf(m.display)}`,
                        className: ui.cn(
                          m.plan != null ? "relative w-2/3" : "w-full",
                          !comparison && "rounded-t-[4px]"
                        ),
                        style: {
                          height: `${Math.max(0, m.value / ceiling * 100)}%`,
                          background: m.color,
                          opacity: emphasis == null || i === emphasis ? 1 : 0.55
                        }
                      }
                    )
                  ]
                },
                k
              ))
            }
          ) }, i)) }),
          target ? /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              "aria-hidden": true,
              className: "absolute inset-x-0 border-t border-dashed",
              style: {
                bottom: at(target.value),
                borderColor: target.color ?? "var(--color-muted-foreground)"
              }
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", children: [
          rules.map((r) => /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              "aria-hidden": true,
              className: "invisible block h-0 pl-1 text-sm whitespace-nowrap",
              children: r.label
            },
            r.key
          )),
          rules.map((r) => /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "absolute left-0 translate-y-1/2 pl-1 text-sm whitespace-nowrap tabular-nums text-muted-foreground",
              style: { bottom: at(r.value) },
              children: r.label
            },
            r.key
          ))
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex justify-between gap-2", children: data.map((d, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex min-w-0 flex-1 flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate text-sm text-muted-foreground", children: d.label }),
          d.sublabel != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate text-sm text-muted-foreground/70", children: d.sublabel }) : null
        ] }, i)) })
      ] }),
      legend ? /* @__PURE__ */ jsxRuntime.jsxs(ui.Legend, { children: [
        (series ?? []).map((s, k) => /* @__PURE__ */ jsxRuntime.jsx(ui.LegendItem, { kind: "box", color: seriesColor(k), label: s.name }, k)),
        planned && planLabel != null ? /* @__PURE__ */ jsxRuntime.jsx(ui.LegendItem, { kind: "outline", color: "var(--color-muted-foreground)", label: planLabel }) : null,
        target?.label != null ? /* @__PURE__ */ jsxRuntime.jsx(
          ui.LegendItem,
          {
            kind: "dashed",
            color: target.color ?? "var(--color-muted-foreground)",
            label: target.label
          }
        ) : null
      ] }) : null
    ] });
  }
);
BarChartV.displayName = "BarChartV";
function textOf(node) {
  return typeof node === "string" || typeof node === "number" ? String(node) : "";
}
var DivergingBar = React2__namespace.forwardRef(
  ({
    data,
    max,
    labelWidth = 104,
    positiveColor = "var(--color-success)",
    negativeColor = "var(--color-destructive)",
    caption,
    className,
    ...props
  }, ref) => {
    const ceiling = max ?? (Math.max(...data.map((d) => Math.abs(d.value)), 0) || 1);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: ui.cn("flex flex-col gap-1", className), ...props, children: [
      caption != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-muted-foreground", children: caption }) : null,
      data.map((d, i) => {
        const positive = d.value >= 0;
        const width = `${Math.abs(d.value) / ceiling * 50}%`;
        return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex h-4 items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "shrink-0 truncate text-sm text-muted-foreground",
              style: { width: labelWidth },
              children: d.label
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "relative flex min-w-0 flex-1 items-center", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                "aria-hidden": true,
                className: "absolute left-1/2 h-4 w-px -translate-x-1/2 bg-border"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex w-1/2 justify-end", children: !positive ? /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                title: `${d.label}: ${d.display ?? d.value}`,
                className: "h-2.5 rounded-s-[4px]",
                style: { width, background: negativeColor }
              }
            ) : null }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex w-1/2 justify-start", children: positive ? /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                title: `${d.label}: ${d.display ?? d.value}`,
                className: "h-2.5 rounded-e-[4px]",
                style: { width, background: positiveColor }
              }
            ) : null })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w-8 shrink-0 text-right text-sm tabular-nums", children: d.display ?? (d.value > 0 ? `+${d.value}` : d.value) })
        ] }, i);
      })
    ] });
  }
);
DivergingBar.displayName = "DivergingBar";
var INDENT = 12;
var everyRow = (rows) => rows.flatMap((r) => [r, ...everyRow(r.children ?? [])]);
function Cells({
  cells,
  byKey,
  cellSize,
  className
}) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: ui.cn("flex gap-1", className), children: cells.map((c, i) => {
    const s = byKey.get(c.state);
    return /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        title: `${c.at} \xB7 ${s?.label ?? c.state}${c.detail ? ` \xB7 ${c.detail}` : ""}`,
        className: ui.cn("shrink-0 rounded-[2px]", s?.hollow && "border"),
        style: {
          width: cellSize,
          height: cellSize,
          background: s?.hollow ? "transparent" : s?.color ?? "var(--color-muted)",
          borderColor: s?.hollow ? s.color ?? "var(--color-border)" : void 0
        }
      },
      i
    );
  }) });
}
function Ticks({
  count,
  ticks,
  cellSize,
  className
}) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: ui.cn("flex gap-1", className), "aria-hidden": true, children: Array.from({ length: count }, (_, i) => {
    const tick = ticks.find((t) => t.at === i);
    return /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        className: "shrink-0 text-sm tabular-nums text-muted-foreground",
        style: { width: cellSize },
        children: tick ? tick.label : ""
      },
      i
    );
  }) });
}
var HeatStrip = React2__namespace.forwardRef(
  ({
    cells,
    rows,
    states,
    ticks,
    cellSize = 14,
    labelWidth,
    expanded,
    defaultExpanded,
    onExpandedChange,
    className,
    ...props
  }, ref) => {
    const byKey = React2__namespace.useMemo(
      () => new Map(states.map((s) => [s.key, s])),
      [states]
    );
    const parents = everyRow(rows ?? []).filter((r) => r.children?.length).map((r) => r.key);
    const nested = parents.length > 0;
    const { isOpen, toggle } = ui.useExpandedKeys({
      expanded,
      defaultExpanded,
      onExpandedChange,
      keys: parents
    });
    const shown = [];
    const walk = (list, depth) => {
      for (const row of list) {
        shown.push({ row, depth });
        if (row.children?.length && isOpen(row.key)) walk(row.children, depth + 1);
      }
    };
    walk(rows ?? [], 0);
    const count = Math.max(cells?.length ?? 0, ...shown.map((r) => r.row.cells.length));
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref, className: ui.cn("flex flex-col gap-1.5", className), ...props, children: [
      rows ? /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: "grid items-center gap-x-2 gap-y-1",
          style: {
            gridTemplateColumns: `${labelWidth != null ? `${labelWidth}px` : "fit-content(40%)"} minmax(0, 1fr)`
          },
          children: [
            shown.map(({ row, depth }) => {
              const kids = (row.children?.length ?? 0) > 0;
              const open = kids && isOpen(row.key);
              return /* @__PURE__ */ jsxRuntime.jsxs(React2__namespace.Fragment, { children: [
                /* @__PURE__ */ jsxRuntime.jsxs(
                  "span",
                  {
                    className: ui.cn("flex min-w-0 items-center gap-1 text-sm", depth > 0 && "text-muted-foreground"),
                    style: { paddingLeft: depth * INDENT },
                    children: [
                      kids ? /* @__PURE__ */ jsxRuntime.jsx(
                        ui.ExpandToggle,
                        {
                          open,
                          label: typeof row.label === "string" ? row.label : row.key,
                          onClick: () => toggle(row.key)
                        }
                      ) : nested ? /* @__PURE__ */ jsxRuntime.jsx(ui.ExpandToggle.Spacer, {}) : null,
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 truncate", children: row.label })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Cells,
                  {
                    cells: row.cells,
                    byKey,
                    cellSize,
                    className: "min-w-0 overflow-hidden"
                  }
                )
              ] }, row.key);
            }),
            ticks?.length ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", {}),
              /* @__PURE__ */ jsxRuntime.jsx(Ticks, { count, ticks, cellSize, className: "min-w-0 overflow-hidden" })
            ] }) : null
          ]
        }
      ) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(Cells, { cells: cells ?? [], byKey, cellSize, className: "flex-wrap" }),
        ticks?.length ? /* @__PURE__ */ jsxRuntime.jsx(Ticks, { count, ticks, cellSize, className: "flex-wrap" }) : null
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm", children: states.map((s) => /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            "aria-hidden": true,
            className: ui.cn("size-2.5 shrink-0 rounded-[2px]", s.hollow && "border"),
            style: {
              background: s.hollow ? "transparent" : s.color ?? "var(--color-muted)",
              borderColor: s.hollow ? s.color ?? "var(--color-border)" : void 0
            }
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: s.label })
      ] }, s.key)) })
    ] });
  }
);
HeatStrip.displayName = "HeatStrip";

exports.BarChartH = BarChartH;
exports.BarChartV = BarChartV;
exports.DivergingBar = DivergingBar;
exports.HeatLane = HeatLane;
exports.HeatStrip = HeatStrip;
exports.InlineMeter = InlineMeter;
exports.LineChart = LineChart;
exports.SegmentedBar = SegmentedBar;
exports.SegmentedBarLegend = SegmentedBarLegend;
exports.Sparkline = Sparkline;
exports.StackedAreaChart = StackedAreaChart;
exports.StackedBarChartV = StackedBarChartV;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map