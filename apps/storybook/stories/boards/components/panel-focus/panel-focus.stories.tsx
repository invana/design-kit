import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Board, type BoardSpec } from '@invana/boards';

/**
 * `focus` makes a panel the subject: the others on its board step back, still readable and still
 * live. It changes nothing on the panel itself. A record or a bar *inside* a panel is called out
 * with the kind's own `highlight` (the primary colour), and the two combine: a story step focuses a
 * panel, then highlights what it is about. With no panel focused the board is drawn as it always is.
 */
const board = (focus?: 'airports' | 'routes', highlight = true): BoardSpec => ({
  header: { crumbs: ['Busiest airports'] },
  rows: [
    {
      panels: [
        {
          id: 'airports',
          kind: 'table',
          title: 'Airports',
          focus: focus === 'airports',
          footer: '10:42 · Default · 38 ms',
          options: {
            columns: [
              { key: 'code', label: 'Code', mono: true },
              { key: 'name', label: 'Airport' },
              { key: 'routes', label: 'Routes', align: 'right' },
            ],
            rows: [
              { code: 'ATL', name: 'Hartsfield–Jackson', routes: 915 },
              { code: 'FRA', name: 'Frankfurt', routes: 716 },
              { code: 'DXB', name: 'Dubai Intl', routes: 664 },
              { code: 'LHR', name: 'Heathrow', routes: 620 },
            ],
            highlight: highlight ? [1, 3] : undefined,
          },
        },
        {
          id: 'routes',
          kind: 'bars',
          title: 'Routes by country',
          focus: focus === 'routes',
          footer: '10:42 · Default · 61 ms',
          options: {
            groups: ['US', 'CN', 'DE', 'GB'],
            series: [{ name: 'routes', values: [12118, 6624, 4430, 3702] }],
            highlight: highlight ? 'US' : undefined,
          },
        },
      ],
    },
  ],
});

type Props = { focus?: 'airports' | 'routes'; highlight: boolean };

function Demo({ focus, highlight }: Props) {
  return (
    <div className="h-dvh w-dvw">
      <Board spec={board(focus, highlight)} />
    </div>
  );
}

const meta = {
  title: 'Boards/Components/PanelFocus',
  component: Demo,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    focus: { control: 'inline-radio', options: [undefined, 'airports', 'routes'] },
    highlight: { control: 'boolean' },
  },
  args: { focus: 'airports', highlight: true },
} satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PanelFocus: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-focused]')).toHaveLength(1);
    await expect(canvasElement.querySelectorAll('[data-focusable]:not([data-focused])')).toHaveLength(1);
    await expect(canvasElement.querySelector('[data-focused]')).toHaveAttribute('aria-current', 'step');
    await expect(within(canvasElement).getByText('Routes by country')).toBeInTheDocument();
  },
};

/** Nothing focused: no panel is marked, and the board is drawn as before. */
export const NoFocus: Story = {
  args: { focus: undefined },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-focused]')).toHaveLength(0);
    await expect(canvasElement.querySelectorAll('[aria-current]')).toHaveLength(0);
  },
};
