import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge as BadgeRoot, PropertyList, PropertyRow } from '@invana/ui';

import data from '../../../../fixtures/ui/badge.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';
import { Badges, badgeSource, type BadgeSpec } from '../_content';

type Treatment = NonNullable<BadgeSpec['variant']>;
type Tone = NonNullable<BadgeSpec['tone']>;

interface BadgeVariant extends Variant {
  badges?: BadgeSpec[];
  /** Each size beside what it is for. */
  sizes?: { badge: BadgeSpec; why: string }[];
  /** `variant` (the treatment) crossed with `tone` (the meaning). */
  tones?: { variants: Treatment[]; tones: Tone[] };
}

const VARIANTS = data as BadgeVariant[];

const crossed = (variant: Treatment, tones: Tone[]): BadgeSpec[] =>
  tones.map((tone) => ({ label: tone, variant, tone, size: 'sm' }));

function call(v: BadgeVariant) {
  if (v.sizes) return v.sizes.map((s) => `${badgeSource(s.badge)} {/* ${s.why} */}`).join('\n');
  if (v.tones) return v.tones.variants.flatMap((t) => crossed(t, v.tones!.tones).map(badgeSource)).join('\n');
  return (v.badges ?? []).map(badgeSource).join('\n');
}

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/Badge',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Badge } from '@invana/ui';"],
            picked.map((v) => ({ comment: v.caption, call: call(v) })),
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
 * A short label on a thing — each treatment, both sizes, `variant` crossed with `tone`, and
 * the sets real screens use (status, priority, tags, counts), from `fixtures/ui/badge.json`.
 * `tone` is the meaning and `variant` the treatment; `secondary` and `destructive` are
 * already a colour, so `tone` does not apply to them. A badge takes no callbacks.
 */
export const Badge: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) =>
        v.sizes ? (
          <PropertyList labelWidth="auto">
            {v.sizes.map((s) => (
              <PropertyRow
                key={s.badge.size}
                label={
                  <BadgeRoot variant={s.badge.variant} tone={s.badge.tone} size={s.badge.size}>
                    {s.badge.label}
                  </BadgeRoot>
                }
              >
                {s.why}
              </PropertyRow>
            ))}
          </PropertyList>
        ) : v.tones ? (
          <PropertyList labelWidth="auto">
            {v.tones.variants.map((t) => (
              <PropertyRow key={t} label={t}>
                <Badges badges={crossed(t, v.tones!.tones)} />
              </PropertyRow>
            ))}
          </PropertyList>
        ) : (
          <div>
            <Badges badges={v.badges ?? []} />
          </div>
        )
      }
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = canvas.getByRole('group', { name: v.caption });
      for (const b of v.badges ?? []) await expect(cell).toHaveTextContent(b.label);
    }
  },
};
