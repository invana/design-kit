import { ChatSession as UiChatSession, ChatSessionCaret as UiChatSessionCaret } from "@invana/ui"

/**
 * The frame a session is drawn in: a scrolling stack that sticks to the
 * latest, with a fixed footer. `ChatSession` is the conversation itself, drawn
 * from JSON; this is only its layout.
 */
export const ChatSessionFrame = UiChatSession
/** The cursor at the end of text still being written. */
export const ChatSessionCaret = UiChatSessionCaret

export type { ChatSessionProps as ChatSessionFrameProps } from "@invana/ui"
