import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Others/CornerHint',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const items = ['Start Tracing', 'Use Prompt Management', 'Set up Evals'];

/**
 * The `corner-hint` class applied straight to each anchor as a hover/focus
 * affordance, standing in for a solid highlight background.
 */
export const ListAnchor: Story = {
  render: () => (
    <ul className="flex w-64 flex-col gap-1 rounded-control border bg-card p-2">
      {items.map((item) => (
        <li key={item}>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="corner-hint block w-full rounded-control px-3 py-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  ),
};
