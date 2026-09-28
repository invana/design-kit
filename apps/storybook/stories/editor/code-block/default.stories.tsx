import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock, type CodeLanguage } from '@invana/editor';

import { SAMPLES } from '../fixtures';

const meta: Meta<typeof CodeBlock> = {
  title: 'Editor/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
  argTypes: {
    language: { control: 'select', options: Object.keys(SAMPLES) },
    value: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Code, shown as it is — the DAG in a hand-off, a query in a diagnosis.
 *
 * Read-only by construction: no cursor, no illusion that typing does anything.
 * Pick a `language` in Controls to see each mode on a document it is really
 * handed; `plain` paints nothing, for output that is not code.
 */
export const Default: Story = {
  args: { language: 'python', showLineNumbers: false },
  render: (args) => {
    const language = (args.language ?? 'plain') as CodeLanguage;
    return <CodeBlock {...args} language={language} value={SAMPLES[language]} />;
  },
};
