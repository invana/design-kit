import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, RecordHeader } from '@invana/ui';

const meta: Meta<typeof RecordHeader> = {
  title: 'UI/UI Extended/RecordHeader',
  component: RecordHeader,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `size="md"`: 32px, level with a `PanelBox` header — for a record opened in a panel or a
 * drawer. It holds the same `sm` chips and buttons as the page header.
 */
export const InAPanel: Story = {
  render: () => (
    <div className="flex w-full max-w-[520px] flex-col">
      <RecordHeader
        size="md"
        tone="success"
        crumbs={['run:7d3184f1']}
        chips={
          <Badge variant="outline" size="sm">
            succeeded
          </Badge>
        }
        actions={
          <Button variant="outline" size="sm">
            Open run
          </Button>
        }
      />
    </div>
  ),
};
