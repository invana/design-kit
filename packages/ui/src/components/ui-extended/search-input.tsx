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
  /** Sits on the box around the field — its width, its place in a row. */
  className?: string;
  value: string;
  /** Receives the raw string, not the event — a search box has one value. */
  onChange: (value: string) => void;
  inputSize?: SearchInputSize;
  /**
   * A clear button at the end of the field while it holds text, and Escape
   * clears it too; both send `onChange("")`. On by default.
   */
  clearable?: boolean;
  /** The clear button's glyph — yours, at 14px. Default: a plain cross. */
  clearIcon?: React.ReactNode;
  /** The clear button's accessible name. */
  clearLabel?: string;
}

const Cross = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  className,
  inputSize = 'default',
  placeholder = 'Search...',
  clearable = true,
  clearIcon,
  clearLabel = 'Clear search',
  onKeyDown,
  ...props
}) => {
  const field = React.useRef<HTMLInputElement>(null);
  const clearing = clearable && value !== '';
  const clear = () => {
    onChange('');
    field.current?.focus();
  };

  return (
    <div className={cn('relative w-full', className)}>
      <input
        ref={field}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (clearable && e.key === 'Escape' && value !== '') {
            e.preventDefault();
            clear();
          }
          onKeyDown?.(e);
        }}
        placeholder={placeholder}
        className={cn(
          'flex w-full rounded-control border border-input bg-background ring-offset-background',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'py-0 text-base',
          inputSize === 'sm' ? 'h-control-sm px-2' : inputSize === 'lg' ? 'h-control-lg px-3' : 'h-control-md px-2.5',
          // Room for the clear button, so text never runs under it.
          clearing && 'pe-7',
        )}
        {...props}
      />
      {clearing ? (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={clear}
          disabled={props.disabled}
          className={cn(
            'absolute inset-y-0 end-1 my-auto flex size-control-xs items-center justify-center rounded-control',
            'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          )}
        >
          {clearIcon ?? <Cross />}
        </button>
      ) : null}
    </div>
  );
};
