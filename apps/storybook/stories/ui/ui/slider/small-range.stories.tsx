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

export const SmallRange: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <Label htmlFor="rating">Rating (1-10)</Label>
      <Slider id="rating" defaultValue={[7]} min={1} max={10} step={1} />
    </div>
  ),
};

/**
 * Slider with step increments.
 */
