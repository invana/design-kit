---
"@invana/assistant": minor
"@invana/blocks": minor
---

`ChatSession` is one component, drawn as the RV-D14 design: the `cli` variant is gone, and with it `variant`, `view`, `defaultView`, `onViewChange`, the handle's `setView`, and the `ChatSessionVariant` and `ChatSessionView` types.

- The header is 40px with the session's icon (`icons.session`), its title and, on a wide panel, `World · …` from `access`.
- The question sits on the right as a card; there are no speaker labels or day lines (`analyst` and `assistant` leave the spec, `TurnLabel`, `clockTime` and `dayLabel` leave the package).
- Each answer's steps are short rows in one `Steps` card: a dot, the tool in mono, what it did and came to, its time; a click opens its record, a section per label, with the settled thinking as `thought`. A `waiting` step with `wait` (new on `TraceStep`) asks at the card's foot: **Approve once** sends `action: approve` with the step's id, **Stop the run** sends `stop`, and the wait counts up.
- The answer is plain text and blocks, no card; under it a run line in two lines, and its actions as square toggles. `steps` opens every step's record.
- The run report has a strip with `Export JSON` (`action: export-report`), figures with captions, a per-connection table, what went wrong or needed you, what was and was not sent, and the connections not touched. `RunReport` gains `id`, `final`, `files`, `llmCalls`, `duration`, `waited`, `captions`, `issues`, `notSent`, `untouched`; a connection gains `reads`, `writes`, `files`, `returned`, `tokens`; `sent` counts are optional.
- The composer draws its controls as quiet buttons opening an upward list headed by the control's label, a budget bar from `budget`, and a Send button; `composer.hints` and the status bar are gone.
- `ConversationList` takes the same 40px header and surface.
- The fixtures are the D14 conversation (`dubDelays`, with `DUB_DELAYS_RUN.before` and `.after`) and `ontologyAssistant`; the others are gone, as are the unused thread re-exports.
