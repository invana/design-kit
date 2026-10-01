import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button, ButtonGroup, Card, CardContent, CardFooter, Tabs, TabsContent, TabsList, TabsTrigger } from '@invana/ui';
import { FieldGroup, Form, FormField, type FieldValues, type RowConfig } from '@invana/forms';

import spec from '../../../fixtures/forms/groups.json';
import { snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';
import { USE_FORM, indent, objectField, withLists } from '../form-source';

const IMPORTANT = withLists(spec.important.fields, spec.lists);
const TABS = spec.tabs.map((t) => ({ ...t, fields: withLists(t.fields, spec.lists), rowConfig: t.rowConfig as RowConfig[] }));
const VARIANTS = [{ caption: 'Groups', width: 520 }];

interface Args {
  onSubmit: (values: FieldValues) => void;
  onTabChange: (tab: string) => void;
  onReset: () => void;
}

function Live({ log, onSubmit, onTabChange, onReset }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues });
  return (
    <Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            onSubmit(values);
            log('onSubmit', values);
          })}
        >
          <CardContent>
            <FieldGroup>
              {/* The important fields: four selects in a 2 × 2 grid. */}
              <FormField.ObjectField
                control={form.control}
                name={spec.important.name}
                fields={IMPORTANT}
                rowConfig={spec.important.rowConfig}
                labelPosition="top"
              />
              <Tabs
                defaultValue={TABS[0]!.name}
                onValueChange={(tab) => {
                  onTabChange(tab);
                  log('onValueChange', tab);
                }}
              >
                <TabsList>
                  {TABS.map((t) => (
                    <TabsTrigger key={t.name} value={t.name}>
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map((t) => (
                  <TabsContent key={t.name} value={t.name}>
                    <FormField.ObjectField
                      control={form.control}
                      name={t.name}
                      fields={t.fields}
                      rowConfig={t.rowConfig}
                      labelPosition="top"
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <ButtonGroup>
              <ButtonGroup>
                <Button type="submit">Update Settings</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onReset();
                    log('reset', null);
                    form.reset(spec.defaultValues);
                  }}
                >
                  Reset
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

const meta = {
  title: 'Forms/Generated/Groups',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldGroup, Form, FormField } from '@invana/forms';",
            "import { Button, Card, CardContent, CardFooter, Tabs, TabsContent, TabsList, TabsTrigger } from '@invana/ui';",
          ],
          comment: 'Fields with a `group` are wrapped in an Accordion, one section per group; ungrouped fields render flat',
          data: {
            importantFields: IMPORTANT,
            importantRows: spec.important.rowConfig,
            ...Object.fromEntries(TABS.flatMap((t) => [[`${t.name}Fields`, t.fields], [`${t.name}Rows`, t.rowConfig]])),
            defaultValues: spec.defaultValues,
          },
          setup: USE_FORM,
          call: [
            '<Card>',
            '  <Form {...form}>',
            '    <form onSubmit={onSubmit}>',
            '      <CardContent>',
            '        <FieldGroup>',
            `          ${indent(objectField(spec.important.name, 'importantFields', { rowConfig: 'importantRows' }), '          ')}`,
            `          <Tabs defaultValue="${TABS[0]!.name}">`,
            `            <TabsList>${TABS.map((t) => `<TabsTrigger value="${t.name}">${t.label}</TabsTrigger>`).join('')}</TabsList>`,
            ...TABS.flatMap((t) => [
              `            <TabsContent value="${t.name}">`,
              `              ${indent(objectField(t.name, `${t.name}Fields`, { rowConfig: `${t.name}Rows` }), '              ')}`,
              '            </TabsContent>',
            ]),
            '          </Tabs>',
            '        </FieldGroup>',
            '      </CardContent>',
            '      <CardFooter><Button type="submit">Update Settings</Button></CardFooter>',
            '    </form>',
            '  </Form>',
            '</Card>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSubmit: fn(), onTabChange: fn(), onReset: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Grouped fields — the node display settings, from `fixtures/forms/groups.json`. Four selects
 * on top, then a tab per thing styled; within a tab every field with a `group` sits in that
 * group's accordion section, and `rowConfig` lays each section out. Three `ObjectField`s, one
 * `useForm`: Update Settings hands back one object, written under the card.
 */
export const Groups: Story = {
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Groups' }));
    await step('Open the Label tab and change its font', async () => {
      await userEvent.click(cell.getByRole('tab', { name: 'Label' }));
      await expect(args.onTabChange).toHaveBeenCalledWith('label');
      await userEvent.type(cell.getByRole('textbox', { name: 'Text Font Family' }), ' Display');
      await userEvent.click(cell.getByRole('button', { name: 'Update Settings' }));
    });
    await step('Every tab comes back in one object', async () => {
      const values = { ...spec.defaultValues, label: { ...spec.defaultValues.label, textFontFamily: 'Inter Display' } };
      await expect(args.onSubmit).toHaveBeenCalledWith(values);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"textFontFamily": "Inter Display"');
    });
  },
};
