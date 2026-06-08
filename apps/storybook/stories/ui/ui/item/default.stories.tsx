import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  Button,
} from '@invana/ui';
import { FileText, ChevronRight } from 'lucide-react';

const meta: Meta<typeof Item> = {
  title: 'UI/UI/Item',
  component: Item,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Item variant="outline" className="w-96">
      <ItemMedia variant="icon">
        <FileText />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Project proposal.pdf</ItemTitle>
        <ItemDescription>
          Updated 2 hours ago · 1.4 MB · Shared with 3 people
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon">
          <ChevronRight />
        </Button>
      </ItemActions>
    </Item>
  ),
};
