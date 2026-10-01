import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec, TraceStep } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Trace',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const running = (id: string, trace: TraceStep[]): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'running',
  trace,
  blocks: [],
});

const record = (id: string, label: string, block: BlockSpec): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label,
  blocks: [block],
});

/**
 * What the answer is doing, step by step: done steps filled, the running one pulsing, pending ones
 * hollow. Done, it folds into one line; a failed step says why, with a retry; a step held on the
 * analyst waits hollow, in the info tone.
 */
export const ProgressTrace: Story = {
  name: 'Progress trace',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Running',
        turn: running('running', [
          { id: 'gl', label: 'Read general ledger', detail: '12,408 rows', state: 'done' },
          { id: 'inv', label: 'Joined carrier invoices', detail: '3,911 rows', state: 'done' },
          { id: 'dec', label: 'Decomposing the change', detail: '2.1 s', state: 'running' },
          { id: 'sum', label: 'Write summary', state: 'pending' },
        ]),
      },
      {
        caption: 'Done · folded into the method',
        turn: record('done', 'done', {
          preset: 'trace',
          folded: true,
          summary: '4.2 s · 16,319 rows',
          steps: [
            { id: 'gl', label: 'Read general ledger', detail: '12,408 rows', state: 'done' },
            { id: 'inv', label: 'Joined carrier invoices', detail: '3,911 rows', state: 'done' },
            { id: 'dec', label: 'Decomposed the change', detail: '2.1 s', state: 'done' },
            { id: 'sum', label: 'Wrote summary', state: 'done' },
          ],
        }),
      },
      {
        caption: 'A step failed',
        turn: record('failed', 'stopped', {
          preset: 'trace',
          steps: [
            { id: 'gl', label: 'Read general ledger', detail: '12,408 rows', state: 'done' },
            {
              id: 'inv',
              label: 'Join carrier invoices',
              detail: '0.3 s',
              state: 'failed',
              error: 'The invoices file has no order_id column.',
            },
            { id: 'dec', label: 'Decompose the change', state: 'pending' },
          ],
          actions: [
            { id: 'skip', label: 'Skip this step', variant: 'ghost', push: true },
            { id: 'retry', label: 'Retry', variant: 'primary' },
          ],
        }),
      },
      {
        caption: 'Waiting on you',
        turn: record('waiting', 'paused', {
          preset: 'trace',
          steps: [
            { id: 'gl', label: 'Read general ledger', detail: '12,408 rows', state: 'done' },
            { id: 'ask', label: 'Which margin did you mean?', detail: 'your turn', state: 'waiting' },
            { id: 'dec', label: 'Decompose the change', state: 'pending' },
          ],
        }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: running('narrow', [
          { id: 'gl', label: 'Read general ledger', detail: '12,408', state: 'done' },
          { id: 'inv', label: 'Joined invoices', detail: '3,911', state: 'done' },
          { id: 'dec', label: 'Decomposing', detail: '2.1 s', state: 'running' },
          { id: 'sum', label: 'Write summary', state: 'pending' },
        ]),
      },
    ],
  },
};
