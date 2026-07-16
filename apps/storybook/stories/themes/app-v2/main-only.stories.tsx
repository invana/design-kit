import { Meta, StoryObj } from "@storybook/react-vite";
import { AppLayoutV2, type AppLayoutV2Props } from "@invana/themes/app-v2/layout";
import {
  Files, Search, GitBranch, Bug, Package,
  Settings, User, Terminal as TerminalIcon,
} from "lucide-react";

const meta: Meta<typeof AppLayoutV2> = {
  title: 'Themes/AppV2',
  component: AppLayoutV2,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// A labelled region so it's obvious which slot is which and how far the
// bottom panel stretches. `span` shows the active bottomSpan value on the side.
const Region = ({
  label,
  hint,
  span,
  className,
}: {
  label: string;
  hint?: string;
  span?: string;
  className?: string;
}) => (
  <div className={`h-full w-full p-4 ${className ?? ''}`}>
    <div className="flex items-center gap-2">
      <div className="text-sm font-semibold">{label}</div>
      {span && (
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          bottomSpan=&quot;{span}&quot;
        </span>
      )}
    </div>
    {hint && <div className="mt-1 text-sm text-muted-foreground">{hint}</div>}
  </div>
);

/**
 * `bottomSpan="main"` — the bottom (terminal) panel sits only under the main
 * editor, between the two side panels. Both the left sidebar and the
 * right/auxiliary panel run full height beside it.
 */
export const BottomSpanMain: Story = {
  render: () => {
    const layoutProps: AppLayoutV2Props = {
      bottomSpan: "main",
      header: {
        className: "!h-[35px]",
        left: (
          <div className="flex items-center gap-2 pl-2 font-bold text-lg">
            Invana Studio
          </div>
        ),
        center: (
          <div className="text-sm text-muted-foreground">
            bottomSpan = &quot;main&quot;
          </div>
        ),
      },
      leftNav: {
        topNavItems: [
          { name: "Explorer", icon: Files, tooltip: "Explorer" },
          { name: "Search", icon: Search, tooltip: "Search" },
          { name: "Source Control", icon: GitBranch, tooltip: "Source Control" },
          { name: "Debug", icon: Bug, tooltip: "Run and Debug" },
          { name: "Extensions", icon: Package, tooltip: "Extensions" },
        ],
        bottomNavItems: [
          { name: "Settings", icon: Settings, tooltip: "Settings" },
          { name: "Account", icon: User, tooltip: "Account" },
        ],
      },
      leftSection: {
        content: (
          <Region
            label="Left sidebar"
            span="main"
            hint="Full height — runs the whole way down beside the bottom panel."
          />
        ),
      },
      mainSection: {
        content: (
          <Region
            label="Main editor"
            span="main"
            hint="Stacks above the bottom panel — not full height."
          />
        ),
      },
      rightSection: {
        content: (
          <Region
            label="Right / auxiliary"
            span="main"
            hint="Full height — runs the whole way down beside the bottom panel."
          />
        ),
      },
      bottomSection: {
        content: (
          <Region
            className="flex flex-col"
            label="Bottom panel (Terminal)"
            span="main"
            hint="Spans only the main editor — between the left + right panels."
          />
        ),
      },
      footer: {
        className: "!h-[25px] px-2 text-sm",
        leftNavItems: [
          { name: "Terminal", icon: TerminalIcon, label: "main span" },
        ],
      },
      mainClassName: "h-[calc(100vh-60px)]",
    };

    return <AppLayoutV2 {...layoutProps} />;
  },
};
