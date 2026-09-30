import { BarChartH } from "@invana/charts"

import type { BlockRendererProps } from "../../conversations/registry"
import { figureText } from "./figure"

/**
 * Items in the order they matter — drivers, top-N, likely causes — each with
 * its bar, and its value in a column at the right. A negative contribution
 * draws in the destructive colour; the rest, folded into one line, is muted.
 * `diverging` grows the bars both ways from zero.
 */
export function RankedBlock({ block }: BlockRendererProps<"ranked">) {
  return (
    <BarChartH
      variant="ranked"
      color="var(--color-primary)"
      diverging={block.diverging}
      data={block.items.map((item) => ({
        label: item.label,
        value: item.value,
        display: item.display ?? figureText(item.value),
        muted: item.muted,
      }))}
    />
  )
}
