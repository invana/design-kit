import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator, TypographyH6 } from '@invana/ui';

const meta: Meta<typeof Separator> = {
  title: 'UI/UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Horizontal separator (default).
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <TypographyH6>Section 1</TypographyH6>
        <p className="text-base text-muted-foreground">Content for the first section.</p>
      </div>
      <Separator />
      <div>
        <TypographyH6>Section 2</TypographyH6>
        <p className="text-base text-muted-foreground">Content for the second section.</p>
      </div>
    </div>
  ),
};

/**
 * Vertical separator.
 */
