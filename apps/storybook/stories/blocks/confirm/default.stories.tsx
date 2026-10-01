import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConfirmAsk } from '@invana/blocks';

const meta: Meta<typeof ConfirmAsk> = {
  title: 'Blocks/Confirm',
  component: ConfirmAsk,
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
 * Yes or no, with what yes costs stated before the buttons. The pick is sent as `reply` with
 * `true` or `false`; set `state` to `answered` and `value` to see it settled.
 */
export const Default: Story = {
  args: {
    spec: {
      question: 'This scans every store and every day since 2019. Run it as asked?',
      cost: [
        {
          label: 'rows scanned',
          value: '2.3B',
        },
        {
          label: 'to run',
          value: 'about **40 s**',
        },
        {
          label: 'records written',
          value: '0',
        },
      ],
      yes: 'Run it',
      no: 'Narrow to Q3 first',
      default: false,
      hint: 'Default: narrow first',
    },
    onAction: fn(),
  },
};
