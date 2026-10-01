import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Command as CommandRoot,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@invana/ui';

import data from '../../../../fixtures/ui/command.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';
import { ICONS, Icon, type IconName } from '../_content';

interface CommandVariant extends Variant {
  placeholder: string;
  empty: string;
  groups: { heading: string; items: { value: string; label: string; icon: IconName; shortcut?: string }[] }[];
}

const VARIANTS = data as CommandVariant[];

interface Args {
  variant: string;
  onSelect: (value: string) => void;
}

const meta = {
  title: 'UI/UI/Command',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import {\n  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut,\n} from '@invana/ui';",
              `import { ${[...new Set(picked.flatMap((v) => v.groups.flatMap((g) => g.items.map((i) => ICONS[i.icon].displayName))))].join(', ')} } from 'lucide-react';`,
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: '// onSelect receives the picked item\'s value: "calculator". Run that command.\nconst onSelect = (value) => run(value);',
              call: [
                '<Command>',
                `  <CommandInput placeholder="${v.placeholder}" />`,
                '  <CommandList>',
                `    <CommandEmpty>${v.empty}</CommandEmpty>`,
                v.groups
                  .map((g) =>
                    [
                      `    <CommandGroup heading="${g.heading}">`,
                      ...g.items.map(
                        (i) =>
                          `      <CommandItem value="${i.value}" onSelect={onSelect}><${ICONS[i.icon].displayName} /><span>${i.label}</span>${i.shortcut ? `<CommandShortcut>${i.shortcut}</CommandShortcut>` : ''}</CommandItem>`,
                      ),
                      '    </CommandGroup>',
                    ].join('\n'),
                  )
                  .join('\n    <CommandSeparator />\n'),
                '  </CommandList>',
                '</Command>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A searchable list of commands, grouped, with shortcuts — from `fixtures/ui/command.json`.
 * Type to filter, then pick: `onSelect` sends the item's value.
 */
export const Command: Story = {
  render: ({ variant, onSelect }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <CommandRoot>
          <CommandInput placeholder={v.placeholder} />
          <CommandList>
            <CommandEmpty>{v.empty}</CommandEmpty>
            {v.groups.map((g, gi) => (
              <React.Fragment key={g.heading}>
                {gi ? <CommandSeparator /> : null}
                <CommandGroup heading={g.heading}>
                  {g.items.map((i) => (
                    <CommandItem
                      key={i.value}
                      value={i.value}
                      onSelect={(value) => {
                        onSelect(value);
                        log('onSelect', value);
                      }}
                    >
                      <Icon name={i.icon} />
                      <span>{i.label}</span>
                      {i.shortcut ? <CommandShortcut>{i.shortcut}</CommandShortcut> : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </CommandRoot>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Type to filter', async () => {
      await userEvent.type(cell.getByPlaceholderText(VARIANTS[0].placeholder), 'calc');
      await expect(cell.queryByRole('option', { name: /Calendar/ })).toBeNull();
    });
    await step('Pick a command', async () => {
      await userEvent.click(cell.getByRole('option', { name: /Calculator/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('calculator');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"calculator"');
    });
  },
};
