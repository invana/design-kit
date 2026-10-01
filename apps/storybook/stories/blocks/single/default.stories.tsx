import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SingleAsk } from '@invana/blocks';

const meta: Meta<typeof SingleAsk> = {
  title: 'Blocks/Single',
  component: SingleAsk,
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
 * One choice from a list; picking it is the `reply`. Set `state` to `answered` and `value` to
 * see it settled into one label/value pair.
 */
export const Default: Story = {
  args: {
    spec: {
      question: 'Which margin did you mean?',
      options: [
        {
          value: 'op',
          label: 'Operating margin',
          detail: 'fin.op_margin',
        },
        {
          value: 'gross',
          label: 'Gross margin',
          detail: 'fin.gross_margin',
        },
        {
          value: 'contrib',
          label: 'Contribution margin',
          detail: 'fin.contrib',
        },
      ],
      default: 'op',
    },
    onAction: fn(),
  },
};
