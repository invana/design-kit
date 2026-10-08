# @invana/editor

Code and markdown editing surfaces built on CodeMirror 6.

This is the one kind of thing that gets its own package: a component needing a heavy external JS
library. Everything buildable from React, Radix and the existing deps lives in `@invana/ui`
instead, so consumers that only want a button never pay for an editor.

```bash
pnpm add @invana/editor
```

Peer dependencies: `@invana/ui`, `@invana/styling`, `react`, `react-dom`. CodeMirror 6
(`@codemirror/state`, `@codemirror/view`, `@codemirror/commands`, `@codemirror/language`,
`@codemirror/legacy-modes`) ships as a direct dependency.

## Usage

```tsx
import { CodeBlock, MarkdownEditorBlock } from '@invana/editor';

<CodeBlock value={source} language="python" />;

<MarkdownEditorBlock value={notes} onChange={setNotes} />;
```

## Exports

- `CodeBlock` — read-oriented code display
- `MarkdownEditorBlock` — markdown editing surface
- `useCodeMirror` — the hook both are built on, for composing your own surface

## License

MIT © Ravi Raja Merugu
