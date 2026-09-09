import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent } from '@invana/ui';
import { X } from 'lucide-react';

const meta: Meta<typeof PanelContent> = {
  title: 'UI/UI Extended/PanelContent',
  component: PanelContent,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const files = ['index.ts', 'panel-content.tsx', 'panel-stack.tsx', 'toolbar.tsx', 'tree-view.tsx'];
const problems = ['Unused import', 'Missing key prop', 'Unreachable branch'];

/**
 * Two panels sharing one column. Each is bounded by its own track, so a panel's
 * long body scrolls inside it rather than growing the column.
 */
export const StackedPanels: Story = {
  render: () => (
    <div className="grid h-[420px] w-[320px] grid-rows-2 gap-2">
      <div className="min-h-0 rounded-md border">
        <PanelContent
          titleText="Files"
          bodyClassName="p-0"
          headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
        >
          <ul>
            {files.map((file) => (
              <li key={file} className="px-3 py-1.5 hover:bg-accent">{file}</li>
            ))}
          </ul>
        </PanelContent>
      </div>
      <div className="min-h-0 rounded-md border">
        <PanelContent
          titleText="Problems"
          bodyClassName="p-0"
          headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
        >
          <ul>
            {problems.map((problem) => (
              <li key={problem} className="flex items-baseline gap-2 px-3 py-1.5">
                <span className="truncate">{problem}</span>
                <span className="ml-auto shrink-0 text-meta text-muted-foreground">warn</span>
              </li>
            ))}
          </ul>
        </PanelContent>
      </div>
    </div>
  ),
};
