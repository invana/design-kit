import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@invana/editor';

import { SAMPLES } from '../fixtures';

const meta: Meta<typeof CodeBlock> = {
  title: 'Editor/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A run's `result.json`, which is what every task merges into.
 *
 * `maxHeight` caps the block and scrolls inside it — for a record whose length
 * is not the point. The scroller lives inside CodeMirror rather than on the
 * wrapper, so the editor knows its own viewport instead of rendering every line
 * into a box that then clips them.
 */
export const MaxHeight: Story = {
  args: { language: 'json', value: SAMPLES.json, maxHeight: 232 },
};
