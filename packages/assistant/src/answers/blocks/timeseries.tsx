import { LineChart } from "@invana/charts"

import type { BlockRendererProps } from "../../conversations/registry"
import type { Tone } from "../../protocol/types"
import { figureText } from "./figure"

/** The grammar's tones, as the tokens a ring is drawn in. */
const RING_COLOR: Record<Tone, string> = {
  good: "var(--color-success)",
  bad: "var(--color-destructive)",
  warn: "var(--color-warning)",
  neutral: "var(--color-muted-foreground)",
}

/**
 * A measure over time: the line in the foreground, the range it is judged
 * against shaded in primary beneath it, and the periods that stand out ringed
 * in their tone. The first series is drawn; a period is named by its label.
 */
export function TimeseriesBlock({ block }: BlockRendererProps<"timeseries">) {
  const series = block.series[0]
  if (!series) return null
  const labels = series.points.map(([at]) => at)
  const values = series.points.map(([, value]) => value)
  const at = (label: string | undefined) => (label == null ? -1 : labels.indexOf(label))
  const forecastFrom = at(block.forecastFrom)
  const format = (value: number) => {
    const n = figureText(Math.round(value * 10) / 10)
    return block.unit ? `${n} ${block.unit}` : n
  }
  return (
    <LineChart
      aria-label={series.name}
      values={values}
      labels={labels}
      format={format}
      zero={false}
      color="var(--color-foreground)"
      band={block.band && { ...block.band, color: "var(--color-primary)" }}
      highlights={(block.marks ?? [])
        .map((mark) => ({ index: at(mark.at), color: RING_COLOR[mark.tone ?? "neutral"] }))
        .filter((mark) => mark.index >= 0)}
      forecastFrom={forecastFrom >= 0 ? forecastFrom : undefined}
      forecastLabel={block.forecastLabel}
    />
  )
}
