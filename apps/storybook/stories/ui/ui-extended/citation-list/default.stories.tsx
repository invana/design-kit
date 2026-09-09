import type { Meta, StoryObj } from '@storybook/react-vite';
import { CitationList, CitationRow } from '@invana/ui';

const meta: Meta<typeof CitationList> = {
  title: 'UI/UI Extended/CitationList',
  component: CitationList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Kind first — it tells the reader whether the claim rests on the right sort of evidence. */
export const Default: Story = {
  render: () => (
    <div className="w-[480px] border border-border bg-card p-2">
      <CitationList>
        <CitationRow kind="Article" source="07:12">Brent slides 2% as OPEC+ signals October hike · Reuters</CitationRow>
        <CitationRow kind="Bar" source="bars-5m">BPCL 09:15–09:45 · 5-min · volume 2.4×</CitationRow>
        <CitationRow kind="Event" source="macro">none today · RBI policy is Wed 10 Sep</CitationRow>
      </CitationList>
    </div>
  ),
};
