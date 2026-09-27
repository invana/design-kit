import type { Meta, StoryObj } from '@storybook/react-vite';
import { StagedBar } from '@invana/ui';

const meta: Meta<typeof StagedBar> = {
  title: 'UI/UI Extended/StagedBar',
  component: StagedBar,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Three staged changes, each with its sign and its own `×`, and the shortcut that publishes. */
export const Default: Story = {
  args: {
    items: [
      { id: '1', op: 'add', name: 'airport.timezone', note: 'property' },
      { id: '2', op: 'add', name: 'airport_city', note: 'index on airport.city' },
      { id: '3', op: 'change', name: 'route.dist', note: 'integer → float' },
    ],
    hint: '⌘↵ publish',
    onDiscard: () => {},
    onDiscardAll: () => {},
  },
};
