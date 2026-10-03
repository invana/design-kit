import { Eyebrow } from "@invana/ui"
import { CodeBlock } from "@invana/editor"

import type {
  CodeOptions,
  ExchangeOptions,
  JsonOptions,
  PanelRendererProps,
} from "../types"

export function JsonPanel({ options }: PanelRendererProps<JsonOptions>) {
  const value =
    typeof options.value === "string"
      ? options.value
      : JSON.stringify(options.value, null, 2)
  return (
    <CodeBlock language="json" value={value} maxHeight={options.maxHeight} className="border-0" />
  )
}

export function CodePanel({ options }: PanelRendererProps<CodeOptions>) {
  return (
    <CodeBlock
      language={options.language ?? "plain"}
      value={options.value}
      maxHeight={options.maxHeight}
      showLineNumbers={options.showLineNumbers}
      className="border-0"
    />
  )
}

/**
 * A labelled pair of mono blocks — a prompt and what came back.
 *
 * Its own kind rather than two `code` panels, because the two are one record:
 * a completion shown without the prompt that produced it is not evidence.
 */
export function ExchangePanel({ options }: PanelRendererProps<ExchangeOptions>) {
  return (
    <div className="flex flex-col gap-2">
      {options.blocks.map((block, i) => (
        <div key={i} className="flex flex-col gap-1">
          <Eyebrow>{block.label}</Eyebrow>
          <CodeBlock language={block.language ?? "plain"} value={block.value} />
        </div>
      ))}
    </div>
  )
}
