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

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
}

// All Sizes Showcase
