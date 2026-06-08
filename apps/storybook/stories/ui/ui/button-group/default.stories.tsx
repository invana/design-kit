import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  Button,
} from '@invana/ui';
import { Bold, Italic, Underline } from 'lucide-react';

const meta: Meta<typeof ButtonGroup> = {
  title: 'UI/UI/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <Bold />
      </Button>
      <Button variant="outline" size="icon">
        <Italic />
      </Button>
      <Button variant="outline" size="icon">
        <Underline />
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Clear</Button>
    </ButtonGroup>
  ),
};
