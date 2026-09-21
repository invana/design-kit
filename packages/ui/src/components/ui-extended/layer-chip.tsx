import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * The classes of participant Invana ships today — **suggestions, not a limit.**
 *
 * These are what {@link Layer} autocompletes to. They bind nothing: a product
 * that grows a `vector_store` layer next week passes `"vector_store"` and every
 * component here draws it, because a component that had to be edited before a
 * developer could name a new layer is a component that owns the product's
 * vocabulary.
 *
 * `agent` is the **spine**: the runtime itself, which does the participating
 * rather than being a participant, and is never governed. Nothing in this file
 * knows that — a band says so with `spine`, see `LayerStrip`.
 */
export type KnownLayer =
  | "graph_data"
  | "llm"
  | "third_party"
  | "cache"
  | "human"
  | "agent"

/**
 * What a participant **is** — any identifier at all.
 *
 * `(string & {})` is what keeps both halves: the known set still autocompletes
 * and still documents itself, while an unknown string is accepted without a
 * cast. Widening this to plain `string` would silently drop the suggestions;
 * narrowing it back to the union would make the kit the gatekeeper of a
 * vocabulary it does not own.
 */
export type Layer = KnownLayer | (string & {})

/**
 * What a reader calls the layer: the identifier with its underscores opened up.
 *
 * Derived rather than looked up — a table would have to be edited for every
 * layer a product adds, and for all six Invana ships today the table said
 * exactly this anyway (`graph_data` → `graph data`). A layer that wants
 * something else passes `label`.
 */
export const layerLabel = (layer: Layer): string => layer.replace(/_/g, " ")

/**
 * How one layer is painted. **The kit ships no hues** — a consumer supplies
 * these, because which colour means `llm` is a product's decision and not a
 * component's.
 *
 * Both are class strings rather than colours, so a surface spends whatever
 * palette its own Tailwind build already has: `bg-data-7` from
 * `@invana/styling`, a brand token, a plain `bg-violet-500`. A component that
 * held the map would force every consumer onto the kit's palette *and* onto a
 * stylesheet that defines it — which is how `bg-data-*` came to be dead in the
 * precompiled `@invana/ui/styles.css` without anyone noticing.
 *
 * It is passed to the component that draws, as a prop, every time — never
 * installed once for a tree. A caller restating its palette at four call sites
 * is the honest cost: the alternative hides *which* colours a drawing is using
 * behind a provider somebody else mounted.
 *
 * - `swatch` is the **solid mark**: the dot beside a name, the rail down a bar.
 * - `tint` is the **wash**: a bar's ground and edge together. Keep it faint —
 *   it sits *behind* text, so a hue dark enough to label in is a hue too dark
 *   to wash with.
 * - `text` is the hue **as type**: a participant address written in its layer's
 *   colour, so `model/Orders@v2` and the `graph data` dot above it are visibly
 *   the same thing. This is the one that has to clear a contrast floor, which
 *   is why it is yours to choose and separate from `swatch` — the token that
 *   makes a legible 6px dot is often not the one that makes legible 13px mono.
 */
export interface LayerPaint {
  /** The solid mark — `bg-data-7`. */
  swatch?: string
  /** The wash, ground and edge — `border-data-7/35 bg-data-7/10`. */
  tint?: string
  /** The hue as type, for an address that should read as its layer — `text-data-7`. */
  text?: string
}

/**
 * What each layer is painted with. Partial on purpose: a layer left out falls
 * back to the neutral, which is a legible answer rather than a blank one.
 */
export type LayerPalette = Partial<Record<Layer, LayerPaint>>

/**
 * No paint given — deliberately a neutral and not a hue.
 *
 * A layer nobody painted still has to draw, and drawing it in some default
 * colour would be the hard-coded palette by another name: the consumer would
 * inherit a hue it never chose and could not tell from one it did. The muted
 * token says *unpainted* in the same voice the spine says *never governed*.
 */
const UNPAINTED: Required<LayerPaint> = {
  swatch: "bg-muted-foreground",
  // Edge only, no ground: a bar's identity is its rail and its address, and a
  // wash under every bar turns a track into a stack of coloured blocks. A
  // consumer that wants the ground says so in its own `tint`.
  tint: "border-border",
  // Unpainted type is ordinary type. A muted address would say *subordinate*,
  // which is not what "nobody gave this layer a colour" means.
  text: "text-foreground",
}

/**
 * One layer's paint, with the neutral filled in for anything unsaid — so a
 * caller never branches on `undefined` to draw a dot.
 *
 * There is no provider and no context. Colour arrives as the `palette` prop on
 * the component that draws, every time: a chip painted from somewhere up the
 * tree is a chip whose colour you cannot find by reading its call site.
 */
export const layerPaint = (
  palette: LayerPalette | undefined,
  layer: Layer,
): Required<LayerPaint> => ({ ...UNPAINTED, ...palette?.[layer] })

export interface LayerChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  layer: Layer
  /**
   * How many participants this layer holds — `graph data 4`. Omit where the
   * count is already in the row, and note that `0` is a fact worth printing:
   * *nothing is configured* reads differently from *nothing matched*.
   */
  count?: number
  /** What to call it, when {@link layerLabel} is not what this surface says. */
  label?: React.ReactNode
  /**
   * The layer is closed, empty or out of view: the swatch drops to the muted
   * token and the label goes with it. The chip stays legible — this is *not
   * in play*, never *not there*.
   */
  dim?: boolean
  /**
   * This chip's swatch class, given directly — `bg-data-7`, `bg-violet-500`.
   * The shortest path when a call site draws one chip and knows its layer.
   * Wins over {@link LayerChipProps.palette}.
   */
  swatch?: string
  /**
   * What the layers are painted with, when a caller draws several and would
   * rather state the map once. Only this chip's own layer is read.
   */
  palette?: LayerPalette
}

/**
 * One class of participant, as a swatch and a name.
 *
 * It heads a `LayerSection`, bands a run's `LayerStrip`, and counts a layer in
 * the Worlds drawer — everywhere a reader has to know *what kind of thing this
 * is* before reading which one.
 *
 * **The name is always there.** Six hues cannot be told apart reliably and a
 * colour-blind reader gets nothing from any of them: the swatch speeds up
 * scanning a list you can already read, and carries nothing on its own.
 *
 * Deliberately not a `Badge` and deliberately not `BoundChip`. A badge carries
 * *state* from the status palette; a bound is what a callable may **spend**; a
 * layer is what a participant **is**. The two chips co-occur on the agent
 * boards, which is why they never share a hue.
 */
export const LayerChip = React.forwardRef<HTMLSpanElement, LayerChipProps>(
  ({ layer, count, label, dim, swatch, palette, className, ...props }, ref) => {
    const paint = layerPaint(palette, layer)
    return (
      <span
        ref={ref}
        className={cn(
          // A layer is a **name**, not an address. `graph data` has a space in
          // it — it is already prose — so it takes the body face at the root
          // size, and mono is reserved for the thing that really is an address
          // (`model/Orders@v2` on the row below it). Small muted bold mono made
          // a row heading look like a technical footnote.
          "inline-flex max-w-full shrink-0 items-center gap-1.5",
          dim ? "text-muted-foreground/70" : "text-foreground",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0",
            dim ? "bg-muted-foreground/50" : (swatch ?? paint.swatch),
          )}
        />
        <span className="truncate">{label ?? layerLabel(layer)}</span>
        {count != null ? (
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
            {count}
          </span>
        ) : null}
      </span>
    )
  },
)
LayerChip.displayName = "LayerChip"
