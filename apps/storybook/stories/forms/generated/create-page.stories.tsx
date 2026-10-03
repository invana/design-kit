import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button, ButtonGroup, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@invana/ui';
import {
  FieldDescription,
  FieldGroup,
  Form,
  FormField,
  type FieldConfig,
  type FieldValues,
  type RowConfig,
} from '@invana/forms';

import spec from '../../../fixtures/forms/create-page.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { USE_FORM, indent, objectField } from '../form-source';

const FIELDS = spec.fields as FieldConfig[];
const ROWS = spec.rowConfig as RowConfig[];
const VARIANTS = [{ caption: 'Create Page', width: 520 }];

type TestState = keyof typeof spec.test.copy;
type Connection = (typeof spec.defaultValues)['connection'];

interface Args {
  onSubmit: (values: FieldValues) => void;
  onTest: (result: TestState) => void;
  onCancel: () => void;
}

function Live({ log, onSubmit, onTest, onCancel }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues });
  const [test, setTest] = React.useState<TestState>('untested');

  // Any edit to the connection invalidates a prior test.
  React.useEffect(() => {
    const sub = form.watch(() => setTest((t) => (t === 'untested' ? t : 'untested')));
    return () => sub.unsubscribe();
  }, [form]);

  const validate = () => {
    form.clearErrors();
    const v = form.getValues().connection as Connection;
    if (!v.connector) form.setError('connection.connector', { message: spec.required.connector });
    if (!v.uri.trim()) form.setError('connection.uri', { message: spec.required.uri });
    return !!v.connector && !!v.uri.trim();
  };

  const runTest = () => {
    if (!validate()) return;
    setTest('testing');
    const { uri } = form.getValues().connection as Connection;
    setTimeout(() => {
      const result: TestState = uri.includes(spec.test.passesWhenUriHas) ? 'passed' : 'failed';
      onTest(result);
      log('test', result);
      setTest(result);
    }, spec.test.delayMs);
  };

  return (
    <Card>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit((values) => {
            if (!validate()) return;
            onSubmit(values);
            log('onSubmit', values);
          })}
        >
          <CardHeader>
            <CardTitle>{spec.title}</CardTitle>
            <CardDescription>{spec.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FormField.ObjectField
                control={form.control}
                name={spec.name}
                fields={FIELDS}
                rowConfig={ROWS}
                labelPosition="top"
                size="md"
              />
              <FieldDescription role="status">{spec.test.copy[test]}</FieldDescription>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <ButtonGroup>
              <ButtonGroup>
                <Button type="button" variant="outline" onClick={runTest} disabled={test === 'testing'}>
                  Test connection
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onCancel();
                    log('cancel', null);
                    form.reset(spec.defaultValues);
                  }}
                >
                  Cancel
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button type="submit" disabled={test !== 'passed'}>
                  Create connection
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
  title: 'Forms/Generated/Create Page',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldDescription, FieldGroup, Form, FormField } from '@invana/forms';",
            "import { Button, ButtonGroup, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@invana/ui';",
          ],
          comment: 'The fields are data; the page owns validation, the test that gates Create, and the footer',
          data: { fields: spec.fields, rowConfig: spec.rowConfig, defaultValues: spec.defaultValues },
          setup: [
            USE_FORM,
            'const [test, setTest] = React.useState("untested");',
            '// The generator owns each field\'s onChange; `form.watch` is how a page hears them —',
            '// any edit un-tests the connection, so Create only enables against what was tested.',
            'React.useEffect(() => form.watch(() => setTest("untested")).unsubscribe, [form]);',
            'const runTest = async () => setTest((await api.test(form.getValues().connection)) ? "passed" : "failed");',
          ].join('\n'),
          call: [
            '<Card>',
            '  <Form {...form}>',
            '    <form noValidate onSubmit={onSubmit}>',
            `      <CardHeader><CardTitle>${spec.title}</CardTitle></CardHeader>`,
            '      <CardContent>',
            '        <FieldGroup>',
            `          ${indent(objectField(spec.name, 'fields', { rowConfig: 'rowConfig', size: { literal: 'md' } }), '          ')}`,
            '          <FieldDescription role="status">{copy[test]}</FieldDescription>',
            '        </FieldGroup>',
            '      </CardContent>',
            '      <CardFooter>',
            '        <ButtonGroup>',
            '          <ButtonGroup><Button type="button" variant="outline" onClick={runTest}>Test connection</Button></ButtonGroup>',
            '          <ButtonGroup><Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button></ButtonGroup>',
            '          <ButtonGroup><Button type="submit" disabled={test !== "passed"}>Create connection</Button></ButtonGroup>',
            '        </ButtonGroup>',
            '      </CardFooter>',
            '    </form>',
            '  </Form>',
            '</Card>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSubmit: fn(), onTest: fn(), onCancel: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **Create a thing, on a page of its own** — Studio's new-graph connection form, from
 * `fixtures/forms/create-page.json`. The fields are data; the page owns the rest: validation, a
 * side-effect that gates Save (here *Test connection*, which passes for a localhost URI), and
 * the footer.
 *
 * Any edit to a connection field un-tests it, so Create only enables against the values that
 * were actually tested. `form.watch` with a callback is how a page reacts to fields whose
 * `onChange` the generator owns. The test result and the created connection are written under
 * the form.
 */
export const CreatePage: Story = {
  name: 'Create Page',
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Create Page' }));
    await step('Pick a connector and a localhost URI', async () => {
      await userEvent.click(cell.getByRole('combobox', { name: 'Connector' }));
      await userEvent.click(await screen.findByRole('option', { name: 'Neo4j' }));
      await userEvent.type(cell.getByRole('textbox', { name: 'URI' }), 'bolt://localhost:7687');
      await expect(cell.getByRole('button', { name: 'Create connection' })).toBeDisabled();
    });
    await step('Test the connection', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Test connection' }));
      await waitFor(() => expect(args.onTest).toHaveBeenCalledWith('passed'));
      await expect(cell.getByRole('status')).toHaveTextContent(spec.test.copy.passed);
    });
    await step('Create it', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Create connection' }));
      const connection = { ...spec.defaultValues.connection, connector: 'neo4j', uri: 'bolt://localhost:7687' };
      await expect(args.onSubmit).toHaveBeenCalledWith({ connection });
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"uri": "bolt://localhost:7687"');
    });
  },
};
