import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Others/DataPalette',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SLOTS = [
  { slot: 1, hue: 'blue' },
  { slot: 2, hue: 'orange' },
  { slot: 3, hue: 'aqua' },
  { slot: 4, hue: 'yellow' },
  { slot: 5, hue: 'magenta' },
  { slot: 6, hue: 'green' },
  { slot: 7, hue: 'violet' },
  { slot: 8, hue: 'red' },
];

/**
 * The categorical data palette — eight hues in a fixed order, from
 * `@invana/styling/themes/data-palette.css`.
 *
 * One scale for every categorical encoding in the system: node and edge type
 * dots, chart series, legends. A colour therefore means the same thing wherever
 * it appears — the dot beside `Observation` in a panel is the colour the canvas
 * paints that node with.
 *
 * **Assign in fixed order, never cycled by rank.** Slot 1 is the first entity,
 * not whichever row the query returned first: a filter that removes a series
 * must not repaint the survivors.
 *
 * **Both modes are selected.** The dark values are the same eight hues
 * re-stepped for a dark surface, not an automatic flip — switch the Storybook
 * theme to see them.
 *
 * **Identity is never colour alone.** Every swatch here is named, and so is
 * every use: a legend row carries its type name, a canvas node its label. Three
 * light-mode slots sit below 3:1 on a near-white card, which is admissible only
 * under that rule.
 */
export const Swatches: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-3">
        {SLOTS.map(({ slot, hue }) => (
          <div key={slot} className="flex flex-col gap-1.5">
            <div
              className="h-16 w-full border border-border"
              style={{ backgroundColor: `var(--color-data-${slot})` }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Slot {slot}</p>
              <p className="font-mono text-xs text-muted-foreground">
                --color-data-{slot}
              </p>
              <p className="text-xs text-muted-foreground">{hue}</p>
            </div>
          </div>
        ))}
      </div>

      {/* The shape the palette is actually consumed in: a dot beside a name. */}
      <div className="w-64 border border-border bg-card">
        <p className="border-b border-border px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
          Node types
        </p>
        {['Stock', 'Article', 'Observation', 'Learning', 'Pattern'].map(
          (name, i) => (
            <div key={name} className="flex h-[30px] items-center gap-2 px-3">
              <span
                className="h-[7px] w-[7px] shrink-0 rounded-full"
                style={{ backgroundColor: `var(--color-data-${i + 1})` }}
              />
              <span className="truncate">{name}</span>
            </div>
          ),
        )}
      </div>
    </div>
  ),
};
