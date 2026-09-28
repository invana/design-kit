import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownEditorBlock } from '@invana/editor';
import { useState } from 'react';

import { RULES_V5 } from '../fixtures';

const meta: Meta<typeof MarkdownEditorBlock> = {
  title: 'Editor/MarkdownEditorBlock',
  component: MarkdownEditorBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Plain markdown in mono — what the author types is what the agent is offered.
 *
 * The version sits in the corner because a running thinking finishes on the
 * version it started with; editing without seeing which one you are on is how
 * two people overwrite each other.
 */
export const Default: Story = {
  args: { version: 'v5 · editing', readOnly: false },
  render: function Render(args) {
    const [v, setV] = useState(RULES_V5);
    return <MarkdownEditorBlock {...args} value={v} onChange={setV} />;
  },
};
