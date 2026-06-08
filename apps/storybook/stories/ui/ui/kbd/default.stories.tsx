import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, KbdGroup } from '@invana/ui';

const meta: Meta<typeof Kbd> = {
  title: 'UI/UI/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Save</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Command palette</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
};
