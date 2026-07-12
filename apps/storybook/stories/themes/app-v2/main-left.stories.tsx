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
// bottom panel stretches.
const Region = ({
  label,
  hint,
  className,
}: {
  label: string;
  hint?: string;
  className?: string;
}) => (
  <div className={`h-full w-full p-4 ${className ?? ''}`}>
    <div className="text-sm font-semibold">{label}</div>
    {hint && <div className="mt-1 text-sm text-muted-foreground">{hint}</div>}
  </div>
);

/**
 * `bottomSpan="left-main"` (the default) — the bottom (terminal) panel stretches
 * under the left sidebar **and** the main editor, while the right/auxiliary
 * panel stays full height beside them.
 */
export const BottomSpanLeftMain: Story = {
  render: () => {
    const layoutProps: AppLayoutV2Props = {
      bottomSpan: "left-main",
      header: {
        className: "!h-[35px]",
        left: (
          <div className="flex items-center gap-2 pl-2 font-bold text-lg">
            Invana Studio
          </div>
        ),
        center: (
          <div className="text-sm text-muted-foreground">
            bottomSpan = &quot;left-main&quot;
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
            hint="The bottom panel spans under this column…"
          />
        ),
      },
      mainSection: {
        content: (
          <Region
            label="Main editor"
            hint="…and continues under this column too."
          />
        ),
      },
      rightSection: {
        content: (
          <Region
            label="Right / auxiliary"
            hint="Full height — the bottom panel does NOT reach under here."
          />
        ),
      },
      bottomSection: {
        content: (
          <Region
            className="flex flex-col"
            label="Bottom panel (Terminal)"
            hint="Spans left + main — stops at the right panel's edge."
          />
        ),
      },
      footer: {
        className: "!h-[25px] px-2 text-sm",
        leftNavItems: [
          { name: "Terminal", icon: TerminalIcon, label: "left-main span" },
        ],
      },
      mainClassName: "h-[calc(100vh-60px)]",
    };

    return <AppLayoutV2 {...layoutProps} />;
  },
};
