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

export const CompleteShowcase: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-6">Card Component Showcase</h2>
      </div>

      {/* Basic Structures */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Structures</h3>
        <div className="grid grid-cols-3 gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Header Only</CardTitle>
            </CardHeader>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Header + Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="">Content area with text.</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Complete Card</CardTitle>
              <CardDescription>With all sections</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="">Content goes here.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Metrics Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Metrics & Statistics</h3>
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className=" font-medium">Total Users</CardTitle>
              <span className="text-xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,543</div>
              <p className="text-xs text-green-600 mt-1">↑ 12.5%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className=" font-medium">Revenue</CardTitle>
              <span className="text-xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45.2K</div>
              <p className="text-xs text-green-600 mt-1">↑ 8.3%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className=" font-medium">Conversion</CardTitle>
              <span className="text-xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.24%</div>
              <p className="text-xs text-red-600 mt-1">↓ 2.1%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className=" font-medium">Active Now</CardTitle>
              <span className="text-xl">🟢</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground mt-1">users online</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Feature Cards</h3>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-2">⚡</div>
              <CardTitle>Fast Performance</CardTitle>
              <CardDescription>Lightning-fast load times</CardDescription>
            </CardHeader>
            <CardContent>
              <p className=" text-muted-foreground">
                Optimized for speed and efficiency in all operations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-2">🔒</div>
              <CardTitle>Secure by Default</CardTitle>
              <CardDescription>Enterprise-grade security</CardDescription>
            </CardHeader>
            <CardContent>
              <p className=" text-muted-foreground">
                Built with security best practices from the ground up.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-2">🎨</div>
              <CardTitle>Customizable</CardTitle>
              <CardDescription>Fully themeable</CardDescription>
            </CardHeader>
            <CardContent>
              <p className=" text-muted-foreground">
                Customize colors, spacing, and layouts to match your brand.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">User Profile Cards</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">👤</div>
                <div>
                  <CardTitle>Sarah Johnson</CardTitle>
                  <CardDescription>Product Designer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 ">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>sarah.j@company.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="sm">View Profile</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">👤</div>
                <div>
                  <CardTitle>Michael Chen</CardTitle>
                  <CardDescription>Software Engineer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 ">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>m.chen@company.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>New York, NY</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="sm">View Profile</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  ),
};

// ===== COLORED HEADER CARDS (BOOTSTRAP-STYLE) =====

/**
 * Card with primary colored header using CardWithHeader component.
 * Bootstrap-style card with colored header and white content area.
 */
