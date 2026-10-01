import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  Separator as SeparatorPart,
  TypographyH6,
  TypographyMuted,
} from '@invana/ui';

import data from '../../../../fixtures/ui/separator.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface SeparatorVariant extends Variant {
  orientation: 'horizontal' | 'vertical';
  sections?: { title: string; body: string }[];
  items?: string[];
  menu?: string[][];
}

const VARIANTS = data as SeparatorVariant[];

interface Args {
  variant: string;
}

/** The call for one variant, as a consumer writes it. */
function callFor(v: SeparatorVariant): string {
  if (v.sections)
    return v.sections
      .map((s) => `<TypographyH6>${s.title}</TypographyH6>\n<TypographyMuted>${s.body}</TypographyMuted>`)
      .join('\n<Separator />\n');
  if (v.items)
    return ['<Item size="xs">', v.items.map((i) => `  <ItemTitle>${i}</ItemTitle>`).join('\n  <Separator orientation="vertical" />\n'), '</Item>'].join('\n');
  return [
    '<ItemGroup>',
    (v.menu ?? [])
      .map((g) => g.map((i) => `  <Item size="xs"><ItemTitle>${i}</ItemTitle></Item>`).join('\n'))
      .join('\n  <ItemSeparator />\n'),
    '</ItemGroup>',
  ].join('\n');
}

const meta = {
  title: 'UI/UI/Separator',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Item, ItemGroup, ItemSeparator, ItemTitle, Separator, TypographyH6, TypographyMuted } from '@invana/ui';"],
            picked.map((v) => ({ comment: v.caption, call: callFor(v) })),
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

function Draw({ v }: { v: SeparatorVariant }) {
  if (v.sections)
    return (
      <>
        {v.sections.map((s, i) => (
          <React.Fragment key={s.title}>
            {i > 0 ? <SeparatorPart /> : null}
            <TypographyH6>{s.title}</TypographyH6>
            <TypographyMuted>{s.body}</TypographyMuted>
          </React.Fragment>
        ))}
      </>
    );
  if (v.items)
    return (
      <Item size="xs">
        {v.items.map((label, i) => (
          <React.Fragment key={label}>
            {/* Kit gap: a vertical Separator is `h-full`, which an auto-height row cannot resolve. */}
            {i > 0 ? <SeparatorPart orientation="vertical" className="h-5" /> : null}
            <ItemTitle>{label}</ItemTitle>
          </React.Fragment>
        ))}
      </Item>
    );
  return (
    <ItemGroup>
      {(v.menu ?? []).map((group, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <ItemSeparator /> : null}
          {group.map((label) => (
            <Item key={label} size="xs">
              <ItemTitle>{label}</ItemTitle>
            </Item>
          ))}
        </React.Fragment>
      ))}
    </ItemGroup>
  );
}

/**
 * A rule between things — every variant from `fixtures/ui/separator.json`: between two
 * sections, between items in a row, and between groups of a menu. No callbacks.
 */
export const Separator: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => <Draw v={v} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = canvas.getByRole('group', { name: v.caption });
      await expect(cell.querySelector('[data-orientation]')).not.toBeNull();
    }
    await expect(
      within(canvas.getByRole('group', { name: 'Vertical' })).getByText('Item 3'),
    ).toBeInTheDocument();
  },
};
