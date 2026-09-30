import { describe, expect, it } from "vitest"

import { BUILT_IN_ASKS, BUILT_IN_BLOCKS } from "../../conversations/registry"
import { isRunning } from "../../protocol/stream"
import type { AnswerTurn, ConversationSpec } from "../../protocol/types"
import { validate } from "../../protocol/validate"
import { USERS } from "../index"
import { clarifyRun, confirmRun, failRun, longRun, openingSpec, respond, sendRun, settle, type UserData } from "./runs"

const NOW = Date.parse("2026-09-30T09:00:00.000Z")
const issues = (spec: ConversationSpec) => validate(spec).map((i) => `${i.level} ${i.turn ?? ""}: ${i.message}`)
const answer = (spec: ConversationSpec, id: string) => spec.turns.find((t) => t.id === id) as AnswerTurn

/** What a run adds to the thread's issues: a run must bring no error and no drift of its own. */
const added = (before: ConversationSpec, after: ConversationSpec) => {
  const known = new Set(issues(before))
  return issues(after).filter((i) => !known.has(i))
}

describe.each(Object.entries(USERS))("user %s", (_, user: UserData) => {
  const opening = openingSpec(user, NOW)

  it("opens settled, with a composer", () => {
    expect(isRunning(opening)).toBe(false)
    expect(opening.composer).toBeDefined()
    expect(opening.turns.length).toBeGreaterThan(0)
  })

  it("plays every run onto the opening thread cleanly", () => {
    for (const script of [
      sendRun(user, "r1", NOW),
      clarifyRun(user, "r1", NOW),
      confirmRun(user, "r1", NOW),
      failRun(user, "r1", NOW),
      longRun(user, "r1", NOW),
    ]) {
      expect(added(opening, settle(opening, script))).toEqual([])
    }
  })

  it("the streamed answer text joins back whole", () => {
    const a = answer(settle(opening, sendRun(user, "r1", NOW)), "r1-a")
    expect(a.state).toBe("complete")
    expect(a.blocks[0]).toEqual({ preset: "narrative", text: user.runs.send.answer.text })
    expect(a.trace?.every((s) => s.state === "done")).toBe(true)
  })

  it("a clarification waits, then the reply resumes the same run", () => {
    const waiting = settle(opening, clarifyRun(user, "r1", NOW))
    expect(answer(waiting, "r1-a").trace?.[0].state).toBe("waiting")
    const resumed = settle(waiting, respond(user, { type: "reply", turn: "r1-q", value: "x" }, waiting, NOW + 5000) ?? [])
    expect(added(opening, resumed)).toEqual([])
    expect(answer(resumed, "r1-a").state).toBe("complete")
    expect(resumed.turns.find((t) => t.id === "r1-q")).toMatchObject({ state: "answered", value: "x" })
  })

  it("a costly question runs in full on yes, and narrows on no", () => {
    const waiting = settle(opening, confirmRun(user, "r1", NOW))
    const yes = settle(waiting, respond(user, { type: "reply", turn: "r1-q", value: true }, waiting, NOW + 5000) ?? [])
    const no = settle(waiting, respond(user, { type: "reply", turn: "r1-q", value: false }, waiting, NOW + 5000) ?? [])
    expect(added(opening, yes)).toEqual([])
    expect(added(opening, no)).toEqual([])
    expect(answer(yes, "r1-a").state).toBe("complete")
    expect(answer(no, "r1-a").state).toBe("partial")
  })

  it("a failure ends in error with what to do next", () => {
    const failed = answer(settle(opening, failRun(user, "r1", NOW)), "r1-a")
    expect(failed.state).toBe("error")
    expect(failed.trace?.map((s) => s.state)).toEqual(["done", "done", "failed", "pending"])
    expect(failed.outcome?.actions?.map((a) => a.id)).toContain("retry")
  })
})

/** Every preset with a renderer, drawn somewhere in the users' threads and runs. */
describe("the users together", () => {
  it("show every built ask and block", () => {
    const presets = new Set<string>()
    const collect = (spec: ConversationSpec) => {
      for (const t of spec.turns) {
        if (t.role !== "assistant") continue
        if (t.kind === "ask") {
          presets.add(`ask:${t.ask.preset}`)
          if (t.ask.preset === "multistep") t.ask.steps.forEach((s) => presets.add(`ask:${s.preset}`))
        } else {
        t.blocks.forEach((b) => presets.add(`block:${b.preset}`))
        // Carried on the answer, never sent as blocks: drawn from the envelope and the trace.
        if (t.envelope?.scope?.length) presets.add("block:scope")
        if (t.envelope?.method) presets.add("block:method")
        if (t.envelope?.caveats?.length) presets.add("block:caveat")
        if (t.trace?.length) presets.add("block:trace")
      }
      }
    }
    for (const user of Object.values(USERS)) {
      const opening = openingSpec(user, NOW)
      collect(opening)
      for (const [run, value] of [
        [clarifyRun, "x"],
        [confirmRun, true],
        [confirmRun, false],
      ] as const) {
        const waiting = settle(opening, run(user, "r1", NOW))
        collect(waiting)
        collect(settle(waiting, respond(user, { type: "reply", turn: "r1-q", value }, waiting, NOW) ?? []))
      }
    }
    const built = [
      ...Object.entries(BUILT_IN_ASKS).filter(([, r]) => r).map(([id]) => `ask:${id}`),
      ...Object.entries(BUILT_IN_BLOCKS).filter(([, r]) => r).map(([id]) => `block:${id}`),
    ]
    expect(built.filter((id) => !presets.has(id))).toEqual([])
  })
})
