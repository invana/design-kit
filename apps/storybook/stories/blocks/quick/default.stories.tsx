import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { QuickAsk } from '@invana/blocks';

const meta: Meta<typeof QuickAsk> = {
  title: 'Blocks/Quick',
  component: QuickAsk,
  parameters: { layout: 'padded' },
  // The chat's middle width; a block fills whatever its shell gives it.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Two to five short options in a row; picking one is the `reply`.
 */
export const Default: Story = {
  args: {
    spec: {
      question: 'How should I return the result?',
      options: [
        {
          value: 'table',
          label: 'Table',
        },
        {
          value: 'chart',
          label: 'Chart',
        },
        {
          value: 'both',
          label: 'Both',
        },
      ],
      default: 'table',
    },
    onAction: fn(),
  },
};
