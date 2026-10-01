import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Ranked',
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
  label: 'ranked',
  title: 'contribution to Δ margin',
  blocks: [block],
  ...extra,
});

const contribution = [
  { label: 'Freight', value: -1.2, display: '−1.2' },
  { label: 'Markdowns', value: -0.5, display: '−0.5' },
  { label: 'Energy', value: -0.3, display: '−0.3' },
  { label: 'Mix', value: 0.2, display: '+0.2' },
];

/** The Ranked list board on the Design Kit Spec, variant for variant. */
export const RankedList: Story = {
  name: 'Ranked list',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Contribution · signed',
        turn: answer('k1', { kind: 'ranked', items: contribution, caption: 'Margin points, Q2 → Q3' }),
      },
      {
        caption: 'Diverging from zero',
        turn: answer('k2', {
          kind: 'ranked',
          items: contribution,
          diverging: { below: '− pulls margin down', above: 'lifts it +' },
        }),
      },
      {
        caption: 'Top five + the rest folded',
        turn: answer(
          'k3',
          {
            kind: 'ranked',
            items: [
              { label: 'Drought +1', value: 96, display: '+96' },
              { label: 'Rust +1', value: 38, display: '+38' },
              { label: 'Seeds/pod +0.1', value: 22, display: '+22' },
              { label: 'Pod +1 mm', value: 9, display: '+9' },
              { label: '1 day earlier', value: 7, display: '+7' },
              { label: '3 others', value: 6, display: '+6', muted: true },
            ],
            caption: 'kg/ha per step, other traits held constant',
          },
          { title: 'yield gain, semi-arid', envelope: { grounding: { records: 1284, noun: 'plots' } } },
        ),
      },
      {
        caption: 'Loading',
        turn: answer('k4', { kind: 'ranked', items: [], status: 'loading' }, { state: 'running' }),
      },
      {
        caption: 'No data',
        turn: answer('k5', {
          kind: 'ranked',
          items: [],
          status: 'empty',
          emptyText: 'No cost line moved between Q2 and Q3.',
        }),
      },
      {
        caption: 'At 280px · labels narrow',
        narrow: true,
        turn: answer('k6', { kind: 'ranked', items: contribution }, { title: 'Δ margin' }),
      },
    ],
  },
};
