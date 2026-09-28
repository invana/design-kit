import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  PanelBox,
} from '@invana/ui';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Forms/Generated/Create Page',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/**
 * **Create a thing, on a page of its own** — Studio's new-graph connection
 * form. The fields are data; the page owns the rest: validation, a
 * side-effect that gates Save (here *Test connection*), and the footer.
 *
 * Any edit to a connection field un-tests it, so Create only enables against
 * the values that were actually tested. `form.watch` with a callback is how a
 * page reacts to fields whose `onChange` the generator owns.
 */
const fields: FieldConfig[] = [
  {
    name: 'connector',
    type: 'select',
    label: 'Connector',
    placeholder: 'Select a connector',
    options: [
      { label: 'Neo4j', value: 'neo4j' },
      { label: 'JanusGraph', value: 'janusgraph' },
      { label: 'Amazon Neptune', value: 'neptune' },
    ],
  },
  { name: 'uri', type: 'text', label: 'URI', placeholder: 'bolt://localhost:7687', colSpan: 2 },
  {
    name: 'database',
    type: 'text',
    label: 'Database (optional)',
    placeholder: 'neo4j',
    description: "Leave blank to use the connector's default.",
    colSpan: 2,
  },
  { name: 'username', type: 'text', label: 'Username', placeholder: 'neo4j' },
  { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
  { name: 'readOnly', type: 'boolean', label: 'Read-only connection' },
];

const rowConfig: RowConfig[] = [
  { id: 'connector', fields: ['connector'] },
  { id: 'uri', fields: ['uri'] },
  { id: 'database', fields: ['database'] },
  { id: 'auth', fields: ['username', 'password'] },
  { id: 'readOnly', fields: ['readOnly'] },
];

const defaultValues = {
  connection: { connector: '', uri: '', database: '', username: '', password: '', readOnly: false },
};

type TestState = 'untested' | 'testing' | 'passed' | 'failed';

const TEST_COPY: Record<TestState, string> = {
  untested: 'Test the connection to enable Create.',
  testing: 'Testing…',
  passed: 'Connection works · 12 ms',
  failed: 'Could not reach the server. Check the URI and credentials.',
};

export const CreatePage: Story = {
  name: 'Create Page',
  render: function Render() {
    const form = useForm({ defaultValues });
    const [test, setTest] = React.useState<TestState>('untested');
    const [created, setCreated] = React.useState<unknown>(null);

    // Any edit to the connection invalidates a prior test.
    React.useEffect(() => {
      const sub = form.watch(() => setTest((t) => (t === 'untested' ? t : 'untested')));
      return () => sub.unsubscribe();
    }, [form]);

    const validate = () => {
      form.clearErrors();
      const v = form.getValues().connection;
      if (!v.connector) form.setError('connection.connector', { message: 'Connector is required' });
      if (!v.uri.trim()) form.setError('connection.uri', { message: 'URI is required' });
      return !!v.connector && !!v.uri.trim();
    };

    const runTest = () => {
      if (!validate()) return;
      setTest('testing');
      const { uri } = form.getValues().connection;
      setTimeout(() => setTest(uri.includes('localhost') ? 'passed' : 'failed'), 600);
    };

    return (
      <Card className="w-[520px]">
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit((values) => validate() && setCreated(values))}
          >
            <CardHeader>
              <CardTitle>Connect a database</CardTitle>
              <CardDescription>Invana reads your graph where it lives. Try a localhost URI.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField.ObjectField
                control={form.control}
                name="connection"
                fields={fields}
                rowConfig={rowConfig}
                labelPosition="top"
                size="md"
              />

              <p>{TEST_COPY[test]}</p>

              {created ? (
                <PanelBox title="Created">
                  <pre>{JSON.stringify(created, null, 2)}</pre>
                </PanelBox>
              ) : null}
            </CardContent>

            <CardFooter className="justify-between gap-2">
              <Button type="button" variant="outline" onClick={runTest} disabled={test === 'testing'}>
                Test connection
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={test !== 'passed'}>
                  Create connection
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
