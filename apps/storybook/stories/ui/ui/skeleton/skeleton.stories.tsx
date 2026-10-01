import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Item, ItemContent, ItemMedia, Skeleton as SkeletonPart } from '@invana/ui';

import data from '../../../../fixtures/ui/skeleton.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface Shape {
  width: number | string;
  height: number;
  round?: boolean;
}

interface SkeletonVariant extends Variant {
  media: Shape;
  heading: Shape[];
  body: Shape[];
}

const VARIANTS = data as SkeletonVariant[];

interface Args {
  variant: string;
}

/**
 * Kit gap: `Skeleton` takes no size or shape, only `className`. The story sizes each bar from
 * the JSON with `style` rather than inventing classes.
 */
const styleOf = (s: Shape) => ({ width: s.width, height: s.height, borderRadius: s.round ? 9999 : undefined });

const meta = {
  title: 'UI/UI/Skeleton',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Item, ItemContent, ItemMedia, Skeleton } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: [
                '<Item>',
                `  <ItemMedia><Skeleton style={${inline(styleOf(v.media))}} /></ItemMedia>`,
                '  <ItemContent>',
                ...v.heading.map((s) => `    <Skeleton style={${inline(styleOf(s))}} />`),
                '  </ItemContent>',
                '</Item>',
                ...v.body.map((s) => `<Skeleton style={${inline(styleOf(s))}} />`),
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
 * A placeholder in the shape of what is loading — from `fixtures/ui/skeleton.json`: a row's
 * avatar and two lines of heading, then three lines of text and a block. No callbacks.
 */
export const Skeleton: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <>
          <Item>
            <ItemMedia>
              <SkeletonPart style={styleOf(v.media)} />
            </ItemMedia>
            <ItemContent>
              {v.heading.map((s, i) => (
                <SkeletonPart key={i} style={styleOf(s)} />
              ))}
            </ItemContent>
          </Item>
          {v.body.map((s, i) => (
            <SkeletonPart key={i} style={styleOf(s)} />
          ))}
        </>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = canvas.getByRole('group', { name: v.caption });
      await expect(cell.querySelectorAll('.animate-pulse')).toHaveLength(1 + v.heading.length + v.body.length);
    }
  },
};
