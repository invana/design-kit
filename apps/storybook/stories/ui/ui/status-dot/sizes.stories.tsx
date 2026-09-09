import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from '@invana/ui';

const meta: Meta<typeof StatusDot> = {
  title: 'UI/UI/StatusDot',
  component: StatusDot,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES = [
  ['xs', '5px — inside a dense step row'],
  ['sm', '6px — a thread or list row'],
  ['md', '8px — a roster row, a legend swatch'],
  ['lg', '10px — a legend key on its own'],
] as const;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {SIZES.map(([size, why]) => (
        <div key={size} className="flex items-center gap-2">
          <span className="flex w-4 justify-center">
            <StatusDot tone="success" size={size} />
          </span>
          <span className="w-6 text-meta text-muted-foreground">{size}</span>
          <span className="text-xs">{why}</span>
        </div>
      ))}
    </div>
  ),
};
