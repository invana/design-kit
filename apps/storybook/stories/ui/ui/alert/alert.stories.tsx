import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Alert as AlertRoot, AlertDescription, AlertTitle } from '@invana/ui';

import data from '../../../../fixtures/ui/alert.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';
import { Icon, iconTag, type IconName } from '../_content';

interface AlertVariant extends Variant {
  variant?: 'default' | 'destructive';
  /** What it means: the border, a faint ground and the icon take the tone. */
  tone?: 'info' | 'success' | 'warning' | 'destructive';
  icon?: IconName;
  title?: string;
  description?: string;
}

const VARIANTS = data as AlertVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/Alert',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Alert, AlertDescription, AlertTitle } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: [
                `<Alert${v.variant ? ` variant="${v.variant}"` : ''}${v.tone ? ` tone="${v.tone}"` : ''}>`,
                v.icon ? `  <${iconTag(v.icon)} />` : '',
                v.title ? `  <AlertTitle>${v.title}</AlertTitle>` : '',
                v.description ? `  <AlertDescription>${v.description}</AlertDescription>` : '',
                '</Alert>',
              ]
                .filter(Boolean)
                .join('\n'),
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
 * A message in the flow of a page — default and destructive, with or without a title, a
 * description or an icon, and the everyday cases (success, failure, information, warning),
 * from `fixtures/ui/alert.json`. An alert takes no callbacks.
 */
export const Alert: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <AlertRoot variant={v.variant} tone={v.tone}>
          <Icon name={v.icon} />
          {v.title ? <AlertTitle>{v.title}</AlertTitle> : null}
          {v.description ? <AlertDescription>{v.description}</AlertDescription> : null}
        </AlertRoot>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      await expect(cell.getByRole('alert')).toHaveTextContent(v.title ?? v.description ?? '');
    }
  },
};
