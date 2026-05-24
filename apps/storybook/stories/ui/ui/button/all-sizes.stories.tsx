import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@invana/ui'

const meta: Meta<typeof Button> = {
  title: 'UI/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Change the default rendered element for the one passed as a child',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
}


// Default Button

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2 flex-wrap">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🎨</Button>
    </div>
  ),
}

// With Icons
