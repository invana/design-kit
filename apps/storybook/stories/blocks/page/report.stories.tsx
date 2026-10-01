import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Page, type PageSpec } from '@invana/blocks';

const meta: Meta<typeof Page> = {
  title: 'Blocks/Page',
  component: Page,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const report: PageSpec = {
  title: 'Top accounts that raised a round',
  description: 'The top 50 accounts by ARR, last 90 days, Q3 against Q2.',
  sections: [
    {
      blocks: [
        {
          kind: 'narrative',
          text: '**9 of the top 50** raised in the last 90 days, and their Q3 revenue rose **▲ 6%** on Q2. Acme led at +11%.',
        },
        {
          kind: 'grid',
          tiles: [
            { label: 'Raised', value: 9, delta: 'of 50' },
            { label: 'Q3 revenue', value: '+6%', delta: '▲ vs Q2', tone: 'good' },
            { label: 'Median round', value: '$42M', delta: 'Series B' },
          ],
        },
      ],
    },
    {
      title: 'Rounds by week',
      blocks: [
        {
          kind: 'timeseries',
          unit: 'rounds',
          series: [
            {
              name: 'Rounds closed',
              points: [['W1', 0], ['W2', 1], ['W3', 0], ['W4', 1], ['W5', 2], ['W6', 1], ['W7', 3], ['W8', 4], ['W9', 2]],
            },
          ],
          marks: [{ at: 'W8', tone: 'good' }],
        },
      ],
    },
    {
      title: 'The accounts',
      description: 'Ordered by Q3 revenue change.',
      blocks: [
        {
          kind: 'table',
          columns: [
            { key: 'account', label: 'Account' },
            { key: 'round', label: 'Round' },
            { key: 'change', label: 'Q3 vs Q2', align: 'right' },
          ],
          rows: [
            { account: 'Acme Robotics', round: 'Series C · $90M', change: { value: '+11%', tone: 'good' } },
            { account: 'Initech', round: 'Series B · $40M', change: { value: '+8%', tone: 'good' } },
            { account: 'Northwind', round: 'Series B · $42M', change: { value: '+4%', tone: 'good' } },
            { account: 'Globex', round: 'Series B · $38M', change: { value: '−2%', tone: 'bad' } },
          ],
          total: 9,
          noun: 'accounts',
          sort: { key: 'change', dir: 'desc' },
        },
        {
          kind: 'ranked',
          items: [
            { label: 'Acme Robotics', value: 11, display: '+11%' },
            { label: 'Initech', value: 8, display: '+8%' },
            { label: 'Northwind', value: 4, display: '+4%' },
            { label: 'Globex', value: -2, display: '−2%' },
          ],
        },
      ],
    },
  ],
};

/**
 * Blocks laid out as a document: no cards and no borders, a section's title as
 * its rule. Every block here is the same JSON a conversation turn or a
 * dashboard panel draws. Edit `spec` in the controls to change the page.
 */
export const Report: Story = {
  args: { spec: report, onAction: fn(), style: { maxWidth: 720 } },
};
