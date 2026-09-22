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
 * The four readings of one run — `In order · Layers · Flow · Lens`.
 *
 * One page, one trace, four ways of reading it. That is what makes this a
 * segmented control and not a tab strip: tabs imply four panels of content, and
 * a reader who has just filtered a trace would expect to lose the filter moving
 * between them. Nothing underneath changes here except how the same record is
 * drawn.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('order');
    return (
      <SegmentedControl
        aria-label="How to read this run"
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'order', label: 'In order' },
          { value: 'layers', label: 'Layers' },
          { value: 'flow', label: 'Flow' },
          { value: 'lens', label: 'Lens' },
        ]}
      />
    );
  },
};
