import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorBoundary } from '@invana/ui';

const BrokenComponent = () => {
  throw new Error('Intentional render error for demo');
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'UI/UI Extended/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Catches render errors from its children and shows a friendly fallback.
 * Here it wraps a component that throws on render.
 */
export const Default: Story = {
  render: () => (
    <div className="h-40 w-80 rounded-md border">
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    </div>
  ),
};
