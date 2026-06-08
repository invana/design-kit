import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Progress } from '@invana/ui';

const meta: Meta<typeof Progress> = {
  title: 'UI/UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(13);

    useEffect(() => {
      const timer = setTimeout(() => setValue(60), 500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="flex w-[300px] flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Uploading…</span>
          <span className="font-medium">{value}%</span>
        </div>
        <Progress value={value} />
      </div>
    );
  },
};
