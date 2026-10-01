import type { Meta, StoryObj } from '@storybook/react-vite';
import { CitationList, CitationRow } from '@invana/ui';

const meta: Meta<typeof CitationList> = {
  title: 'UI/UI Extended/CitationList',
  component: CitationList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Numbered — the sources an answer cites by marker, each with the number of records
 * it contributed at the right.
 */
export const Numbered: Story = {
  render: () => (
    <CitationList>
      <CitationRow marker={1} count="3,406">OMS fills, 22–26 Sep</CitationRow>
      <CitationRow marker={2} count="5 days">Risk factor returns, v4</CitationRow>
    </CitationList>
  ),
};
