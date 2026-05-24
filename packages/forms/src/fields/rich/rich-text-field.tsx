import * as React from 'react';
import { Bold, Italic, List, Underline as UnderlineIcon } from 'lucide-react';
import { Button, cn } from '@invana/ui';
import { FormField } from '../../components';
import type { FieldComponentProps, RichTextFieldSchema } from '../../types';
import { FieldShell, getFieldName } from '../_shared';

/**
 * Minimal rich-text field built on contentEditable. Good enough for v1 and
 * keeps the package zero-extra-deps for rich text. Swap in tiptap/lexical
 * later by registering a custom 'rich-text' renderer.
 */
export function RichTextField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<RichTextFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);
  const editorRef = React.useRef<HTMLDivElement | null>(null);

  const exec = (cmd: string) => {
    document.execCommand(cmd, false);
    editorRef.current?.focus();
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => {
        return (
          <FieldShell field={field} layout={layout} error={fieldState.error}>
            <div
              className={cn(
                'rounded-md border border-input bg-background',
                field.disabled && 'pointer-events-none opacity-50'
              )}
            >
              <div className="flex items-center gap-1 border-b px-2 py-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => exec('bold')}
                >
                  <Bold className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => exec('italic')}
                >
                  <Italic className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => exec('underline')}
                >
                  <UnderlineIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => exec('insertUnorderedList')}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div
                ref={editorRef}
                contentEditable={!field.disabled}
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-placeholder={field.placeholder}
                onBlur={(e) => rhf.onChange(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: (rhf.value as string) ?? '' }}
                className="min-h-[6rem] px-3 py-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-5"
              />
            </div>
          </FieldShell>
        );
      }}
    />
  );
}
