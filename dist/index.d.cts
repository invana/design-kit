import * as React from 'react';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

type CodeLanguage = "python" | "shell" | "javascript" | "json" | "cypher" | "plain";
interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: string;
    language?: CodeLanguage;
    /** Line numbers are off by default — a five-line snippet does not need a gutter. */
    showLineNumbers?: boolean;
    /**
     * Cap the block's height in px and let it scroll inside that, for a document
     * whose length is not the point — a run's `result.json`, an exported model.
     *
     * Unset, the block is as tall as its content, which is right for a snippet
     * and wrong for a record that grows as a run proceeds.
     */
    maxHeight?: number;
}
/**
 * Code, shown as it is — read-only.
 *
 * The DAG in a hand-off, a query in a diagnosis, an exported model. It is not a
 * disabled editor: `EditorState.readOnly` plus a non-editable view means there
 * is no cursor to place and no illusion that typing would do something.
 */
declare function CodeBlock({ value, language, showLineNumbers, maxHeight, className, style, ...props }: CodeBlockProps): React.JSX.Element;

interface MarkdownEditorBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    /** A version marker shown in the corner — `v5`, `v7 · editing`. */
    version?: React.ReactNode;
    placeholder?: string;
}
/**
 * The prose a person writes for an agent to read — graph rules, a skill's
 * content, an acceptance note.
 *
 * Plain markdown in a monospace field, not a rich-text editor. What is typed
 * here is offered verbatim in a model's prompt, so what you see has to be
 * exactly what the agent gets; a WYSIWYG layer would put a translation step
 * between the author and the thing that runs.
 *
 * `version` sits in the corner because these documents are versioned and a
 * running thinking finishes on the version it started with — editing without
 * seeing which version you are on is how two people overwrite each other.
 */
declare function MarkdownEditorBlock({ value, onChange, readOnly, version, className, ...props }: MarkdownEditorBlockProps): React.JSX.Element;

interface UseCodeMirrorOptions {
    value: string;
    extensions: Extension[];
    onChange?: (value: string) => void;
}
/**
 * Mounts a CodeMirror view into a ref'd element and keeps it in sync.
 *
 * The whole reason this is a hook rather than a component: CodeMirror owns its
 * own DOM, so React must not re-render into it. Value changes are pushed as
 * transactions, and only when they actually differ — writing the view's own
 * output back into it would move the cursor to the end on every keystroke.
 */
declare function useCodeMirror({ value, extensions, onChange, }: UseCodeMirrorOptions): {
    ref: React.RefObject<HTMLDivElement | null>;
    view: React.RefObject<EditorView | null>;
};

export { CodeBlock, type CodeBlockProps, type CodeLanguage, MarkdownEditorBlock, type MarkdownEditorBlockProps, type UseCodeMirrorOptions, useCodeMirror };
