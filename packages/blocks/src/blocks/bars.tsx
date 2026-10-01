import { BarChartV } from "@invana/charts"

import type { BlockProps } from "../types"


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
export function BarsBlock({ spec }: BlockProps<"bars">) {
  const single = spec.series.length === 1
  const places = Math.max(0, ...spec.series.flatMap((s) => s.values.map(decimals)))
  // A percent sign travels with the figure; any other unit is named once, in the header.
  const write = (v: number) =>
    v.toLocaleString("en-GB", { minimumFractionDigits: places, maximumFractionDigits: places }) +
    (spec.unit === "%" ? "%" : "")
  const highlight = spec.highlight == null ? -1 : spec.groups.indexOf(spec.highlight)
  const called = single && highlight >= 0
  return (
    <BarChartV
      aria-label={spec.series.map((s) => s.name).join(", ") + (spec.unit ? `, ${spec.unit}` : "")}
      variant="comparison"
      height={80}
      labelMode={called ? "last" : "none"}
      color={called ? "var(--color-muted-foreground)" : "var(--color-primary)"}
      highlightColor="var(--color-primary)"
      highlightIndex={called ? highlight : null}
      target={spec.target ? { ...spec.target, color: "var(--color-warning)" } : undefined}
      planLabel={spec.plan?.name}
      series={
        single && !spec.plan
          ? undefined
          : spec.series.map((s) => ({
              name: s.name,
              color: s.muted ? MUTED : "var(--color-primary)",
            }))
      }
      data={spec.groups.map((label, i) =>
        single
          ? {
              label,
              value: spec.series[0]!.values[i] ?? 0,
              display: write(spec.series[0]!.values[i] ?? 0),
              plan: spec.plan?.values[i],
            }
          : {
              label,
              values: spec.series.map((s) => s.values[i] ?? 0),
              display: spec.series.map((s) => write(s.values[i] ?? 0)),
            },
      )}
    />
  )
}
