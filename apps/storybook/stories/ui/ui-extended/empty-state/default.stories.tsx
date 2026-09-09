import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState, EmptyStateLock, Button } from '@invana/ui';
import { Database, Boxes, Search } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/UI Extended/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Naming what unlocks each surface turns an empty screen into a sequence. */
export const Default: Story = {
  render: () => (
    <div className="w-[560px] border border-border bg-card">
      <EmptyState
        icon={<Database size={32} />}
        title="Nothing loaded yet"
        description="Connect the database, publish a model, then import a dataset from the CLI."
        actions={<Button size="sm">Connect a database</Button>}
        locks={
          <>
            <EmptyStateLock icon={<Boxes />}>Modeller · unlocks after connection</EmptyStateLock>
            <EmptyStateLock icon={<Search />}>Explorer · unlocks after the first import</EmptyStateLock>
          </>
        }
      />
    </div>
  ),
};
