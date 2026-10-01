import type { Meta, StoryObj } from '@storybook/react-vite';
import { GridBlock } from '@invana/blocks';

import { RUN_FIGURES } from '../_fixtures';

const meta: Meta<typeof GridBlock> = {
  title: 'Blocks/Grid',
  component: GridBlock,
  parameters: { layout: 'padded' },
  // A dashboard's width: a strip fits as many tiles across as `minTileWidth` allows.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A strip fitted to the width with `minTileWidth`. A `gauge` with no target is a meter — how
 * full a figure with a ceiling is.
 */
export const Strip: Story = {
  args: {
    spec: RUN_FIGURES,
  },
};
