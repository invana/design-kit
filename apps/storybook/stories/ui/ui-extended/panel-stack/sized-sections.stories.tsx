import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image, ListTree, ScrollText } from 'lucide-react';
import { PanelStack } from '@invana/ui';

const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack',
  component: PanelStack,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const OUTLINE = [
  'Defence theme — Sep 2026',
  '  Thesis · order book',
  '  Evidence · 12 articles',
  '  Counterpoints · 3',
  'BPCL today',
  '  Intraday observations',
  '  Volume anomaly',
  'Watchlist',
  '  Refiners',
  '  Power',
];

const LOG = [
  '12:04:11  layout  force-directed · 512 nodes',
  '12:03:58  query   MATCH (s:Stock)-[:MENTIONS]->(a)',
  '12:03:58  cache   hit · 41 edges',
  '12:03:12  ingest  nse-daily · 2026-09-08.csv',
  '12:02:44  ingest  reuters · 118 articles',
  '12:01:03  auth    session refreshed',
];

/**
 * Sizes are per section, and they mix units. `defaultSize` takes a number or
 * `"%"` string as a share of the stack, or `px`/`rem`/`vh` for an absolute
 * one; `minSize` is the floor a drag can reach before the section collapses
 * instead.
 *
 * Here **Preview** opens at a fixed `200px` — a thumbnail wants the same
 * height whatever the sidebar's, so a percentage would be the wrong tool —
 * while **Outline** takes `45%` and **Log** absorbs what is left. Log's
 * `minSize` of `120px` is above the `headerHeight + 64` default, so dragging
 * it short snaps it shut rather than leaving a two-line sliver.
 *
 * Drag the dividers to feel the difference: every section still resizes, the
 * sizes only decide where they start and how far down they go.
 */
export const SizedSections: Story = {
  render: () => (
    <div className="h-[600px] w-[340px] overflow-hidden rounded-md border border-border bg-background">
      <PanelStack
        withHandle
        sections={[
          {
            id: 'preview',
            title: 'Preview',
            icon: Image,
            defaultSize: '200px',
            content: (
              <div className="p-2">
                <div className="flex h-[140px] items-center justify-center rounded border border-dashed border-border bg-muted/30 text-meta text-muted-foreground">
                  graph thumbnail
                </div>
              </div>
            ),
          },
          {
            id: 'outline',
            title: 'Outline',
            icon: ListTree,
            defaultSize: '45%',
            content: (
              <ul className="py-1">
                {OUTLINE.map((row) => (
                  <li
                    key={row}
                    className="truncate whitespace-pre px-2 py-1 text-foreground hover:bg-accent/50"
                  >
                    {row}
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: 'log',
            title: 'Log',
            icon: ScrollText,
            minSize: '120px',
            content: (
              <ul className="py-1 font-mono text-meta">
                {LOG.map((line) => (
                  <li
                    key={line}
                    className="truncate whitespace-pre px-2 py-0.5 text-muted-foreground"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />
    </div>
  ),
};
