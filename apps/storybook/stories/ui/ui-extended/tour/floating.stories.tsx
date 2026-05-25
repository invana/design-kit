import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tour, type TourStep } from '@invana/ui';

const meta: Meta<typeof Tour> = {
  title: 'UI/UI Extended/Tour',
  component: Tour,
  parameters: {
    layout: 'fullscreen',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const steps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome aboard',
    body: 'This is a floating tour panel pinned to a corner of the viewport. It self-manages its step state from the `steps` prop — no external controller needed.',
    callout: {
      label: 'Tip',
      content: 'Use the `position` prop to pin the panel to any corner or the center.',
    },
  },
  {
    id: 'projects',
    title: 'Your projects live here',
    body: 'The progress bar under the header shows how far along the tour you are.',
    references: {
      label: 'Related Docs',
      items: [{ label: 'Getting Started' }, { label: 'Concepts' }],
    },
  },
];

/**
 * A floating tour pinned to the bottom-right of the viewport, shown over a mock
 * page. Uses self-managed mode (`steps` prop) and the optional progress bar.
 */
export const Floating: Story = {
  render: () => (
    <div className="relative h-screen w-full bg-muted/30 p-8">
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-md bg-muted" />
        <div className="h-40 w-full max-w-2xl rounded-md bg-muted" />
        <div className="h-40 w-full max-w-2xl rounded-md bg-muted" />
      </div>
      <Tour
        steps={steps}
        position="bottom-right"
        showProgressBar
        onExit={() => alert('Tour exited')}
        onComplete={() => alert('Tour complete!')}
      />
    </div>
  ),
};
