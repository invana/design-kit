import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar as AvatarRoot, AvatarFallback, AvatarGroup, AvatarImage, Stack, type AvatarProps } from '@invana/ui';

import data from '../../../../fixtures/ui/avatar.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';
import { Content, contentSource, type Block } from '../_content';

interface AvatarSpec {
  src?: string;
  alt?: string;
  initials: string;
  size?: AvatarProps['size'];
}

interface AvatarVariant extends Variant {
  avatars?: AvatarSpec[];
  /** Several avatars side by side: apart in a `Stack`, or overlapping in an `AvatarGroup`. */
  row?: 'spaced' | 'group';
  /** A group's `max` and `size`. */
  max?: number;
  size?: AvatarProps['size'];
  /** An avatar beside a name — drawn with `Item`. */
  people?: { initials: string; image?: string; name: string; detail: string }[];
}

const VARIANTS = data as AvatarVariant[];


const peopleBlocks = (v: AvatarVariant): Block[] =>
  (v.people ?? []).map((p) => ({ item: { initials: p.initials, image: p.image, title: p.name, description: p.detail } }));

function avatarSource(a: AvatarSpec) {
  return [
    `<Avatar${a.size ? ` size="${a.size}"` : ''}>`,
    a.src ? `  <AvatarImage src="${a.src}"${a.alt ? ` alt="${a.alt}"` : ''} />` : '',
    `  <AvatarFallback>${a.initials}</AvatarFallback>`,
    '</Avatar>',
  ]
    .filter(Boolean)
    .join('\n');
}

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/Avatar',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Avatar, AvatarFallback, AvatarGroup, AvatarImage, Stack } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: v.people
                ? contentSource(peopleBlocks(v))
                : v.row
                  ? [
                      v.row === 'spaced'
                        ? '<Stack direction="row" gap="sm" align="end">'
                        : `<AvatarGroup${v.max ? ` max={${v.max}}` : ''}${v.size ? ` size="${v.size}"` : ''}>`,
                      ...(v.avatars ?? []).map((a) => avatarSource(a).replace(/^/gm, '  ')),
                      v.row === 'spaced' ? '</Stack>' : '</AvatarGroup>',
                    ].join('\n')
                  : (v.avatars ?? []).map(avatarSource).join('\n'),
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

function Avatars({ v }: { v: AvatarVariant }) {
  const avatars = (v.avatars ?? []).map((a) => (
    <AvatarRoot key={a.initials} size={a.size}>
      {a.src ? <AvatarImage src={a.src} alt={a.alt ?? a.initials} /> : null}
      <AvatarFallback>{a.initials}</AvatarFallback>
    </AvatarRoot>
  ));
  if (v.row === 'spaced')
    return (
      <Stack direction="row" gap="sm" align="end">
        {avatars}
      </Stack>
    );
  if (v.row === 'group')
    return (
      <AvatarGroup max={v.max} size={v.size}>
        {avatars}
      </AvatarGroup>
    );
  return <>{avatars}</>;
}

/**
 * A person or an account as an image, or their initials when there is none — sizes, rows,
 * an overlapping group and an avatar beside a name, from `fixtures/ui/avatar.json`. An avatar
 * takes no callbacks. Its size is a class (there is no `size` prop), so those cells say so.
 */
export const Avatar: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (v.people ? <Content blocks={peopleBlocks(v)} /> : <Avatars v={v} />)}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeVisible();
    await expect(within(canvas.getByRole('group', { name: 'Fallback' })).getByText('JD')).toBeVisible();
    await expect(within(canvas.getByRole('group', { name: 'In a row' })).getByText('Sarah Johnson')).toBeVisible();
    // A group past its `max` folds the rest into one `+n`.
    await expect(within(canvas.getByRole('group', { name: 'Group' })).getByText('+3')).toBeVisible();
  },
};
