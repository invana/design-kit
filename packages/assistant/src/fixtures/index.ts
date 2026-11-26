import type { PatchScript } from "../protocol/stream"
import type { ConversationSpec } from "../protocol/types"
import dubDelays from "./conversations/dub-delays.json"
import dubDelaysAfter from "./conversations/dub-delays.after.script.json"
import dubDelaysBefore from "./conversations/dub-delays.before.script.json"
import ontologyAssistant from "./conversations/ontology-assistant.json"
import breeder from "../data/conversations/breeder.json"
import dataScientist from "../data/conversations/data-scientist.json"
import financeAnalyst from "../data/conversations/finance-analyst.json"
import journalist from "../data/conversations/journalist.json"
import network from "../data/conversations/network.json"
import planner from "../data/conversations/planner.json"
import researcher from "../data/conversations/researcher.json"
import trader from "../data/conversations/trader.json"
import type { UserData } from "./scripts/runs"

/*
 * The users of the assistant, each a conversation as the API would send it:
 * the thread they open on (the research sessions of Analyst Flow Grammar, and
 * the airports graph) and the runs recorded for them. They are the acceptance
 * tests and the story data: a slice is done when its sessions render with no
 * placeholders.
 *
 * JSON widens every string, so these cannot be checked by the compiler; the
 * cast is honest only because `fixtures.test.ts` runs `validate()` on each
 * session and on every run played onto it.
 */
export const USERS = {
  network: network as unknown as UserData,
  trader: trader as unknown as UserData,
  breeder: breeder as unknown as UserData,
  researcher: researcher as unknown as UserData,
  planner: planner as unknown as UserData,
  dataScientist: dataScientist as unknown as UserData,
  financeAnalyst: financeAnalyst as unknown as UserData,
  journalist: journalist as unknown as UserData,
}

export type UserId = keyof typeof USERS

/** Each user's opening thread alone, as `fixtures.test.ts` validates it against its known drift. */
export const SESSIONS = {
  plantBreeder: USERS.breeder.session,
  equityTrader: USERS.trader.session,
  healthResearcher: USERS.researcher.session,
  supplyChainPlanner: USERS.planner.session,
  productDataScientist: USERS.dataScientist.session,
  financeAnalyst: USERS.financeAnalyst.session,
  journalist: USERS.journalist.session,
}

export type SessionId = keyof typeof SESSIONS

/*
 * The conversation stories' data: each a whole thread as the API would send
 * it, drawn by <ChatSession>. `dubDelays` is sent with its answer just begun;
 * its run arrives as two recorded scripts, `DUB_DELAYS_RUN.before` up to the
 * step that waits on the analyst's approval and `DUB_DELAYS_RUN.after` once
 * it is given. A wait's `since` of `$NOW` is stamped when it plays. Validated
 * like the sessions, by `fixtures.test.ts`.
 */
export const CONVERSATIONS = {
  dubDelays: dubDelays as unknown as ConversationSpec,
  ontologyAssistant: ontologyAssistant as unknown as ConversationSpec,
}

export type ConversationId = keyof typeof CONVERSATIONS

export const DUB_DELAYS_RUN = {
  before: dubDelaysBefore as unknown as PatchScript,
  after: dubDelaysAfter as unknown as PatchScript,
}

/*
 * Recorded runs, as the API would stream them, built from a user's data, and
 * the API's side of the conversation. Stories play them into a <ChatSession>.
 */
export * from "./scripts/runs"
