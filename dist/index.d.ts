import * as React from 'react';
import { MetricTone } from '@invana/ui';

/**
 * Every block, by kind. A block that returns a value names its type in
 * `returns` (as the spec writes it) and is what an ask turn holds; the rest
 * only show data and are what an answer turn holds. Both are blocks.
 */
declare const BLOCKS: readonly [{
    readonly id: "confirm";
    readonly name: "Confirm";
    readonly returns: "boolean";
    readonly tier: "today";
}, {
    readonly id: "single";
    readonly name: "Single choice";
    readonly returns: "string";
    readonly tier: "today";
}, {
    readonly id: "multi";
    readonly name: "Multiple choice";
    readonly returns: "string[]";
    readonly tier: "today";
}, {
    readonly id: "quick";
    readonly name: "Quick pick";
    readonly returns: "string";
    readonly tier: "today";
}, {
    readonly id: "period";
    readonly name: "Period";
    readonly returns: "{from, to, label}";
    readonly tier: "today";
}, {
    readonly id: "number";
    readonly name: "Number";
    readonly returns: "number";
    readonly tier: "today";
}, {
    readonly id: "short";
    readonly name: "Short text";
    readonly returns: "string";
    readonly tier: "today";
}, {
    readonly id: "long";
    readonly name: "Long text";
    readonly returns: "string";
    readonly tier: "today";
}, {
    readonly id: "entity";
    readonly name: "Entity pick";
    readonly returns: "id[]";
    readonly tier: "next";
}, {
    readonly id: "scale";
    readonly name: "Scale";
    readonly returns: "1–5";
    readonly tier: "today";
}, {
    readonly id: "multistep";
    readonly name: "Multi-step";
    readonly returns: "Record<id, value>";
    readonly tier: "today";
}, {
    readonly id: "form";
    readonly name: "Form";
    readonly returns: "Record<field, value>";
    readonly tier: "next";
}, {
    readonly id: "weights";
    readonly name: "Weights";
    readonly returns: "Record<objective, 0–100>";
    readonly tier: "today";
}, {
    readonly id: "approval";
    readonly name: "Approval";
    readonly returns: "approve | reject";
    readonly tier: "today";
}, {
    readonly id: "interpretation";
    readonly name: "Interpretation";
    readonly returns: "Record<slot, value>";
    readonly tier: "today";
}, {
    readonly id: "fork";
    readonly name: "Reading fork";
    readonly returns: "readingId";
    readonly tier: "next";
}, {
    readonly id: "plan";
    readonly name: "Plan preview";
    readonly returns: "stepId[]";
    readonly tier: "next";
}, {
    readonly id: "modelspec";
    readonly name: "Model spec";
    readonly returns: "{outcome, predictors[], group?, controls[]}";
    readonly tier: "next";
}, {
    readonly id: "hypothesis";
    readonly name: "Hypothesis";
    readonly returns: "{test, tails, alpha}";
    readonly tier: "next";
}, {
    readonly id: "range";
    readonly name: "Range";
    readonly returns: "{min, max}";
    readonly tier: "next";
}, {
    readonly id: "suggestions";
    readonly name: "Suggestions";
    readonly returns: "string";
    readonly tier: "today";
}, {
    readonly id: "narrative";
    readonly name: "Narrative";
    readonly tier: "today";
}, {
    readonly id: "metric";
    readonly name: "Metric";
    readonly tier: "today";
}, {
    readonly id: "grid";
    readonly name: "Metric grid";
    readonly tier: "today";
}, {
    readonly id: "table";
    readonly name: "Table preview";
    readonly tier: "today";
}, {
    readonly id: "attr";
    readonly name: "Attribute matrix";
    readonly tier: "today";
}, {
    readonly id: "record";
    readonly name: "Record";
    readonly tier: "today";
}, {
    readonly id: "ranked";
    readonly name: "Ranked list";
    readonly tier: "today";
}, {
    readonly id: "timeseries";
    readonly name: "Time series";
    readonly tier: "today";
}, {
    readonly id: "bars";
    readonly name: "Bar comparison";
    readonly tier: "next";
}, {
    readonly id: "waterfall";
    readonly name: "Bridge";
    readonly tier: "next";
}, {
    readonly id: "matrix";
    readonly name: "Matrix";
    readonly tier: "next";
}, {
    readonly id: "funnel";
    readonly name: "Funnel";
    readonly tier: "next";
}, {
    readonly id: "histogram";
    readonly name: "Distribution";
    readonly tier: "next";
}, {
    readonly id: "timeline";
    readonly name: "Timeline";
    readonly tier: "today";
}, {
    readonly id: "subgraph";
    readonly name: "Subgraph";
    readonly tier: "later";
}, {
    readonly id: "method";
    readonly name: "Method";
    readonly tier: "today";
}, {
    readonly id: "citations";
    readonly name: "Citations";
    readonly tier: "today";
}, {
    readonly id: "files";
    readonly name: "Files";
    readonly tier: "today";
}, {
    readonly id: "proposal";
    readonly name: "Proposal";
    readonly tier: "today";
}, {
    readonly id: "cannot";
    readonly name: "Cannot answer";
    readonly tier: "today";
}, {
    readonly id: "caveat";
    readonly name: "Caveat";
    readonly tier: "today";
}, {
    readonly id: "scope";
    readonly name: "Scope line";
    readonly tier: "today";
}, {
    readonly id: "checks";
    readonly name: "Checks";
    readonly tier: "next";
}, {
    readonly id: "trace";
    readonly name: "Progress trace";
    readonly tier: "today";
}, {
    readonly id: "activity";
    readonly name: "Layer activity";
    readonly tier: "today";
}, {
    readonly id: "gantt";
    readonly name: "Task timeline";
    readonly tier: "today";
}, {
    readonly id: "heatstrip";
    readonly name: "Heat strip";
    readonly tier: "today";
}, {
    readonly id: "test";
    readonly name: "Test result";
    readonly tier: "next";
}, {
    readonly id: "coef";
    readonly name: "Coefficients";
    readonly tier: "next";
}, {
    readonly id: "forest";
    readonly name: "Forest plot";
    readonly tier: "next";
}, {
    readonly id: "scatter";
    readonly name: "Scatter";
    readonly tier: "next";
}, {
    readonly id: "box";
    readonly name: "Box plot";
    readonly tier: "next";
}, {
    readonly id: "correlation";
    readonly name: "Correlation";
    readonly tier: "next";
}, {
    readonly id: "control";
    readonly name: "Control chart";
    readonly tier: "next";
}, {
    readonly id: "pareto";
    readonly name: "Pareto";
    readonly tier: "next";
}, {
    readonly id: "survival";
    readonly name: "Survival curve";
    readonly tier: "next";
}, {
    readonly id: "tornado";
    readonly name: "Tornado";
    readonly tier: "next";
}, {
    readonly id: "decomposition";
    readonly name: "Decomposition";
    readonly tier: "next";
}, {
    readonly id: "modeleval";
    readonly name: "Model evaluation";
    readonly tier: "next";
}, {
    readonly id: "pivot";
    readonly name: "Pivot";
    readonly tier: "next";
}, {
    readonly id: "profile";
    readonly name: "Column profile";
    readonly tier: "next";
}, {
    readonly id: "evidence";
    readonly name: "Evidence strength";
    readonly tier: "next";
}, {
    readonly id: "dumbbell";
    readonly name: "Dumbbell";
    readonly tier: "next";
}, {
    readonly id: "quantiles";
    readonly name: "Quantiles";
    readonly tier: "today";
}];
type Block$1 = (typeof BLOCKS)[number];
/** Every block's kind. */
type BlockKind = Block$1["id"];
/** The kinds an ask turn can hold: the blocks that return a value. */
type AskKind = Extract<Block$1, {
    returns: string;
}>["id"];
/** The kinds an answer turn can hold: the blocks that only show data. */
type AnswerKind = Exclude<BlockKind, AskKind>;
/** The blocks that return a value, and those that only show data. */
declare const ASK_KINDS: readonly AskKind[];
declare const ANSWER_KINDS: readonly AnswerKind[];

/**
 * Value types: every figure an answer shows is one of these, written one way
 * by `formatValue`. The unit vocabulary inside `quantity` is open.
 */
declare const VALUE_TYPES: readonly [{
    readonly id: "quantity";
    readonly name: "Quantity with unit";
    readonly example: "2,480 kg/ha · 26 d";
}, {
    readonly id: "currency";
    readonly name: "Currency";
    readonly example: "£84k · −£620k · £4.1M";
}, {
    readonly id: "percent";
    readonly name: "Share";
    readonly example: "76% · 8.2%";
}, {
    readonly id: "pp";
    readonly name: "Percentage points";
    readonly example: "+4.8 pts · ▼ 1.8 pts";
}, {
    readonly id: "bp";
    readonly name: "Basis points";
    readonly example: "+12 bp";
}, {
    readonly id: "ratio";
    readonly name: "Ratio or index";
    readonly example: "OR 1.29 · beta 0.38 · 1.3×";
}, {
    readonly id: "rate";
    readonly name: "Rate per N";
    readonly example: "8.2 per 100 discharges";
}, {
    readonly id: "count";
    readonly name: "Count with n";
    readonly example: "1,284 plots · n = 1,061";
}, {
    readonly id: "duration";
    readonly name: "Duration";
    readonly example: "1.2 s · 3 min · 26 d";
}, {
    readonly id: "estimate";
    readonly name: "Estimate with interval";
    readonly example: "1.29 (95% CI 1.04–1.60)";
}, {
    readonly id: "pvalue";
    readonly name: "p-value";
    readonly example: "p = 0.02 · p < 0.001";
}, {
    readonly id: "score";
    readonly name: "Ordinal score";
    readonly example: "7 / 9 · 4 of 5";
}, {
    readonly id: "time";
    readonly name: "Point in time";
    readonly example: "as of 29 Sep 06:00 · Q3 2026";
}];
type ValueTypeId = (typeof VALUE_TYPES)[number]["id"];

/**
 * A figure with its type, written one way by `formatValue`. Until that lands
 * in `@invana/ui`, a figure may also arrive already written, as a string.
 */
interface TypedValue {
    value: number;
    type: ValueTypeId;
    /** Open vocabulary — `kg/ha`, `plots`, `pollinations`. */
    unit?: string;
    /** The interval of an estimate, with its level. */
    ci?: [number, number];
    level?: number;
    /** The count the figure rests on. */
    n?: number;
}
type Figure = string | number | TypedValue;
/** A table cell that says whether its change is good or bad. */
type Cell = Figure | null | {
    value: Figure;
    tone?: "good" | "bad";
    strong?: boolean;
};
type Tone = "good" | "bad" | "warn" | "neutral";
interface NarrativeOptions {
    /**
     * Two or three sentences, leading with the number. `**…**` marks a figure;
     * `[n]` places the marker for source n where the clause it backs ends; a
     * figure led by `▲` or `▼` is drawn in the tone of its direction.
     */
    text: string;
    /** Markers appended after the text, for prose that places none of its own. */
    cites?: number[];
    /** The source the reader is on: its marker is lit, as is its row in the citations. */
    active?: number;
}
interface MetricOptions {
    label: string;
    /** `null` when there is no figure to give; `delta` then says why. Drawn as a muted `—`. */
    value: Figure | null;
    /** The comparison, already worded — `▲ 3 pts vs Q2 · target 110%`. */
    delta?: string;
    tone?: Tone;
    /**
     * A bar under the figure: `value` against `target` on a scale from `min` to
     * `max`, with the scale's ends and the target written under it in `unit`.
     * Without a `target` it is a plain meter — how full a value with a real
     * ceiling is (`{ value: 0.42, max: 1 }`), with nothing written under it.
     */
    gauge?: {
        value: number;
        target?: number;
        min?: number;
        max: number;
        unit?: string;
    };
    /** The recent run of the figure, oldest first, drawn as a sparkline beside it. */
    trend?: number[];
    /** Set on the warning ground: the one figure in a band that needs a second look. */
    flag?: boolean;
}
interface Column {
    key: string;
    label: string;
    align?: "left" | "right";
    /** Set the column in the mono face — an id, a key, a timestamp. */
    mono?: boolean;
}
/** One label/value pair in a record. */
interface RecordRow {
    label: string;
    value: string;
    /** Where the value came from — `last year's promotions`, `your input`. */
    source?: string;
    /** `false` sets the value in the body face — prose rather than an id or a figure. */
    mono?: boolean;
}
/** The options of the blocks first shared by the conversation and the page. */
interface SharedAnswerOptions {
    narrative: NarrativeOptions;
    metric: MetricOptions;
    grid: {
        tiles: MetricOptions[];
        /**
         * Fit as many tiles across as this width allows, in px — a strip of five or
         * six on a wide panel. Unset, three across, and four sit two by two.
         */
        minTileWidth?: number;
    };
    table: {
        columns: Column[];
        rows: Record<string, Cell>[];
        /** How many rows exist; more than `rows` draws `Open all`, which sends the `open` action. */
        total?: number;
        noun?: string;
        /** What follows the count — `sorted by Δ`, `7 columns`. */
        note?: string;
        /** The column the rows are ordered by, marked in its header. */
        sort?: {
            key: string;
            dir: "asc" | "desc";
        };
        /** Rows called out, by index in `rows`. */
        highlight?: number[];
        /** A total row under the rows, set bold. */
        totals?: Record<string, Cell>;
        /**
         * The column whose value names a row. Set, a row can be picked: a click
         * sends the `select` action with that row's value.
         */
        rowKey?: string;
        /** The `rowKey` value of the row drawn selected. */
        selected?: string | null;
    };
    record: {
        rows?: RecordRow[];
        /** Rows under headings — `Identity`, `Performance, semi-arid`. Drawn after `rows`. */
        groups?: {
            label: string;
            rows: RecordRow[];
        }[];
        /** Who or what the record is, above its rows, with its state as a tag. */
        header?: {
            title: string;
            initials?: string;
            status?: {
                label: string;
                tone?: Tone;
            };
        };
    };
    ranked: {
        /** `muted` is the rest folded into one line — `3 others`. */
        items: {
            label: string;
            value: number;
            display?: string;
            muted?: boolean;
        }[];
        /** Bars grow both ways from a zero rule, with what each side means under them. */
        diverging?: {
            below: string;
            above: string;
        };
    };
    timeseries: {
        /**
         * The first is the line; the rest are drawn behind it to read it against —
         * last year beside this — each named at its right end. A point with no
         * value — `null` — breaks the line rather than bridging the gap.
         */
        series: {
            name: string;
            points: [string, number | null][];
        }[];
        band?: {
            label?: string;
            lower: number;
            upper: number;
        };
        /**
         * A line to read against — an alert level, a budget — drawn dashed and
         * named at the right. Every point above it is ringed in the `bad` tone.
         */
        reference?: {
            value: number;
            label: string;
        };
        forecastFrom?: string;
        /** Names the forecast boundary — `today`. Without one the rule is unlabelled. */
        forecastLabel?: string;
        marks?: {
            at: string;
            label?: string;
            tone?: Tone;
        }[];
        unit?: string;
    };
    bars: {
        groups: string[];
        /** `muted` draws a series as the comparison — last quarter behind this one. */
        series: {
            name: string;
            values: number[];
            muted?: boolean;
        }[];
        target?: {
            value: number;
            label: string;
        };
        /** A plan per group, drawn as a dashed column the actual stands inside. */
        plan?: {
            name: string;
            values: number[];
        };
        highlight?: string;
        unit?: string;
    };
}
/**
 * What every ask says before its control. `hint`, where an ask has one, is the
 * line under it: `**bold**` marks a figure and `` `Enter` `` a key.
 */
interface AskText {
    /** The question. `**bold**` marks what matters in it. */
    question: string;
    /** A muted line under the question — what the answer is used for. Makes the question a heading. */
    description?: string;
    /** Set the question as a heading, bold — a short question over a longer body. */
    heading?: boolean;
    /** What the answer is called once settled, in its summary — `Margin`, `Yield floor`. */
    label?: string;
}
/** A figure on the right of a choice — `2,480` over `kg/ha`, `−8.4%` over `vs LY`. */
interface ChoiceFigure {
    value: string;
    unit?: string;
    tone?: Tone;
}
/** A choice the data model holds. `detail` names where it comes from. */
interface ChoiceOption {
    value: string;
    label: string;
    detail?: string;
    disabled?: boolean;
    /** Why it is off or on — `on the causal path`. */
    note?: string;
    /** A second line under the label — `Adjusts for seasonality`. */
    description?: string;
    /** A short tag in a box before the label — `BV`. */
    lead?: string;
    /**
     * An icon in that box instead: the path data of a 16×16 stroked icon, so
     * the API can send one without the kit shipping an icon set.
     */
    icon?: string;
    /** What picking it would give, on the right in place of `detail`. */
    figure?: ChoiceFigure;
    /** How the pick reads in a summary, when not as its label — `Semi-arid, 3 sites`. */
    summary?: string;
}
/** One figure of what yes costs — `2.3B` `rows scanned`. */
interface CostFigure {
    label: string;
    /** The figure. `about **40 s**` bolds only the figure in a `line`. */
    value: string;
    /** `warn` for a cost that changes something — records it writes. */
    tone?: Tone;
}
interface ConfirmOptions extends AskText {
    /** What yes costs, stated before the buttons: the rows it scans, the time it takes, what it writes. */
    cost?: CostFigure[];
    /**
     * `line` writes the cost as a sentence under the question, each figure
     * before its label; `strip` sets the figures in cells, each label above.
     * @default "line"
     */
    costAs?: "line" | "strip";
    /** Something the analyst should weigh before answering — `data gap`. */
    caveat?: {
        label: string;
        text: string;
    };
    yes: string;
    no: string;
    default?: boolean;
    /** The no is a dismissal — `Not now` — and draws quiet. */
    dismiss?: boolean;
    /**
     * `end` sets the default at the card's right edge, the other at its left;
     * `start` sets them together at the left, the default first.
     * @default "start"
     */
    align?: "start" | "end";
    /** How the decision reads once made — `Narrowed to Q3 first`. Defaults to the button's words. */
    settled?: {
        yes?: string;
        no?: string;
    };
    hint?: string;
}
interface SingleOptions extends AskText {
    options: ChoiceOption[];
    default?: string;
    /** Offer an “Other…” choice, answered in the analyst's own words. */
    other?: boolean;
    /** Send with a button of these words — `Next` — rather than on the pick. */
    submit?: string;
    /** Offer Skip, which keeps the default. */
    skippable?: boolean;
    hint?: string;
}
interface MultiOptions extends AskText {
    options: ChoiceOption[];
    default?: string[];
    min?: number;
    max?: number;
    /**
     * The submit's words, `{count}` standing for how many are ticked — `Hold
     * {count} fixed`. Defaults to the question's own verb, or `Use {count} selected`.
     */
    submit?: string;
    /** Offer Select all beside the question. */
    selectAll?: boolean;
    hint?: string;
}
/** One row of a quick ask: a question and two to five short answers. */
interface QuickPick {
    question: string;
    /** What the answer is called once settled, in its summary — `Trend by`. */
    label?: string;
    /** Each option; `sub` is a second line under it — `±1.4 pp`. */
    options: {
        value: string;
        label: string;
        sub?: string;
    }[];
    default?: string;
    hint?: string;
}
interface QuickOptions extends AskText, QuickPick {
    /** Stretch the row across the card, each option an equal share. */
    stretch?: boolean;
    /**
     * Further rows answered in the same card — `Confidence level` under `Show
     * the trend by`. With any, the value is keyed: `id` for each of these,
     * `label` (or the question) for the first.
     */
    more?: (QuickPick & {
        id: string;
    })[];
}
interface PeriodOptions {
    question: string;
    options: {
        value: string;
        label: string;
        from: string;
        to: string;
    }[];
    default?: string;
    custom?: boolean;
    hint?: string;
}
interface NumberOptions extends AskText {
    unit?: string;
    min?: number;
    max?: number;
    step?: number;
    default?: number;
    hint?: string;
}
interface ShortOptions {
    question: string;
    default?: string;
    hint?: string;
}
interface LongOptions {
    question: string;
    placeholder?: string;
    optional?: boolean;
}
interface EntityOptions {
    question: string;
    /** Suggested or found entities, each with its type. */
    results: {
        id: string;
        label: string;
        type?: string;
    }[];
    default?: string[];
    /** An action that runs once the pick is made — `Simulate 3 crosses`. */
    submit?: string;
    hint?: string;
}
interface ScaleOptions {
    question: string;
    min: number;
    max: number;
    low?: string;
    high?: string;
    default?: number;
}
interface MultistepOptions {
    /**
     * Each step is an ask of its own; the value is keyed by step id. A
     * `required` step holds Next back until it is answered, and has no Skip.
     */
    steps: ({
        id: string;
        required?: boolean;
    } & AskSpec)[];
    /** Show the answers for a last look, each with Edit, before they are sent. */
    review?: boolean;
}
/** One choice of a form field's `select` or `radio`. */
interface FormOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}
interface FormOptions extends AskText {
    /**
     * `side` sets each label in a column at the left; `top` sets it over its
     * field, two fields to a row where the card is wide enough.
     * @default "side"
     */
    labels?: "side" | "top";
    fields: {
        name: string;
        label: string;
        /**
         * `textarea` is several lines of text; `checkbox` a yes/no with its label
         * beside the box; `radio` one of `options` drawn as a list, `select` one
         * of them in a menu.
         */
        type: "number" | "text" | "date" | "select" | "textarea" | "checkbox" | "radio";
        unit?: string;
        /** A `checkbox` takes `true`/`false`; `select` and `radio` an option's `value`. */
        default?: string | number | boolean;
        /**
         * The choices of a `select` or `radio`. A `description` is a muted line
         * under a radio's label; a `disabled` choice shows but can't be picked.
         */
        options?: FormOption[];
        /** A `textarea`'s visible lines. */
        rows?: number;
        /** Text shown in an empty `text` or `textarea`. */
        placeholder?: string;
        /** Must be answered — for a `checkbox`, ticked. Holds the submit back until it is. */
        required?: boolean;
        /** Shown with its value but not changeable; the value is still sent. */
        disabled?: boolean;
        /** Shown beside the value — `quoted 14 d`. */
        aside?: string;
        /** A line under the field — `From last year's promotions`. */
        hint?: string;
        /** The section the field sits in, under its name — `Price`, `Timing`. */
        group?: string;
        /** A number must be greater than this — an elasticity `above` 0. */
        above?: number;
        /** A number must be less than this. */
        below?: number;
    }[];
    submit?: string;
    hint?: string;
}
interface WeightsOptions {
    question: string;
    objectives: {
        id: string;
        label: string;
    }[];
    default: Record<string, number>;
    total?: number;
    hint?: string;
}
interface ApprovalOptions {
    rows: {
        label: string;
        value: string;
    }[];
    consequence: string;
    actions: ActionOption[];
}
interface InterpretationOptions {
    question?: string;
    slots: {
        id: "measure" | "window" | "population" | "baseline" | (string & {});
        label: string;
        value: string;
    }[];
}
interface ForkOptions {
    question: string;
    readings: {
        id: string;
        label: string;
        preview?: string;
        hint?: string;
    }[];
    default?: string;
}
interface PlanOptions {
    question?: string;
    steps: {
        id: string;
        label: string;
        cost?: string;
        on: boolean;
    }[];
    submit?: string;
}
interface ModelSpecOptions {
    question?: string;
    outcome: {
        field: string;
        type: string;
    };
    predictors: string[];
    controls: string[];
    group?: string;
    hint?: string;
}
interface HypothesisOptions {
    question: string;
    test: string;
    /** Why this test — shown beside it as `suggested`. */
    suggested?: boolean;
    tails: 1 | 2;
    alpha: number;
    hint?: string;
}
interface RangeOptions {
    question: string;
    unit?: string;
    default: {
        min: number;
        max: number;
    };
    hint?: string;
}
/**
 * Follow-ups after an answer, each a whole prompt that reuses the current
 * scope. The reply is the one picked, and the API sends it on as the next
 * prompt; the one picked stays, dimmed.
 */
interface SuggestionsOptions {
    items?: string[];
    /** Follow-ups under a heading each — `Go deeper`, `Act`. */
    groups?: {
        label: string;
        items: string[];
    }[];
    /** `stack` puts one per line, full width. Narrow threads stack on their own. */
    layout?: "wrap" | "stack";
}
/**
 * Kind → the options it reads.
 *
 * Keyed by exactly the grammar's ask kinds; `grammar.test.ts` checks it.
 */
interface AskOptionsByKind {
    confirm: ConfirmOptions;
    single: SingleOptions;
    multi: MultiOptions;
    quick: QuickOptions;
    period: PeriodOptions;
    number: NumberOptions;
    short: ShortOptions;
    long: LongOptions;
    entity: EntityOptions;
    scale: ScaleOptions;
    multistep: MultistepOptions;
    form: FormOptions;
    weights: WeightsOptions;
    approval: ApprovalOptions;
    interpretation: InterpretationOptions;
    fork: ForkOptions;
    plan: PlanOptions;
    modelspec: ModelSpecOptions;
    hypothesis: HypothesisOptions;
    range: RangeOptions;
    suggestions: SuggestionsOptions;
}
/** Kind → the type of the value the analyst's reply carries. */
interface AskValueByKind {
    confirm: boolean;
    single: string;
    multi: string[];
    /** Keyed by row when the ask has `more` rows. */
    quick: string | Record<string, string>;
    period: {
        from: string;
        to: string;
        label: string;
    };
    number: number;
    short: string;
    long: string;
    entity: string[];
    scale: number;
    multistep: Record<string, unknown>;
    form: Record<string, unknown>;
    weights: Record<string, number>;
    approval: "approve" | "reject";
    interpretation: Record<string, string>;
    fork: string;
    plan: string[];
    modelspec: {
        outcome: string;
        predictors: string[];
        group?: string;
        controls: string[];
    };
    hypothesis: {
        test: string;
        tails: 1 | 2;
        alpha: number;
    };
    range: {
        min: number;
        max: number;
    };
    /** The follow-up picked, as it reads. */
    suggestions: string;
}
interface ActionOption {
    id: string;
    label: string;
    variant?: "primary" | "secondary" | "ghost" | "link";
    /** Starts the right-hand group: this action and those after it sit at the far end. */
    push?: boolean;
}
interface MethodOptions {
    /** The word on the line — `method`, `query`, `model`, `3 steps`. */
    label?: string;
    /** The formula, query or model. `**…**` marks its keywords. */
    code?: string;
    /** At the right of the line — `12,408 rows · 18 ms`. */
    meta?: string;
    /** What the model rests on, under the code — `Plots 1,284`. */
    facts?: {
        label: string;
        value: string;
    }[];
    /** A method of several steps, in order, each with its count or time. */
    steps?: {
        label: string;
        detail?: string;
    }[];
    /** Drawn open. Closed, the line alone says what was run. */
    open?: boolean;
}
interface CitationSource {
    label: string;
    count?: Figure;
    /** What kind of source and how fresh — `table · loaded 28 Sep 06:00`. */
    detail?: string;
}
interface CitationsOptions {
    sources: CitationSource[];
    /** The source the reader is on, lit with its marker in the prose. */
    active?: number;
    /** One line — `▸ 3 sources`, the record total at the right — until opened. */
    folded?: boolean;
    /** Said under the sources. When they hold no records it is said as a warning. */
    note?: string;
}
interface ProposalOptions {
    /** Where it came from, on the card's header — `from this answer`. */
    title?: string;
    /** What it proposes, in one line above the draft. */
    heading?: string;
    /** The draft, label by label. */
    rows?: {
        label: string;
        value: string;
    }[];
    /** What writing it does, as figures — `Rules 1`, `Recipients 214`. */
    figures?: {
        label: string;
        value: string;
    }[];
    /** What writing it does, in words. */
    consequence?: string;
    actions: ActionOption[];
    /** Written: the stamp that says so, and when, on the header. */
    done?: {
        label: string;
        at?: string;
    };
}
interface CannotOptions {
    reason: string;
    remedy: string;
    /** Nearby questions the data can answer; each is sent as a `prompt`. */
    nearest?: string[];
    /** Answered for part of what was asked; the reason says which part is missing. */
    partial?: boolean;
}
type CaveatTone = "warning" | "info" | "bad";
interface CaveatNoteOptions {
    label: string;
    text: string;
    /** `warning` (the default) qualifies; `info` says what was filled in; `bad` says what is wrong with the data. */
    tone?: CaveatTone;
    /** A link after the text — `Show the 4 stores` — sent as an `action` event. */
    action?: {
        id: string;
        label: string;
    };
}
/** One caveat, or several folded behind one line — `▸ 2 caveats`. */
type CaveatOptions = (CaveatNoteOptions & {
    items?: never;
    folded?: never;
}) | {
    items: CaveatNoteOptions[];
    folded?: boolean;
    label?: never;
    text?: never;
};
interface ScopePart {
    text: string;
    /** `changed` — this part differs from the question it was carried from; `stale` — the data behind it is late. */
    mark?: "changed" | "stale";
    /** What this part can be changed to; opening the part lists them. */
    choices?: {
        value: string;
        label: string;
        detail?: string;
    }[];
}
interface ScopeOptions {
    parts: (string | ScopePart)[];
    /** The line under the scope. Said as a warning when a part is stale. */
    hint?: string;
    /** The part whose choices are showing — a restored view, or a story. */
    openPart?: number;
}
/** One lane of the activity block: a layer, or a part of one when its parent is opened. */
interface ActivityLane {
    id: string;
    /** `Graph`, `Third party`, `Company.revenue`. */
    label: string;
    /** What the lane is called at 280px — `3rd party`. Defaults to `label`. */
    short?: string;
    /** At the right — `6.9K/s`, `86k tok`, `2 refused`, `quiet`. `—` when the layer is off. */
    rate?: string;
    /** The rate is high: drawn in the info tone. `bad` draws it in the destructive tone. */
    rateTone?: "hot" | "bad";
    /** The layer is not open to this run: its label is muted, its cells hollow. */
    off?: boolean;
    /** How busy each slice was, `0`–`1`, oldest first; `null` not touched. */
    cells: (number | null)[];
    /** Slices a rule refused, or where data left the boundary. */
    marks?: {
        at: number;
        kind: "refused" | "egress";
    }[];
    /** Its parts — a model's types and relations — drawn under it, indented, when it is open. */
    children?: ActivityLane[];
    /** Drawn open. The reader can open and close it either way. */
    open?: boolean;
}
/** The operation behind a pinned slice — what the run did in that cell. */
interface ActivityPin {
    /** The lane it is on, by id. */
    lane: string;
    /** The cell. */
    at: number;
    /** `Company.revenue · write`. */
    title: string;
    /** `4.25–4.50 s`. */
    time?: string;
    /** The statement, in mono — `SET c.revenue_q3 = $value · 512 rows`. */
    query?: string;
    rows?: {
        label: string;
        value: string;
    }[];
    /** Under the record — `1 of 3 operations in this window`. */
    note?: string;
    /** Sent as an `action` event — `Open in the trace`. */
    action?: ActionOption;
}
interface ActivityOptions {
    /** `live` follows the last seconds; `settled` is the whole run; `stale` has lost the signal. */
    state?: "live" | "settled" | "stale";
    /** The steps over the lanes, in order, each as wide as its share of the axis. */
    bands?: {
        label: string;
        span: number;
        current?: boolean;
    }[];
    /** Labels spread under the lanes — `0 s`, `10 s`, `21 s`. */
    axis?: string[];
    lanes: ActivityLane[];
    /** What one cell covers, for its title — `250 ms`. */
    cell?: string;
    /** A line under the lanes — `Third party only in step 3`. `**bold**` as in a narrative. */
    hint?: string;
    /** Show the key: touched, refused, left the boundary. */
    legend?: boolean;
    /** A slice held open, with its record under the lanes. */
    pinned?: ActivityPin;
    /** At the foot — `Open run detail` — sent as `action` events. */
    actions?: ActionOption[];
}
/** A bar's state on the gantt — the engine's own step statuses, as `Gantt` reads them; `refused` is what a rule stopped. */
type GanttSpecStatus = "succeeded" | "running" | "failed" | "needs_input" | "stopped" | "skipped" | "queued" | "refused";
/** One bar on a row that holds many — a task a worker slot ran, a layer a task reached. */
interface GanttSpecBar {
    startMs?: number;
    durationMs?: number;
    status?: GanttSpecStatus;
    /** The hover text. */
    title?: string;
    /** Names the bar: picking it sends `select` with this key, not the row's. */
    key?: string;
    /** Written in the bar. */
    label?: string;
    /** Which `palette` entry paints it, instead of its status. */
    group?: string;
    /** `outline` is time held, not spent; `dashed` is time that may be spent. */
    variant?: "solid" | "outline" | "dashed";
    /** A second line under the label — `1,204 of 1,251`. */
    note?: string;
    /** A badge at the bar's end — `{ "label": "503", "tone": "bad" }`. */
    chip?: {
        label: string;
        tone?: Tone;
    };
    /** The bar's own hover card. Any one of these opens it. */
    summary?: string;
    result?: Record<string, string | number>;
    error?: {
        code?: string;
        message?: string;
    };
    log?: string;
}
/** One task of a run, on its clock — and the tasks it split into. */
interface GanttSpecRow {
    /** `task_key` — what the log calls it. Also the row's label. */
    key: string;
    /** A human name for the row, instead of the key. */
    label?: string;
    /** From the run's zero. A task with neither, and no subtasks, never ran. */
    startMs?: number;
    durationMs?: number;
    status?: GanttSpecStatus;
    /** Earlier attempts, oldest first — the rate-limited fetch before the retry that stuck. */
    attempts?: {
        startMs?: number;
        durationMs?: number;
        status?: GanttSpecStatus;
        title?: string;
    }[];
    /** Many bars on one row, each its own thing — what a worker slot held, in order. */
    segments?: GanttSpecBar[];
    /** The right-hand cell, instead of the duration — `59% busy`. */
    duration?: string;
    /** A sentence under the hover card's header. */
    summary?: string;
    /** What it said last — the card's foot. */
    log?: string;
    error?: {
        code?: string;
        message?: string;
    };
    /** What it produced, as label/value pairs on the card — `{ rows: 412 }`. */
    result?: Record<string, string | number>;
    /** The tasks it split into, indented under it. A task with no timing draws their stretch. */
    subtasks?: GanttSpecRow[];
    /** Drawn open. The reader can open and close it either way. */
    open?: boolean;
}
interface GanttOptions {
    /** In plan order. */
    tasks: GanttSpecRow[];
    /** The clock's ceiling — the run's length. Defaults to the last end. */
    spanMs?: number;
    /** The *now* line, while the run is in flight. */
    nowMs?: number;
    /** The run has not decided its length yet: the last tick reads `8s+`. */
    openEnded?: boolean;
    /** Intervals on the axis. `4` by default. */
    ticks?: number;
    /** The key column, in px. Defaults to the longest key, up to 40%. */
    labelWidth?: number;
    /** The duration column, in px — set alike on Gantts stacked over one clock. */
    durationWidth?: number;
    density?: "compact" | "comfortable";
    /** The task picked — a restored view. Picking one sends `select` with its key. */
    selected?: string;
    /** A segment's `group` → the class that paints it — `{ "ingest": "bg-data-1" }`. */
    palette?: Record<string, string>;
    /** Gates — a moment the run held and spent nothing — ruled under the row they follow. */
    seams?: GanttSpecSeam[];
    /**
     * What the clock counts. `elapsed` (the default) is milliseconds from the
     * run's zero. `seq` is a plan read in order, before it runs: `startMs` and
     * `durationMs` are step numbers, ticks read `step 3`, durations `2 steps`.
     */
    scale?: "elapsed" | "seq";
}
/** A gate, ruled across the stretch of clock it held. */
interface GanttSpecSeam {
    /** The row it follows, by key. */
    after: string;
    /** The label column's word — `approval`. */
    label: string;
    startMs: number;
    durationMs?: number;
    /** Written on the rule — `held for approval`. */
    note?: string;
}
/** One state a heat strip's square can be in — named in the legend, coloured by its tone. */
interface HeatStripState {
    key: string;
    label: string;
    /** `good` · `bad` · `warn`; `neutral` (the default) is the muted ink. */
    tone?: Tone;
    /** A ring, not a fill — for "nothing happened here". */
    hollow?: boolean;
}
interface HeatStripCell {
    /** When — `9:45`. In the square's title. */
    at: string;
    /** Its state, by key. */
    state: string;
    /** More for the title — `2 names: BPCL, HINDPETRO`. */
    detail?: string;
}
/** One labelled strip, and the strips it opens into. */
interface HeatStripRowOptions {
    id: string;
    label: string;
    cells: HeatStripCell[];
    children?: HeatStripRowOptions[];
    /** Drawn open. The reader can open and close it either way. */
    open?: boolean;
}
interface HeatStripOptions {
    states: HeatStripState[];
    /** One strip. Send this or `rows`. */
    cells?: HeatStripCell[];
    /** Labelled strips over one axis, each opening into its `children`. */
    rows?: HeatStripRowOptions[];
    /** Labels under the squares, by index — `[{ at: 0, label: "09" }]`. */
    ticks?: {
        at: number;
        label: string;
    }[];
}
/** One dated event of the timeline block — and the smaller events it breaks into. */
interface TimelineEvent {
    when: string;
    text: string;
    tone?: Tone;
    /** A second line under the text. */
    detail?: string;
    /** Starts a labelled run of events — `Before`, `Spike`, `After`. */
    section?: string;
    /** Calls the event out. */
    highlight?: boolean;
    /** The events it breaks into — a customs hold into its steps — drawn under it when it is open. */
    children?: TimelineEvent[];
    /** Drawn open. The reader can open and close it either way. */
    open?: boolean;
}
interface TraceOptions {
    steps: TraceStep[];
    /** One line — `▸ 4 steps` with `summary` at the right — until opened. */
    folded?: boolean;
    /** At the right of the folded line — `4.2 s · 16,319 rows`. */
    summary?: string;
    /** Under a failed step — `Retry`, `Skip this step` — sent as `action` events. */
    actions?: ActionOption[];
}
/** A file an answer hands over. */
interface FileItem {
    name: string;
    size?: string;
    /** Eight characters, mono — what a reader quotes. */
    digest?: string;
    /** What the file is, in a line — `412 rows · missing store code`. */
    note?: string;
    /** A word on the file's state — `rejected`. */
    status?: {
        label: string;
        tone?: Tone;
    };
}
interface AnswerOptionsByKind extends SharedAnswerOptions {
    attr: {
        columns: (Column & {
            dir?: "higher" | "lower";
        })[];
        rows: Record<string, Cell>[];
        total?: number;
        noun?: string;
    };
    waterfall: {
        start?: {
            label: string;
            value: number;
        };
        steps: {
            label: string;
            value: number;
        }[];
        end: {
            label: string;
            value: number;
        };
        unit?: string;
    };
    matrix: {
        rows: string[];
        cols: string[];
        values: (number | null)[][];
        scale: "sequential" | "diverging";
    };
    funnel: {
        steps: {
            label: string;
            count: number;
        }[];
    };
    histogram: {
        bins: {
            from: number;
            to: number;
            count: number;
        }[];
        threshold?: {
            value: number;
            label: string;
        };
        outliers?: number;
        unit?: string;
    };
    timeline: {
        /**
         * `detail` is a second line under the text. `section` starts a labelled run
         * of events — `Before`, `Spike`, `After`; `highlight` calls one out.
         */
        events: TimelineEvent[];
    };
    subgraph: {
        nodes: {
            id: string;
            label: string;
        }[];
        edges: {
            from: string;
            to: string;
        }[];
    };
    method: MethodOptions;
    citations: CitationsOptions;
    files: {
        files: FileItem[];
        /** Each file gets its type icon and a `Download` link. */
        download?: boolean;
    };
    proposal: ProposalOptions;
    cannot: CannotOptions;
    caveat: CaveatOptions;
    scope: ScopeOptions;
    checks: {
        rows: {
            label: string;
            ok: boolean;
            count?: Figure;
        }[];
    };
    trace: TraceOptions;
    activity: ActivityOptions;
    gantt: GanttOptions;
    heatstrip: HeatStripOptions;
    test: {
        verdict: string;
        evidence?: "strong" | "moderate" | "weak";
        groups?: string;
        statistic: string;
        p: Figure;
        effect: Figure;
        assumptions: {
            label: string;
            ok: boolean;
            detail?: string;
        }[];
    };
    coef: {
        terms: {
            term: string;
            est: number;
            se: number;
            lo: number;
            hi: number;
            p: Figure;
            strong?: boolean;
        }[];
    };
    forest: {
        rows: {
            label: string;
            est: number;
            lo: number;
            hi: number;
            overall?: boolean;
        }[];
        nullAt: number;
        unit?: string;
    };
    scatter: {
        points: [number, number][];
        fit?: {
            slope: number;
            intercept: number;
        };
        r2?: number;
        x: string;
        y: string;
    };
    box: {
        groups: {
            label: string;
            min: number;
            q1: number;
            median: number;
            q3: number;
            max: number;
            outliers?: number[];
        }[];
        unit?: string;
    };
    correlation: {
        vars: string[];
        values: number[][];
    };
    control: {
        series: [string, number][];
        centre: number;
        ucl: number;
        lcl: number;
        breaches?: string[];
    };
    pareto: {
        items: {
            label: string;
            value: number;
        }[];
    };
    survival: {
        curves: {
            label: string;
            points: [number, number][];
        }[];
        atRisk?: {
            at: number;
            n: number;
        }[];
        unit?: string;
    };
    tornado: {
        base: number;
        inputs: {
            label: string;
            low: number;
            high: number;
            note?: string;
        }[];
        unit?: string;
    };
    decomposition: {
        x: string[];
        trend: number[];
        seasonal: number[];
        residual: number[];
    };
    modeleval: {
        confusion: {
            tp: number;
            fp: number;
            fn: number;
            tn: number;
        };
        threshold?: number;
        gains?: [number, number][];
        labels?: {
            positive: string;
            negative: string;
        };
    };
    pivot: {
        rowLabel: string;
        rows: string[];
        cols: string[];
        cells: Cell[][];
        totals?: {
            rows: Cell[];
            cols: Cell[];
            all: Cell;
        };
    };
    profile: {
        columns: {
            name: string;
            type: string;
            nulls: Figure;
            spread?: number[];
            flag?: boolean;
        }[];
    };
    evidence: {
        level: "strong" | "moderate" | "weak";
        reason: string;
    };
    dumbbell: {
        rows: {
            label: string;
            a: number;
            b: number;
        }[];
        a: string;
        b: string;
        unit?: string;
    };
    quantiles: {
        label?: string;
        p10: number;
        p50: number;
        p90: number;
        unit: string;
        max?: number;
    };
}
/** One row of what a step read or wrote — `prompt`, `rows`, `query`. */
interface TraceIoRow {
    label: string;
    value: string;
    /** Set the value as code, keeping its line breaks — a query, a formula. */
    code?: boolean;
}
/**
 * A step of the run behind an answer. Only `label` and `state` are required;
 * everything else is the step's record, filled in as the run streams — its
 * time, its attempts, the reasoning it streamed, what went in and came out.
 */
interface TraceStep {
    id?: string;
    label: string;
    /** What the step is doing or did, in a line — `14 rows · 3 batches`. */
    detail?: string;
    /**
     * `failed` stops the run at this step; `waiting` is a step held on the
     * analyst — an ask; `retrying` is a failed attempt about to go again;
     * `stopped` is a step the analyst interrupted.
     */
    state: "done" | "running" | "pending" | "failed" | "waiting" | "retrying" | "stopped";
    /** Why a failed step failed, under it. */
    error?: string;
    /** The step's machine name, in mono on its record — `translate_thought`. */
    key?: string;
    /** When the step started, as an ISO 8601 time. A running step counts up from it. */
    startedAt?: string;
    /** How long it took, in ms, once settled. */
    duration?: number;
    /** Which attempt this is, and of how many allowed — `retrying 2/3`. */
    attempt?: number;
    attempts?: number;
    /** The model's reasoning, streamed under the step while it runs. */
    thinking?: string;
    /** What went in and what came out — the step's audit record. */
    io?: {
        input?: TraceIoRow[];
        output?: TraceIoRow[];
    };
}
/** Every block, by kind, and the options its spec carries. */
interface BlockOptionsByKind extends AskOptionsByKind, AnswerOptionsByKind {
}
/** A block as JSON: its kind and its options. The same object in a turn, a panel or a page. */
type BlockSpec<K extends BlockKind = BlockKind> = {
    [P in K]: {
        kind: P;
    } & BlockOptionsByKind[P];
}[K];
/** A block that returns a value, as JSON. Each step of a multi-step one is one of these. */
type AskSpec = BlockSpec<AskKind>;
/** Where a block that returns a value stands: open until answered, then settled. */
type AskState = "pending" | "answered" | "skipped" | "superseded" | "expired";
interface BlockProps<K extends BlockKind = BlockKind> {
    spec: BlockOptionsByKind[K];
    /**
     * Everything the reader does, by name, with what it carries: `reply` and
     * `change` with the value, `skip`, `open` on a table holding rows back,
     * `select` with a table row's key, `download` with a file's digest or name,
     * `prompt` with a follow-up's words, `scope` with `{ part, value }`. An
     * action the spec declares (`actions`, a caveat's `action`) is `action` with
     * its id, so its id can never be mistaken for one of these. The shell says
     * what each means.
     */
    onAction?: (action: string, value?: unknown) => void;
    /** Where a block that returns a value stands. Unset, it is open. */
    state?: AskState;
    /** The value given, once answered. */
    value?: unknown;
    /** Names its form and fields. Unset, one is made. */
    id?: string;
    /**
     * Set into running text: a table's outer cells sit flush with the words
     * around it. Only the assistant sets it; everywhere else a table keeps its
     * cell padding.
     */
    seamless?: boolean;
}

/** What draws each kind; `null` is a kind with no renderer yet, drawn as a labelled placeholder. */
type BlockRenderers = {
    [K in BlockKind]: React.ComponentType<BlockProps<K>> | null;
};
/** Keyed by every kind, so a kind added to the list and not here does not compile. */
declare const BLOCK_RENDERERS: BlockRenderers;

/**
 * Where in a spec a patch lands, from its root: a name reads a field of an
 * object; on a list, a name is the item whose `key` (or `id`) it is, and a
 * number is an index. `["tasks", "plan", "subtasks"]` is the subtasks of the
 * task keyed `plan`. Empty, it is the spec itself.
 */
type PatchPath = (string | number)[];
/**
 * How a block changes while it streams — the same four ways for every kind,
 * so a conversation, a board or a page streams any block alike. The API sends
 * these; {@link applyBlockPatch} returns a new spec and never mutates the old.
 *
 * A merge (`set`, `upsert`) is a JSON merge patch one level deep: a field sent
 * as `null` is removed — the *now* line dropped as a run ends — since JSON
 * cannot send `undefined`.
 */
type BlockPatch = 
/** Merge `fields` into the object at `at` — the clock moving, a run settling. */
{
    op: "set";
    at?: PatchPath;
    fields: Record<string, unknown>;
}
/** Add `text` to the end of the string at `at` — a narrative's words. */
 | {
    op: "append";
    at: PatchPath;
    text: string;
}
/** Add `items` to the end of the list at `at` — a chart's points, a table's rows. */
 | {
    op: "push";
    at: PatchPath;
    items: unknown[];
}
/**
 * Merge `item` into the list item at `at` with the same `key` (or `id`), or
 * add it at the end — a task starting, then settling.
 */
 | {
    op: "upsert";
    at: PatchPath;
    item: Record<string, unknown>;
};
type BlockPatchOp = BlockPatch["op"];
declare class BlockPatchError extends Error {
}
/**
 * A block's spec after one patch. Any spec — a block's options, or a block
 * spec with its `kind`, which no patch can change.
 */
declare function applyBlockPatch<S extends object>(spec: S, patch: BlockPatch): S;
/** Apply patches in order — a recorded stream, replayed. */
declare function applyBlockPatches<S extends object>(spec: S, patches: BlockPatch[]): S;

/**
 * A spec arrives once, then as patches. These are the ways the patches can
 * arrive — one at a time or in batches, from a fetch body, an EventSource, a
 * generator, or a recorded script — read the same way by every shell that
 * streams: a block (`useBlockStream`), a conversation, a board. `P` is the
 * shell's patch; a block's is {@link BlockPatch}.
 */
type PatchChunk<P = BlockPatch> = P | P[];
type PatchSource<P = BlockPatch> = AsyncIterable<PatchChunk<P>> | Iterable<PatchChunk<P>>;
/** Every patch of a source, in the batches they arrived in. */
declare function patchesOf<P = BlockPatch>(source: PatchSource<P>): AsyncGenerator<P[]>;
/**
 * Patches from a newline-delimited JSON body: one patch, or an array of them,
 * per line. Pass the `Response` of a streaming `fetch`, or its body.
 */
declare function fromNdjson<P = BlockPatch>(input: Response | ReadableStream<Uint8Array>): AsyncGenerator<PatchChunk<P>>;
interface EventSourceOptions {
    /** The event whose data is a patch. @default "message" */
    event?: string;
    /** The event that ends the stream. @default "done" */
    done?: string;
    /** Close the EventSource when the stream ends. @default true */
    close?: boolean;
}
/** Patches from Server-Sent Events: each event's `data` is a patch, or an array of them. */
declare function fromEventSource<P = BlockPatch>(source: EventSource, { event, done, close }?: EventSourceOptions): AsyncGenerator<PatchChunk<P>>;
/** A patch and when it lands, in ms from the start of the script. */
interface ScriptStep<P = BlockPatch> {
    at: number;
    patch: PatchChunk<P>;
}
/** A recorded stream: plain JSON, replayed by {@link playScript} or step by step with {@link scriptFrames}. */
type PatchScript<P = BlockPatch> = ScriptStep<P>[];
interface PlayOptions {
    /** 2 plays twice as fast. @default 1 */
    speed?: number;
    signal?: AbortSignal;
}
/**
 * A script's patches, batched by when they land: one batch per moment, in
 * order — what {@link playScript} yields, without the waiting.
 */
declare function scriptFrames<P>(script: PatchScript<P>): {
    at: number;
    patches: P[];
}[];
/**
 * A script as a stream: each step is yielded when it is due. Steps due at the
 * same moment are yielded together; aborting ends the stream where it stands.
 */
declare function playScript<P>(script: PatchScript<P>, { speed, signal }?: PlayOptions): AsyncGenerator<P[]>;
/** Shift every step of a script by `ms` — to chain scripts one after another. */
declare const offsetScript: <P>(script: PatchScript<P>, ms: number) => PatchScript<P>;
/** When a script's last step lands. */
declare const scriptLength: <P>(script: PatchScript<P>) => number;

/**
 * Patches to apply as they arrive — a streaming fetch (`fromNdjson`), an
 * EventSource (`fromEventSource`), a generator, or a recorded script
 * (`playScript`). Pass a function, `(signal) => source`, to open the source
 * afresh each time the shell mounts — a generator can be read only once. Keep
 * it stable (module scope, `useCallback`): a new one starts a new stream.
 */
type SpecStream<P = BlockPatch> = PatchSource<P> | ((signal: AbortSignal) => PatchSource<P>) | null;
interface StreamOptions<S, P> {
    /** The stream ended; the spec as it left it. */
    onEnd?: (spec: S) => void;
    /** A patch did not apply, or the source failed. The stream stops there. */
    onError?: (error: unknown) => void;
    /** What stopping records — the patches that mark what was running as stopped. */
    stopPatches?: (spec: S) => P[];
}
/**
 * The spec as drawn: the one given, with `stream`'s patches applied by `apply`
 * as they arrive. A new spec starts over from it; `stop()` ends the stream and
 * records how far it got. Every shell that streams — a block, a conversation,
 * a board — reads its stream through this, with its own patch.
 */
declare function useStreamedSpec<S, P>(spec: S, stream: SpecStream<P> | undefined, apply: (spec: S, patches: P[]) => S, { onEnd, onError, stopPatches }?: StreamOptions<S, P>): {
    live: S;
    stop: () => void;
};
/**
 * One block's spec, streamed: `spec` with `stream`'s {@link BlockPatch}es
 * applied as they arrive. `<Block stream>` reads it; a shell that draws a
 * block directly calls it.
 *
 * ```tsx
 * const { live } = useBlockStream(spec, (signal) => fromNdjson(await fetch(url, { signal })))
 * <GanttBlock spec={live} />
 * ```
 */
declare function useBlockStream<S extends object>(spec: S, stream: SpecStream<BlockPatch> | undefined, options?: Omit<StreamOptions<S, BlockPatch>, "stopPatches">): {
    live: S;
    stop: () => void;
};

interface BlockComponentProps {
    spec: BlockSpec;
    onAction?: (action: string, value?: unknown) => void;
    /** Where a block that returns a value stands. Unset, it is open. */
    state?: AskState;
    /** The value given, once answered. */
    value?: unknown;
    id?: string;
    /**
     * Set into running text: the outer cells of a table sit flush with the words
     * around it. The assistant sets it; a board panel or a page section does not,
     * so its tables keep their padding.
     */
    seamless?: boolean;
    /**
     * Patches to `spec` as they arrive — the block draws `spec` with them
     * applied, and a new `spec` starts over from it. See `useBlockStream`.
     */
    stream?: SpecStream<BlockPatch>;
    /** The stream ended; the spec as it left it. */
    onStreamEnd?: (spec: BlockSpec) => void;
    /** A patch did not apply, or the source failed. The stream stops there. */
    onStreamError?: (error: unknown) => void;
}
/**
 * One block, drawn bare from its spec: no card, no title. The shell around it
 * — an answer card, a question card, a `PanelBox`, a page section — adds the
 * frame. A kind with no renderer yet is a labelled placeholder with its JSON.
 */
declare function Block({ spec, stream, onStreamEnd, onStreamError, ...props }: BlockComponentProps): React.JSX.Element;

interface PageSection {
    title?: string;
    description?: string;
    blocks: BlockSpec[];
}
/** A page as JSON: a report, or a long answer opened in full. */
interface PageSpec {
    title?: string;
    description?: string;
    sections: PageSection[];
}
interface PageProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
    spec: PageSpec;
    /**
     * A block's action, with where the block sits and what it carries — `open` on
     * a table in section 1, `select` with the row's key as `value`.
     */
    onAction?: (action: string, at: {
        section: number;
        block: number;
        value?: unknown;
    }) => void;
}
/**
 * Blocks laid out as a document: sections top to bottom, each block bare, no
 * cards and no borders. A section's title is its rule; a page's title is its
 * heading. The same specs a conversation turn or a board panel draws.
 */
declare const Page: React.ForwardRefExoticComponent<PageProps & React.RefAttributes<HTMLElement>>;

interface PlaceholderProps {
    /** The block's kind. */
    kind: string;
    /** The block's spec exactly as it was sent. */
    options: unknown;
    className?: string;
}
/**
 * A block with no renderer yet: its kind and the JSON it was sent.
 *
 * Shown rather than skipped, and never an error. A conversation is data that
 * outlives the code reading it, and a silently missing block is worse than a
 * visible one, because the analyst reads an answer they believe is complete.
 * While the kit is being built, the placeholders in a session story are also
 * the work left, in the place it will appear.
 */
declare function Placeholder({ kind, options, className }: PlaceholderProps): React.JSX.Element;

/**
 * A figure as text. A string arrives already written; a number or a typed
 * value is written here, plainly, until `formatValue` lands in `@invana/ui`.
 */
declare function figureText(figure: Figure): string;
/** A figure's value, or a muted dash when there is none to give. */
declare function metricValue(value: MetricOptions["value"]): string;
/** The tones, as a caption's. `neutral` leaves it muted. */
declare const CAPTION_TONE: Record<Tone, MetricTone | undefined>;
/** The tones, as a `Badge`'s. */
declare const BADGE_TONE: Record<Tone, "success" | "destructive" | "warning" | "muted">;

/**
 * `**…**` spans as strong, the rest as text. The only markup the grammar
 * allows in prose: the figure the sentence leads with, or what yes will cost.
 */
declare function strong(text: string): React.ReactNode[];
/**
 * Prose as an answer writes it: `**…**` a figure, `[n]` the marker for source
 * n where the clause it backs ends, and a figure led by `▲` or `▼` in the tone
 * of its direction — the arrow is the direction, so the colour follows it.
 */
declare function prose(text: string, marker: (n: number) => React.ReactNode): React.ReactNode[];

/**
 * The actions under a block, in the order given; the first with `push` starts
 * the group at the far end. Each is sent as an `action` event.
 */
declare function ActionRow({ actions, onAction, }: {
    actions: ActionOption[];
    onAction: (id: string) => void;
}): React.JSX.Element;

interface ConfirmCost {
    /** What it measures — `rows scanned`, `time`, `records written`. */
    label: React.ReactNode;
    /**
     * The figure, already written — `2.3B`, `about 40 s`, `0`. A string is
     * drawn whole as the figure; pass nodes to mark only part of it.
     */
    value: React.ReactNode;
    /** `warning` for the cost that changes something — records it will write. */
    tone?: "warning";
}
interface ConfirmCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** What yes does, in one sentence — or a short heading over a `description`. */
    question: React.ReactNode;
    /** A muted line under the question; makes the question a heading. */
    description?: React.ReactNode;
    /** Set the question as a heading without a description. */
    heading?: boolean;
    /** What yes costs, figure by figure, between the question and the buttons. */
    cost?: ConfirmCost[];
    /**
     * `line` writes the cost as a sentence, each figure before its label;
     * `strip` sets the figures in cells, each label above. @default "line"
     */
    costAs?: "line" | "strip";
    /**
     * The strip without its box: only the rules between its cells, and the
     * outer cells flush with the question — for a card whose frame is already
     * the edge.
     */
    seamless?: boolean;
    /** Something to weigh before answering, under the cost — a `CaveatNote`. */
    caveat?: React.ReactNode;
    /** The line under the buttons — where the default came from. */
    hint?: React.ReactNode;
    /** The yes and no buttons. */
    children?: React.ReactNode;
}
/**
 * Yes or no, where yes states what it costs: the rows it scans, the time it
 * takes, the records it writes. The cost is stated before the button, not
 * after — as a line of figures under the question, or as a strip of cells
 * when the figures are the point.
 *
 * The body of a confirm ask, inside its `ClarifyCard`.
 */
declare const ConfirmCard: React.ForwardRefExoticComponent<ConfirmCardProps & React.RefAttributes<HTMLDivElement>>;

interface SuggestionChipsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    /** Two to four follow-ups, each a whole prompt — `Compare with Q3 last year`. */
    items?: string[];
    /** Follow-ups under a heading each — `Go deeper`, `Act` — in place of `items`. */
    groups?: {
        label: React.ReactNode;
        items: string[];
    }[];
    /**
     * `wrap` (the default) runs the chips along a line; `stack` puts one per
     * line, full width. A narrow thread stacks them either way.
     */
    layout?: "wrap" | "stack";
    /** A line above the chips that says what they are — `I can answer instead`. */
    lead?: React.ReactNode;
    /** Follow-ups already sent from here. They stay where they were, dimmed and disabled. */
    sent?: string[];
    /** A follow-up was picked; it goes out as the next prompt. */
    onSelect?: (text: string) => void;
}
/**
 * What to ask next, under an answer. Each chip is a whole prompt that reuses
 * the current scope, so picking one sends it as it reads — nothing to fill in.
 */
declare const SuggestionChips: React.ForwardRefExoticComponent<SuggestionChipsProps & React.RefAttributes<HTMLDivElement>>;

/**
 * Which layers a run kept busy, and when: one lane per layer — graph, models,
 * skills, the LLM, third parties, the cache — over a shared axis, brighter
 * where it was busier, its rate at the right, the run's steps banded above.
 *
 * Live, it follows the last seconds; settled, it is the whole run. A layer
 * opens into its parts; a lit cell pins, and the operation behind it is
 * recorded under the lanes. A refusal and a crossing of the boundary are
 * marked in their cell. When the signal stops the lanes are dimmed, not
 * cooled: silence is not calm. Under 300px of its own width it switches to
 * short labels.
 */
declare function ActivityBlock({ spec, onAction }: BlockProps<"activity">): React.JSX.Element;

/**
 * Groups compared as columns. Two or more series sit side by side in each group
 * with a legend, a muted one drawn as the comparison, against a dashed target.
 * One series is drawn muted with the called-out group in primary and its value
 * on the cap. A plan per group is a dashed column each actual stands inside.
 */
declare function BarsBlock({ spec }: BlockProps<"bars">): React.JSX.Element;

/**
 * What the data does not hold, and what would change the answer — then the
 * nearby questions it can answer, each sent as a new prompt. Answered in
 * part, the card says which part is missing, above the answer for the rest.
 */
declare function CannotBlock({ spec, onAction }: BlockProps<"cannot">): React.JSX.Element;

/**
 * What was excluded, imputed or assumed, and how far to trust the figure. A
 * caveat with the rows behind it links to them; several can fold behind one
 * line that names their kinds.
 */
declare function CaveatBlock({ spec, onAction }: BlockProps<"caveat">): React.JSX.Element;

/**
 * The sources an answer rests on, numbered as its markers cite them, with
 * record counts at the right and what kind of source each is, and how fresh,
 * under it. The row a marker in the prose points at is lit, when the shell tracks it. Folded, one line
 * says how many sources and records; a source with no records is said out loud.
 */
interface CitationsBlockProps extends BlockProps<"citations"> {
    /** The source the reader is on, when the shell tracks it. Defaults to the spec's `active`. */
    active?: number;
}
declare function CitationsBlock({ spec, active }: CitationsBlockProps): React.JSX.Element;

/**
 * Yes or no, where the question says what yes will do and the cost — rows
 * scanned, time, records written — is stated before the buttons, as a line or
 * a strip of figures. A caveat to weigh sits under the cost. The default is the
 * primary button; with `align: "end"` it takes the card's right edge and the
 * other its left, and a `dismiss` no draws quiet. `hint` says where the
 * default came from.
 *
 * Answered, it settles into the decision, in `settled` words when given, with
 * the hint the API patches in to say what it led to.
 */
declare function ConfirmAsk({ spec, state, value: given, onAction }: BlockProps<"confirm">): React.JSX.Element;

/**
 * The files an answer hands over. Several are a list, each addressed by its
 * digest or offered for download; one file is a card that says what it holds,
 * with its download or its state at the right.
 */
declare function FilesBlock({ spec, onAction }: BlockProps<"files">): React.JSX.Element;

/**
 * Several related values answered together, where they only make sense as a
 * set — scenario inputs. The fields render through the form generator: with
 * `labels: "side"` in a column on the left, with `"top"` over each field, two
 * to a row where the card is wide enough; a field's `group` sets it under a
 * small caps name. A `textarea` and a list of described `radio` choices take
 * the row; a `checkbox` sits beside its label. A number out of its
 * `above`/`below` bounds, or a `required` field left empty, says so under
 * itself and holds the submit back. The submit sends a `reply` keyed by field
 * name.
 *
 * Answered, it settles into its values as label/value pairs; Change inputs
 * reopens the form with them filled in, and sending again is a `change`.
 */
declare function FormAsk({ spec, state, value: given, onAction }: BlockProps<"form">): React.JSX.Element;

/**
 * Where a run's time went: one row per task on the run's own clock, a retry's
 * failed attempt to the left of the one that stuck, a task that never ran as an
 * outline. A task that split into others opens into them; one with no timing of
 * its own draws the stretch they cover. Hover a row for what it produced; pick
 * one and it is sent as `select` with the task's key.
 *
 * A row's `segments` are many bars on one row — what a worker slot held, what a
 * layer was reached for — painted by `palette`. A keyed bar is picked on its
 * own and sent as `select` with its key. With `scale: "seq"` the clock counts a
 * plan's steps, so the same drawing reads a plan before it runs. The reader opens
 * and closes rows; a spec whose `open` flags change opens and closes them again.
 */
declare function GanttBlock({ spec, onAction }: BlockProps<"gantt">): React.JSX.Element;

/**
 * A band of figures that belong to one answer, each with its change beneath it
 * and, where a figure has a ceiling or a target, a bar under it.
 */
declare function GridBlock({ spec }: BlockProps<"grid">): React.JSX.Element;

/**
 * A run of firings, one square each, in time order — a schedule's day, most
 * green and the one that is not. With `rows`, several strips over one axis, and
 * a row opens into its children, so the red square can be followed down to the
 * job that went red. The legend is always drawn: a square has no label of its own.
 */
declare function HeatStripBlock({ spec }: BlockProps<"heatstrip">): React.JSX.Element;

/**
 * The query, formula or model behind the figure, folded. Closed, the line
 * carries the meta at the right, or the code itself when there is none; open,
 * the code moves into its own block, with what a model rests on under it, or
 * the steps of a method that took several.
 */
declare function MethodBlock({ spec }: BlockProps<"method">): React.JSX.Element;

/**
 * The one figure an answer turns on, with its comparison worded under it — and,
 * when the answer has them, a bar against its target or its recent run beside it.
 */
declare function MetricBlock({ spec }: BlockProps<"metric">): React.JSX.Element;

/**
 * Several choices from a list the data model holds — filters, or the
 * assumptions an analysis will make, where the one left off says why in its
 * `note`. The defaults arrive ticked; `min` holds the submit back until enough
 * are, and `max` counts toward its limit beside the submit — at the limit the
 * rest stop being offered. Options take the same description, lead and
 * figure a single choice does. Submit sends the ticked values as a `reply`, in
 * the ask's order.
 *
 * Answered, it settles into one label/value pair; Change answer reopens it.
 */
declare function MultiAsk({ spec, state, value: given, id: idProp, onAction }: BlockProps<"multi">): React.JSX.Element;

/**
 * Several related asks sent as one request, one step at a time with its
 * progress. Skip is offered on a step that is not `required` and not the
 * last; a required step holds Next back, saying why, until it is answered.
 * With `review`, the last step leads to the answers laid out once more, each
 * with Edit, before they are sent. The value is keyed by step id.
 *
 * Answered, it settles into the answers as label/value pairs; Change answers
 * reopens the steps with them filled in, and sending again is a `change`,
 * which re-runs from this turn.
 */
declare function MultistepAsk({ spec, state, value: given, onAction }: BlockProps<"multistep">): React.JSX.Element;

interface NarrativeBlockProps extends BlockProps<"narrative"> {
    /** The source the reader is on, when the shell tracks it. Defaults to the spec's `active`. */
    active?: number;
    /** Pointing at a marker, or away from it. A shell that tracks the source lights its row too. */
    onActiveChange?: (n: number | undefined) => void;
    /** Drawn after the text — the conversation's caret while the answer is still being written. */
    trailing?: React.ReactNode;
}
/**
 * The answer in two or three sentences, leading with the number. Markers sit
 * where the text places them (`[n]`), or after it (`cites`); pointing at one
 * lights its source in the citations when the shell tracks it. `trailing` ends
 * the text — the caret, while a conversation is still writing it.
 */
declare function NarrativeBlock({ spec, active, onActiveChange, trailing }: NarrativeBlockProps): React.JSX.Element;

/**
 * Something the answer proposes to write: what it proposes, the draft or what
 * writing it does as figures, what writing it would do in words, and the
 * actions, each sent as its id. Nothing is written until the shell acts on one;
 * once written, a stamp says so. The shell gives it its card and its header.
 */
declare function ProposalBlock({ spec, onAction }: BlockProps<"proposal">): React.JSX.Element;

/**
 * Two to five short spec in one row — a granularity, a confidence level,
 * an output format — where picking one is the reply. With no `default`
 * nothing is picked, so the reader answers rather than accepts. An option can
 * carry a second line (`±1.4 pp`); `stretch` gives each an equal share of the
 * card. `more` adds rows answered in the same card: the value is then keyed
 * by row, and it is sent once every row has a pick.
 *
 * Answered, each row settles into a label/value pair; Change reopens them.
 */
declare function QuickAsk({ spec, state, value: given, onAction }: BlockProps<"quick">): React.JSX.Element;

/**
 * Items in the order they matter — drivers, top-N, likely causes — each with
 * its bar, and its value in a column at the right. A negative contribution
 * draws in the destructive colour; the rest, folded into one line, is muted.
 * `diverging` grows the bars both ways from zero.
 */
declare function RankedBlock({ spec }: BlockProps<"ranked">): React.JSX.Element;

/**
 * One entity, or the assumptions behind an answer, as label/value pairs — with
 * who it is and its state above them, rows under headings, and where each
 * value came from when that is the point.
 */
declare function RecordBlock({ spec }: BlockProps<"record">): React.JSX.Element;

/**
 * Period, filters, population and freshness, as the query applied them. Each
 * part is edited in place — typed, or picked from its choices — and sent as a
 * `scope` action with `{ part, value }`; a part the shell marks `fixed` — a
 * freshness, say — is a fact about the data and stays as it is. A part carried from an earlier question and changed since,
 * or resting on late data, is marked, and a hint about late data is a warning.
 */
interface ScopeBlockProps extends BlockProps<"scope"> {
    /** Parts that are facts, not choices — a freshness the data states. Drawn, never edited. */
    fixed?: number[];
}
declare function ScopeBlock({ spec, fixed, onAction }: ScopeBlockProps): React.JSX.Element;

/**
 * One choice from a list the data model holds. Picking an option is the reply,
 * so the default is one keypress away — unless the ask names a `submit`, when
 * the pick waits for that button (and Skip, when `skippable`). An option can
 * carry a description under its label, a lead tag or icon before it, and a
 * figure on the right. With `other`, an “Other…” choice opens a field for the
 * analyst's own words, sent with Use this.
 *
 * Answered, it settles into one label/value pair; Change answer reopens it,
 * and picking again is a `change`.
 */
declare function SingleAsk({ spec, state, value: given, id: idProp, onAction }: BlockProps<"single">): React.JSX.Element;

/**
 * Follow-ups after an answer, each a whole prompt that reuses the current
 * scope; picking one is the reply, and the API sends it on as the next prompt.
 * They run along a line, stack one per line, or sit under headings.
 *
 * Answered, the one picked stays, dimmed, and the rest can still be sent: each
 * is its own next question. Superseded or expired, none can.
 */
declare function SuggestionsAsk({ spec, state, value: given, onAction }: BlockProps<"suggestions">): React.JSX.Element;

/**
 * The first rows of a longer table, and how many there are in all. When rows
 * are held back, `Open all` asks for them with the `open` action. The column the
 * rows are ordered by is marked, rows an answer turns on are called out, and a
 * total sits under the rows in bold. With a `rowKey`, picking a row sends
 * `select` with its key, and the `selected` row is drawn picked.
 */
declare function TableBlock({ spec, onAction, seamless }: BlockProps<"table">): React.JSX.Element;

/**
 * A few dated events, in order, each marked by what it did to the figure — with
 * a detail line under an event, and labelled runs of events around the one an
 * answer is about, which is called out. An event that breaks into smaller ones
 * opens into them, so a three-day hold can be read step by step.
 */
declare function TimelineBlock({ spec }: BlockProps<"timeline">): React.JSX.Element;

/**
 * A measure over time: the line in the foreground, the range it is judged
 * against shaded in primary beneath it, and the periods that stand out ringed
 * in their tone. A reference — an alert level, a budget — is a dashed rule,
 * and every point over it is ringed as a breach; a missing point breaks the
 * line. The first series is the line; any others are drawn behind it to read
 * it against, each named at its right end. A period is named by its label.
 */
declare function TimeseriesBlock({ spec }: BlockProps<"timeseries">): React.JSX.Element | null;

/**
 * What the answer is doing, step by step, while it runs — and the record of it
 * after, folded to one line. A failed step says why under it, with what can be
 * done about it; a step held on the analyst waits hollow, in the info tone.
 */
declare function TraceBlock({ spec, onAction }: BlockProps<"trace">): React.JSX.Element;

export { ANSWER_KINDS, ASK_KINDS, type ActionOption, ActionRow, ActivityBlock, type ActivityLane, type ActivityOptions, type ActivityPin, type AnswerKind, type AnswerOptionsByKind, type ApprovalOptions, type AskKind, type AskOptionsByKind, type AskSpec, type AskState, type AskText, type AskValueByKind, BADGE_TONE, BLOCKS, BLOCK_RENDERERS, BarsBlock, Block, type BlockComponentProps, type BlockKind, type BlockOptionsByKind, type BlockPatch, BlockPatchError, type BlockPatchOp, type BlockProps, type BlockRenderers, type BlockSpec, CAPTION_TONE, CannotBlock, type CannotOptions, CaveatBlock, type CaveatNoteOptions, type CaveatOptions, type CaveatTone, type Cell, type ChoiceFigure, type ChoiceOption, type CitationSource, CitationsBlock, type CitationsBlockProps, type CitationsOptions, type Column, ConfirmAsk, ConfirmCard, type ConfirmCardProps, type ConfirmCost, type ConfirmOptions, type CostFigure, type EntityOptions, type EventSourceOptions, type Figure, type FileItem, FilesBlock, type ForkOptions, FormAsk, type FormOption, type FormOptions, GanttBlock, type GanttOptions, type GanttSpecBar, type GanttSpecRow, type GanttSpecSeam, type GanttSpecStatus, GridBlock, HeatStripBlock, type HeatStripCell, type HeatStripOptions, type HeatStripRowOptions, type HeatStripState, type HypothesisOptions, type InterpretationOptions, type LongOptions, MethodBlock, type MethodOptions, MetricBlock, type MetricOptions, type ModelSpecOptions, MultiAsk, type MultiOptions, MultistepAsk, type MultistepOptions, NarrativeBlock, type NarrativeBlockProps, type NarrativeOptions, type NumberOptions, Page, type PageProps, type PageSection, type PageSpec, type PatchChunk, type PatchPath, type PatchScript, type PatchSource, type PeriodOptions, Placeholder, type PlaceholderProps, type PlanOptions, type PlayOptions, ProposalBlock, type ProposalOptions, QuickAsk, type QuickOptions, type QuickPick, type RangeOptions, RankedBlock, RecordBlock, type RecordRow, type ScaleOptions, ScopeBlock, type ScopeBlockProps, type ScopeOptions, type ScopePart, type ScriptStep, type ShortOptions, SingleAsk, type SingleOptions, type SpecStream, type StreamOptions, SuggestionChips, type SuggestionChipsProps, SuggestionsAsk, type SuggestionsOptions, TableBlock, TimelineBlock, type TimelineEvent, TimeseriesBlock, type Tone, TraceBlock, type TraceIoRow, type TraceOptions, type TraceStep, type TypedValue, VALUE_TYPES, type ValueTypeId, type WeightsOptions, applyBlockPatch, applyBlockPatches, figureText, fromEventSource, fromNdjson, metricValue, offsetScript, patchesOf, playScript, prose, scriptFrames, scriptLength, strong, useBlockStream, useStreamedSpec };
