import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Bars',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const answer = (id: string, block: BlockSpec, extra?: Partial<AnswerTurn>): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'chart',
  title: 'margin by plant, %',
  blocks: [block],
  ...extra,
});

const byPlant: BlockSpec = {
  kind: 'bars',
  unit: '%',
  groups: ['A', 'B', 'C', 'D'],
  series: [
    { name: 'Q3', values: [17.7, 12.6, 15.4, 9.7] },
    { name: 'Q2', values: [16.0, 13.7, 14.9, 12.0], muted: true },
  ],
  target: { value: 16.6, label: 'target 16%' },
};

/** The Bar comparison board on the Design Kit Spec, variant for variant. */
export const BarComparison: Story = {
  name: 'Bar comparison',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Groups + target', turn: answer('b1', byPlant) },
      {
        caption: 'One series · one bar called out',
        turn: answer(
          'b2',
          {
            kind: 'bars',
            unit: '%',
            groups: ['A', 'B', 'C', 'D', 'E', 'F'],
            series: [{ name: 'Q3 margin', values: [15.0, 18.6, 11.4, 21.0, 13.8, 16.5] }],
            highlight: 'C',
            caption: 'Plant C is the lowest of six',
          },
          { title: 'margin by plant, Q3' },
        ),
      },
      {
        caption: 'Actual inside target',
        turn: answer(
          'b3',
          {
            kind: 'bars',
            groups: ['North', 'South', 'East', 'Wales', 'Scot.'],
            series: [{ name: 'shipped', values: [60, 64, 66, 32, 54] }],
            plan: { name: 'plan', values: [70, 60, 64, 50, 56] },
          },
          { title: 'units vs plan, September' },
        ),
      },
      {
        caption: 'Loading',
        turn: answer('b4', { ...byPlant, status: 'loading' }, { state: 'running' }),
      },
      {
        caption: 'No data',
        turn: answer('b5', {
          ...byPlant,
          status: 'empty',
          emptyText: 'No plant has reported September margin yet.',
        }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: answer('b6', { ...byPlant, target: { value: 16.6, label: 'target' } }),
      },
    ],
  },
};
