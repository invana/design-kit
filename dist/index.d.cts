import * as React from 'react';
import { BlockPatch, AskState, BlockKind, BlockOptionsByKind, SpecStream } from '@invana/blocks';
import { StatusDotProps, Bound, DiffOp, Layer, Narrowing, LensUsage, LayerPalette, MarkChip, TouchItem } from '@invana/ui';

/**
 * How a board changes while it streams. A panel's options stream by the
 * block's own {@link BlockPatch} — the patch a conversation streams the same
 * block by — so a gantt panel and a gantt answer take one stream.
 */
type BoardPatch = 
/** Stream a panel's options — its block's spec — by a block patch. `panel` is its `id`. */
{
    op: "patch-panel";
    panel: string;
    patch: BlockPatch;
}
/**
 * The panel's own fields — its `aside` as the run moves, its `state` once
 * answered; `null` removes one. Never its `id`, `kind` or `options`.
 */
 | {
    op: "update-panel";
    panel: string;
    fields: {
        [F in keyof Omit<PanelBase, "id" | "render">]?: PanelBase[F] | null;
    };
};
type BoardPatchOp = BoardPatch["op"];
declare class BoardPatchError extends Error {
}
/** A board's spec after one patch: the panel it names, wherever it sits — a row, or a tab's row. */
declare function applyBoardPatch<X extends ExtraPanels>(spec: BoardSpec<X>, patch: BoardPatch): BoardSpec<X>;
/** Apply patches in order — a recorded stream, replayed. */
declare function applyBoardPatches<X extends ExtraPanels>(spec: BoardSpec<X>, patches: BoardPatch[]): BoardSpec<X>;

/**
 * A board is **data**. Everything in this file is JSON-serialisable, with
 * one deliberate exception noted on {@link PanelSpec.render}.
 *
 * That constraint is the whole design. A spec can come from an API, be stored
 * as `board.yml` beside a plan, be diffed between two runs, and be rendered
 * by a component that has never heard of the record it is describing. So
 * nothing here is a function, a React node, or a class instance — behaviour
 * arrives through {@link BoardProps.onAction} and the panel registry, keyed
 * by strings the JSON carries.
 */
type Tone = "running" | "success" | "warning" | "error" | "info" | "muted";
/** A chip in a header or beside a row. */
interface ChipSpec {
    label: string;
    /** Renders a `BoundChip` instead of a `Badge`. Set `label` or this, not both. */
    bound?: Bound;
    /**
     * The bound's swatch class — `bg-data-7`. `BoundChip` ships no hues, so a
     * spec that names a bound and no swatch draws in the neutral.
     */
    swatch?: string;
    tone?: Tone;
    variant?: "default" | "outline" | "secondary" | "destructive";
}
/**
 * Something a person can do. The spec carries only what it is called and what
 * it means; **what it does arrives as `onAction(id)`**, because a function is
 * not JSON and a board that shipped callbacks in its data would not be one.
 */
interface ActionSpec {
    id: string;
    label?: string;
    /** A key into {@link BoardProps.icons}. Unknown names render nothing. */
    icon?: string;
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
    /** A set of mutually exclusive views — `Board` ⁄ `board.yml`. */
    options?: string[];
    /** Which option is active. Only with `options`. */
    value?: string;
    /**
     * Draw `options` as a dropdown rather than a segmented switch — for a choice
     * among named records (`agent`), too many or too long to lay side by side.
     * Dispatches with `{ option }` exactly as the switch does.
     */
    picker?: boolean;
    /**
     * Draw `options` as a menu behind this action's button — `⋯` opening
     * `Versions · Arguments · Export YAML`. A menu is a list of acts, not a
     * choice: nothing is selected and `value` is ignored. Dispatches with
     * `{ option }`, and `optionLabels` names each item. With an `icon`, the
     * button draws the icon alone and `label` is its accessible name.
     */
    menu?: boolean;
    /**
     * What the reader sees for an option, by option. The option itself is what
     * dispatches, so a picker can show a name and send an id. An option with no
     * label shows as itself.
     */
    optionLabels?: Record<string, string>;
    /**
     * An on/off setting — `Fit`. Set, the action draws as a labelled `Switch` in
     * this state and dispatches with `{ pressed }`, the state it is switched to.
     */
    pressed?: boolean;
    disabled?: boolean;
}
/** The record identity across the top — see `RecordHeader`. */
interface HeaderSpec {
    /** The bar's height on the control scale: `lg` (default) tops a page, `md` a panel or a drawer. */
    size?: "md" | "lg";
    tone?: StatusDotProps["tone"];
    /** Outermost first; the last is the record this board is about. */
    crumbs: string[];
    /**
     * An action per crumb, by index — a crumb with one is a link back to the
     * record it names (`run:7d3184f1` above a step). `undefined` stays text.
     */
    crumbActions?: (string | undefined)[];
    /**
     * The last crumb opens a picker of its siblings — every step of a run. A
     * pick dispatches `action` with `{ itemId }`.
     */
    crumbMenu?: CrumbMenuSpec;
    chips?: ChipSpec[];
    actions?: ActionSpec[];
    /**
     * The record's own description, on one line under the crumbs — see
     * `RecordDescription`. `More` shows the whole of it and {@link details}.
     */
    description?: string;
    /** The record's facts, shown under the description by `More`. */
    details?: Array<{
        label: string;
        value: string;
        mono?: boolean;
    }>;
}
/**
 * What is staged and not yet published — drawn as a `StagedBar` between the
 * header and the tabs, on every tab, while a draft is open. Absent draws nothing.
 */
interface StagedSpec {
    items: Array<{
        id: string;
        op: "add" | "remove" | "change";
        name: string;
        note?: string;
    }>;
    /** Dispatched with `{ itemId }` by an item's `×`. Absent, the items carry none. */
    discardAction?: string;
    /** Dispatched by `Discard all`. Absent, there is no `Discard all`. */
    discardAllAction?: string;
    /** The shortcut that finishes the set — `⌘↵ publish`. */
    hint?: string;
}
/** The siblings the last crumb can switch to. */
interface CrumbMenuSpec {
    action: string;
    /** The field's placeholder over the list — `Jump to a step`. */
    placeholder?: string;
    items: Array<{
        id: string;
        label: string;
        /** Right-aligned, mono — a duration. */
        aside?: string;
        tone?: StatusDotProps["tone"];
    }>;
    /** The item the page is on. */
    selected?: string;
}
/**
 * One tab of a board — its own bands under the shared header.
 *
 * Tabs are readings of one record, never other records: a spec with tabs is
 * still one document, which is why a saved report keeps every tab.
 */
interface TabSpec<X extends ExtraPanels = Record<never, never>> {
    id: string;
    label: string;
    rows: RowSpec<X>[];
    /**
     * Nothing to read here yet — the tab draws dimmed with a lock and cannot be
     * picked. Why it is locked is said where the reader already is, not on the tab.
     */
    locked?: boolean;
    /**
     * Drop the body padding, so the tab's one band meets the tab strip and the
     * page's edges — a canvas, which is a surface and not a card on one.
     */
    flush?: boolean;
}
interface JsonOptions {
    /** The document, as a string. Objects are stringified with 2-space indent. */
    value: string | Record<string, unknown>;
    maxHeight?: number;
}
interface CodeOptions {
    value: string;
    language?: "python" | "shell" | "javascript" | "json" | "cypher" | "yaml" | "plain";
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
/** One thing the engine wrote — a task started, a call made, a line logged. */
interface EventSpec {
    id: string;
    /** From the run's zero, in ms. */
    atMs: number;
    level: "debug" | "info" | "warn" | "error";
    /** The engine's own word — `task_started`, `llm_call`, `retry_scheduled`. Drawn in its level's colour. */
    kind: string;
    /** The task it belongs to, by key. */
    task?: string;
    tookMs?: number;
    message: string;
    /** Everything else it carries, opened under the event in the tree. */
    fields?: Record<string, string>;
}
/**
 * The run's event stream, read one of two ways. `log` is every event in
 * order, a page at a time, searched and narrowed by kind, task and level.
 * `tree` is the tasks as a tree, each task's own events under it before
 * the tasks it split into, an event opening into its fields.
 */
interface EventsOptions {
    events: EventSpec[];
    layout?: "log" | "tree";
    /** The tasks, for `tree` — a task with no `parent` is a root. */
    tasks?: Array<{
        key: string;
        parent?: string;
        status: string;
        summary?: string;
        startMs?: number;
        durationMs?: number;
    }>;
    /** Leave out the task column and its chip — a log already about one task. */
    hideTask?: boolean;
    /** `log` only. Default `25`. */
    pageSize?: number;
    /**
     * Dispatched with `{ panelId, value: <task key> }` when a row is picked — an
     * event's task, or the task itself in the tree. Absent, rows do not pick.
     */
    selectAction?: string;
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
    /** Plain paragraphs. No markdown — a board states facts, it does not write. */
    text: string;
    tone?: "default" | "muted" | "success" | "warning" | "error" | "info";
    /** Renders inside an `Alert` rather than as a bare paragraph. */
    callout?: boolean;
    actions?: ActionSpec[];
}
/**
 * A panel whose renderer is **not** built in — a canvas, a flow, a map.
 *
 * `@invana/canvas` is the reason this kind exists. The board does not
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
    json: JsonOptions;
    code: CodeOptions;
    exchange: ExchangeOptions;
    log: LogOptions;
    events: EventsOptions;
    list: ListOptions;
    params: ParamsOptions;
    text: TextOptions;
}
type BuiltInPanelKind = keyof PanelOptionsByKind;
type PanelOptions = PanelOptionsByKind[BuiltInPanelKind] | BlockOptionsByKind[BlockKind] | CustomOptions;
/** Everything a panel carries apart from its kind and its options. */
interface PanelBase {
    id?: string;
    /**
     * The label bar over the panel. Every panel is drawn in a `PanelBox` — the
     * board frames what it draws, as an answer card frames a block — and
     * `title` only adds the bar. Without it the box frames its content alone.
     */
    title?: string;
    /** The fact on the right of the box header. Ignored without a `title`. */
    aside?: string;
    /** A chip on the right of the box header, instead of `aside`. */
    asideChip?: ChipSpec;
    /**
     * Controls on the right of the box header, after `aside` — a reading of this
     * panel, such as a `Fit` toggle. Dispatched with `{ panelId }`.
     * Ignored without a `title`.
     */
    actions?: ActionSpec[];
    /** Fixed column width in px. Without it the panel takes an equal share. */
    width?: number;
    /** Relative share of the row when several panels grow. Default `1`. */
    grow?: number;
    /** Drop the box padding, so a table or a canvas meets the border. */
    flush?: boolean;
    /**
     * Where a block that returns a value stands — a `form`, a `confirm` — and the
     * value given. The consumer moves it on `reply`, as the API patches an ask
     * turn; unset, the block is open.
     */
    state?: AskState;
    value?: unknown;
    /**
     * **Nobody recorded this band** — draw why, instead of the panel.
     *
     * A rule of the board and not of each renderer, because every kind has
     * the same three ways of having nothing to draw and they are three different
     * facts: `unrecorded` (the document is written when the row settles),
     * `purged` (it existed and aged out) and `declared-none` (the step's contract
     * has no such output). A renderer left to decide for itself reaches for an
     * empty table, which claims the step returned an empty result.
     *
     * A panel with **no title and no options** is better left out of the spec
     * altogether — absence is for a band a reader expects to find.
     */
    absent?: {
        reason: "unrecorded" | "purged" | "declared-none";
        /** Overrides the word — the engine's own term where there is one. */
        label?: string;
        /** Why, in the record's terms. */
        note?: string;
    };
    /**
     * The one escape from JSON: a node rendered in place of a registered kind.
     *
     * It exists because a real surface always has one panel the schema has not
     * caught up with, and the alternative is a fork of the board. A spec that
     * uses it is no longer serialisable — which is the honest cost, and why it is
     * named after what it breaks rather than something comfortable like `content`.
     */
    render?: React.ReactNode;
}
/** A panel of a kind the board ships. Its options are checked against the map. */
type BuiltInPanelSpec = {
    [K in BuiltInPanelKind]: PanelBase & {
        kind: K;
        options: PanelOptionsByKind[K];
    };
}[BuiltInPanelKind];
/**
 * A block as a panel: its kind, and the options the same block reads in a
 * conversation turn — `{ kind: "timeseries", title: "Demand", options: { series } }`.
 * A kind the consumer registers itself is theirs, not the block's.
 */
type BlockPanelSpec<X extends ExtraPanels = Record<never, never>> = {
    [K in Exclude<BlockKind, keyof X>]: PanelBase & {
        kind: K;
        options: BlockOptionsByKind[K];
    };
}[Exclude<BlockKind, keyof X>];
/**
 * The extra kinds a consumer registers — `{ canvas: CanvasOptions }`.
 *
 * A board's type is **parametrised by its registry**, which is the only way
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
 * const spec: BoardSpec<{ canvas: { nodes: TaskNodeSpec[] } }> = { … }
 * ```
 *
 * For a spec arriving off the wire, where nothing can be checked anyway, use
 * {@link AnyBoardSpec}.
 */
type PanelSpec<X extends ExtraPanels = Record<never, never>> = BuiltInPanelSpec | BlockPanelSpec<X> | RegisteredPanelSpec<X>;
interface RowSpec<X extends ExtraPanels = Record<never, never>> {
    id?: string;
    panels: PanelSpec<X>[];
    /** Pin the row's height in px — for a flow, which has no content height. */
    height?: number;
    /**
     * Take the height the tab has left — a canvas, which has no content height
     * and no one right height either. Ignored with {@link height}.
     */
    fill?: boolean;
    /** Gap between panels in px. Defaults to the board's `gap`. */
    gap?: number;
}
interface BoardSpec<X extends ExtraPanels = Record<never, never>> {
    /** For the document title and nothing else; the header draws the crumbs. */
    title?: string;
    header?: HeaderSpec;
    /** The staged set, as a bar under the header — see {@link StagedSpec}. */
    staged?: StagedSpec;
    /** The bands. Ignored when `tabs` is set — each tab carries its own. */
    rows: RowSpec<X>[];
    /** Readings of the record, as a tab strip under the header. */
    tabs?: TabSpec<X>[];
    /** The active tab's `id`. Absent reads the first. */
    tab?: string;
    /**
     * Dispatched with `{ option: <tab id> }` when a tab is picked. Absent, the
     * board keeps the tab itself — which is how a frozen report reads.
     */
    tabAction?: string;
    /**
     * Controls on the right of the tab strip that apply to every tab — the
     * window a plan's numbers are read over. Ignored without `tabs`.
     */
    tabActions?: ActionSpec[];
    /**
     * One thing picked out of this board, read beside it — a task of a run
     * beside the run's tree. Its own board (header, tabs, bands) in a column on
     * the right, under this board's header, scrolling on its own, so the record
     * it was picked from stays in view. Absent, the body takes the full width.
     */
    inspector?: InspectorSpec<X>;
    /** Gap between rows and between panels, in px. Default `12`. */
    gap?: number;
}
/**
 * The column beside a board. Its header is drawn at `md`, as a panel's is; an
 * `inspector` inside it is ignored — one record beside another, never a chain.
 */
interface InspectorSpec<X extends ExtraPanels = Record<never, never>> {
    spec: BoardSpec<X>;
    /** In px. Default `440`. */
    width?: number;
}
/** What `onAction` is told, beyond the action's own id. */
interface ActionContext {
    panelId?: string;
    /** Set by `list`'s row select and a crumb or staged item. */
    itemId?: string;
    /** Set by `params` on an edit. */
    param?: {
        name: string;
        source: string;
        value: string;
    };
    /** Set by a segmented action — which option was picked. */
    option?: string;
    /** Set by a switch action — the state it was switched to. */
    pressed?: boolean;
    /** Set by `trace`'s row select — the step a reader picked out of a run. */
    stepId?: string;
    /** Set by `lens`'s row select — the lens a reader picked, by name. */
    lens?: string;
    /** Set by a block panel — what its action carries: a row's key, a form's values. */
    value?: unknown;
    /** Set by `BoardPages` — the page a pick, a close or a board's own action came from. */
    pageId?: string;
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
     * The board's own gap, in px.
     *
     * Passed down so a panel that lays out a grid of its own — the tile strip —
     * keeps the surface's rhythm instead of inventing a second one. A board
     * whose bands sit 12px apart and whose tiles sit 6px apart reads as two
     * grids that happen to share a page.
     */
    gap: number;
}
type PanelRenderer<O = any> = React.ComponentType<PanelRendererProps<O>>;
/** Kind → renderer. Consumer entries win over the built-ins. */
type PanelRegistry = Record<string, PanelRenderer>;
interface BoardProps<X extends ExtraPanels = Record<never, never>> extends React.HTMLAttributes<HTMLDivElement> {
    spec: BoardSpec<X>;
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
    /**
     * Patches to `spec` as they arrive — a panel's block streaming by the same
     * patch a conversation streams it by (`patch-panel`), or its own fields
     * moving (`update-panel`). The board draws `spec` with them applied; a new
     * `spec` starts over from it. Sources and their rules are the block stream's:
     * `fromNdjson`, `fromEventSource`, a generator, or `playScript`, or a
     * function `(signal) => source` kept stable.
     */
    stream?: SpecStream<BoardPatch>;
    /** The stream ended; the spec as it left it. */
    onStreamEnd?: (spec: BoardSpec<X>) => void;
    /** A patch did not apply, or the source failed. The stream stops there. */
    onStreamError?: (error: unknown) => void;
}
/**
 * A spec whose panel kinds are not known at compile time — one fetched from an
 * API, or read from a `board.yml`. Nothing about it is checked, which is
 * the truth about JSON off the wire rather than a weakness of the type.
 */
type AnyBoardSpec = BoardSpec<Record<string, CustomOptions>>;
/** One page of a {@link BoardPagesSpec}: its tab, and the board behind it. */
interface BoardPageSpec<X extends ExtraPanels = Record<never, never>> {
    id: string;
    title: string;
    /** A key into {@link BoardPagesProps.icons}. Unknown names render nothing. */
    icon?: string;
    disabled?: boolean;
    /** Draws an `×` on the tab, dispatching `closeAction`. Only with `closeAction`. */
    closable?: boolean;
    board: BoardSpec<X>;
}
/**
 * Several boards behind one tab strip — the open boards of a shell. Like a
 * board's own tabs, the pick is the strip's to keep until the spec names
 * `selectAction`; then it is reported with `{ pageId }` and `active` is the host's.
 */
interface BoardPagesSpec<X extends ExtraPanels = Record<never, never>> {
    pages: BoardPageSpec<X>[];
    /** The page shown. Defaults to the first. */
    active?: string;
    /** Dispatched with `{ pageId }` when a tab is picked. */
    selectAction?: string;
    /** Dispatched with `{ pageId }` by a closable tab's `×`. */
    closeAction?: string;
    /** Draws a `+` that dispatches this. Absent, there is no `+`. */
    addAction?: string;
    /** The `+`'s tooltip — `New board`. */
    addLabel?: string;
    /** Where the tabs sit: over the boards (default) or under them, as a spreadsheet's do. */
    tabPosition?: "top" | "bottom";
    /** Which end of the strip the prev / next / `+` buttons dock at. Default `end`. */
    pagerPosition?: "start" | "end";
}
interface BoardPagesProps<X extends ExtraPanels = Record<never, never>> {
    spec: BoardPagesSpec<X>;
    /** Every page's actions and the strip's own, told apart by `pageId`. */
    onAction?: (actionId: string, ctx?: ActionContext) => void;
    registry?: PanelRegistry;
    icons?: Record<string, React.ComponentType<{
        className?: string;
    }>>;
    className?: string;
}

/**
 * The panels only a board has. Everything a conversation also draws — a
 * table, a band of figures, a record, a chart — is a block, and every block
 * kind is a panel kind too (see `BLOCK_PANELS`).
 *
 * Eight, and the number is meant to stay near it. Another belongs here only
 * when two unrelated surfaces both need it and a conversation does not —
 * otherwise it is a block, or a consumer's registry entry. `events` passes:
 * a run page and a telemetry view both read an engine's event stream.
 *
 * Deliberately absent: **`canvas`**. A flow, a map or a graph needs
 * `@invana/canvas`, and importing it here would put PixiJS in the bundle of
 * every consumer that only wanted tiles and a log. It arrives as a registry
 * entry instead — see the `canvas` note in `types.ts`.
 */
declare const BUILT_IN_PANELS: PanelRegistry;
/**
 * Every kind a board can draw: the blocks, then the panels only a
 * board has, then the consumer's own. Later entries win, so a registered
 * kind replaces a block of the same name — `RUN_PANELS`' `trace` does.
 */
declare function resolveRegistry(extra?: PanelRegistry): PanelRegistry;

/**
 * A board, assembled from JSON.
 *
 * The spec says what bands there are, what kind each one is and what data it
 * carries; this decides nothing except layout. That split is the point — the
 * same component renders a run, a step, a plan and a draft, and adding a
 * seventh surface is a new document rather than a new screen.
 *
 * **Behaviour is not in the spec.** Actions carry an `id` and arrive back
 * through `onAction`; a gantt row's pick, a list row's click and a
 * parameter edit all come through the same seam. So a spec can be fetched,
 * stored beside a plan as `board.yml`, diffed between two runs, and handed
 * to a renderer that has never heard of the record it describes.
 *
 * **It owns one scroller.** The body scrolls; no band does. A `PanelBox` is
 * content-height by construction, which is what keeps twenty of them in a
 * column from becoming twenty scroll regions.
 */
declare function Board<X extends ExtraPanels = Record<never, never>>({ spec: given, onAction, registry: extraRegistry, icons, stream, onStreamEnd, onStreamError, className, ...props }: BoardProps<X>): React.JSX.Element;

/**
 * Several boards in one {@link Workbook} — the open boards of a shell's
 * main section. Each page is a {@link Board} drawn from its own spec; every
 * page stays mounted, so switching keeps a board's scroll and tab.
 *
 * Uncontrolled unless the spec names `selectAction`, as a board's own tabs
 * are: then the pick is reported and `active` is the host's to change.
 */
declare function BoardPages<X extends ExtraPanels = Record<never, never>>({ spec, onAction, registry, icons, className, }: BoardPagesProps<X>): React.JSX.Element;

/**
 * A block as a panel: the same JSON a conversation turn draws, framed by the
 * panel. The block draws bare — its title and aside are the panel's — and what
 * it does arrives as `onAction(action, { panelId, value })`, so a row picked in
 * a `table` is `select` with the row's key, told apart by the panel it came from;
 * an action its spec declares arrives by its own id — `approve`.
 */
declare function BlockPanel({ panel, options, onAction }: PanelRendererProps): React.JSX.Element;
/** Every block kind, drawn by {@link BlockPanel}. A kind with no renderer yet is a labelled placeholder. */
declare const BLOCK_PANELS: PanelRegistry;

interface AttemptRow {
    /** `queued` · `attempt 1` · `attempt 2` · `settled`. */
    label: React.ReactNode;
    /** When it started, on the run's own clock — `+44.5s`. */
    started?: React.ReactNode;
    /** How long it took — `30.0s`, or `4.2s…` while it is still running. */
    took?: React.ReactNode;
    /** What happened, in one line. */
    what?: React.ReactNode;
    tone?: "muted" | "info" | "success" | "warning" | "destructive";
    /** It ran and it did not stick. **Struck, never dropped.** */
    struck?: boolean;
}
interface AttemptClockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    rows: AttemptRow[];
    /**
     * What the two numbers are — `elapsed 32.4s · working 2.3s · the gap is the
     * attempt that timed out`.
     *
     * **Stated, never left as arithmetic.** A reader who has to subtract two
     * durations to find a 30-second timeout has been handed a sum instead of an
     * answer.
     */
    summary?: React.ReactNode;
}
/**
 * A step's clock, attempt by attempt.
 *
 * One duration cannot say what happened to a step that timed out once and then
 * returned: `2.1s` is what it *did*, `32.4s` is what a reader waited, and the
 * gap between them **is** the first attempt. So the clock is a row per attempt
 * — queued, each try, settled — and the try that failed keeps its place, struck.
 *
 * Nothing new is recorded for this: it is the `timing` and `attempt` fields the
 * interpreter already writes, read as a list instead of as a total.
 */
declare const AttemptClock: React.ForwardRefExoticComponent<AttemptClockProps & React.RefAttributes<HTMLDivElement>>;

interface RecordDescriptionDetail {
    label: React.ReactNode;
    value: React.ReactNode;
    /** The value in the mono face — an id, a mode, a date. */
    mono?: boolean;
}
interface RecordDescriptionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** The one field a reader scans — one line, truncated, until `More`. */
    description?: React.ReactNode;
    /** What `More` shows beneath the full description, as label/value pairs. */
    details?: RecordDescriptionDetail[];
    moreLabel?: string;
    lessLabel?: string;
}
/**
 * A record's own metadata, on the line under its `RecordHeader`.
 *
 * The description reads on one line, and `More` puts the rest — the whole
 * description, then the record's facts as a `PropertyList` — in place, and
 * `Less` folds it back. Not in a tooltip or a dialog: the reader is already
 * looking at the record.
 *
 * `More` is there only when there is more: details to show, or a description
 * the line cuts.
 */
declare const RecordDescription: React.ForwardRefExoticComponent<RecordDescriptionProps & React.RefAttributes<HTMLDivElement>>;

interface StagedBarItem {
    id: string;
    op: DiffOp;
    /** What changed, in the mono face — `airport.timezone`. */
    name: React.ReactNode;
    /** What the change is — `property`, `integer → float`. */
    note?: React.ReactNode;
}
interface StagedBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    items: StagedBarItem[];
    /** Discard one change. Left out, the items carry no `×`. */
    onDiscard?: (id: string) => void;
    /** Discard every change. Left out, there is no `Discard all`. */
    onDiscardAll?: () => void;
    /** The keyboard route to what finishes the set — `⌘↵ publish`. */
    hint?: React.ReactNode;
    discardAllLabel?: string;
}
/**
 * What is staged and not yet published, as one bar across the surface it
 * changes.
 *
 * The count, then each change as a chip with its sign spelled out — a reader
 * who cannot separate red from green still tells an addition from a removal —
 * and its own `×`; `Discard all` and the shortcut that publishes on the right.
 * It sits under the record's header while a draft is open, and not at all
 * otherwise: a bar reading *0 staged* is noise.
 */
declare const StagedBar: React.ForwardRefExoticComponent<StagedBarProps & React.RefAttributes<HTMLDivElement>>;

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
 * reader think they could pick two. `picker` draws the same choice as a
 * dropdown, for records too many or too long to lay side by side. `menu` puts
 * them behind the action's own button, as acts rather than a choice.
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

declare function JsonPanel({ options }: PanelRendererProps<JsonOptions>): React.JSX.Element;
declare function CodePanel({ options }: PanelRendererProps<CodeOptions>): React.JSX.Element;
/**
 * A labelled pair of mono blocks — a prompt and what came back.
 *
 * Its own kind rather than two `code` panels, because the two are one record:
 * a completion shown without the prompt that produced it is not evidence.
 */
declare function ExchangePanel({ options }: PanelRendererProps<ExchangeOptions>): React.JSX.Element;

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

/**
 * The run's event stream — see {@link EventsOptions}. Both layouts read the
 * same events, so a log and a tree of one run never disagree.
 */
declare function EventsPanel(props: PanelRendererProps<EventsOptions>): React.JSX.Element;

/**
 * The panels a **run page** is made of.
 *
 * They are not in `BUILT_IN_PANELS`, and that is deliberate: the built-in list
 * is eleven kinds two unrelated surfaces each need, and these six are one
 * surface family's — a run read in order, what it touched, a step's clock, the
 * files it left, what governed it, and the ask it settled. The layers it spent
 * are the `gantt` block — a row per layer, a bar per task that reached it — so
 * a conversation draws them too.
 * Shipping them here rather than in the default registry keeps a consumer that
 * only wanted tiles and a log from carrying the run vocabulary, while keeping
 * the adapter in the kit rather than copied into every product that draws runs.
 *
 * ```ts
 * <Board spec={spec} registry={RUN_PANELS} />
 * ```
 */
/** One row of a trace — a step, a loop that holds rows, or a gate between them. */
type TraceEntry = {
    kind?: "step";
    seq?: number | string;
    name: string;
    description?: string;
    layer?: string;
    role?: string;
    duration?: string;
    note?: string;
    /** The exception this row carries — `↺ 2 of 3`, `live`, `↳ delegates`. */
    mark?: string;
    markTone?: React.ComponentProps<typeof MarkChip>["tone"];
    depth?: number;
    dim?: boolean;
    struck?: boolean;
    /** Fired as `selectAction` with `{ stepId }`. */
    id?: string;
} | {
    kind: "loop";
    label: string;
    summary?: string;
    tone?: "warning" | "info" | "muted";
    rounds: TraceEntry[];
} | {
    kind: "gate";
    label: string;
    note?: string;
    tone?: "destructive" | "warning" | "muted";
    edge?: "before" | "after";
};
interface TraceOptions {
    entries: TraceEntry[];
    palette?: LayerPalette;
    /** Which step is open elsewhere. */
    selectedId?: string | null;
    /** Dispatched with `{ stepId }` when a row is picked. */
    selectAction?: string;
}
interface TouchedOptions {
    items: TouchItem[];
    palette?: LayerPalette;
}
interface AttemptsOptions {
    rows: AttemptRow[];
    summary?: string;
}
/**
 * One file a step left, as **data**.
 *
 * `ArtifactTable`'s own `Artifact` types every cell as a `ReactNode`, which a
 * spec cannot be. These are strings: a board is fetched, stored beside a
 * plan and diffed, and a `ReactNode` survives none of that.
 */
interface ArtifactSpec {
    name: string;
    kind?: string;
    size?: string;
    /** The address — eight characters, drawn mono ([SR58]). */
    digest?: string;
    written?: string;
    /** Retention took the bytes. The row stays, struck. */
    gone?: boolean;
}
interface ArtifactsOptions {
    files: ArtifactSpec[];
    /** Dispatched with `{ digest, name, index }`. Omitted, the column is absent. */
    openAction?: string;
    downloadAction?: string;
}
/** One lens row under the layer it narrows. */
interface LensRowSpec {
    name: string;
    narrows?: Narrowing[];
    usage?: LensUsage;
}
/** One participant the world allowed, and what the run did with it ([SR53]). */
interface ParticipantSpec {
    address: string;
    /** `touched` · `never touched` · `refused` · `miss` — any word the engine writes. */
    verdict: string;
    /** What came back, or why nothing did — `1,284 rows · step 7`. */
    note?: string;
}
interface LensSectionSpec {
    layer: Layer;
    summary?: string;
    count?: number;
    /** Nothing narrows this layer. Drawn dim rather than dropped. */
    dim?: boolean;
    /**
     * **A section carries one of two readings, and they are different questions.**
     * `participants` is a *run's* lens — every address the world allowed, each
     * marked with what this execution did with it. `rows` is a *world's* — the
     * lenses that narrow this layer, as they read in the Govern drawer. A section
     * that gives both draws both, participants first.
     */
    participants?: ParticipantSpec[];
    rows?: LensRowSpec[];
}
interface LensOptions {
    sections: LensSectionSpec[];
    palette?: LayerPalette;
    /** Which lens is open elsewhere, by name. */
    selected?: string | null;
    /** Dispatched with `{ lens }` when a row is picked. */
    selectAction?: string;
}
interface ClarificationOption {
    label: string;
    /** The one that was taken. */
    chosen?: boolean;
}
interface ClarificationOptions {
    /** Who asked — `the agent asks`. */
    asker?: string;
    question: string;
    /** Why it had to ask, in the step's own terms. */
    why?: string;
    options?: ClarificationOption[];
    answerer?: string;
    answer?: string;
    /** What it cost and what happened next — `after 41.2s · resumed on round 2`. */
    answerNote?: string;
}
/**
 * The six kinds, as a type argument for `BoardSpec`.
 *
 * A `type` and not an `interface`: `ExtraPanels` is `Record<string, unknown>`,
 * which an interface never satisfies — it has no implicit index signature — so
 * an interface here would compile everywhere except at the one call site that
 * matters.
 */
type RunPanelOptions = {
    trace: TraceOptions;
    touched: TouchedOptions;
    attempts: AttemptsOptions;
    artifacts: ArtifactsOptions;
    lens: LensOptions;
    clarification: ClarificationOptions;
};
declare function TracePanel({ panel, options, onAction, }: PanelRendererProps<TraceOptions>): React.JSX.Element;
declare function TouchedPanel({ options }: PanelRendererProps<TouchedOptions>): React.JSX.Element;
declare function AttemptsPanel({ options }: PanelRendererProps<AttemptsOptions>): React.JSX.Element;
/** Merge into a board's registry to draw a run — see the note above. */
declare const RUN_PANELS: {
    trace: typeof TracePanel;
    touched: typeof TouchedPanel;
    attempts: typeof AttemptsPanel;
    artifacts: typeof ArtifactsPanel;
    lens: typeof LensPanel;
    clarification: typeof ClarificationPanel;
};
declare function ArtifactsPanel({ panel, options, onAction, }: PanelRendererProps<ArtifactsOptions>): React.JSX.Element;
declare function LensPanel({ panel, options, onAction }: PanelRendererProps<LensOptions>): React.JSX.Element;
declare function ClarificationPanel({ options, }: PanelRendererProps<ClarificationOptions>): React.JSX.Element;

export { type ActionContext, type ActionSpec, type AnyBoardSpec, type ArtifactSpec, type ArtifactsOptions, ArtifactsPanel, AttemptClock, type AttemptClockProps, type AttemptRow, type AttemptsOptions, AttemptsPanel, BLOCK_PANELS, BUILT_IN_PANELS, BlockPanel, type BlockPanelSpec, Board, type BoardPageSpec, BoardPages, type BoardPagesProps, type BoardPagesSpec, type BoardPatch, BoardPatchError, type BoardPatchOp, type BoardProps, type BoardSpec, type BuiltInPanelKind, type BuiltInPanelSpec, type ChipSpec, type ClarificationOption, type ClarificationOptions, ClarificationPanel, type CodeOptions, CodePanel, type CrumbMenuSpec, type CustomOptions, type EventSpec, type EventsOptions, EventsPanel, type ExchangeOptions, ExchangePanel, type ExtraPanels, type HeaderSpec, type InspectorSpec, type JsonOptions, JsonPanel, type LensOptions, LensPanel, type LensRowSpec, type LensSectionSpec, type ListOptions, ListPanel, type LogOptions, LogPanel, type PanelBase, type PanelOptions, type PanelOptionsByKind, type PanelRegistry, type PanelRenderer, type PanelRendererProps, type PanelSpec, type ParamsOptions, ParamsPanel, type ParticipantSpec, RUN_PANELS, RecordDescription, type RecordDescriptionDetail, type RecordDescriptionProps, type RegisteredPanelSpec, type RowSpec, type RunPanelOptions, SpecAction, SpecActions, SpecChip, SpecChips, StagedBar, type StagedBarItem, type StagedBarProps, type StagedSpec, type TabSpec, type TextOptions, TextPanel, type Tone, type TouchedOptions, TouchedPanel, type TraceEntry, type TraceOptions, TracePanel, applyBoardPatch, applyBoardPatches, resolveRegistry };
