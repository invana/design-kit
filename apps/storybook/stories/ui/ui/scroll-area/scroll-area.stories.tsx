import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Item, ItemContent, ItemGroup, ItemSeparator, ItemTitle, PanelBox, ScrollArea as ScrollAreaRoot } from '@invana/ui';

import data from '../../../../fixtures/ui/scroll-area.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface ScrollAreaVariant extends Variant {
  /** The viewport's height in px — ScrollArea takes no size prop, so the story passes it as `style`. */
  height: number;
  title: string;
  tags: string[];
}

const VARIANTS = data as ScrollAreaVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/ScrollArea',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Item, ItemContent, ItemGroup, ItemSeparator, ItemTitle, PanelBox, ScrollArea } from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { tags: v.tags },
              call: [
                `<PanelBox title="${v.title}" flush>`,
                `  <ScrollArea style={{ height: ${v.height} }}>`,
                '    <ItemGroup>',
                '      {tags.map((tag, i) => (',
                '        <React.Fragment key={tag}>',
                '          {i > 0 ? <ItemSeparator /> : null}',
                '          <Item size="xs">',
                '            <ItemContent>',
                '              <ItemTitle>{tag}</ItemTitle>',
                '            </ItemContent>',
                '          </Item>',
                '        </React.Fragment>',
                '      ))}',
                '    </ItemGroup>',
                '  </ScrollArea>',
                '</PanelBox>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A themed scroller over content taller than its box, from `fixtures/ui/scroll-area.json`:
 * forty release tags in a 288px viewport.
 */
export const ScrollArea: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PanelBox title={v.title} flush>
          <ScrollAreaRoot style={{ height: v.height }}>
            <ItemGroup>
              {v.tags.map((tag, i) => (
                <React.Fragment key={tag}>
                  {i > 0 ? <ItemSeparator /> : null}
                  <Item size="xs">
                    <ItemContent>
                      <ItemTitle>{tag}</ItemTitle>
                    </ItemContent>
                  </Item>
                </React.Fragment>
              ))}
            </ItemGroup>
          </ScrollAreaRoot>
        </PanelBox>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await expect(cell.getByText('v1.2.0-beta.1')).toBeInTheDocument();
    await expect(cell.getByText('v1.2.0-beta.40')).toBeInTheDocument();
  },
};
