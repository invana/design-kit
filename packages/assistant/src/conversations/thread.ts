import {
  ChatSession as UiChatSession,
  ChatSessionActivityRow as UiChatSessionActivityRow,
  ChatSessionActivitySubLine as UiChatSessionActivitySubLine,
  ChatSessionComposer as UiChatSessionComposer,
  ChatSessionContextChip as UiChatSessionContextChip,
  ChatSessionCaret as UiChatSessionCaret,
  ChatSessionDisclosure as UiChatSessionDisclosure,
  ChatSessionDisclosureCode as UiChatSessionDisclosureCode,
  ChatSessionDisclosureSteps as UiChatSessionDisclosureSteps,
  ChatSessionMessage as UiChatSessionMessage,
  ChatSessionMessageOptions as UiChatSessionMessageOptions,
  ChatSessionProgressLine as UiChatSessionProgressLine,
  ChatSessionPromptRow as UiChatSessionPromptRow,
  ChatSessionStatusBar as UiChatSessionStatusBar,
  ChatSessionTaskGroup as UiChatSessionTaskGroup,
  ChatSessionTaskRow as UiChatSessionTaskRow,
  chatSessionGutterClass as uiChatSessionGutterClass,
} from "@invana/ui"

/*
 * The thread parts, moving from `@invana/ui` to here (Assistant Package RFC,
 * migration step 2). For one release the source stays in ui, marked
 * `@deprecated` there, and these are re-declared rather than re-exported so the
 * deprecation does not follow the import. The next release moves the source
 * into this folder; the names and props do not change.
 */

/** Scrolling stack of turns that sticks to the latest, with a fixed composer footer. */
export const ChatSession = UiChatSession
/** The assistant's turn, with running, stopped, error and idle states. */
export const ChatSessionMessage = UiChatSessionMessage
/** Actions under a message: copy, retry, rate. */
export const ChatSessionMessageOptions = UiChatSessionMessageOptions
/** Prompt input with start and end slots, and send or stop. */
export const ChatSessionComposer = UiChatSessionComposer
/** A console row with the shared gutter glyph. */
export const ChatSessionActivityRow = UiChatSessionActivityRow
/** The indented line under an activity row. */
export const ChatSessionActivitySubLine = UiChatSessionActivitySubLine
/** The gutter every console row shares, so bodies line up. */
export const chatSessionGutterClass = uiChatSessionGutterClass
/** The analyst's turn, on the shared gutter. */
export const ChatSessionPromptRow = UiChatSessionPromptRow
/** One-line status while work is in flight. */
export const ChatSessionProgressLine = UiChatSessionProgressLine
/** The cursor at the end of text still being written. */
export const ChatSessionCaret = UiChatSessionCaret
/** Collapsible detail under a row: query, preview, context. */
export const ChatSessionDisclosure = UiChatSessionDisclosure
/** The code a disclosure opens onto, keywords marked, when it opens onto more than code. */
export const ChatSessionDisclosureCode = UiChatSessionDisclosureCode
/** A method of several steps, numbered, each with its count or time. */
export const ChatSessionDisclosureSteps = UiChatSessionDisclosureSteps
/** A background task with its lifecycle. */
export const ChatSessionTaskRow = UiChatSessionTaskRow
/** A group of background tasks under one heading. */
export const ChatSessionTaskGroup = UiChatSessionTaskGroup
/** Slim bar under the composer: mode, counts, hints. */
export const ChatSessionStatusBar = UiChatSessionStatusBar
/** What the next question is about, bound from a selection. */
export const ChatSessionContextChip = UiChatSessionContextChip

export type {
  ChatSessionProps,
  ChatSessionMessageProps,
  ChatSessionMessageRole,
  ChatSessionMessageStatus,
  ChatSessionMessageAction,
  ChatSessionMessageOptionsProps,
  ChatSessionComposerProps,
  ChatSessionActivityRowProps,
  ChatSessionActivityStatus,
  ChatSessionActivitySubLineProps,
  ChatSessionPromptRowProps,
  ChatSessionProgressLineProps,
  ChatSessionDisclosureProps,
  ChatSessionDisclosureStepsProps,
  ChatSessionTaskRowProps,
  ChatSessionTaskGroupProps,
  ChatSessionTaskStatus,
  ChatSessionStatusBarProps,
  ChatSessionContextChipProps,
} from "@invana/ui"
