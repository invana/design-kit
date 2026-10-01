import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import type { AskTurn, MultistepOptions } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Asks/Presets/Multistep',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

type Step = MultistepOptions['steps'][number];

const environment: Step = {
  id: 'environment',
  preset: 'single',
  label: 'Environment',
  question: 'Which environment is the new line for?',
  description: 'Sets which trial sites the analysis reads.',
  options: [
    { value: 'semi-arid', label: 'Semi-arid', description: 'Under 400 mm rainfall', figure: { value: '3', unit: 'sites' }, summary: 'Semi-arid, 3 sites' },
    { value: 'rainfed', label: 'Rainfed', description: '400–700 mm rainfall', figure: { value: '2', unit: 'sites' }, summary: 'Rainfed, 2 sites' },
    { value: 'irrigated', label: 'Irrigated', description: 'Any rainfall', figure: { value: '1', unit: 'site' }, summary: 'Irrigated, 1 site' },
  ],
  default: 'semi-arid',
};
const yieldFloor: Step = {
  id: 'yield',
  preset: 'number',
  label: 'Yield floor',
  question: 'Yield floor',
  description: 'Lines below this are dropped from the shortlist.',
  unit: 'kg/ha',
  default: 2200,
  hint: "Last season's goal: **2,100**",
};
const mustKeep: Step = {
  id: 'keep',
  preset: 'multi',
  label: 'Must keep',
  question: 'Traits the new line must keep',
  options: [
    { value: 'rust', label: 'Rust score', detail: '≥ 6', summary: 'Rust ≥ 6' },
    { value: 'maturity', label: 'Maturity', detail: '≤ 115 d', summary: 'maturity ≤ 115 d' },
    { value: 'pod', label: 'Pod length', detail: '≥ 28 mm', summary: 'pod ≥ 28 mm' },
  ],
  default: ['rust', 'maturity'],
};

const ask = (id: string, options: MultistepOptions, settled?: Partial<AskTurn>): AskTurn => ({
  id,
  role: 'assistant',
  kind: 'ask',
  stage: 'scope',
  state: 'pending',
  ask: { preset: 'multistep', ...options },
  ...settled,
});

const flow: MultistepOptions = { steps: [environment, yieldFloor, mustKeep], review: true };

const STEP_2 = 'Step 2 · number with a unit';
const STEP_3 = 'Step 3 · multiple choice';
const REVIEW = 'Review before submit';
const NARROW = 'At 280px';

/** The board cell a caption heads: up from the caption to the element holding its ask card. */
const cellOf = (canvasElement: HTMLElement, caption: string) => {
  let el: HTMLElement | null = within(canvasElement).getByText(caption);
  while (el && !el.querySelector('[data-state]')) el = el.parentElement;
  return within(el ?? canvasElement);
};

/** The Multi-step board of the Design Kit Spec, variant for variant. */
export const MultiStep: Story = {
  name: 'Multi-step',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Step 1 · single choice, rich options', turn: ask('step1', flow) },
      { caption: STEP_2, turn: ask('step2', flow) },
      { caption: STEP_3, turn: ask('step3', flow) },
      { caption: REVIEW, turn: ask('review', flow) },
      {
        caption: 'Required step unanswered',
        turn: ask('required', {
          ...flow,
          steps: [
            {
              ...environment,
              required: true,
              default: undefined,
              options: [
                { value: 'semi-arid', label: 'Semi-arid', detail: '3 sites' },
                { value: 'rainfed', label: 'Rainfed', detail: '2 sites' },
                { value: 'irrigated', label: 'Irrigated', detail: '1 site' },
              ],
            } as Step,
            yieldFloor,
            mustKeep,
          ],
        }),
      },
      {
        caption: 'Answered',
        now: Date.parse('2026-09-29T10:00:45Z'),
        turn: ask('answered', flow, {
          state: 'answered',
          value: { environment: 'semi-arid', yield: 2200, keep: ['rust', 'maturity'] },
          answeredAt: '2026-09-29T10:00:20Z',
        }),
      },
      {
        caption: NARROW,
        narrow: true,
        turn: ask('narrow', { ...flow, steps: [environment, { ...yieldFloor, description: undefined, required: true, hint: 'Last season: **2,100**' } as Step, mustKeep] }),
      },
    ],
  },
  /** Steps 2, 3 and the review are places the analyst reaches: walk each cell there. */
  play: async ({ canvasElement }) => {
    const cell = (caption: string) => cellOf(canvasElement, caption);
    const next = async (caption: string, times: number) => {
      for (let i = 0; i < times; i += 1) await userEvent.click(cell(caption).getByRole('button', { name: 'Next' }));
    };
    await next(STEP_2, 1);
    await next(STEP_3, 2);
    await next(REVIEW, 2);
    await userEvent.click(cell(REVIEW).getByRole('button', { name: 'Review' }));
    await next(NARROW, 1);
  },
};
