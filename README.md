# @invana/forms

Composable form building blocks for Invana products — `FormField` with an `ObjectField`, plus the
leaf inputs.

```bash
pnpm add @invana/forms
```

Peer dependencies: `@invana/ui`, `@invana/styling`, `react`, `react-dom`, `react-hook-form`.

## This is not a form renderer

There is no `FormRenderer` and no `FormSchema` tree. **You own `useForm`** and you compose your own
chrome — Card, Tabs, Accordion, a footer, a submit button. This package supplies the fields.

## Usage

`FormField.ObjectField` is the primary building block. Fields render as `${name}.${field.name}`,
so several ObjectFields in one `useForm` all write into a single shared data object.

```tsx
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@invana/forms';
import { Button } from '@invana/ui';

export function ShapeSettings() {
  const form = useForm({ defaultValues: { shape: { fill: '#2563eb', radius: 4, visible: true } } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <FormField.ObjectField
          control={form.control}
          name="shape"
          labelPosition="top"
          fields={[
            { name: 'fill', type: 'color', label: 'Fill' },
            { name: 'radius', type: 'number', label: 'Radius', min: 0, max: 32 },
            { name: 'visible', type: 'boolean', label: 'Visible' },
          ]}
          rowConfig={[{ fields: ['fill', 'radius'] }]}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
```

A field with a `group` property is auto-wrapped in an Accordion; ungrouped fields render flat.
`rowConfig` puts named fields side by side in one row.

## Exports

**Fields** — `FormField` (augmented with `.ObjectField`, `.Color`, `.Number`, `.Select`,
`.Boolean`, `.Input`, `.Icon`), and the standalone `Field`, `ObjectField`, `InputField`,
`PasswordField`, `TextareaField`, `SelectField`, `BooleanField`, `RadioField`,
`CheckboxGroupField`, `ColorField`, `NumberField`, `IconField`.

**Controls** — `ColorSwatches`, `SliderNumber`, `IconInput`, and `SettingsPanel`.

**Types** — `FieldConfig`, `RowConfig`, `GroupConfig`, `ObjectFieldProps`, `FieldType`,
`LabelPosition`, `FieldOrientation`, `FieldSize`, `FieldBadge`, `BooleanControl`, `ColorPreset`.

React Hook Form's `Control`, `FieldValues`, `SubmitHandler`, `UseFormReturn`, `DefaultValues` and
`Mode` are re-exported so consumers need not import them separately.

## Icons

Pass icons in as props. This package does not bind you to an icon set.

## License

MIT © Ravi Raja Merugu
