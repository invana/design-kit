import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownEditorBlock } from '@invana/editor';
import { useState } from 'react';

import { DEFAULT_VOICE } from '../fixtures';

const meta: Meta<typeof MarkdownEditorBlock> = {
  title: 'Editor/MarkdownEditorBlock',
  component: MarkdownEditorBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Empty — the placeholder is what the reader gets when nothing is written, here
 * an agent's default voice. It is drawn, never stored: `onChange` never sees it.
 */
export const Placeholder: Story = {
  args: { version: 'v1', placeholder: DEFAULT_VOICE },
  render: function Render(args) {
    const [v, setV] = useState('');
    return <MarkdownEditorBlock {...args} value={v} onChange={setV} />;
  },
};
