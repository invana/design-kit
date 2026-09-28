import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownEditorBlock } from '@invana/editor';
import { Button, PanelBox } from '@invana/ui';
import { useState } from 'react';

import { RULES_V4, RULES_V5 } from '../fixtures';

const meta: Meta<typeof MarkdownEditorBlock> = {
  title: 'Editor/MarkdownEditorBlock',
  component: MarkdownEditorBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The document replaced from outside — `Revert to v4` while editing v5.
 *
 * The new `value` goes into the live view as one transaction, so the editor is
 * not remounted: it keeps its undo history, and `Ctrl/Cmd+Z` undoes the revert back to
 * what you had typed. Typing itself never round-trips — the view's own output
 * is not written back into it, so the caret stays put.
 */
export const Revert: Story = {
  render: function Render() {
    const [v, setV] = useState(RULES_V5);
    const reverted = v === RULES_V4;
    return (
      <PanelBox
        title="Graph rules"
        aside={
          <Button size="xs" variant="ghost" disabled={reverted} onClick={() => setV(RULES_V4)}>
            Revert to v4
          </Button>
        }
        flush
      >
        <MarkdownEditorBlock
          value={v}
          onChange={setV}
          version={reverted ? 'v4 · reverted' : 'v5 · editing'}
        />
      </PanelBox>
    );
  },
};
