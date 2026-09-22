import * as React from "react"

import { cn } from "../../lib/utils"
import { AddressChip, type AddressTone } from "./address-chip"

/**
 * What a run did with a participant it was allowed — **suggestions, not a
 * limit.** A product with a seventh verdict passes it and the row draws it in
 * the neutral.
 */
export type KnownParticipantVerdict =
  | "touched"
  | "never touched"
  | "refused"
  | "miss"
  | "denied"

// Named for what it judges: `Verdict` is already taken by `RatingControl`, and
// a run's verdict on a participant and a reader's verdict on an answer are two
// unrelated vocabularies that happen to share an English word.
export type ParticipantVerdict = KnownParticipantVerdict | (string & {})

export interface ParticipantRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The participant, as the world addresses it — `model/Routes@v4`. */
  address: string
  verdict: ParticipantVerdict
  /** What happened — `1,284 rows · step 7`, `allowed, and nothing asked for it`. */
  note?: React.ReactNode
  /**
   * The tone the verdict is read in. Defaults: `touched` succeeds, `refused`
   * and `denied` are destructive, everything else is muted — *allowed and never
   * reached for* is not a failure, it is an invitation to narrow.
   */
  tone?: "success" | "muted" | "warning" | "destructive"
  /**
   * How the **address** is drawn. Derived from the verdict — `refused` strikes
   * it in place, `never touched` mutes it — and overridable for a vocabulary
   * the kit has not seen.
   *
   * Striking is `AddressChip`'s job and not this row's: the address is struck
   * everywhere a refusal is shown, and two components deciding that
   * independently is how one surface comes to strike and another to hide.
   */
  addressTone?: AddressTone
}

const TONE = {
  success: "text-success",
  muted: "text-muted-foreground",
  warning: "text-warning",
  destructive: "text-destructive",
}

const DEFAULT_TONE: Record<string, keyof typeof TONE> = {
  touched: "success",
  refused: "destructive",
  denied: "destructive",
}

const ADDRESS_TONE: Record<string, AddressTone> = {
  touched: "allowed",
  refused: "refused",
  denied: "denied",
  "never touched": "untouched",
  miss: "untouched",
}

/**
 * One participant a run could have spent, and what it actually did with it.
 *
 * The Lens reading of a run is a list of these under their layers: every
 * address the world allowed, each marked `touched` · `never touched` ·
 * `refused`. **Nothing is filtered out**, because the list is not an inventory
 * of what ran — it is the gap between *declared* and *did*, and each kind of
 * gap names a different act. Three allowed and never touched is an invitation
 * to narrow the world; a refusal is an invitation to widen it, or to accept
 * that the graph cannot answer inside it.
 *
 * It is not `RuleRow`: a rule is a sentence about what *may* happen, written
 * before anything ran. This is a fact about one execution.
 */
export const ParticipantRow = React.forwardRef<
  HTMLDivElement,
  ParticipantRowProps
>(({ address, verdict, note, tone, addressTone, className, ...props }, ref) => {
  const resolved = tone ?? DEFAULT_TONE[verdict] ?? "muted"
  return (
    <div
      ref={ref}
      className={cn(
        "flex min-w-0 items-baseline gap-2 border-border/55 border-t py-1 first:border-t-0",
        className,
      )}
      {...props}
    >
      <AddressChip
        address={address}
        tone={addressTone ?? ADDRESS_TONE[verdict] ?? "allowed"}
        className="min-w-0 flex-1"
      />
      <span className={cn("shrink-0 text-sm", TONE[resolved])}>{verdict}</span>
      {note != null ? (
        <span className="max-w-[18rem] shrink-0 truncate text-sm text-muted-foreground">
          {note}
        </span>
      ) : null}
    </div>
  )
})
ParticipantRow.displayName = "ParticipantRow"
