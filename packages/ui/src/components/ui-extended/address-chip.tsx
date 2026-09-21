import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * How this address stood in the run, or in the rule being read.
 *
 * `denied` and `refused` are two different facts and the boards print both:
 * a **denied** address is what the bound says, read at rest; a **refused** one
 * is what actually happened when a run reached for it. One is a rule, the other
 * is an event, and collapsing them loses *the bound was there and nothing ever
 * tested it*.
 */
export type KnownAddressTone =
  | "allowed" | "denied" | "refused" | "untouched"

/**
 * The values the kit draws specially — **suggestions, not a limit.** Anything
 * else renders with the neutral token and its own name.
 */
export type AddressTone = KnownAddressTone | (string & {})

const TONE: Partial<Record<AddressTone, string>> = {
  allowed: "text-foreground",
  denied: "text-destructive",
  refused: "text-destructive line-through decoration-destructive/50",
  untouched: "text-muted-foreground/70",
}

/**
 * Split an address so the **participant survives truncation**.
 *
 * `graph_data/model/Deals@1.0.0` is read right-to-left: the last segment is
 * which thing, and the first two are which kind of thing — and the kind is
 * already carried by the `LayerChip` beside it. So the head flexes and clips
 * and the tail is pinned, giving `graph_data/mod…/Deals@1.0.0` rather than the
 * `graph_data/model/Dea…` a plain `truncate` would give.
 *
 * A wildcard pattern is the same shape (`graph_data/model/Deals@*`), and
 * `third_party/**` has no tail to lose.
 */
function split(address: string): { head: string; tail: string } {
  const cut = address.lastIndexOf("/")
  if (cut < 0) return { head: "", tail: address }
  return { head: address.slice(0, cut + 1), tail: address.slice(cut + 1) }
}

export interface AddressChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "onClick"> {
  /** `graph_data/model/Deals@1.0.0`, or a pattern — `third_party/**`. */
  address: string
  tone?: AddressTone
  /**
   * Open the participant this names. Present makes the chip a button; absent
   * leaves it text, because an address that looks pressable and is not teaches
   * the reader to stop pressing.
   */
  onOpen?: (address: string) => void
}

/**
 * One participant's address, printed so the participant stays readable.
 *
 * The address is the only identifier there is — the lens matches on it, the
 * ledger records it, the run drawing expands it — so it appears wherever a
 * bound, a touch or a refusal is shown, and it has to survive a narrow column
 * without becoming three of the same string.
 *
 * **It truncates in the middle, not the end.** See {@link split}: the last
 * segment is which thing and the ones before it are which kind, so the kind is
 * what gives way. Clipping the tail would render every model in a Graph as
 * `graph_data/model/…`.
 *
 * The separators sit at half opacity so the segments read as three parts of one
 * name rather than one long token. Monospace for the same reason it is
 * monospace in the ledger: these are compared by eye, down a column.
 */
export const AddressChip = React.forwardRef<HTMLSpanElement, AddressChipProps>(
  ({ address, tone = "allowed", onOpen, className, ...props }, ref) => {
    const { head, tail } = split(address)

    const body = (
      <>
        {head ? (
          // `shrink-[999]` makes the head absorb essentially all the shrink, so
          // the kind gives way before the participant does — but the floor is
          // `2ch`, never `0`. A head that collapses to nothing renders
          // `graph_data/stitch/route_airport@…` as `route_airport@…`, which
          // reads as a whole address, and two different participants can come
          // out identical.
          //
          // Exactly two: `text-overflow` draws the ellipsis only when it fits,
          // so at `1ch` the browser keeps the raw first character and drops the
          // marker — `groute_airport@…`, a word that was never there. Two is
          // one character plus the ellipsis, which is the narrowest honest
          // truncation. Every `ch` above that is one the participant loses.
          <span className="min-w-[2ch] shrink-[999] truncate opacity-60">
            {head}
          </span>
        ) : null}
        {/* Shrinks only once the head is down to its floor, and clips from the
            end when the tail alone cannot fit — at that width there is nothing
            left to give, and overflowing the column is not an option. */}
        <span className="min-w-0 shrink truncate">{tail}</span>
      </>
    )

    const shell = cn(
      "inline-flex min-w-0 max-w-full items-baseline font-mono text-sm",
      (TONE[tone] ?? "text-foreground"),
      className,
    )

    if (onOpen) {
      return (
        <span ref={ref} className={cn(shell, "min-w-0")} {...props}>
          <button
            type="button"
            title={address}
            onClick={() => onOpen(address)}
            className={cn(
              "inline-flex min-w-0 max-w-full cursor-pointer items-baseline rounded-control",
              "hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            )}
          >
            {body}
          </button>
        </span>
      )
    }

    return (
      <span ref={ref} title={address} className={shell} {...props}>
        {body}
      </span>
    )
  },
)
AddressChip.displayName = "AddressChip"

export { split as splitAddress }
