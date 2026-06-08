import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@invana/ui';
import {
  LayoutDashboard,
  Search,
  Settings,
  Users,
  LifeBuoy,
} from 'lucide-react';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { title: 'Dashboard', icon: LayoutDashboard, active: true },
  { title: 'Explore', icon: Search, active: false },
  { title: 'Team', icon: Users, active: false },
  { title: 'Settings', icon: Settings, active: false },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <div className="h-[400px] w-[600px] flex border rounded-md overflow-hidden">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
                I
              </div>
              <span className="text-sm font-semibold">Invana</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={item.active}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Support">
                  <LifeBuoy />
                  <span>Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex flex-1 flex-col bg-background">
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Dashboard</span>
          </header>
          <div className="flex-1 p-4 text-sm text-muted-foreground">
            Main content area.
          </div>
        </main>
      </div>
    </SidebarProvider>
  ),
};
