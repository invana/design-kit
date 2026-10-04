import * as React from "react"

import { applyBlockPatches, type BlockPatch } from "./patch"
import { patchesOf, type PatchSource } from "./source"

/**
 * Patches to apply as they arrive — a streaming fetch (`fromNdjson`), an
 * EventSource (`fromEventSource`), a generator, or a recorded script
 * (`playScript`). Pass a function, `(signal) => source`, to open the source
 * afresh each time the shell mounts — a generator can be read only once. Keep
 * it stable (module scope, `useCallback`): a new one starts a new stream.
 */
export type SpecStream<P = BlockPatch> = PatchSource<P> | ((signal: AbortSignal) => PatchSource<P>) | null

export interface StreamOptions<S, P> {
  /** The stream ended; the spec as it left it. */
  onEnd?: (spec: S) => void
  /** A patch did not apply, or the source failed. The stream stops there. */
  onError?: (error: unknown) => void
  /** What stopping records — the patches that mark what was running as stopped. */
  stopPatches?: (spec: S) => P[]
}

/**
 * The spec as drawn: the one given, with `stream`'s patches applied by `apply`
 * as they arrive. A new spec starts over from it; `stop()` ends the stream and
 * records how far it got. Every shell that streams — a block, a conversation,
 * a board — reads its stream through this, with its own patch.
 */
export function useStreamedSpec<S, P>(
  spec: S,
  stream: SpecStream<P> | undefined,
  apply: (spec: S, patches: P[]) => S,
  { onEnd, onError, stopPatches }: StreamOptions<S, P> = {},
) {
  const [base, setBase] = React.useState(spec)
  const [live, setLive] = React.useState(spec)
  // A new spec starts over from it, in the same render. With nothing
  // streaming the spec is drawn as given, and nothing is held.
  if (stream && base !== spec) {
    setBase(spec)
    setLive(spec)
  }
  const current = React.useRef(spec)
  const abort = React.useRef<AbortController | null>(null)
  const latest = React.useRef({ apply, onEnd, onError, stopPatches })
  React.useLayoutEffect(() => {
    latest.current = { apply, onEnd, onError, stopPatches }
    current.current = live
  })

  const set = React.useCallback((next: S) => {
    current.current = next
    setLive(next)
  }, [])

  React.useEffect(() => {
    if (!stream) return
    const controller = new AbortController()
    abort.current = controller
    void (async () => {
      try {
        const source = typeof stream === "function" ? stream(controller.signal) : stream
        for await (const batch of patchesOf(source)) {
          if (controller.signal.aborted) return
          set(latest.current.apply(current.current, batch))
        }
        if (!controller.signal.aborted) latest.current.onEnd?.(current.current)
      } catch (error) {
        if (!controller.signal.aborted) latest.current.onError?.(error)
      } finally {
        if (abort.current === controller) abort.current = null
      }
    })()
    return () => controller.abort()
  }, [stream, set])

  const stop = React.useCallback(() => {
    if (!abort.current) return
    abort.current.abort()
    abort.current = null
    const { apply, stopPatches } = latest.current
    if (stopPatches) set(apply(current.current, stopPatches(current.current)))
  }, [set])

  return { live: stream ? live : spec, stop }
}

/**
 * One block's spec, streamed: `spec` with `stream`'s {@link BlockPatch}es
 * applied as they arrive. `<Block stream>` reads it; a shell that draws a
 * block directly calls it.
 *
 * ```tsx
 * const { live } = useBlockStream(spec, (signal) => fromNdjson(await fetch(url, { signal })))
 * <GanttBlock spec={live} />
 * ```
 */
export function useBlockStream<S extends object>(
  spec: S,
  stream: SpecStream<BlockPatch> | undefined,
  options?: Omit<StreamOptions<S, BlockPatch>, "stopPatches">,
) {
  return useStreamedSpec<S, BlockPatch>(spec, stream, applyBlockPatches, options)
}
