import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PropertyList, PropertyRow, RunStatusText } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/run-status-text.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/RunStatusText',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { PropertyList, PropertyRow, RunStatusText } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { statuses: v.statuses },
              call: [
                '<PropertyList labelWidth={148}>',
                '  {statuses.map(({ status, what }) => (',
                `    <PropertyRow key={status} label={<RunStatusText status={status}${v.dot ? ' dot' : ''} />}>{what}</PropertyRow>`,
                '  ))}',
                '</PropertyList>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * How a run ended, in the engine's own word — from `fixtures/ui-extended/run-status-text.json`.
 * `succeeded` and `cannot_answer` are deliberately two tones over one machine outcome: the run
 * worked, and the graph still has no answer inside this world. The word is always written, so
 * colour never carries the state alone; a status the kit has never heard of draws in the neutral.
 */
export const RunStatusTextStory: Story = {
  name: 'RunStatusText',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PropertyList labelWidth={148}>
          {v.statuses.map(({ status, what }) => (
            <PropertyRow key={status} label={<RunStatusText status={status} dot={v.dot} />}>
              {what}
            </PropertyRow>
          ))}
        </PropertyList>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await expect(cell.getByText('reconciling')).toBeInTheDocument();
    await expect(cell.getByText('cannot_answer', { exact: false })).toBeInTheDocument();
  },
};
