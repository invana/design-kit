import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tour, type TourStep } from '@invana/ui';

const meta: Meta<typeof Tour> = {
  title: 'UI/UI Extended/Tour',
  component: Tour,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const steps: TourStep[] = [
  {
    id: 'typed',
    title: 'Typed step',
    body: 'This step uses the standard typed fields (body + callout).',
    callout: { label: 'Note', content: 'Mix typed and custom steps freely.' },
  },
  {
    id: 'custom',
    title: 'Custom content step',
    // `content` is an escape hatch: it replaces the typed body/callout/references region.
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Use the <code className="rounded bg-muted px-1">content</code> prop to render
          anything you like inside a step.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border p-3 text-center text-sm">
            12.4k
            <div className="text-xs text-muted-foreground">requests</div>
          </div>
          <div className="rounded-md border border-border p-3 text-center text-sm">
            99.98%
            <div className="text-xs text-muted-foreground">uptime</div>
          </div>
        </div>
      </div>
    ),
  },
];

/**
 * Demonstrates the per-step `content` escape hatch for fully custom step bodies,
 * alongside a standard typed step.
 */
export const CustomContent: Story = {
  render: () => (
    <Tour
      steps={steps}
      onExit={() => alert('Tour exited')}
      onComplete={() => alert('Tour complete!')}
    />
  ),
};
