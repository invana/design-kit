import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownEditorBlock } from '@invana/editor';

import { RULES_V4 } from '../fixtures';

const meta: Meta<typeof MarkdownEditorBlock> = {
  title: 'Editor/MarkdownEditorBlock',
  component: MarkdownEditorBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A published version, opened from history. It is the record of what a run was
 * given, so it cannot be typed into — a change is a new version, not an edit to
 * this one.
 */
export const ReadOnly: Story = {
  args: { value: RULES_V4, version: 'v4', readOnly: true },
};
