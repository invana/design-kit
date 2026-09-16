import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@invana/editor';

const meta: Meta<typeof CodeBlock> = {
  title: 'Editor/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RESULT = `{
  "task": "import_dataset",
  "status": "ok",
  "outputs": {
    "written": 1204,
    "reported": 47,
    "dataset_id": "ds_9f2c"
  },
  "graph": {
    "nodes": { "Order": 1204 },
    "edges": { "FOR": 1204 }
  },
  "artifacts": ["orders.csv", "rejects.csv"],
  "timing": { "ms": 3402 }
}`;

/**
 * A run's `result.json`, which is what every task merges into.
 *
 * `maxHeight` caps the block and scrolls inside it — for a record whose length
 * is not the point and which grows as the run proceeds. The scroller lives
 * inside CodeMirror rather than on the wrapper, so the editor knows its own
 * viewport instead of rendering every line into a box that then clips them.
 *
 * Still read-only by construction: this is a record of what happened, not a
 * disabled editor.
 */
export const ResultJson: Story = {
  render: () => (
    <div className="w-[420px]">
      <CodeBlock language="json" value={RESULT} maxHeight={232} />
    </div>
  ),
};
