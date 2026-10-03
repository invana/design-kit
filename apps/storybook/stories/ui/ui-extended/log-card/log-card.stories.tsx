import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LogCard as Component, type LogLine } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/log-card.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface LogVariant extends Variant {
  live?: boolean;
  source?: string;
  collapsed?: boolean;
}

const VARIANTS = DATA.variants as LogVariant[];
const LINES = DATA.lines as LogLine[];

interface Args {
  variant: string;
  onSourceChange: (source: string | null) => void;
  onCollapsedChange: (collapsed: boolean) => void;
  onClose: () => void;
}

const meta = {
  title: 'UI/UI Extended/LogCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { LogCard } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { lines: LINES },
              setup: [
                '// Receives the source to show, or null for every source.',
                `const [source, onSourceChange] = React.useState(${JSON.stringify(v.source ?? null)});`,
                '// Receives the folded state to go to.',
                `const [collapsed, onCollapsedChange] = React.useState(${!!v.collapsed});`,
              ].join('\n'),
              call: jsx('LogCard', {
                lines: 'lines',
                live: v.live ? 'true' : undefined,
                source: 'source',
                onSourceChange: 'onSourceChange',
                collapsed: 'collapsed',
                onCollapsedChange: 'onCollapsedChange',
                onClose: 'onClose',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSourceChange: fn(), onCollapsedChange: fn(), onClose: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Card({ v, lines, live, args, log }: { v: LogVariant; lines: LogLine[]; live?: boolean; args: Args; log: Log }) {
  const [source, setSource] = React.useState<string | null>(v.source ?? null);
  const [collapsed, setCollapsed] = React.useState(!!v.collapsed);
  return (
    <Component
      lines={lines}
      live={live}
      source={source}
      onSourceChange={(next) => {
        args.onSourceChange(next);
        log('onSourceChange', next);
        setSource(next);
      }}
      collapsed={collapsed}
      onCollapsedChange={(next) => {
        args.onCollapsedChange(next);
        log('onCollapsedChange', next);
        setCollapsed(next);
      }}
      onClose={() => {
        args.onClose();
        log('onClose', undefined);
      }}
    />
  );
}

/** The lines arrive one per frame; pause the panel and they keep arriving behind it. */
function Live({ v, args, log }: { v: LogVariant; args: Args; log: Log }) {
  const replay = useReplay(LINES.length, { every: 500 });
  return (
    <ReplayFrame replay={replay} noun="line" width={v.width}>
      <Card v={v} lines={LINES.slice(0, replay.at)} live={!replay.done} args={args} log={log} />
    </ReplayFrame>
  );
}

/**
 * The run's log, as it is written, in a panel that floats over the work — the raw record behind
 * the activity panel. Only the level word is coloured. It follows new lines while live; pausing
 * freezes what is shown and counts what arrived behind it. Filter by level, by words, or by the
 * source a call wrote from. Data: `fixtures/ui-extended/log-card.json`.
 */
export const LogCard: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => (v.live ? <Live v={v} args={args} log={log} /> : <Card v={v} lines={LINES} args={args} log={log} />)}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const cell = within(canvas.getByRole('group', { name: "A run's log" }));
    await step('Error keeps only the error lines', async () => {
      await userEvent.click(cell.getByText('Error'));
      await expect(cell.getByText('HR records denied (lens: funding-watch)')).toBeInTheDocument();
      await expect(cell.queryByText('Accounts ok · 50 rows · 120ms')).not.toBeInTheDocument();
    });
    await step('One source is shown until it is cleared', async () => {
      const one = within(canvas.getByRole('group', { name: 'One source only' }));
      await expect(one.queryByText(/run started/)).not.toBeInTheDocument();
      await userEvent.click(one.getByTitle('Show every source'));
      await expect(args.onSourceChange).toHaveBeenCalledWith(null);
      await expect(one.getByText(/run started/)).toBeInTheDocument();
    });
  },
};
