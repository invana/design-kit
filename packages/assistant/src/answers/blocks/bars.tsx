import { BarChartV } from "@invana/charts"

import type { BlockRendererProps } from "../../conversations/registry"

/** Places after the point, so a column of `6.1, 6.0` is not written `6.1, 6`. */
const decimals = (v: number) => (String(v).split(".")[1] ?? "").length

/**
 * Groups compared as columns against a dashed target or average when there is
 * one, every value on its cap and written to the same number of places. One
 * series is drawn muted with the highlighted group in primary; two or more sit
 * side by side in each group, with a legend.
 */
export function BarsBlock({ block }: BlockRendererProps<"bars">) {
  const single = block.series.length === 1
  const places = Math.max(0, ...block.series.flatMap((s) => s.values.map(decimals)))
  const write = (v: number) =>
    v.toLocaleString("en-GB", { minimumFractionDigits: places, maximumFractionDigits: places })
  const highlight = block.highlight == null ? -1 : block.groups.indexOf(block.highlight)
  return (
    <BarChartV
      aria-label={block.series.map((s) => s.name).join(", ") + (block.unit ? `, ${block.unit}` : "")}
      caption={block.caption}
      variant="comparison"
      labelMode="all"
      color={single && highlight >= 0 ? "var(--color-muted-foreground)" : "var(--color-primary)"}
      highlightColor="var(--color-primary)"
      highlightIndex={highlight >= 0 ? highlight : null}
      target={block.target}
      series={single ? undefined : block.series.map((s) => ({ name: s.name }))}
      data={block.groups.map((label, i) =>
        single
          ? { label, value: block.series[0]!.values[i] ?? 0, display: write(block.series[0]!.values[i] ?? 0) }
          : {
              label,
              values: block.series.map((s) => s.values[i] ?? 0),
              display: block.series.map((s) => write(s.values[i] ?? 0)),
            },
      )}
    />
  )
}
