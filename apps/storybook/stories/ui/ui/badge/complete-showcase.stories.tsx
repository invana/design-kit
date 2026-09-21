import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, TypographyH5 } from '@invana/ui';

const meta: Meta<typeof Badge> = {
  title: 'UI/UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default badge with primary styling.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteShowcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <TypographyH5 className="mb-4">All Variants</TypographyH5>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div>
        <TypographyH5 className="mb-4">Status Badges</TypographyH5>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default">Active</Badge>
          <Badge variant="secondary">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Badge variant="outline">Draft</Badge>
        </div>
      </div>

      <div>
        <TypographyH5 className="mb-4">Priority Badges</TypographyH5>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="destructive">High</Badge>
          <Badge variant="default">Medium</Badge>
          <Badge variant="secondary">Low</Badge>
        </div>
      </div>

      <div>
        <TypographyH5 className="mb-4">Category Tags</TypographyH5>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">Design</Badge>
          <Badge variant="outline">Development</Badge>
          <Badge variant="outline">Marketing</Badge>
          <Badge variant="outline">Sales</Badge>
          <Badge variant="outline">Support</Badge>
        </div>
      </div>

      <div>
        <TypographyH5 className="mb-4">With Counts</TypographyH5>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default">New 3</Badge>
          <Badge variant="secondary">Updates 12</Badge>
          <Badge variant="destructive">Errors 5</Badge>
          <Badge variant="outline">Comments 24</Badge>
        </div>
      </div>
    </div>
  ),
};
