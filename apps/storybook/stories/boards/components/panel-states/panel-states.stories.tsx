import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Board, type BoardSpec } from '@invana/boards';

/**
 * What a panel says about itself, beside its data:
 *
 * - `footer` — one muted line under it: when its data was read, where, how long.
 * - `mark` — `added` or `changed`: a follow-up just put it there or rewrote it. A chip in the
 *   header and an accent edge, until the host clears it.
 * - `reading` — its data is on its way: skeleton lines, and no renderer mounted yet. In a `fill`
 *   row the skeleton takes the row's height.
 */
const SPEC: BoardSpec = {
  header: { crumbs: ['Busiest airports in Europe'] },
  rows: [
    {
      panels: [
        {
          id: 'read',
          kind: 'text',
          title: 'What it shows',
          footer: '10:42 · EU · H1 2026 · 41 ms',
          options: { text: 'Istanbul has the most routes out of any airport in this World.' },
        },
        {
          id: 'added',
          kind: 'text',
          title: 'Routes out of DUB by country',
          mark: 'added',
          footer: '10:44 · EU · H1 2026 · 38 ms',
          options: { text: 'A follow-up added this panel.' },
        },
        {
          id: 'changed',
          kind: 'text',
          title: 'What it shows, rewritten',
          mark: 'changed',
          footer: '10:44 · EU · H1 2026 · 12 ms',
          options: { text: 'A follow-up changed this panel.' },
        },
      ],
    },
    {
      panels: [
        { id: 'reading', kind: 'text', title: 'Most routes out', reading: true, footer: 'Reading…', options: { text: '' } },
      ],
    },
    {
      fill: true,
      panels: [
        { id: 'reading-fill', kind: 'text', title: 'The ten and the routes between them', reading: true, footer: 'Reading…', options: { text: '' } },
      ],
    },
  ],
};

const meta = {
  title: 'Boards/Components/PanelStates',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const PanelStates: Story = {
  render: () => (
    <div className="h-dvh w-dvw">
      <Board spec={SPEC} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('10:42 · EU · H1 2026 · 41 ms')).toBeInTheDocument();
    await expect(canvas.getByText('Added')).toBeInTheDocument();
    await expect(canvas.getByText('Changed')).toBeInTheDocument();
    // A reading panel mounts no renderer: its text never appears, its skeleton does.
    await expect(canvas.getAllByLabelText('Reading')).toHaveLength(2);
  },
};
