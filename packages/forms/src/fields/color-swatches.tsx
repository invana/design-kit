'use client';
import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@invana/ui';
import type { ColorPreset } from '../types';

interface ColorSwatchesProps {
  value?: string;
  onChange?: (value: string) => void;
  presetColors?: ColorPreset[];
  defaultValue?: string;
}

const DEFAULT_PRESETS: ColorPreset[] = [
  { label: 'Black', value: 'rgb(0, 0, 0)', darkValue: 'rgb(255, 255, 255)' },
  { label: 'Red', value: 'rgb(239, 68, 68)' },
  { label: 'Blue', value: 'rgb(59, 130, 246)' },
];

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
  defaultValue = 'rgb(0, 0, 0)',
}) => {
  const [customColor, setCustomColor] = React.useState(value || defaultValue);
  const [isCustom, setIsCustom] = React.useState(false);

  React.useEffect(() => {
    if (!value) return;
    const isPreset = presetColors.some((c) => c.value === value);
    setIsCustom(!isPreset);
    if (!isPreset) setCustomColor(value);
  }, [value, presetColors]);

  const select = (newColor: string, custom = false) => {
    setIsCustom(custom);
    if (custom) setCustomColor(newColor);
    onChange?.(newColor);
  };

  return (
    <div className="flex gap-2">
      {presetColors.map((color) => (
        <button
          key={color.label}
          type="button"
          onClick={() => select(color.value)}
          className={cn(
            'group relative h-8 w-8 overflow-hidden rounded-md border',
            'ring-offset-background transition-all hover:scale-105',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            !isCustom && value === color.value && 'ring-2 ring-ring ring-offset-2'
          )}
        >
          <div className="h-full w-full" style={{ backgroundColor: color.value }} />
          {!isCustom && value === color.value && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
          <span className="sr-only">Select {color.label}</span>
        </button>
      ))}
      <div
        className={cn(
          'group relative h-8 w-8 overflow-hidden rounded-md border',
          'ring-offset-background transition-all hover:scale-105',
          isCustom && 'ring-2 ring-ring ring-offset-2'
        )}
      >
        <input
          type="color"
          value={customColor}
          onChange={(e) => select(e.target.value, true)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="h-full w-full" style={{ backgroundColor: customColor }} />
        {isCustom && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        <span className="sr-only">Custom color</span>
      </div>
    </div>
  );
};
