import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SuggestionChips as SuggestionChipsPart, type SuggestionChipsProps } from '@invana/assistant';

import data from '../../../../fixtures/assistant/suggestion-chips.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface ChipsVariant {
  caption: string;
  props: Omit<SuggestionChipsProps, 'onSelect'>;
}

const VARIANTS = data as unknown as ChipsVariant[];

interface Args {
  variant: string;
  onSelect: (text: string) => void;
}

/** Chips as a consumer holds them: the one picked is sent, and stays marked as sent. */
function LiveChips({ variant, onSelect, log }: { variant: ChipsVariant; onSelect: (text: string) => void; log: Log }) {
  const [sent, setSent] = React.useState(variant.props.sent);
  return (
    <SuggestionChipsPart
      {...variant.props}
      sent={sent}
      onSelect={(text) => {
        onSelect(text);
        log('onSelect', text);
        setSent((now) => [...(now ?? []), text]);
      }}
    />
  );
}

const meta = {
  title: 'Assistant/Components/SuggestionChips',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { SuggestionChips } from '@invana/assistant';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { items: v.props.items },
              setup: '// onSelect receives the chip\'s words — send them as the next prompt.\nconst onSelect = (text) => api.send({ type: "prompt", text });',
              call: jsx('SuggestionChips', { items: 'items', onSelect: 'onSelect' }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Follow-ups that reuse the current scope. Picking one sends it as the next prompt. */
export const SuggestionChips: Story = {
  render: ({ variant, onSelect }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveChips variant={v} onSelect={onSelect} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const c = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Pick a follow-up', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Compare with Q3 last year' }));
      await expect(args.onSelect).toHaveBeenCalledWith('Compare with Q3 last year');
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"Compare with Q3 last year"');
    });
  },
};
