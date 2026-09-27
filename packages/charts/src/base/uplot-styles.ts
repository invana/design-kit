/**
 * The part of uPlot's stylesheet these charts need, installed once.
 *
 * uPlot ships `uPlot.min.css`, but a CSS import would make every consumer wire
 * a second stylesheet for a dozen rules — most of them for uPlot's own legend
 * and title, which these charts replace with `Legend` and the panel heading.
 * What is left is positioning, plus the crosshair drawn in the border token.
 */
const CSS = `
.invana-uplot, .invana-uplot * { box-sizing: border-box; }
.invana-uplot { width: min-content; line-height: 1; }
.invana-uplot .u-wrap { position: relative; user-select: none; }
.invana-uplot .u-over, .invana-uplot .u-under { position: absolute; }
.invana-uplot .u-under { overflow: hidden; }
.invana-uplot canvas { display: block; position: relative; width: 100%; height: 100%; }
.invana-uplot .u-axis { position: absolute; }
.invana-uplot .u-select { position: absolute; pointer-events: none; }
.invana-uplot .u-cursor-x, .invana-uplot .u-cursor-y {
  position: absolute; left: 0; top: 0; pointer-events: none; will-change: transform;
}
.invana-uplot .u-hz .u-cursor-x { height: 100%; border-right: 1px solid var(--color-border); }
.invana-uplot .u-cursor-pt {
  position: absolute; top: 0; left: 0; border-radius: 50%; border: 0 solid;
  pointer-events: none; will-change: transform; background-clip: padding-box !important;
}
.invana-uplot .u-off { display: none; }
`

const ID = "invana-charts-uplot"

export function installUPlotStyles(): void {
  if (typeof document === "undefined" || document.getElementById(ID)) return
  const style = document.createElement("style")
  style.id = ID
  style.textContent = CSS
  document.head.appendChild(style)
}
