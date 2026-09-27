import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@invana/editor';

const meta: Meta<typeof CodeBlock> = {
  title: 'Editor/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PLAN = `key: nl-single
version: 2
args:
  read_only: {type: bool, default: true, label: Refuse anything that writes}
tasks:
  - key: translate_thought
    run: translate_thought
  - key: execute_graph_query
    run: execute_graph_query
    args: {query: \${steps.translate_thought.query}, read_only: \${args.read_only}}
    depends_on: [translate_thought, validate_query]
`;

/**
 * A plan version as the engine holds it — `Export YAML` on a plan's page.
 * Read-only, with line numbers, because a reader copies a line by its number.
 */
export const Yaml: Story = {
  args: { language: 'yaml', value: PLAN, showLineNumbers: true },
};
