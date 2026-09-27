import * as React from "react"

import { readChartTheme, type ChartTheme } from "./theme"

/**
 * The attributes on `<html>` a theme, a mode or a density switch changes.
 * `data-density` is watched ahead of the token landing in `@invana/styling`,
 * so a chart redraws the day it does without a change here.
 */
const THEME_ATTRIBUTES = ["class", "style", "data-theme", "data-density"]

/**
 * The resolved tokens for the chart at `ref`, re-read whenever the root's theme,
 * mode or density changes, or the OS colour scheme flips under a `system` theme.
 * `null` until the element has mounted.
 */
export function useChartTheme(ref: React.RefObject<HTMLElement | null>): ChartTheme | null {
  const [theme, setTheme] = React.useState<ChartTheme | null>(null)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const read = () => setTheme(readChartTheme(el))
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: THEME_ATTRIBUTES,
    })
    const scheme = window.matchMedia?.("(prefers-color-scheme: dark)")
    scheme?.addEventListener?.("change", read)
    // Fonts arriving late change the measured text, not the tokens — but a
    // canvas drawn before they load keeps the fallback face until redrawn.
    document.fonts?.ready.then(read).catch(() => {})
    return () => {
      observer.disconnect()
      scheme?.removeEventListener?.("change", read)
    }
  }, [ref])

  return theme
}

/**
 * The element's content width, so a canvas is drawn at its real size and its
 * text is never stretched. `0` until measured.
 */
export function useWidth(ref: React.RefObject<HTMLElement | null>): number {
  const [width, setWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(Math.floor(el.getBoundingClientRect().width))
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return width
}
