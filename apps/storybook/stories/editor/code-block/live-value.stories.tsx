import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@invana/editor';
import { PanelBox } from '@invana/ui';
import { useEffect, useState } from 'react';

import { RUN_STEPS } from '../fixtures';

const meta: Meta<typeof CodeBlock> = {
  title: 'Editor/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `result.json` while the run is still going — each finished task merges its
 * key in, and the block follows.
 *
 * A new `value` is pushed into the existing view as a transaction, not by
 * remounting it: scroll inside the capped block mid-run and it stays where you
 * put it. The run loops so there is always something arriving.
 */
export const LiveValue: Story = {
  render: function Render() {
    const [done, setDone] = useState(1);
    useEffect(() => {
      const id = setInterval(() => setDone((n) => (n % RUN_STEPS.length) + 1), 1200);
      return () => clearInterval(id);
    }, []);

    const finished = done === RUN_STEPS.length;
    const result = Object.fromEntries(
      RUN_STEPS.slice(0, done).map(([k, v]) => (k === 'status' && finished ? [k, 'ok'] : [k, v])),
    );

    return (
      <PanelBox
        title="result.json"
        aside={finished ? `${done} keys · done` : `${done} keys · tailing`}
        flush
      >
        <CodeBlock language="json" value={JSON.stringify(result, null, 2)} maxHeight={200} />
      </PanelBox>
    );
  },
};
