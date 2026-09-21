import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea, TypographyH6 } from '@invana/ui';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 40 }).map((_, i) => `v1.2.0-beta.${i + 1}`);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <TypographyH6 className="mb-4">Tags</TypographyH6>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-base">{tag}</div>
            <div className="my-2 h-px bg-border" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
