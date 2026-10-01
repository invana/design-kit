import type { Meta, StoryObj } from '@storybook/react-vite';
import { NarrativeBlock } from '@invana/blocks';

const meta: Meta<typeof NarrativeBlock> = {
  title: 'Blocks/Narrative',
  component: NarrativeBlock,
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
 * The answer in words, leading with the number. `**…**` marks a figure; `[n]` places a source's
 * marker where its clause ends. The conversation adds cite focus and the streaming caret.
 */
export const Default: Story = {
  args: {
    spec: {
      text: 'Operating margin fell **1.8 pts** to **14.2%** in Q3.[1] Freight per order rose 22% after the July carrier change,[2] and the North region carried most of it.[3]',
    },
  },
};
