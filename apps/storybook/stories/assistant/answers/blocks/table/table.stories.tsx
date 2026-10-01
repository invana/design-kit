import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec, Column } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Table',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const answer = (id: string, block: BlockSpec, extra?: Partial<AnswerTurn>): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'table',
  blocks: [block],
  ...extra,
});

const cited = (records: number, noun = 'records') => ({ envelope: { grounding: { records, noun } } });

const margin: Column[] = [
  { key: 'store', label: 'Store' },
  { key: 'margin', label: 'Margin', align: 'right' },
  { key: 'delta', label: 'Δ pts', align: 'right' },
];

const down = (value: string) => ({ value, tone: 'bad' as const });
const up = (value: string) => ({ value, tone: 'good' as const });

const firstThree = [
  { store: 'North Mall', margin: '11.4%', delta: down('−3.1') },
  { store: 'Northgate', margin: '12.0%', delta: down('−2.6') },
  { store: 'Riverside', margin: '15.8%', delta: up('+0.4') },
];

/** The Table preview board on the Design Kit Spec, variant for variant. */
export const TablePreview: Story = {
  name: 'Table preview',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'First rows + open all',
        turn: answer('t1', { preset: 'table', columns: margin, rows: firstThree, total: 214 }, cited(214)),
      },
      {
        caption: 'Sorted · row called out',
        turn: answer(
          't2',
          {
            preset: 'table',
            columns: margin,
            rows: [
              { store: 'North Mall', margin: '11.4%', delta: down('−3.1') },
              { store: 'Northgate', margin: '12.0%', delta: down('−2.6') },
              { store: 'Leeds Kirkstall', margin: '12.9%', delta: down('−2.2') },
              { store: 'York Monks Cross', margin: '13.3%', delta: down('−1.9') },
              { store: 'Hull Ferensway', margin: '13.8%', delta: down('−1.4') },
            ],
            total: 214,
            note: 'sorted by Δ',
            sort: { key: 'delta', dir: 'asc' },
            highlight: [0],
          },
          { title: 'worst 5 by change', ...cited(214) },
        ),
      },
      {
        caption: 'Wide · scrolls sideways',
        turn: answer(
          't3',
          {
            preset: 'table',
            columns: [
              { key: 'store', label: 'Store' },
              { key: 'revenue', label: 'Revenue', align: 'right' },
              { key: 'orders', label: 'Orders', align: 'right' },
              { key: 'aov', label: 'AOV', align: 'right' },
              { key: 'margin', label: 'Margin', align: 'right' },
              { key: 'freight', label: 'Freight', align: 'right' },
              { key: 'delta', label: 'Δ pts', align: 'right' },
            ],
            rows: [
              { store: 'North Mall', revenue: '£412k', orders: '6,110', aov: '£67', margin: '11.4%', freight: '7.9%', delta: down('−3.1') },
              { store: 'Northgate', revenue: '£388k', orders: '5,720', aov: '£68', margin: '12.0%', freight: '7.6%', delta: down('−2.6') },
              { store: 'Riverside', revenue: '£351k', orders: '5,390', aov: '£65', margin: '15.8%', freight: '5.8%', delta: up('+0.4') },
            ],
            total: 214,
            note: '7 columns',
          },
          cited(214),
        ),
      },
      {
        caption: 'With a total row',
        turn: answer(
          't4',
          {
            preset: 'table',
            columns: [
              { key: 'region', label: 'Region' },
              { key: 'revenue', label: 'Revenue', align: 'right' },
              { key: 'margin', label: 'Margin', align: 'right' },
            ],
            rows: [
              { region: 'North', revenue: '£0.9M', margin: '11.1%' },
              { region: 'Midlands', revenue: '£1.2M', margin: '13.9%' },
              { region: 'South', revenue: '£2.0M', margin: '14.5%' },
            ],
            totals: { region: 'All', revenue: '£4.1M', margin: '13.6%' },
            caption: 'Margin total is computed from the rows, not averaged',
          },
          { title: 'by region' },
        ),
      },
      {
        caption: 'No rows',
        turn: answer(
          't5',
          {
            preset: 'table',
            columns: margin,
            rows: [],
            status: 'empty',
            emptyText: 'No stores lost more than 5 pts of margin.',
            emptySuggestions: ['Lower the threshold to 3 pts'],
          },
          cited(0),
        ),
      },
      {
        caption: 'Loading',
        turn: answer('t6', { preset: 'table', columns: margin, rows: [], status: 'loading' }, { state: 'running' }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: answer('t7', { preset: 'table', columns: margin, rows: firstThree, total: 214 }, cited(214, '')),
      },
    ],
  },
};
