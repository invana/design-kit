import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Narrative',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const prose = (
  id: string,
  block: BlockSpec,
  state: AnswerTurn['state'] = 'complete',
  extra: Partial<AnswerTurn> = {},
): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state,
  label: 'prose',
  blocks: [block],
  ...extra,
});

const lead =
  'Operating margin fell **1.8 pts** to **14.2%** in Q3. About two thirds of the fall came from freight costs in the North region, which rose after the July carrier change.';

/**
 * The answer in two or three sentences, leading with the number. `**…**` marks a figure, `[n]`
 * places a source's marker where its clause ends, and a figure led by ▲ or ▼ takes its direction's
 * tone. While the answer is written a caret ends the text.
 */
export const Narrative: Story = {
  name: 'Narrative',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Lead with the number', turn: prose('lead', { preset: 'narrative', text: lead }) },
      {
        caption: 'With citation markers',
        turn: prose('cites', {
          preset: 'narrative',
          text: 'Operating margin fell **1.8 pts** to **14.2%** in Q3.[1] Freight per order rose 22% after the July carrier change,[2] and the North region carried most of it.[3]',
        }, 'complete', { aside: '3 sources' }),
      },
      {
        caption: 'Figures carry their direction',
        turn: prose('direction', {
          preset: 'narrative',
          text: 'Operating margin fell **▼ 1.8 pts** to **14.2%**. Gross margin held at **38.1%** ▲ 0.1 pts, so the fall sits below the gross line, in freight.',
        }),
      },
      {
        caption: 'Streaming',
        turn: prose(
          'streaming',
          {
            preset: 'narrative',
            text: 'Operating margin fell **1.8 pts** to **14.2%** in Q3. About two thirds of the fall came from',
          },
          'running',
        ),
      },
      { caption: 'Loading', turn: prose('loading', { preset: 'narrative', text: '', status: 'loading' }) },
      { caption: 'At 280px', narrow: true, turn: prose('narrow', { preset: 'narrative', text: lead }) },
    ],
  },
};
