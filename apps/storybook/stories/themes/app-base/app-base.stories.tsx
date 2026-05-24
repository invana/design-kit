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
  title: 'Themes/app-base',
  component: AppLayoutBase,
  parameters: {
    layout: 'fullscreen',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof AppLayoutBase>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AppLayoutBase with all sections populated.
 * Features a header with logo, search, and user controls,
 * a vertical navigation sidebar, and a footer.
 */
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
export const Enterprise: Story = {
  args: {
    className: 'enterprise-theme',
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
              className="pl-9 h-8"
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
    leftNav: {
      topNavItems: [
        {
          name: 'Dashboard',
          icon: Home,
          onClick: () => console.log('Dashboard'),
        },
        {
          name: 'Users & Teams',
          icon: Users,
          onClick: () => console.log('Users'),
        },
        {
          name: 'Documents',
          icon: FileText,
          onClick: () => console.log('Documents'),
        },
        {
          name: 'Analytics',
          icon: BarChart,
          onClick: () => console.log('Analytics'),
          showSeperator: true,
        },
      ],
      bottomNavItems: [
        {
          name: 'Settings',
          icon: Settings,
          onClick: () => console.log('Settings'),
        },
        {
          name: 'Sign Out',
          icon: LogOut,
          onClick: () => console.log('Logout'),
        },
      ],
    },
    main: (
      <div className="h-full overflow-auto">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-6">
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Enterprise Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Total Revenue', value: '$1.2M', change: '+18.2%', trend: 'up' },
              { title: 'Active Users', value: '12,345', change: '+12.5%', trend: 'up' },
              { title: 'Projects', value: '234', change: '+3.1%', trend: 'up' },
              { title: 'Avg. Response', value: '1.2s', change: '-8.3%', trend: 'down' },
            ].map((stat, i) => (
              <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                  <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-2 text-3xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { user: 'Sarah Chen', action: 'created a new project', time: '2m ago' },
                  { user: 'Mike Johnson', action: 'updated dashboard settings', time: '15m ago' },
                  { user: 'Emma Wilson', action: 'exported monthly report', time: '1h ago' },
                  { user: 'David Lee', action: 'added 3 new team members', time: '2h ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt={activity.user} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">System Status</h2>
              <div className="space-y-4">
                {[
                  { service: 'API Server', status: 'operational', uptime: '99.99%' },
                  { service: 'Database', status: 'operational', uptime: '99.98%' },
                  { service: 'CDN', status: 'operational', uptime: '100%' },
                  { service: 'Email Service', status: 'operational', uptime: '99.95%' },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded bg-accent/50">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="font-medium text-sm">{service.service}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{service.uptime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    footer: {
      left: (
        <div className="text-xs text-muted-foreground px-3 flex items-center gap-4">
          <span>© 2025 Enterprise Suite</span>
          <span className="text-muted-foreground/50">|</span>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
        </div>
      ),
      center: (
        <div className="text-xs text-muted-foreground">
          v2.4.1 • Build 2025.12.23
        </div>
      ),
      right: (
        <div className="text-xs px-3 flex items-center gap-2">
          <span className="text-green-500">●</span>
          <span className="text-muted-foreground">All systems operational</span>
        </div>
      ),
    },
  },
};
