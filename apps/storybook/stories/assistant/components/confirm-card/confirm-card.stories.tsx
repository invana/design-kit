import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '@invana/ui';
import { ConfirmCard as ConfirmCardPart, type ConfirmCardProps } from '@invana/assistant';

import data from '../../../../fixtures/assistant/confirm-card.json';
import { inline, json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

interface ConfirmVariant {
  caption: string;
  props: Omit<ConfirmCardProps, 'children'>;
  /** The answers, in order: each a button the consumer composes, sent as its id. */
  buttons: { id: string; label: string; variant?: 'outline' }[];
}

// JSON widens `"strip"` to `string`; the shapes are the card's own.
const VARIANTS = data as unknown as ConfirmVariant[];

interface Args {
  variant: string;
  onClick: (id: string) => void;
}

const meta = {
  title: 'Assistant/Components/ConfirmCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ConfirmCard } from '@invana/assistant';", "import { Button } from '@invana/ui';"],
            picked.map((v) => {
              const { cost, ...rest } = v.props;
              const attrs = [
                ...Object.entries(rest).map(([k, x]) => (typeof x === 'string' ? `${k}="${x}"` : x === true ? k : `${k}={${inline(x)}}`)),
                'cost={cost}',
              ];
              const buttons = v.buttons.map(
                (b) => `  <Button size="xs"${b.variant ? ` variant="${b.variant}"` : ''} onClick={() => onClick(${json(b.id)})}>${b.label}</Button>`,
              );
              return {
                comment: v.caption,
                data: { cost },
                setup: '// Each button is yours: onClick receives the answer it stands for.\nconst onClick = (id) => api.send(id);',
                call: `<ConfirmCard\n${attrs.map((a) => `  ${a}`).join('\n')}\n>\n${buttons.join('\n')}\n</ConfirmCard>`,
              };
            }),
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
 * Yes or no, with what yes costs as figures before the buttons. Records written are inked in
 * the warning colour, because they are the cost that changes something. `costAs="strip"` with
 * `seamless` draws the cost cells divided by rules only, the outer cells flush with the
 * question — as the confirm ask draws it.
 */
export const ConfirmCard: Story = {
  render: ({ variant, onClick }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <ConfirmCardPart {...v.props}>
          {v.buttons.map((b) => (
            <Button
              key={b.id}
              size="xs"
              variant={b.variant}
              onClick={() => {
                onClick(b.id);
                log('onClick', b.id);
              }}
            >
              {b.label}
            </Button>
          ))}
        </ConfirmCardPart>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const c = within(within(canvasElement).getByRole('group', { name: 'Seamless' }));
    await step('Answer yes', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Run it' }));
      await expect(args.onClick).toHaveBeenCalledWith('yes');
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"yes"');
    });
  },
};
