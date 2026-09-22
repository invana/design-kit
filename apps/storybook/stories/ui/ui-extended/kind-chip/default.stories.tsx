import type { Meta, StoryObj } from '@storybook/react-vite';
import { KindChip, PropertyList, PropertyRow } from '@invana/ui';

const meta: Meta<typeof KindChip> = {
  title: 'UI/UI Extended/KindChip',
  component: KindChip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const KINDS: [string, string][] = [
  ['ask', 'a question answered against the graph'],
  ['import', 'one dataset loaded into a model'],
  ['bulk', 'several imports under one run'],
  ['stitch', 'two models bound under a shared ontology'],
  ['enrich', 'a third party asked, under a guardrail'],
  ['simulate', 'a kind the kit has never heard of — and still draws'],
];

/**
 * What kind of run a row is. Five kinds ship, and the sixth is the point: the
 * vocabulary belongs to the product, so an unknown value renders rather than
 * throwing the journal off.
 *
 * Neutral on purpose — a kind is not a status. Every one of these is equally
 * ordinary, and the row already carries a status dot to say how it ended.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[440px]">
      <PropertyList labelWidth={92}>
        {KINDS.map(([kind, what]) => (
          <PropertyRow key={kind} label={<KindChip kind={kind} />}>
            {what}
          </PropertyRow>
        ))}
      </PropertyList>
    </div>
  ),
};
