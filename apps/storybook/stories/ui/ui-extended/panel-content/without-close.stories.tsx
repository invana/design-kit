import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent } from '@invana/ui';

const meta: Meta<typeof PanelContent> = {
  title: 'UI/UI Extended/PanelContent',
  component: PanelContent,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A panel that is part of the layout rather than something the user dismisses:
 * list no close item in `headerActions` and the header carries the title
 * alone.
 */
export const WithoutClose: Story = {
  render: () => (
    <div className="h-[240px] w-[340px] rounded-md border">
      <PanelContent titleText="Outline">
        <p className="text-muted-foreground">
          A docked panel has nowhere to close to, so it shows no close button.
        </p>
      </PanelContent>
    </div>
  ),
};
