import * as React from "react"

/**
 * A ref that always holds the latest value — for a callback such as `format`,
 * which callers pass inline, so a new function each render does not rebuild
 * the canvas.
 */
export function useLatest<T>(value: T): React.RefObject<T> {
  const ref = React.useRef(value)
  React.useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
