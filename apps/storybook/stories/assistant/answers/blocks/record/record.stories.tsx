import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Record',
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
  label: 'record',
  blocks: [block],
  ...extra,
});

/** The Record board on the Design Kit Spec, variant for variant. */
export const Record: Story = {
  name: 'Record',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Label / value pairs',
        turn: answer('r1', {
          kind: 'record',
          rows: [
            { label: 'Customer', value: 'Acme Holdings' },
            { label: 'Segment', value: 'Enterprise' },
            { label: 'ARR', value: '£412,000' },
            { label: 'Renewal', value: '14 Jan 2027' },
            { label: 'Health', value: 'At risk · 3 signals' },
          ],
        }),
      },
      {
        caption: 'With a header + status',
        turn: answer(
          'r2',
          {
            kind: 'record',
            header: { title: 'Acme Holdings', initials: 'AH', status: { label: 'at risk', tone: 'bad' } },
            rows: [
              { label: 'Segment', value: 'Enterprise' },
              { label: 'ARR', value: '£412,000' },
              { label: 'Renewal', value: '14 Jan 2027 · in 107 days' },
            ],
          },
          { title: 'customer' },
        ),
      },
      {
        caption: 'Grouped',
        turn: answer(
          'r3',
          {
            kind: 'record',
            groups: [
              {
                label: 'Identity',
                rows: [
                  { label: 'Variety', value: 'BV-112' },
                  { label: 'Released', value: '2022' },
                ],
              },
              {
                label: 'Performance, semi-arid',
                rows: [
                  { label: 'Yield', value: '2,480 kg/ha' },
                  { label: 'Drought', value: '4 of 9' },
                  { label: 'Rust', value: '8 of 9' },
                  { label: 'Maturity', value: '104 days' },
                ],
              },
            ],
          },
          { title: 'variety' },
        ),
      },
      {
        caption: 'Assumptions behind an answer',
        turn: answer(
          'r4',
          {
            kind: 'record',
            rows: [
              { label: 'Elasticity', value: '1.3', source: "last year's promotions" },
              { label: 'Price change', value: '−5%', source: 'your input' },
              { label: 'Stores', value: '188', source: 'store master' },
              { label: 'Horizon', value: '8 weeks', source: 'default' },
            ],
          },
          { title: 'assumptions' },
        ),
      },
      {
        caption: 'Loading',
        turn: answer('r5', { kind: 'record', status: 'loading' }, { state: 'running' }),
      },
      {
        caption: 'No data',
        turn: answer('r6', {
          kind: 'record',
          status: 'empty',
          emptyText: 'No customer matches “Acme Holdings”.',
          emptySuggestions: ['Search “Acme”'],
        }),
      },
      {
        caption: 'At 280px · long values wrap',
        narrow: true,
        turn: answer('r7', {
          kind: 'record',
          rows: [
            { label: 'Customer', value: 'Acme Holdings International Group plc' },
            { label: 'Health', value: 'At risk · usage down 40%, two open escalations, champion left' },
            { label: 'Renewal', value: '14 Jan 2027' },
          ],
        }),
      },
    ],
  },
};
