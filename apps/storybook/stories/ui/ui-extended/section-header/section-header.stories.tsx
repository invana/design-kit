import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, SectionHeader } from '@invana/ui';
import { Boxes, Plus } from 'lucide-react';

import VARIANTS from '../../../../fixtures/ui-extended/section-header.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log } from '../../../_story/variant-board';

type Variant = (typeof VARIANTS)[number];

/** JSON names an icon; the story holds the glyph. */
const ICONS = { boxes: <Boxes />, plus: <Plus /> } as const;
type IconName = keyof typeof ICONS;

interface Args {
  variant: string;
  onAction: (title: string) => void;
}

const meta = {
  title: 'UI/UI Extended/SectionHeader',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Button, SectionHeader } from '@invana/ui';", "import { Boxes, Plus } from 'lucide-react';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: v.action
                ? `const [count, setCount] = React.useState(${JSON.stringify(v.count)});\n// onClick receives the click event; the section owns what the action does.\nconst onAdd = () => setCount((n) => n + 1);`
                : undefined,
              call: jsx('SectionHeader', {
                icon: v.icon ? `<${v.icon === 'boxes' ? 'Boxes' : 'Plus'} />` : undefined,
                title: { literal: v.title },
                count: v.action ? 'count' : { literal: String(v.count) },
                bare: v.bare ? 'true' : undefined,
                actions: v.action
                  ? `<Button size="icon-xs" variant="ghost" aria-label="${v.action.label}" onClick={onAdd}><Plus /></Button>`
                  : undefined,
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The section holds its count; the action adds to it as a consumer's would. */
function Live({ v, log, onAction }: { v: Variant; log: Log; onAction: Args['onAction'] }) {
  const [count, setCount] = React.useState(v.count);
  const action = v.action;
  return (
    <SectionHeader
      icon={v.icon ? ICONS[v.icon as IconName] : undefined}
      title={v.title}
      count={String(count)}
      bare={v.bare}
      actions={
        action ? (
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={action.label}
            onClick={() => {
              onAction(v.title);
              log('onClick', { section: v.title, action: action.label });
              setCount((n) => Number(n) + 1);
            }}
          >
            {ICONS[action.icon as IconName]}
          </Button>
        ) : undefined
      }
    />
  );
}

/**
 * Titles a section inside a scrolling panel, from `fixtures/ui-extended/section-header.json`. A
 * count is a fact about the section; an action is something you do to it. Click the add action:
 * the click is logged and the count goes up, as the section's owner would make it.
 */
export const SectionHeaderStory: Story = {
  name: 'SectionHeader',
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} onAction={onAction} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    const cell = within(canvas.getByRole('group', { name: VARIANTS[0].caption }));
    await step('Add a node type', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Add node type' }));
      await expect(args.onAction).toHaveBeenCalledWith('Node types');
      await expect(cell.getByText('5')).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"action": "Add node type"');
    });
  },
};
