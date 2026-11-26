---
"@invana/assistant": minor
---

History is one step back, not a menu: the session's header draws History, New and close when the host handles `onHistory`, `onNewConversation` and `onClose`; the new `ConversationList` is the list History goes back to, where a row (`open-conversation`) or New (`new-conversation`) goes in again. A settled answer gains a `report` action beside Steps, sent as `open-run`. `ChatSessionIcons` gains `history`, `newChat` and `report`.
