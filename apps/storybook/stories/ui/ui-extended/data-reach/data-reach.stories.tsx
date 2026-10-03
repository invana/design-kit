import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataReach as Component, type DataReachModel } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/data-reach.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface ReachVariant extends Variant {
  models: DataReachModel[];
}

const VARIANTS = DATA.variants as ReachVariant[];

interface Args {
  variant: string;
  onRequestAccess: (models: string[]) => void;
}

const meta = {
  title: 'UI/UI Extended/DataReach',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { DataReach } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { models: v.models },
              setup: "// Receives the denied models' ids — what to ask for.\nconst onRequestAccess = (ids) => {};",
              call: jsx('DataReach', { models: 'models', onRequestAccess: 'onRequestAccess' }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onRequestAccess: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The data a session can reach: every published model, the records it sees in each after its
 * slice, what it may do, and what its view is narrowed to. Denied models are listed, muted — they
 * are what a bigger question would need — with a request for them. A count on its way says
 * `counting…`, never zero. Data: `fixtures/ui-extended/data-reach.json`.
 */
export const DataReach: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => (
        <Component
          models={v.models}
          onRequestAccess={(ids) => {
            args.onRequestAccess(ids);
            log('onRequestAccess', ids);
          }}
        />
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Denied models are listed, and the request names them', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Entire world, two models denied' }));
      await expect(cell.getByText('Payroll')).toBeInTheDocument();
      await userEvent.click(cell.getByRole('button', { name: /Request access to 2 models/ }));
      await expect(args.onRequestAccess).toHaveBeenCalledWith(['hr', 'payroll']);
    });
    await step('A count on its way is said, not drawn as zero', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Counts still arriving' }));
      await expect(cell.getAllByText('counting…').length).toBe(2);
    });
  },
};
