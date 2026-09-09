import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@invana/ui';

const meta: Meta<typeof Badge> = {
  title: 'UI/UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TONES = ['primary', 'success', 'warning', 'info', 'muted'] as const;
const VARIANTS = ['default', 'soft', 'outline'] as const;

/**
 * The two axes crossed. `tone` is the meaning, `variant` is the treatment —
 * `secondary` and `destructive` are absent because they are already a colour
 * decision and `tone` does not apply to them.
 */
export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-2">
          <span className="w-14 text-meta text-muted-foreground">{variant}</span>
          {TONES.map((tone) => (
            <Badge key={tone} variant={variant} tone={tone} size="sm">
              {tone}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};
