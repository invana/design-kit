import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState, TabbedPanel, ToggleGroup, ToggleGroupItem } from '@invana/ui';

const meta: Meta<typeof TabbedPanel> = {
  title: 'UI/UI Extended/TabbedPanel',
  component: TabbedPanel,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `headerContent` — a control on the right of the strip that applies to every
 * tab. Here, the window a plan's numbers are read over: switching tabs keeps it.
 */
export const WithHeaderContent: Story = {
  render: function Render() {
    const [window, setWindow] = React.useState('30 days');
    const body = (tab: string) => (
      <EmptyState title={tab} description={`Read over the last ${window}.`} />
    );
    return (
      <div className="h-[260px] w-[640px]">
        <TabbedPanel
          tabs={['Overview', 'Layers', 'Flow', 'Activity'].map((t) => ({
            value: t.toLowerCase(),
            label: t,
            content: body(t),
          }))}
          headerContent={
            <ToggleGroup type="single" size="sm" value={window} onValueChange={(v: string) => v && setWindow(v)}>
              {['7 days', '30 days', '90 days'].map((w) => (
                <ToggleGroupItem key={w} value={w}>
                  {w}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          }
        />
      </div>
    );
  },
};
