import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle, CardWithHeader, Button } from '@invana/ui';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export

const meta = {
  title: 'UI/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Card>;


// ===== BASIC CARD EXAMPLES =====

/**
 * Basic card with header and content.
 * Use this as the foundation for any card-based UI.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">2,543</div>
          <p className="text-xs text-green-600">↑ 12% vs last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$12.4K</div>
          <p className="text-xs text-green-600">↑ 8% vs last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">3.24%</div>
          <p className="text-xs text-red-600">↓ 2% vs last week</p>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Comprehensive showcase of all card patterns and layouts.
 * Demonstrates various card structures, use cases, and compositions.
 */
