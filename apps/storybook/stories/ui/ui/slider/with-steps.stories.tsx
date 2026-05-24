import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider, Label } from '@invana/forms';

const meta: Meta<typeof Slider> = {
  title: 'UI/UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default slider.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSteps: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <Label htmlFor="price">Price ($0-$1000, step $50)</Label>
      <Slider id="price" defaultValue={[500]} max={1000} step={50} />
    </div>
  ),
};

/**
 * Disabled slider.
 */
