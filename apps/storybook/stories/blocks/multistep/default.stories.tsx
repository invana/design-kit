import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MultistepAsk } from '@invana/blocks';

const meta: Meta<typeof MultistepAsk> = {
  title: 'Blocks/Multistep',
  component: MultistepAsk,
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
 * Several asks in one card, a step at a time; the answers go as one `reply` keyed by step id.
 */
export const Default: Story = {
  args: {
    spec: {
      steps: [
        {
          id: 'environment',
          kind: 'single',
          question: 'Which environment is the new line for?',
          options: [
            {
              value: 'semi-arid',
              label: 'Semi-arid',
              detail: '3 sites',
            },
            {
              value: 'rainfed',
              label: 'Rainfed',
              detail: '2 sites',
            },
            {
              value: 'irrigated',
              label: 'Irrigated',
              detail: '1 site',
            },
          ],
          default: 'semi-arid',
        },
        {
          id: 'traits',
          kind: 'multi',
          question: 'Which traits must it keep?',
          options: [
            {
              value: 'drought',
              label: 'Drought tolerance',
            },
            {
              value: 'rust',
              label: 'Rust resistance',
            },
            {
              value: 'pods',
              label: 'Pod length',
            },
          ],
        },
      ],
      review: true,
    },
    onAction: fn(),
  },
};
