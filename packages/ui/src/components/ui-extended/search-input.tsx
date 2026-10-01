import { cn } from '../../lib/utils';
import React from 'react';

/**
 * The control scale: `sm` (26px) is the application field — a search box
 * docked in a panel header or a table toolbar; `default` (32px) a standalone
 * form; `lg` (40px) a page. Size is height only: every size reads at the root,
 * the size of the rows being searched.
 *
 * Named `inputSize` for the same reason `Input` is: `size` is already an
 * `<input>` attribute meaning "how many characters wide".
 */
export type SearchInputSize = 'sm' | 'default' | 'lg';

export interface SearchInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'size' | 'type'> {
  className?: string;
  value: string;
  /** Receives the raw string, not the event — a search box has one value. */
  onChange: (value: string) => void;
  inputSize?: SearchInputSize;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  className,
  inputSize = 'default',
  placeholder = 'Search...',
  ...props
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'flex w-full rounded-control border border-input bg-background ring-offset-background',
        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'py-0 text-base',
        inputSize === 'sm' ? 'h-control-sm px-2' : inputSize === 'lg' ? 'h-control-lg px-3' : 'h-control-md px-2.5',
        className,
      )}
      {...props}
    />
  );
};
