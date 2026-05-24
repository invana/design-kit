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

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <Label htmlFor="disabled">Disabled slider</Label>
      <Slider id="disabled" defaultValue={[50]} max={100} disabled />
    </div>
  ),
};

/**
 * Multiple sliders.
 */
