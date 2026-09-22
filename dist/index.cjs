'use strict';

var React = require('react');
var view = require('@codemirror/view');
var state = require('@codemirror/state');
var language = require('@codemirror/language');
var python = require('@codemirror/legacy-modes/mode/python');
var shell = require('@codemirror/legacy-modes/mode/shell');
var javascript = require('@codemirror/legacy-modes/mode/javascript');
var cypher = require('@codemirror/legacy-modes/mode/cypher');
var ui = require('@invana/ui');
var jsxRuntime = require('react/jsx-runtime');
var commands = require('@codemirror/commands');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

// src/code-block.tsx
function useCodeMirror({
  value,
  extensions,
  onChange
}) {
  const host = React__namespace.useRef(null);
  const view$1 = React__namespace.useRef(null);
  const onChangeRef = React__namespace.useRef(onChange);
  React__namespace.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const extensionsRef = React__namespace.useRef(extensions);
  extensionsRef.current = extensions;
  const compartment = React__namespace.useRef(new state.Compartment());
  React__namespace.useEffect(() => {
    if (!host.current) return;
    const v = new view.EditorView({
      state: state.EditorState.create({
        doc: value,
        extensions: [
          compartment.current.of(extensionsRef.current),
          view.EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current?.(u.state.doc.toString());
          })
        ]
      }),
      parent: host.current
    });
    view$1.current = v;
    return () => {
      v.destroy();
      view$1.current = null;
    };
  }, []);
  React__namespace.useEffect(() => {
    const v = view$1.current;
    if (!v) return;
    v.dispatch({ effects: compartment.current.reconfigure(extensions) });
  }, [extensions]);
  React__namespace.useEffect(() => {
    const v = view$1.current;
    if (!v) return;
    const current = v.state.doc.toString();
    if (current === value) return;
    v.dispatch({ changes: { from: 0, to: current.length, insert: value } });
  }, [value]);
  return { ref: host, view: view$1 };
}
var MODES = {
  python: () => language.StreamLanguage.define(python.python),
  shell: () => language.StreamLanguage.define(shell.shell),
  javascript: () => language.StreamLanguage.define(javascript.javascript),
  json: () => language.StreamLanguage.define(javascript.json),
  cypher: () => language.StreamLanguage.define(cypher.cypher),
  plain: () => null
};
function CodeBlock({
  value,
  language: language$1 = "plain",
  showLineNumbers,
  maxHeight,
  className,
  style,
  ...props
}) {
  const extensions = React__namespace.useMemo(() => {
    const mode = MODES[language$1]();
    return [
      // StreamLanguage only produces tokens; without a highlight style nothing
      // paints them and the block renders as flat text.
      language.syntaxHighlighting(language.defaultHighlightStyle, { fallback: true }),
      view.EditorView.editable.of(false),
      state.EditorState.readOnly.of(true),
      view.EditorView.lineWrapping,
      ...showLineNumbers ? [view.lineNumbers()] : [],
      ...mode ? [mode] : [],
      // The scroller lives inside CodeMirror rather than on the wrapper, so the
      // editor knows its own viewport and does not render every line of a long
      // document into a box that then clips them.
      ...maxHeight != null ? [view.EditorView.theme({ "&": { maxHeight: `${maxHeight}px` } })] : []
    ];
  }, [language$1, showLineNumbers, maxHeight]);
  const { ref } = useCodeMirror({ value, extensions });
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      className: ui.cn(
        "overflow-hidden border border-border bg-muted/40 [&_.cm-editor]:bg-transparent",
        "[&_.cm-content]:font-mono [&_.cm-content]:text-sm [&_.cm-focused]:outline-none",
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
  const extensions = React__namespace.useMemo(
    () => [
      // No markdown syntax mode, deliberately. What is typed here is offered
      // verbatim in a model's prompt, and highlighting it would be decoration
      // on text whose whole contract is that it is plain. It also keeps this
      // package's dependencies to the CodeMirror set the product already ships.
      view.EditorView.lineWrapping,
      commands.history(),
      view.keymap.of([...commands.defaultKeymap, ...commands.historyKeymap]),
      view.EditorView.editable.of(!readOnly)
    ],
    [readOnly]
  );
  const { ref } = useCodeMirror({ value, extensions, onChange });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: ui.cn("relative border border-border bg-muted/40", className), ...props, children: [
    version != null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute right-1 top-1 z-10 border border-border bg-card px-1 text-sm text-muted-foreground", children: version }) : null,
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: ui.cn(
          "[&_.cm-editor]:bg-transparent [&_.cm-content]:font-mono [&_.cm-content]:text-sm",
          "[&_.cm-focused]:outline-none [&_.cm-cursor]:border-foreground"
        )
      }
    )
  ] });
}

exports.CodeBlock = CodeBlock;
exports.MarkdownEditorBlock = MarkdownEditorBlock;
exports.useCodeMirror = useCodeMirror;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map