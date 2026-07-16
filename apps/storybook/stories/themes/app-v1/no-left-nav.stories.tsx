import { Meta, StoryObj } from "@storybook/react-vite";
import { AppLayoutV1 } from "@invana/themes/app-v1/layout";
import { Badge, Avatar, Button } from "@invana/ui";
import { Input } from "@invana/forms";
import { Search, Bell, HelpCircle } from "lucide-react";

const meta: Meta<typeof AppLayoutV1> = {
  title: 'Themes/AppV1',
  component: AppLayoutV1,
  parameters: {
    layout: 'fullscreen',
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * No `leftNav` — with no vertical activity bar passed, the 45px bar is not
 * rendered at all and `main` stretches to the full width. Handy for layouts
 * that only need a header + content (docs, dashboards, single-column apps).
 */
export const NoLeftNav: Story = {
  args: {
    // leftNav intentionally omitted — the vertical bar is hidden and `main`
    // takes the full width.
    header: {
      left: (
        <div className="flex items-center gap-3 px-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              E
            </div>
            <div className="font-bold">Enterprise Suite</div>
          </div>
        </div>
      ),
      center: (
        <div className="flex items-center gap-2 w-full max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all modules..."
              className="pl-9 h-10"
            />
          </div>
        </div>
      ),
      right: (
        <div className="flex items-center gap-2 px-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border" />
          <Avatar className="h-8 w-8">
            <img src="https://github.com/shadcn.png" alt="Admin" />
          </Avatar>
          <div className="text-sm">
            <div className="font-medium">Admin User</div>
          </div>
        </div>
      ),
    },
    main: (
      <div className="h-full overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              No left activity bar — content spans the full width.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Total Users', value: '2,345', change: '+12%' },
              { title: 'Active Sessions', value: '1,234', change: '+8%' },
              { title: 'Revenue', value: '$45,231', change: '+23%' },
              { title: 'Conversions', value: '573', change: '+5%' },
            ].map((stat, i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-md hover:bg-accent">
                  <Avatar className="h-10 w-10">
                    <img src={`https://i.pravatar.cc/150?img=${i}`} alt={`User ${i}`} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">User {i} completed an action</div>
                    <div className="text-sm text-muted-foreground">{i} minutes ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    mainClassName: "bg-background",
    footer: {
      left: <div className="px-4 py-2 text-xs">App Footer</div>,
      className: "border-t bg-card text-card-foreground",
    },
  },
};
