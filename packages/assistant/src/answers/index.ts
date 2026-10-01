import {
  CitationMarker as UiCitationMarker,
  EmissionBody as UiEmissionBody,
  EmissionCard as UiEmissionCard,
  EmissionHeader as UiEmissionHeader,
  TemplatePicker as UiTemplatePicker,
} from "@invana/ui"

/*
 * The answer card and what hangs off it, moving from `@invana/ui`; see
 * `conversations/thread.ts` for why they are re-declared.
 */

/** The answer card. An answer is its blocks inside this card. */
export const EmissionCard = UiEmissionCard
/** The card's body: its blocks in one padded column. */
export const EmissionBody = UiEmissionBody
/** The strip that says what an answer is and what it is grounded in. */
export const EmissionHeader = UiEmissionHeader
/** The superscript that ties a clause to the records behind it. */
export const CitationMarker = UiCitationMarker
/** Re-render the same records as another block. */
export const TemplatePicker = UiTemplatePicker

export type {
  EmissionCardProps,
  EmissionHeaderProps,
  EmissionKind,
  TemplateOption,
  TemplatePickerProps,
} from "@invana/ui"

export { answerToPage } from "./page"
