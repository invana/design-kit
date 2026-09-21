import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * The capabilities Invana ships today — **suggestions, not a limit.**
 *
 * These are what {@link Bound} autocompletes to. They bind nothing: a product
 * that adds a `vector_write` bound as it grows passes `"vector_write"` and the
 * chip draws it. The catalogue groups by these and an envelope ceilings them,
 * but that is the *runtime's* vocabulary to police — a chip that refused to
 * render an unknown bound would make the design kit a release blocker for
 * every new capability.
 */
export type KnownBound =
  | "none"
  | "network"
  | "graph_read"
  | "graph_write"
  | "schema_write"
  | "ingest"
  | "llm"
  | "plan_write"
  | "work_write"

/**
 * What a callable may spend — any identifier at all.
 *
 * `(string & {})` keeps the known set autocompleting while accepting anything
 * else without a cast. See {@link KnownBound}.
 */
export type Bound = KnownBound | (string & {})

/**
 * What each bound is painted with — **the kit ships no hues.**
 *
 * Which colour means `schema_write` is a product's decision. Four of the nine
 * were only ever data-palette slots picked for being distinguishable from one
 * another, which is exactly the kind of choice a component should not be
 * making on a consumer's behalf; and holding the map forced every consumer
 * onto a stylesheet that defines those slots, which is how `bg-data-*` came to
 * be dead in the precompiled `@invana/ui/styles.css` without anyone noticing.
 *
 * Values are class strings, so a surface spends whatever its own Tailwind
 * build has — a data-palette token, a status token, a brand colour. A bound
 * left out draws in the neutral.
 */
export type BoundPalette = Partial<Record<Bound, string>>

/**
 * No paint given — a neutral, never a hue. Drawing an unpainted bound in some
 * default colour would be the hard-coded map by another name: a consumer would
 * inherit a colour it never chose and could not tell from one it did.
 */
const UNPAINTED = "bg-muted-foreground"

export interface BoundChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  bound: Bound
  /**
   * Render the swatch alone, for somewhere the name is already written beside
   * it. Use sparingly — see the note on colour below.
   */
  swatchOnly?: boolean
  /** What to call it, when the identifier is not what this surface says. */
  label?: React.ReactNode
  /**
   * This chip's swatch class, given directly — `bg-data-7`, `bg-violet-500`.
   * The shortest path when a call site draws one chip and knows its bound.
   * Wins over {@link BoundChipProps.palette}.
   */
  swatch?: string
  /**
   * What the bounds are painted with, when a caller draws several and would
   * rather state the map once. Only this chip's own bound is read.
   */
  palette?: BoundPalette
}

/**
 * What a task is allowed to spend, as a swatch and a name.
 *
 * It appears on a task node in a flow, in a run's record header, on a catalogue
 * row and in the parameter form's contract card — everywhere a reader has to
 * know *what this act costs* before reading what it does.
 *
 * **The name is always there.** The swatch is a scanning aid, not the carrier:
 * nine hues cannot be told apart reliably, several pairs are close, and a
 * colour-blind reader gets nothing from any of them. `swatchOnly` exists for
 * the one case where the name is already printed next to the chip.
 *
 * Deliberately not a `Badge`. A badge carries *state* and takes a tone from the
 * status palette; a bound is a fixed property of a callable and must not read
 * as "this went well" because it happens to be green.
 */
export const BoundChip = React.forwardRef<HTMLSpanElement, BoundChipProps>(
  ({ bound, swatchOnly, label, swatch, palette, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex max-w-full shrink-0 items-center gap-1.5 font-mono text-sm text-muted-foreground",
        className,
      )}
      aria-label={swatchOnly ? `bound: ${bound}` : undefined}
      {...props}
    >
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0", swatch ?? palette?.[bound] ?? UNPAINTED)}
      />
      {swatchOnly ? null : <span className="truncate">{label ?? bound}</span>}
    </span>
  ),
)
BoundChip.displayName = "BoundChip"
