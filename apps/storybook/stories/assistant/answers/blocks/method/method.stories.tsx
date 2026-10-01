import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Method',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const method = (id: string, block: BlockSpec): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'method',
  blocks: [block],
});

/**
 * The query, formula or model behind the figure, folded to one line with its meta at the right.
 * Open, the code — `**…**` marks its keywords — then what a model rests on, or the steps of a
 * method that took several.
 */
export const Method: Story = {
  name: 'Method',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Folded · one line',
        turn: method('folded', {
          kind: 'method',
          label: 'method',
          code: 'margin = op_income / net_revenue',
          meta: 'margin = op_income / net_revenue · 18 ms',
        }),
      },
      {
        caption: 'Open · query',
        turn: method('query', {
          kind: 'method',
          label: 'query',
          meta: '12,408 rows · 18 ms',
          open: true,
          code: "**SELECT** region,\n  sum(op_income) / sum(net_rev) **AS** margin\n**FROM** ledger\n**WHERE** quarter = '2026-Q3'\n**GROUP BY** region",
        }),
      },
      {
        caption: 'Open · model',
        turn: method('model', {
          kind: 'method',
          label: 'model',
          meta: 'mixed model · 0.4 s',
          open: true,
          code: '**yield** ~ traits + (1 | site) + (1 | season)',
          facts: [
            { label: 'Plots', value: '1,284' },
            { label: 'Seasons', value: '4' },
            { label: 'Marginal R²', value: '0.61' },
          ],
        }),
      },
      {
        caption: 'Open · several steps',
        turn: method('steps', {
          kind: 'method',
          label: '3 steps',
          meta: '4.2 s',
          open: true,
          steps: [
            { label: 'Read general ledger, Q2–Q3', detail: '12,408' },
            { label: 'Joined carrier invoices by order', detail: '3,911' },
            { label: 'Decomposed the change by region', detail: '2.1 s' },
          ],
        }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: method('narrow', {
          kind: 'method',
          label: 'query',
          meta: '18 ms',
          open: true,
          code: "**SELECT** region,\n  sum(op_income)\n  / sum(net_rev)\n**FROM** ledger\n**WHERE** quarter = '2026-Q3'\n**GROUP BY** region",
        }),
      },
    ],
  },
};
