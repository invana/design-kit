# @invana/assistant

The analyst assistant, driven by JSON. `<Conversation spec onEvent />` renders a whole conversation
— the analyst's questions, what the assistant asks back, and its answers — from a
`ConversationSpec`, the way `@invana/dashboard` renders a `DashboardSpec`.

The contract is [Analyst Flow Grammar](https://claude.ai/artifact/JQyqjKUTyrADw5vFvsFVzo): 20 ask
presets, 42 block presets and 26 answer patterns. Its ids are copied into `src/grammar/`, and a
test fails when the preset registry and the grammar disagree.

```bash
pnpm add @invana/assistant
pnpm add @invana/ui @invana/charts @invana/tables @invana/forms @invana/styling react react-dom
```

## Usage

```tsx
import { Conversation, applyPatch, type ConversationSpec } from '@invana/assistant';

const [spec, setSpec] = useState<ConversationSpec>(initial);

// The API streams patches: add a turn, set its state, add a block, add a trace step.
socket.on('patch', (patch) => setSpec((s) => applyPatch(s, patch)));

<Conversation spec={spec} onEvent={(event) => api.send(event)} />;
```

Every action comes back as one `ConversationEvent` — `prompt`, `reply`, `skip`, `change`, `action`,
`scope`, `template`, `refine`, `rate`, `stop`, `retry`. The component changes nothing
itself.

`validate(spec)` checks a payload the compiler cannot see: unknown presets and broken turns are
errors, and an answer that does not match its pattern is a warning.

A preset with no renderer yet renders as a labelled placeholder with its JSON. Register your own
renderer, or replace a built-in one, through `registry`:

```tsx
<Conversation spec={spec} registry={{ blocks: { subgraph: MyGraphBlock } }} />
```

## Moving from `@invana/ui`

`ChatSession*`, `ClarifyCard`, `EmissionCard` (with `EmissionHeader` and `CitationMarker`) and
`TemplatePicker` now import from here. They are still exported from `@invana/ui`, marked
`@deprecated`, for this release only; their names and props do not change.

## Tests

```bash
pnpm --filter @invana/assistant test
```
