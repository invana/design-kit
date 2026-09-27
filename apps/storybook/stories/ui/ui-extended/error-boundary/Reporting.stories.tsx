import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState, ErrorBoundary } from '@invana/ui';

const BrokenComponent = () => {
  throw new Error('Intentional render error for demo');
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'UI/UI Extended/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `onError` hears each caught error — where an app reports it — and `fallback`
 * replaces the default notice with the region's own words.
 */
export const Reporting: Story = {
  render: () => (
    <ErrorBoundary
      onError={(error) => console.info('reported:', error.message)}
      fallback={<EmptyState title="This panel failed to load" description="The error has been reported." />}
    >
      <BrokenComponent />
    </ErrorBoundary>
  ),
};
