import * as React from 'react';
import { StatusDotProps, Bound, TaskGanttTask } from '@invana/ui';

/**
 * A dashboard is **data**. Everything in this file is JSON-serialisable, with
 * one deliberate exception noted on {@link PanelSpec.render}.
 *
 * That constraint is the whole design. A spec can come from an API, be stored
 * as `dashboard.yml` beside a plan, be diffed between two runs, and be rendered
 * by a component that has never heard of the record it is describing. So
 * nothing here is a function, a React node, or a class instance — behaviour
 * arrives through {@link DashboardProps.onAction} and the panel registry, keyed
 * by strings the JSON carries.
 */
type Tone = "running" | "success" | "warning" | "error" | "info" | "muted";
/** A chip in a header or beside a row. */
interface ChipSpec {
    label: string;
    /** Renders a `BoundChip` instead of a `Badge`. Set `label` or this, not both. */
    bound?: Bound;
    tone?: Tone;
    variant?: "default" | "outline" | "secondary" | "destructive";
}
/**
 * Something a person can do. The spec carries only what it is called and what
 * it means; **what it does arrives as `onAction(id)`**, because a function is
 * not JSON and a dashboard that shipped callbacks in its data would not be one.
 */
interface ActionSpec {
    id: string;
    label?: string;
    /** A key into {@link DashboardProps.icons}. Unknown names render nothing. */
    icon?: string;
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
    /** A set of mutually exclusive views — `Dashboard` ⁄ `dashboard.yml`. */
    options?: string[];
    /** Which option is active. Only with `options`. */
    value?: string;
    disabled?: boolean;
}
/** The record identity across the top — see `RecordHeader`. */
interface HeaderSpec {
    tone?: StatusDotProps["tone"];
    /** Outermost first; the last is the record this dashboard is about. */
    crumbs: string[];
    chips?: ChipSpec[];
    actions?: ActionSpec[];
}
interface MetricsOptions {
    tiles: Array<{
        label: string;
        value: string;
        caption?: string;
        tone?: "running" | "success" | "warning" | "error" | "info";
        /** `0`–`1`. Only for a value with a real ceiling — see `MetricTile`. */
        meter?: number;
    }>;
    minTileWidth?: number;
}
interface PropertiesOptions {
    rows: Array<{
        label: string;
        value: string;
        mono?: boolean;
    }>;
    labelWidth?: number;
}
interface JsonOptions {
    /** The document, as a string. Objects are stringified with 2-space indent. */
    value: string | Record<string, unknown>;
    maxHeight?: number;
}
interface CodeOptions {
    value: string;
    language?: "python" | "shell" | "javascript" | "json" | "cypher" | "plain";
    maxHeight?: number;
    showLineNumbers?: boolean;
}
interface LogOptions {
    lines: Array<{
        time?: string;
        level?: "info" | "warn" | "error" | "debug";
        source?: string;
        message: string;
    }>;
    /** Overrides the `time · LEVEL · source · message` column widths. */
    columnTemplate?: string;
}
interface GanttOptions {
    tasks: TaskGanttTask[];
    labelWidth?: number;
    density?: "compact" | "comfortable";
    nowMs?: number;
    openEnded?: boolean;
    selectedKey?: string | null;
    /** Emits `onAction(selectAction, { taskKey })` when a row is picked. */
    selectAction?: string;
}
interface TableOptions {
    columns: Array<{
        key: string;
        label: string;
        mono?: boolean;
        align?: "left" | "right";
    }>;
    rows: Array<Record<string, string | number | null>>;
}
interface ListOptions {
    items: Array<{
        id?: string;
        tone?: StatusDotProps["tone"];
        icon?: string;
        title: string;
        /** Right-aligned fact — a duration, a size, a count. */
        meta?: string;
        chip?: ChipSpec;
        mono?: boolean;
        /** Emits `onAction(this, { itemId })` when the row is picked. */
        action?: string;
    }>;
}
interface ExchangeOptions {
    /** `PROMPT · 1,204 tokens` over a mono block, twice. */
    blocks: Array<{
        label: string;
        value: string;
        language?: CodeOptions["language"];
    }>;
}
interface ParamsOptions {
    params: Array<{
        name: string;
        type?: string;
        source: "literal" | "argument" | "binding";
        value: string;
        note?: string;
        invalid?: boolean;
        disabled?: boolean;
    }>;
    /** Emits `onAction(changeAction, { name, source, value })` on every edit. */
    changeAction?: string;
}
interface TextOptions {
    /** Plain paragraphs. No markdown — a dashboard states facts, it does not write. */
    text: string;
    tone?: "default" | "muted" | "success" | "warning" | "error" | "info";
    /** Renders inside an `Alert` rather than as a bare paragraph. */
    callout?: boolean;
    actions?: ActionSpec[];
}
/**
 * A panel whose renderer is **not** built in — a canvas, a flow, a map.
 *
 * `@invana/canvas` is the reason this kind exists. The dashboard does not
 * import it: the consumer registers a renderer for `kind: "canvas"` and the
 * spec carries only the data that renderer needs. That keeps PixiJS out of
 * every consumer that only wanted tiles and a log.
 */
interface CustomOptions {
    [key: string]: unknown;
}
/**
 * Kind → the options that kind reads.
 *
 * This map is what makes a spec **checkable**: a `gantt` panel whose task
 * carries a status the Gantt has never heard of is a compile error, not a band
 * that silently renders empty tracks. It did exactly that once, which is why
 * the map exists.
 */
interface PanelOptionsByKind {
    metrics: MetricsOptions;
    properties: PropertiesOptions;
    json: JsonOptions;
    code: CodeOptions;
    exchange: ExchangeOptions;
    gantt: GanttOptions;
    table: TableOptions;
    log: LogOptions;
    list: ListOptions;
    params: ParamsOptions;
    text: TextOptions;
}
type BuiltInPanelKind = keyof PanelOptionsByKind;
type PanelOptions = PanelOptionsByKind[BuiltInPanelKind] | CustomOptions;
/** Everything a panel carries apart from its kind and its options. */
interface PanelBase {
    id?: string;
    /**
     * **`title` is what puts a panel in a box.** With one, the panel renders
     * inside a `PanelBox`; without one it renders bare, which is how a strip of
     * tiles sits directly on the dashboard rather than in a card labelled
     * "Metrics".
     */
    title?: string;
    /** The fact on the right of the box header. Ignored without a `title`. */
    aside?: string;
    /** A chip on the right of the box header, instead of `aside`. */
    asideChip?: ChipSpec;
    /** Fixed column width in px. Without it the panel takes an equal share. */
    width?: number;
    /** Relative share of the row when several panels grow. Default `1`. */
    grow?: number;
    /** Drop the box padding, so a table or a canvas meets the border. */
    flush?: boolean;
    /**
     * The one escape from JSON: a node rendered in place of a registered kind.
     *
     * It exists because a real surface always has one panel the schema has not
     * caught up with, and the alternative is a fork of the dashboard. A spec that
     * uses it is no longer serialisable — which is the honest cost, and why it is
     * named after what it breaks rather than something comfortable like `content`.
     */
    render?: React.ReactNode;
}
/** A panel of a kind the dashboard ships. Its options are checked against the map. */
type BuiltInPanelSpec = {
    [K in BuiltInPanelKind]: PanelBase & {
        kind: K;
        options: PanelOptionsByKind[K];
    };
}[BuiltInPanelKind];
/**
 * The extra kinds a consumer registers — `{ canvas: CanvasOptions }`.
 *
 * A dashboard's type is **parametrised by its registry**, which is the only way
 * the built-in kinds stay checked. The obvious design — a catch-all member with
 * `kind: string` — silently checks nothing: a union with one permissive member
 * accepts every object, so a `gantt` panel full of invalid statuses compiles
 * and renders empty tracks. It did. Hence this.
 */
type ExtraPanels = Record<string, unknown>;
type RegisteredPanelSpec<X extends ExtraPanels> = {
    [K in keyof X & string]: PanelBase & {
        kind: K;
        options: X[K];
    };
}[keyof X & string];
/**
 * A panel. With no type argument this is the built-ins and nothing else, so a
 * `canvas` panel is a compile error until you say what its options are:
 *
 * ```ts
 * const spec: DashboardSpec<{ canvas: { nodes: TaskNodeSpec[] } }> = { … }
 * ```
 *
 * For a spec arriving off the wire, where nothing can be checked anyway, use
 * {@link AnyDashboardSpec}.
 */
type PanelSpec<X extends ExtraPanels = Record<never, never>> = BuiltInPanelSpec | RegisteredPanelSpec<X>;
interface RowSpec<X extends ExtraPanels = Record<never, never>> {
    id?: string;
    panels: PanelSpec<X>[];
    /** Pin the row's height in px — for a flow, which has no content height. */
    height?: number;
    /** Gap between panels in px. Defaults to the dashboard's `gap`. */
    gap?: number;
}
interface DashboardSpec<X extends ExtraPanels = Record<never, never>> {
    /** For the document title and nothing else; the header draws the crumbs. */
    title?: string;
    header?: HeaderSpec;
    rows: RowSpec<X>[];
    /** Gap between rows and between panels, in px. Default `12`. */
    gap?: number;
}
/** What `onAction` is told, beyond the action's own id. */
interface ActionContext {
    panelId?: string;
    /** Set by `gantt`'s row select. */
    taskKey?: string;
    /** Set by `list`'s row select. */
    itemId?: string;
    /** Set by `params` on an edit. */
    param?: {
        name: string;
        source: string;
        value: string;
    };
    /** Set by a segmented action — which option was picked. */
    option?: string;
}
interface PanelRendererProps<O = PanelOptions> {
    /**
     * The panel's own fields. Not a `PanelSpec` — a renderer reads `id`, `title`
     * and `kind`, and receives its options separately and already narrowed, so
     * tying it to the spec union would make every renderer generic for nothing.
     */
    panel: PanelBase & {
        kind: string;
    };
    options: O;
    onAction: (actionId: string, ctx?: ActionContext) => void;
    icons: Record<string, React.ComponentType<{
        className?: string;
    }>>;
    /**
     * The dashboard's own gap, in px.
     *
     * Passed down so a panel that lays out a grid of its own — the tile strip —
     * keeps the surface's rhythm instead of inventing a second one. A dashboard
     * whose bands sit 12px apart and whose tiles sit 6px apart reads as two
     * grids that happen to share a page.
     */
    gap: number;
}
type PanelRenderer<O = any> = React.ComponentType<PanelRendererProps<O>>;
/** Kind → renderer. Consumer entries win over the built-ins. */
type PanelRegistry = Record<string, PanelRenderer>;
interface DashboardProps<X extends ExtraPanels = Record<never, never>> extends React.HTMLAttributes<HTMLDivElement> {
    spec: DashboardSpec<X>;
    /**
     * Everything a person can do. Called with the action's `id` from the spec and
     * whatever context the panel had — see {@link ActionContext}.
     */
    onAction?: (actionId: string, ctx?: ActionContext) => void;
    /**
     * Extra panel kinds, merged over the built-ins. This is where
     * `@invana/canvas` arrives: `{ canvas: MyFlowPanel }`.
     */
    registry?: PanelRegistry;
    /** Icon names the spec may use. Unknown names render nothing. */
    icons?: Record<string, React.ComponentType<{
        className?: string;
    }>>;
}
/**
 * A spec whose panel kinds are not known at compile time — one fetched from an
 * API, or read from a `dashboard.yml`. Nothing about it is checked, which is
 * the truth about JSON off the wire rather than a weakness of the type.
 */
type AnyDashboardSpec = DashboardSpec<Record<string, CustomOptions>>;

/**
 * The kinds a dashboard can draw without being told anything.
 *
 * Eleven, and the number is meant to stay near it. A twelfth belongs here only
 * when two unrelated surfaces both need it — otherwise it is a consumer's
 * registry entry, which costs nothing and keeps this list readable.
 *
 * Deliberately absent: **`canvas`**. A flow, a map or a graph needs
 * `@invana/canvas`, and importing it here would put PixiJS in the bundle of
 * every consumer that only wanted tiles and a log. It arrives as a registry
 * entry instead — see the `canvas` note in `types.ts`.
 */
declare const BUILT_IN_PANELS: PanelRegistry;
declare function resolveRegistry(extra?: PanelRegistry): PanelRegistry;

/**
 * A dashboard, assembled from JSON.
 *
 * The spec says what bands there are, what kind each one is and what data it
 * carries; this decides nothing except layout. That split is the point — the
 * same component renders a run, a step, a plan and a draft, and adding a
 * seventh surface is a new document rather than a new screen.
 *
 * **Behaviour is not in the spec.** Actions carry an `id` and arrive back
 * through `onAction`; a gantt row's selection, a list row's click and a
 * parameter edit all come through the same seam. So a spec can be fetched,
 * stored beside a plan as `dashboard.yml`, diffed between two runs, and handed
 * to a renderer that has never heard of the record it describes.
 *
 * **It owns one scroller.** The body scrolls; no band does. A `PanelBox` is
 * content-height by construction, which is what keeps twenty of them in a
 * column from becoming twenty scroll regions.
 */
declare function Dashboard<X extends ExtraPanels = Record<never, never>>({ spec, onAction, registry: extraRegistry, icons, className, ...props }: DashboardProps<X>): React.JSX.Element;

/** A chip from its spec — a bound renders as a `BoundChip`, everything else as a `Badge`. */
declare function SpecChip({ chip }: {
    chip: ChipSpec;
}): React.JSX.Element;
declare function SpecChips({ chips }: {
    chips?: ChipSpec[];
}): React.JSX.Element | null;
/**
 * An action from its spec.
 *
 * `options` turns it into a segmented switch, because a view switch is one
 * decision with several positions and rendering it as three buttons would let a
 * reader think they could pick two.
 */
declare function SpecAction({ action, onAction, icons, ctx, }: {
    action: ActionSpec;
    onAction: (id: string, ctx?: ActionContext) => void;
    icons: Record<string, React.ComponentType<{
        className?: string;
    }>>;
    ctx?: ActionContext;
}): React.JSX.Element;
declare function SpecActions({ actions, onAction, icons, ctx, }: {
    actions?: ActionSpec[];
    onAction: (id: string, ctx?: ActionContext) => void;
    icons: Record<string, React.ComponentType<{
        className?: string;
    }>>;
    ctx?: ActionContext;
}): React.JSX.Element | null;

declare function MetricsPanel({ options, gap }: PanelRendererProps<MetricsOptions>): React.JSX.Element;
declare function PropertiesPanel({ options }: PanelRendererProps<PropertiesOptions>): React.JSX.Element;
declare function JsonPanel({ options }: PanelRendererProps<JsonOptions>): React.JSX.Element;
declare function CodePanel({ options }: PanelRendererProps<CodeOptions>): React.JSX.Element;
/**
 * A labelled pair of mono blocks — a prompt and what came back.
 *
 * Its own kind rather than two `code` panels, because the two are one record:
 * a completion shown without the prompt that produced it is not evidence.
 */
declare function ExchangePanel({ options }: PanelRendererProps<ExchangeOptions>): React.JSX.Element;
declare function GanttPanel({ panel, options, onAction }: PanelRendererProps<GanttOptions>): React.JSX.Element;
declare function TablePanel({ options }: PanelRendererProps<TableOptions>): React.JSX.Element;

declare function LogPanel({ options }: PanelRendererProps<LogOptions>): React.JSX.Element;
/**
 * Rows that are not a table: artifacts, the runs of a plan, a version history.
 *
 * A table is for values you compare down a column. These are records you scan
 * and open, which is what `Item` is for — so a list panel is never a
 * one-column table.
 */
declare function ListPanel({ panel, options, onAction, icons }: PanelRendererProps<ListOptions>): React.JSX.Element;
declare function ParamsPanel({ panel, options, onAction }: PanelRendererProps<ParamsOptions>): React.JSX.Element;
declare function TextPanel({ panel, options, onAction, icons }: PanelRendererProps<TextOptions>): React.JSX.Element;

export { type ActionContext, type ActionSpec, type AnyDashboardSpec, BUILT_IN_PANELS, type BuiltInPanelKind, type BuiltInPanelSpec, type ChipSpec, type CodeOptions, CodePanel, type CustomOptions, Dashboard, type DashboardProps, type DashboardSpec, type ExchangeOptions, ExchangePanel, type ExtraPanels, type GanttOptions, GanttPanel, type HeaderSpec, type JsonOptions, JsonPanel, type ListOptions, ListPanel, type LogOptions, LogPanel, type MetricsOptions, MetricsPanel, type PanelBase, type PanelOptions, type PanelOptionsByKind, type PanelRegistry, type PanelRenderer, type PanelRendererProps, type PanelSpec, type ParamsOptions, ParamsPanel, type PropertiesOptions, PropertiesPanel, type RegisteredPanelSpec, type RowSpec, SpecAction, SpecActions, SpecChip, SpecChips, type TableOptions, TablePanel, type TextOptions, TextPanel, type Tone, resolveRegistry };
