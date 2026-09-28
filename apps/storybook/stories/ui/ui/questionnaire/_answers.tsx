import * as React from 'react';
import { PropertyList, PropertyRow } from '@invana/ui';

/**
 * Collects a questionnaire's submission so a story can show what the form
 * handed back. A multiple-choice item repeats its name, so every value is read
 * with `getAll`.
 */
export function useAnswers() {
  const [answers, setAnswers] = React.useState<[string, string][] | null>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const names = [...new Set(data.keys())];
    setAnswers(
      names.map((name) => [
        name,
        data
          .getAll(name)
          .map(String)
          .filter(Boolean)
          .join(', ') || '—',
      ]),
    );
  };

  return { answers, onSubmit };
}

export function Answers({ answers }: { answers: [string, string][] | null }) {
  if (!answers) return null;
  return (
    <PropertyList>
      {answers.map(([name, value]) => (
        <PropertyRow key={name} label={name}>
          {value}
        </PropertyRow>
      ))}
    </PropertyList>
  );
}
