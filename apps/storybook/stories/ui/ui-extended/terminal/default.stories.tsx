import type { Meta, StoryObj } from '@storybook/react-vite';
import { Terminal, TerminalLine } from '@invana/ui';

const meta: Meta<typeof Terminal> = {
  title: 'UI/UI Extended/Terminal',
  component: Terminal,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The hand-off shown honestly, rather than redrawn as a wizard. */
export const Default: Story = {
  render: () => (
    <div className="w-[720px]">
      <Terminal cursor>
        <TerminalLine kind="prompt">
          invana datasets import --graph ravi/finance --name news-tv --follow
        </TerminalLine>
        <TerminalLine>Thought import · news-tv · 640 records · dataset-import@1</TerminalLine>
        <TerminalLine columns={['validate_records', 'NewsArticles@v3', '0.6s', '✓']} />
        <TerminalLine columns={['write_graph', '640 of 640 written', '3.1s', '✓']} />
        <TerminalLine columns={['stitch', '1,912 resolved · 7 unresolved', '', '✓ reported']} />
        <TerminalLine>done · 7 rows reported, not written · job 9c1e</TerminalLine>
        <TerminalLine kind="comment">Airflow owns the schedule, the retries and the backfills.</TerminalLine>
      </Terminal>
    </div>
  ),
};
