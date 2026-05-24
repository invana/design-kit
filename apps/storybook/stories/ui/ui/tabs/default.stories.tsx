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

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Account</TabsTrigger>
        <TabsTrigger value="tab2">Password</TabsTrigger>
        <TabsTrigger value="tab3">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm text-muted-foreground">Manage your account settings.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm text-muted-foreground">Change your password here.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm text-muted-foreground">Update your preferences.</p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Tabs with card content.
 */
