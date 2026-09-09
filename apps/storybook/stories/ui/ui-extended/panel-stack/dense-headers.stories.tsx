import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, MoreHorizontal, Pin } from 'lucide-react';
import { PanelStack } from '@invana/ui';

const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack',
  component: PanelStack,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const VARIABLES = [
  ['symbol', '"BPCL"'],
  ['window', '7d'],
  ['minConfidence', '0.6'],
  ['includeDrafts', 'false'],
];

const FRAMES = [
  'resolveThesis (analysis.ts:118)',
  'scoreEvidence (analysis.ts:64)',
  'runPipeline (pipeline.ts:212)',
  'handleRequest (server.ts:41)',
];

const BREAKPOINTS = ['analysis.ts:118', 'pipeline.ts:212', 'server.ts:41'];

/**
 * The four styling seams, all at once. `headerHeight` is the one that changes
 * the layout rather than the paint — it doubles as the collapsed size, so a
 * shorter header means a denser stack of closed drawers; the 28px here is the
 * debugger tier, against a 35px default.
 *
 * `headerClassName` and `bodyClassName` are merged onto every section's header
 * and body, so the ruling and padding are set once for the stack rather than
 * repeated per section, and `className` reaches the outer group. `withHandle`
 * adds a grip to the dividers between expanded sections — collapsed
 * boundaries have nothing to drag, so they stay hairlines.
 */
export const DenseHeaders: Story = {
  render: () => (
    <div className="h-[520px] w-[340px] overflow-hidden rounded-md border border-border bg-background">
      <PanelStack
        withHandle
        headerHeight={28}
        className="bg-muted/20"
        headerClassName="bg-background/60"
        bodyClassName="px-1 font-mono text-meta"
        sections={[
          {
            id: 'variables',
            title: 'Variables',
            content: (
              <ul className="py-1">
                {VARIABLES.map(([name, value]) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-accent/50"
                  >
                    <span className="truncate text-foreground">{name}</span>
                    <span className="ml-auto truncate text-muted-foreground">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            ),
            headerActions: [
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  { id: 'copy', label: 'Copy all as JSON', icon: Copy },
                ],
              },
            ],
          },
          {
            id: 'callstack',
            title: 'Call stack',
            content: (
              <ol className="py-1">
                {FRAMES.map((frame, i) => (
                  <li
                    key={frame}
                    className={`truncate rounded px-1 py-0.5 hover:bg-accent/50 ${
                      i === 0 ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {frame}
                  </li>
                ))}
              </ol>
            ),
          },
          {
            id: 'breakpoints',
            title: 'Breakpoints',
            defaultCollapsed: true,
            content: (
              <ul className="py-1">
                {BREAKPOINTS.map((bp) => (
                  <li
                    key={bp}
                    className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-accent/50"
                  >
                    <Pin className="h-3 w-3 shrink-0 text-destructive" />
                    <span className="truncate text-muted-foreground">{bp}</span>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: 'watch',
            title: 'Watch',
            defaultCollapsed: true,
            content: (
              <p className="px-1 py-2 text-muted-foreground">
                No watch expressions.
              </p>
            ),
          },
        ]}
      />
    </div>
  ),
};
