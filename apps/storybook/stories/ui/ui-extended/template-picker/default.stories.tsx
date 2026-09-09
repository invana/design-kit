import type { Meta, StoryObj } from '@storybook/react-vite';
import { TemplatePicker } from '@invana/ui';
import { useState } from 'react';

const meta: Meta<typeof TemplatePicker> = {
  title: 'UI/UI Extended/TemplatePicker',
  component: TemplatePicker,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Unavailable options are listed, not hidden — the reason a template does not
 * fit is information about the data.
 */
export const Default: Story = {
  render: () => {
    const [v, setV] = useState('table-compact@3');
    return (
      <div className="w-[330px]">
        <TemplatePicker
          heading="Render these 4 records as"
          value={v}
          onSelect={setV}
          options={[
            { id: 'table-compact@3', kind: 'table', note: 'in use' },
            { id: 'table-wide@1', kind: 'table' },
            { id: 'bars-h@2', kind: 'chart' },
            { id: 'stat-compact@1', kind: 'metric', unavailable: 'needs 1 record, has 4' },
            { id: 'line-time@2', kind: 'chart', unavailable: 'needs a time column' },
            { id: 'card-html@1', kind: 'html', note: 'sandboxed' },
          ]}
          footnote="Re-renders from the same 4 records. The query does not run again."
        />
      </div>
    );
  },
};
