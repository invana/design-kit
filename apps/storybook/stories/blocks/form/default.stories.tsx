import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FormAsk } from '@invana/blocks';

const meta: Meta<typeof FormAsk> = {
  title: 'Blocks/Form',
  component: FormAsk,
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
 * Several fields that only make sense together, sent as one `reply` keyed by field name.
 */
export const Default: Story = {
  args: {
    spec: {
      question: 'Scenario inputs',
      fields: [
        {
          name: 'price',
          label: 'Price change',
          type: 'number',
          unit: '%',
          default: -5,
        },
        {
          name: 'elasticity',
          label: 'Elasticity',
          type: 'number',
          default: 1.3,
          above: 0,
        },
        {
          name: 'starts',
          label: 'Starts',
          type: 'date',
          default: '2026-11-01',
        },
      ],
      submit: 'Run scenario',
    },
    onAction: fn(),
  },
};
