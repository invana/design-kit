import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import {
  Checkbox,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  PasswordInput,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Textarea,
  type FieldValues,
} from '@invana/forms';
import { Button } from '@invana/ui';

import spec from '../../../fixtures/forms/composed-form.json';
import { snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';

const VARIANTS = [{ caption: 'Composed Form', width: 576 }];

interface Args {
  onSubmit: (values: FieldValues) => void;
}

function Live({ log, onSubmit }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues, mode: 'onTouched' });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
          log('onSubmit', values);
        })}
      >
        <FieldGroup>
            <FieldSet>
              <FieldLegend>Connection</FieldLegend>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer analysis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uri"
                  rules={{
                    required: 'URI is required',
                    pattern: { value: new RegExp(spec.uriPattern), message: 'Start with a scheme, e.g. bolt://' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URI</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput placeholder="bolt://localhost:7687" {...field} />
                          <InputGroupAddon align="inline-end">
                            <InputGroupText>:7687</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormDescription>An input with an addon — `InputGroup`.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="connector"
                  rules={{ required: 'Pick a connector' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connector</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a connector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {spec.connectors.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readOnly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read-only connection</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Node type</FieldLegend>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="description"
                  rules={{ maxLength: { value: 140, message: 'Keep it under 140 characters' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validation mode</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          {spec.validationModes.map((v) => (
                            <Label key={v}>
                              <RadioGroupItem value={v} /> {v}
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="abstract"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Label>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} /> Abstract — only
                          subtypes have instances
                        </Label>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxRuns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Concurrent runs · {field.value[0]}</FormLabel>
                      <FormControl>
                        <Slider min={1} max={32} step={1} value={field.value} onValueChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>


          <Button type="submit">Save</Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms/Manual/Composed Form',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldGroup, FieldLegend, FieldSet, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@invana/forms';",
            "import { Button } from '@invana/ui';",
          ],
          comment: 'Every field written by hand — two of the nine shown; the rest bind the same way',
          data: { defaultValues: spec.defaultValues, connectors: spec.connectors },
          setup: [
            "const form = useForm({ defaultValues, mode: 'onTouched' });",
            '// handleSubmit runs the `rules`, then hands over every field: { name, uri, …, maxRuns: [4] }.',
            'const onSubmit = form.handleSubmit((values) => save(values));',
          ].join('\n'),
          call: [
            '<Form {...form}>',
            '  <form onSubmit={onSubmit}>',
            '    <FieldGroup>',
            '      <FieldSet>',
            '        <FieldLegend>Connection</FieldLegend>',
            '        <FieldGroup>',
            "          <FormField control={form.control} name=\"name\" rules={{ required: 'Name is required' }} render={({ field }) => (",
            '            <FormItem>',
            '              <FormLabel>Name</FormLabel>',
            '              <FormControl><Input placeholder="Customer analysis" {...field} /></FormControl>',
            '              <FormMessage />',
            '            </FormItem>',
            '          )} />',
            '          {/* Select, RadioGroup: onValueChange. Checkbox, Switch: onCheckedChange. Slider: number[]. */}',
            "          <FormField control={form.control} name=\"connector\" rules={{ required: 'Pick a connector' }} render={({ field }) => (",
            '            <FormItem>',
            '              <FormLabel>Connector</FormLabel>',
            '              <Select value={field.value} onValueChange={field.onChange}>',
            '                <FormControl><SelectTrigger><SelectValue placeholder="Select a connector" /></SelectTrigger></FormControl>',
            '                <SelectContent>',
            '                  {connectors.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}',
            '                </SelectContent>',
            '              </Select>',
            '              <FormMessage />',
            '            </FormItem>',
            '          )} />',
            '        </FieldGroup>',
            '      </FieldSet>',
            '      <Button type="submit">Save</Button>',
            '    </FieldGroup>',
            '  </form>',
            '</Form>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSubmit: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **Every field written by hand.** `FormField` is react-hook-form's controller: `render`
 * receives `field` (value / onChange / ref) and you return the row — `FormItem` › `FormLabel` ›
 * `FormControl` › the control › `FormMessage`. `rules` validate; `FormMessage` shows the error.
 *
 * `FieldSet` / `FieldLegend` / `FieldGroup` group rows into titled sets. Each control is the raw
 * leaf input, so this is also the reference for how each one binds: text-likes spread `field`;
 * `Select` / `RadioGroup` use `onValueChange`; `Checkbox` / `Switch` use `onCheckedChange`;
 * `Slider` works in `number[]`. Defaults and choices are `fixtures/forms/composed-form.json`;
 * what Save hands over is written under the form.
 */
export const ComposedForm: Story = {
  name: 'Composed Form',
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Composed Form' }));
    await step('Saving empty shows the rules', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Save' }));
      await expect(await cell.findByText('Name is required')).toBeInTheDocument();
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
    await step('Fill the required fields and save', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'Name' }), 'Customer analysis');
      // FormControl labels the InputGroup, not the input inside it, so the URI is found by its placeholder.
      await userEvent.type(cell.getByPlaceholderText('bolt://localhost:7687'), 'bolt://localhost:7687');
      await userEvent.click(cell.getByRole('combobox', { name: 'Connector' }));
      await userEvent.click(await screen.findByRole('option', { name: 'Neo4j' }));
      await userEvent.click(cell.getByRole('button', { name: 'Save' }));
    });
    await step('Every field is handed over', async () => {
      const values = { ...spec.defaultValues, name: 'Customer analysis', uri: 'bolt://localhost:7687', connector: 'neo4j' };
      await expect(args.onSubmit).toHaveBeenCalledWith(values);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"connector": "neo4j"');
    });
  },
};
