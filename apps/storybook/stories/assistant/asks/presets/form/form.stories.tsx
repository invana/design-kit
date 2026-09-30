import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import type { AskSpec, AskTurn, FormOptions } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Asks/Presets/Form',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ask = (id: string, spec: AskSpec, settled?: Partial<AskTurn>): AskTurn => ({
  id,
  role: 'assistant',
  kind: 'ask',
  stage: 'analyse',
  state: 'pending',
  ask: spec,
  ...settled,
});

type Field = FormOptions['fields'][number];
const price: Field = { name: 'price', label: 'Price change', type: 'number', unit: '%', default: -5 };
const elasticity: Field = { name: 'elasticity', label: 'Elasticity', type: 'number', default: 1.3, above: 0 };
const starts: Field = { name: 'starts', label: 'Starts', type: 'date', default: '1 Nov 2026' };

const ERROR = 'A field in error';

/** The board cell a caption heads: up from the caption to the element holding its ask card. */
const cellOf = (canvasElement: HTMLElement, caption: string) => {
  let el: HTMLElement | null = within(canvasElement).getByText(caption);
  while (el && !el.querySelector('[data-state]')) el = el.parentElement;
  return within(el ?? canvasElement);
};

/** The Form board of the Assistant Presets canvas, variant for variant. */
export const Form: Story = {
  name: 'Form',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Labels left',
        turn: ask('side', { preset: 'form', question: 'Scenario inputs', fields: [price, elasticity, starts], submit: 'Run scenario' }),
      },
      {
        caption: 'Heading + description · labels on top',
        turn: ask('top', {
          preset: 'form',
          question: 'Scenario inputs',
          description: 'These only make sense together, so I ask them together.',
          labels: 'top',
          fields: [price, { ...elasticity, hint: "From last year's promotions" }, starts],
          submit: 'Run scenario',
        }),
      },
      {
        caption: ERROR,
        turn: ask('error', {
          preset: 'form',
          question: 'Scenario inputs',
          heading: true,
          labels: 'top',
          fields: [price, elasticity, starts],
          submit: 'Run scenario',
        }),
      },
      {
        caption: 'Grouped fields',
        turn: ask('grouped', {
          preset: 'form',
          question: 'Scenario inputs',
          heading: true,
          labels: 'top',
          fields: [
            { ...price, label: 'Change', group: 'Price' },
            { ...elasticity, group: 'Price' },
            { ...starts, group: 'Timing' },
            { name: 'weeks', label: 'Runs for', type: 'number', unit: 'weeks', default: 8, group: 'Timing' },
          ],
          submit: 'Run scenario',
        }),
      },
      {
        caption: 'Answered',
        now: Date.parse('2026-09-29T10:00:45Z'),
        turn: ask(
          'answered',
          { preset: 'form', question: 'Scenario inputs', fields: [price, elasticity, starts], submit: 'Run scenario' },
          { state: 'answered', value: { price: -5, elasticity: 1.3, starts: '1 Nov 2026' }, answeredAt: '2026-09-29T10:00:20Z' },
        ),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: ask('narrow', {
          preset: 'form',
          question: 'Scenario inputs',
          heading: true,
          labels: 'top',
          fields: [price, elasticity, starts],
          submit: 'Run scenario',
        }),
      },
    ],
  },
  /** The error is a state the analyst reaches: an elasticity of 0 is below its bound. */
  play: async ({ canvasElement }) => {
    const cell = cellOf(canvasElement, ERROR);
    const input = cell.getByRole('spinbutton', { name: 'Elasticity' });
    await userEvent.tripleClick(input);
    await userEvent.keyboard('0');
    input.blur();
  },
};
