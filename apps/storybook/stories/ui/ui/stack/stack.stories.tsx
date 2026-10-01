import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge, Stack, type StackProps } from '@invana/ui';

import STACKS from '../../../../fixtures/ui/stack.json';
import { attrs, jsxWith, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

interface StackVariant {
  caption: string;
  props: Pick<StackProps, 'direction' | 'gap' | 'align' | 'justify' | 'wrap'>;
  items: string[];
}

const VARIANTS = STACKS as StackVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/Stack',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Badge, Stack } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: jsxWith(
                'Stack',
                attrs(v.props),
                v.items.map((item) => `<Badge variant="outline">${item}</Badge>`).join('\n'),
              ),
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
 * Things one after another, a set gap apart — a column by default, or a row, which lines its
 * items up on their centres and can wrap. The gap comes from one short scale (`xs`–`xl`, `md`
 * by default) and a stack draws nothing of its own, so a story or a screen lays out kit parts
 * without writing `flex gap-*`.
 */
export const StackStory: Story = {
  name: 'Stack',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <Stack {...v.props}>
          {v.items.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </Stack>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    for (const v of VARIANTS) {
      const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
      for (const item of v.items) await expect(cell.getByText(item)).toBeVisible();
    }
  },
};
