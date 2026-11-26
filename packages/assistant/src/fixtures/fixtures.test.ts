import { describe, expect, it } from "vitest"

import { applyPatches } from "../protocol/reduce"
import type { AnswerTurn } from "../protocol/types"
import { validate } from "../protocol/validate"
import { CONVERSATIONS, DUB_DELAYS_RUN, SESSIONS } from "./index"

/**
 * Where a session's answer does not match its pattern. Each line is real drift
 * between the grammar's sessions and its patterns, found by `validate()`; it is
 * listed so that new drift fails this test, and it is resolved in the grammar
 * (fix the session or the pattern), then removed here.
 */
const KNOWN_DRIFT: Record<string, string[]> = {
  plantBreeder: [
    "t5: Pattern \"drivers\" expects \"narrative\", which this answer does not have.",
    "t8: Pattern \"shortlist\" expects \"attr\", which this answer does not have.",
    "t8: Pattern \"shortlist\" expects \"proposal\", which this answer does not have.",
    "t8: Block \"table\" is not part of pattern \"shortlist\".",
    "t10: Pattern \"scenariot\" expects \"record\", which this answer does not have.",
    "t10: Pattern \"scenariot\" expects \"ranked\", which this answer does not have.",
  ],
  equityTrader: [
    "t3: Pattern \"bridge\" expects \"ranked\", which this answer does not have.",
    "t9: Pattern \"scenariot\" expects \"record\", which this answer does not have.",
    "t9: Pattern \"scenariot\" expects \"ranked\", which this answer does not have.",
    "t9: Block \"grid\" is not part of pattern \"scenariot\".",
  ],
  healthResearcher: [
    "t4: Pattern \"comparison\" expects \"table\", which this answer does not have.",
    "t4: Pattern \"comparison\" expects \"caveat\", which this answer does not have.",
    "t4: Block \"grid\" is not part of pattern \"comparison\".",
    "t8: Pattern \"readout\" expects \"record\", which this answer does not have.",
    "t8: Pattern \"readout\" expects \"proposal\", which this answer does not have.",
    "t10: Block \"ranked\" is not part of pattern \"memo\".",
  ],
  supplyChainPlanner: [
    "t3: Pattern \"anomaly\" expects \"ranked\", which this answer does not have.",
    "t3: Block \"grid\" is not part of pattern \"anomaly\".",
    "t6: Pattern \"recommend\" expects \"ranked\", which this answer does not have.",
    "t9: Pattern \"delivery\" expects \"proposal\", which this answer does not have.",
    "t9: Pattern \"delivery\" expects \"record\", which this answer does not have.",
  ],
  productDataScientist: [
    "t11: Pattern \"significance\" expects \"evidence\", which this answer does not have.",
  ],
}

describe.each(Object.entries(SESSIONS))("session %s", (name, spec) => {
  const issues = validate(spec)

  it("keeps the contract", () => {
    expect(issues.filter((i) => i.level === "error")).toEqual([])
  })

  it("matches its patterns, apart from known drift", () => {
    const warnings = issues.filter((i) => i.level === "warning").map((i) => `${i.turn}: ${i.message}`)
    expect(warnings).toEqual(KNOWN_DRIFT[name] ?? [])
  })
})

describe.each(Object.entries(CONVERSATIONS))("conversation %s", (_, spec) => {
  it("keeps the contract, with no drift", () => {
    expect(validate(spec)).toEqual([])
  })
})

describe("the D14 run", () => {
  it("waits on the approval, then writes the answer whole and settles it", () => {
    const patchesOf = (script: typeof DUB_DELAYS_RUN.before) =>
      script.flatMap((s) => (Array.isArray(s.patch) ? s.patch : [s.patch]))
    const held = applyPatches(CONVERSATIONS.dubDelays, patchesOf(DUB_DELAYS_RUN.before))
    const waiting = held.turns.find((t) => t.id === "a1") as AnswerTurn
    expect(waiting.trace?.find((s) => s.state === "waiting")?.wait?.title).toMatch(/^It needs you/)
    const done = applyPatches(held, patchesOf(DUB_DELAYS_RUN.after))
    const answer = done.turns.find((t) => t.id === "a1") as AnswerTurn
    expect(validate(done)).toEqual([])
    expect(answer.state).toBe("complete")
    expect(answer.report?.connections).toHaveLength(4)
    const words = answer.blocks.map((b) => (b as { text: string }).text)
    expect(words).toHaveLength(2)
    expect(words[0]).toMatch(/^Ryanair and Aer Lingus .* late\.$/)
    expect(words[1]).toMatch(/^Three Aer Lingus .* No Ryanair aircraft has one\.$/)
  })
})
