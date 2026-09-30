import { BarChartV } from "@invana/charts"

import type { BlockRendererProps } from "../../conversations/registry"

/** Places after the point, so a column of `6.1, 6.0` is not written `6.1, 6`. */
const decimals = (v: number) => (String(v).split(".")[1] ?? "").length

/** A series drawn as the comparison — last quarter behind this one. */
const MUTED = "color-mix(in srgb, var(--color-muted-foreground) 45%, transparent)"

/**
 * Groups compared as columns. Two or more series sit side by side in each group
 * with a legend, a muted one drawn as the comparison, against a dashed target.
 * One series is drawn muted with the called-out group in primary and its value
 * on the cap. A plan per group is a dashed column each actual stands inside.
 */
export function BarsBlock({ block }: BlockRendererProps<"bars">) {
  const single = block.series.length === 1
  const places = Math.max(0, ...block.series.flatMap((s) => s.values.map(decimals)))
  // A percent sign travels with the figure; any other unit is named once, in the header.
  const write = (v: number) =>
    v.toLocaleString("en-GB", { minimumFractionDigits: places, maximumFractionDigits: places }) +
    (block.unit === "%" ? "%" : "")
  const highlight = block.highlight == null ? -1 : block.groups.indexOf(block.highlight)
  const called = single && highlight >= 0
  return (
    <BarChartV
      aria-label={block.series.map((s) => s.name).join(", ") + (block.unit ? `, ${block.unit}` : "")}
      variant="comparison"
      height={80}
      labelMode={called ? "last" : "none"}
      color={called ? "var(--color-muted-foreground)" : "var(--color-primary)"}
      highlightColor="var(--color-primary)"
      highlightIndex={called ? highlight : null}
      target={block.target ? { ...block.target, color: "var(--color-warning)" } : undefined}
      planLabel={block.plan?.name}
      series={
        single && !block.plan
          ? undefined
          : block.series.map((s) => ({
              name: s.name,
              color: s.muted ? MUTED : "var(--color-primary)",
            }))
      }
      data={block.groups.map((label, i) =>
        single
          ? {
              label,
              value: block.series[0]!.values[i] ?? 0,
              display: write(block.series[0]!.values[i] ?? 0),
              plan: block.plan?.values[i],
            }
          : {
              label,
              values: block.series.map((s) => s.values[i] ?? 0),
              display: block.series.map((s) => write(s.values[i] ?? 0)),
            },
      )}
    />
  )
}
