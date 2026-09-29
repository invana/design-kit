import { BarChartH } from "@invana/charts"

import type { BlockRendererProps } from "../../conversations/registry"
import { figureText } from "./figure"

/**
 * Items in the order they matter — drivers, top-N, likely causes — each with
 * its bar, and its value in a column at the right. A negative contribution
 * draws in the destructive colour.
 */
export function RankedBlock({ block }: BlockRendererProps<"ranked">) {
  return (
    <BarChartH
      variant="ranked"
      color="var(--color-primary)"
      data={block.items.map((item) => ({
        label: item.label,
        value: item.value,
        display: item.display ?? figureText(item.value),
      }))}
    />
  )
}
