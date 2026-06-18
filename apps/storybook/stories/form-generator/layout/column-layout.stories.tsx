import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Button } from '@invana/ui';
import { Form, FormField, type FieldConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Layout/Column Layout',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/* -------------------------------------------------------------------------- */
/*  colSpan — a full-width field in the default two-column grid                 */
/* -------------------------------------------------------------------------- */

// `bio` spans both columns (colSpan: 2) so the textarea fills the row, while
// the two name inputs keep pairing up.
const profileFields: FieldConfig[] = [
  { name: 'firstName', type: 'text', label: 'First name' },
  { name: 'lastName', type: 'text', label: 'Last name' },
  {
    name: 'bio',
    type: 'textarea',
    label: 'Bio',
    rows: 4,
    colSpan: 2,
    placeholder: 'Tell us about yourself…',
  },
];

/* -------------------------------------------------------------------------- */
/*  columns — a three-column grid with mixed spans                             */
/* -------------------------------------------------------------------------- */

// Rendered with `columns={3}`. `street` takes two of three columns next to a
// single-column `unit`; `notes` spans the full row (colSpan: 3).
const addressFields: FieldConfig[] = [
  { name: 'city', type: 'text', label: 'City' },
  { name: 'state', type: 'text', label: 'State' },
  { name: 'zip', type: 'text', label: 'ZIP' },
  { name: 'street', type: 'text', label: 'Street', colSpan: 2 },
  { name: 'unit', type: 'text', label: 'Unit' },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Delivery notes',
    rows: 3,
    colSpan: 3,
    placeholder: 'Gate code, drop-off spot…',
  },
];

/* -------------------------------------------------------------------------- */
/*  className — per-field cell styling via the escape hatch                     */
/* -------------------------------------------------------------------------- */

// `className` is merged onto the field's grid cell. Here it gives the
// full-width Terms field a dashed highlight without a dedicated prop.
const couponFields: FieldConfig[] = [
  { name: 'name', type: 'text', label: 'Coupon name' },
  { name: 'code', type: 'text', label: 'Code' },
  {
    name: 'terms',
    type: 'textarea',
    label: 'Terms',
    rows: 3,
    colSpan: 2,
    className:
      'rounded-md border border-dashed border-primary/40 bg-primary/5 p-3',
    placeholder: 'Valid through…',
  },
];

const defaultValues = {
  profile: { firstName: 'Ada', lastName: 'Lovelace', bio: '' },
  address: { city: '', state: '', zip: '', street: '', unit: '', notes: '' },
  coupon: { name: '', code: '', terms: '' },
};

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {children}
    </section>
  );
}

export const ColumnLayout: Story = {
  render: () => {
    const form = useForm({ defaultValues });
    const [submitted, setSubmitted] = React.useState<unknown>(null);

    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px] max-w-5xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(setSubmitted)}
            className="space-y-8"
          >
            <Section
              title="Full-width field — colSpan: 2"
              hint="Default two-column grid. The Bio textarea sets colSpan: 2 to fill the row."
            >
              <FormField.ObjectField
                control={form.control}
                name="profile"
                fields={profileFields}
                labelPosition="top"
                size="md"
              />
            </Section>

            <Section
              title="Three columns — columns={3} with mixed colSpan"
              hint="Street spans 2 of 3 columns; Delivery notes spans all 3."
            >
              <FormField.ObjectField
                control={form.control}
                name="address"
                fields={addressFields}
                columns={3}
                labelPosition="top"
                size="md"
              />
            </Section>

            <Section
              title="Per-field className — the escape hatch"
              hint="Terms uses className to style its grid cell (dashed highlight) alongside colSpan: 2."
            >
              <FormField.ObjectField
                control={form.control}
                name="coupon"
                fields={couponFields}
                labelPosition="top"
                size="md"
              />
            </Section>

            <Button type="submit">Save</Button>
          </form>
        </Form>

        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Submitted payload
          </h4>
          <pre className="rounded-md border bg-muted/40 p-3 text-xs">
            {submitted
              ? JSON.stringify(submitted, null, 2)
              : '— submit the form —'}
          </pre>
        </div>
      </div>
    );
  },
};
