/**
 * The tokens a canvas draws in, resolved to concrete values.
 *
 * A canvas cannot read `var()`: `ctx.fillStyle = "var(--color-data-1)"` is
 * silently ignored. So every colour and size a uPlot chart uses is read off the
 * live document here, through a probe element that sits inside the chart — a
 * theme scoped to a subtree resolves the same as one on the root.
 *
 * Read on every redraw rather than cached: a redraw happens on a theme,
 * density or size change, which is exactly when a cache would be stale.
 */

export interface ChartTheme {
  /** `--color-data-1…8`, in slot order. Index 0 is slot 1. */
  data: string[]
  success: string
  warning: string
  destructive: string
  foreground: string
  mutedForeground: string
  border: string
  card: string
  /** Canvas font strings — `"11px Inter, sans-serif"` — for the three rungs. */
  font: { base: string; sm: string; xs: string }
  /** The same rungs in CSS pixels, for layout arithmetic. */
  size: { base: number; sm: number; xs: number }
  /** The inherited font family, for fonts a draw hook builds at device scale. */
  family: string
}

export const DATA_SLOTS = 8

/** Resolve any CSS colour (a token, `var()`, a named colour) against `host`. */
export function resolveColor(host: HTMLElement, css: string): string {
  const probe = document.createElement("span")
  probe.style.color = css
  probe.style.display = "none"
  host.appendChild(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return toRgba(value)
}

let pixel: CanvasRenderingContext2D | null | undefined

/**
 * Normalise to `rgba()`. A browser may hand back a computed colour in the space
 * it was authored in — `oklch(…)`, `color(srgb …)` — so the value is painted to
 * one pixel and read back, which is the one form every canvas API accepts and
 * `withAlpha` can take apart.
 */
function toRgba(css: string): string {
  if (/^rgba?\(/.test(css)) return css
  if (pixel === undefined) {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    pixel = canvas.getContext("2d", { willReadFrequently: true })
  }
  if (!pixel) return css
  pixel.clearRect(0, 0, 1, 1)
  pixel.fillStyle = css
  pixel.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data
  return `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 1000) / 1000})`
}

function resolveSize(host: HTMLElement, css: string): number {
  const probe = document.createElement("span")
  probe.style.fontSize = css
  probe.style.display = "none"
  host.appendChild(probe)
  const value = parseFloat(getComputedStyle(probe).fontSize)
  probe.remove()
  return value
}

export function readChartTheme(host: HTMLElement): ChartTheme {
  const color = (name: string) => resolveColor(host, `var(${name})`)
  const family = getComputedStyle(host).fontFamily
  // The type ladder is `--text-*`, a ratio of the root: whatever the root is,
  // the canvas follows it exactly as the DOM text beside it does.
  const size = {
    base: resolveSize(host, "var(--text-base, 1rem)"),
    sm: resolveSize(host, "var(--text-sm, 0.923rem)"),
    xs: resolveSize(host, "var(--text-xs, 0.846rem)"),
  }
  return {
    data: Array.from({ length: DATA_SLOTS }, (_, i) =>
      resolveColor(host, `var(--color-data-${i + 1}, var(--color-muted-foreground))`),
    ),
    success: color("--color-success"),
    warning: color("--color-warning"),
    destructive: color("--color-destructive"),
    foreground: color("--color-foreground"),
    mutedForeground: color("--color-muted-foreground"),
    border: color("--color-border"),
    card: color("--color-card"),
    // Whole pixels: uPlot rescales a font for the device by matching
    // `(\d+)px`, which reads `10.998px` as `998px`.
    font: {
      base: `${Math.round(size.base)}px ${family}`,
      sm: `${Math.round(size.sm)}px ${family}`,
      xs: `${Math.round(size.xs)}px ${family}`,
    },
    size,
    family,
  }
}

/** A colour at an alpha, from the `rgb()`/`rgba()` a probe returns. */
export function withAlpha(rgb: string, alpha: number): string {
  const parts = rgb.match(/[\d.]+/g)
  if (!parts || parts.length < 3) return rgb
  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`
}
