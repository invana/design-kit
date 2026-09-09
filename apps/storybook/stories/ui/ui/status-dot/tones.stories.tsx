import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from '@invana/ui';

const meta: Meta<typeof StatusDot> = {
  title: 'UI/UI/StatusDot',
  component: StatusDot,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TONES = [
  ['running', 'Understand', '0.3s'],
  ['success', 'Execute', '4 rows'],
  ['warning', 'Verify', 'needs input'],
  ['error', 'Execute', 'failed after 2 attempts'],
  ['info', 'Project', 'table'],
  ['queued', 'snapshot_model', ''],
  ['muted', 'Diagnose', 'will not run'],
] as const;

/**
 * Every tone, in the shape it actually appears: a step row. The state is always
 * written beside the dot — colour is never the only thing carrying it.
 */
export const Tones: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      {TONES.map(([tone, name, meta]) => (
        <div key={tone} className="flex items-center gap-2">
          <StatusDot tone={tone} />
          <span className="flex-1 text-xs">{name}</span>
          <span className="text-meta text-muted-foreground">{meta}</span>
          <span className="w-16 text-meta text-muted-foreground/60">{tone}</span>
        </div>
      ))}
    </div>
  ),
};
