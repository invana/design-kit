import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Accordion as AccordionRoot, AccordionContent, AccordionItem, AccordionTrigger } from '@invana/ui';

import data from '../../../../fixtures/ui/accordion.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';
import { Badges, Content, badgeSource, contentSource, type BadgeSpec, type Block, type Send } from '../_content';

interface Section {
  value: string;
  title: string;
  badges?: BadgeSpec[];
  /** Only in the "With a custom class" cell. */
  className?: string;
  content: Block[];
}

interface AccordionVariant extends Variant {
  type: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string;
  items: Section[];
}

const VARIANTS = data as AccordionVariant[];

interface Args {
  variant: string;
  onValueChange: (value: string | string[]) => void;
}

function source(v: AccordionVariant) {
  const value = v.type === 'multiple' ? 'string[]' : 'string';
  const items = v.items
    .map((s) =>
      [
        `  <AccordionItem value="${s.value}"${s.className ? ` className="${s.className}"` : ''}>`,
        s.badges
          ? `    <AccordionTrigger><span>${s.title} ${s.badges.map(badgeSource).join(' ')}</span></AccordionTrigger>`
          : `    <AccordionTrigger>${s.title}</AccordionTrigger>`,
        '    <AccordionContent>',
        contentSource(s.content, '      '),
        '    </AccordionContent>',
        '  </AccordionItem>',
      ].join('\n'),
    )
    .join('\n');
  return {
    comment: v.caption,
    setup: [
      `// onValueChange receives the open section(s) — a ${value}.`,
      `const [value, setValue] = React.useState(${v.type === 'multiple' ? '[]' : JSON.stringify(v.defaultValue ?? '')});`,
      'const onValueChange = (next) => setValue(next);',
    ].join('\n'),
    call: [
      `<Accordion type="${v.type}"${v.collapsible ? ' collapsible' : ''} value={value} onValueChange={onValueChange}>`,
      items,
      '</Accordion>',
    ].join('\n'),
  };
}

const meta = {
  title: 'UI/UI/Accordion',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@invana/ui';",
              "import { Checkbox, Input } from '@invana/forms';",
              "import { Field, FieldGroup, FieldLabel } from '@invana/forms';",
            ],
            picked.map(source),
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

/** Holds the open section(s), as a consumer would, and reports every change. */
function Live({ v, onValueChange, log }: { v: AccordionVariant; onValueChange: Args['onValueChange']; log: Log }) {
  const [single, setSingle] = React.useState(v.defaultValue ?? '');
  const [multiple, setMultiple] = React.useState<string[]>(v.defaultValue ? [v.defaultValue] : []);
  const send: Send = log;
  const report = (next: string | string[]) => {
    onValueChange(next);
    log('onValueChange', next);
  };
  const sections = v.items.map((s) => (
    <AccordionItem key={s.value} value={s.value} className={s.className}>
      <AccordionTrigger>
        {s.badges ? (
          <span>
            {s.title} <Badges badges={s.badges} />
          </span>
        ) : (
          s.title
        )}
      </AccordionTrigger>
      <AccordionContent>
        <Content blocks={s.content} send={send} />
      </AccordionContent>
    </AccordionItem>
  ));
  return v.type === 'multiple' ? (
    <AccordionRoot
      type="multiple"
      value={multiple}
      onValueChange={(next) => {
        setMultiple(next);
        report(next);
      }}
    >
      {sections}
    </AccordionRoot>
  ) : (
    <AccordionRoot
      type="single"
      collapsible={v.collapsible}
      value={single}
      onValueChange={(next) => {
        setSingle(next);
        report(next);
      }}
    >
      {sections}
    </AccordionRoot>
  );
}

/**
 * Sections that open and close — single, multiple, opened by default, and the bodies real
 * screens put in them (an FAQ, specs, settings, docs, a section with counts), from
 * `fixtures/ui/accordion.json`. Open a section: `onValueChange` sends what is open now.
 */
export const Accordion: Story = {
  render: ({ variant, onValueChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onValueChange={onValueChange} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Basic' }));
    await step('Open a section', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'How do I use it?' }));
      await expect(args.onValueChange).toHaveBeenCalledWith('item-2');
      await expect(cell.getByText(/compose them together/)).toBeVisible();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"item-2"');
    });
    await step('Several stay open when type is multiple', async () => {
      const multiple = within(within(canvasElement).getByRole('group', { name: 'Multiple' }));
      await userEvent.click(multiple.getByRole('button', { name: 'Can multiple items be open?' }));
      await userEvent.click(multiple.getByRole('button', { name: 'Try opening this one too' }));
      await expect(args.onValueChange).toHaveBeenLastCalledWith(['item-1', 'item-2']);
    });
  },
};
