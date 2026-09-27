import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownEditorBlock } from '@invana/editor';
import { useState } from 'react';

const meta: Meta<typeof MarkdownEditorBlock> = {
  title: 'Editor/MarkdownEditorBlock/Placeholder',
  component: MarkdownEditorBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DEFAULT_VOICE =
  'You are a colleague who knows this graph well. Speak in the first person, warmly and plainly.';

/** Empty — the placeholder is what the reader gets when nothing is written. It is never stored. */
export const Placeholder: Story = {
  render: function Render() {
    const [v, setV] = useState('');
    return (
      <div className="w-[560px]">
        <MarkdownEditorBlock value={v} onChange={setV} placeholder={DEFAULT_VOICE} version="v1" />
      </div>
    );
  },
};
