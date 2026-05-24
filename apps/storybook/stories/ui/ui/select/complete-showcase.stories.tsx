import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label } from '@invana/forms';

const meta: Meta<typeof Select> = {
  title: 'UI/UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Basic select dropdown.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteShowcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="p-8 space-y-8 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Selects</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Default</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Disabled select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Different Widths</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Small (180px)</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Small" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Medium (300px)</Label>
            <Select>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="md">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Full Width</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Full width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Common Use Cases</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                <SelectItem value="au">🇦🇺 Australia</SelectItem>
                <SelectItem value="de">🇩🇪 Germany</SelectItem>
                <SelectItem value="fr">🇫🇷 France</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Set priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="high">🔴 High</SelectItem>
                <SelectItem value="critical">🔥 Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">📝 Draft</SelectItem>
                <SelectItem value="review">👀 In Review</SelectItem>
                <SelectItem value="approved">✅ Approved</SelectItem>
                <SelectItem value="rejected">❌ Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">PST (UTC-8)</SelectItem>
                <SelectItem value="mst">MST (UTC-7)</SelectItem>
                <SelectItem value="cst">CST (UTC-6)</SelectItem>
                <SelectItem value="est">EST (UTC-5)</SelectItem>
                <SelectItem value="gmt">GMT (UTC+0)</SelectItem>
                <SelectItem value="cet">CET (UTC+1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">With Helper Text</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <Select>
              <SelectTrigger id="language">
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This will be used for all communications.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
