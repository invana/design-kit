import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownEditorBlock } from '@invana/editor';
import { useState } from 'react';

const meta: Meta<typeof MarkdownEditorBlock> = {
  title: 'Editor/MarkdownEditorBlock',
  component: MarkdownEditorBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RULES = `## Gap playbook

- Gap >= 1.5% with a news catalyst and volume >= 2x the 20-day average
  -> continuation candidate (gap-continuation).
- Delivery % must be >= 40; below that the gap is a fade candidate
  (gap-no-delivery), never a long.
- Stop = VWAP; target = 1.5R; size from position-sizing.`;

/** Plain markdown in mono — what the author types is what the agent is offered. */
export const Default: Story = {
  render: () => {
    const [v, setV] = useState(RULES);
    return (
      <div className="w-[560px]">
        <MarkdownEditorBlock value={v} onChange={setV} version="v5 · editing" />
      </div>
    );
  },
};
