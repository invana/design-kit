import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Button,
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@invana/ui';
import { ClarifyCard as ClarifyCardPart, type ClarifyCardProps } from '@invana/assistant';

import data from '../../../../fixtures/assistant/clarify-card.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface Choice {
  value: string;
  label: string;
  detail?: string;
  checked?: boolean;
}

/** One ask of a request sent in steps: a single or multiple choice, or a number with its unit. */
interface Step {
  name: string;
  kind: 'single' | 'multi' | 'number';
  title: string;
  required?: boolean;
  options?: Choice[];
  unit?: string;
  default?: string;
  label?: string;
}

interface ClarifyVariant {
  caption: string;
  props: Omit<ClarifyCardProps, 'onSelect' | 'actions' | 'children'>;
  /** The buttons under the options, each sent as its id. */
  actions?: { id: string; label: string }[];
  /** Several asks sent as one request, a step at a time. */
  steps?: Step[];
}

// JSON widens `"answered"` to `string`; the shapes are the card's own.
const VARIANTS = data as unknown as ClarifyVariant[];

type Answers = Record<string, string | string[]>;

interface Args {
  variant: string;
  onSelect: (value: string) => void;
  onAction: (id: string) => void;
  onAnswers: (answers: Answers) => void;
}

/** Every value of every item, so a multiple choice comes back as a list. */
function answersOf(event: React.FormEvent<HTMLFormElement>): Answers {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  return Object.fromEntries(
    [...new Set(form.keys())].map((name) => {
      const all = form.getAll(name).map(String);
      return [name, all.length > 1 ? all : all[0]];
    }),
  );
}

/** The steps as the questionnaire a consumer composes inside the card. */
function Steps({ steps, onAnswers }: { steps: Step[]; onAnswers: (answers: Answers) => void }) {
  return (
    <Questionnaire onSubmit={(event) => onAnswers(answersOf(event))}>
      <QuestionnaireProgress />
      {steps.map((s) => (
        <QuestionnaireItem key={s.name} name={s.name} required={s.required} multiple={s.kind === 'multi'}>
          <QuestionnaireTitle>{s.title}</QuestionnaireTitle>
          {s.kind === 'number' ? (
            <QuestionnaireInput type="number" unit={s.unit} defaultValue={s.default} aria-label={s.label} />
          ) : (
            <QuestionnaireChoices>
              {s.options!.map((o) => (
                <QuestionnaireChoice key={o.value} value={o.value} detail={o.detail} defaultChecked={o.checked}>
                  <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
          )}
        </QuestionnaireItem>
      ))}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  );
}

/** A card as its consumer holds it: the picked value is the story's, and moves on a pick. */
function LiveCard({ variant, args, log }: { variant: ClarifyVariant; args: Args; log: Log }) {
  const [value, setValue] = React.useState(variant.props.value);
  const select = (v: string) => {
    args.onSelect(v);
    log('onSelect', v);
    setValue(v);
  };
  const answer = (answers: Answers) => {
    args.onAnswers(answers);
    log('onAnswers', answers);
  };
  return (
    <ClarifyCardPart
      {...variant.props}
      value={value}
      onSelect={variant.props.options && !variant.props.state ? select : undefined}
      actions={variant.actions?.map((a) => (
        <Button
          key={a.id}
          size="xs"
          onClick={() => {
            args.onAction(a.id);
            log('onClick', a.id);
          }}
        >
          {a.label}
        </Button>
      ))}
    >
      {variant.steps ? <Steps steps={variant.steps} onAnswers={answer} /> : undefined}
    </ClarifyCardPart>
  );
}

/** A prop as JSX writes it: a string in quotes, anything else as an expression. */
const attr = (k: string, v: unknown) => (typeof v === 'string' ? `${k}="${v}"` : `${k}={${json(v)}}`);

/** The steps as the JSX that composes them. */
const stepsCode = (steps: Step[]) =>
  [
    '  <Questionnaire onSubmit={(event) => onAnswers(answersOf(event))}>',
    '    <QuestionnaireProgress />',
    ...steps.flatMap((s) => [
      `    <QuestionnaireItem name="${s.name}"${s.required ? ' required' : ''}${s.kind === 'multi' ? ' multiple' : ''}>`,
      `      <QuestionnaireTitle>${s.title}</QuestionnaireTitle>`,
      ...(s.kind === 'number'
        ? [`      <QuestionnaireInput type="number" unit="${s.unit}" defaultValue="${s.default}" aria-label="${s.label}" />`]
        : [
            '      <QuestionnaireChoices>',
            ...s.options!.map(
              (o) =>
                `        <QuestionnaireChoice value="${o.value}"${o.detail ? ` detail="${o.detail}"` : ''}${o.checked ? ' defaultChecked' : ''}>\n          <QuestionnaireChoiceTitle>${o.label}</QuestionnaireChoiceTitle>\n        </QuestionnaireChoice>`,
            ),
            '      </QuestionnaireChoices>',
          ]),
      '    </QuestionnaireItem>',
    ]),
    '    <QuestionnaireActions>',
    '      <QuestionnairePrevious />',
    '      <QuestionnaireSkip />',
    '      <QuestionnaireNext />',
    '      <QuestionnaireSubmit />',
    '    </QuestionnaireActions>',
    '  </Questionnaire>',
  ].join('\n');

const meta = {
  title: 'Assistant/Components/ClarifyCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { useState } from 'react';",
              "import { ClarifyCard } from '@invana/assistant';",
              "import { Button, Questionnaire, QuestionnaireItem, … } from '@invana/ui';",
            ],
            picked.map((v) => {
              const { options, value, ...rest } = v.props;
              const live = options && !v.props.state;
              const attrs = [
                ...Object.entries(rest).map(([k, x]) => attr(k, x)),
                ...(options ? ['options={options}'] : []),
                ...(live ? ['value={value}', 'onSelect={setValue}'] : value ? [attr('value', value)] : []),
                ...(v.actions
                  ? [`actions={${v.actions.map((a) => `<Button size="xs" onClick={() => onAction("${a.id}")}>${a.label}</Button>`).join('')}}`]
                  : []),
              ];
              const open = `<ClarifyCard\n${attrs.map((a) => `  ${a}`).join('\n')}\n>`;
              return {
                comment: v.caption,
                data: options ? { options } : undefined,
                setup: live
                  ? `// onSelect receives the picked option's value.\nconst [value, setValue] = useState(${JSON.stringify(value)});`
                  : v.steps
                    ? '// Submit sends every answer, keyed by item name: { environment: "semi-arid", yieldFloor: "2200", mustKeep: ["rust", "maturity"] }.\nconst onAnswers = (answers) => api.send(answers);'
                    : undefined,
                call: v.steps ? `${open}\n${stepsCode(v.steps)}\n</ClarifyCard>` : open.replace(/\n>$/, '\n/>'),
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn(), onAction: fn(), onAnswers: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A question the analysis is parked on — parked, not failed: answering resumes *this* thinking.
 * Settled, the header says so and the choice stays drawn with the options not taken; `time` says
 * when. Several related asks go as one request, in steps: Skip, Next and Previous move between
 * them, and Submit on the last sends the answers.
 */
export const ClarifyCard: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <LiveCard variant={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    await step('Pick a measure: the choice moves to it', async () => {
      const c = cell('Default');
      await userEvent.click(c.getByText('Price against the 20-day average'));
      await expect(args.onSelect).toHaveBeenCalledWith('price');
      await expect(c.getByRole('radio', { name: /Price against/ })).toBeChecked();
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"price"');
    });
    await step('Walk the steps and submit the answers', async () => {
      const c = cell('In steps');
      await userEvent.click(c.getByRole('button', { name: 'Next' }));
      await userEvent.click(c.getByRole('button', { name: 'Next' }));
      await userEvent.click(c.getByRole('button', { name: 'Submit' }));
      await expect(args.onAnswers).toHaveBeenCalledWith({
        environment: 'semi-arid',
        yieldFloor: '2200',
        mustKeep: ['rust', 'maturity'],
      });
    });
  },
};
