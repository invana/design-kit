import { describe, expect, it } from "vitest"

import { applyBlockPatch, applyBlockPatches, BlockPatchError } from "./patch"
import { type PatchScript, playScript, scriptFrames } from "./source"

const gantt = {
  kind: "gantt",
  tasks: [
    { key: "plan", status: "running", startMs: 0, subtasks: [{ key: "fetch", status: "queued" }] },
    { key: "answer", status: "queued" },
  ],
  nowMs: 400,
  openEnded: true,
}

describe("applyBlockPatch", () => {
  it("sets fields, and never the kind", () => {
    const next = applyBlockPatch(gantt, { op: "set", fields: { nowMs: 900, kind: "table" } })
    expect(next).toMatchObject({ kind: "gantt", nowMs: 900, openEnded: true })
    expect(gantt.nowMs).toBe(400)
  })

  it("removes a field sent as null, since JSON cannot send undefined", () => {
    const next = applyBlockPatches(gantt, [
      { op: "set", fields: { nowMs: null, openEnded: null, spanMs: 900 } },
      { op: "upsert", at: ["tasks"], item: { key: "plan", startMs: null, status: "skipped" } },
    ])
    expect(next).toEqual({ kind: "gantt", tasks: [{ key: "plan", status: "skipped", subtasks: gantt.tasks[0].subtasks }, gantt.tasks[1]], spanMs: 900 })
  })

  it("reaches a nested item by key, and copies only along the path", () => {
    const next = applyBlockPatches(gantt, [
      { op: "upsert", at: ["tasks", "plan", "subtasks"], item: { key: "fetch", status: "running", startMs: 100 } },
      { op: "upsert", at: ["tasks", "plan", "subtasks"], item: { key: "rank", status: "queued" } },
      { op: "set", at: ["tasks", "plan"], fields: { open: true } },
    ])
    expect(next.tasks[0]).toEqual({
      key: "plan",
      status: "running",
      startMs: 0,
      open: true,
      subtasks: [
        { key: "fetch", status: "running", startMs: 100 },
        { key: "rank", status: "queued" },
      ],
    })
    expect(next.tasks[1]).toBe(gantt.tasks[1])
  })

  it("appends text and pushes items, making the field when it is missing", () => {
    const next = applyBlockPatches({ kind: "narrative" } as Record<string, unknown>, [
      { op: "append", at: ["text"], text: "Margin fell " },
      { op: "append", at: ["text"], text: "1.8 pts." },
      { op: "push", at: ["points"], items: [[0, 1]] },
      { op: "push", at: ["points"], items: [[1, 2], [2, 3]] },
    ])
    expect(next).toEqual({ kind: "narrative", text: "Margin fell 1.8 pts.", points: [[0, 1], [1, 2], [2, 3]] })
  })

  it("reads a list by index, and an item by id when it has no key", () => {
    const next = applyBlockPatches({ steps: [{ id: "a", state: "running" }], rows: [[1], [2]] }, [
      { op: "upsert", at: ["steps"], item: { id: "a", state: "done" } },
      { op: "push", at: ["rows", 1], items: [3] },
    ])
    expect(next).toEqual({ steps: [{ id: "a", state: "done" }], rows: [[1], [2, 3]] })
  })

  it("refuses a path that is not there, or the wrong shape", () => {
    expect(() => applyBlockPatch(gantt, { op: "set", at: ["tasks", "nope"], fields: {} })).toThrow(BlockPatchError)
    expect(() => applyBlockPatch(gantt, { op: "append", at: ["tasks"], text: "x" })).toThrow(BlockPatchError)
    expect(() => applyBlockPatch(gantt, { op: "push", at: ["nowMs"], items: [] })).toThrow(BlockPatchError)
    expect(() => applyBlockPatch(gantt, { op: "upsert", at: ["tasks"], item: { status: "queued" } })).toThrow(BlockPatchError)
    expect(() => applyBlockPatch(gantt, { op: "set", at: ["nowMs", "x"], fields: {} })).toThrow(BlockPatchError)
  })
})

describe("scripts", () => {
  const script: PatchScript = [
    { at: 20, patch: { op: "set", fields: { nowMs: 2 } } },
    { at: 0, patch: [{ op: "set", fields: { nowMs: 0 } }] },
    { at: 20, patch: { op: "set", fields: { openEnded: false } } },
  ]

  it("batches a script by when it lands, in order", () => {
    expect(scriptFrames(script).map((f) => [f.at, f.patches.length])).toEqual([
      [0, 1],
      [20, 2],
    ])
  })

  it("plays the same batches", async () => {
    const out = []
    for await (const batch of playScript(script, { speed: 100 })) out.push(batch)
    expect(out).toEqual(scriptFrames(script).map((f) => f.patches))
  })
})
