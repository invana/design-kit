import { Meta, StoryObj } from '@storybook/react-vite';
import { PanelStack, Badge } from '@invana/ui';
import { GitBranch, Bug, Sparkles } from 'lucide-react';

/**
 * `PanelStack` section `title` accepts any React node, not just a string — so
 * you can style it, mix casing, add icons and badges, colour it, etc. When a
 * node is passed the header renders it as-is (no forced uppercase/muted
 * typography); a plain string still gets the default VS-Code header look.
 *
 * Each section below passes a fully custom title node.
 */
const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack Custom Title',
  component: PanelStack,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof PanelStack>;

const Filler = ({ label }: { label: string }) => (
  <ul className="p-2 text-sm text-muted-foreground">
    {Array.from({ length: 8 }).map((_, i) => (
      <li key={i} className="px-1 py-1">
        {label} item {i + 1}
      </li>
    ))}
  </ul>
);

export const CustomTitle: Story = {
  render: () => (
    <div className="h-[560px] w-[360px] overflow-hidden rounded-md border border-border bg-background">
      <PanelStack
        sections={[
          {
            id: 'branch',
            title: (
              <span className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">main</span>
                <Badge variant="secondary" className="rounded-full px-1.5 py-0">
                  3 ahead
                </Badge>
              </span>
            ),
            content: <Filler label="Commit" />,
          },
          {
            id: 'issues',
            title: (
              <span className="flex items-center gap-2 text-destructive">
                <Bug className="h-4 w-4" />
                <span className="font-semibold uppercase tracking-wide">Issues</span>
                <Badge variant="destructive" className="rounded-full px-1.5 py-0">
                  2
                </Badge>
              </span>
            ),
            content: <Filler label="Issue" />,
          },
          {
            id: 'features',
            title: (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text font-bold text-transparent">
                  Highlights
                </span>
              </span>
            ),
            content: <Filler label="Highlight" />,
          },
        ]}
      />
    </div>
  ),
};
