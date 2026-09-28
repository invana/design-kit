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
 * A plan version as the engine holds it — `Export YAML` on a plan's page.
 *
 * Line numbers because a reader copies a line by its number. Off by default: a
 * five-line snippet does not need a gutter.
 */
export const LineNumbers: Story = {
  args: { language: 'yaml', value: SAMPLES.yaml, showLineNumbers: true },
};
