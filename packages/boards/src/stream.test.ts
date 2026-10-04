import { describe, expect, it } from "vitest"

import { applyBoardPatch, applyBoardPatches, BoardPatchError } from "./stream"
import type { BoardSpec } from "./types"

const spec: BoardSpec = {
  rows: [{ panels: [{ id: "run", kind: "gantt", title: "Run", aside: "0 s", options: { tasks: [{ key: "plan", status: "running" }] } }] }],
  tabs: [{ id: "t", label: "Tab", rows: [{ panels: [{ id: "note", kind: "narrative", options: { text: "" } }] }] }],
}

describe("applyBoardPatch", () => {
  it("streams a panel's block by the block's own patch, in a row or a tab", () => {
    const next = applyBoardPatches(spec, [
      { op: "patch-panel", panel: "run", patch: { op: "upsert", at: ["tasks"], item: { key: "plan", status: "succeeded" } } },
      { op: "update-panel", panel: "run", fields: { aside: "1.2 s", title: null } },
      { op: "patch-panel", panel: "note", patch: { op: "append", at: ["text"], text: "Done." } },
    ])
    expect(next.rows[0].panels[0]).not.toHaveProperty("title")
    expect(next.rows[0].panels[0]).toMatchObject({
      aside: "1.2 s",
      options: { tasks: [{ key: "plan", status: "succeeded" }] },
    })
    expect(next.tabs?.[0].rows[0].panels[0].options).toEqual({ text: "Done." })
    expect(spec.rows[0].panels[0].aside).toBe("0 s")
  })

  it("refuses a panel that is not there, or a patch that does not apply", () => {
    expect(() => applyBoardPatch(spec, { op: "update-panel", panel: "nope", fields: {} })).toThrow(BoardPatchError)
    expect(() =>
      applyBoardPatch(spec, { op: "patch-panel", panel: "run", patch: { op: "append", at: ["tasks"], text: "x" } }),
    ).toThrow(BoardPatchError)
  })
})
