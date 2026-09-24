import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Switch } from '@invana/forms';
import {
  LayerStrip,
  PanelBox,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@invana/ui';
import * as React from 'react';

import { RUN_BANDS, RUN_BRACKETS, RUN_ITEMS, LAYER_PALETTE } from './_run';

const meta: Meta<typeof LayerStrip> = {
  title: 'UI/UI Extended/LayerStrip',
  component: LayerStrip,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `fit` on and off, in a column you can resize — the way the run dashboard
 * offers it: a `Fit` switch on the panel's header, on by default.
 *
 * **On**, the whole axis fits the column: the track keeps no floor, the label
 * column gives up to 30% of the width, and each axis label is clipped to its
 * slot. Drag the handle and every step stays in view; a bar narrower than its
 * name truncates and its hover card says the rest.
 *
 * **Off**, `minTrackWidth` and `minSlotWidth` hold and the strip scrolls —
 * the reading for measuring bars by eye.
 */
export const FitOrScroll: Story = {
  render: function Render() {
    const [fit, setFit] = React.useState(true);
    return (
      <div className="h-screen w-screen">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={45} minSize={20}>
            <div className="p-3">
              <PanelBox
                title="What each step engaged"
                flush
                aside={
                  <span className="flex items-center gap-2">
                    8 touches
                    <Label htmlFor="layer-strip-fit" className="font-normal">
                      Fit
                    </Label>
                    <Switch
                      id="layer-strip-fit"
                      checked={fit}
                      onCheckedChange={setFit}
                    />
                  </span>
                }
              >
                <LayerStrip
                  palette={LAYER_PALETTE}
                  bands={RUN_BANDS}
                  items={RUN_ITEMS}
                  brackets={RUN_BRACKETS}
                  scale="elapsed"
                  fit={fit}
                />
              </PanelBox>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={10} />
        </ResizablePanelGroup>
      </div>
    );
  },
};
