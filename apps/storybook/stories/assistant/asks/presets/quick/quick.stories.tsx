import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AskSpec, AskTurn, StageId } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Asks/Presets/Quick',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ask = (id: string, stage: StageId, spec: AskSpec, settled?: Partial<AskTurn>): AskTurn => ({
  id,
  role: 'assistant',
  kind: 'ask',
  stage,
  state: 'pending',
  ask: spec,
  ...settled,
});

const trend = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];
const confidence = [
  { value: '90', label: '90%' },
  { value: '95', label: '95%' },
  { value: '99', label: '99%' },
];

/** Two rows in one card: the trend's granularity, then the confidence level. */
const twoPicks: AskSpec = {
  preset: 'quick',
  question: 'Show the trend by',
  label: 'Trend by',
  options: trend,
  default: 'week',
  hint: 'Week gives 26 points over the window',
  more: [{ id: 'confidence', question: 'Confidence level', label: 'Confidence', options: confidence, default: '95' }],
};

/** The Quick pick board of the Assistant Presets canvas, variant for variant. */
export const QuickPick: Story = {
  name: 'Quick pick',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Two picks · default set', turn: ask('two', 'scope', twoPicks) },
      {
        caption: 'Heading + description · no default',
        turn: ask('none', 'act', {
          preset: 'quick',
          question: 'How should I return the result?',
          description: 'Nothing is picked until you choose.',
          options: [
            { value: 'table', label: 'Table' },
            { value: 'chart', label: 'Chart' },
            { value: 'both', label: 'Both' },
          ],
        }),
      },
      {
        caption: 'Options with a sub-label',
        turn: ask('sub', 'analyse', {
          preset: 'quick',
          question: 'Confidence level',
          heading: true,
          stretch: true,
          options: [
            { value: '90', label: '90%', sub: '±1.2 pp' },
            { value: '95', label: '95%', sub: '±1.4 pp' },
            { value: '99', label: '99%', sub: '±1.9 pp' },
          ],
          default: '95',
          hint: 'Width of the interval on the lift estimate',
        }),
      },
      {
        caption: 'Five options · full width',
        turn: ask('five', 'scope', {
          preset: 'quick',
          question: 'Show the trend by',
          stretch: true,
          options: [...trend, { value: 'quarter', label: 'Quarter' }, { value: 'year', label: 'Year' }],
          default: 'week',
          hint: 'Week gives 26 points over the window',
        }),
      },
      {
        caption: 'Answered',
        now: Date.parse('2026-09-29T10:00:45Z'),
        turn: ask('answered', 'scope', twoPicks, {
          state: 'answered',
          value: { 'Trend by': 'week', confidence: '95' },
          answeredAt: '2026-09-29T10:00:20Z',
        }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: ask('narrow', 'scope', {
          preset: 'quick',
          question: 'Show the trend by',
          stretch: true,
          options: trend,
          default: 'week',
          hint: 'Week gives 26 points',
        }),
      },
    ],
  },
};
