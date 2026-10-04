import type { BlockPatch } from "./patch"

/**
 * A spec arrives once, then as patches. These are the ways the patches can
 * arrive — one at a time or in batches, from a fetch body, an EventSource, a
 * generator, or a recorded script — read the same way by every shell that
 * streams: a block (`useBlockStream`), a conversation, a board. `P` is the
 * shell's patch; a block's is {@link BlockPatch}.
 */
export type PatchChunk<P = BlockPatch> = P | P[]
export type PatchSource<P = BlockPatch> = AsyncIterable<PatchChunk<P>> | Iterable<PatchChunk<P>>

const toArray = <P>(chunk: PatchChunk<P>) => (Array.isArray(chunk) ? chunk : [chunk])

/** Every patch of a source, in the batches they arrived in. */
export async function* patchesOf<P = BlockPatch>(source: PatchSource<P>): AsyncGenerator<P[]> {
  for await (const chunk of source as AsyncIterable<PatchChunk<P>>) yield toArray(chunk)
}

// ── wire adapters ───────────────────────────────────────────────────────────

/**
 * Patches from a newline-delimited JSON body: one patch, or an array of them,
 * per line. Pass the `Response` of a streaming `fetch`, or its body.
 */
export async function* fromNdjson<P = BlockPatch>(
  input: Response | ReadableStream<Uint8Array>,
): AsyncGenerator<PatchChunk<P>> {
  const body = input instanceof Response ? input.body : input
  if (!body) return
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffered = ""
  try {
    for (;;) {
      const { value, done } = await reader.read()
      buffered += decoder.decode(value, { stream: !done })
      let newline = buffered.indexOf("\n")
      while (newline >= 0) {
        const line = buffered.slice(0, newline).trim()
        buffered = buffered.slice(newline + 1)
        if (line) yield JSON.parse(line) as PatchChunk<P>
        newline = buffered.indexOf("\n")
      }
      if (done) break
    }
    const rest = buffered.trim()
    if (rest) yield JSON.parse(rest) as PatchChunk<P>
  } finally {
    reader.releaseLock()
  }
}

export interface EventSourceOptions {
  /** The event whose data is a patch. @default "message" */
  event?: string
  /** The event that ends the stream. @default "done" */
  done?: string
  /** Close the EventSource when the stream ends. @default true */
  close?: boolean
}

/** Patches from Server-Sent Events: each event's `data` is a patch, or an array of them. */
export async function* fromEventSource<P = BlockPatch>(
  source: EventSource,
  { event = "message", done = "done", close = true }: EventSourceOptions = {},
): AsyncGenerator<PatchChunk<P>> {
  const queue: PatchChunk<P>[] = []
  let finished = false
  let failure: unknown
  let wake: (() => void) | undefined
  const notify = () => {
    wake?.()
    wake = undefined
  }
  const onData = (e: MessageEvent) => {
    try {
      queue.push(JSON.parse(e.data as string) as PatchChunk<P>)
    } catch (error) {
      failure = error
    }
    notify()
  }
  const onDone = () => {
    finished = true
    notify()
  }
  const onError = () => {
    // EventSource reconnects on its own while CONNECTING; CLOSED is the end.
    if (source.readyState === EventSource.CLOSED) onDone()
  }
  source.addEventListener(event, onData as EventListener)
  source.addEventListener(done, onDone)
  source.addEventListener("error", onError)
  try {
    for (;;) {
      if (failure) throw failure
      const next = queue.shift()
      if (next) {
        yield next
        continue
      }
      if (finished) return
      await new Promise<void>((resolve) => (wake = resolve))
    }
  } finally {
    source.removeEventListener(event, onData as EventListener)
    source.removeEventListener(done, onDone)
    source.removeEventListener("error", onError)
    if (close) source.close()
  }
}

// ── recorded scripts ────────────────────────────────────────────────────────

/** A patch and when it lands, in ms from the start of the script. */
export interface ScriptStep<P = BlockPatch> {
  at: number
  patch: PatchChunk<P>
}

/** A recorded stream: plain JSON, replayed by {@link playScript} or step by step with {@link scriptFrames}. */
export type PatchScript<P = BlockPatch> = ScriptStep<P>[]

export interface PlayOptions {
  /** 2 plays twice as fast. @default 1 */
  speed?: number
  signal?: AbortSignal
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal?.aborted || ms <= 0) return resolve()
    const timer = setTimeout(done, ms)
    function done() {
      clearTimeout(timer)
      signal?.removeEventListener("abort", done)
      resolve()
    }
    signal?.addEventListener("abort", done, { once: true })
  })
}

/**
 * A script's patches, batched by when they land: one batch per moment, in
 * order — what {@link playScript} yields, without the waiting.
 */
export function scriptFrames<P>(script: PatchScript<P>): { at: number; patches: P[] }[] {
  const frames: { at: number; patches: P[] }[] = []
  for (const step of [...script].sort((a, b) => a.at - b.at)) {
    const last = frames[frames.length - 1]
    if (last?.at === step.at) last.patches.push(...toArray(step.patch))
    else frames.push({ at: step.at, patches: toArray(step.patch) })
  }
  return frames
}

/**
 * A script as a stream: each step is yielded when it is due. Steps due at the
 * same moment are yielded together; aborting ends the stream where it stands.
 */
export async function* playScript<P>(
  script: PatchScript<P>,
  { speed = 1, signal }: PlayOptions = {},
): AsyncGenerator<P[]> {
  let clock = 0
  for (const frame of scriptFrames(script)) {
    if (signal?.aborted) return
    await sleep((frame.at - clock) / speed, signal)
    if (signal?.aborted) return
    clock = frame.at
    yield frame.patches
  }
}

/** Shift every step of a script by `ms` — to chain scripts one after another. */
export const offsetScript = <P>(script: PatchScript<P>, ms: number): PatchScript<P> =>
  script.map((s) => ({ ...s, at: s.at + ms }))

/** When a script's last step lands. */
export const scriptLength = <P>(script: PatchScript<P>) => script.reduce((m, s) => Math.max(m, s.at), 0)
