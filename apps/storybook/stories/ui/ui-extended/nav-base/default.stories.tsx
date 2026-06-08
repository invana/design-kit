import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavBase } from '@invana/ui';

const meta: Meta<typeof NavBase> = {
  title: 'UI/UI Extended/NavBase',
  component: NavBase,
  parameters: {
    layout: 'padded',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Low-level navigation primitive that lays out `start`, `center` and `end`
 * sections in either orientation. Prefer NavHorizontal / NavVertical for DX.
 */
export const Default: Story = {
  render: () => (
    <NavBase
      orientation="horizontal"
      className="h-12 rounded-md border bg-card px-3 text-card-foreground"
      sections={{
        start: { content: <span className="font-semibold">Invana</span> },
        center: { content: <span className="text-sm text-muted-foreground">Dashboard</span> },
        end: { content: <span className="text-sm">Sign out</span> },
      }}
    />
  ),
};
