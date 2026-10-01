import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterBar, MultiFilterChip } from '@invana/ui';

const meta: Meta<typeof FilterBar> = {
  title: 'UI/UI Extended/FilterBar',
  component: FilterBar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `MultiFilterChip` is a `FilterChip` with its menu. Many picks by default —
 * the chip reads the one value, or `2 selected` — or one at a time with
 * `multiple={false}`, where picking the current choice again clears it. A set
 * chip carries the × that clears it without opening the menu.
 *
 * The tables' filter row is built from these.
 */
export const MultiFilterChips: Story = {
  render: function Render() {
    const [kinds, setKinds] = React.useState<string[]>(['import', 'bulk']);
    const [agents, setAgents] = React.useState<string[]>([]);
    const [since, setSince] = React.useState<string[]>(['today']);
    return (
      <FilterBar summary="12 of 40 runs">
        <MultiFilterChip
          label="kind"
          options={['ask', 'import', 'bulk', 'stitch', 'enrich']}
          value={kinds}
          onChange={setKinds}
        />
        <MultiFilterChip
          label="agent"
          options={['Analyst', 'Loader', 'Modeller', 'Reviewer']}
          value={agents}
          onChange={setAgents}
        />
        <MultiFilterChip
          label="since"
          multiple={false}
          options={[
            { value: 'hour', label: 'last hour' },
            { value: 'today', label: 'today' },
            { value: 'week', label: 'this week' },
          ]}
          value={since}
          onChange={setSince}
        />
      </FilterBar>
    );
  },
};
