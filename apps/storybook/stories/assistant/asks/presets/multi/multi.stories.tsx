import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AskSpec, AskTurn, StageId } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Asks/Presets/Multi',
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

const channels = [
  { value: 'stores', label: 'Stores', detail: '188' },
  { value: 'online', label: 'Online', detail: '1' },
  { value: 'wholesale', label: 'Wholesale', detail: '25' },
];

/** Icons as the path data of 16×16 stroked icons: a database, a pedigree, a marker panel. */
const DATABASE = 'M3 4a5 2 0 1 0 10 0a5 2 0 1 0-10 0M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2';
const PEDIGREE =
  'M6.2 3.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M1.7 12.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M10.7 12.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M8 5.3v3M8 8.3L4.5 11M8 8.3l3.5 2.7';
const MARKERS = 'M3 2v12M13 2v12M3 5h10M3 8h10M3 11h10';

/** The Multiple choice board of the Design Kit Spec, variant for variant. */
export const MultipleChoice: Story = {
  name: 'Multiple choice',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Plain · count on the right',
        turn: ask('plain', 'scope', {
          preset: 'multi',
          question: 'Which channels should I include?',
          options: channels,
          default: ['stores', 'online'],
        }),
      },
      {
        caption: 'Heading + description · at most 3',
        turn: ask('max', 'analyse', {
          preset: 'multi',
          question: 'Which inputs should the scenario hold fixed?',
          description: 'Pick up to three. The rest move with price.',
          options: [
            { value: 'price', label: 'Price' },
            { value: 'promotions', label: 'Promotions' },
            { value: 'stores', label: 'Store count' },
            { value: 'competitor', label: 'Competitor price' },
          ],
          default: ['promotions', 'stores'],
          max: 3,
          submit: 'Hold {count} fixed',
        }),
      },
      {
        caption: 'Phrase question · title + figure',
        turn: ask('phrase', 'analyse', {
          preset: 'multi',
          question: 'Adjust for',
          description: 'Confounders to control in the model.',
          selectAll: true,
          options: [
            { value: 'age', label: 'Age', description: 'Banded in 10-year steps', figure: { value: '0.31', unit: 'SMD' } },
            { value: 'deprivation', label: 'Deprivation', description: 'IMD quintile', figure: { value: '0.22', unit: 'SMD' } },
            { value: 'comorbidity', label: 'Comorbidity', description: 'Charlson index', figure: { value: '0.18', unit: 'SMD' } },
            { value: 'rurality', label: 'Rurality', description: 'Urban–rural class', figure: { value: '0.04', unit: 'SMD' } },
          ],
          default: ['age', 'deprivation', 'comorbidity'],
        }),
      },
      {
        caption: 'Leading icon + figure on the right',
        turn: ask('icon', 'scope', {
          preset: 'multi',
          question: 'Which sources should I search?',
          heading: true,
          options: [
            { value: 'trials', label: 'Trial database', icon: DATABASE, description: '2022–2025 seasons', figure: { value: '1,284', unit: 'plots' } },
            { value: 'pedigree', label: 'Pedigree registry', icon: PEDIGREE, description: 'Parent lines', figure: { value: '42', unit: 'pedigrees' } },
            { value: 'markers', label: 'Marker panel', icon: MARKERS, description: 'Updated Jul 2025', figure: { value: '14 mo', unit: 'old', tone: 'warn' } },
          ],
          default: ['trials', 'pedigree'],
          submit: 'Search {count} sources',
        }),
      },
      {
        caption: 'Limit reached',
        turn: ask('limit', 'analyse', {
          preset: 'multi',
          question: 'Which crosses should I simulate?',
          description: 'Up to two, to keep the run short.',
          options: [
            { value: 'BV-112xLR-31', label: 'BV-112 × LR-31' },
            { value: 'BV-112xLR-08', label: 'BV-112 × LR-08' },
            { value: 'BV-207xBV-150', label: 'BV-207 × BV-150' },
          ],
          default: ['BV-112xLR-31', 'BV-112xLR-08'],
          max: 2,
          submit: 'Simulate {count}',
        }),
      },
      {
        caption: 'Answered',
        now: Date.parse('2026-09-29T10:00:45Z'),
        turn: ask(
          'answered',
          'scope',
          { preset: 'multi', question: 'Which channels should I include?', label: 'Channels', options: channels },
          { state: 'answered', value: ['stores', 'online'], answeredAt: '2026-09-29T10:00:20Z' },
        ),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: ask('narrow', 'scope', {
          preset: 'multi',
          question: 'Which channels should I include?',
          options: channels,
          default: ['stores', 'online'],
        }),
      },
    ],
  },
};
