import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings } from 'lucide-react';
import { ButtonWithTooltip } from '@invana/ui';

const meta: Meta<typeof ButtonWithTooltip> = {
  title: 'UI/UI Extended/ButtonWithTooltip',
  component: ButtonWithTooltip,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A ghost button that reveals a tooltip on hover. Pass any node via `tooltip`.
 */
export const Default: Story = {
  render: () => (
    <ButtonWithTooltip tooltip="Open settings" size="icon">
      <Settings className="h-4 w-4" />
    </ButtonWithTooltip>
  ),
};
