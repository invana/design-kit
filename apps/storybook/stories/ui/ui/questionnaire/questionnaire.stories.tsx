import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  PropertyList,
  PropertyRow,
  Questionnaire as QuestionnaireRoot,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@invana/ui';

import data from '../../../../fixtures/ui/questionnaire.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface Choice {
  value: string;
  label: string;
  description?: string;
}

interface Question {
  name: string;
  required: boolean;
  multiple?: boolean;
  prompt: string;
  description?: string;
  freeform?: { label: string; placeholder: string };
  choices: Choice[];
}

type Action = 'previous' | 'skip' | 'next' | 'submit';

interface QuestionnaireVariant extends Variant {
  shortcuts?: 'letters' | 'numbers';
  progress?: boolean;
  actions: Action[];
  items: Question[];
}

const VARIANTS = data as QuestionnaireVariant[];

/** What a submission hands back: every item's answers, by name — a multiple choice repeats its name. */
type Answers = Record<string, string[]>;

interface Args {
  variant: string;
  onItemChange: (item: string) => void;
  onSubmit: (answers: Answers) => void;
}

const ACTIONS: Record<Action, React.ReactNode> = {
  previous: <QuestionnairePrevious />,
  skip: <QuestionnaireSkip />,
  next: <QuestionnaireNext />,
  submit: <QuestionnaireSubmit />,
};

const ACTION_TAGS: Record<Action, string> = {
  previous: 'QuestionnairePrevious',
  skip: 'QuestionnaireSkip',
  next: 'QuestionnaireNext',
  submit: 'QuestionnaireSubmit',
};

/** Reads a submitted form into `{ name: [values] }`. */
function answersOf(form: HTMLFormElement): Answers {
  const data = new FormData(form);
  return Object.fromEntries(
    [...new Set(data.keys())].map((name) => [name, data.getAll(name).map(String).filter(Boolean)]),
  );
}

const meta = {
  title: 'UI/UI/Questionnaire',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              `import { Questionnaire, QuestionnaireActions, QuestionnaireChoice, QuestionnaireChoiceDescription, QuestionnaireChoiceTitle, QuestionnaireChoices, QuestionnaireDescription, QuestionnaireError, QuestionnaireInput, QuestionnaireItem, QuestionnaireNext, QuestionnairePrevious, QuestionnaireProgress, QuestionnaireSkip, QuestionnaireSubmit, QuestionnaireTitle } from '@invana/ui';`,
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { items: v.items },
              setup: [
                `const [item, setItem] = React.useState(${JSON.stringify(v.items[0].name)});`,
                '// Called with the name of the item it moves to, e.g. "cadence".',
                'const onItemChange = (next: string) => setItem(next);',
                '// The form submits; read every answer by name, e.g. { "source": ["warehouse"], "cadence": ["daily"] }.',
                'const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {',
                '  event.preventDefault();',
                '  const data = new FormData(event.currentTarget);',
                '  save(Object.fromEntries([...new Set(data.keys())].map((name) => [name, data.getAll(name)])));',
                '};',
              ].join('\n'),
              call: [
                `<Questionnaire items={items} item={item} onItemChange={onItemChange} onSubmit={onSubmit}${v.shortcuts ? ` shortcuts="${v.shortcuts}"` : ''}>`,
                v.progress ? '  <QuestionnaireProgress />' : null,
                '  {items.map((q) => (',
                `    <QuestionnaireItem key={q.name} name={q.name} required={q.required}${v.items.some((q) => q.multiple) ? ' multiple={q.multiple}' : ''}>`,
                '      <QuestionnaireTitle>{q.prompt}</QuestionnaireTitle>',
                '      <QuestionnaireDescription>{q.description}</QuestionnaireDescription>',
                '      <QuestionnaireChoices>',
                '        {q.choices.map((c) => (',
                '          <QuestionnaireChoice key={c.value} value={c.value}>',
                '            <QuestionnaireChoiceTitle>{c.label}</QuestionnaireChoiceTitle>',
                v.items.some((q) => q.choices.some((c) => c.description))
                  ? '            {c.description ? <QuestionnaireChoiceDescription>{c.description}</QuestionnaireChoiceDescription> : null}'
                  : null,
                '          </QuestionnaireChoice>',
                '        ))}',
                v.items.some((q) => q.freeform)
                  ? '        {q.freeform ? <QuestionnaireInput aria-label={q.freeform.label} placeholder={q.freeform.placeholder} /> : null}'
                  : null,
                '      </QuestionnaireChoices>',
                '      <QuestionnaireError />',
                '    </QuestionnaireItem>',
                '  ))}',
                '  <QuestionnaireActions>',
                ...v.actions.map((a) => `    <${ACTION_TAGS[a]} />`),
                '  </QuestionnaireActions>',
                '</Questionnaire>',
              ]
                .filter(Boolean)
                .join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onItemChange: fn(), onSubmit: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The questionnaire, controlled: the current item is the story's state; a submission is read and shown. */
function LiveQuestionnaire({
  v,
  onItemChange,
  onSubmit,
  log,
}: {
  v: QuestionnaireVariant;
  onItemChange: Args['onItemChange'];
  onSubmit: Args['onSubmit'];
  log: Log;
}) {
  const [item, setItem] = React.useState(v.items[0].name);
  const [answers, setAnswers] = React.useState<Answers | null>(null);
  const change = (next: string) => {
    setItem(next);
    onItemChange(next);
    log('onItemChange', next);
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const a = answersOf(event.currentTarget);
    setAnswers(a);
    onSubmit(a);
    log('onSubmit', a);
  };
  return (
    <>
      <QuestionnaireRoot items={v.items} item={item} onItemChange={change} shortcuts={v.shortcuts} onSubmit={submit}>
        {v.progress ? <QuestionnaireProgress /> : null}
        {v.items.map((q) => (
          <QuestionnaireItem key={q.name} name={q.name} required={q.required} multiple={q.multiple}>
            <QuestionnaireTitle>{q.prompt}</QuestionnaireTitle>
            {q.description ? <QuestionnaireDescription>{q.description}</QuestionnaireDescription> : null}
            <QuestionnaireChoices>
              {q.choices.map((c) => (
                <QuestionnaireChoice key={c.value} value={c.value}>
                  <QuestionnaireChoiceTitle>{c.label}</QuestionnaireChoiceTitle>
                  {c.description ? <QuestionnaireChoiceDescription>{c.description}</QuestionnaireChoiceDescription> : null}
                </QuestionnaireChoice>
              ))}
              {q.freeform ? <QuestionnaireInput aria-label={q.freeform.label} placeholder={q.freeform.placeholder} /> : null}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          {v.actions.map((a) => (
            <React.Fragment key={a}>{ACTIONS[a]}</React.Fragment>
          ))}
        </QuestionnaireActions>
      </QuestionnaireRoot>
      {answers ? (
        <PropertyList>
          {Object.entries(answers).map(([name, values]) => (
            <PropertyRow key={name} label={name}>
              {values.join(', ') || '—'}
            </PropertyRow>
          ))}
        </PropertyList>
      ) : null}
    </>
  );
}

/**
 * One question at a time — single or multiple choice, a freeform answer, skippable items,
 * letter shortcuts — from `fixtures/ui/questionnaire.json`. The current item is controlled:
 * Next, Previous and Skip send `onItemChange` with the item's name; Submit hands back every
 * answer by name, which the story lists under the form.
 */
export const Questionnaire: Story = {
  render: ({ variant, onItemChange, onSubmit }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveQuestionnaire v={v} onItemChange={onItemChange} onSubmit={onSubmit} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Answer the first question and move on', async () => {
      await userEvent.click(cell.getByRole('radio', { name: /Warehouse/ }));
      await userEvent.click(cell.getByRole('button', { name: 'Next' }));
      await expect(args.onItemChange).toHaveBeenCalledWith('cadence');
    });
    await step('Answer the second and submit', async () => {
      await userEvent.click(await cell.findByRole('radio', { name: /Daily/ }));
      await userEvent.click(cell.getByRole('button', { name: 'Submit' }));
      await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith({ source: ['warehouse'], cadence: ['daily'] }));
    });
    await step('The answers are listed under the form', async () => {
      await expect(cell.getByText('warehouse')).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"cadence": ["daily"]');
    });
  },
};
