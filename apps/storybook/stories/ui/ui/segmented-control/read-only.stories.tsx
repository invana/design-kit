import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from '@invana/ui';

const meta: Meta<typeof SegmentedControl> = {
  title: 'UI/UI/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** A settled answer: the pick is shown, not offered, at full strength. */
export const ReadOnly: Story = {
  args: {
    'aria-label': 'Confidence level',
    variant: 'solid',
    readOnly: true,
    defaultValue: '95',
    options: [
      { value: '90', label: '90%' },
      { value: '95', label: '95%' },
      { value: '99', label: '99%' },
    ],
  },
};
