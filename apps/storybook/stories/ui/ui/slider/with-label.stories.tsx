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

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <Label htmlFor="volume">Volume</Label>
      <Slider id="volume" defaultValue={[75]} max={100} step={1} />
    </div>
  ),
};

/**
 * Slider with range (0-10).
 */
