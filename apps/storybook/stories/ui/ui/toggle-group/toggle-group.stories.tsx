import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ToggleGroup as ToggleGroupControl, ToggleGroupItem } from '@invana/ui';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';

import data from '../../../../fixtures/ui/toggle-group.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

/** JSON names an icon; the story owns the glyphs (packages ship icon-agnostic). */
const ICONS = {
  bold: [Bold, 'Bold'],
  italic: [Italic, 'Italic'],
  underline: [Underline, 'Underline'],
  'align-left': [AlignLeft, 'AlignLeft'],
  'align-center': [AlignCenter, 'AlignCenter'],
  'align-right': [AlignRight, 'AlignRight'],
} as const;

interface Item {
  value: string;
  label: string;
  icon: keyof typeof ICONS;
  text?: string;
}

interface Group {
  type: 'single' | 'multiple';
  variant: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  value: string | string[];
  disabled?: boolean;
  items: Item[];
}

interface GroupVariant extends Variant {
  groups: Group[];
}

const VARIANTS = data as GroupVariant[];

interface Args {
  variant: string;
  /** A string for `type="single"` ("" when cleared), an array for `type="multiple"`. */
  onValueChange: (value: string | string[]) => void;
}

const meta = {
  title: 'UI/UI/ToggleGroup',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { ToggleGroup, ToggleGroupItem } from '@invana/ui';",
              `import { ${[...new Set(picked.flatMap((v) => v.groups.flatMap((g) => g.items.map((i) => ICONS[i.icon][1]))))].join(', ')} } from 'lucide-react';`,
            ],
            picked.flatMap((v) =>
              v.groups.map((g) => ({
                comment: [v.caption, g.size].filter(Boolean).join(' · '),
                setup: [
                  `const [value, setValue] = React.useState(${JSON.stringify(g.value)});`,
                  g.type === 'single'
                    ? '// Called with the picked value, or "" when it is pressed again.'
                    : '// Called with every pressed value, e.g. ["bold", "italic"].',
                  `const onValueChange = (next: ${g.type === 'single' ? 'string' : 'string[]'}) => setValue(next);`,
                ].join('\n'),
                call: [
                  jsx('ToggleGroup', {
                    type: { literal: g.type },
                    variant: { literal: g.variant },
                    size: g.size ? { literal: g.size } : undefined,
                    disabled: g.disabled ? 'true' : undefined,
                    value: 'value',
                    onValueChange: 'onValueChange',
                  }).replace(/ ?\/>$/, '>'),
                  ...g.items.map(
                    (i) =>
                      `  <ToggleGroupItem value="${i.value}" aria-label="${i.label}">\n    <${ICONS[i.icon][1]} />${i.text ? `\n    ${i.text}` : ''}\n  </ToggleGroupItem>`,
                  ),
                  '</ToggleGroup>',
                ].join('\n'),
              })),
            ),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onValueChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** One group, controlled: what is pressed is what the story holds. */
function LiveGroup({ group, onValueChange, log }: { group: Group; onValueChange: Args['onValueChange']; log: Log }) {
  const [value, setValue] = React.useState(group.value);
  const change = (next: string | string[]) => {
    setValue(next);
    onValueChange(next);
    log('onValueChange', next);
  };
  const items = group.items.map((i) => {
    const Icon = ICONS[i.icon][0];
    return (
      <ToggleGroupItem key={i.value} value={i.value} aria-label={i.label}>
        <Icon />
        {i.text}
      </ToggleGroupItem>
    );
  });
  const shared = { variant: group.variant, size: group.size, disabled: group.disabled };
  return group.type === 'single' ? (
    <ToggleGroupControl type="single" {...shared} value={value as string} onValueChange={change}>
      {items}
    </ToggleGroupControl>
  ) : (
    <ToggleGroupControl type="multiple" {...shared} value={value as string[]} onValueChange={change}>
      {items}
    </ToggleGroupControl>
  );
}

/**
 * A set of toggles, controlled — every variant from `fixtures/ui/toggle-group.json`. Press an
 * item: `onValueChange` receives the new value (a string for single, an array for multiple)
 * and the story holds it.
 */
export const ToggleGroup: Story = {
  render: ({ variant, onValueChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => v.groups.map((g, i) => <LiveGroup key={i} group={g} onValueChange={onValueChange} log={log} />)}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Add italic to the pressed set', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Default' }));
      await userEvent.click(cell.getByRole('button', { name: 'Toggle italic' }));
      await expect(args.onValueChange).toHaveBeenCalledWith(['bold', 'italic']);
      await expect(cell.getByRole('button', { name: 'Toggle italic' })).toHaveAttribute('aria-pressed', 'true');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('["bold", "italic"]');
    });
    await step('Move a single selection', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Single selection' }));
      await userEvent.click(cell.getByRole('radio', { name: 'Align right' }));
      await expect(args.onValueChange).toHaveBeenCalledWith('right');
      await expect(cell.getByRole('radio', { name: 'Align right' })).toBeChecked();
    });
  },
};
