import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Board, type BoardSpec } from '@invana/boards';

/**
 * A board takes the full height and width of its **parent**, never of the
 * window: the host decides the space — a shell's region between its header and
 * footer, or a page that is the whole viewport — and the board fills it.
 *
 * A `fill` row takes what the other rows leave, never less than
 * `--spacing-board-fill` (320px at the 13px root). The same spec below sits in
 * a tall parent, where the fill row grows, and a short one, where it stops at
 * the floor and the board's body scrolls instead.
 */
const SPEC: BoardSpec = {
  header: { crumbs: ['Busiest airports in Europe'] },
  rows: [
    { panels: [{ id: 'about', kind: 'text', title: 'What it shows', options: { text: 'Content height: this row is as tall as its text.' } }] },
    {
      fill: true,
      panels: [
        {
          id: 'canvas',
          title: 'Fill row',
          flush: true,
          kind: 'text',
          options: { text: '' },
          render: (
            <div
              data-testid="fill-body"
              className="flex h-full items-center justify-center bg-muted text-muted-foreground"
            >
              Takes the height the other rows leave
            </div>
          ),
        },
      ],
    },
  ],
};

const PARENTS = [
  { label: 'Tall parent · 640px', height: 640 },
  { label: 'Short parent · 300px: the fill row stops at its floor, the body scrolls', height: 300 },
];

const meta = {
  title: 'Boards/Components/BoardSize',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const BoardSize: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {PARENTS.map((p) => (
        <section key={p.height} className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">{p.label}</span>
          {/* The host gives a size; the board is told nothing about it. */}
          <div data-testid={`parent-${p.height}`} className="border border-dashed border-border" style={{ height: p.height }}>
            <Board spec={SPEC} />
          </div>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const floor = parseFloat(getComputedStyle(document.documentElement).fontSize) * (320 / 13);
    for (const p of PARENTS) {
      const parent = canvas.getByTestId(`parent-${p.height}`);
      const board = parent.firstElementChild as HTMLElement;
      // The board is its parent's size, whatever that is.
      await expect(Math.round(board.getBoundingClientRect().height)).toBe(Math.round(parent.clientHeight));
      await expect(Math.round(board.getBoundingClientRect().width)).toBe(Math.round(parent.clientWidth));
    }
    // In the short parent the fill row holds its floor.
    const row = within(canvas.getByTestId('parent-300')).getByTestId('fill-body').closest('.min-h-board-fill');
    await expect(row).not.toBeNull();
    await expect(row!.getBoundingClientRect().height).toBeGreaterThanOrEqual(floor - 1);
  },
};
