import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Cannot',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const outcome = (id: string, block: BlockSpec, state: AnswerTurn['state'] = 'cannot'): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state,
  label: 'outcome',
  blocks: [block],
});

const held = {
  reason: "Shipments are held from January 2023, so 2021 can't be compared.",
  remedy: 'Import the 2021 archive to answer this.',
};

/**
 * What the data does not hold, in a dashed card, with what would change the answer — then what it
 * can answer instead, each sent as the next prompt. Answered in part, the card says which part is
 * missing, in the info tone.
 */
export const CannotAnswer: Story = {
  name: 'Cannot answer',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Reason + what would change it', turn: outcome('reason', { preset: 'cannot', ...held }) },
      {
        caption: 'With what I can answer instead',
        turn: outcome('nearest', {
          preset: 'cannot',
          ...held,
          nearest: ['Compare 2023 with 2025', 'Trend since Jan 2023'],
        }),
      },
      {
        caption: 'Partly answered',
        turn: outcome(
          'partial',
          {
            preset: 'cannot',
            reason: 'The answer below covers 2023–2026. 2021 and 2022 are not held.',
            remedy: 'Import the archive to extend it.',
            partial: true,
          },
          'complete',
        ),
      },
      {
        caption: 'No access',
        turn: outcome('access', {
          preset: 'cannot',
          reason: "Payroll data needs the Finance role, which you don't have.",
          remedy: 'Ask a workspace admin to grant Finance.',
        }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: outcome('narrow', { preset: 'cannot', ...held, nearest: ['Compare 2023 with 2025'] }),
      },
    ],
  },
};
