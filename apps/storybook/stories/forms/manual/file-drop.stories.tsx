import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FileDrop } from '@invana/forms';
import { PropertyList, PropertyRow } from '@invana/ui';

interface Args {
  onFiles: (names: string[]) => void;
}

const meta = {
  title: 'Forms/Manual/FileDrop',
  parameters: { layout: 'padded' },
  args: { onFiles: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The Upload step: CSV, JSON or JSON Lines, up to 1 MB each, and the files it took listed under it. */
function UploadDemo({ onFiles }: Args) {
  const [taken, setTaken] = React.useState<File[]>([]);
  return (
    <div className="flex w-[480px] flex-col gap-3">
      <FileDrop
        accept=".csv,.json,.jsonl"
        multiple
        maxBytes={1024 * 1024}
        onFiles={(files) => {
          setTaken(files);
          onFiles(files.map((f) => f.name));
        }}
      />
      {taken.length ? (
        <PropertyList labelWidth="auto">
          {taken.map((f) => (
            <PropertyRow key={f.name} label={f.name}>
              {f.size} bytes
            </PropertyRow>
          ))}
        </PropertyList>
      ) : null}
    </div>
  );
}

/**
 * An upload drop area: drop files on it or click it to pick them. `accept` and `maxBytes` are
 * checked on a drop too (a drop ignores `<input accept>`); a refused file is named under the
 * area with why, and only the files that pass reach `onFiles`. `multiple` takes more than one.
 */
export const FileDropStory: Story = {
  name: 'FileDrop',
  render: (args) => <UploadDemo {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await step('A file that passes reaches onFiles', async () => {
      await userEvent.upload(input, new File(['iata,city\nLHR,London'], 'airports.csv', { type: 'text/csv' }));
      await expect(args.onFiles).toHaveBeenCalledWith(['airports.csv']);
      await expect(canvas.getByText('airports.csv')).toBeInTheDocument();
    });
    await step('One that is too large is refused and named', async () => {
      const big = new File([new Uint8Array(2 * 1024 * 1024)], 'huge.csv', { type: 'text/csv' });
      await userEvent.upload(input, big);
      await expect(canvas.getByRole('alert')).toHaveTextContent('huge.csv');
    });
  },
};
