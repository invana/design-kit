import * as React from "react"

import { applyPatches, type ConversationPatch } from "../protocol/reduce"
import {
  isRunning,
  type PatchScript,
  type PatchSource,
  patchesOf,
  playScript,
  stopPatches,
} from "../protocol/stream"
import type { ConversationSpec } from "../protocol/types"

export interface UseChatSession {
  /** The conversation as it stands — pass it to `<ChatSession spec>`. */
  spec: ConversationSpec
  /** Apply a patch, or several in order. */
  apply: (patch: ConversationPatch | ConversationPatch[]) => void
  /**
   * Apply a stream of patches as they arrive — `fromNdjson(await fetch(…))`,
   * `fromEventSource(…)`, a generator. Resolves with the spec where it ended.
   * A stream started while another runs runs beside it; `stop()` ends both.
   */
  stream: (source: PatchSource) => Promise<ConversationSpec>
  /** Replay a recorded script, on its own timing. */
  play: (script: PatchScript, options?: { speed?: number }) => Promise<ConversationSpec>
  /** End every stream, and mark what was running as stopped where it stood. */
  stop: () => void
  /** Start over from a spec, ending every stream. */
  reset: (spec: ConversationSpec) => void
  /** Whether a stream is still arriving. */
  streaming: boolean
  /** Whether anything in the spec is still running. */
  running: boolean
}

/**
 * A conversation's state for a host that drives it: the spec, and the ways
 * patches reach it. The session draws; this holds.
 *
 * ```tsx
 * const chat = useChatSession(initial)
 * <ChatSession spec={chat.spec} onPrompt={(e) => chat.stream(fromNdjson(await ask(e.text)))} onStop={chat.stop} />
 * ```
 */
export function useChatSession(initial: ConversationSpec | (() => ConversationSpec)): UseChatSession {
  const [spec, setSpec] = React.useState(initial)
  const current = React.useRef(spec)
  const controllers = React.useRef(new Set<AbortController>())
  const [streams, setStreams] = React.useState(0)

  const set = React.useCallback((next: ConversationSpec) => {
    current.current = next
    setSpec(next)
  }, [])

  const apply = React.useCallback(
    (patch: ConversationPatch | ConversationPatch[]) =>
      set(applyPatches(current.current, Array.isArray(patch) ? patch : [patch])),
    [set],
  )

  const run = React.useCallback(
    async (open: (signal: AbortSignal) => PatchSource) => {
      const controller = new AbortController()
      controllers.current.add(controller)
      setStreams((n) => n + 1)
      try {
        for await (const batch of patchesOf(open(controller.signal))) {
          if (controller.signal.aborted) break
          set(applyPatches(current.current, batch))
        }
      } finally {
        controllers.current.delete(controller)
        setStreams((n) => n - 1)
      }
      return current.current
    },
    [set],
  )

  const stream = React.useCallback((source: PatchSource) => run(() => source), [run])
  const play = React.useCallback(
    (script: PatchScript, options?: { speed?: number }) =>
      run((signal) => playScript(script, { ...options, signal })),
    [run],
  )

  const abortAll = () => {
    for (const c of controllers.current) c.abort()
    controllers.current.clear()
  }

  const stop = React.useCallback(() => {
    abortAll()
    set(applyPatches(current.current, stopPatches(current.current)))
  }, [set])

  const reset = React.useCallback(
    (next: ConversationSpec) => {
      abortAll()
      set(next)
    },
    [set],
  )

  // Streams end with the component that started them.
  React.useEffect(() => () => abortAll(), [])

  return { spec, apply, stream, play, stop, reset, streaming: streams > 0, running: isRunning(spec) }
}
