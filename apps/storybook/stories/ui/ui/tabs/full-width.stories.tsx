import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardContent } from '@invana/ui';

const meta = {
  title: 'UI/UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;


/**
 * Basic tabs with simple content.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
        <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
        <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <p className="text-sm text-muted-foreground">All items</p>
      </TabsContent>
      <TabsContent value="active">
        <p className="text-sm text-muted-foreground">Active items only</p>
      </TabsContent>
      <TabsContent value="completed">
        <p className="text-sm text-muted-foreground">Completed items only</p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Comprehensive showcase of all tab variations and use cases.
 */
