import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Kbd } from '@invana/ui';

const meta: Meta = {
  title: 'Others/CornerHint',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `corner-hint` is a plain CSS utility class (from `@invana/styling`) — drop
 * it on any element, no wrapper component required. Paired here with an
 * inline `Kbd` badge: the badge is always visible, the brackets fade in only
 * on hover/focus.
 */
export const ButtonShortcut: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="outline" className="gap-2">
        Start free
        <Kbd>L</Kbd>
      </Button>
      <Button variant="outline" className="corner-hint gap-2">
        Get Demo
        <Kbd>G</Kbd>
      </Button>
    </div>
  ),
};
