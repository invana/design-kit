import { describe, expect, it } from "vitest"

import { isRunning } from "../../protocol/stream"
import type { AnswerTurn, ConversationSpec } from "../../protocol/types"
import { validate } from "../../protocol/validate"
import {
  airportsSpec,
  askScenario,
  clarifyScenario,
  confirmScenario,
  failScenario,
  longScenario,
  respond,
  settle,
} from "./airports"

const NOW = Date.parse("2026-09-30T09:00:00.000Z")
const errors = (spec: ConversationSpec) => validate(spec).filter((i) => i.level === "error")
const answer = (spec: ConversationSpec, id: string) => spec.turns.find((t) => t.id === id) as AnswerTurn

describe("airports scripts", () => {
  const opening = airportsSpec(NOW)

  it("opens mid-session, settled and valid", () => {
    expect(errors(opening)).toEqual([])
    expect(answer(opening, "t0-a")).toMatchObject({ state: "complete", duration: expect.any(Number) })
    expect(answer(opening, "t0-a").trace?.every((s) => s.state === "done")).toBe(true)
    expect(isRunning(opening)).toBe(false)
  })

  it("every scenario plays onto the opening spec without an error", () => {
    for (const script of [
      askScenario("t1", NOW),
      clarifyScenario("t1", NOW),
      failScenario("t1", NOW),
      longScenario("t1", NOW),
      confirmScenario("t1", NOW),
    ]) {
      expect(errors(settle(opening, script))).toEqual([])
    }
  })

  it("the streamed answer text joins back whole", () => {
    const a = answer(settle(opening, askScenario("t1", NOW)), "t1-a")
    expect(a.blocks[0]).toMatchObject({ preset: "narrative" })
    expect((a.blocks[0] as { text: string }).text).toMatch(/^Found \*\*14 airlines\*\*\..*canvas\.$/)
  })

  it("a clarification waits, then the reply resumes the same run", () => {
    const waiting = settle(opening, clarifyScenario("t1", NOW))
    expect(answer(waiting, "t1-a").trace?.[0].state).toBe("waiting")
    const script = respond({ type: "reply", turn: "t1-q", value: "FRA" }, waiting, NOW + 5000)
    const resumed = settle(waiting, script ?? [])
    expect(errors(resumed)).toEqual([])
    expect(answer(resumed, "t1-a").state).toBe("complete")
    expect(resumed.turns.find((t) => t.id === "t1-q")).toMatchObject({ state: "answered", value: "FRA" })
  })

  it("a failure ends in error with what to do next", () => {
    const failed = answer(settle(opening, failScenario("t1", NOW)), "t1-a")
    expect(failed.state).toBe("error")
    expect(failed.trace?.map((s) => s.state)).toEqual(["done", "done", "failed", "pending"])
    expect(failed.outcome?.actions?.map((a) => a.id)).toContain("retry")
  })
})
