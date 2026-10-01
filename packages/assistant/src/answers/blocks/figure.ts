import type { Figure } from "../../protocol/types"

/**
 * A figure as text. A string arrives already written; a number or a typed
 * value is written here, plainly, until `formatValue` lands in `@invana/ui`.
 */
export function figureText(figure: Figure): string {
  if (typeof figure === "string") return figure
  if (typeof figure === "number") return figure.toLocaleString("en-GB")
  const n = figure.value.toLocaleString("en-GB")
  return figure.unit ? `${n} ${figure.unit}` : n
}
