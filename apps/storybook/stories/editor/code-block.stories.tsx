import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@invana/editor';

const meta: Meta<typeof CodeBlock> = {
  title: 'Editor/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DAG = `from invana.datasets import import_dataset

run = import_dataset("ravi/finance", "bars-5m", "./drop/bars-5m", refresh=True)
run.wait()`;

/** Read-only by construction — no cursor, no illusion that typing does anything. */
export const Default: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-3">
      <CodeBlock language="python" value={DAG} />
      <CodeBlock
        language="cypher"
        value={'MATCH (t:Theme)<-[:IN]-(s:Stock)\nWHERE t.velocity_5d < 2.0\nRETURN s.symbol'}
      />
    </div>
  ),
};
