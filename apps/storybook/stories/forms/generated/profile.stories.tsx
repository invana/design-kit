import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button, PanelBox } from '@invana/ui';
import { FieldGroup, FileDrop, Form, FormField, type FieldConfig, type FieldSize, type FieldValues, type LabelPosition } from '@invana/forms';

import spec from '../../../fixtures/forms/profile.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { FORM_ARG_TYPES, USE_FORM, indent, objectField } from '../form-source';

interface Section {
  name: string;
  title: string;
  aside: string;
  fields: FieldConfig[];
}

const SECTIONS = spec.sections as Section[];
const VARIANTS = [{ caption: 'Profile', width: 720 }];

interface Args {
  size: FieldSize;
  labelPosition: LabelPosition;
  onSubmit: (values: FieldValues) => void;
}

function Live({ size, labelPosition, log, onSubmit }: Args & { log: Log }) {
  const [photo, setPhoto] = React.useState<File | null>(null);
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          const saved = { ...values, photo: photo?.name ?? null };
          onSubmit(saved);
          log('onSubmit', saved);
        })}
      >
        <FieldGroup>
          <PanelBox title={spec.photo.title} aside={photo ? photo.name : spec.photo.aside}>
            <FileDrop accept={spec.photo.accept} maxBytes={spec.photo.maxBytes} onFiles={(files) => setPhoto(files[0] ?? null)}>
              Drop a photo here, or click to pick
            </FileDrop>
          </PanelBox>
          {SECTIONS.map((s) => (
            <PanelBox key={s.name} title={s.title} aside={s.aside}>
              <FormField.ObjectField
                control={form.control}
                name={s.name}
                fields={s.fields}
                labelPosition={labelPosition}
                size={size}
              />
            </PanelBox>
          ))}
          <Button type="submit">Save profile</Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms/Generated/Profile',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldGroup, FileDrop, Form, FormField } from '@invana/forms';",
            "import { Button, PanelBox } from '@invana/ui';",
          ],
          comment: 'A photo (FileDrop) and three ObjectFields writing into one useForm, so one Save hands back one object',
          data: Object.fromEntries(SECTIONS.map((s) => [`${s.name}Fields`, s.fields])),
          setup: USE_FORM,
          call: [
            '<Form {...form}>',
            '  <form onSubmit={onSubmit}>',
            '    <FieldGroup>',
            '      <PanelBox title="Profile photo">',
            '        <FileDrop accept="image/*" onFiles={(files) => setPhoto(files[0])} />',
            '      </PanelBox>',
            ...SECTIONS.flatMap((s) => [
              `      <PanelBox title="${s.title}">`,
              `        ${indent(objectField(s.name, `${s.name}Fields`), '        ')}`,
              '      </PanelBox>',
            ]),
            '      <Button type="submit">Save profile</Button>',
            '    </FieldGroup>',
            '  </form>',
            '</Form>',
          ].join('\n'),
        }),
      },
    },
  },
  argTypes: FORM_ARG_TYPES,
  args: { size: 'md', labelPosition: 'top', onSubmit: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **A profile a person edits about themselves** — from `fixtures/forms/profile.json`. A photo
 * (`FileDrop`, images up to 2 MB), then three sections: who they are (names, gender, pronouns,
 * about me), how they sign in and are reached (username, email, website), and place and language
 * (location, time zone, language, public profile). One `useForm`, one Save; the photo's file name
 * rides along in the saved object, written under the form.
 */
export const Profile: Story = {
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Profile' }));
    await step('Write an about-me and pick a photo', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'About me' }), 'I model graphs.');
      const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(input, new File(['x'], 'ravi.png', { type: 'image/png' }));
    });
    await step('Save: one object comes back, the photo named in it', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Save profile' }));
      const d = spec.defaultValues;
      await expect(args.onSubmit).toHaveBeenCalledWith({
        ...d,
        about: { ...d.about, bio: 'I model graphs.' },
        photo: 'ravi.png',
      });
    });
  },
};
