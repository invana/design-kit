import type * as React from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import type { BlockProps } from "../types"

/** Each element in the kit's tokens: headings at the body size, muted grounds for code, rules for tables. */
const COMPONENTS: Components = {
  p: ({ children }) => <p className="my-0">{children}</p>,
  h1: ({ children }) => <h1 className="my-0 text-base font-semibold">{children}</h1>,
  h2: ({ children }) => <h2 className="my-0 text-base font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="my-0 text-base font-semibold">{children}</h3>,
  h4: ({ children }) => <h4 className="my-0 text-base font-semibold">{children}</h4>,
  ul: ({ children }) => <ul className="my-0 flex list-disc flex-col gap-0.5 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-0 flex list-decimal flex-col gap-0.5 pl-5">{children}</ol>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer noopener" className="text-primary underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ children, className }) =>
    // A fenced block names its language (`language-cypher`); inline code has none.
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded-sm bg-muted px-1 font-mono text-[0.95em]">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="my-0 overflow-x-auto rounded-control bg-muted p-2 font-mono text-xs">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-0 border-l-2 border-border pl-3 text-muted-foreground">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-border px-2 py-1 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-border px-2 py-1 align-top">{children}</td>,
  hr: () => <hr className="my-0 border-border" />,
}

/**
 * An answer a model wrote in Markdown: paragraphs, lists, code, tables and
 * links, drawn in the kit's type and tokens. Raw HTML is dropped, never run,
 * so a model's answer cannot put markup or script on the page. Links open in a
 * new tab.
 *
 * For an answer that leads with a figure and cites its sources, `narrative` is
 * the block; this one is for prose whose shape the model chooses.
 */
export function MarkdownBlock({ spec }: BlockProps<"markdown">): React.ReactElement {
  return (
    <div className="flex min-w-0 flex-col gap-2 break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS} skipHtml>
        {spec.text}
      </ReactMarkdown>
    </div>
  )
}
