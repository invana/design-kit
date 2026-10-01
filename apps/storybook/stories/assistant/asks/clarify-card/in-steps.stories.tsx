import type { ComponentProps, FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
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
import { ClarifyCard } from '@invana/assistant';

type Args = ComponentProps<typeof ClarifyCard> & {
  /** Called with the answers, keyed by item name. Shown in the Actions panel. */
  onAnswers: (answers: Record<string, string | string[]>) => void;
};

const meta: Meta<Args> = {
  title: 'Assistant/Asks/ClarifyCard',
  component: ClarifyCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<Args>;

const environments = [
  { value: 'semi-arid', label: 'Semi-arid, under 400 mm', detail: '3 sites' },
  { value: 'rainfed', label: 'Rainfed, 400–700 mm', detail: '2 sites' },
  { value: 'irrigated', label: 'Irrigated', detail: '1 site' },
];

const traits = [
  { value: 'rust', label: 'Rust ≥ 6' },
  { value: 'maturity', label: 'Maturity ≤ 115 d' },
  { value: 'pod', label: 'Pod ≥ 28 mm' },
];

/** Every value of every item, so a multiple choice comes back as a list. */
function answersOf(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  return Object.fromEntries(
    [...new Set(data.keys())].map((name) => {
      const all = data.getAll(name).map(String);
      return [name, all.length > 1 ? all : all[0]];
    }),
  );
}

/**
 * Three related asks sent as one request: a single choice, a number with its
 * unit, then a multiple choice. Skip, Next and Previous move between them;
 * Submit on the last sends the answers (see the Actions panel).
 */
export const InSteps: Story = {
  args: { step: 'scope', onAnswers: fn() },
  render: ({ onAnswers, ...args }) => (
    <ClarifyCard {...args}>
      <Questionnaire onSubmit={(event) => onAnswers(answersOf(event))}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="environment" required>
          <QuestionnaireTitle>Which environment is the new line for?</QuestionnaireTitle>
          <QuestionnaireChoices>
            {environments.map((o) => (
              <QuestionnaireChoice key={o.value} value={o.value} detail={o.detail} defaultChecked={o.value === 'semi-arid'}>
                <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem name="yieldFloor">
          <QuestionnaireTitle>What yield must the line keep?</QuestionnaireTitle>
          <QuestionnaireInput type="number" unit="kg/ha" defaultValue="2200" aria-label="Yield floor" />
        </QuestionnaireItem>
        <QuestionnaireItem name="mustKeep" multiple>
          <QuestionnaireTitle>Which traits must it keep?</QuestionnaireTitle>
          <QuestionnaireChoices>
            {traits.map((o) => (
              <QuestionnaireChoice key={o.value} value={o.value} defaultChecked={o.value !== 'pod'}>
                <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </ClarifyCard>
  ),
};
