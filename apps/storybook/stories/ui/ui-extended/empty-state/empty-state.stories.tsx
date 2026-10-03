import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Boxes, Database, Search } from 'lucide-react';
import { Button, EmptyState as Component, EmptyStateLock } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/empty-state.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

/** The kit ships no icon set; the story supplies the ones JSON names. */
const ICONS = { database: Database, boxes: Boxes, search: Search };
const ICON_NAMES = { database: 'Database', boxes: 'Boxes', search: 'Search' };
type IconName = keyof typeof ICONS;

interface EmptyVariant extends Variant {
  icon: IconName;
  props: { title: string; description: string };
  /** The one thing that unlocks the surface. */
  action: string;
  locks: { icon: IconName; text: string }[];
}

const VARIANTS = VARIANTS_JSON as EmptyVariant[];

interface Args {
  variant: string;
  /** The action button — what the consumer starts. */
  onClick: () => void;
}

const meta = {
  title: 'UI/UI Extended/EmptyState',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              `import { ${[...new Set(picked.flatMap((v) => [v.icon, ...v.locks.map((l) => l.icon)]))].map((i) => ICON_NAMES[i]).join(', ')} } from 'lucide-react';`,
              "import { Button, EmptyState, EmptyStateLock } from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: '// Receives the click event — start the step the screen is waiting on.\nconst onClick = () => {};',
              call: [
                '<EmptyState',
                `  icon={<${ICON_NAMES[v.icon]} size={32} />}`,
                `  title="${v.props.title}"`,
                `  description="${v.props.description}"`,
                `  actions={<Button size="sm" onClick={onClick}>${v.action}</Button>}`,
                '  locks={',
                '    <>',
                ...v.locks.map((l) => `      <EmptyStateLock icon={<${ICON_NAMES[l.icon]} />}>${l.text}</EmptyStateLock>`),
                '    </>',
                '  }',
                '/>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Naming what unlocks each surface turns an empty screen into a sequence: the one action that
 * moves it on, then each lock with the step that opens it.
 */
export const EmptyState: Story = {
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => {
        const Icon = ICONS[v.icon];
        return (
          <Component
            icon={<Icon size={32} />}
            {...v.props}
            actions={
              <Button
                size="sm"
                onClick={() => {
                  onClick();
                  log('onClick', v.action);
                }}
              >
                {v.action}
              </Button>
            }
            locks={v.locks.map((l) => {
              const LockIcon = ICONS[l.icon];
              return (
                <EmptyStateLock key={l.text} icon={<LockIcon />}>
                  {l.text}
                </EmptyStateLock>
              );
            })}
          />
        );
      }}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const v = VARIANTS[0]!;
    const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
    await step('Start the first step', async () => {
      await userEvent.click(cell.getByRole('button', { name: v.action }));
      await expect(args.onClick).toHaveBeenCalled();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent(v.action);
    });
  },
};
