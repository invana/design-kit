import {
  ClarifyActions as UiClarifyActions,
  ClarifyCard as UiClarifyCard,
  ClarifyFootnote as UiClarifyFootnote,
} from "@invana/ui"

/*
 * The live ask and its parts, moving from `@invana/ui`; see
 * `conversations/thread.ts` for why they are re-declared.
 */

/** The ask, through its whole life: pending, answered, skipped, superseded, expired. */
export const ClarifyCard = UiClarifyCard
/** The line under an ask: why these options, or where a default came from. */
export const ClarifyFootnote = UiClarifyFootnote
/** The row of controls that answers, skips or changes an ask. */
export const ClarifyActions = UiClarifyActions

export type {
  ClarifyActionsProps,
  ClarifyCardProps,
  ClarifyFootnoteProps,
  ClarifyOption,
  ClarifyState,
} from "@invana/ui"
export * from "./confirm-card"
