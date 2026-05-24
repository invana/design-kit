import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Panel, Separator } from "react-resizable-panels";

const meta: Meta = {
  title: "ui-kit/others/Direct Resizable",
  parameters: {
    layout: 'fullscreen',
  }
};
export default meta;

type Story = StoryObj;

export const DirectImport: Story = {
  render: () => (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Group orientation="horizontal">
        <Panel defaultSize={50} minSize={20}>
          <div style={{ height: '100%', background: '#3b82f6', padding: '16px', color: 'white' }}>
            <h2>Left Panel (Direct Import)</h2>
            <p>Try dragging the handle →</p>
          </div>
        </Panel>
        <Separator style={{ width: '4px', background: '#666', cursor: 'col-resize' }} />
        <Panel defaultSize={50} minSize={20}>
          <div style={{ height: '100%', background: '#10b981', padding: '16px', color: 'white' }}>
            <h2>Right Panel</h2>
            <p>If this works, the library is fine</p>
          </div>
        </Panel>
      </Group>
    </div>
  ),
};
