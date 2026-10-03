import * as React from "react"
import { cn, SectionHeader, TypographyH3, TypographyMuted } from "@invana/ui"

import { Block } from "./block"
import type { BlockSpec } from "./types"

export interface PageSection {
  title?: string
  description?: string
  blocks: BlockSpec[]
}

/** A page as JSON: a report, or a long answer opened in full. */
export interface PageSpec {
  title?: string
  description?: string
  sections: PageSection[]
}

export interface PageProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  spec: PageSpec
  /**
   * A block's action, with where the block sits and what it carries — `open` on
   * a table in section 1, `select` with the row's key as `value`.
   */
  onAction?: (action: string, at: { section: number; block: number; value?: unknown }) => void
}

/**
 * Blocks laid out as a document: sections top to bottom, each block bare, no
 * cards and no borders. A section's title is its rule; a page's title is its
 * heading. The same specs a conversation turn or a board panel draws.
 */
export const Page = React.forwardRef<HTMLElement, PageProps>(({ spec, onAction, className, ...props }, ref) => (
  <article ref={ref} className={cn("flex min-w-0 flex-col gap-6", className)} {...props}>
    {spec.title || spec.description ? (
      <header className="flex flex-col gap-1">
        {spec.title ? <TypographyH3>{spec.title}</TypographyH3> : null}
        {spec.description ? <TypographyMuted>{spec.description}</TypographyMuted> : null}
      </header>
    ) : null}
    {spec.sections.map((section, s) => (
      <section key={s} className="flex min-w-0 flex-col gap-3">
        {section.title ? <SectionHeader title={section.title} /> : null}
        {section.description ? <TypographyMuted>{section.description}</TypographyMuted> : null}
        {section.blocks.map((block, b) => (
          <Block
            key={b}
            spec={block}
            onAction={
              onAction
                ? (action, value) =>
                    onAction(action, value === undefined ? { section: s, block: b } : { section: s, block: b, value })
                : undefined
            }
          />
        ))}
      </section>
    ))}
  </article>
))
Page.displayName = "Page"
