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

export const Multiple: Story = {
  render: () => (
    <div className="space-y-6 w-[300px]">
      <div className="space-y-2">
        <Label>Red</Label>
        <Slider defaultValue={[255]} max={255} step={1} />
      </div>
      <div className="space-y-2">
        <Label>Green</Label>
        <Slider defaultValue={[128]} max={255} step={1} />
      </div>
      <div className="space-y-2">
        <Label>Blue</Label>
        <Slider defaultValue={[0]} max={255} step={1} />
      </div>
    </div>
  ),
};

/**
 * Comprehensive showcase of all slider variations and use cases.
 */
