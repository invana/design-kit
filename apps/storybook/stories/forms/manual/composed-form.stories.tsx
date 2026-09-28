import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
} from '@invana/forms';
import { Button, PanelBox } from '@invana/ui';

const meta: Meta = {
  title: 'Forms/Manual/Composed Form',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/**
 * **Every field written by hand.** `FormField` is react-hook-form's
 * controller: `render` receives `field` (value / onChange / ref) and you
 * return the row — `FormItem` › `FormLabel` › `FormControl` › the control ›
 * `FormMessage`. `rules` validate; `FormMessage` shows the error.
 *
 * `FieldSet` / `FieldLegend` / `FieldGroup` group rows into titled sets.
 * Each control below is the raw leaf input, so this is also the reference for
 * how each one binds: text-likes spread `field`; `Select` / `RadioGroup` use
 * `onValueChange`; `Checkbox` / `Switch` use `onCheckedChange`; `Slider`
 * works in `number[]`.
 */
const defaultValues = {
  name: '',
  uri: '',
  password: '',
  description: '',
  connector: '',
  validation: 'inherit',
  readOnly: false,
  abstract: false,
  maxRuns: [4],
};

export const ComposedForm: Story = {
  name: 'Composed Form',
  render: function Render() {
    const form = useForm({ defaultValues, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<unknown>(null);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(setSubmitted)} className="max-w-xl space-y-6">
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
                  pattern: { value: /^[a-z+]+:\/\//, message: 'Start with a scheme, e.g. bolt://' },
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
                        <SelectItem value="neo4j">Neo4j</SelectItem>
                        <SelectItem value="janusgraph">JanusGraph</SelectItem>
                        <SelectItem value="neptune">Amazon Neptune</SelectItem>
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
                        {['inherit', 'strict', 'permissive'].map((v) => (
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

          <PanelBox title="Submitted payload">
            <pre>{submitted ? JSON.stringify(submitted, null, 2) : '— submit the form —'}</pre>
          </PanelBox>
        </form>
      </Form>
    );
  },
};
