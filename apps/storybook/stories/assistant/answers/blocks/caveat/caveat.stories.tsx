import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Caveat',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const caveats = (id: string, blocks: BlockSpec[]): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'caveat',
  blocks,
});

const indicative = {
  label: 'indicative',
  text: 'Based on 38 of 42 stores. Four with incomplete September data are excluded.',
};
const association = {
  label: 'association',
  text: 'Delivery speed moves with repeat rate, but this does not show it causes it.',
};

/**
 * What was excluded, imputed or assumed, labelled with its kind. A caveat about rows links to
 * them; `info` says what was filled in, `bad` what is wrong with the data; several fold behind one
 * line. An answer's envelope caveats draw with this same block, under the figures.
 */
export const Caveat: Story = {
  name: 'Caveat',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Labelled caveats',
        turn: caveats('labelled', [
          { kind: 'caveat', ...indicative },
          { kind: 'caveat', ...association },
        ]),
      },
      {
        caption: 'With the excluded rows',
        turn: caveats('excluded', [
          {
            kind: 'caveat',
            label: 'excluded',
            text: '4 stores with incomplete September data.',
            action: { id: 'show-excluded', label: 'Show the 4 stores' },
          },
        ]),
      },
      {
        caption: 'Three tones',
        turn: caveats('tones', [
          { kind: 'caveat', label: 'imputed', text: 'Two missing weeks filled from the regional average.', tone: 'info' },
          { kind: 'caveat', label: 'indicative', text: 'North rests on 9 stores. Treat it as a direction, not a figure.' },
          { kind: 'caveat', label: 'stale', text: 'The ledger last loaded on 25 Sep.', tone: 'bad' },
        ]),
      },
      {
        caption: 'Folded',
        turn: caveats('folded', [{ kind: 'caveat', items: [indicative, association], folded: true }]),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: caveats('narrow', [
          { kind: 'caveat', ...indicative },
          { kind: 'caveat', ...association },
        ]),
      },
    ],
  },
};
