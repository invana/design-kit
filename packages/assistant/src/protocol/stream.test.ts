import { describe, expect, it } from "vitest"

import { applyPatches } from "./reduce"
import {
  fromNdjson,
  isRunning,
  offsetScript,
  patchesOf,
  playScript,
  scriptLength,
  stopPatches,
  textDeltas,
  thinkingDeltas,
} from "./stream"
import type { AnswerTurn, ConversationSpec } from "./types"

const running: ConversationSpec = {
  id: "c1",
  turns: [
    { id: "t1", role: "analyst", text: "Rank airports by betweenness" },
    {
      id: "t2",
      role: "assistant",
      kind: "answer",
      state: "running",
      startedAt: "2026-09-30T09:00:00.000Z",
      trace: [
        { id: "understand", label: "Understand", state: "done", duration: 900 },
        { id: "execute", label: "Execute", state: "running", startedAt: "2026-09-30T09:00:01.000Z", thinking: "…" },
        { id: "project", label: "Project", state: "pending" },
      ],
      blocks: [],
    },
  ],
}

async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = []
  for await (const item of source) out.push(item)
  return out
}

describe("stream", () => {
  it("text deltas join back to the text, in order and on time", () => {
    const text = "Found 14 airlines.  Added 14 nodes."
    const script = textDeltas("t2", text, { from: 100, every: 10 })
    expect(script.map((s) => (s.patch as { text: string }).text).join("")).toBe(text)
    expect(script[0].at).toBe(100)
    expect(script[1].at).toBe(110)
    expect(thinkingDeltas("t2", "execute", "a b c").map((s) => s.patch)).toEqual([
      { op: "append-thinking", turn: "t2", step: "execute", text: "a " },
      { op: "append-thinking", turn: "t2", step: "execute", text: "b " },
      { op: "append-thinking", turn: "t2", step: "execute", text: "c" },
    ])
  })

  it("plays a script in order, batching steps due together", async () => {
    const script = offsetScript(
      [
        { at: 2, patch: { op: "update-spec", fields: { title: "b" } } },
        { at: 0, patch: { op: "update-spec", fields: { title: "a" } } },
        { at: 2, patch: [{ op: "update-spec", fields: { title: "c" } }] },
      ],
      1,
    )
    expect(scriptLength(script)).toBe(3)
    const batches = await collect(playScript(script, { speed: 100 }))
    expect(batches.map((b) => b.length)).toEqual([1, 2])
    expect(applyPatches(running, batches.flat()).title).toBe("c")
  })

  it("stops a play where it stands", async () => {
    const controller = new AbortController()
    controller.abort()
    expect(await collect(playScript([{ at: 0, patch: { op: "update-spec", fields: {} } }], { signal: controller.signal }))).toEqual([])
  })

  it("reads patches from newline-delimited JSON, split anywhere", async () => {
    const lines = '{"op":"update-spec","fields":{"title":"a"}}\n[{"op":"update-spec","fields":{"title":"b"}}]\n'
    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(lines.slice(0, 17)))
        controller.enqueue(encoder.encode(lines.slice(17)))
        controller.close()
      },
    })
    const batches = await collect(patchesOf(fromNdjson(body)))
    expect(batches.flat().map((p) => (p as { fields: { title: string } }).fields.title)).toEqual(["a", "b"])
  })

  it("stopping marks the run and its running step, and leaves the rest", () => {
    expect(isRunning(running)).toBe(true)
    const now = Date.parse("2026-09-30T09:00:03.500Z")
    const stopped = applyPatches(running, stopPatches(running, now))
    const t2 = stopped.turns[1] as AnswerTurn
    expect(isRunning(stopped)).toBe(false)
    expect(t2.state).toBe("stopped")
    expect(t2.duration).toBe(3500)
    expect(t2.trace?.map((s) => s.state)).toEqual(["done", "stopped", "pending"])
    expect(t2.trace?.[1].duration).toBe(2500)
    expect(t2.trace?.[1].thinking).toBeUndefined()
  })
})
