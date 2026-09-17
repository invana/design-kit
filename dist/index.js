import * as React from 'react';
import { EditorView, lineNumbers, keymap } from '@codemirror/view';
import { Compartment, EditorState } from '@codemirror/state';
import { syntaxHighlighting, defaultHighlightStyle, StreamLanguage } from '@codemirror/language';
import { python } from '@codemirror/legacy-modes/mode/python';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { json, javascript } from '@codemirror/legacy-modes/mode/javascript';
import { cypher } from '@codemirror/legacy-modes/mode/cypher';
import { cn } from '@invana/ui';
import { jsx, jsxs } from 'react/jsx-runtime';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';

// src/code-block.tsx
function useCodeMirror({
  value,
  extensions,
  onChange
}) {
  const host = React.useRef(null);
  const view = React.useRef(null);
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const extensionsRef = React.useRef(extensions);
  extensionsRef.current = extensions;
  const compartment = React.useRef(new Compartment());
  React.useEffect(() => {
    if (!host.current) return;
    const v = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          compartment.current.of(extensionsRef.current),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current?.(u.state.doc.toString());
          })
        ]
      }),
      parent: host.current
    });
    view.current = v;
    return () => {
      v.destroy();
      view.current = null;
    };
  }, []);
  React.useEffect(() => {
    const v = view.current;
    if (!v) return;
    v.dispatch({ effects: compartment.current.reconfigure(extensions) });
  }, [extensions]);
  React.useEffect(() => {
    const v = view.current;
    if (!v) return;
    const current = v.state.doc.toString();
    if (current === value) return;
    v.dispatch({ changes: { from: 0, to: current.length, insert: value } });
  }, [value]);
  return { ref: host, view };
}
var MODES = {
  python: () => StreamLanguage.define(python),
  shell: () => StreamLanguage.define(shell),
  javascript: () => StreamLanguage.define(javascript),
  json: () => StreamLanguage.define(json),
  cypher: () => StreamLanguage.define(cypher),
  plain: () => null
};
function CodeBlock({
  value,
  language = "plain",
  showLineNumbers,
  maxHeight,
  className,
  style,
  ...props
}) {
  const extensions = React.useMemo(() => {
    const mode = MODES[language]();
    return [
      // StreamLanguage only produces tokens; without a highlight style nothing
      // paints them and the block renders as flat text.
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.editable.of(false),
      EditorState.readOnly.of(true),
      EditorView.lineWrapping,
      ...showLineNumbers ? [lineNumbers()] : [],
      ...mode ? [mode] : [],
      // The scroller lives inside CodeMirror rather than on the wrapper, so the
      // editor knows its own viewport and does not render every line of a long
      // document into a box that then clips them.
      ...maxHeight != null ? [EditorView.theme({ "&": { maxHeight: `${maxHeight}px` } })] : []
    ];
  }, [language, showLineNumbers, maxHeight]);
  const { ref } = useCodeMirror({ value, extensions });
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "overflow-hidden border border-border bg-muted/40 [&_.cm-editor]:bg-transparent",
        "[&_.cm-content]:font-mono [&_.cm-content]:text-meta [&_.cm-focused]:outline-none",
        "[&_.cm-gutters]:border-none [&_.cm-gutters]:bg-transparent [&_.cm-gutters]:text-muted-foreground",
        className
      ),
      style,
      ...props
    }
  );
}
function MarkdownEditorBlock({
  value,
  onChange,
  readOnly,
  version,
  className,
  ...props
}) {
  const extensions = React.useMemo(
    () => [
      // No markdown syntax mode, deliberately. What is typed here is offered
      // verbatim in a model's prompt, and highlighting it would be decoration
      // on text whose whole contract is that it is plain. It also keeps this
      // package's dependencies to the CodeMirror set the product already ships.
      EditorView.lineWrapping,
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.editable.of(!readOnly)
    ],
    [readOnly]
  );
  const { ref } = useCodeMirror({ value, extensions, onChange });
  return /* @__PURE__ */ jsxs("div", { className: cn("relative border border-border bg-muted/40", className), ...props, children: [
    version != null ? /* @__PURE__ */ jsx("span", { className: "absolute right-1 top-1 z-10 border border-border bg-card px-1 text-meta text-muted-foreground", children: version }) : null,
    /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn(
          "[&_.cm-editor]:bg-transparent [&_.cm-content]:font-mono [&_.cm-content]:text-meta",
          "[&_.cm-focused]:outline-none [&_.cm-cursor]:border-foreground"
        )
      }
    )
  ] });
}

export { CodeBlock, MarkdownEditorBlock, useCodeMirror };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map