'use client';
import * as React from 'react';
import { Input } from '../components/input';

interface IconInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Minimal icon picker — text input + preview swatch. Acts as a placeholder
 * until a real icon picker (e.g. lucide search) is added.
 */
export const IconInput: React.FC<IconInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted text-sm">
        {value ? value.slice(0, 2) : '–'}
      </div>
      <Input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="icon name"
        className="h-8 text-sm"
      />
    </div>
  );
};
