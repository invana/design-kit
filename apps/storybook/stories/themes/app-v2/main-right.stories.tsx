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
 * `bottomSpan="main-right"` — the bottom (terminal) panel stretches under the
 * main editor **and** the right/auxiliary panel, while the left sidebar stays
 * full height beside them. The mirror of the default `left-main` behaviour.
 */
export const BottomSpanMainRight: Story = {
  render: () => {
    const layoutProps: AppLayoutV2Props = {
      bottomSpan: "main-right",
      header: {
        className: "!h-[35px]",
        left: (
          <div className="flex items-center gap-2 pl-2 font-bold text-lg">
            Invana Studio
          </div>
        ),
        center: (
          <div className="text-sm text-muted-foreground">
            bottomSpan = &quot;main-right&quot;
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
            hint="Full height — the bottom panel does NOT reach under here."
          />
        ),
      },
      mainSection: {
        content: (
          <Region
            label="Main editor"
            hint="The bottom panel spans under this column…"
          />
        ),
      },
      rightSection: {
        content: (
          <Region
            label="Right / auxiliary"
            hint="…and continues under this column too."
          />
        ),
      },
      bottomSection: {
        content: (
          <Region
            className="flex flex-col"
            label="Bottom panel (Terminal)"
            hint="Spans main + right — stops at the left sidebar's edge."
          />
        ),
      },
      footer: {
        className: "!h-[25px] px-2 text-sm",
        leftNavItems: [
          { name: "Terminal", icon: TerminalIcon, label: "main-right span" },
        ],
      },
      mainClassName: "h-[calc(100vh-60px)]",
    };

    return <AppLayoutV2 {...layoutProps} />;
  },
};
