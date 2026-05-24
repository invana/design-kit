import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea, Label } from '@invana/forms';

const meta = {
  title: 'UI/UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;


/**
 * Default textarea.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteShowcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="p-8 space-y-8 max-w-3xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="small">Small (default height)</Label>
            <Textarea id="small" placeholder="Small textarea..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medium">Medium</Label>
            <Textarea id="medium" placeholder="Medium textarea..." className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="large">Large</Label>
            <Textarea id="large" placeholder="Large textarea..." className="min-h-[200px]" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="normal">Normal</Label>
            <Textarea id="normal" placeholder="Type something..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="with-value">With Value</Label>
            <Textarea id="with-value" defaultValue="This is some pre-filled content that demonstrates how the textarea looks with text." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-empty">Disabled (Empty)</Label>
            <Textarea id="disabled-empty" placeholder="Disabled textarea" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-filled">Disabled (With Value)</Label>
            <Textarea id="disabled-filled" defaultValue="This textarea is disabled and contains text." disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readonly">Read-only</Label>
            <Textarea id="readonly" defaultValue="This textarea is read-only. You can select and copy but not edit." readOnly />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Common Use Cases</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea id="comment" placeholder="Leave a comment..." />
            <p className="text-sm text-muted-foreground">Your comment will be visible to all members.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself..." className="min-h-[100px]" />
            <p className="text-sm text-muted-foreground">Maximum 500 characters.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea id="description" placeholder="Describe your project..." className="min-h-[150px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea id="feedback" placeholder="Share your feedback..." className="min-h-[120px]" />
            <p className="text-sm text-muted-foreground">We appreciate your feedback!</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">With Validation</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="error">Message (Error)</Label>
            <Textarea id="error" placeholder="Type your message..." className="border-destructive" />
            <p className="text-sm text-destructive">Message is required and must be at least 10 characters.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="success">Message (Valid)</Label>
            <Textarea id="success" defaultValue="This is a valid message with enough content." className="border-green-500" />
            <p className="text-sm text-green-600">✓ Looks good!</p>
          </div>
        </div>
      </div>
    </div>
  ),
};
