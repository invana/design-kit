import { Meta, StoryObj } from "@storybook/react-vite";
import { AppLayoutV2, type AppLayoutV2Props } from "@invana/themes/app-v2/layout";
import { GitBranch, Terminal as TerminalIcon } from "lucide-react";

const meta: Meta<typeof AppLayoutV2> = {
  title: 'Themes/AppV2',
  component: AppLayoutV2,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// A labelled region so it's obvious which slot is which.
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
 * No `leftNav` — the vertical activity bar (its `topNavItems` / `bottomNavItems`)
 * is omitted, so the 45px bar is not rendered and the workspace (sidebar + main +
 * right + bottom) sits flush against the left edge, reclaiming that width.
 */
export const NoLeftNav: Story = {
  render: () => {
    const layoutProps: AppLayoutV2Props = {
      // leftNav intentionally omitted — no activity bar is rendered.
      header: {
        className: "!h-[35px]",
        left: (
          <div className="flex items-center gap-2 pl-2 font-bold text-lg">
            Invana Studio
          </div>
        ),
        center: (
          <div className="text-sm text-muted-foreground">
            leftNav omitted — no activity bar
          </div>
        ),
      },
      leftSection: {
        content: (
          <Region
            label="Sidebar"
            hint="Sits flush against the left edge — no 45px activity bar beside it."
          />
        ),
      },
      mainSection: {
        content: (
          <Region
            label="Main editor"
            hint="Reclaims the width the activity bar would have taken."
          />
        ),
      },
      rightSection: {
        content: <Region label="Right / auxiliary" />,
      },
      bottomSection: {
        content: (
          <Region
            className="flex flex-col"
            label="Bottom panel (Terminal)"
          />
        ),
      },
      footer: {
        className: "!h-[25px] px-2 text-sm",
        leftNavItems: [
          { name: "Branch", icon: GitBranch, label: "main" },
        ],
        rightNavItems: [
          { name: "Terminal", icon: TerminalIcon, label: "no left nav" },
        ],
      },
      mainClassName: "h-[calc(100vh-60px)]",
    };

    return <AppLayoutV2 {...layoutProps} />;
  },
};
