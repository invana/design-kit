import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardContent } from '@invana/ui';

const meta: Meta<typeof Tabs> = {
  title: 'UI/UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Basic tabs with simple content.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteShowcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Tabs</h3>
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <p className="text-sm">Content for Tab 1</p>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <p className="text-sm">Content for Tab 2</p>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <p className="text-sm">Content for Tab 3</p>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Tabs with Cards</h3>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Dashboard overview with key metrics and recent activity.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Detailed analytics and performance data visualization.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Generate and download comprehensive reports.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Configure your preferences and account settings.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Full Width Tabs</h3>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
            <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <p className="text-sm text-muted-foreground">Showing all items</p>
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <p className="text-sm text-muted-foreground">Showing active items only</p>
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <p className="text-sm text-muted-foreground">Showing completed items</p>
          </TabsContent>
          <TabsContent value="archived" className="mt-4">
            <p className="text-sm text-muted-foreground">Showing archived items</p>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Navigation Tabs</h3>
        <Tabs defaultValue="home" className="w-full">
          <TabsList>
            <TabsTrigger value="home">🏠 Home</TabsTrigger>
            <TabsTrigger value="profile">👤 Profile</TabsTrigger>
            <TabsTrigger value="messages">💬 Messages</TabsTrigger>
            <TabsTrigger value="notifications">🔔 Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="home" className="mt-4">
            <Card>
              <CardContent className="">
                <p className="text-sm">Home feed and recent updates</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardContent className="">
                <p className="text-sm">Your profile information</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messages" className="mt-4">
            <Card>
              <CardContent className="">
                <p className="text-sm">Your conversations and messages</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="mt-4">
            <Card>
              <CardContent className="">
                <p className="text-sm">Recent notifications and alerts</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Many Tabs</h3>
        <Tabs defaultValue="1" className="w-full">
          <TabsList>
            <TabsTrigger value="1">Tab 1</TabsTrigger>
            <TabsTrigger value="2">Tab 2</TabsTrigger>
            <TabsTrigger value="3">Tab 3</TabsTrigger>
            <TabsTrigger value="4">Tab 4</TabsTrigger>
            <TabsTrigger value="5">Tab 5</TabsTrigger>
            <TabsTrigger value="6">Tab 6</TabsTrigger>
          </TabsList>
          <TabsContent value="1" className="mt-4">
            <p className="text-sm">Content 1</p>
          </TabsContent>
          <TabsContent value="2" className="mt-4">
            <p className="text-sm">Content 2</p>
          </TabsContent>
          <TabsContent value="3" className="mt-4">
            <p className="text-sm">Content 3</p>
          </TabsContent>
          <TabsContent value="4" className="mt-4">
            <p className="text-sm">Content 4</p>
          </TabsContent>
          <TabsContent value="5" className="mt-4">
            <p className="text-sm">Content 5</p>
          </TabsContent>
          <TabsContent value="6" className="mt-4">
            <p className="text-sm">Content 6</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};
