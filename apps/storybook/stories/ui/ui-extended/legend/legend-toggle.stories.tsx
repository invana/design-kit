import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Legend, LegendItem } from '@invana/ui';

const meta = {
  title: 'UI/UI Extended/LegendToggle',
  parameters: { layout: 'padded' }
} satisfies Meta;

export default meta;
type Story = StoryObj;

const TYPES = [
  { label: 'character', kind: 'dot' as const, color: 'var(--color-data-1)', count: '77' },
  { label: 'location', kind: 'dot' as const, color: 'var(--color-data-2)', count: '12' },
  { label: 'co-appears-with', kind: 'line' as const, count: '254' }
];

/**
 * A legend whose entries hide and show their type. Each entry is a toggle: hover shows it can be
 * pressed, a click hides what it stands for and the entry stays in the legend, muted — dimmed
 * swatch, struck-through label — so it can be brought back from the same place.
 */
export const LegendToggle: Story = {
  render: function Render() {
    const [hidden, setHidden] = useState<string[]>(['location']);
    return (
      <Legend orientation="column">
        {TYPES.map((t) => (
          <LegendItem
            key={t.label}
            {...t}
            pressed={!hidden.includes(t.label)}
            onToggle={() => setHidden((h) => (h.includes(t.label) ? h.filter((x) => x !== t.label) : [...h, t.label]))}
            title={`${hidden.includes(t.label) ? 'Show' : 'Hide'} ${t.label}`}
          />
        ))}
      </Legend>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const character = canvas.getByRole('button', { name: /character/ });
    await expect(character).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(character);
    await expect(character).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('button', { name: /location/ })).toHaveAttribute('aria-pressed', 'false');
  }
};
