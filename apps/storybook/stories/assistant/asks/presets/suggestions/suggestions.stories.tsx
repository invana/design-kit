import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AskSpec, AskTurn } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Asks/Presets/Suggestions',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const next = (id: string, spec: AskSpec, settled?: Partial<AskTurn>): AskTurn => ({
  id,
  role: 'assistant',
  kind: 'ask',
  stage: 'explain',
  state: 'pending',
  ask: spec,
  ...settled,
});

const items = ['Break freight down by carrier', 'Compare with Q3 last year', 'Alert me if it gets worse'];

/**
 * Follow-ups after an answer, each reusing the current scope. Picking one is the ask's `reply`,
 * which the API sends on as the next prompt (see the Actions panel). They run along a line, stack
 * one per line, or sit under headings; answered, the one picked stays, dimmed.
 */
export const Suggestions: Story = {
  name: 'Suggestions',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Chips', turn: next('chips', { preset: 'suggestions', items }) },
      { caption: 'Stacked · for narrow widths', turn: next('stacked', { preset: 'suggestions', items, layout: 'stack' }) },
      {
        caption: 'Grouped',
        turn: next('grouped', {
          preset: 'suggestions',
          groups: [
            { label: 'Go deeper', items: ['Break freight down by carrier', 'Which stores drove it?'] },
            { label: 'Act', items: ['Alert me if it gets worse', 'Send this to the North team'] },
          ],
        }),
      },
      {
        caption: 'One already sent',
        turn: next('sent', { preset: 'suggestions', items }, { state: 'answered', value: 'Break freight down by carrier' }),
      },
    ],
  },
};
