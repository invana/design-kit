import * as React from 'react';
import { LegendSwatchKind, LegendProps, ExpandedKeys } from '@invana/ui';

/**
 * The frame every uPlot chart sits in. Internal — the package exports charts,
 * not this.
 *
 * uPlot owns the scales, the canvas, the y axis and the cursor. Everything a
 * reader reads as text — the period ticks, the tooltip, the legend, the table
 * view — is DOM composed from `@invana/ui`, so it sets in the same type as the
 * panel around it and never scales with a canvas.
 *
 * The x axis runs from -½ to n-½: every period owns one equal slot with its
 * point or column in the middle, so a line and a column chart of the same days
 * line up when they sit side by side, and a single period sits centred rather
 * than on an edge.
 */

interface ChartMark {
    /** The period the mark sits on. */
    index: number;
    /** Named above the rule. Without one the rule stands alone — a boundary, not an event. */
    label?: string;
}
interface ChartReference {
    /** Where the rule sits, on the chart's own axis. */
    value: number;
    label: string;
}
interface LegendEntry {
    key: string;
    label: string;
    /** The series colour, as CSS — `var(--color-data-3)`. */
    color: string;
    kind?: LegendSwatchKind;
}

/**
 * One measure over time, with the moments that might explain it marked on the
 * axis — a plan's work p50 a day, with each version's publish.
 *
 * One series and one axis, so no legend: the panel's title names what is
 * plotted. A day with no value breaks the line rather than drawing it to zero,
 * because *nothing ran* is not *it took no time*; a measured day between two
 * gaps draws as a point, so it is not lost. A mark is a dashed rule with its
 * label at the top — an event, not a value. A reference is a dashed rule with
 * its label at the right — a line to compare against, such as the Graph's p95.
 * Hover (or the arrow keys) reads the nearest day.
 *
 * A band shades the range the line is judged against — a normal range, or a
 * forecast's interval — under the line. A highlight rings a period that stands
 * out, in its own colour, without a label: whatever sits beside the chart says
 * why. After `forecastFrom` the line is dashed, with an unlabelled rule at the
 * boundary unless `forecastLabel` names it. A measure that never nears zero can
 * drop the zero baseline (`zero={false}`), so its movement is not flattened.
 */

type LineChartMark = ChartMark;
type LineChartReference = ChartReference;
interface LineChartBand {
    /** The bottom edge: one value across the plot, or one per period (`null` leaves a gap). */
    lower: number | (number | null)[];
    upper: number | (number | null)[];
    /** Named below the band's right end — `normal range`. */
    label?: string;
    /** A CSS colour or token. Default: the line's. */
    color?: string;
}
interface LineChartHighlight {
    /** The period ringed. */
    index: number;
    /** A CSS colour or token — `var(--color-warning)`. Default: the line's. */
    color?: string;
}
/** A line read against the main one — last year beside this — drawn behind it. */
interface LineChartSeries {
    /** Named at the line's right end, in the hover and in the table. */
    name: string;
    /** One per period, as `values`; `null` where nothing was measured. */
    values: (number | null)[];
    /** A CSS colour or token. Default: the muted foreground. */
    color?: string;
}
interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** One per period; `null` where nothing was measured. */
    values: (number | null)[];
    /**
     * The main line's name. Needed once there is a `compare`: every line is then
     * named at its right end, where it finishes, instead of in a legend.
     */
    name?: string;
    /** Lines to read the main one against, drawn behind it without its marks or forecast. */
    compare?: LineChartSeries[];
    /** One per period — what the hover and a tick name it. */
    labels: string[];
    /** How a value is written on the axis and in the hover — `6.0s`. */
    format?: (value: number) => string;
    /** Fixes the scale. Defaults to a clean step above the largest value. */
    max?: number;
    /** Values to draw a hairline at. Default: 0 and every clean step to the top. */
    gridlines?: number[];
    marks?: LineChartMark[];
    /** A value to compare against, drawn as a dashed rule labelled at the right. */
    reference?: LineChartReference;
    /** A range shaded under the line. */
    band?: LineChartBand;
    /** Periods ringed because they stand out. */
    highlights?: LineChartHighlight[];
    /** The last actual period — the one the forecast runs from. The line is dashed after it. */
    forecastFrom?: number;
    /** Names the rule at `forecastFrom` — `today`. */
    forecastLabel?: string;
    /** Start the axis at 0. Default: true. */
    zero?: boolean;
    /** Which periods name themselves under the axis. Default: the first and the last. */
    ticks?: number[];
    /** The plot's height in px. */
    height?: number;
    /** A CSS colour or token — `var(--color-primary)`. */
    color?: string;
    /** Shown in place of the plot when no period has a value. */
    empty?: React.ReactNode;
}
declare const LineChart: React.ForwardRefExoticComponent<LineChartProps & React.RefAttributes<HTMLDivElement>>;

/**
 * Counts over days, split into the parts that make them up — `served` and
 * `failed` in each day's runs, or a model's queries by caller.
 *
 * Vertical because the x-axis is time. The parts stack bottom-up in `series`
 * order with a 2px surface gap between them, and only the top of a column is
 * rounded, so a stack reads as one count cut into pieces rather than as bars
 * balanced on each other. A day with nothing draws nothing: a zero is a gap,
 * not a sliver.
 *
 * The floors: the count axis never tops out below five, so one run on a quiet
 * day is a short column, not a full-height one; a column is never wider than
 * 24px, however few days there are; and a window where every day is zero shows
 * that it is empty rather than an axis of zeros.
 *
 * Every column answers a hover with its day and each part's count; the hover
 * target is the day's whole slot, not the painted bar. Two or more series
 * always carry a legend, inside the chart, because identity is never colour
 * alone; the axis labels are sparse (`ticks`), because thirty dates under
 * thirty columns is texture.
 */

interface StackSeries {
    key: string;
    label: string;
    /** A token — `var(--color-success)`. Status tokens only for status series. */
    color: string;
}
interface StackedColumnDatum {
    /** The period, as the tooltip and a tick name it — `17 Sep`. */
    label: string;
    /** The count per series `key`. A missing key is 0. */
    values: Record<string, number>;
}
interface StackedBarChartVProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: StackedColumnDatum[];
    series: StackSeries[];
    /** Fixes the scale. Defaults to a clean step above the tallest column, and never below 5. */
    max?: number;
    /** Values to draw a hairline at — `[20, 40, 60]`. */
    gridlines?: number[];
    /** The plot's height in px. */
    height?: number;
    /** Which columns name their period under the axis. Default: the first and the last. */
    ticks?: number[];
    /** Shown in place of the plot when every column is zero. */
    empty?: React.ReactNode;
}
declare const StackedBarChartV: React.ForwardRefExoticComponent<StackedBarChartVProps & React.RefAttributes<HTMLDivElement>>;

/**
 * Totals over time, split into the parts that make them up — records over time
 * by model, or by node type inside one model.
 *
 * The paths are stepped: a record count only moves where a write happened, so
 * the edge stays flat between writes and rises in one step at the write rather
 * than sloping across days that changed nothing. Each write is marked — a
 * dashed rule with its label at the top, `import` or `stitch commit` — because
 * the step is the event and the mark says which one.
 *
 * The parts stack bottom-up in `series` order, which is fixed: a model keeps its
 * band and its colour whatever its size, so a filter or a re-sort never
 * repaints the survivors. Bands are separated by a 2px surface line rather than
 * outlined. Up to four series are also named at the right edge, beside their
 * band; a name that would collide with its neighbour is left to the legend,
 * which is always there for two or more series. A series with nothing in it has
 * no band and no direct label, but keeps its legend entry.
 */

interface AreaSeries {
    key: string;
    label: string;
    /** A token — `var(--color-data-1)`. */
    color: string;
}
interface StackedAreaDatum {
    /** The period, as the tooltip and a tick name it — `17 Sep`. */
    label: string;
    /** The total per series `key` at the end of the period. A missing key is 0. */
    values: Record<string, number>;
}
interface StackedAreaChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: StackedAreaDatum[];
    series: AreaSeries[];
    /** The writes that moved the totals — each import, each stitch commit. */
    marks?: ChartMark[];
    /** Names the marks in the legend — `a write — an import or a stitch commit`. */
    markLegend?: string;
    /** How a value is written on the axis and in the hover. Default: `1,284` / `12.9K`. */
    format?: (value: number) => string;
    /** Fixes the scale. Defaults to a clean step above the tallest stack. */
    max?: number;
    /** Values to draw a hairline at. Default: 0 and every clean step to the top. */
    gridlines?: number[];
    /** Which periods name themselves under the axis. Default: the first and the last. */
    ticks?: number[];
    /** The plot's height in px. */
    height?: number;
    /** Name each band at the right edge. Default: on for four series or fewer. */
    directLabels?: boolean;
    /** Shown in place of the plot when every period is zero. */
    empty?: React.ReactNode;
}
declare const StackedAreaChart: React.ForwardRefExoticComponent<StackedAreaChartProps & React.RefAttributes<HTMLDivElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, "children" | "values"> {
    values: number[];
    width?: number;
    height?: number;
    color?: string;
    /** Washes the area under the line at 10%. Off by default at this size. */
    area?: boolean;
    /** The line's width, in px. `2` by default; a sparkline beside a figure draws finer. */
    strokeWidth?: number;
    /** A filled dot on the last point, ringed in the surface colour. */
    endMarker?: boolean;
    /** What the line is, for assistive tech. The surface around it usually says. */
    label?: string;
}
/**
 * The shape of a series, small enough to sit inside a row.
 *
 * No axis, no gridlines, no labels — a sparkline answers "which way, and how
 * steadily", and the number it accompanies answers "how much". If a reader
 * needs to read a value off it, it wanted to be a chart.
 *
 * The end marker carries a 2px ring in the surface colour so it stays legible
 * where the line runs under it.
 */
declare const Sparkline: React.ForwardRefExoticComponent<SparklineProps & React.RefAttributes<SVGSVGElement>>;

/**
 * A share, drawn as a bar inside a table cell with its value beside it — a
 * model's share of queries, a step's share of a plan's work.
 *
 * DOM, not canvas: it sits in every row of a table, sets in the row's own type
 * and needs nothing a canvas gives.
 *
 * The bar's length is `value ÷ max`; the number is `value` itself. A column of
 * small shares can pass `max` = the largest share so the longest bar fills the
 * track while every number stays the true share. Zero, or no value, reads `—`
 * with no track: an empty bar looks like a measured zero, and a dash says there
 * is nothing to measure.
 *
 * `tone` is the fill's job: `primary` by default, `muted` for a secondary column,
 * and the status tones only when the share *is* a status. When the row is an
 * entity with its own colour — a model, a node type — pass `color` instead, so
 * the meter carries the same hue as the entity everywhere else.
 */

type InlineMeterTone = "primary" | "muted" | "success" | "warning" | "destructive";
interface InlineMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** The share, on the same scale as `max` — `0.32` of 1. `null` reads as `—`. */
    value: number | null | undefined;
    /** What a full track means. Default 1. */
    max?: number;
    /** How the value is written. Default: a whole percentage of 1 — `32%`. */
    format?: (value: number) => string;
    tone?: InlineMeterTone;
    /** An entity's colour, as CSS — `var(--color-data-2)`. Overrides `tone`. */
    color?: string;
    /** What is being measured, for assistive tech — `share of queries`. */
    label?: string;
}
declare const InlineMeter: React.ForwardRefExoticComponent<InlineMeterProps & React.RefAttributes<HTMLDivElement>>;

/**
 * One row's total, split into categories along a single 100% bar — a model's
 * queries by caller: agent, plan, Explorer, API.
 *
 * DOM, not canvas: it repeats down a table, one per row.
 *
 * The categories run left to right in `series` order, and the order is the same
 * in every row, so a caller is always in the same place and the same colour
 * down the column. Segments are separated by a 2px gap in the surface colour,
 * never outlined. A category with nothing in it takes no space. A row with
 * nothing at all draws an empty track rather than a bar of one category.
 *
 * The legend is not per row. Pass the same `series` to one
 * {@link SegmentedBarLegend} in the table's header, so the colours are named
 * once for the whole column. Each segment names itself on hover, so identity
 * is never colour alone.
 */

interface SegmentSeries {
    key: string;
    label: string;
    /** A token — `var(--color-data-7)`. */
    color: string;
}
interface SegmentedBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** The count per series `key`. A missing key is 0. */
    values: Record<string, number>;
    /** The categories, in the fixed order every row shares. */
    series: SegmentSeries[];
    /** How a count is written in the hover. Default: `1,284`. */
    format?: (value: number) => string;
}
declare const SegmentedBar: React.ForwardRefExoticComponent<SegmentedBarProps & React.RefAttributes<HTMLDivElement>>;
interface SegmentedBarLegendProps extends Omit<LegendProps, "children"> {
    /** The same `series` every row's {@link SegmentedBar} is given. */
    series: SegmentSeries[];
}
/** The one legend for a column of {@link SegmentedBar}s. */
declare const SegmentedBarLegend: React.ForwardRefExoticComponent<SegmentedBarLegendProps & React.RefAttributes<HTMLDivElement>>;

/** A cell that is more than how busy it was: a guardrail said no, or data left the boundary. */
interface HeatLaneMark {
    /** The cell's index. */
    at: number;
    /** `refused` — a rule stopped it; `egress` — data crossed to a third party or a model. */
    kind: "refused" | "egress";
}
interface HeatLaneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * How busy each slice of time was, `0`–`1`, oldest first. `0` is touched and
     * idle — a faint cell; `null` is not touched at all — a hollow one.
     */
    values: (number | null)[];
    marks?: HeatLaneMark[];
    /** The cell held open — drawn ringed. */
    pinned?: number | null;
    /** Makes every lit cell a button: it receives the cell's index, or `null` to let it go. */
    onPin?: (at: number | null) => void;
    /** What each cell's title says — `4.25–4.50 s`. Defaults to its index. */
    cellLabel?: (at: number) => string;
    /**
     * The lit cells' fill, as a class — `bg-info`, `bg-data-3`. The lane's
     * busyness is the cell's opacity, so one hue carries the whole lane.
     * @default "bg-info"
     */
    fill?: string;
    /** No signal: the lane is dimmed, not cooled — it does not know, rather than knows it is quiet. */
    stale?: boolean;
}
/**
 * One lane of busyness over time: a cell per slice, brighter where it was
 * busier.
 *
 * The lanes of a layer-activity drawing, one per layer, sharing an axis — so
 * *which layers were busy, and when* is read down the column rather than
 * from numbers. **Not touched and touched-but-idle are different cells**:
 * hollow is *nothing reached for it*, faint is *it was there and quiet*. A
 * refusal or a crossing is marked in its cell in a status colour, never a
 * brighter one, so it is not mistaken for load.
 *
 * The cells stretch to the lane's width: the axis is the same for every lane,
 * whatever the width it is drawn at.
 */
declare const HeatLane: React.ForwardRefExoticComponent<HeatLaneProps & React.RefAttributes<HTMLDivElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface BarDatum {
    label: React.ReactNode;
    value: number;
    /**
     * Overrides the series colour for this bar. Use a data-palette token
     * (`var(--color-data-3)`) when the bar's identity is an entity — a node type,
     * a theme — so it matches that entity everywhere else it appears.
     */
    color?: string;
    /** What the tip should read, if not the raw value. */
    display?: React.ReactNode;
    /**
     * Drawn as the remainder rather than an item — `3 others`, the rest folded
     * into one line: its label and bar in the muted colour. `ranked` only.
     */
    muted?: boolean;
}
interface BarChartHProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: BarDatum[];
    /** Fixes the scale. Defaults to the largest value present. */
    max?: number;
    /** Width of the label column, so bars start on the same x. Default: 78, or 96 in `ranked`. */
    labelWidth?: number;
    /** Series colour when a datum does not override it. */
    color?: string;
    /** Names what is plotted. A single series needs no legend when this is set. */
    caption?: React.ReactNode;
    /**
     * `tips` labels each bar at its end. `ranked` is a list read top to bottom —
     * drivers, top-N, likely causes: the labels are the reading in the text
     * colour and may wrap, the bars take the width between, and the values line
     * up in a column at the right. A negative value draws in `negativeColor`,
     * its length its size.
     */
    variant?: "tips" | "ranked";
    /** The colour of a bar below zero, in `ranked`. */
    negativeColor?: string;
    /**
     * `ranked` only: bars grow both ways from a zero rule in the middle, and the
     * line under them says what each side means — `− pulls margin down`,
     * `lifts it +`.
     */
    diverging?: {
        below?: React.ReactNode;
        above?: React.ReactNode;
    };
}
/**
 * Magnitude across a handful of named things.
 *
 * Horizontal because the labels are words — a stock, a pattern, a theme — and
 * words read badly rotated under a column. Bars grow from a single baseline on
 * the left, so length is the only thing carrying the value.
 *
 * One series, so there is no legend: `caption` names what is plotted. Every bar
 * is directly labelled at its tip, which is also what discharges the light-mode
 * contrast obligation on the data palette — identity and value are never
 * carried by hue alone.
 */
declare const BarChartH: React.ForwardRefExoticComponent<BarChartHProps & React.RefAttributes<HTMLDivElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface ColumnBase {
    /** The period or group — `wk 36`, `F`, `paid`. */
    label: React.ReactNode;
    /** A second line under the label — `1–5 Sep`. */
    sublabel?: React.ReactNode;
}
/** One column: one measure in one period. */
interface SingleColumnDatum extends ColumnBase {
    value: number;
    display?: React.ReactNode;
    /**
     * What the column was meant to reach — drawn as a dashed column the value
     * stands inside, so falling short reads as the gap between them.
     */
    plan?: number;
}
/** A group of columns side by side, one per {@link BarSeries}, in the same order. */
interface GroupedColumnDatum extends ColumnBase {
    values: number[];
    /** Written values, index for index with `values`. */
    display?: React.ReactNode[];
}
type ColumnDatum = SingleColumnDatum | GroupedColumnDatum;
interface BarSeries {
    /** What the series is — `before 2 Jun`. Named in the legend. */
    name: React.ReactNode;
    /** Defaults to the data palette in order: `--color-data-1`, `-2`, … */
    color?: string;
}
interface BarTarget {
    value: number;
    /** Written at the right-hand end of the rule — `avg`, `target`. */
    label?: React.ReactNode;
    /** Defaults to the muted text colour. */
    color?: string;
}
interface BarChartVProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: ColumnDatum[];
    /**
     * Names the series when `data` is grouped. Two or more draw a legend; the
     * columns in a group follow this order.
     */
    series?: BarSeries[];
    /** Fixes the scale. Defaults to the largest value present, or the target. */
    max?: number;
    /** Values to draw a hairline at — `[50, 75, 100]`. */
    gridlines?: number[];
    /** A dashed rule across the plot — a target, a baseline, an average. */
    target?: BarTarget;
    height?: number;
    color?: string;
    /** Colour for the column the story is about. Defaults to `color`. Single series only. */
    highlightColor?: string;
    /**
     * Which column (or group) carries the emphasis. The rest are drawn lighter.
     *
     * A single series defaults to the most recent. A grouped chart defaults to
     * none, because there the comparison is inside each group, not between them.
     * `null` says none outright.
     */
    highlightIndex?: number | null;
    /**
     * Which columns get a value on the cap.
     *
     * `last` by default — the emphasised column or group. A number on every
     * column stops being a label and becomes texture; the gridlines carry the rest.
     */
    labelMode?: "last" | "all" | "none";
    caption?: React.ReactNode;
    /**
     * `default` caps columns at 24px so the band's leftover is air. `comparison`
     * is the answer-card form: columns take two thirds of their band, so they
     * grow with the card from 280px to 720px, stand on a baseline with square
     * caps, and carry their values in the muted text colour.
     */
    variant?: "default" | "comparison";
    /** Names the dashed plan columns in the legend — `plan`. */
    planLabel?: React.ReactNode;
}
/**
 * One measure over a few periods, or a few series side by side per group.
 *
 * Vertical because the x-axis is time and time reads left to right. Columns are
 * capped at 24px and separated by real gaps, so the band's leftover is air
 * rather than a fatter bar; columns in a group touch but for a 2px gap.
 *
 * Rule labels — gridlines and the target — sit in a gutter at the right that is
 * as wide as the longest of them, so a label never sits on a column however
 * narrow the chart. One series needs no legend (`caption` says what is
 * plotted); two or more get one, with the target in it.
 */
declare const BarChartV: React.ForwardRefExoticComponent<BarChartVProps & React.RefAttributes<HTMLDivElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface DivergingDatum {
    label: React.ReactNode;
    /** Signed. The sign is the whole point of this chart. */
    value: number;
    display?: React.ReactNode;
}
interface DivergingBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: DivergingDatum[];
    /** Fixes the scale on both sides. Defaults to the largest magnitude present. */
    max?: number;
    labelWidth?: number;
    /** Above the midpoint. Defaults to `--color-success`. */
    positiveColor?: string;
    /** Below it. Defaults to `--color-destructive`. */
    negativeColor?: string;
    caption?: React.ReactNode;
}
/**
 * Polarity — how far either side of zero.
 *
 * A net learning weight, a delta against a baseline, a sentiment score. The
 * midpoint is a real zero line, drawn in the neutral border colour, and both
 * sides share one scale so a `−9` is visibly longer than a `+6`.
 *
 * The poles use the **status** colours rather than data-palette hues, because
 * this chart's two directions are good and bad, not two categories. That is the
 * one place status colour belongs on a chart — it is encoding valence, not
 * identity, so it is never "series 1 and series 2". Every bar is directly
 * labelled, so the sign is readable without seeing colour at all.
 */
declare const DivergingBar: React.ForwardRefExoticComponent<DivergingBarProps & React.RefAttributes<HTMLDivElement>>;

/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */

interface HeatCell {
    /** When this cell is — `09:45`. Used in the hover title. */
    at: React.ReactNode;
    /** Which state key this cell is in. Must exist in `states`. */
    state: string;
    /** Extra detail for the hover title — `2 names: BPCL, HINDPETRO`. */
    detail?: React.ReactNode;
}
interface HeatState {
    key: string;
    /** What the state is called. Shown in the legend and the hover title. */
    label: React.ReactNode;
    color?: string;
    /** Renders as a ring rather than a fill — for "nothing happened here". */
    hollow?: boolean;
}
/** One labelled strip, and the strips it opens into — a schedule, then each of its jobs. */
interface HeatStripRow {
    key: string;
    label: React.ReactNode;
    cells: HeatCell[];
    /** Drawn under it, indented, when it is open. */
    children?: HeatStripRow[];
}
interface HeatStripProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** One strip. Pass this or `rows`. */
    cells?: HeatCell[];
    /** Labelled strips over one axis, each opening into its `children`. Pass this or `cells`. */
    rows?: HeatStripRow[];
    states: HeatState[];
    /** Axis ticks under the strip — `[{at: 0, label: '09'}, …]`. */
    ticks?: {
        at: number;
        label: React.ReactNode;
    }[];
    cellSize?: number;
    /** The label column of `rows`, in px. Defaults to its longest label, up to 40%. */
    labelWidth?: number;
    /** Which rows with `children` are open, by key — `true` for all. Controlled. */
    expanded?: ExpandedKeys;
    /** Which are open at first, uncontrolled. Closed by default. */
    defaultExpanded?: ExpandedKeys;
    onExpandedChange?: (expanded: ExpandedKeys) => void;
}
/**
 * A run of firings, one square each, in time order.
 *
 * A schedule's day: twenty-one firings, most served, one skipped, one that could
 * not answer. The shape of the day is the point — a reader sees the run of green
 * and the one square that is not, without reading any of them.
 *
 * `rows` draws several strips over one axis, each labelled, and a row opens into
 * its `children` — an agent into its tasks, a schedule into its jobs — so the one
 * red square can be followed down to the part that went red.
 *
 * These are **status** colours, so they are reserved and never stand in for
 * categories. The legend is mandatory rather than optional: a square carries no
 * label of its own, so without the legend the strip would be colour-alone. Each
 * cell also names its state in the hover title, which is what a screen reader
 * and a keyboard user get.
 */
declare const HeatStrip: React.ForwardRefExoticComponent<HeatStripProps & React.RefAttributes<HTMLDivElement>>;

export { type AreaSeries, BarChartH, type BarChartHProps, BarChartV, type BarChartVProps, type BarDatum, type BarSeries, type BarTarget, type ChartMark, type ChartReference, type ColumnDatum, DivergingBar, type DivergingBarProps, type DivergingDatum, type GroupedColumnDatum, type HeatCell, HeatLane, type HeatLaneMark, type HeatLaneProps, type HeatState, HeatStrip, type HeatStripProps, type HeatStripRow, InlineMeter, type InlineMeterProps, type InlineMeterTone, type LegendEntry, LineChart, type LineChartBand, type LineChartHighlight, type LineChartMark, type LineChartProps, type LineChartReference, type LineChartSeries, type SegmentSeries, SegmentedBar, SegmentedBarLegend, type SegmentedBarLegendProps, type SegmentedBarProps, type SingleColumnDatum, Sparkline, type SparklineProps, type StackSeries, StackedAreaChart, type StackedAreaChartProps, type StackedAreaDatum, StackedBarChartV, type StackedBarChartVProps, type StackedColumnDatum };
