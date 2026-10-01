import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import type { AskSpec, AskTurn, StageId } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Asks/Blocks/Single',
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

const margins = [
  { value: 'op', label: 'Operating margin', detail: 'fin.op_margin' },
  { value: 'gross', label: 'Gross margin', detail: 'fin.gross_margin' },
  { value: 'contrib', label: 'Contribution margin', detail: 'fin.contrib' },
];

/** A store, as the path data of a 16×16 stroked icon. */
const STORE = 'M2 6.5h12M3 6.5V14h10V6.5M2 6.5l1.5-4h9l1.5 4M6.5 14v-4h3v4';

const OTHER = 'With an “Other…” answer';

/** The board cell a caption heads: up from the caption to the element holding its ask card. */
const cellOf = (canvasElement: HTMLElement, caption: string) => {
  let el: HTMLElement | null = within(canvasElement).getByText(caption);
  while (el && !el.querySelector('[data-state]')) el = el.parentElement;
  return within(el ?? canvasElement);
};

/** The Single choice board of the Design Kit Spec, variant for variant. */
export const SingleChoice: Story = {
  name: 'Single choice',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Plain · source on the right',
        turn: ask('plain', 'frame', { kind: 'single', question: 'Which margin did you mean?', options: margins, default: 'op' }, { waiting: 'parked 1 min' }),
      },
      {
        caption: 'Heading + description',
        turn: ask('heading', 'scope', {
          kind: 'single',
          question: 'Which environment is the new line for?',
          description: 'Sets which trial sites the analysis reads.',
          options: [
            { value: 'semi-arid', label: 'Semi-arid, under 400 mm', detail: '3 sites' },
            { value: 'rainfed', label: 'Rainfed, 400–700 mm', detail: '2 sites' },
            { value: 'irrigated', label: 'Irrigated', detail: '1 site' },
          ],
          default: 'semi-arid',
          submit: 'Next',
          skippable: true,
        }),
      },
      {
        caption: 'Description only + default',
        turn: ask('default', 'frame', {
          kind: 'single',
          question: 'The desk report counts P&L as mark-to-market plus realised. Should I explain the same figure?',
          options: [
            { value: 'total', label: 'Total, as the desk report', detail: 'pnl.total' },
            { value: 'mtm', label: 'Mark-to-market only', detail: 'pnl.mtm' },
            { value: 'realised', label: 'Realised only', detail: 'pnl.realised' },
          ],
          default: 'total',
          hint: 'Default: total · `Enter` accepts',
        }),
      },
      {
        caption: 'Title + description options',
        turn: ask('rich', 'frame', {
          kind: 'single',
          question: 'Compare against which baseline?',
          heading: true,
          options: [
            { value: 'ly', label: 'Same week last year', description: 'Adjusts for seasonality' },
            { value: 'avg4', label: 'Trailing 4-week average', description: 'Smooths one-off spikes' },
            { value: 'model', label: 'Model portfolio', description: 'Isolates stock picking from market moves' },
            { value: 'budget', label: 'Budget', description: 'Not loaded for 2026', disabled: true },
          ],
          default: 'ly',
        }),
      },
      {
        caption: 'Leading tag + figure on the right',
        turn: ask('tag', 'scope', {
          kind: 'single',
          question: 'Which variety is the yield benchmark?',
          heading: true,
          options: [
            { value: 'BV-112', label: 'BV-112', lead: 'BV', description: 'High yield, drought 4', figure: { value: '2,480', unit: 'kg/ha' } },
            { value: 'BV-207', label: 'BV-207', lead: 'BV', description: 'Longest pods, rust 3', figure: { value: '2,210', unit: 'kg/ha' } },
            { value: 'LR-31', label: 'LR-31', lead: 'LR', description: 'Landrace, drought 9', figure: { value: '1,720', unit: 'kg/ha' } },
          ],
          default: 'BV-112',
        }),
      },
      {
        caption: 'Leading icon + change on the right',
        turn: ask('icon', 'explain', {
          kind: 'single',
          question: 'Which store should I drill into?',
          description: 'The three largest falls in weekly sales.',
          options: [
            { value: 'leeds', label: 'Leeds Kirkstall', icon: STORE, description: 'North · 4,200 m²', figure: { value: '−8.4%', unit: 'vs LY', tone: 'bad' } },
            { value: 'manchester', label: 'Manchester Arndale', icon: STORE, description: 'North · 6,800 m²', figure: { value: '−5.1%', unit: 'vs LY', tone: 'bad' } },
            { value: 'york', label: 'York Monks Cross', icon: STORE, description: 'North · 3,100 m²', figure: { value: '−3.9%', unit: 'vs LY', tone: 'bad' } },
          ],
          default: 'leeds',
        }),
      },
      {
        caption: OTHER,
        turn: ask('other', 'frame', { kind: 'single', question: 'Which margin did you mean?', options: margins.slice(0, 2), other: true }),
      },
      {
        caption: 'Answered',
        now: Date.parse('2026-09-29T10:00:45Z'),
        turn: ask(
          'answered',
          'frame',
          { kind: 'single', question: 'Which margin did you mean?', label: 'Margin', options: margins, default: 'op' },
          { state: 'answered', value: 'op', answeredAt: '2026-09-29T10:00:20Z' },
        ),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: ask('narrow', 'frame', { kind: 'single', question: 'Which margin did you mean?', options: margins, default: 'op' }),
      },
    ],
  },
  /** The Other… variant is a state the analyst reaches: pick Other…, then type. */
  play: async ({ canvasElement }) => {
    const cell = cellOf(canvasElement, OTHER);
    await userEvent.click(cell.getByText('Other…'));
    await userEvent.type(cell.getByRole('textbox', { name: 'Your answer' }), 'Net margin after supplier rebates');
  },
};
