import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AddressChip as Component, PropertyList, PropertyRow, type AddressTone } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/address-chip.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface Chip {
  address: string;
  tone?: AddressTone;
  /** What the tone means here — written beside the chip. */
  note?: string;
}

interface AddressVariant extends Variant {
  chips: Chip[];
  /** Label column width, when the chips sit beside notes. */
  labelWidth?: number;
  /** Wire `onOpen`, so the chip is a button. */
  open?: boolean;
}

const VARIANTS = VARIANTS_JSON as AddressVariant[];

interface Args {
  variant: string;
  onOpen: (address: string) => void;
}

const chipCall = (c: Chip, open?: boolean) =>
  jsx('AddressChip', {
    address: { literal: c.address },
    tone: c.tone ? { literal: c.tone } : undefined,
    onOpen: open ? 'onOpen' : undefined,
  });

const meta = {
  title: 'UI/UI Extended/AddressChip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AddressChip, PropertyList, PropertyRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: v.open ? '// Receives the full address, however much of it the chip could show.\nconst onOpen = (address) => {};' : undefined,
              call: v.labelWidth
                ? [
                    `<PropertyList labelWidth={${v.labelWidth}}>`,
                    ...v.chips.map((c) => `  <PropertyRow label={${chipCall(c)}}>${c.note}</PropertyRow>`),
                    '</PropertyList>',
                  ].join('\n')
                : v.chips.map((c) => chipCall(c, v.open)).join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpen: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The address is the only identifier there is — the lens matches on it, the ledger records it,
 * the run drawing expands it — so it has to survive a narrow column without becoming three copies
 * of the same string.
 *
 * **It truncates in the middle, not the end.** The last segment is *which thing* and the ones
 * before it are *which kind*, and the kind is usually already carried by the `LayerChip` beside
 * it — so the kind is what gives way. The 200px cell is the stress test: a plain `truncate` would
 * render every model as `graph_data/model/…`, one row repeated. The head never collapses past
 * `g…`; below about 26 characters even the participant has to clip.
 *
 * **`denied` and `refused` are two facts.** Denied is what the rule says; refused is what
 * happened when a run reached for it. Only the event is struck through.
 *
 * With `onOpen` the chip is a button that hands back the full address.
 */
export const AddressChip: Story = {
  render: ({ variant, onOpen }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) =>
        v.labelWidth ? (
          <PropertyList labelWidth={v.labelWidth}>
            {v.chips.map((c) => (
              <PropertyRow key={c.address} label={<Component address={c.address} tone={c.tone} />}>
                {c.note}
              </PropertyRow>
            ))}
          </PropertyList>
        ) : (
          v.chips.map((c) => (
            <Component
              key={c.address}
              address={c.address}
              tone={c.tone}
              onOpen={
                v.open
                  ? (address) => {
                      onOpen(address);
                      log('onOpen', address);
                    }
                  : undefined
              }
            />
          ))
        )
      }
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Opens what it names' }));
    const address = 'graph_data/stitch/tweet_article@about';
    await step('Open the refused address', async () => {
      await userEvent.click(cell.getByTitle(address));
      await expect(args.onOpen).toHaveBeenCalledWith(address);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent(address);
    });
  },
};
