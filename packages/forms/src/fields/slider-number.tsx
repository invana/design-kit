'use client';
import * as React from 'react';
import { cn } from '@invana/ui';
import { Input } from '../components/input';
import { Slider } from '../components/slider';

interface SliderNumberProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export const SliderNumber: React.FC<SliderNumberProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
}) => {
  const [local, setLocal] = React.useState<number>(value);
  // A new `value` from the parent replaces the local one — adjusted while
  // rendering, not in an effect, so the stale number never paints.
  const [seen, setSeen] = React.useState(value);
  if (value !== seen) {
    setSeen(value);
    setLocal(value);
  }

  const set = (n: number) => {
    setLocal(n);
    onChange?.(n);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Slider
        value={[local]}
        onValueChange={([n]: number[]) => set(n)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="flex-1"
      />
      <Input
        type="number"
        value={local}
        onChange={(e) => set(Number(e.target.value))}
        className="h-8 w-16"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
    </div>
  );
};
