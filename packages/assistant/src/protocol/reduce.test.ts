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
      ask: { kind: "single", question: "Which margin?", options: [{ value: "op", label: "Operating" }] },
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
      { op: "add-block", turn: "t3", block: { kind: "narrative", text: "Margin fell **1.8 pts**." } },
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
    expect(() => applyPatch(base, { op: "add-block", turn: "t2", block: { kind: "narrative", text: "x" } })).toThrow(PatchError)
    expect(() => applyPatch(base, { op: "add-turn", turn: base.turns[0] })).toThrow(PatchError)
  })

  it("streams words into any block's text field, and a step's reasoning", () => {
    const answer: AnswerTurn = {
      id: "t3",
      role: "assistant",
      kind: "answer",
      state: "running",
      trace: [{ id: "plan", label: "Plan", state: "running" }],
      blocks: [],
    }
    const next = applyPatches(base, [
      { op: "add-turn", turn: answer },
      { op: "append-thinking", turn: "t3", step: "plan", text: "Margin is " },
      { op: "append-thinking", turn: "t3", step: "plan", text: "revenue less cost." },
      { op: "update-trace-step", turn: "t3", step: "plan", fields: { state: "done", duration: 912 } },
      { op: "add-block", turn: "t3", block: { kind: "narrative", text: "" } },
      { op: "append-text", turn: "t3", text: "Margin fell " },
      { op: "append-text", turn: "t3", text: "**1.8 pts**." },
      { op: "add-block", turn: "t3", block: { kind: "caveat", label: "data", text: "" } },
      { op: "append-text", turn: "t3", block: 1, field: "label", text: " gap" },
      { op: "update-block", turn: "t3", block: 1, fields: { text: "Two stores late." } },
      { op: "update-spec", fields: { title: "Margin" } },
    ])
    const t3 = next.turns[2] as AnswerTurn
    expect(t3.trace?.[0]).toMatchObject({ state: "done", duration: 912, thinking: "Margin is revenue less cost." })
    expect(t3.blocks[0]).toEqual({ kind: "narrative", text: "Margin fell **1.8 pts**." })
    expect(t3.blocks[1]).toEqual({ kind: "caveat", label: "data gap", text: "Two stores late." })
    expect(next.title).toBe("Margin")
    expect(next.turns).toHaveLength(3)
  })

  it("refuses to stream into what is not there, or not text", () => {
    const answer: AnswerTurn = { id: "t3", role: "assistant", kind: "answer", state: "running", blocks: [] }
    const withAnswer = applyPatch(base, { op: "add-turn", turn: answer })
    expect(() => applyPatch(withAnswer, { op: "append-text", turn: "t3", text: "x" })).toThrow(PatchError)
    expect(() => applyPatch(withAnswer, { op: "append-thinking", turn: "t3", step: "nope", text: "x" })).toThrow(PatchError)
    const withTable = applyPatch(withAnswer, {
      op: "add-block",
      turn: "t3",
      block: { kind: "table", columns: [], rows: [] },
    })
    expect(() => applyPatch(withTable, { op: "append-text", turn: "t3", field: "rows", text: "x" })).toThrow(PatchError)
  })
})
