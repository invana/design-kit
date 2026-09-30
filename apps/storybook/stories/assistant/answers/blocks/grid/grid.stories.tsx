import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec, MetricOptions } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Grid',
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
  label: 'metric',
  blocks: [block],
  ...extra,
});

const revenue: MetricOptions = { label: 'Revenue', value: '£4.1M', delta: '▲ 4%', tone: 'good' };
const orders: MetricOptions = { label: 'Orders', value: '61.2k', delta: '▲ 7%', tone: 'good' };
const aov: MetricOptions = { label: 'AOV', value: '£67', delta: '▼ 3%', tone: 'bad' };
const returns: MetricOptions = { label: 'Returns', value: '4.2%', delta: 'flat' };

/** The Metric grid board on the Assistant Presets canvas, variant for variant. */
export const MetricGrid: Story = {
  name: 'Metric grid',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Three across', turn: answer('g1', { preset: 'grid', tiles: [revenue, orders, aov] }) },
      { caption: 'Two by two', turn: answer('g2', { preset: 'grid', tiles: [revenue, orders, aov, returns] }) },
      {
        caption: 'Six in two rows',
        turn: answer('g3', {
          preset: 'grid',
          tiles: [
            revenue,
            orders,
            aov,
            { label: 'Margin', value: '14.2%', delta: '▼ 1.8 pts', tone: 'bad' },
            { label: 'Freight', value: '6.9%', delta: '▲ 1.2 pts', tone: 'bad' },
            returns,
          ],
        }),
      },
      {
        caption: 'One tile flagged',
        turn: answer('g4', {
          preset: 'grid',
          tiles: [revenue, orders, { label: 'North', value: '£0.9M', delta: '▼ 6%', tone: 'bad', flag: true }],
          caption: 'North rests on 9 stores · indicative',
          captionTone: 'warn',
        }),
      },
      {
        caption: 'Loading',
        turn: answer('g5', { preset: 'grid', tiles: [], status: 'loading' }, { state: 'running' }),
      },
      {
        caption: 'No data',
        turn: answer('g6', {
          preset: 'grid',
          tiles: [revenue, { label: 'Returns', value: null, delta: 'Not loaded for Q3' }],
        }),
      },
      {
        caption: 'At 280px · four become two by two',
        narrow: true,
        turn: answer('g7', { preset: 'grid', tiles: [revenue, orders, aov, returns] }),
      },
    ],
  },
};
