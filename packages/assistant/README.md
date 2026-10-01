# @invana/assistant

The analyst assistant, driven by JSON. `<ChatSession spec variant />` renders a whole conversation
— the analyst's questions, what the assistant asks back, its answers, and the run behind each —
from a `ConversationSpec`, the way `@invana/dashboard` renders a `DashboardSpec`. Two variants draw
the same spec: `cli`, the console (caret prompts, status-dotted replies, step rows, a Tasks view),
and `web`, the chat (labelled turns, answer cards, `Answered in 1.4 s`). The composer is the same in
both, configured by the spec's `composer`.

The contract is the [Design Kit Spec](https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5): 29 ask
intents on 21 ask presets, 14 answer intents on 41 block presets, and 26 answer patterns. Its ids
are copied into `src/grammar/`, and a test fails when the preset registry and the grammar disagree.

```bash
pnpm add @invana/assistant
pnpm add @invana/ui @invana/charts @invana/tables @invana/forms @invana/styling react react-dom
```

## Usage

```tsx
import { ChatSession, fromNdjson, useChatSession } from '@invana/assistant';

const chat = useChatSession(initial);

<ChatSession
  variant="web"
  spec={chat.spec}
  // One typed callback per event, then `onEvent` for all of them.
  onPrompt={async (e) => chat.stream(fromNdjson(await fetch('/ask', { method: 'POST', body: JSON.stringify(e) })))}
  onAction={(e) => e.action === 'load-canvas' && canvas.load(e.turn)}
  onOpenRun={(e) => openRunView(e.turn)}
  onStop={chat.stop}
  onEvent={(e) => api.send(e)}
  icons={{ send: <ArrowUp />, stop: <Square /> }}
/>;
```

The API sends patches — `add-turn`, `set-state`, `add-block`, `update-block`, `add-trace-step`,
`update-trace-step`, `update-turn`, `update-spec`, and for the streaming effect `append-text` (words
into any block's text field) and `append-thinking` (a step's reasoning). Hand them over any way:

- `applyPatch(spec, patch)` and pass the spec — fully controlled;
- `useChatSession()` — `apply`, `stream(source)`, `play(script)`, `stop()`, `reset(spec)`;
- `<ChatSession stream={source}>` — the session applies them itself.

A source is any iterable or async iterable of patches: `fromNdjson(response)`, `fromEventSource(es)`,
a generator, or `playScript(script)` for a recorded run (`textDeltas` and `thinkingDeltas` build the
word-by-word steps). `stopPatches(spec)` is what stopping records: the running step stopped, the
rest left queued.

A trace step carries its record — `startedAt` and `duration`, `attempt` of `attempts`, streamed
`thinking`, and `io` (what went in, what came out) — and the answer its `startedAt`, `at`,
`duration`, `meta` line and `outcome` (what the run produced, with its actions).

Every action comes back as one `ConversationEvent` — `prompt` (with the composer's `settings` and
`files`), `reply`, `skip`, `change`, `action`, `scope`, `open`, `template`, `refine`, `rate`,
`stop`, `retry`, `open-run`, `setting`, `copy`, `toggle-steps`. The component changes nothing itself.

Beside each settled answer's time sit its actions, chosen by the `actions` prop — the built-ins by
name (`retry`, `copy`, `steps`, `rate`) and your own as `{ id, label, icon }`, sent as `action`:

```tsx
<ChatSession
  spec={spec}
  actions={['retry', 'copy', { id: 'pin', label: 'Pin to report', icon: <Pin /> }, 'rate']}
  onAction={(e) => e.action === 'pin' && reports.pin(e.turn)}
  onCopy={(e) => toast('Copied')}
/>
```

`validate(spec)` checks a payload the compiler cannot see: unknown presets and broken turns are
errors, and an answer that does not match its pattern is a warning.

A preset with no renderer yet renders as a labelled placeholder with its JSON. Register your own
renderer, or replace a built-in one, with the traits that say how it sits:

```tsx
<ChatSession
  spec={spec}
  registry={{
    blocks: { subgraph: MyGraphBlock },
    blockTraits: { subgraph: { placement: 'own' } }, // a card of its own, under the answer
    asks: { picker: MyPickerAsk },
    askTraits: { picker: { frame: 'none' } },          // drawn bare, not in the question card
  }}
/>
```

`ChatSessionFrame` is the layout alone (a scrolling stack with a footer), and `ChatSessionTurn`
draws one turn outside a thread — for a preset's board.

## Moving from `@invana/ui`

`ChatSession*`, `ClarifyCard`, `EmissionCard` (with `EmissionHeader` and `CitationMarker`) and
`TemplatePicker` now import from here. They are still exported from `@invana/ui`, marked
`@deprecated`, for this release only; their names and props do not change.

## Tests

```bash
pnpm --filter @invana/assistant test
```
