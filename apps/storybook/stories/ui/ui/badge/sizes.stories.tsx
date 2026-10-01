import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@invana/ui';

const meta: Meta<typeof Badge> = {
  title: 'UI/UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES = [
  ['xs', '22px, the default — the row chip: a status beside an entity name'],
  ['sm', '26px — beside a search or a filter chip'],
] as const;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {SIZES.map(([size, why]) => (
        <div key={size} className="flex items-center gap-3">
          <Badge variant="outline" tone="success" size={size}>
            staged
          </Badge>
          <span className="text-sm text-muted-foreground">{why}</span>
        </div>
      ))}
    </div>
  ),
};
