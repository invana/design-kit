import { describe, expect, it } from "vitest"

import { applyPatch, applyPatches, PatchError } from "./reduce"
import type { AnswerTurn, ConversationSpec } from "./types"

const base: ConversationSpec = {
  id: "c1",
  turns: [
    { id: "t1", role: "analyst", text: "Why did margin fall?" },
    {
      id: "t2",
      role: "assistant",
      kind: "ask",
      stage: "frame",
      state: "pending",
      ask: { preset: "single", question: "Which margin?", options: [{ value: "op", label: "Operating" }] },
    },
  ],
}

describe("applyPatch", () => {
  it("never mutates the spec it was given", () => {
    const before = JSON.stringify(base)
    applyPatch(base, { op: "set-state", turn: "t2", state: "answered", value: "op" })
    expect(JSON.stringify(base)).toBe(before)
  })

  it("settles an ask with its value", () => {
    const next = applyPatch(base, { op: "set-state", turn: "t2", state: "answered", value: "op" })
    expect(next.turns[1]).toMatchObject({ state: "answered", value: "op" })
  })

  it("streams an answer: turn, trace steps, blocks, then complete", () => {
    const answer: AnswerTurn = { id: "t3", role: "assistant", kind: "answer", state: "running", blocks: [] }
    const next = applyPatches(base, [
      { op: "add-turn", turn: answer },
      { op: "add-trace-step", turn: "t3", step: { id: "read", label: "Read ledger", state: "running" } },
      { op: "add-trace-step", turn: "t3", step: { id: "read", label: "Read ledger", detail: "12,408 rows", state: "done" } },
      { op: "add-block", turn: "t3", block: { preset: "narrative", text: "Margin fell **1.8 pts**." } },
      { op: "update-turn", turn: "t3", fields: { envelope: { scope: ["Q3 2026"] } } },
      { op: "set-state", turn: "t3", state: "complete" },
    ])
    const t3 = next.turns[2] as AnswerTurn
    expect(t3.state).toBe("complete")
    expect(t3.trace).toEqual([{ id: "read", label: "Read ledger", detail: "12,408 rows", state: "done" }])
    expect(t3.blocks).toHaveLength(1)
    expect(t3.envelope).toEqual({ scope: ["Q3 2026"] })
  })

  it("refuses a patch it cannot place", () => {
    expect(() => applyPatch(base, { op: "set-state", turn: "nope", state: "answered" })).toThrow(PatchError)
    expect(() => applyPatch(base, { op: "add-block", turn: "t2", block: { preset: "narrative", text: "x" } })).toThrow(PatchError)
    expect(() => applyPatch(base, { op: "add-turn", turn: base.turns[0] })).toThrow(PatchError)
  })
})
