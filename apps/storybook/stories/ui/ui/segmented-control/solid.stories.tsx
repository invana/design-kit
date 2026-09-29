import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from '@invana/ui';

const meta: Meta<typeof SegmentedControl> = {
  title: 'UI/UI/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An answer to a question — a confidence level. The pick is filled with primary and the
 * options are ruled apart, because here the pick is the thing being read.
 */
export const Solid: Story = {
  render: function Render() {
    const [value, setValue] = React.useState('95');
    return (
      <SegmentedControl
        aria-label="Confidence level"
        variant="solid"
        size="sm"
        value={value}
        onValueChange={setValue}
        options={[
          { value: '90', label: '90%' },
          { value: '95', label: '95%' },
          { value: '99', label: '99%' },
        ]}
      />
    );
  },
};
