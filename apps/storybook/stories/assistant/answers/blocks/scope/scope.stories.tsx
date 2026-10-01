import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Scope',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const scope = (id: string, block: BlockSpec): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'scope',
  blocks: [block],
});

/**
 * Period, comparison, filters, population and freshness, as the query applied them. A part is
 * changed where it is read — typed, or picked from its choices — and sent as a `scope` event. A
 * part carried from an earlier question and changed since is marked, as is one resting on late data.
 */
export const ScopeLine: Story = {
  name: 'Scope line',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Editable in place',
        turn: scope('editable', {
          kind: 'scope',
          parts: ['Q3 2026', 'vs Q2', 'Stores, Online', '214 stores', 'as of 06:00'],
          hint: 'Click any part to change it and re-run',
        }),
      },
      {
        caption: 'Carried, one part changed',
        turn: scope('carried', {
          kind: 'scope',
          parts: ['Q3 2026', { text: 'vs Q3 2025', mark: 'changed' }, 'Stores, Online', '214 stores', 'as of 06:00'],
          hint: 'Carried from your first question · baseline changed',
        }),
      },
      {
        caption: 'A part opened',
        turn: scope('opened', {
          kind: 'scope',
          parts: [
            'Q3 2026',
            'vs Q2',
            {
              text: 'Stores, Online',
              choices: [
                { value: 'stores-online', label: 'Stores, Online', detail: '2 of 3' },
                { value: 'stores', label: 'Stores only', detail: '188' },
                { value: 'all', label: 'All channels', detail: '3 of 3' },
              ],
            },
            '214 stores',
          ],
          openPart: 2,
        }),
      },
      {
        caption: 'Stale data',
        turn: scope('stale', {
          kind: 'scope',
          parts: ['Q3 2026', 'vs Q2', '214 stores', { text: 'as of 25 Sep', mark: 'stale' }],
          hint: "The ledger hasn't loaded for 4 days. Figures may move.",
        }),
      },
      {
        caption: 'At 280px · wraps',
        narrow: true,
        turn: scope('narrow', {
          kind: 'scope',
          parts: ['Q3 2026', 'vs Q2', 'Stores, Online', '214 stores', 'North region', 'as of 06:00'],
        }),
      },
    ],
  },
};
