import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
  Input,
} from '@invana/forms';

// Note: the shadcn `Field` row primitive is intentionally not imported here.
// `@invana/forms` re-exports the form-generator `Field` object (Field.Input,
// Field.Select, …) under the same name, which shadows the row primitive at the
// package root. The remaining Field* primitives are unaffected and composed below.
const meta: Meta<typeof FieldSet> = {
  title: 'UI/UI/Field',
  component: FieldSet,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="field-name">Display name</FieldLabel>
          <Input id="field-name" placeholder="Ada Lovelace" />
          <FieldDescription>
            This is the name shown across Invana products.
          </FieldDescription>
        </div>
        <FieldSeparator />
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" type="email" placeholder="ada@invana.io" />
          <FieldDescription>We will never share your email.</FieldDescription>
        </div>
      </FieldGroup>
    </FieldSet>
  ),
};
