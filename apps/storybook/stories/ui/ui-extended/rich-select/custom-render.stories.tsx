import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RichSelect, Avatar, AvatarFallback } from '@invana/ui';

const meta: Meta<typeof RichSelect> = {
  title: 'UI/UI Extended/RichSelect',
  component: RichSelect,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PEOPLE = [
  { value: 'ravi', name: 'Ravi Merugu', role: 'Maintainer', initials: 'RM', color: 'bg-emerald-500' },
  { value: 'aria', name: 'Aria Chen', role: 'Designer', initials: 'AC', color: 'bg-violet-500' },
  { value: 'kofi', name: 'Kofi Mensah', role: 'Engineer', initials: 'KM', color: 'bg-amber-500' },
];

/**
 * `renderOption` + `renderValue` escape hatches: each row is a bespoke
 * avatar + name + role card, and the trigger renders the picked person the
 * same way instead of a plain label.
 */
export const CustomRender: Story = {
  render: () => {
    const [value, setValue] = useState<string>('ravi');
    const personFor = (v: string) => PEOPLE.find((p) => p.value === v);
    return (
      <div className="w-[280px]">
        <RichSelect
          label="Assignee"
          value={value}
          onChange={(v) => setValue(v as string)}
          options={PEOPLE.map((p) => ({ value: p.value, label: p.name }))}
          renderValue={(selected) => {
            const p = selected[0] && personFor(selected[0].value);
            if (!p) return 'Unassigned';
            return (
              <span className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className={`${p.color} text-[10px] text-white`}>
                    {p.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{p.name}</span>
              </span>
            );
          }}
          renderOption={(option) => {
            const p = personFor(option.value)!;
            return (
              <span className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className={`${p.color} text-xs text-white`}>
                    {p.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.role}</span>
                </span>
              </span>
            );
          }}
        />
        <p className="text-sm text-muted-foreground mt-3">Assigned to: {value}</p>
      </div>
    );
  },
};
