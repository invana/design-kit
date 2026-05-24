import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppLayoutBase } from '@invana/themes/app-base/layout';
import { Button, Badge, Avatar } from '@invana/ui';
import { Input } from '@invana/forms';
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  BarChart, 
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  Plus
} from 'lucide-react';

const meta = {
  title: 'Themes/AppBase',
  component: AppLayoutBase,
  parameters: {
    layout: 'fullscreen',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof AppLayoutBase>;


/**
 * Default AppLayoutBase with all sections populated.
 * Features a header with logo, search, and user controls,
 * a vertical navigation sidebar, and a footer.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: {
      left: (
        <div className="flex items-center gap-3 px-3">
          <div className="font-bold text-lg">InvanaApp</div>
        </div>
      ),
      center: (
        <div className="flex items-center gap-2 w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-8"
            />
          </div>
        </div>
      ),
      right: (
        <div className="flex items-center gap-2 px-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <img src="https://github.com/shadcn.png" alt="User" />
          </Avatar>
        </div>
      ),
    },
    leftNav: {
      topNavItems: [
        {
          name: 'Dashboard',
          icon: Home,
          onClick: () => console.log('Dashboard clicked'),
        },
        {
          name: 'Users',
          icon: Users,
          onClick: () => console.log('Users clicked'),
        },
        {
          name: 'Documents',
          icon: FileText,
          onClick: () => console.log('Documents clicked'),
        },
        {
          name: 'Analytics',
          icon: BarChart,
          onClick: () => console.log('Analytics clicked'),
          showSeperator: true,
        },
      ],
      bottomNavItems: [
        {
          name: 'Settings',
          icon: Settings,
          onClick: () => console.log('Settings clicked'),
        },
        {
          name: 'Logout',
          icon: LogOut,
          onClick: () => console.log('Logout clicked'),
        },
      ],
    },
    main: (
      <div className="h-full overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your application dashboard</p>
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
    footer: {
      left: (
        <div className="text-xs text-muted-foreground px-3">
          © 2025 InvanaApp
        </div>
      ),
      center: (
        <div className="text-xs text-muted-foreground">
          v1.0.0
        </div>
      ),
      right: (
        <div className="text-xs text-muted-foreground px-3">
          Status: <span className="text-green-500">●</span> All systems operational
        </div>
      ),
    },
  },
};

/**
 * Full-featured enterprise layout.
 * Complete example with all features and realistic content.
 */
