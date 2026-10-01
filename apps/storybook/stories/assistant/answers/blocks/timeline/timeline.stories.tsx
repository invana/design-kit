import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Timeline',
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
  label: 'timeline',
  title: 'container MSKU 402918',
  blocks: [block],
  ...extra,
});

/** The Timeline board on the Design Kit Spec, variant for variant. */
export const Timeline: Story = {
  name: 'Timeline',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Dated events',
        turn: answer('l1', {
          preset: 'timeline',
          events: [
            { when: '12 Sep', text: 'Loaded at Rotterdam', tone: 'good' },
            { when: '19 Sep', text: 'Held at customs · 3 days', tone: 'warn' },
            { when: '23 Sep', text: 'Arrived Felixstowe' },
            { when: '26 Sep', text: 'Delivered, 4 days late' },
          ],
        }),
      },
      {
        caption: 'With detail lines',
        turn: answer('l2', {
          preset: 'timeline',
          events: [
            { when: '12 Sep', text: 'Loaded at Rotterdam', detail: 'Vessel departs on schedule', tone: 'good' },
            { when: '19 Sep', text: 'Held at customs', detail: 'Missing certificate of origin · 3 days', tone: 'warn' },
            { when: '23 Sep', text: 'Arrived Felixstowe', detail: 'Gate-out 16:40' },
            { when: '26 Sep', text: 'Delivered', detail: '4 days after the promised date', tone: 'bad' },
          ],
        }),
      },
      {
        caption: 'Around an anomaly',
        turn: answer(
          'l3',
          {
            preset: 'timeline',
            events: [
              { when: '11 Sep', text: 'Price change on 40 SKUs', section: 'Before' },
              { when: '13 Sep', text: 'New returns policy live', section: 'Before' },
              { when: '14 Sep', text: 'Refunds 2.4σ above normal', tone: 'bad', section: 'Spike', highlight: true },
              { when: '15 Sep', text: 'POS outage, 2 hours', tone: 'warn', section: 'After' },
            ],
          },
          { title: 'refunds, Leeds · ±3 days' },
        ),
      },
      {
        caption: 'Loading',
        turn: answer('l4', { preset: 'timeline', events: [], status: 'loading' }, { state: 'running' }),
      },
      {
        caption: 'No data',
        turn: answer('l5', {
          preset: 'timeline',
          events: [],
          status: 'empty',
          emptyText: 'No events recorded for this container yet.',
        }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: answer(
          'l6',
          {
            preset: 'timeline',
            events: [
              { when: '12 Sep', text: 'Loaded at Rotterdam', tone: 'good' },
              { when: '19 Sep', text: 'Held at customs · 3 days', tone: 'warn' },
              { when: '23 Sep', text: 'Arrived Felixstowe' },
              { when: '26 Sep', text: 'Delivered, 4 days late' },
            ],
          },
          { title: 'MSKU 402918' },
        ),
      },
    ],
  },
};
