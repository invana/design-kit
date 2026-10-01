import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SegmentedControl } from '@invana/ui';

const meta: Meta<typeof SegmentedControl> = {
  title: 'UI/UI/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * No default — a question not yet answered starts with nothing picked, rather than the
 * first option picked for the reader. Tab still reaches the first option.
 */
export const NoDefault: Story = {
  args: {
    'aria-label': 'Granularity',
    variant: 'solid',
    defaultValue: null,
    onValueChange: fn(),
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
};
