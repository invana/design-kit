import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Metric',
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

/** The Metric board on the Design Kit Spec, variant for variant. */
export const Metric: Story = {
  name: 'Metric',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Figure + comparison',
        turn: answer('m1', {
          kind: 'metric',
          label: 'Net revenue retention',
          value: '108%',
          delta: '▲ 3 pts vs Q2 · target 110%',
          tone: 'good',
        }),
      },
      {
        caption: 'Against a target',
        turn: answer('m2', {
          kind: 'metric',
          label: 'Net revenue retention',
          value: '108%',
          delta: '▲ 3 pts vs Q2',
          tone: 'good',
          gauge: { value: 108, target: 110, min: 0, max: 120, unit: '%' },
        }),
      },
      {
        caption: 'With a trend',
        turn: answer('m3', {
          kind: 'metric',
          label: 'Weekly sales',
          value: '£4.82M',
          delta: '▼ 3.1% vs LY',
          tone: 'bad',
          trend: [14, 15, 12, 16, 11, 8, 9, 4, 1],
          caption: 'Last 12 weeks',
        }),
      },
      {
        caption: 'No comparison',
        turn: answer('m4', {
          kind: 'metric',
          label: 'Open tickets',
          value: '412',
          delta: 'as of 06:00',
        }),
      },
      {
        caption: 'No data',
        turn: answer('m5', {
          kind: 'metric',
          label: 'Net revenue retention',
          value: null,
          delta: 'No renewals fell due in September',
        }),
      },
      {
        caption: 'Loading',
        turn: answer(
          'm6',
          { kind: 'metric', label: 'Net revenue retention', value: null, status: 'loading' },
          { state: 'running' },
        ),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: answer('m7', {
          kind: 'metric',
          label: 'Net revenue retention',
          value: '108%',
          delta: '▲ 3 pts vs Q2',
          tone: 'good',
          caption: 'Target 110%',
        }),
      },
    ],
  },
};
