import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Citations',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const answer = (id: string, blocks: BlockSpec[], extra: Partial<AnswerTurn> = {}): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'sources',
  blocks,
  ...extra,
});

const sources = [
  { label: 'General ledger, Q3', count: 12408 },
  { label: 'Carrier invoices', count: 3911 },
  { label: 'Store master', count: 214 },
];

/**
 * The sources an answer rests on, numbered as its markers cite them, with record counts at the
 * right and, under each, what kind of source it is and how fresh. Pointing at a marker lights its
 * row. Folded, one line gives the sources and records; no records is said out loud.
 */
export const Citations: Story = {
  name: 'Citations',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Sources with counts', turn: answer('counts', [{ preset: 'citations', sources }]) },
      {
        caption: 'Type + freshness',
        turn: answer(
          'freshness',
          [
            {
              preset: 'citations',
              sources: [
                { label: 'General ledger, Q3', count: 12408, detail: 'table · loaded 28 Sep 06:00' },
                { label: 'Carrier invoices', count: 3911, detail: 'file · uploaded 26 Sep' },
                { label: 'Store master', count: 214, detail: 'table · loaded 1 Sep' },
              ],
            },
          ],
          { aside: '16,533 records' },
        ),
      },
      {
        caption: 'Linked to a marker',
        turn: answer(
          'linked',
          [
            { preset: 'narrative', text: 'Freight per order rose 22% after the July carrier change.[2]', active: 2 },
            { preset: 'citations', sources, active: 2 },
          ],
          { label: 'prose' },
        ),
      },
      { caption: 'Folded', turn: answer('folded', [{ preset: 'citations', sources, folded: true }]) },
      {
        caption: 'No records · said out loud',
        turn: answer('none', [
          {
            preset: 'citations',
            sources: [{ label: 'Returns log, Q3', count: 0 }],
            note: 'No returns matched these filters. The answer rests on no records.',
          },
        ]),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: answer('narrow', [
          {
            preset: 'citations',
            sources: [
              { label: 'General ledger, Q3', count: 12408, detail: 'table · 28 Sep' },
              { label: 'Carrier invoices', count: 3911, detail: 'file · 26 Sep' },
              { label: 'Store master', count: 214, detail: 'table · 1 Sep' },
            ],
          },
        ]),
      },
    ],
  },
};
