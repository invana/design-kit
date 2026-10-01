import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Eyebrow,
  Tabs as TabsControl,
  TabsContent,
  TabsList,
  TabsTrigger,
  TypographyMuted,
} from '@invana/ui';

import data from '../../../../fixtures/ui/tabs.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface Tab {
  value: string;
  label: string;
  body: string;
}

interface Group {
  title?: string;
  /** Each panel's body sits in a Card. */
  card?: boolean;
  /** The card has a header naming the tab (default true). */
  cardHeader?: boolean;
  /** The list stretches to the container and the triggers share it. */
  fullWidth?: boolean;
  size?: 'default' | 'sm';
  tabs: Tab[];
}

interface TabsVariant extends Variant {
  groups: Group[];
}

const VARIANTS = data as TabsVariant[];

interface Args {
  variant: string;
  onValueChange: (value: string) => void;
}

/** What a consumer writes for one group. */
function code(g: Group) {
  const stretch = g.fullWidth ? ' className="w-full"' : '';
  const grow = g.fullWidth ? ' className="flex-1"' : '';
  const body = (t: Tab) =>
    g.card
      ? [
          '    <Card>',
          g.cardHeader === false ? null : `      <CardHeader><CardTitle>${t.label}</CardTitle></CardHeader>`,
          `      <CardContent>${t.body}</CardContent>`,
          '    </Card>',
        ]
          .filter(Boolean)
          .join('\n')
      : `    <TypographyMuted>${t.body}</TypographyMuted>`;
  return [
    `<Tabs${g.size ? ` size="${g.size}"` : ''} value={value} onValueChange={onValueChange}>`,
    `  <TabsList${stretch}>`,
    ...g.tabs.map((t) => `    <TabsTrigger value="${t.value}"${grow}>${t.label}</TabsTrigger>`),
    '  </TabsList>',
    ...g.tabs.map((t) => `  <TabsContent value="${t.value}">\n${body(t)}\n  </TabsContent>`),
    '</Tabs>',
  ].join('\n');
}

const meta = {
  title: 'UI/UI/Tabs',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, TypographyMuted } from '@invana/ui';",
            ],
            picked.flatMap((v) =>
              v.groups.map((g) => ({
                comment: [v.caption, g.title].filter(Boolean).join(' · '),
                setup: [
                  `const [value, setValue] = React.useState(${JSON.stringify(g.tabs[0].value)});`,
                  '// Called with the picked tab\'s value.',
                  'const onValueChange = (next: string) => setValue(next);',
                ].join('\n'),
                call: code(g),
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

/** One tab set, controlled: the open tab is the one the story holds. */
function LiveTabs({ group, onValueChange, log }: { group: Group; onValueChange: Args['onValueChange']; log: Log }) {
  const [value, setValue] = React.useState(group.tabs[0].value);
  const change = (next: string) => {
    setValue(next);
    onValueChange(next);
    log('onValueChange', next);
  };
  return (
    <TabsControl size={group.size} value={value} onValueChange={change}>
      {/* Kit gap: TabsList / TabsTrigger have no full-width prop, so the stretch is a class. */}
      <TabsList className={group.fullWidth ? 'w-full' : undefined}>
        {group.tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className={group.fullWidth ? 'flex-1' : undefined}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {group.tabs.map((t) => (
        <TabsContent key={t.value} value={t.value}>
          {group.card ? (
            <Card>
              {group.cardHeader === false ? null : (
                <CardHeader>
                  <CardTitle>{t.label}</CardTitle>
                </CardHeader>
              )}
              <CardContent>{t.body}</CardContent>
            </Card>
          ) : (
            <TypographyMuted>{t.body}</TypographyMuted>
          )}
        </TabsContent>
      ))}
    </TabsControl>
  );
}

/**
 * Views of one thing, one at a time — every variant from `fixtures/ui/tabs.json`, controlled.
 * Pick a tab: `onValueChange` receives its value and the story opens it.
 */
export const Tabs: Story = {
  render: ({ variant, onValueChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) =>
        v.groups.map((g, i) => (
          <React.Fragment key={i}>
            {g.title ? <Eyebrow tone="foreground">{g.title}</Eyebrow> : null}
            <LiveTabs group={g} onValueChange={onValueChange} log={log} />
          </React.Fragment>
        ))
      }
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Open the Password tab', async () => {
      await userEvent.click(cell.getByRole('tab', { name: 'Password' }));
      await expect(args.onValueChange).toHaveBeenCalledWith('tab2');
    });
    await step('Its panel shows', async () => {
      await expect(cell.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
      await expect(cell.getByRole('tabpanel')).toHaveTextContent('Change your password here.');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"tab2"');
    });
  },
};
