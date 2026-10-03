import type { PatchScript } from "../protocol/stream"
import type { ConversationSpec } from "../protocol/types"
import agentConsole from "./conversations/agent-console.json"
import graphExpansions from "./conversations/graph-expansions.json"
import methodDisclosure from "./conversations/method-disclosure.json"
import streaming from "./conversations/streaming.json"
import streamingScript from "./conversations/streaming.script.json"
import taskBoard from "./conversations/task-board.json"
import turnLabels from "./conversations/turn-labels.json"
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
 * it, drawn by <ChatSession>. `streaming` is sent part-written; its words
 * arrive as `STREAMING_SCRIPT`, a recorded run of `append-text` patches.
 * Validated like the sessions, by `fixtures.test.ts`.
 */
export const CONVERSATIONS = {
  graphExpansions: graphExpansions as unknown as ConversationSpec,
  agentConsole: agentConsole as unknown as ConversationSpec,
  taskBoard: taskBoard as unknown as ConversationSpec,
  streaming: streaming as unknown as ConversationSpec,
  methodDisclosure: methodDisclosure as unknown as ConversationSpec,
  turnLabels: turnLabels as unknown as ConversationSpec,
}

export type ConversationId = keyof typeof CONVERSATIONS

export const STREAMING_SCRIPT = streamingScript as unknown as PatchScript

/*
 * Recorded runs, as the API would stream them, built from a user's data, and
 * the API's side of the conversation. Stories play them into a <ChatSession>.
 */
export * from "./scripts/runs"
