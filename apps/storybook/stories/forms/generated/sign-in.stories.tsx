import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Link } from '@invana/ui';
import { FieldDescription, FieldGroup, Form, FormField, type FieldConfig, type FieldValues } from '@invana/forms';

import spec from '../../../fixtures/forms/sign-in.json';
import { snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';
import { USE_FORM, indent, objectField } from '../form-source';

const FIELDS = spec.fields as FieldConfig[];
const VARIANTS = [{ caption: 'Sign In', width: 380 }];

interface Args {
  onSubmit: (values: FieldValues) => void;
  onLinkClick: (link: string) => void;
}

function Live({ log, onSubmit, onLinkClick }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues, mode: 'onTouched' });
  const link = (name: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onLinkClick(name);
    log('link', name);
  };

  return (
    <Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
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
              <FormField.ObjectField control={form.control} name={spec.name} fields={FIELDS} labelPosition="top" size="md" />
              <Link href="#" variant="quiet" onClick={link('Forgot password?')}>
                Forgot password?
              </Link>
              <FieldDescription>
                Don&apos;t have an account?{' '}
                <Link href="#" variant="underlined" onClick={link('Sign up')}>
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button type="submit">Sign in</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

const meta = {
  title: 'Forms/Generated/Sign In',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldDescription, FieldGroup, Form, FormField } from '@invana/forms';",
            "import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Link } from '@invana/ui';",
          ],
          comment: 'The whole form is JSON, rendered by one ObjectField',
          data: { fields: spec.fields, defaultValues: spec.defaultValues },
          setup: USE_FORM.replace('useForm({ defaultValues })', "useForm({ defaultValues, mode: 'onTouched' })"),
          call: [
            '<Card>',
            '  <Form {...form}>',
            '    <form onSubmit={onSubmit}>',
            `      <CardHeader><CardTitle>${spec.title}</CardTitle></CardHeader>`,
            '      <CardContent>',
            '        <FieldGroup>',
            `          ${indent(objectField(spec.name, 'fields', { size: { literal: 'md' } }), '          ')}`,
            '          <Link href="/forgot" variant="quiet">Forgot password?</Link>',
            '        </FieldGroup>',
            '      </CardContent>',
            '      <CardFooter>',
            '        <Button type="submit">Sign in</Button>',
            '      </CardFooter>',
            '    </form>',
            '  </Form>',
            '</Card>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSubmit: fn(), onLinkClick: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The whole form is described as JSON (`fixtures/forms/sign-in.json`) and rendered by
 * `FormField.ObjectField`; the page owns the card, the links and the submit. Sign in writes
 * the credentials under the form.
 */
export const SignIn: Story = {
  name: 'Sign In',
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Sign In' }));
    await step('Enter the credentials and sign in', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'Email' }), 'ada@invana.io');
      await userEvent.type(cell.getByLabelText('Password'), 'engine');
      await userEvent.click(cell.getByRole('button', { name: 'Sign in' }));
    });
    await step('The login is handed over', async () => {
      await expect(args.onSubmit).toHaveBeenCalledWith({ login: { email: 'ada@invana.io', password: 'engine', remember: true } });
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"email": "ada@invana.io"');
    });
  },
};
